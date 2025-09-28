import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  searchStandard: async (standardId: number, query: string): Promise<any> => {
    const response = await api.post(`/standards/${standardId}/search`, { query });
    return response.data;
  },


  // Global search across all standards
  searchAll: async (query: string, standardId?: number, type?: string, limit: number = 20): Promise<any> => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    if (standardId) params.append('standardId', standardId.toString());
    if (type) params.append('type', type);
    
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  // Get insights about all standards
  getInsights: async (): Promise<any> => {
    const response = await api.get('/insights');
    return response.data;
  },

  // Get section details
  getSection: async (id: string): Promise<any> => {
    const response = await api.get(`/sections/${id}`);
    return response.data;
  },

  // Get adjacent sections for navigation
  getAdjacentSections: async (id: string): Promise<any> => {
    const response = await api.get(`/sections/${id}/adjacent`);
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
