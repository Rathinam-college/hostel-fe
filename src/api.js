class ApiService {
  constructor() {
    this.baseUrl = '/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      return data;
    } catch (error) {
      console.error(`API Error in ${endpoint}:`, error);
      throw error;
    }
  }

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { username, password }
    });
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // --- Hostels CRUD ---
  async getHostels() {
    return this.request('/hostels');
  }
  async registerHostel(data) {
    return this.request('/hostels', { method: 'POST', body: data });
  }
  async updateHostel(id, data) {
    return this.request(`/hostels/${id}`, { method: 'PUT', body: data });
  }
  async deleteHostel(id) {
    return this.request(`/hostels/${id}`, { method: 'DELETE' });
  }

  // --- Rooms CRUD ---
  async getRooms(hostelId = '') {
    const query = hostelId ? `?hostel_id=${hostelId}` : '';
    return this.request(`/rooms${query}`);
  }
  async registerRoom(data) {
    return this.request('/rooms', { method: 'POST', body: data });
  }
  async updateRoom(id, data) {
    return this.request(`/rooms/${id}`, { method: 'PUT', body: data });
  }
  async deleteRoom(id) {
    return this.request(`/rooms/${id}`, { method: 'DELETE' });
  }

  // --- Institutes CRUD ---
  async getInstitutes() {
    return this.request('/institutes');
  }
  async registerInstitute(data) {
    return this.request('/institutes', { method: 'POST', body: data });
  }
  async updateInstitute(id, data) {
    return this.request(`/institutes/${id}`, { method: 'PUT', body: data });
  }
  async deleteInstitute(id) {
    return this.request(`/institutes/${id}`, { method: 'DELETE' });
  }

  // --- Sharing Types CRUD ---
  async getSharingTypes() {
    return this.request('/sharing-types');
  }
  async registerSharingType(data) {
    return this.request('/sharing-types', { method: 'POST', body: data });
  }
  async updateSharingType(id, data) {
    return this.request(`/sharing-types/${id}`, { method: 'PUT', body: data });
  }
  async deleteSharingType(id) {
    return this.request(`/sharing-types/${id}`, { method: 'DELETE' });
  }

  // --- Users CRUD ---
  async getUsers() {
    return this.request('/users');
  }
  async registerUser(data) {
    return this.request('/users', { method: 'POST', body: data });
  }
  async updateUser(id, data) {
    return this.request(`/users/${id}`, { method: 'PUT', body: data });
  }
  async deleteUser(id) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // --- Residents & Allocations ---
  async getResidents(q = '', instituteId = '') {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (instituteId) params.append('institute_id', instituteId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/residents${query}`);
  }

  async registerResident(residentData) {
    return this.request('/residents', {
      method: 'POST',
      body: residentData
    });
  }

  async checkIn(checkInData) {
    return this.request('/allocations/check-in', {
      method: 'POST',
      body: checkInData
    });
  }

  async checkOut(checkOutData) {
    return this.request('/allocations/check-out', {
      method: 'POST',
      body: checkOutData
    });
  }

  async getAllocations() {
    return this.request('/allocations');
  }

  async getExitReasons() {
    return this.request('/exit-reasons');
  }

  async getOccupancySummary(hostelId = 'all', sharingTypeId = 'all', instituteId = 'all') {
    const params = new URLSearchParams();
    if (hostelId) params.append('hostel_id', hostelId);
    if (sharingTypeId) params.append('sharing_type_id', sharingTypeId);
    if (instituteId) params.append('institute_id', instituteId);
    return this.request(`/summary/occupancy?${params.toString()}`);
  }

  async getMonthlyReport() {
    return this.request('/reports/monthly');
  }
}

export const api = new ApiService();
