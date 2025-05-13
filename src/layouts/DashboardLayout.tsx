import {Outlet} from 'react-router-dom'
import Navbar from "../pages/dashboard/Navbar.tsx";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <Outlet/> {/* This is where child pages get rendered */}
        </div>
    )
}

export default DashboardLayout;
