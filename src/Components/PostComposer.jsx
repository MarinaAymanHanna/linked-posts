import { useState, useContext, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import { createPost } from "../Services/postService";
import toast from "react-hot-toast";
import { Image, Globe, X, Send } from "lucide-react";
import { Spinner } from "@heroui/react";

export default function PostComposer({ onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setIsFocused(true);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!body.trim() && !imageFile) {
      toast.error("Please write something or attach an image to post.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (body.trim()) {
        formData.append("body", body.trim());
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await createPost(formData);
      toast.success("Post published!");

      setBody("");
      handleRemoveImage();
      setIsFocused(false);

      if (onPostCreated && res?.data?.post) {
        const newPost = {
          ...res.data.post,
          user:
            typeof res.data.post.user === "object"
              ? res.data.post.user
              : {
                  _id: user?._id || user?.id,
                  name: user?.name,
                  username: user?.username,
                  photo: user?.photo,
                },
          likes: [],
          likesCount: 0,
          commentsCount: 0,
          bookmarked: false,
        };
        onPostCreated(newPost);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-5 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3">
          <img
            src={user?.photo || defaultAvatar}
            alt={user?.name || "User"}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />

          <div className="flex-1">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={`What's on your mind, ${user?.name ? user.name.split(" ")[0] : "friend"}?`}
              rows={isFocused || imagePreview ? 3 : 2}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 text-sm p-3 rounded-xl border border-slate-200/70 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition resize-none"
            />

            {/* Image Preview Box */}
            {imagePreview && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 group">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full max-h-60 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar & Submit */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer transition">
              <Image className="w-4 h-4 text-emerald-500" />
              <span>Photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-[11px] font-medium text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>Public</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!body.trim() && !imageFile)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs shadow-blue-500/20"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
