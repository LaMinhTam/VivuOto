export const ENDPOINTS = {
  LOGIN: "/auth/signin",
  LOGOUT: "/auth/logout",
  SIGN_UP: "/auth/signup",
  REFRESH_TOKEN: "/auth/refresh",
  VERIFY_EMAIL: "/auth/verify",
  VERIFY_PHONE: "/auth/update-phone",
  SUBSCRIBE_DEVICE: (token: string) =>
    `/notifications/subscribe-device?deviceToken=${token}`,
  GET_NOTIFICATIONS: "/notifications",
  MAKE_AS_READ: (id: string) => `/notifications/${id}/markAsRead`,
  FORGOT_PASSWORD: `/auth/forgot-password`,
  RESET_PASSWORD: `/auth/reset-password`,
};

export const NotificationParams = {
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortDir: "desc",
};
