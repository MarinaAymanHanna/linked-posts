import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  toggleLikePost,
  toggleBookmarkPost,
  deletePost,
} from "../Services/postService";
import { formatRelativeTime } from "../utils/dateUtils";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import EditPostModal from "./EditPostModal";
import ImageLightbox from "./ImageLightbox";
import toast from "react-hot-toast";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Edit3,
  Trash2,
  Globe,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";

export default function PostCard({
  post,
  onPostDeleted,
  onPostUpdated,
  onPostShared,
}) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const currentUserId = user?._id || user?.id;

  const authorId = post.user?._id || post.user?.id;
  const isOwner = currentUserId && authorId && currentUserId === authorId;

  // Like state
  const initialLiked =
    Array.isArray(post.likes) &&
    post.likes.some(
      (l) => l === currentUserId || l?._id === currentUserId || l?.id === currentUserId
    );
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(
    post.likesCount ?? (post.likes?.length || 0)
  );

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(Boolean(post.bookmarked));

  // Comment section toggle
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  const postId = post._id || post.id;

  // Like Handler
  async function handleToggleLike() {
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleLikePost(postId);
      if (res?.data) {
        setIsLiked(res.data.liked);
        if (res.data.likesCount !== undefined) {
          setLikesCount(res.data.likesCount);
        }
      }
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like status.");
    }
  }

  // Bookmark Handler
  async function handleToggleBookmark() {
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    try {
      const res = await toggleBookmarkPost(postId);
      if (res?.data?.bookmarked !== undefined) {
        setIsBookmarked(res.data.bookmarked);
        toast.success(
          res.data.bookmarked ? "Post saved to bookmarks" : "Post removed from bookmarks"
        );
      }
    } catch {
      setIsBookmarked(prevBookmarked);
      toast.error("Failed to update bookmark.");
    }
  }

  // Delete Handler
  async function handleDeletePost() {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(postId);
      toast.success("Post deleted successfully");
      if (onPostDeleted) {
        onPostDeleted(postId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post.");
    }
  }

  // Copy Link Handler
  function handleCopyLink() {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success("Post link copied to clipboard!");
    setMenuOpen(false);
  }

  const authorProfileLink =
    isOwner ? "/profile" : authorId ? `/user/${authorId}` : "#";

  return (
    <>
      <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-4 p-4 transition-all hover:border-slate-300/80">
        {/* Post Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to={authorProfileLink} className="flex-shrink-0 group">
              <img
                src={post.user?.photo || defaultAvatar}
                alt={post.user?.name || "Author"}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
            </Link>

            <div className="min-w-0">
              <Link
                to={authorProfileLink}
                className="font-bold text-sm text-slate-900 hover:text-blue-600 transition block truncate"
              >
                {post.user?.name || "Member"}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span className="capitalize">{post.privacy || "public"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/post/${postId}`);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  <span>Copy Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleToggleBookmark();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? "fill-amber-500 text-amber-500" : "text-slate-400"
                    }`}
                  />
                  <span>{isBookmarked ? "Saved" : "Save Post"}</span>
                </button>

                {isOwner && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-blue-600" />
                      <span>Edit Post</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeletePost();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Delete Post</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Post Body Content */}
        {post.body && (
          <p className="mt-3 text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
            {post.body}
          </p>
        )}

        {/* Post Image */}
        {post.image && (
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-900/5 cursor-zoom-in">
            <img
              src={post.image}
              alt="Post visual"
              onClick={() => setLightboxImage(post.image)}
              className="w-full max-h-[500px] object-cover hover:opacity-95 transition"
            />
          </div>
        )}

        {/* Embedded Shared Post (if isShare) */}
        {post.sharedPost && (
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={post.sharedPost.user?.photo || defaultAvatar}
                alt={post.sharedPost.user?.name || "Original poster"}
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {post.sharedPost.user?.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatRelativeTime(post.sharedPost.createdAt)}
                </span>
              </div>
            </div>

            {post.sharedPost.body && (
              <p className="text-xs text-slate-700 leading-relaxed">
                {post.sharedPost.body}
              </p>
            )}

            {post.sharedPost.image && (
              <img
                src={post.sharedPost.image}
                alt="Shared post visual"
                onClick={() => setLightboxImage(post.sharedPost.image)}
                className="w-full max-h-64 object-cover rounded-lg cursor-zoom-in"
              />
            )}
          </div>
        )}

        {/* Engagement Stats Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 py-2.5 mt-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            {likesCount > 0 ? (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-xs">
                  <ThumbsUp className="w-3 h-3 fill-white" />
                </span>
                <span>{likesCount}</span>
              </span>
            ) : (
              <span className="text-slate-400">0 likes</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="hover:underline cursor-pointer"
            >
              {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
            </button>
            {post.sharesCount > 0 && (
              <span>{post.sharesCount} shares</span>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 gap-1 py-1 mt-1 text-slate-600 font-semibold text-xs">
          {/* Like */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition cursor-pointer ${
              isLiked ? "text-blue-600 font-bold" : "text-slate-600"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${isLiked ? "fill-blue-600 stroke-blue-600" : ""}`}
            />
            <span>Like</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition cursor-pointer text-slate-600"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition cursor-pointer text-slate-600"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-slate-100 active:scale-95 transition cursor-pointer ${
              isBookmarked ? "text-amber-500 font-bold" : "text-slate-600"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? "fill-amber-500 stroke-amber-500" : ""
              }`}
            />
            <span>{isBookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* Comments Section Drawer */}
        {showComments && (
          <div className="mt-2">
            <CommentSection
              postId={postId}
              onImageClick={(src) => setLightboxImage(src)}
              onCommentCountChange={(newCount) => setCommentsCount(newCount)}
            />
          </div>
        )}
      </article>

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPostShared={onPostShared}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        post={post}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onPostUpdated={(updated) => {
          if (onPostUpdated) onPostUpdated(updated);
        }}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        src={lightboxImage}
        alt="Post media preview"
        onClose={() => setLightboxImage(null)}
      />
    </>
  );
}
