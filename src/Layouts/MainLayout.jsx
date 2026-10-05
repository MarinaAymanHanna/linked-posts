
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

export default function MainLayout() {
    return<>
    <Navbar />


    <div className="min-h-screen w-full pt-16"> 
        <Outlet></Outlet>
    </div>

    <Footer/>



    </>
}
