/** Exact WEBAPP API paths — see Symfony routes & security.yaml */
export const API_ROUTES = {
  login: '/api/login',
  register: '/api/register',
  me: '/api/me',
  authGoogle: '/api/auth/google',
  verifyEmail: (token: string) => `/api/verify-email/${token}`,

  clientProfile: '/api/client/profile',
  clientServices: '/api/client/services',
  clientServiceBySlug: (slug: string) => `/api/client/services/${slug}`,

  clientOrders: '/api/client/orders',
  clientOrder: (id: number) => `/api/client/orders/${id}`,
  clientOrderCancel: (id: number) => `/api/client/orders/${id}/cancel`,
  clientOrderFromService: '/api/client/orders/from-service',

  clientContact: '/api/client/contact',

  messages: '/api/messages',
} as const;
