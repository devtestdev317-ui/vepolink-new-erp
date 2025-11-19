// src/utils/apiClient.ts
const API_BASE_URL = 'http://localhost:3001/api';

async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  let accessToken = localStorage.getItem('accessToken');

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers
    },
    credentials: 'include'
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If token expired, try refreshing
  if (response.status === 403) {
    try {
      accessToken = await refreshAccessToken();
      
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      };

      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (error) {
      // Refresh failed, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw error;
    }
  }

  return response.json();
}
