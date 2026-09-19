/**
 * Global API Client Utility
 * Safely handles fetch requests, JSON parsing, and standardizes error responses.
 */

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async fetch(endpoint: string, options: ApiOptions = {}) {
    const { params, ...customConfig } = options;

    let url = endpoint.startsWith('http') ? endpoint : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    // Ensure /api prefix is correct if endpoint already has it
    if (endpoint.startsWith('/api')) {
       url = endpoint;
    }

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      ...(customConfig.headers as Record<string, string> || {}),
    };

    // Default to JSON if body is provided and Content-Type isn't set
    if (customConfig.body && typeof customConfig.body === 'string' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...customConfig,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        let errorData;
        if (isJson) {
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: 'حدث خطأ غير متوقع. حاول مرة أخرى.' }; // Fallback Arabic error
          }
        } else {
          // E.g., 500 Internal Server Error in plain text
          errorData = { message: 'حدث خطأ في الخادم. حاول مرة أخرى.' }; 
        }

        throw new ApiError(response.status, errorData.message || 'API Error', errorData);
      }

      if (response.status === 204) {
        return null; // No content
      }

      if (isJson) {
        return await response.json();
      }

      return await response.text();
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Network errors (e.g. CORS, offline)
      throw new ApiError(0, 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.', { originalError: error.message });
    }
  },

  get(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch(endpoint: string, body?: any, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(endpoint: string, options?: Omit<ApiOptions, 'method'>) {
    return this.fetch(endpoint, { ...options, method: 'DELETE' });
  },
};
