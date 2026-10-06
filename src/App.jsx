import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";
import FeedPage from "./Pages/FeedPage";
import ProfilePage from "./Pages/ProfilePage";
import SinglePostPage from "./Pages/SinglePostPage";
import BookmarksPage from "./Pages/BookmarksPage";
import NotificationsPage from "./Pages/NotificationsPage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import NotFoundPage from "./Pages/NotFoundPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthProtectedRoute from "./Components/AuthProtectedRoute";

export default function App() {
  const routers = createBrowserRouter([
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "user/:userId",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "post/:postId",
          element: (
            <ProtectedRoute>
              <SinglePostPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "single-post",
          element: (
            <ProtectedRoute>
              <SinglePostPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "bookmarks",
          element: (
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "notifications",
          element: (
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
    {
      path: "",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: (
            <AuthProtectedRoute>
              <LoginPage />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "register",
          element: (
            <AuthProtectedRoute>
              <RegisterPage />
            </AuthProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}
