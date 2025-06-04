import { Outlet } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar.tsx";
import Sidebar from "../components/dashboard/Sidebar.tsx";
import { useState } from "react";

function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen overflow-hidden bg-gray-900 text-white">

            {/* Top Navbar */}
            <header className="w-full bg-gray-800 z-50">
                <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            </header>

            {/* Sidebar + Main */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <aside
                    className={`
                        fixed z-40 md:relative md:translate-x-0 bg-gray-900 transition-transform duration-300 
                        w-64 overflow-y-auto border-r border-gray-700
                        top-[56px] md:top-0 bottom-0 p-4
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    `}
                >
                    <Sidebar />
                </aside>

                {/* Page Content */}
                <main
                    className="flex-1 overflow-y-auto z-0"
                    onClick={() => {
                        if (isSidebarOpen) setSidebarOpen(false);
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
