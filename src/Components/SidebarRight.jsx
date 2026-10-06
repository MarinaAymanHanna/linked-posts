import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFollowSuggestions, followUnfollowUser } from "../Services/userService";
import { UserPlus, UserCheck, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function SidebarRight() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function loadSuggestions() {
      try {
        setLoading(true);
        const res = await getFollowSuggestions(5);
        if (isMounted && res?.data?.suggestions) {
          setSuggestions(res.data.suggestions);
        }
      } catch (err) {
        console.error("Failed to load suggestions:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSuggestions();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleToggleFollow(userId, username) {
    const isCurrentlyFollowing = !!followingMap[userId];
    // Optimistic toggle
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !isCurrentlyFollowing,
    }));

    try {
      const res = await followUnfollowUser(userId);
      const following = res?.data?.following ?? !isCurrentlyFollowing;
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: following,
      }));
      toast.success(
        following ? `Now following @${username}` : `Unfollowed @${username}`
      );
    } catch {
      // Revert on error
      setFollowingMap((prev) => ({
        ...prev,
        [userId]: isCurrentlyFollowing,
      }));
      toast.error("Failed to update follow status.");
    }
  }

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  return (
    <aside className="w-full space-y-4">
      {/* Suggestions Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Who to follow
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-2 bg-slate-100 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No suggestions right now</p>
        ) : (
          <div className="space-y-3">
            {suggestions.map((sug) => {
              const isFollowing = !!followingMap[sug._id];
              return (
                <div
                  key={sug._id}
                  className="flex items-center justify-between gap-2.5 group"
                >
                  <Link
                    to={`/user/${sug._id}`}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    <img
                      src={sug.photo || defaultAvatar}
                      alt={sug.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition">
                        {sug.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        @{sug.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleToggleFollow(sug._id, sug.username)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition flex-shrink-0 cursor-pointer ${
                      isFollowing
                        ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-3 text-[11px] text-slate-400 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link to="/" className="hover:underline">About</Link>
          <Link to="/" className="hover:underline">Privacy</Link>
          <Link to="/" className="hover:underline">Terms</Link>
          <Link to="/" className="hover:underline">Help</Link>
        </div>
        <p>© 2026 LinkedPosts for Route Academy. All rights reserved.</p>
      </div>
    </aside>
  );
}
