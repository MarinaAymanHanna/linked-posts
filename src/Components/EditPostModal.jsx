import { useState } from "react";
import { updatePost } from "../Services/postService";
import toast from "react-hot-toast";
import { Edit3, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { Spinner } from "@heroui/react";

export default function EditPostModal({ post, isOpen, onClose, onPostUpdated }) {
  const [body, setBody] = useState(post?.body || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image || null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !post) return null;

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage() {
    setSelectedFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!body.trim() && !imagePreview && !selectedFile) {
      toast.error("A post must contain text or an image.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("body", body);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await updatePost(post._id || post.id, formData);
      toast.success("Post updated successfully!");
      if (onPostUpdated) {
        onPostUpdated(res?.data?.post || { ...post, body, image: imagePreview });
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Edit Post</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Update your post content..."
            rows={4}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
          />

          {/* Image Preview / Change */}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-56 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition border border-dashed border-slate-300">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>{imagePreview ? "Change photo" : "Add photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2">
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
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
