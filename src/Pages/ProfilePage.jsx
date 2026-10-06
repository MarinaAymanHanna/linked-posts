import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  getUserProfile,
  followUnfollowUser,
  getUserPosts,
  getBookmarks,
} from "../Services/userService";
import { uploadProfilePhoto } from "../Services/authService";
import PostCard from "../Components/PostCard";
import LodingScreen from "../Components/LodingScreen";
import ChangePasswordModal from "../Components/ChangePasswordModal";
import toast from "react-hot-toast";
import {
  Camera,
  Calendar,
  Mail,
  User,
  UserCheck,
  UserPlus,
  KeyRound,
  Grid,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Spinner } from "@heroui/react";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser, refreshUserProfile } = useContext(AuthContext);

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUserId;

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Tab: "posts" | "saved"
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Modals & Uploading
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  // Keep a ref to currentUser so we can read it inside the effect
  // without making it a reactive dependency (which would cause infinite loops)
  const currentUserRef = useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  });

  // 1. Fetch Profile Data — only re-runs when the target profile changes
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        setLoadingProfile(true);
        if (isOwnProfile) {
          // For own profile: call refreshUserProfile once, then fall back to
          // the ref value. Do NOT put refreshUserProfile or currentUser in deps.
          const freshUser = await refreshUserProfile();
          const target = freshUser || currentUserRef.current;
          if (isMounted && target) {
            setProfileData(target);
            setFollowersCount(target.followersCount || 0);
          }
        } else {
          const res = await getUserProfile(userId);
          if (isMounted && res?.data) {
            setProfileData(res.data.user);
            setIsFollowing(Boolean(res.data.isFollowing));
            setFollowersCount(res.data.user?.followersCount || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile details.");
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    }

    const timer = setTimeout(loadProfile, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isOwnProfile]);


  // 2. Fetch Posts for tab
  useEffect(() => {
    const targetId = isOwnProfile ? currentUserId : userId;
    if (!targetId) return;

    let isMounted = true;
    async function loadTabContent() {
      try {
        setLoadingPosts(true);
        if (activeTab === "saved" && isOwnProfile) {
          const res = await getBookmarks();
          if (isMounted && res?.data?.bookmarks) {
            setPosts(res.data.bookmarks);
          }
        } else {
          const res = await getUserPosts(targetId);
          if (isMounted && res?.data?.posts) {
            setPosts(res.data.posts);
          }
        }
      } catch (err) {
        console.error("Failed to load profile posts:", err);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    }

    const timer = setTimeout(loadTabContent, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [userId, isOwnProfile, currentUserId, activeTab]);

  // Photo Upload Handler
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const res = await uploadProfilePhoto(file);
      toast.success("Profile photo updated!");
      await refreshUserProfile();
      if (res?.data?.photo) {
        setProfileData((prev) => ({ ...prev, photo: res.data.photo }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  }

  // Follow/Unfollow Handler
  async function handleToggleFollow() {
    if (isOwnProfile || !userId) return;

    const prevFollowing = isFollowing;
    const prevCount = followersCount;

    setIsFollowing(!prevFollowing);
    setFollowersCount(prevFollowing ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await followUnfollowUser(userId);
      if (res?.data) {
        setIsFollowing(res.data.following);
        if (res.data.followersCount !== undefined) {
          setFollowersCount(res.data.followersCount);
        }
      }
      toast.success(
        !prevFollowing ? `Following ${profileData?.name}` : `Unfollowed ${profileData?.name}`
      );
    } catch {
      setIsFollowing(prevFollowing);
      setFollowersCount(prevCount);
      toast.error("Failed to update follow status.");
    }
  }

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

  if (loadingProfile) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <LodingScreen count={2} />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">User not found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested profile could not be loaded or does not exist.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Camera upload button */}
            <div className="relative group">
              <img
                src={profileData.photo || defaultAvatar}
                alt={profileData.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />

              {isOwnProfile && (
                <label
                  className="absolute bottom-1 right-1 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition shadow-md cursor-pointer group-hover:scale-105"
                  title="Upload profile photo"
                >
                  {uploadingPhoto ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Security & Password</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer ${
                    isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Name & Bio Details */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {profileData.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              @{profileData.username}
            </p>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              {profileData.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.email}</span>
                </span>
              )}

              {profileData.gender && (
                <span className="flex items-center gap-1.5 capitalize">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profileData.gender}</span>
                </span>
              )}

              {profileData.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Joined{" "}
                    {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
              )}
            </div>

            {/* Counts Bar */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm mr-1">
                  {followersCount}
                </span>
                <span className="text-slate-500">Followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm mr-1">
                  {profileData.followingCount ?? 0}
                </span>
                <span className="text-slate-500">Following</span>
              </div>
              {isOwnProfile && (
                <div>
                  <span className="font-bold text-slate-900 text-sm mr-1">
                    {profileData.bookmarksCount ?? 0}
                  </span>
                  <span className="text-slate-500">Saved</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-t border-slate-200/80 px-6 sm:px-8">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === "posts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "saved"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Posts</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Posts List */}
      <div className="max-w-2xl mx-auto">
        {loadingPosts ? (
          <LodingScreen count={2} />
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">
              {activeTab === "saved" ? "No saved posts yet" : "No posts published yet"}
            </h3>
            <p className="text-xs text-slate-400">
              {activeTab === "saved"
                ? "Posts you save will appear here for easy access."
                : "When this user posts something, it will appear here."}
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
