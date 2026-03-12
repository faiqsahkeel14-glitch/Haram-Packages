// API utility for making authenticated requests

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<ApiResponse<T>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  } as any;

  // Add authorization header if token exists
  if (requiresAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
      return {
        success: false,
        message: data.message || 'API request failed',
        error: data.error,
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function loginUser(username: string, password: string) {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }, false);
}

export async function verifyToken() {
  return apiCall('/api/auth/verify', {
    method: 'GET',
  });
}

export async function getPackages() {
  return apiCall('/api/packages', {
    method: 'GET',
  });
}

export async function createPackage(packageData: {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}) {
  return apiCall('/api/packages', {
    method: 'POST',
    body: JSON.stringify(packageData),
  });
}

export async function getUserProfile() {
  return apiCall('/api/users', {
    method: 'GET',
  });
}
