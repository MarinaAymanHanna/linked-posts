import apiClient from "./apiClient";

export async function getUserProfile(userId) {
  const { data } = await apiClient.get(`/users/${userId}/profile`);
  return data;
}

export async function followUnfollowUser(userId) {
  const { data } = await apiClient.put(`/users/${userId}/follow`);
  return data;
}

export async function getUserPosts(userId, page = 1, limit = 20) {
  const { data } = await apiClient.get(`/users/${userId}/posts`, {
    params: { page, limit },
  });
  return data;
}

export async function getFollowSuggestions(limit = 10) {
  const { data } = await apiClient.get("/users/suggestions", {
    params: { limit },
  });
  return data;
}

export async function getBookmarks(page = 1, limit = 20) {
  const { data } = await apiClient.get("/users/bookmarks", {
    params: { page, limit },
  });
  return data;
}
