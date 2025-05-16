import { Outlet } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar.tsx";
import Sidebar from "../components/dashboard/Sidebar.tsx";

function DashboardLayout() {
    return (
        <div className="flex flex-col min-h-screen overflow-auto bg-gray-900 text-white">
            {/* Top Navbar */}
            <header className="w-full bg-gray-800 z-50">
                <Navbar />
            </header>

            {/* Sidebar + Main */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
