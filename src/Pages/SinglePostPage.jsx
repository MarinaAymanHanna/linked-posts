import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSinglePost } from "../Services/postService";
import PostCard from "../Components/PostCard";
import LodingScreen from "../Components/LodingScreen";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function SinglePostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    let isMounted = true;
    async function loadPost() {
      try {
        setLoading(true);
        setError(null);
        const res = await getSinglePost(postId);
        if (isMounted && res?.data?.post) {
          setPost(res.data.post);
        }
      } catch (err) {
        console.error("Failed to load single post:", err);
        setError("This post is no longer available or was deleted.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  function handlePostDeleted() {
    navigate("/");
  }

  function handlePostUpdated(updated) {
    setPost((prev) => ({ ...prev, ...updated }));
  }

  return (
    <div className="flex justify-center gap-6">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <SidebarLeft />
        </div>
      </div>

      {/* Center Column */}
      <div className="w-full max-w-2xl min-w-0">
        {/* Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {loading ? (
          <LodingScreen count={1} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-10 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">{error}</h3>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
            >
              Go to Feed
            </Link>
          </div>
        ) : post ? (
          <PostCard
            post={post}
            onPostDeleted={handlePostDeleted}
            onPostUpdated={handlePostUpdated}
          />
        ) : null}
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-72 flex-shrink-0">
        <div className="sticky top-20">
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}
