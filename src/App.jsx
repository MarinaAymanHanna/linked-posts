import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./Layouts/MainLayout"
import AuthLayout from "./Layouts/AuthLayout"
import FeedPage from "./Pages/FeedPage"
import ProfilePage from "./Pages/ProfilePage"
import SinglePostPage from "./Pages/SinglePostPage"
import RegisterPage from "./Pages/RegisterPage"
import LoginPage from "./Pages/LoginPage"
import ProtectedRoute from "./Components/ProtectedRoute"
import AuthProtectedRoute from "./Components/AuthProtectedRoute"


export default function App() {

const routers = createBrowserRouter([
    {path:'', element: <MainLayout />, children: [
      {index: true, element: <ProtectedRoute><FeedPage /></ProtectedRoute>},
      {path:'profile', element:<ProtectedRoute><ProfilePage /></ProtectedRoute>},
      {path:'Single-post', element: <ProtectedRoute><SinglePostPage /></ProtectedRoute>},

    ]},
    {path:'', element: <AuthLayout />, children:[
      {path:'login', element: <AuthProtectedRoute><LoginPage /></AuthProtectedRoute>},
      {path:'register', element: <AuthProtectedRoute><RegisterPage /></AuthProtectedRoute>},

    ]},
  ])

  return <>
    
      <RouterProvider router={routers}> </RouterProvider>
    
  </>
}
