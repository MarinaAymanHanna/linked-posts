import { useContext, useState ,  useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function Navbar() {
    // const [isLoggedin, setIsLoggedin] = useState(
    //   localStorage.getItem("token") != null);

    const { isLoggedin, setIsLoggedin } = useContext(AuthContext);

    const navigate = useNavigate();
    const [showNavbar, setShowNavbar] = useState(true);

    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedin(false);
       // navigate("/login");
    }

        useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // نازل
            setShowNavbar(false);
        } else {
            // طالع
            setShowNavbar(true);
        }

        lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 z-50 w-full bg-slate-50 border-b border-gray-200 transition-transform duration-300 ${ showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="w-full min-h-16 px-10 sm:px-12 lg:px-20 flex items-center justify-between">

            {/* Brand */}
            <Link
            to="/"
            className="font-bold text-sm sm:text-base"
            >
            Linked-Posts
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4 sm:gap-6">

            {isLoggedin ? (
                <>
                <Link
                    to="/profile"
                    className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
                >
                    Profile
                </Link>

                <button
                    onClick={handleLogout}
                    className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
                >
                    LogOut
                </button>
                </>
            ) : (
                <>
                <Link
                    to="/login"
                    className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors"
                >
                    Register
                </Link>
                </>
            )}

            </div>
        </div>
        </nav>
    );
}