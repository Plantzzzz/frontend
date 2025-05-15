import { Link } from "react-router-dom";

const baseURL = "/landingPage";

export const Footer = () => (
    <footer className="bg-black text-white px-6 md:px-12 py-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
                <h4 className="text-2xl font-bold mb-4">PetalBot</h4>
                <p className="text-sm text-gray-400 mb-6">
                    A student-built project helping you grow smarter. Tailored for hobbyists, researchers, and indoor garden lovers.
                </p>
            </div>

            <div>
                <h5 className="text-lg font-semibold text-white mb-2">Navigation</h5>
                <ul className="space-y-2">
                    <li>
                        <Link to={`${baseURL}`} className="text-sm text-gray-400 hover:text-white transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={`${baseURL}/about`} className="text-sm text-gray-400 hover:text-white transition">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to={`${baseURL}/docs`} className="text-sm text-gray-400 hover:text-white transition">
                            Docs
                        </Link>
                    </li>
                    <li>
                        <Link to={`${baseURL}/contact`} className="text-sm text-gray-400 hover:text-white transition">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <h5 className="text-lg font-semibold text-white mb-2">Project Info</h5>
                <ul className="space-y-2">
                    <li>
                        <a href="https://github.com/Plantzzzz" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition">
                            GitHub Repository
                        </a>
                    </li>
                    <li>
                        <a href="https://feri.um.si" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition">
                            Our University
                        </a>
                    </li>
                    <li>
                        <Link to={`${baseURL}/terms`} className="text-sm text-gray-400 hover:text-white transition">
                            Privacy & Terms
                        </Link>
                    </li>
                </ul>
            </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} PetalBot — Created by FERI students. All rights reserved.
        </div>
    </footer>
);
