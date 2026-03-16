let _accessToken: string | null = null;

export const tokenService = {
  setToken: (token: string) => {
    _accessToken = token;
  },
  getToken: () => _accessToken,
  clearToken: () => {
    _accessToken = null;
  },
};
