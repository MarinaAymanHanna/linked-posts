import { useState } from "react";
import { sharePost } from "../Services/postService";
import toast from "react-hot-toast";
import { Share2, X } from "lucide-react";
import { Spinner } from "@heroui/react";

export default function ShareModal({ post, isOpen, onClose, onPostShared }) {
  const [bodyText, setBodyText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !post) return null;

  async function handleShare(e) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const res = await sharePost(post._id || post.id, bodyText);
      toast.success("Post shared successfully to your feed!");
      setBodyText("");
      onClose();
      if (onPostShared) {
        onPostShared(res?.data?.post);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to share post.");
    } finally {
      setLoading(false);
    }
  }

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Share Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleShare} className="mt-4 space-y-4">
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Say something about this post..."
            rows={3}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />

          {/* Embedded Original Post Preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={post.user?.photo || defaultAvatar}
                alt={post.user?.name || "Author"}
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {post.user?.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  @{post.user?.username}
                </span>
              </div>
            </div>

            {post.body && (
              <p className="text-xs text-slate-700 line-clamp-3">{post.body}</p>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="Post preview"
                className="w-full h-36 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              {loading && <Spinner size="sm" color="white" />}
              Share Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
