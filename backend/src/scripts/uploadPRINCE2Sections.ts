import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface PRINCE2SectionData {
  id: number;
  section_number: string;
  title: string;
  full_title: string;
  chapter: string;
  main_chapter: string;
  content: string;
  word_count: number;
  sentence_count: number;
  created_at: string;
}

async function uploadPRINCE2Sections() {
  try {
    console.log('🚀 Starting PRINCE2 sections upload...');

    // Read the PRINCE2 sections JSON file
    const prince2Path = path.join(process.cwd(), '..', 'prince2.json');
    const sectionsData: PRINCE2SectionData[] = JSON.parse(fs.readFileSync(prince2Path, 'utf8'));
    
    console.log(`📊 Found ${sectionsData.length} PRINCE2 sections to process`);

    // Create or update the PRINCE2 standard
    const prince2Standard = await prisma.standard.upsert({
      where: { title: 'Managing Successful Projects with PRINCE2' },
      update: {
        type: 'PRINCE2',
        version: '7th Edition',
        description: 'PRINCE2 is a structured project management method and practitioner certification programme'
      },
      create: {
        title: 'Managing Successful Projects with PRINCE2',
        type: 'PRINCE2',
        version: '7th Edition',
        description: 'PRINCE2 is a structured project management method and practitioner certification programme'
      }
    });

    console.log(`✅ PRINCE2 Standard created/updated: ${prince2Standard.title} (ID: ${prince2Standard.id})`);

    // Extract unique chapters from the sections data
    const chapters = new Map<string, { title: string; number: string }>();
    
    for (const section of sectionsData) {
      const chapterTitle = section.chapter;
      const chapterNumber = section.section_number.split('.')[0];
      
      const chapterKey = chapterTitle;
      if (!chapters.has(chapterKey)) {
        chapters.set(chapterKey, {
          title: chapterTitle,
          number: chapterNumber
        });
      }
    }

    console.log(`📚 Found ${chapters.size} unique chapters`);

    // Sort chapters by number for proper ordering
    const sortedChapters = Array.from(chapters.entries()).sort((a, b) => {
      const numA = parseInt(a[1].number) || 0;
      const numB = parseInt(b[1].number) || 0;
      return numA - numB;
    });

    console.log('📋 Chapter order:', sortedChapters.map(([key, data]) => `${data.number}. ${data.title}`));

    // Create chapters in proper order
    const chapterMap = new Map<string, number>();
    for (const [chapterKey, chapterData] of sortedChapters) {
      const chapter = await prisma.chapter.upsert({
        where: {
          standardId_number: {
            standardId: prince2Standard.id,
            number: chapterData.number
          }
        },
        update: {
          title: chapterData.title
        },
        create: {
          standardId: prince2Standard.id,
          number: chapterData.number,
          title: chapterData.title
        }
      });
      chapterMap.set(chapterKey, chapter.id);
      console.log(`📖 Chapter created/updated: ${chapter.title} (ID: ${chapter.id})`);
    }

    console.log('📋 Chapter mapping:', Array.from(chapterMap.entries()).map(([name, id]) => `${name} -> ID: ${id}`));

    // Process sections in order
    console.log(`📄 Processing ${sectionsData.length} sections in order...`);

    let successCount = 0;
    let errorCount = 0;

    for (const sectionData of sectionsData) {
      try {
        // Get the chapter ID for this section
        const chapterId = chapterMap.get(sectionData.chapter);

        if (!chapterId) {
          console.error(`❌ No chapter found for section ${sectionData.section_number}: ${sectionData.chapter}`);
          errorCount++;
          continue;
        }

        // Create or update the section
        await prisma.section.upsert({
          where: {
            standardId_sectionNumber: {
              standardId: prince2Standard.id,
              sectionNumber: sectionData.section_number
            }
          },
          update: {
            title: sectionData.title,
            fullTitle: sectionData.full_title,
            content: sectionData.content,
            wordCount: sectionData.word_count,
            sentenceCount: sectionData.sentence_count,
            chapterId: chapterId,
            anchorId: `prince2-${sectionData.section_number.replace(/\./g, '-')}`
          },
          create: {
            standardId: prince2Standard.id,
            chapterId: chapterId,
            sectionNumber: sectionData.section_number,
            title: sectionData.title,
            fullTitle: sectionData.full_title,
            content: sectionData.content,
            wordCount: sectionData.word_count,
            sentenceCount: sectionData.sentence_count,
            anchorId: `prince2-${sectionData.section_number.replace(/\./g, '-')}`
          }
        });

        successCount++;
        if (successCount % 10 === 0 || successCount <= 20) {
          console.log(`✅ Processed ${successCount} sections... (${sectionData.section_number}: ${sectionData.title})`);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing section ${sectionData.section_number}:`, error);
      }
    }

    console.log(`\n🎉 Upload completed!`);
    console.log(`✅ Successfully processed: ${successCount} sections`);
    console.log(`❌ Errors: ${errorCount} sections`);
    console.log(`📚 Total chapters: ${chapters.size}`);

    // Display chapters and sections in order
    console.log(`\n📋 Chapter and Section Summary:`);
    
    const prince2Chapters = await prisma.chapter.findMany({
      where: { standardId: prince2Standard.id },
      orderBy: { number: 'asc' },
      include: {
        sections: {
          orderBy: { sectionNumber: 'asc' },
          select: { sectionNumber: true, title: true }
        }
      }
    });

    console.log(`\n📚 ${prince2Standard.title}:`);
    for (const chapter of prince2Chapters) {
      console.log(`\n📖 Chapter ${chapter.number}: ${chapter.title}`);
      console.log(`   📄 Sections: ${chapter.sections.length}`);
      chapter.sections.slice(0, 5).forEach((section: { sectionNumber: string; title: string }) => {
        console.log(`      ${section.sectionNumber}: ${section.title}`);
      });
      if (chapter.sections.length > 5) {
        console.log(`      ... and ${chapter.sections.length - 5} more sections`);
      }
    }

    // Display some statistics
    const totalSections = await prisma.section.count({
      where: { standardId: prince2Standard.id }
    });
    
    const totalWords = await prisma.section.aggregate({
      where: { standardId: prince2Standard.id },
      _sum: { wordCount: true }
    });

    console.log(`\n📊 Final Statistics:`);
    console.log(`📄 Total sections in database: ${totalSections}`);
    console.log(`📝 Total words: ${totalWords._sum.wordCount || 0}`);

    // Show section range
    const firstSection = await prisma.section.findFirst({
      where: { standardId: prince2Standard.id },
      orderBy: { sectionNumber: 'asc' },
      select: { sectionNumber: true, title: true }
    });

    const lastSection = await prisma.section.findFirst({
      where: { standardId: prince2Standard.id },
      orderBy: { sectionNumber: 'desc' },
      select: { sectionNumber: true, title: true }
    });

    console.log(`📋 Section range: ${firstSection?.sectionNumber} to ${lastSection?.sectionNumber}`);

  } catch (error) {
    console.error('❌ Fatal error during upload:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload if this script is executed directly
if (require.main === module) {
  uploadPRINCE2Sections()
    .then(() => {
      console.log('✅ PRINCE2 upload script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ PRINCE2 upload script failed:', error);
      process.exit(1);
    });
}

export { uploadPRINCE2Sections };
