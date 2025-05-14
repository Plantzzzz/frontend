import {Outlet} from 'react-router-dom'
import Navbar from "../components/dashboard/Navbar.tsx";
import Sidebar from "../components/dashboard/Sidebar.tsx";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <div className="w-full fixed top-0 left-0 z-50">
                <Navbar/>
                <Sidebar/>
                {/*this is where the child page gets rendered*/}
                <Outlet/>
            </div>
        </div>
    )
}

export default DashboardLayout;
