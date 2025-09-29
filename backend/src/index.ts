import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;


// 1. GET /api/standards - Returns a list of all standards
app.get('/api/standards', async (req, res) => {
  try {
    const standards = await prisma.standard.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        version: true,
        description: true,
        _count: {
          select: {
            sections: true,
            chapters: true,
          },
        },
      },
    });

    res.json(standards);
  } catch (error) {
    console.error('Error fetching standards:', error);
    res.status(500).json({ error: 'Failed to fetch standards' });
  }
});

// 1.1 GET /api/search - Advanced search across all standards
app.get('/api/search', async (req, res) => {
  try {
    const { q, standardId, type, limit = '20' } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchLimit = parseInt(limit as string);
    const searchQuery = q.toLowerCase();

    // Search across sections with content matching
    const sections = await prisma.section.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { content: { contains: searchQuery, mode: 'insensitive' } },
              { fullTitle: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          standardId ? { standardId: parseInt(standardId as string) } : {},
          type ? { standard: { type: type as string } } : {}
        ]
      },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
        fullTitle: true,
        content: true,
        wordCount: true,
        anchorId: true,
        standard: {
          select: {
            id: true,
            title: true,
            type: true,
            version: true
          }
        },
        chapter: {
          select: {
            id: true,
            title: true,
            number: true
          }
        }
      },
      take: searchLimit,
      orderBy: [
        { wordCount: 'desc' }, // Prioritize longer, more comprehensive sections
        { title: 'asc' }
      ]
    });

    // Group results by standard for better organization
    const groupedResults = sections.reduce((acc: Record<number, any>, section: any) => {
      const standardId = section.standard.id;
      if (!acc[standardId]) {
        acc[standardId] = {
          standard: section.standard,
          sections: []
        };
      }
      acc[standardId].sections.push(section);
      return acc;
    }, {} as Record<number, any>);

    const results = Object.values(groupedResults);

    res.json({
      query: searchQuery,
      totalResults: sections.length,
      results: results,
      searchMetadata: {
        searchedStandards: [...new Set(sections.map((s: any) => s.standard.id))],
        totalSections: sections.length,
        averageWordCount: sections.length > 0 ? 
          Math.round(sections.reduce((sum: number, s: any) => sum + s.wordCount, 0) / sections.length) : 0
      }
    });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 2. GET /api/standards/:id - Returns full details for a standard with pagination
app.get('/api/standards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get standard info with chapters
    const standard = await prisma.standard.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        type: true,
        version: true,
        description: true,
        chapters: {
          select: {
            id: true,
            number: true,
            title: true,
            description: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
        _count: {
          select: {
            sections: true,
            chapters: true,
          },
        },
      },
    });

    if (!standard) {
      return res.status(404).json({ error: 'Standard not found' });
    }

    // Get paginated sections with chapter info
    const sections = await prisma.section.findMany({
      where: { standardId: parseInt(id) },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
        fullTitle: true,
        content: true,
        anchorId: true,
        wordCount: true,
        sentenceCount: true,
        chapter: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
      skip,
      take: limitNum,
      orderBy: {
        sectionNumber: 'asc',
      },
    });

    const totalPages = Math.ceil(standard._count.sections / limitNum);

    res.json({
      ...standard,
      sections,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalSections: standard._count.sections,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching standard:', error);
    res.status(500).json({ error: 'Failed to fetch standard' });
  }
});

// 3. POST /api/standards/:id/search - Search within a standard (Google-like results)
app.post('/api/standards/:id/search', async (req, res) => {
  try {
    const { id } = req.params;
    const { query, limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log(`Searching for "${query}" in standard ${id}`);

    // Get sections with chapter information for better context
    const allSections = await prisma.section.findMany({
      where: {
        standardId: parseInt(id)
      },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
        fullTitle: true,
        content: true,
        anchorId: true,
        wordCount: true,
        sentenceCount: true,
        chapter: {
          select: {
            number: true,
            title: true,
          },
        },
        standard: {
          select: {
            title: true,
            type: true,
            version: true,
          },
        },
      }
    });
    
    console.log(`Found ${allSections.length} total sections in standard ${id}`);
    
    // Filter sections that contain the query (case-insensitive)
    const textResults = allSections.filter((section: any) => {
      const titleMatch = section.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = section.content.toLowerCase().includes(query.toLowerCase());
      return titleMatch || contentMatch;
    });
    
    console.log(`Found ${textResults.length} sections matching query "${query}"`);

    // Create Google-like search results with snippets
    const searchResults = textResults.map((section: any) => {
      const queryLower = query.toLowerCase();
      const titleLower = section.title.toLowerCase();
      const contentLower = section.content.toLowerCase();
      
      // Calculate similarity score
      let similarity = 0;
      
      if (titleLower === queryLower) {
        similarity = 1.0;
      } else if (titleLower.includes(queryLower)) {
        similarity = 0.8;
      } else if (contentLower.includes(queryLower)) {
        similarity = 0.6;
      } else {
        const queryWords = queryLower.split(/\s+/);
        const titleWords = titleLower.split(/\s+/);
        const contentWords = contentLower.split(/\s+/);
        
        let wordMatches = 0;
        queryWords.forEach((queryWord: string) => {
          if (titleWords.some((titleWord: string) => titleWord.includes(queryWord) || queryWord.includes(titleWord))) {
            wordMatches += 0.3;
          }
          if (contentWords.some((contentWord: string) => contentWord.includes(queryWord) || queryWord.includes(contentWord))) {
            wordMatches += 0.2;
          }
        });
        
        similarity = Math.min(wordMatches, 0.5);
      }

      // Create snippet (first 200 characters with query highlighted)
      const snippetLength = 200;
      const contentStart = contentLower.indexOf(queryLower);
      let snippet = section.content;
      
      if (contentStart >= 0) {
        const start = Math.max(0, contentStart - 50);
        const end = Math.min(section.content.length, start + snippetLength);
        snippet = section.content.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < section.content.length) snippet = snippet + '...';
      } else {
        snippet = section.content.substring(0, snippetLength);
        if (section.content.length > snippetLength) snippet += '...';
      }

      // Highlight query terms in snippet
      const highlightedSnippet = snippet.replace(
        new RegExp(`(${query})`, 'gi'),
        '<mark>$1</mark>'
      );

      return {
        id: section.id,
        sectionNumber: section.sectionNumber,
        title: section.title,
        fullTitle: section.fullTitle,
        snippet: highlightedSnippet,
        chapter: section.chapter,
        standard: section.standard,
        wordCount: section.wordCount,
        sentenceCount: section.sentenceCount,
        anchorId: section.anchorId,
        similarity: Math.max(similarity, 0.1),
        url: `/section/${section.id}` // For frontend routing
      };
    });

    // Sort by similarity and limit results
    const sortedResults = searchResults
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, parseInt(limit as string) || 10);
    
    console.log(`Returning ${sortedResults.length} search results`);
    res.json({
      query,
      results: sortedResults,
      totalFound: textResults.length,
      standard: sortedResults[0]?.standard || null
    });

  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// 4. GET /api/sections/:id - Get individual section details
app.get('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
        fullTitle: true,
        content: true,
        anchorId: true,
        wordCount: true,
        sentenceCount: true,
        chapter: {
          select: {
            id: true,
            number: true,
            title: true,
            description: true,
          },
        },
        standard: {
          select: {
            id: true,
            title: true,
            type: true,
            version: true,
            description: true,
          },
        },
      },
    });

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: 'Failed to fetch section' });
  }
});



// 5. GET /api/compare - Compare specific sections across standards (without AI analysis)
app.get('/api/compare', async (req, res) => {
  try {
    const { topic, standardIds } = req.query;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic parameter is required' });
    }

    const topicQuery = topic.toLowerCase();
    const standardIdsArray = standardIds ? 
      (standardIds as string).split(',').map(id => parseInt(id)) : 
      [];

    // Find relevant sections across all or specified standards
    const sections = await prisma.section.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: topicQuery, mode: 'insensitive' } },
              { content: { contains: topicQuery, mode: 'insensitive' } },
              { fullTitle: { contains: topicQuery, mode: 'insensitive' } }
            ]
          },
          standardIdsArray.length > 0 ? { standardId: { in: standardIdsArray } } : {}
        ]
      },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
        fullTitle: true,
        content: true,
        wordCount: true,
        anchorId: true,
        standard: {
          select: {
            id: true,
            title: true,
            type: true,
            version: true
          }
        },
        chapter: {
          select: {
            id: true,
            title: true,
            number: true
          }
        }
      },
      orderBy: [
        { wordCount: 'desc' },
        { standard: { title: 'asc' } }
      ]
    });

    // Group by standard
    const groupedSections = sections.reduce((acc: Record<number, any>, section: any) => {
      const standardId = section.standard.id;
      if (!acc[standardId]) {
        acc[standardId] = {
          standard: section.standard,
          sections: []
        };
      }
      acc[standardId].sections.push(section);
      return acc;
    }, {} as Record<number, any>);

    const comparisonResults = Object.values(groupedSections);

    res.json({
      topic,
      totalSections: sections.length,
      standardsCompared: comparisonResults.length,
      results: comparisonResults,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error performing comparison:', error);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

// 6. GET /api/insights - Get overall insights about standards (without AI)
app.get('/api/insights', async (req, res) => {
  try {
    console.log('📊 Insights endpoint called');
    
    // Get statistics about all standards
    const standards = await prisma.standard.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        version: true,
        _count: {
          select: {
            sections: true,
            chapters: true
          }
        }
      }
    });

    // Get total word count across all standards
    const totalWords = await prisma.section.aggregate({
      _sum: { wordCount: true }
    });

    // Get most common topics (based on section titles)
    const allSections = await prisma.section.findMany({
      select: { title: true, content: true }
    });

    // Simple keyword extraction for insights
    const commonTopics = [
      'Risk Management', 'Stakeholder Engagement', 'Quality Management',
      'Project Planning', 'Team Management', 'Communication',
      'Change Management', 'Resource Management', 'Time Management',
      'Cost Management', 'Scope Management', 'Integration Management'
    ];

    const topicCoverage = commonTopics.map(topic => {
      const matchingSections = allSections.filter((section: any) => 
        section.title.toLowerCase().includes(topic.toLowerCase()) ||
        section.content.toLowerCase().includes(topic.toLowerCase())
      );
      return {
        topic,
        coverage: matchingSections.length,
        standards: [...new Set(matchingSections.map((s: any) => s.title))].length
      };
    }).filter(t => t.coverage > 0).sort((a: any, b: any) => b.coverage - a.coverage);

    res.json({
      standards: standards,
      totalStandards: standards.length,
      totalSections: standards.reduce((sum: number, s: any) => sum + s._count.sections, 0),
      totalChapters: standards.reduce((sum: number, s: any) => sum + s._count.chapters, 0),
      totalWords: totalWords._sum.wordCount || 0,
      averageWordsPerSection: standards.length > 0 ? 
        Math.round((totalWords._sum.wordCount || 0) / standards.reduce((sum: number, s: any) => sum + s._count.sections, 0)) : 0,
      topicCoverage: topicCoverage.slice(0, 10), // Top 10 topics
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 4. GET /api/sections/:id/adjacent - Get adjacent sections for navigation
app.get('/api/sections/:id/adjacent', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the current section
    const currentSection = await prisma.section.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        sectionNumber: true,
        standardId: true,
      },
    });

    if (!currentSection) {
      return res.status(404).json({ error: 'Section not found' });
    }

    // Get all sections from the same standard, ordered by section number
    const allSections = await prisma.section.findMany({
      where: { standardId: currentSection.standardId },
      select: {
        id: true,
        sectionNumber: true,
        title: true,
      },
      orderBy: { sectionNumber: 'asc' },
    });

    // Find current section index
    const currentIndex = allSections.findIndex((s: any) => s.id === currentSection.id);
    
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Section not found in standard' });
    }

    // Get adjacent sections
    const prev = currentIndex > 0 ? allSections[currentIndex - 1] : null;
    const next = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

    res.json({
      current: currentSection,
      prev,
      next,
      totalSections: allSections.length,
      currentPosition: currentIndex + 1,
    });
  } catch (error) {
    console.error('Error fetching adjacent sections:', error);
    res.status(500).json({ error: 'Failed to fetch adjacent sections' });
  }
});

// 7.a POST /api/process/generate - Generate tailored process with evidence links
app.post('/api/process/generate', async (req, res) => {
  try {
    const { projectName = '', scenarioId = 'it', lifecycle = 'hybrid', constraints = [], drivers = [] } = req.body || {};

    // Build seed requirements text
    const driverText = Array.isArray(drivers) ? drivers.join(', ') : String(drivers);
    const constraintText = Array.isArray(constraints) ? constraints.join(', ') : String(constraints);

    // Base phases by lifecycle
    const basePhases: Record<string, string[]> = {
      predictive: ['Initiation', 'Planning', 'Execution', 'Monitoring & Control', 'Closure'],
      agile: ['Envision', 'Backlog & Planning', 'Sprints', 'Review & Retrospective', 'Release/Close'],
      hybrid: ['Initiate', 'Plan', 'Iterate & Build', 'Control & Assure', 'Close']
    };

    // Seed activities per phase (simple heuristic)
    const activitySeeds: Record<string, string[]> = {
      Initiation: ['Define objectives', 'Identify stakeholders', 'Business case/charter'],
      Planning: ['Scope & WBS', 'Schedule baseline', 'Cost baseline', 'Risk register', 'Quality plan', 'Comms plan'],
      Execution: ['Deliver work packages', 'Manage team', 'Engage stakeholders', 'Quality assurance'],
      'Monitoring & Control': ['Performance reporting', 'Change control', 'Risk & issue management'],
      Closure: ['Transition/benefits', 'Lessons learned', 'Archive'],
      Envision: ['Vision & outcomes', 'Roadmap', 'Team formation'],
      'Backlog & Planning': ['Product backlog', 'Prioritization', 'Sprint planning'],
      Sprints: ['Build increment', 'Daily coordination', 'Quality checks'],
      'Review & Retrospective': ['Sprint review/demo', 'Retrospective improvements'],
      'Release/Close': ['Release management', 'Support handover'],
      Iterate: ['Incremental delivery'],
      'Iterate & Build': ['Incremental delivery', 'Stakeholder feedback', 'QA gates'],
      'Control & Assure': ['KPIs & reports', 'Risk/Change boards', 'Compliance checks']
    };

    const chosenPhases = basePhases[lifecycle] || basePhases.hybrid;

    // Compose a keyword set to find supporting sections in standards
    const topicKeywords = new Set<string>([
      'risk', 'stakeholder', 'quality', 'schedule', 'scope', 'cost', 'communication', 'change', 'governance', 'planning', 'agile', 'iteration', 'benefits'
    ]);
    (Array.isArray(constraints) ? constraints : String(constraints).split(/[,;]+/)).forEach(c => c && topicKeywords.add(String(c).toLowerCase()));
    (Array.isArray(drivers) ? drivers : String(drivers).split(/[,;]+/)).forEach(d => d && topicKeywords.add(String(d).toLowerCase()));

    // Fetch candidate sections once
    const allSections = await prisma.section.findMany({
      include: { standard: true }
    });

    function scoreSection(section: any): number {
      const text = `${section.title} ${section.content}`.toLowerCase();
      let score = 0;
      topicKeywords.forEach(kw => { if (kw && text.includes(kw)) score += 1; });
      return score;
    }

    const topSections = allSections
      .map((s: any): any => ({ ...s, _score: scoreSection(s) }))
      .filter((s: any) => s._score > 0)
      .sort((a: any, b: any) => b._score - a._score)
      .slice(0, 30);

    // Optional Gemini synthesis for tailored steps
    let aiStepsByPhase: Record<string, string[]> | null = null;
    if (process.env.GEMINI_API_KEY) {
      const corpusSummary = topSections.map((s: any) => `• ${s.standard.title} - ${s.sectionNumber} ${s.title}`).join('\n');
      const prompt = `Design a tailored project process for a ${scenarioId} project. Lifecycle: ${lifecycle}. Drivers: ${driverText}. Constraints: ${constraintText}.
Use concise, actionable steps grouped by phases ${JSON.stringify(chosenPhases)}. Output strict JSON { phases: { [phase]: ["step", ...] }, summary: "..." }.
Evidence context (titles only):\n${corpusSummary}`;
      try {
        const out = await model.generateContent(prompt);
        const txt = (await out.response).text();
        const match = txt.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed && parsed.phases) aiStepsByPhase = parsed.phases;
        }
      } catch (err) {
        console.warn('Gemini synthesis failed, using heuristic generator');
      }
    }

    // Build phases/activities/deliverables with citations
    const phases = chosenPhases.map((phaseName: string) => {
      const seeds = activitySeeds[phaseName] || ['Tailored activity'];
      const activityNames = aiStepsByPhase?.[phaseName] || seeds;

      const activities = activityNames.map((name: string) => {
        // map each activity to 3 top supporting sections
        const keywordsForActivity = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        const scored = topSections
          .map((s: any) => ({
            s,
            score: keywordsForActivity.reduce((acc, k) => acc + (s.content.toLowerCase().includes(k) || s.title.toLowerCase().includes(k) ? 1 : 0), 0)
          }))
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3)
          .filter((x: any) => x.score > 0)
          .map((x: any) => ({
            standardId: x.s.standardId,
            standardTitle: x.s.standard.title,
            sectionId: x.s.id,
            sectionNumber: x.s.sectionNumber,
            anchorId: x.s.anchorId,
            title: x.s.title
          }));

        return {
          name,
          deliverables: [],
          citations: scored
        };
      });

      return { name: phaseName, activities };
    });

    const summary = `Tailored process for ${projectName || 'your project'} (${scenarioId}, ${lifecycle}). Constraints: ${constraintText || 'n/a'}. Drivers: ${driverText || 'n/a'}.`;

    res.json({ summary, phases, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error generating process:', error);
    res.status(500).json({ error: 'Failed to generate process' });
  }
});

// 7. GET /api/comparison/topics - Get predefined comparison topics
app.get('/api/comparison/topics', async (req, res) => {
  try {
    const topics = [
      {
        id: 1,
        name: "Risk Management",
        description: "Compare risk management approaches across standards",
        keywords: ["risk", "threat", "opportunity", "mitigation", "assessment", "uncertainty", "probability", "impact"]
      },
      {
        id: 2,
        name: "Stakeholder Management", 
        description: "Compare stakeholder engagement strategies",
        keywords: ["stakeholder", "engagement", "communication", "expectations", "influence", "interest", "power"]
      },
      {
        id: 3,
        name: "Quality Management",
        description: "Compare quality assurance and control processes",
        keywords: ["quality", "assurance", "control", "verification", "validation", "testing", "review", "audit"]
      },
      {
        id: 4,
        name: "Project Planning",
        description: "Compare project planning methodologies",
        keywords: ["planning", "schedule", "timeline", "milestone", "deliverable", "work breakdown", "estimation"]
      },
      {
        id: 5,
        name: "Team Management",
        description: "Compare team leadership and management approaches",
        keywords: ["team", "leadership", "management", "motivation", "performance", "collaboration", "development"]
      },
      {
        id: 6,
        name: "Communication",
        description: "Compare communication strategies and practices",
        keywords: ["communication", "reporting", "meeting", "information", "documentation", "presentation"]
      }
    ];
    res.json(topics);
  } catch (error) {
    console.error('Error fetching comparison topics:', error);
    res.status(500).json({ error: 'Failed to fetch comparison topics' });
  }
});

// 8. GET /api/comparison/topics/:id - Get comparison for specific topic
app.get('/api/comparison/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const topicId = parseInt(id);
    
    // Get topic definition
    const topics: Record<number, { name: string; keywords: string[] }> = {
      1: { name: "Risk Management", keywords: ["risk", "threat", "opportunity", "mitigation", "assessment", "uncertainty"] },
      2: { name: "Stakeholder Management", keywords: ["stakeholder", "engagement", "communication", "expectations", "influence"] },
      3: { name: "Quality Management", keywords: ["quality", "assurance", "control", "verification", "validation", "testing"] },
      4: { name: "Project Planning", keywords: ["planning", "schedule", "timeline", "milestone", "deliverable", "estimation"] },
      5: { name: "Team Management", keywords: ["team", "leadership", "management", "motivation", "performance", "collaboration"] },
      6: { name: "Communication", keywords: ["communication", "reporting", "meeting", "information", "documentation"] }
    };
    
    const topic = topics[topicId];
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    // Search for relevant sections across all standards
    const relevantSections = await findRelevantSections(topic.keywords);
    
    // Generate comparison data
    const comparisonData = await generateComparisonData(relevantSections, topic);
    
    res.json({
      topic,
      comparisonData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating comparison:', error);
    res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

// Helper function to find relevant sections
async function findRelevantSections(keywords: string[]) {
  const allSections = await prisma.section.findMany({
    include: {
      standard: true,
      chapter: true
    }
  });
  
  // Simple keyword matching with scoring
  const relevantSections = allSections.filter((section: any) => {
    const searchText = `${section.title} ${section.content}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  }).map((section: any) => {
    const searchText = `${section.title} ${section.content}`.toLowerCase();
    let relevanceScore = 0;
    
    keywords.forEach(keyword => {
      if (section.title.toLowerCase().includes(keyword.toLowerCase())) {
        relevanceScore += 2; // Title matches are more important
      }
      if (section.content.toLowerCase().includes(keyword.toLowerCase())) {
        relevanceScore += 1;
      }
    });
    
    return { ...section, relevanceScore };
  }).sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
  
  return relevantSections;
}

// Generate comparison data with AI
async function generateComparisonData(sections: any[], topic: any) {
  // Group sections by standard
  const sectionsByStandard = sections.reduce((acc: any, section: any) => {
    const standardId = section.standardId;
    if (!acc[standardId]) {
      acc[standardId] = {
        standard: section.standard,
        sections: []
      };
    }
    acc[standardId].sections.push(section);
    return acc;
  }, {} as any);
  
  try {
    // Use AI to generate insights
    const insights = await generateAIInsights(sectionsByStandard, topic);
    
    // Generate summaries for each standard
    const standardsWithSummaries = await Promise.all(
      Object.values(sectionsByStandard).map(async (data: any) => ({
        standardTitle: data.standard.title,
        summary: await generateAIStandardSummary(data.sections, topic, data.standard.title),
        relevantSections: data.sections.slice(0, 5).map((s: any) => ({
          sectionTitle: s.title,
          sectionId: s.id,
          anchorId: s.anchorId,
          sectionNumber: s.sectionNumber,
          relevanceScore: s.relevanceScore
        }))
      }))
    );

    return {
      overallSummary: insights.overallSummary,
      standards: standardsWithSummaries,
      keySimilarities: insights.similarities,
      keyDifferences: insights.differences
    };
  } catch (error) {
    console.error('AI generation failed, falling back to basic analysis:', error);
    // Fallback to basic analysis if AI fails
    const insights = generateInsights(sectionsByStandard, topic);
    
    return {
      overallSummary: `Analysis of ${topic.name} across ${Object.keys(sectionsByStandard).length} standards. This comparison highlights how different project management standards approach ${topic.name.toLowerCase()}.`,
      standards: Object.values(sectionsByStandard).map((data: any) => ({
        standardTitle: data.standard.title,
        summary: generateStandardSummary(data.sections, topic),
        relevantSections: data.sections.slice(0, 5).map((s: any) => ({
          sectionTitle: s.title,
          sectionId: s.id,
          anchorId: s.anchorId,
          sectionNumber: s.sectionNumber,
          relevanceScore: s.relevanceScore
        }))
      })),
      keySimilarities: insights.similarities,
      keyDifferences: insights.differences
    };
  }
}

// Generate insights about similarities and differences
function generateInsights(sectionsByStandard: any, topic: any) {
  const similarities = [
    `All standards emphasize the importance of ${topic.name.toLowerCase()} in project success`,
    `Common themes include planning, monitoring, and continuous improvement`,
    `All approaches recognize the need for stakeholder involvement`,
    `Risk identification and assessment are fundamental across all standards`
  ];
  
  const differences = [
    `PMBOK focuses on knowledge areas while PRINCE2 emphasizes processes`,
    `ISO standards provide more detailed technical specifications`,
    `PRINCE2 has a stronger emphasis on business justification`,
    `Different terminology and frameworks are used across standards`
  ];
  
  return { similarities, differences };
}

// AI-powered insights generation
async function generateAIInsights(sectionsByStandard: any, topic: any) {
  const standards = Object.values(sectionsByStandard);
  const standardNames = standards.map((s: any) => s.standard.title).join(', ');
  
  const prompt = `
Analyze how different project management standards approach "${topic.name}". 

Standards being compared: ${standardNames}
Topic: ${topic.name}
Description: ${topic.description}

Based on the content from these standards, provide:
1. An overall summary (2-3 sentences) explaining how these standards approach ${topic.name.toLowerCase()}
2. 4-5 key similarities between the standards
3. 4-5 key differences between the standards

Format your response as JSON:
{
  "overallSummary": "string",
  "similarities": ["string1", "string2", "string3", "string4"],
  "differences": ["string1", "string2", "string3", "string4"]
}

Focus on practical differences in methodology, terminology, and approach. Be specific and actionable.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      overallSummary: `Analysis of ${topic.name} across ${standards.length} standards reveals different approaches to project management.`,
      similarities: [
        `All standards emphasize the importance of ${topic.name.toLowerCase()} in project success`,
        `Common themes include planning, monitoring, and continuous improvement`,
        `All approaches recognize the need for stakeholder involvement`,
        `Risk identification and assessment are fundamental across all standards`
      ],
      differences: [
        `PMBOK focuses on knowledge areas while PRINCE2 emphasizes processes`,
        `ISO standards provide more detailed technical specifications`,
        `PRINCE2 has a stronger emphasis on business justification`,
        `Different terminology and frameworks are used across standards`
      ]
    };
  } catch (error) {
    console.error('AI insights generation failed:', error);
    throw error;
  }
}

// AI-powered standard summary
async function generateAIStandardSummary(sections: any[], topic: any, standardTitle: string) {
  const sectionTitles = sections.map(s => s.title).join(', ');
  
  const prompt = `
Analyze how "${standardTitle}" approaches "${topic.name}".

Standard: ${standardTitle}
Topic: ${topic.name}
Relevant sections: ${sectionTitles}

Provide a 2-3 sentence summary explaining how this specific standard approaches ${topic.name.toLowerCase()}. 
Focus on the unique aspects, methodology, and practical approach of this standard.

Be concise and specific about what makes this standard's approach distinctive.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI standard summary generation failed:', error);
    // Fallback to basic summary
    return generateStandardSummary(sections, topic);
  }
}

// Generate summary for a specific standard (fallback)
function generateStandardSummary(sections: any[], topic: any) {
  const sectionCount = sections.length;
  const avgRelevance = sections.reduce((sum, s) => sum + s.relevanceScore, 0) / sectionCount;
  
  return `This standard covers ${topic.name.toLowerCase()} across ${sectionCount} sections with an average relevance score of ${avgRelevance.toFixed(1)}. The approach emphasizes practical implementation and real-world application.`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 Standards API: http://localhost:${PORT}/api/standards`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
