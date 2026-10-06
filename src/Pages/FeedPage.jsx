import { useState, useEffect, useCallback } from "react";
import { getAllPosts, getFeedPosts } from "../Services/postService";
import PostComposer from "../Components/PostComposer";
import PostCard from "../Components/PostCard";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import LodingScreen from "../Components/LodingScreen";
import { Sparkles, Users, RefreshCw, AlertCircle } from "lucide-react";

export default function FeedPage() {
  const [feedTab, setFeedTab] = useState("all"); // "all" | "following"
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(
    async (pageToFetch = 1, isNewTab = false) => {
      try {
        if (pageToFetch === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        let data;
        if (feedTab === "following") {
          data = await getFeedPosts({ only: "following", page: pageToFetch, limit: 15 });
        } else {
          data = await getAllPosts(pageToFetch, 15);
        }

        const fetchedPosts = data?.data?.posts || [];

        if (pageToFetch === 1 || isNewTab) {
          setPosts(fetchedPosts);
        } else {
          setPosts((prev) => [...prev, ...fetchedPosts]);
        }

        const pagination = data?.meta?.pagination;
        if (pagination) {
          setHasMore(pagination.currentPage < pagination.numberOfPages);
        } else {
          setHasMore(fetchedPosts.length >= 15);
        }
        setPage(pageToFetch);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [feedTab]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(1, true);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  // Handlers for post events
  function handlePostCreated(newPost) {
    setPosts((prev) => [newPost, ...prev]);
  }

  function handlePostDeleted(deletedId) {
    setPosts((prev) => prev.filter((p) => (p._id || p.id) !== deletedId));
  }

  function handlePostUpdated(updatedPost) {
    setPosts((prev) =>
      prev.map((p) =>
        (p._id || p.id) === (updatedPost._id || updatedPost.id)
          ? { ...p, ...updatedPost }
          : p
      )
    );
  }

  function handlePostShared(sharedPost) {
    if (sharedPost) {
      setPosts((prev) => [sharedPost, ...prev]);
    } else {
      fetchPosts(1, true);
    }
  }

  return (
    <div className="flex justify-center gap-6">
      {/* Left Sidebar (Desktop) */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20">
          <SidebarLeft />
        </div>
      </div>

      {/* Main Feed Column */}
      <div className="w-full max-w-2xl min-w-0">
        {/* Post Composer */}
        <PostComposer onPostCreated={handlePostCreated} />

        {/* Feed Tab Selector */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1 mb-4 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFeedTab("all")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              feedTab === "all"
                ? "bg-blue-50 text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>All Posts</span>
          </button>

          <button
            type="button"
            onClick={() => setFeedTab("following")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              feedTab === "following"
                ? "bg-blue-50 text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Following Feed</span>
          </button>
        </div>

        {/* Feed Content */}
        {loading ? (
          <LodingScreen count={3} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">{error}</p>
            <button
              type="button"
              onClick={() => fetchPosts(1, true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800">
              {feedTab === "following"
                ? "No posts from accounts you follow"
                : "No posts yet"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {feedTab === "following"
                ? "Follow some users from the suggestions panel to see their posts here."
                : "Be the first to share something with the community!"}
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
                onPostShared={handlePostShared}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-4">
                <button
                  type="button"
                  onClick={() => fetchPosts(page + 1)}
                  disabled={loadingMore}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition shadow-xs disabled:opacity-50 flex items-center gap-2 mx-auto cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading more posts...</span>
                    </>
                  ) : (
                    <span>Load More Posts</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar (Desktop) */}
      <div className="hidden xl:block w-72 flex-shrink-0">
        <div className="sticky top-20">
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}