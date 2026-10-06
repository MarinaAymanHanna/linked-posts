import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { getUnreadNotificationsCount } from "../Services/notificationService";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  Home,
  Bookmark,
  Bell,
  User,
  LogOut,
  KeyRound,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { isLoggedin, user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch unread count periodically or on route change
  useEffect(() => {
    if (!isLoggedin) return;

    let isMounted = true;
    async function fetchUnread() {
      try {
        const res = await getUnreadNotificationsCount();
        if (isMounted && res?.data?.unreadCount !== undefined) {
          setUnreadCount(res.data.unreadCount);
        }
      } catch {
        // silent fail
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 45000); // 45s poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isLoggedin, location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  }

  const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                LP
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight hidden sm:inline">
                Linked<span className="text-blue-600">Posts</span>
              </span>
            </Link>
          </div>

          {/* Center: Main Nav Links (Desktop) */}
          {isLoggedin && (
            <nav className="hidden md:flex items-center gap-1 sm:gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/bookmarks"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                <Bookmark className="w-5 h-5" />
                <span>Saved</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span>Notifications</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`
                }
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </NavLink>
            </nav>
          )}

          {/* Right: User Menu / Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedin ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition cursor-pointer"
                >
                  <img
                    src={user?.photo || defaultAvatar}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.name || "Logged In User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        @{user?.username || "user"}
                      </p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/bookmarks"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        <span>Saved Posts</span>
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition md:hidden"
                      >
                        <Bell className="w-4 h-4 text-slate-400" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          setIsPasswordModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition text-left cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-slate-400" />
                        <span>Change Password</span>
                      </button>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-100 p-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      {isLoggedin && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </NavLink>

          <NavLink
            to="/bookmarks"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Saved</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Alerts</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition ${
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </NavLink>
        </nav>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}