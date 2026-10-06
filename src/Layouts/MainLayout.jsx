import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 md:pb-8">
      <Navbar />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Outlet />
      </main>
    </div>
  );
}
