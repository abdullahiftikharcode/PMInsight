import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

// Configuration
const BATCH_SIZE = 10; // Process sections in batches to avoid rate limits
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Keep input text within reasonable limits for embedding model
function buildInput(title: string, content: string): string {
  const maxChars = 4000; // Adjust based on model limits
  const combined = `${title}\n\n${content}`;
  return combined.length > maxChars ? combined.slice(0, maxChars) : combined;
}

// Sleep utility for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry wrapper for API calls
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

// Generate embedding for a single section
async function generateEmbedding(text: string): Promise<number[]> {
  const result = await embedModel.embedContent(text);
  return result.embedding.values;
}

// Process a single section
async function processSection(section: { id: number; title: string; content: string }): Promise<void> {
  try {
    const inputText = buildInput(section.title, section.content);
    const embedding = await withRetry(() => generateEmbedding(inputText));
    
    // Store embedding using raw SQL to handle pgvector properly
    await prisma.$executeRawUnsafe(
      'UPDATE "Section" SET embedding = $1 WHERE id = $2',
      embedding,
      section.id
    );
    
    console.log(`✅ Embedded section ${section.id}: ${section.title.substring(0, 50)}...`);
  } catch (error) {
    console.error(`❌ Failed to embed section ${section.id}:`, error);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting embeddings computation...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY environment variable is required');
    process.exit(1);
  }

  try {
    // Get all sections that don't have embeddings yet (raw SQL to avoid Prisma schema constraints)
    const sectionsWithoutEmbeddings = await prisma.$queryRawUnsafe<Array<{ id: number; title: string; content: string }>>(
      'SELECT id, title, content FROM "Section" WHERE embedding IS NULL ORDER BY id ASC'
    );

    console.log(`📊 Found ${sectionsWithoutEmbeddings.length} sections without embeddings`);

    if (sectionsWithoutEmbeddings.length === 0) {
      console.log('✅ All sections already have embeddings!');
      return;
    }

    // Process sections in batches
    let processed = 0;
    let failed = 0;

    for (let i = 0; i < sectionsWithoutEmbeddings.length; i += BATCH_SIZE) {
      const batch = sectionsWithoutEmbeddings.slice(i, i + BATCH_SIZE);
      console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sectionsWithoutEmbeddings.length / BATCH_SIZE)}`);
      console.log(`   Sections ${i + 1}-${Math.min(i + BATCH_SIZE, sectionsWithoutEmbeddings.length)}`);

      // Process batch with parallel execution (but limited concurrency)
      const batchPromises = batch.map(async (section) => {
        try {
          await processSection(section);
          processed++;
        } catch (error) {
          console.error(`Failed to process section ${section.id}:`, error);
          failed++;
        }
      });

      await Promise.all(batchPromises);

      // Rate limiting between batches
      if (i + BATCH_SIZE < sectionsWithoutEmbeddings.length) {
        console.log('⏳ Waiting before next batch...');
        await sleep(1000); // 1 second between batches
      }
    }

    console.log('\n🎉 Embeddings computation completed!');
    console.log(`✅ Successfully processed: ${processed} sections`);
    if (failed > 0) {
      console.log(`❌ Failed: ${failed} sections`);
    }

    // Verify the results (raw SQL to avoid Prisma schema constraints)
    const verify = await prisma.$queryRawUnsafe<Array<{ count: string }>>(
      'SELECT COUNT(*)::text as count FROM "Section" WHERE embedding IS NOT NULL'
    );
    const totalWithEmbeddings = Number(verify?.[0]?.count || 0);

    console.log(`📈 Total sections with embeddings: ${totalWithEmbeddings}`);

  } catch (error) {
    console.error('❌ Error during embeddings computation:', error);
    process.exit(1);
  }
}

// Cleanup and error handling
main()
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  });
