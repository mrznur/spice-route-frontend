
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie
    ? decodeURIComponent(cookie.substring(name.length + 1))
    : null;
}

async function ensureCsrfToken(): Promise<string> {
  let token = getCookie('XSRF-TOKEN');

  if (token) {
    return token;
  }

  const response = await axios.get<{ token: string }>(
    `${BASE_URL}/api/auth/csrf`,
    {
      withCredentials: true,
    }
  );

  token = getCookie('XSRF-TOKEN') || response.data.token;

  if (!token) {
    throw new Error('Unable to obtain CSRF token.');
  }

  return token;
}

// Attach CSRF token to requests that change server data.
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = (config.method || 'get').toLowerCase();
    const requiresCsrf = !['get', 'head', 'options'].includes(method);

    if (requiresCsrf && typeof window !== 'undefined') {
      const csrfToken = await ensureCsrfToken();

      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
  }
);

// Handle expired access tokens by refreshing the HttpOnly cookie.
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';

    // Do not attempt another refresh for authentication endpoints.
    const isAuthRequest = /\/api\/auth\//.test(requestUrl);

    if (
      error.response?.status !== 401 ||
      isAuthRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // The browser sends the HttpOnly refresh cookie automatically.
      await api.post('/api/auth/refresh');

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');

        import('sonner').then(({ toast }) => {
          toast.error('Your session has expired. Please sign in again.');
        });

        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
