

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  },

  // Distributed endpoints
  getDoanhThuChiNhanh: () => api.get('/api/thanh-toan/doanh-thu'),
  themThanhToan: (data) => api.post('/api/thanh-toan', data)
};

export default api;
