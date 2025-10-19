import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Standard {
  id: number;
  title: string;
  _count: {
    sections: number;
  };
}

export interface StandardDetail extends Standard {
  sections: Section[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalSections: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Section {
  id: number;
  sectionNumber: string;
  title: string;
  content: string;
  anchorId: string;
}


export interface SearchResult {
  id: number;
  sectionNumber: string;
  title: string;
  content: string;
  anchorId: string;
  standardId: number;
  similarity: number;
}

export interface ComparisonTopic {
  id: number;
  name: string;
  description: string;
  keywords: string[];
}

export interface ComparisonResponse {
  topic: ComparisonTopic;
  comparisonData: {
    overallSummary: string;
    standards: Array<{
      standardTitle: string;
      summary: string;
      aiSummary?: string;
      relevantSections: Array<{
        sectionTitle: string;
        sectionId: number;
        anchorId: string;
        sectionNumber: string;
        relevanceScore: number;
      }>;
    }>;
    keySimilarities: string[];
    keyDifferences: string[];
    uniqueInsights?: string[];
  };
  generatedAt: string;
}

export interface Phase {
  name: string;
  description: string;
  duration: string;
  activities: Activity[];
}

export interface Activity {
  name: string;
  description: string;
  deliverables: string[];
  duration: string;
  roles: string[];
  citations?: Citation[];
}

export interface Citation {
  standard: string;
  section: string;
  title: string;
  justification: string;
  confidence?: number;
  sectionId?: string;
}

export interface GeneratedProcessResponse {
  summary: string;
  phases: Phase[];
  generatedAt: string;
  projectName: string;
  scenario: string;
  evidence: {
    totalCitations: number;
    standardsCoverage: {
      PMBOK: number;
      PRINCE2: number;
      ISO21500: number;
      ISO21502: number;
    };
    confidenceScore: number;
    qualityMetrics: {
      completeness: number;
      accuracy: number;
      relevance: number;
    };
  };
  tailoring: {
    rationale: string;
    decisions: string[];
    omitted: string[];
  };
}

export interface TopicGraphNode {
  id: string;
  type: 'topic' | 'section' | 'standard';
  label: string;
  size?: number;
  meta?: any;
}

export interface TopicGraphEdge {
  source: string;
  target: string;
  weight?: number;
  kind: 'topic-section' | 'section-standard';
}

export interface TopicGraphResponse {
  nodes: TopicGraphNode[];
  edges: TopicGraphEdge[];
  metadata: {
    topics: { topic: string; coverage: number }[];
    counts: { nodes: number; edges: number };
  };
}

// API functions
export const apiService = {
  // Get all standards
  getStandards: async (): Promise<Standard[]> => {
    const response = await api.get('/standards');
    return response.data;
  },

  // Get standard details with sections
  getStandard: async (id: number, page: number = 1, limit: number = 10): Promise<StandardDetail> => {
    const response = await api.get(`/standards/${id}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search within a standard
  searchStandard: async (standardId: number, query: string): Promise<{ query: string; results: SearchResult[]; totalFound: number; standard: any }> => {
    const response = await api.post(`/standards/${standardId}/search`, { query });
    return response.data;
  },

  // Semantic search within a standard
  searchStandardSemantic: async (standardId: number, query: string, limit: number = 10): Promise<{ query: string; results: any[]; totalFound: number; standardId: number; searchType: string }> => {
    const response = await api.post(`/standards/${standardId}/search/semantic`, { query, limit });
    return response.data;
  },


  // Global search across all standards
  searchAll: async (query: string, standardId?: number, type?: string, limit: number = 20): Promise<{ query: string; totalResults: number; results: any[]; searchMetadata: any }> => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    if (standardId) params.append('standardId', standardId.toString());
    if (type) params.append('type', type);
    
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  // Semantic search using vector embeddings
  semanticSearch: async (query: string, limit: number = 20): Promise<{ query: string; totalResults: number; results: any[]; searchType: string; searchMetadata: any }> => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const response = await api.get(`/search/semantic?${params.toString()}`);
    return response.data;
  },

  // Get insights about all standards
  getInsights: async (): Promise<{ standards: any[]; totalStandards: number; totalSections: number; totalChapters: number; totalWords: number; averageWordsPerSection: number; topicCoverage: any[]; generatedAt: string }> => {
    const response = await api.get('/insights');
    return response.data;
  },

  // Get section details
  getSection: async (id: string): Promise<{ id: number; sectionNumber: string; title: string; fullTitle: string; content: string; anchorId: string; wordCount: number; sentenceCount: number; chapter: any; standard: any }> => {
    const response = await api.get(`/sections/${id}`);
    return response.data;
  },

  // Get adjacent sections for navigation
  getAdjacentSections: async (id: string): Promise<{ current: any; prev: any; next: any; totalSections: number; currentPosition: number }> => {
    const response = await api.get(`/sections/${id}/adjacent`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Comparison engine methods
  // Get comparison topics
  getComparisonTopics: async (): Promise<ComparisonTopic[]> => {
    const response = await api.get('/comparison/topics');
    return response.data;
  },

  // Get comparison for specific topic (deprecated - now using getComparisonByTopic for consistency)
  getComparison: async (topicId: number): Promise<ComparisonResponse> => {
    const response = await api.get(`/comparison/topics/${topicId}`);
    return response.data;
  },

  // Get comparison for a custom topic
  getComparisonByTopic: async (topic: string): Promise<ComparisonResponse> => {
    console.log('🔍 API: getComparisonByTopic called with topic:', topic);
    console.log('📡 Making POST request to /api/compare with body:', { topic });
    const response = await api.post('/compare', { topic });
    console.log('✅ API: getComparisonByTopic response received:', response.data);
    return response.data;
  },

  // Generate tailored process
  generateProcess: async (payload: {
    projectName?: string;
    scenarioId: string;
    lifecycle: 'predictive' | 'agile' | 'hybrid';
    constraints: string[];
    drivers: string[];
  }): Promise<GeneratedProcessResponse> => {
    const response = await api.post('/process/generate', payload);
    return response.data;
  },

  // Topic graph for visualization
  getGraph: async (params?: { topicLimit?: number; sectionsPerTopic?: number }): Promise<TopicGraphResponse> => {
    const sp = new URLSearchParams();
    if (params?.topicLimit) sp.set('topicLimit', String(params.topicLimit));
    if (params?.sectionsPerTopic) sp.set('sectionsPerTopic', String(params.sectionsPerTopic));
    const qs = sp.toString();
    const response = await api.get(`/graph${qs ? `?${qs}` : ''}`);
    return response.data;
  },

  // Phase 2B: Enhanced Process Generation API
  // Get available process templates
  getProcessTemplates: async (): Promise<any[]> => {
    const response = await api.get('/process/templates');
    return response.data;
  },

  // Get specific template
  getProcessTemplate: async (scenarioId: string): Promise<any> => {
    const response = await api.get(`/process/templates/${scenarioId}`);
    return response.data;
  },

  // Generate scenario-specific process
  generateProcessForScenario: async (scenarioId: string, inputs: {
    projectName: string;
    lifecycle: 'predictive' | 'agile' | 'hybrid';
    constraints: string[];
    drivers: string[];
    teamSize?: string;
    duration?: string;
    budget?: string;
    riskTolerance?: 'low' | 'medium' | 'high';
  }): Promise<GeneratedProcessResponse> => {
    const response = await api.post(`/process/generate/scenario/${scenarioId}`, inputs);
    return response.data;
  },

  // Validate process quality
  validateProcess: async (phases: Phase[], scenario?: string): Promise<{
    isValid: boolean;
    issues: Array<{
      type: string;
      phase: string;
      activity: string;
      severity: 'low' | 'medium' | 'high';
      message: string;
      recommendation: string;
    }>;
    recommendations: string[];
    qualityScore: number;
  }> => {
    const response = await api.post('/process/validate', { phases, scenario });
    return response.data;
  },

  // Compare processes across scenarios
  compareProcesses: async (scenarioIds: string[]): Promise<{
    scenarios: string[];
    phases: any[];
    similarities: string[];
    differences: string[];
    recommendations: string[];
  }> => {
    const response = await api.post('/process/compare', { scenarioIds });
    return response.data;
  },

  // Export process in various formats
  exportProcess: async (process: any, format: 'json' | 'csv' | 'pdf'): Promise<string> => {
    const response = await api.post(`/process/export/${format}`, { process }, {
      responseType: 'text'
    });
    return response.data;
  },

  // Get process generation statistics
  getProcessStatistics: async (): Promise<{
    totalTemplates: number;
    scenarios: Array<{
      id: string;
      name: string;
      lifecycle: string;
      duration: string;
      teamSize: string;
    }>;
    standardsCoverage: {
      PMBOK: number;
      PRINCE2: number;
      ISO: number;
    };
  }> => {
    const response = await api.get('/process/statistics');
    return response.data;
  },
};

export default api;
