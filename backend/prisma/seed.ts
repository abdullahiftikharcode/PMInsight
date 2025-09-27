import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Standards
  const pmbok7 = await prisma.standard.upsert({
    where: { title: 'PMBOK 7' },
    update: {},
    create: {
      title: 'PMBOK 7',
    },
  });

  const prince2 = await prisma.standard.upsert({
    where: { title: 'PRINCE2' },
    update: {},
    create: {
      title: 'PRINCE2',
    },
  });

  const iso21502 = await prisma.standard.upsert({
    where: { title: 'ISO 21502' },
    update: {},
    create: {
      title: 'ISO 21502',
    },
  });

  console.log('✅ Standards created');

  // Create PMBOK 7 sections
  const pmbokSections = [
    {
      sectionNumber: '2.1',
      title: 'Stakeholder Performance Domain',
      content: `The Stakeholder Performance Domain focuses on identifying, analyzing, and engaging stakeholders throughout the project lifecycle. This domain emphasizes the importance of understanding stakeholder needs, expectations, and influence on project outcomes. Effective stakeholder engagement requires continuous communication, relationship building, and managing stakeholder expectations to ensure project success. The domain covers stakeholder identification, analysis, engagement planning, and ongoing relationship management.`,
      anchorId: 'pmbok7-2-1'
    },
    {
      sectionNumber: '2.8',
      title: 'Uncertainty Performance Domain',
      content: `The Uncertainty Performance Domain addresses how projects navigate uncertainty and complexity. This domain recognizes that projects operate in environments with varying degrees of uncertainty and provides guidance on identifying, assessing, and responding to uncertainty. It covers risk management, opportunity identification, and adaptive approaches to project delivery. The domain emphasizes the importance of building resilience and flexibility into project approaches.`,
      anchorId: 'pmbok7-2-8'
    },
    {
      sectionNumber: '3.1',
      title: 'Project Life Cycle',
      content: `The Project Life Cycle represents the series of phases that a project passes through from its initiation to its closure. PMBOK 7 recognizes that project life cycles can be predictive, iterative, incremental, or hybrid, depending on the project's characteristics and context. The life cycle provides a framework for organizing project work and managing transitions between phases. Each phase typically includes specific deliverables and decision points.`,
      anchorId: 'pmbok7-3-1'
    }
  ];

  for (const section of pmbokSections) {
    await prisma.section.upsert({
      where: { anchorId: section.anchorId },
      update: {},
      create: {
        ...section,
        standardId: pmbok7.id,
      },
    });
  }

  // Create PRINCE2 sections
  const prince2Sections = [
    {
      sectionNumber: '10',
      title: 'Risk Theme',
      content: `The Risk Theme in PRINCE2 provides a systematic approach to risk management throughout the project lifecycle. It establishes the risk management approach, identifies and assesses risks, and implements appropriate responses. The theme covers risk identification, assessment, planning, implementation, and communication. PRINCE2 emphasizes the importance of proactive risk management and the need for continuous risk monitoring and control.`,
      anchorId: 'prince2-10'
    },
    {
      sectionNumber: '5',
      title: 'Stakeholder Theme',
      content: `The Stakeholder Theme in PRINCE2 focuses on identifying, analyzing, and engaging stakeholders to ensure project success. It covers stakeholder identification, analysis, engagement planning, and ongoing relationship management. The theme emphasizes the importance of understanding stakeholder needs, expectations, and influence on project outcomes. Effective stakeholder engagement requires continuous communication and relationship building.`,
      anchorId: 'prince2-5'
    },
    {
      sectionNumber: '2',
      title: 'Starting Up a Project Process',
      content: `The Starting Up a Project process is the first process in the PRINCE2 lifecycle. It establishes the foundation for the project by creating the Project Brief and assembling the Project Board. This process ensures that there is a viable business case for the project and that the necessary resources and governance are in place. The process includes activities such as appointing the Executive and Project Manager, preparing the outline Business Case, and assembling the Project Brief.`,
      anchorId: 'prince2-2'
    }
  ];

  for (const section of prince2Sections) {
    await prisma.section.upsert({
      where: { anchorId: section.anchorId },
      update: {},
      create: {
        ...section,
        standardId: prince2.id,
      },
    });
  }

  // Create ISO 21502 sections
  const iso21502Sections = [
    {
      sectionNumber: '6.2',
      title: 'Stakeholder Management',
      content: `ISO 21502 provides guidance on stakeholder management as a key aspect of project management. It covers stakeholder identification, analysis, engagement planning, and relationship management. The standard emphasizes the importance of understanding stakeholder needs, expectations, and influence on project outcomes. Effective stakeholder management requires continuous communication, relationship building, and managing stakeholder expectations throughout the project lifecycle.`,
      anchorId: 'iso21502-6-2'
    },
    {
      sectionNumber: '6.3',
      title: 'Risk Management',
      content: `ISO 21502 addresses risk management as a systematic process for identifying, assessing, and responding to project risks. It covers risk identification, assessment, planning, implementation, and monitoring. The standard emphasizes the importance of proactive risk management and the need for continuous risk monitoring and control. Risk management should be integrated throughout the project lifecycle and aligned with organizational risk management practices.`,
      anchorId: 'iso21502-6-3'
    },
    {
      sectionNumber: '5.1',
      title: 'Project Life Cycle',
      content: `ISO 21502 defines the project life cycle as a series of phases that a project passes through from initiation to closure. The standard recognizes that project life cycles can vary depending on the project's characteristics and context. The life cycle provides a framework for organizing project work and managing transitions between phases. Each phase typically includes specific deliverables, decision points, and governance requirements.`,
      anchorId: 'iso21502-5-1'
    }
  ];

  for (const section of iso21502Sections) {
    await prisma.section.upsert({
      where: { anchorId: section.anchorId },
      update: {},
      create: {
        ...section,
        standardId: iso21502.id,
      },
    });
  }

  // Create Topics for comparison
  const topics = [
    {
      name: 'Risk Management',
      description: 'Comparison of risk management approaches across different project management standards'
    },
    {
      name: 'Stakeholder Engagement',
      description: 'Analysis of stakeholder management practices and methodologies'
    },
    {
      name: 'Project Lifecycle',
      description: 'Comparison of project lifecycle approaches and phase management'
    }
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { name: topic.name },
      update: {},
      create: topic,
    });
  }

  console.log('✅ Topics created');
  console.log('✅ All sections created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
