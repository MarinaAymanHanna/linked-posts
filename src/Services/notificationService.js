import apiClient from "./apiClient";

export async function getNotifications(params = {}) {
  const { data } = await apiClient.get("/notifications", {
    params: {
      unread: params.unread ?? false,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });
  return data;
}

export async function getUnreadNotificationsCount() {
  const { data } = await apiClient.get("/notifications/unread-count");
  return data;
}

export async function markNotificationAsRead(notificationId) {
  const { data } = await apiClient.patch(`/notifications/${notificationId}/read`);
  return data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await apiClient.patch("/notifications/read-all");
  return data;
}
