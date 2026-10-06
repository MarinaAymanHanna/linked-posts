import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  getCommentReplies,
  createReply,
  updateComment,
  deleteComment,
  toggleLikeComment,
} from "../Services/commentService";
import { formatRelativeTime } from "../utils/dateUtils";
import toast from "react-hot-toast";
import {
  Heart,
  MoreHorizontal,
  Edit2,
  Trash2,
  Send,
  CornerDownRight,
} from "lucide-react";
import { Spinner } from "@heroui/react";

export default function CommentItem({
  comment,
  postId,
  onCommentDeleted,
  onCommentUpdated,
  onImageClick,
}) {
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id || user?.id;
  const isAuthor =
    currentUserId &&
    (comment.commentCreator?._id === currentUserId ||
      comment.commentCreator?.id === currentUserId);

  // Like state
  const initialLiked =
    Array.isArray(comment.likes) &&
    comment.likes.some(
      (l) => l === currentUserId || l?._id === currentUserId || l?.id === currentUserId
    );
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(
    comment.likesCount ?? (comment.likes?.length || 0)
  );

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Replies state
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);

  // Reply input state
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Dropdown menu state
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  // Handle Like/Unlike
  async function handleToggleLike() {
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleLikeComment(postId, comment._id || comment.id);
      if (res?.data) {
        setIsLiked(res.data.liked);
        if (res.data.likesCount !== undefined) {
          setLikesCount(res.data.likesCount);
        }
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to like comment");
    }
  }

  // Handle Edit Submit
  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("content", editContent.trim());
      const res = await updateComment(postId, comment._id || comment.id, formData);
      toast.success("Comment updated");
      setIsEditing(false);
      if (onCommentUpdated) {
        onCommentUpdated(res?.data?.comment || { ...comment, content: editContent });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    } finally {
      setIsUpdating(false);
    }
  }

  // Handle Delete Comment
  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(postId, comment._id || comment.id);
      toast.success("Comment deleted");
      if (onCommentDeleted) {
        onCommentDeleted(comment._id || comment.id);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  }

  // Load Replies
  async function handleToggleReplies() {
    if (!showReplies && replies.length === 0) {
      try {
        setLoadingReplies(true);
        const res = await getCommentReplies(postId, comment._id || comment.id);
        if (res?.data?.replies) {
          setReplies(res.data.replies);
        }
      } catch {
        toast.error("Failed to load replies");
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  }

  // Handle Reply Submit
  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyText.trim() && !replyImage) return;

    try {
      setIsSubmittingReply(true);
      const formData = new FormData();
      if (replyText.trim()) formData.append("content", replyText.trim());
      if (replyImage) formData.append("image", replyImage);

      const res = await createReply(postId, comment._id || comment.id, formData);
      toast.success("Reply added");

      const newReply = res?.data?.reply || {
        _id: Date.now().toString(),
        content: replyText,
        commentCreator: user,
        createdAt: new Date().toISOString(),
        likes: [],
        likesCount: 0,
      };

      setReplies((prev) => [...prev, newReply]);
      setRepliesCount((c) => c + 1);
      setShowReplies(true);
      setReplyText("");
      setReplyImage(null);
      setIsReplying(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add reply");
    } finally {
      setIsSubmittingReply(false);
    }
  }

  return (
    <div className="flex items-start gap-2.5 group/comment text-xs">
      {/* Author Avatar */}
      <Link
        to={
          comment.commentCreator?._id
            ? `/user/${comment.commentCreator._id}`
            : "#"
        }
        className="flex-shrink-0 mt-0.5"
      >
        <img
          src={comment.commentCreator?.photo || defaultAvatar}
          alt={comment.commentCreator?.name || "Author"}
          className="w-8 h-8 rounded-full object-cover border border-slate-200"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </Link>

      <div className="flex-1 min-w-0">
        {/* Comment Bubble */}
        <div className="relative inline-block max-w-full bg-slate-100/90 hover:bg-slate-100 rounded-2xl px-3.5 py-2.5 transition">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={
                comment.commentCreator?._id
                  ? `/user/${comment.commentCreator._id}`
                  : "#"
              }
              className="font-bold text-slate-900 hover:text-blue-600 transition truncate"
            >
              {comment.commentCreator?.name || "Anonymous"}
            </Link>

            {isAuthor && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 opacity-0 group-hover/comment:opacity-100 transition cursor-pointer"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-6 z-20 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-100 text-left cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit Form or Comment Content */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-1 space-y-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex items-center gap-1.5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-slate-800 mt-0.5 leading-relaxed break-words whitespace-pre-line">
                {comment.content}
              </p>
              {comment.image && (
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  onClick={() => onImageClick && onImageClick(comment.image)}
                  className="mt-2 max-h-48 rounded-xl object-cover cursor-zoom-in border border-slate-200"
                />
              )}
            </>
          )}
        </div>

        {/* Comment Actions (Like, Reply, Timestamp) */}
        <div className="flex items-center gap-3 mt-1 ml-2 text-[11px] text-slate-500 font-medium">
          <button
            type="button"
            onClick={handleToggleLike}
            className={`font-semibold hover:underline cursor-pointer ${
              isLiked ? "text-blue-600" : "text-slate-600"
            }`}
          >
            {isLiked ? "Liked" : "Like"}
          </button>

          <span>·</span>

          <button
            type="button"
            onClick={() => setIsReplying(!isReplying)}
            className="font-semibold text-slate-600 hover:underline cursor-pointer"
          >
            Reply
          </button>

          {likesCount > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-600">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{likesCount}</span>
              </span>
            </>
          )}

          <span>·</span>

          <span className="text-slate-400">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {/* Toggle View Replies */}
        {(repliesCount > 0 || replies.length > 0) && (
          <button
            type="button"
            onClick={handleToggleReplies}
            className="flex items-center gap-1.5 mt-2 ml-2 text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>
              {showReplies
                ? "Hide replies"
                : `View ${repliesCount || replies.length} ${
                    (repliesCount || replies.length) === 1 ? "reply" : "replies"
                  }`}
            </span>
          </button>
        )}

        {/* Nested Replies List */}
        {showReplies && (
          <div className="mt-3 pl-3 border-l-2 border-slate-200/80 space-y-3">
            {loadingReplies ? (
              <div className="flex items-center gap-2 text-slate-400 py-1">
                <Spinner size="sm" />
                <span className="text-[11px]">Loading replies...</span>
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply._id || reply.id} className="flex items-start gap-2">
                  <img
                    src={reply.commentCreator?.photo || defaultAvatar}
                    alt={reply.commentCreator?.name || "Reply author"}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5 border border-slate-200"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="inline-block bg-slate-100 rounded-xl px-3 py-1.5 max-w-full">
                      <Link
                        to={
                          reply.commentCreator?._id
                            ? `/user/${reply.commentCreator._id}`
                            : "#"
                        }
                        className="font-bold text-slate-900 hover:text-blue-600 block truncate"
                      >
                        {reply.commentCreator?.name || "Anonymous"}
                      </Link>
                      <p className="text-slate-800 break-words mt-0.5">
                        {reply.content}
                      </p>
                      {reply.image && (
                        <img
                          src={reply.image}
                          alt="Reply attachment"
                          onClick={() => onImageClick && onImageClick(reply.image)}
                          className="mt-1.5 max-h-36 rounded-lg object-cover cursor-zoom-in"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 ml-1 text-[10px] text-slate-400">
                      <span>{formatRelativeTime(reply.createdAt)}</span>
                      {reply.likesCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-slate-600">
                            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                            <span>{reply.likesCount}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reply Input Box */}
        {isReplying && (
          <form
            onSubmit={handleSendReply}
            className="mt-2.5 pl-3 border-l-2 border-blue-400 flex items-center gap-2"
          >
            <img
              src={user?.photo || defaultAvatar}
              alt="You"
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.commentCreator?.name || "comment"}...`}
                className="w-full bg-slate-100 focus:bg-white text-slate-800 text-xs px-3 py-1.5 pr-8 rounded-full border border-slate-200 focus:border-blue-500 focus:outline-none transition"
                autoFocus
              />
              <button
                type="submit"
                disabled={isSubmittingReply || !replyText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer"
              >
                {isSubmittingReply ? (
                  <Spinner size="sm" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 px-1"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
