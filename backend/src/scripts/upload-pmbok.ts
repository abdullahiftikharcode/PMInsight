import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface PMBOKSectionData {
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

async function uploadPMBOKSections() {
  try {
    console.log('🚀 Starting PMBOK Guide sections upload...');

    // Read the PMBOK sections JSON file
    const pmbokPath = path.join(process.cwd(), '..', 'GUIDE TO THE PROJECT MANAGEMENT BODY OF KNOWLEDGE (PMBOK® GUIDE).json');
    const sectionsData: PMBOKSectionData[] = JSON.parse(fs.readFileSync(pmbokPath, 'utf8'));
    
    console.log(`📊 Found ${sectionsData.length} PMBOK Guide sections to process`);

    // Create or update the PMBOK standard
    const pmbokStandard = await prisma.standard.upsert({
      where: { title: 'Guide to the Project Management Body of Knowledge (PMBOK® Guide)' },
      update: {
        type: 'PMI',
        version: '7th Edition',
        description: 'The PMBOK® Guide provides guidelines for managing individual projects and defines project management related concepts'
      },
      create: {
        title: 'Guide to the Project Management Body of Knowledge (PMBOK® Guide)',
        type: 'PMI',
        version: '7th Edition',
        description: 'The PMBOK® Guide provides guidelines for managing individual projects and defines project management related concepts'
      }
    });

    console.log(`✅ PMBOK Standard created/updated: ${pmbokStandard.title} (ID: ${pmbokStandard.id})`);

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
            standardId: pmbokStandard.id,
            number: chapterData.number
          }
        },
        update: {
          title: chapterData.title
        },
        create: {
          standardId: pmbokStandard.id,
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
              standardId: pmbokStandard.id,
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
            anchorId: `pmbok-${sectionData.section_number.replace(/\./g, '-')}`
          },
          create: {
            standardId: pmbokStandard.id,
            chapterId: chapterId,
            sectionNumber: sectionData.section_number,
            title: sectionData.title,
            fullTitle: sectionData.full_title,
            content: sectionData.content,
            wordCount: sectionData.word_count,
            sentenceCount: sectionData.sentence_count,
            anchorId: `pmbok-${sectionData.section_number.replace(/\./g, '-')}`
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
    
    const pmbokChapters = await prisma.chapter.findMany({
      where: { standardId: pmbokStandard.id },
      orderBy: { number: 'asc' },
      include: {
        sections: {
          orderBy: { sectionNumber: 'asc' },
          select: { sectionNumber: true, title: true }
        }
      }
    });

    console.log(`\n📚 ${pmbokStandard.title}:`);
    for (const chapter of pmbokChapters) {
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
      where: { standardId: pmbokStandard.id }
    });
    
    const totalWords = await prisma.section.aggregate({
      where: { standardId: pmbokStandard.id },
      _sum: { wordCount: true }
    });

    console.log(`\n📊 Final Statistics:`);
    console.log(`📄 Total sections in database: ${totalSections}`);
    console.log(`📝 Total words: ${totalWords._sum.wordCount || 0}`);

    // Show section range
    const firstSection = await prisma.section.findFirst({
      where: { standardId: pmbokStandard.id },
      orderBy: { sectionNumber: 'asc' },
      select: { sectionNumber: true, title: true }
    });

    const lastSection = await prisma.section.findFirst({
      where: { standardId: pmbokStandard.id },
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
  uploadPMBOKSections()
    .then(() => {
      console.log('✅ PMBOK Guide upload script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ PMBOK Guide upload script failed:', error);
      process.exit(1);
    });
}

export { uploadPMBOKSections };