import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assessment API calls
export const assessmentService = {
  // Submit assessment answers
  submitAssessment: async (answers) => {
    try {
      const response = await api.post('/api/assessments', { answers });
      return response.data;
    } catch (error) {
      console.error('Assessment submission error:', error);
      throw error;
    }
  },

  // Get assessment by session ID
  getAssessment: async (sessionId) => {
    try {
      const response = await api.get(`/api/assessments/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Get assessment error:', error);
      throw error;
    }
  },
};

// Disorders API calls
export const disorderService = {
  // Get all disorders
  getAllDisorders: async () => {
    try {
      const response = await api.get('/api/disorders');
      return response.data;
    } catch (error) {
      console.error('Get disorders error:', error);
      throw error;
    }
  },

  // Search disorders by name
  searchDisorders: async (name) => {
    try {
      const response = await api.get(`/api/disorders/search/${name}`);
      return response.data;
    } catch (error) {
      console.error('Search disorders error:', error);
      throw error;
    }
  },

  // Get single disorder by ID
  getDisorderById: async (id) => {
    try {
      const response = await api.get(`/api/disorders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get disorder error:', error);
      throw error;
    }
  },
};

// Questions API calls
export const questionService = {
  // Get all assessment questions
  getQuestions: async () => {
    try {
      const response = await api.get('/api/questions');
      return response.data;
    } catch (error) {
      console.error('Get questions error:', error);
      throw error;
    }
  },
};

// Health check
export const healthService = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },
};

export default api;