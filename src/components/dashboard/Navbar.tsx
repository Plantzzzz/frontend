import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/icon2.png";
import { HiMenu } from "react-icons/hi";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const email = user?.email || "Email";
    const username = user?.displayName || "Guest";
    const profileImage = user?.profileImage || user?.photoURL || "";

    const handleProfileClick = () => {
        navigate("/dashboard/user");
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/dashboard" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={logo} className="h-8" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        PetalBot
                    </span>
                </a>

                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Profile button - desktop */}
                    <button
                        onClick={handleProfileClick}
                        type="button"
                        className="hidden md:flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{username}</span>
                    </button>

                    {/* Profile button - mobile (only image) */}
                    <button
                        onClick={handleProfileClick}
                        type="button"
                        className="md:hidden focus:outline-none"
                    >
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                        />
                    </button>

                    {/* Toggle Sidebar button - mobile only */}
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <HiMenu />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
