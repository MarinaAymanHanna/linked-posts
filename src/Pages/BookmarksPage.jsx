import { useState, useEffect } from "react";
import { getBookmarks } from "../Services/userService";
import PostCard from "../Components/PostCard";
import LodingScreen from "../Components/LodingScreen";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import { Bookmark, Sparkles } from "lucide-react";

export default function BookmarksPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadBookmarks() {
      try {
        setLoading(true);
        const res = await getBookmarks();
        if (isMounted && res?.data?.bookmarks) {
          setPosts(res.data.bookmarks);
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBookmarks();
    return () => {
      isMounted = false;
    };
  }, []);

  function handlePostDeleted(deletedId) {
    setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId));
  }

  function handlePostUpdated(updated) {
    setPosts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (updated._id || updated.id) ? { ...p, ...updated } : p
      )
    );
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Saved Posts</h1>
            <p className="text-xs text-slate-500">
              Only you can see the posts you've saved
            </p>
          </div>
        </div>

        {loading ? (
          <LodingScreen count={2} />
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No saved posts</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Save posts to read later or keep your favorite discussions handy.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </div>
        )}
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
