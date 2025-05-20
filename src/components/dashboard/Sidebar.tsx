import {
    HiOutlineViewGrid,
    HiChevronDown,
    HiChevronUp,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineCalendar,
    HiCollection,
} from "react-icons/hi";
import {HiOutlinePhoto} from "react-icons/hi2";
import {GiFlowerPot} from "react-icons/gi";
import {useEffect, useState} from "react";
import {useLocation, Link} from "react-router-dom";

const SidebarLink = ({to, icon: Icon, label}: { to: string; icon: any; label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                isActive
                    ? "bg-green-50/10 text-green-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
        >
            <Icon className="text-lg"/>
            {label}
        </Link>
    );
};

const MySidebar = () => {
    const dirRoot = "/dashboard";
    const location = useLocation();
    const [openGarden, setOpenGarden] = useState(false);
    const [openCollections, setOpenCollections] = useState(false);

    useEffect(() => {
        setOpenGarden(location.pathname.startsWith(`${dirRoot}/spaces`) || location.pathname.startsWith(`${dirRoot}/plants`));
        setOpenCollections(
            location.pathname.startsWith(`${dirRoot}/schedule`) ||
            location.pathname.startsWith(`${dirRoot}/todo`) ||
            location.pathname.startsWith(`${dirRoot}/notes`) ||
            location.pathname.startsWith(`${dirRoot}/images`)
        );
    }, [location.pathname]);

    return (
        <aside className="w-64 bg-gray-900 text-white h-full p-4 border-r border-gray-700 overflow-y-auto">
            <nav className="space-y-3 text-sm font-medium">

                {/* Dashboard */}
                <SidebarLink to={`${dirRoot}`} icon={HiOutlineViewGrid} label="Dashboard"/>

                {/* My Garden */}
                <div>
                    <button
                        onClick={() => setOpenGarden(!openGarden)}
                        className={`flex w-full items-center justify-between px-3 py-2 rounded font-semibold transition-colors ${
                            location.pathname.startsWith(`${dirRoot}/spaces`) ||
                            location.pathname.startsWith(`${dirRoot}/plants`)
                                ? "bg-green-600/30 text-green-300"
                                : "text-white hover:bg-gray-800"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <HiCollection className="text-lg"/>
                            My Garden
                        </span>
                        {openGarden ? <HiChevronUp/> : <HiChevronDown/>}
                    </button>
                    <div
                        className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                            openGarden ? "max-h-40" : "max-h-0"
                        }`}
                    >
                        <SidebarLink to={`${dirRoot}/spaces`} icon={HiOutlineViewGrid} label="Spaces"/>
                        <SidebarLink to={`${dirRoot}/plants`} icon={GiFlowerPot} label="Plants"/>
                    </div>
                </div>

                {/* Collections */}
                <div>
                    <button
                        onClick={() => setOpenCollections(!openCollections)}
                        className={`flex w-full items-center justify-between px-3 py-2 rounded font-semibold transition-colors ${
                            location.pathname.startsWith(`${dirRoot}/schedule`) ||
                            location.pathname.startsWith(`${dirRoot}/todo`) ||
                            location.pathname.startsWith(`${dirRoot}/notes`) ||
                            location.pathname.startsWith(`${dirRoot}/images`)
                                ? "bg-green-600/30 text-green-300"
                                : "text-white hover:bg-gray-800"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <HiOutlineClipboardCheck className="text-lg"/>
                            Collections
                        </span>
                        {openCollections ? <HiChevronUp/> : <HiChevronDown/>}
                    </button>
                    <div
                        className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                            openCollections ? "max-h-64" : "max-h-0"
                        }`}
                    >
                        <SidebarLink to={`${dirRoot}/schedule`} icon={HiOutlineCalendar} label="Feeding Schedule"/>
                        {/*<SidebarLink to={`${dirRoot}/todo`} icon={HiOutlineClipboardCheck} label="ToDo"/>*/}
                        <SidebarLink to={`${dirRoot}/notes`} icon={HiOutlineDocumentText} label="Notes"/>
                        <SidebarLink to={`${dirRoot}/images`} icon={HiOutlinePhoto} label="Images"/>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default MySidebar;
