const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface ApiError {
  [key: string]: string[];
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData));
    }
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.json();
  }

  async post<T>(endpoint: string, data: any, requiresAuth: boolean = false): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    const headers: HeadersInit = {
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any, requiresAuth: boolean = false): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    const headers: HeadersInit = {
      ...(requiresAuth ? this.getAuthHeader() : {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  // Authentication methods
  async login(username: string, password: string) {
    return this.post<{ access: string; refresh: string }>('/token/', {
      username,
      password,
    });
  }

  async signup(username: string, email: string, password: string, password2: string) {
    return this.post<{ message: string }>('/register/', {
      username,
      email,
      password,
      password2,
    });
  }

  async refreshToken(refreshToken: string) {
    return this.post<{ access: string }>('/token/refresh/', {
      refresh: refreshToken,
    });
  }

  async getCurrentUser() {
    return this.get<{ id: number; username: string; email: string }>('/profile/', true);
  }

  // Token management
  storeTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getStoredTokens() {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
    };
  }

  // Lesson Notes methods
  async createLessonNote(data: {
    subject: string;
    grade_level: string;
    term: string;
    content: string;
  }) {
    return this.post<{
      id: number;
      subject: string;
      grade_level: string;
      term: string;
      content: string;
      submitted_at: string;
      status: string;
    }>('/lesson-notes/', data, true);
  }

  async requestAIFeedback(lessonNoteId: number) {
    return this.post<{
      message: string;
      lesson_note_id: number;
    }>(`/lesson-notes/${lessonNoteId}/request_ai_feedback/`, {}, true);
  }

  async getFeedback(lessonNoteId: number) {
    return this.get<Array<{
      id: number;
      reviewer: string;
      feedback_text: string;
      score: number;
      strengths: string;
      suggestions: string;
      areas_for_improvement: string;
      overall_assessment: string;
      created_at: string;
    }>>(`/lesson-notes/${lessonNoteId}/feedback/`, true);
  }
}

export const apiService = new ApiService();