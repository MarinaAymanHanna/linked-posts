import apiClient from "./apiClient";

export async function getAllPosts(page = 1, limit = 20) {
  const { data } = await apiClient.get("/posts", {
    params: { page, limit },
  });
  return data;
}

export async function getFeedPosts(params = {}) {
  const { data } = await apiClient.get("/posts/feed", {
    params,
  });
  return data;
}

export async function getSinglePost(postId) {
  const { data } = await apiClient.get(`/posts/${postId}`);
  return data;
}

export async function createPost(postData) {
  const { data } = await apiClient.post("/posts", postData);
  return data;
}

export async function updatePost(postId, postData) {
  const { data } = await apiClient.put(`/posts/${postId}`, postData);
  return data;
}

export async function deletePost(postId) {
  const { data } = await apiClient.delete(`/posts/${postId}`);
  return data;
}

export async function toggleLikePost(postId) {
  const { data } = await apiClient.put(`/posts/${postId}/like`);
  return data;
}

export async function toggleBookmarkPost(postId) {
  const { data } = await apiClient.put(`/posts/${postId}/bookmark`);
  return data;
}

export async function sharePost(postId, bodyText) {
  const { data } = await apiClient.post(`/posts/${postId}/share`, {
    body: bodyText,
  });
  return data;
}

export async function getPostLikes(postId, page = 1, limit = 20) {
  const { data } = await apiClient.get(`/posts/${postId}/likes`, {
    params: { page, limit },
  });
  return data;
}

// Backwards compatibility alias
export async function getPosts() {
  try {
    const data = await getAllPosts();
    return data.data?.posts || [];
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}