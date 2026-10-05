import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return<main className="bg-sky-50 min-h-screen">
    <Outlet></Outlet>
    </main>
}
