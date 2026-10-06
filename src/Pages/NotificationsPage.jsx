import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../Services/notificationService";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import { formatRelativeTime } from "../utils/dateUtils";
import toast from "react-hot-toast";
import { Bell, CheckCheck, Sparkles, MessageSquare, Heart, UserPlus } from "lucide-react";
import { Spinner } from "@heroui/react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const navigate = useNavigate();

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        setLoading(true);
        const res = await getNotifications({ unread: false, limit: 30 });
        if (isMounted && res?.data?.notifications) {
          setNotifications(res.data.notifications);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleMarkAll() {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleNotificationClick(notif) {
    if (!notif.read) {
      try {
        await markNotificationAsRead(notif._id || notif.id);
        setNotifications((prev) =>
          prev.map((n) =>
            (n._id || n.id) === (notif._id || notif.id)
              ? { ...n, read: true }
              : n
          )
        );
      } catch {
        // silent
      }
    }

    if (notif.post) {
      const postId = typeof notif.post === "object" ? notif.post._id || notif.post.id : notif.post;
      navigate(`/post/${postId}`);
    } else if (notif.sender?._id) {
      navigate(`/user/${notif.sender._id}`);
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case "comment":
      case "reply":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
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
        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">Notifications</h1>
              <p className="text-xs text-slate-500">
                Stay updated on activities and interactions
              </p>
            </div>
          </div>

          {notifications.some((n) => !n.read) && (
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3">
            <Spinner size="md" />
            <p className="text-xs">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No notifications yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When people like your posts, comment, or follow you, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif._id || notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer ${
                  !notif.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={notif.sender?.photo || defaultAvatar}
                    alt={notif.sender?.name || "Actor"}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-xs">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-800">
                    <span className="font-bold text-slate-900 mr-1">
                      {notif.sender?.name || "Someone"}
                    </span>
                    {notif.message || "interacted with your content."}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                )}
              </div>
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
