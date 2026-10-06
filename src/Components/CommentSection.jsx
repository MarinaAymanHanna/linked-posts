import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { getPostComments, createComment } from "../Services/commentService";
import CommentItem from "./CommentItem";
import toast from "react-hot-toast";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { Spinner } from "@heroui/react";

export default function CommentSection({
  postId,
  onImageClick,
  onCommentCountChange,
}) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // New comment input
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  useEffect(() => {
    let isMounted = true;
    async function fetchComments() {
      try {
        setLoading(true);
        const res = await getPostComments(postId, 1, 10);
        if (isMounted && res?.data?.comments) {
          setComments(res.data.comments);
          const pagination = res.meta?.pagination;
          if (pagination && pagination.currentPage < pagination.numberOfPages) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  async function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await getPostComments(postId, nextPage, 10);
      if (res?.data?.comments) {
        setComments((prev) => [...prev, ...res.data.comments]);
        setPage(nextPage);
        const pagination = res.meta?.pagination;
        setHasMore(pagination && pagination.currentPage < pagination.numberOfPages);
      }
    } catch {
      toast.error("Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!content.trim() && !imageFile) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (content.trim()) formData.append("content", content.trim());
      if (imageFile) formData.append("image", imageFile);

      const res = await createComment(postId, formData);
      toast.success("Comment added!");

      const newComment = res?.data?.comment || {
        _id: Date.now().toString(),
        content,
        commentCreator: user,
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0,
        repliesCount: 0,
      };

      setComments((prev) => [newComment, ...prev]);
      setContent("");
      handleRemoveImage();

      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCommentDeleted(deletedId) {
    setComments((prev) => prev.filter((c) => (c._id || c.id) !== deletedId));
    if (onCommentCountChange) {
      onCommentCountChange(Math.max(0, comments.length - 1));
    }
  }

  function handleCommentUpdated(updatedComment) {
    setComments((prev) =>
      prev.map((c) =>
        (c._id || c.id) === (updatedComment._id || updatedComment.id)
          ? updatedComment
          : c
      )
    );
  }

  return (
    <div className="pt-3 border-t border-slate-100 space-y-4">
      {/* Add Comment Input Form */}
      <form onSubmit={handleSubmitComment} className="flex items-start gap-2.5">
        <img
          src={user?.photo || defaultAvatar}
          alt={user?.name || "You"}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 border border-slate-200"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />

        <div className="flex-1 space-y-2">
          <div className="relative flex items-center bg-slate-100 focus-within:bg-white rounded-2xl border border-slate-200/80 focus-within:border-blue-500 transition px-3 py-1.5">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none pr-14"
            />

            <div className="absolute right-2 flex items-center gap-1">
              <label
                className="p-1 text-slate-400 hover:text-emerald-600 rounded-full hover:bg-slate-200/60 cursor-pointer transition"
                title="Attach photo"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !imageFile)}
                className="p-1 text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer transition"
                title="Send comment"
              >
                {isSubmitting ? (
                  <Spinner size="sm" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Comment Image Preview */}
          {imagePreview && (
            <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200">
              <img
                src={imagePreview}
                alt="Comment attachment preview"
                className="h-20 w-auto rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-4 text-slate-400 gap-2">
          <Spinner size="sm" />
          <span className="text-xs">Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-3 italic">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-3.5">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id || comment.id}
              comment={comment}
              postId={postId}
              onCommentDeleted={handleCommentDeleted}
              onCommentUpdated={handleCommentUpdated}
              onImageClick={onImageClick}
            />
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 cursor-pointer"
              >
                {loadingMore ? "Loading more comments..." : "View more comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
