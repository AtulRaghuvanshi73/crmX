import { BACKEND_SERVER_URL } from './env';

/**
 * API client for making consistent fetch requests to the backend
 */
export const apiClient = {
  /**
   * Make a GET request to the backend
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BACKEND_SERVER_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Make a POST request to the backend
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${BACKEND_SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Make a DELETE request to the backend
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BACKEND_SERVER_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
