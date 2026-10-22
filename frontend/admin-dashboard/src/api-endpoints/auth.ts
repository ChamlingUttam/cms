export const authEndpoints = {
  login: '/api/admin/login',
  currentAdmin: '/api/admin/me',
  logout: '/api/admin/logout',
  changeFields: '/api/admin/change-fields',
} as const;
