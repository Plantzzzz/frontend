export const Footer = () => (
    <footer className="bg-black text-white px-6 md:px-12 py-16">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
                <h4 className="text-2xl font-bold mb-4">PetalBot</h4>
                <p className="text-sm text-gray-400 mb-6">
                    A student-built project helping you grow smarter. Tailored for hobbyists, researchers, and indoor garden lovers.
                </p>
                <div className="flex gap-4 text-gray-400 text-xl">
                    <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                    <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                    <a href="#" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            <div>
                <h5 className="text-lg font-semibold text-white mb-2">Navigation</h5>
                <ul className="space-y-2">
                    {["Home", "Features", "Docs", "Contact"].map((link, i) => (
                        <li key={i}>
                            <a href="#" className="text-sm text-gray-400 hover:text-white transition">
                                {link}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h5 className="text-lg font-semibold text-white mb-2">Project Info</h5>
                <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">GitHub Repository</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Our University</a></li>
                    <li><a href="#" className="text-sm text-gray-400 hover:text-white transition">Privacy & Terms</a></li>
                </ul>
            </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-center text-gray-500">
            &copy; {new Date().getFullYear()} PetalBot — Created by FERI students. All rights reserved.
        </div>
    </footer>
);