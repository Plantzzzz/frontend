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
    const username = user?.displayName || "Guest";
    const profileImage = user?.profileImage || user?.photoURL || "";

    const handleProfileClick = () => {
        navigate("/dashboard/user");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 py-3">
            {/* Brand - always left-aligned */}
            <a
                href="/dashboard"
                className="flex items-center gap-3 hover:opacity-90 transition"
            >
                <img src={logo} alt="Logo" className="h-9 w-9" />
                <span className="text-xl md:text-2xl font-bold text-green-400">
                    PetalBot
                </span>
            </a>

            {/* Profile & Menu - aligned to right */}
            <div className="flex items-center gap-4">
                {/* Profile Button - Desktop */}
                <button
                    onClick={handleProfileClick}
                    type="button"
                    className="hidden md:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium text-white border border-gray-600 shadow-sm"
                >
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-green-400"
                    />
                    <span>{username}</span>
                </button>

                {/* Profile Button - Mobile */}
                <button
                    onClick={handleProfileClick}
                    type="button"
                    className="md:hidden focus:outline-none transition-transform hover:scale-105"
                >
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-green-400"
                    />
                </button>

                {/* Sidebar Toggle Button - Mobile */}
                <button
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                    className="md:hidden text-gray-200 hover:text-green-400 text-2xl transition"
                >
                    <HiMenu />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
