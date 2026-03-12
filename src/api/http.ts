import axios from 'axios';
import {
  TodoRequest,
  Todo,
  TodoInfo,
  MetaResponse,
  FilterStatus,
  UserRegistration,
  AuthData,
  Token,
  RefreshToken,
  Profile,
  ProfileRequest,
  PasswordRequest,
} from '../types/types.ts';

const securedRoutes = [
  '/user/profile',
  '/user/profile/reset-password',
  '/user/logout',
  '/auth/refresh',
];

let isRefreshing = false;
let queueFailedResponses: { resolve: (value: unknown) => void; reject: () => void }[] = [];

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (request) => {
  const { accessToken } = await getTokenFromCookie();
  accessToken && (request.headers.Authorization = `Bearer ${accessToken}`);
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const isAxiosError = axios.isAxiosError(error);
    const isUnauthorizedError = error.response?.status === 401;
    const isSecuredRoute =
      isAxiosError &&
      securedRoutes.some((url) => {
        return error.config?.url?.includes(url);
      });
    const errorConfig = error?.config;
    if (!isAxiosError || !errorConfig || !isUnauthorizedError || !isSecuredRoute) {
      return Promise.reject(error);
    }

    if (errorConfig.url.includes('/auth/refresh')) {
      window.location.href = '/login';
    }
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueFailedResponses.push({ resolve, reject });
      })
        .then(() => {
          return api.request(errorConfig);
        })
        .catch(() => {
          return Promise.reject(error);
        });
    }
    const { refreshToken } = await getTokenFromCookie();
    if (!refreshToken) {
      return Promise.reject(error);
    }
    try {
      isRefreshing = true;
      const newToken = await updateToken({ refreshToken });
      await setTokenToCookie(newToken);
      queueFailedResponses.forEach(({ resolve }) => resolve(null));
      queueFailedResponses = [];
      isRefreshing = false;
      return api.request(errorConfig);
    } catch {
      queueFailedResponses.forEach(({ reject }) => reject());
      queueFailedResponses = [];
      window.location.href = '/login';
    }
  }
);

export async function setTokenToCookie(token: Token) {
  await Promise.all([
    cookieStore.set({ name: 'accessToken', value: token.accessToken }),
    cookieStore.set({ name: 'refreshToken', value: token.refreshToken }),
  ]);
}

export async function getTokenFromCookie(): Promise<Partial<Token>> {
  const [accessTokenCookie, refreshTokenCookie] = await Promise.all([
    cookieStore.get('accessToken'),
    cookieStore.get('refreshToken'),
  ]);

  return {
    accessToken: accessTokenCookie?.value,
    refreshToken: refreshTokenCookie?.value,
  };
}

export async function addTodo(title: string): Promise<Todo> {
  const response = await api.post<Todo>('/todos', { title });
  return response.data;
}

export async function getTodoList(filter: FilterStatus): Promise<MetaResponse<Todo, TodoInfo>> {
  const response = await api.get<MetaResponse<Todo, TodoInfo>>('/todos', {
    params: { filter },
  });
  return response.data;
}

export async function editTodo(id: number, todoRequest: TodoRequest): Promise<Todo> {
  const response = await api.put<Todo>(`/todos/${id}`, todoRequest);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function registerUser(registerPayload: UserRegistration): Promise<void> {
  await api.post('/auth/signup', registerPayload);
}

export async function loginUser(loginPayload: AuthData): Promise<Token> {
  const response = await api.post('/auth/signin', loginPayload);
  return response.data;
}

export async function updateToken(refreshToken: RefreshToken): Promise<Token> {
  const response = await api.post('/auth/refresh', refreshToken);
  return response.data;
}

export async function getUserProfile(): Promise<Profile> {
  const response = await api.get('/user/profile');
  return response.data;
}

export async function updateProfile(profilePayload: ProfileRequest): Promise<Profile> {
  const response = await api.put('/user/profile', profilePayload);
  return response.data;
}

export async function changePassword(passwordPayload: PasswordRequest): Promise<void> {
  await api.put('/user/profile/reset-password', passwordPayload);
}

export async function logout(): Promise<void> {
  await api.post('/user/logout');
}
