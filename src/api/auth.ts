import {
  AuthData,
  PasswordRequest,
  Profile,
  ProfileRequest,
  RefreshToken,
  Token,
  UserRegistration
} from '../types/auth';
import { api } from './axios';
import { tokenService } from './tokenService';

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
  try {
    await api.post('/user/logout');
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await cookieStore.delete('refreshToken');
    tokenService.clearToken();
  }
}
