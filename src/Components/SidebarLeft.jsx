import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  Home,
  Bookmark,
  Bell,
  User,
  Sparkles,
} from "lucide-react";

export default function SidebarLeft() {
  const { user } = useContext(AuthContext);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  return (
    <aside className="w-full space-y-4">
      {/* User Profile Mini Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 overflow-hidden relative group">
        <div className="h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-xl mb-7 relative">
          <Link
            to="/profile"
            className="absolute -bottom-5 left-4 ring-3 ring-white rounded-full overflow-hidden shadow-sm"
          >
            <img
              src={user?.photo || defaultAvatar}
              alt={user?.name || "User"}
              className="w-12 h-12 object-cover rounded-full bg-white"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          </Link>
        </div>

        <div className="px-1">
          <Link
            to="/profile"
            className="font-bold text-sm text-slate-900 hover:text-blue-600 transition block truncate"
          >
            {user?.name || "User"}
          </Link>
          <p className="text-xs text-slate-500 truncate">@{user?.username || "username"}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
            <Link to="/profile" className="hover:opacity-80 transition">
              <span className="block text-xs font-bold text-slate-800">
                {user?.followersCount ?? 0}
              </span>
              <span className="text-[10px] text-slate-500">Followers</span>
            </Link>
            <Link to="/profile" className="hover:opacity-80 transition">
              <span className="block text-xs font-bold text-slate-800">
                {user?.followingCount ?? 0}
              </span>
              <span className="text-[10px] text-slate-500">Following</span>
            </Link>
            <Link to="/bookmarks" className="hover:opacity-80 transition">
              <span className="block text-xs font-bold text-slate-800">
                {user?.bookmarksCount ?? 0}
              </span>
              <span className="text-[10px] text-slate-500">Saved</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>Home Feed</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Posts</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </NavLink>
      </div>

      {/* Route Academy Community Banner */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Route Community</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Share your programming journeys, connect with developers, and get feedback.
        </p>
      </div>
    </aside>
  );
}
