const API_BASE_URL = 'https://lumen-backend-lkdf.onrender.com/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  signup: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Signup failed');
    return json;
  },
  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Invalid email or password');
    return json;
  },
  me: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: { ...authHeaders() } });
    return res.json();
  },
  getCreators: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE_URL}/creators?${params}`);
    return res.json();
  },
  getCreator: async (id) => {
    const res = await fetch(`${API_BASE_URL}/creators/${id}`);
    return res.json();
  },
  updateCreator: async (data) => {
    const res = await fetch(`${API_BASE_URL}/creators/me`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data),
    });
    return res.json();
  },
  getBrands: async () => {
    const res = await fetch(`${API_BASE_URL}/brands`);
    return res.json();
  },
  getBrand: async (id) => {
    const res = await fetch(`${API_BASE_URL}/brands/${id}`);
    return res.json();
  },
  updateBrand: async (data) => {
    const res = await fetch(`${API_BASE_URL}/brands/me`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data),
    });
    return res.json();
  },
  getBriefs: async () => {
    const res = await fetch(`${API_BASE_URL}/briefs`, { headers: { ...authHeaders() } });
    return res.json();
  },
  createBrief: async (data) => {
    const res = await fetch(`${API_BASE_URL}/briefs`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data),
    });
    return res.json();
  },
  getConversations: async () => {
    const res = await fetch(`${API_BASE_URL}/conversations`, { headers: { ...authHeaders() } });
    return res.json();
  },
  getMessages: async (id) => {
    const res = await fetch(`${API_BASE_URL}/conversations/${id}/messages`, { headers: { ...authHeaders() } });
    return res.json();
  },
  sendMessage: async (id, text) => {
    const res = await fetch(`${API_BASE_URL}/conversations/${id}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ text }),
    });
    return res.json();
  },
  startConversation: async (targetId) => {
    const res = await fetch(`${API_BASE_URL}/conversations/start`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ target_id: targetId }),
    });
    return res.json();
  },
  createReview: async (data) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(data),
    });
    return res.json();
  },
  getReviews: async (type, id) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${type}/${id}`);
    return res.json();
  },
  generateBrief: async (prompt) => {
    const res = await fetch(`${API_BASE_URL}/ai/generate-brief`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ prompt }),
    });
    return res.json();
  },
  verifyProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/ai/verify-profile`, {
      method: 'POST', headers: { ...authHeaders() },
    });
    return res.json();
  },
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST', headers: { ...authHeaders() }, body: formData,
    });
    return res.json();
  },
};