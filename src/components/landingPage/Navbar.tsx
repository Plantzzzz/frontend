import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/icon2.png";

const baseURL = "/landingPage";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link to={baseURL} className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-gray-900">PetalBot</span>
                </Link>

                {/* Right-side Nav and Button */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link to={baseURL} className="text-gray-700 hover:text-green-600 transition">Home</Link>
                    <Link to={`${baseURL}/about`} className="text-gray-700 hover:text-green-600 transition">About</Link>
                    <Link to={`${baseURL}/contact`} className="text-gray-700 hover:text-green-600 transition">Contact</Link>

                    <Link to={`${baseURL}/register`}>
                        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition">
                            Get started
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Icon (optional) */}
                <div className="md:hidden">
                    <button type="button" className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
