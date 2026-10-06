import apiClient from "./apiClient";

export async function getPostComments(postId, page = 1, limit = 20) {
  const { data } = await apiClient.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  });
  return data;
}

export async function createComment(postId, commentData) {
  const { data } = await apiClient.post(`/posts/${postId}/comments`, commentData);
  return data;
}

export async function getCommentReplies(postId, commentId, page = 1, limit = 20) {
  const { data } = await apiClient.get(
    `/posts/${postId}/comments/${commentId}/replies`,
    {
      params: { page, limit },
    }
  );
  return data;
}

export async function createReply(postId, commentId, replyData) {
  const { data } = await apiClient.post(
    `/posts/${postId}/comments/${commentId}/replies`,
    replyData
  );
  return data;
}

export async function updateComment(postId, commentId, commentData) {
  const { data } = await apiClient.put(
    `/posts/${postId}/comments/${commentId}`,
    commentData
  );
  return data;
}

export async function deleteComment(postId, commentId) {
  const { data } = await apiClient.delete(
    `/posts/${postId}/comments/${commentId}`
  );
  return data;
}

export async function toggleLikeComment(postId, commentId) {
  const { data } = await apiClient.put(
    `/posts/${postId}/comments/${commentId}/like`
  );
  return data;
}
