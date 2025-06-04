import {
    HiOutlineViewGrid,
    HiChevronDown,
    HiChevronUp,
    HiOutlineClipboardCheck,
    HiOutlineDocumentText,
    HiOutlineCalendar,
    HiCollection,
} from "react-icons/hi";
import { HiOutlinePhoto } from "react-icons/hi2";
import { GiFlowerPot } from "react-icons/gi";
import { PiGraphThin } from "react-icons/pi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface SidebarLinkProps {
    to: string;
    icon: React.ElementType;
    label: string;
}

const SidebarLink = ({ to, icon: Icon, label }: SidebarLinkProps) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                    ? "bg-green-700/20 text-green-300"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
        >
            <Icon className="text-lg" />
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
        setOpenGarden(
            location.pathname.startsWith(`${dirRoot}/spaces`) ||
            location.pathname.startsWith(`${dirRoot}/plants`) ||
            location.pathname.startsWith(`${dirRoot}/stats`) ||
            location.pathname.startsWith(`${dirRoot}/plantRecognition`)
        );
        setOpenCollections(
            location.pathname.startsWith(`${dirRoot}/tips`) ||
            location.pathname.startsWith(`${dirRoot}/todo`) ||
            location.pathname.startsWith(`${dirRoot}/notes`) ||
            location.pathname.startsWith(`${dirRoot}/images`)
        );
    }, [location.pathname]);

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-700 text-white h-full p-4 rounded-tr-2xl rounded-br-2xl shadow-xl">
            <nav className="space-y-4 text-sm font-medium mt-5 md:mt-0">
                {/* Dashboard */}
                <SidebarLink to={`${dirRoot}`} icon={HiOutlineViewGrid} label="Dashboard" />

                {/* My Garden */}
                <div className="rounded-lg border border-gray-700">
                    <button
                        onClick={() => setOpenGarden(!openGarden)}
                        className={`flex w-full items-center justify-between px-3 py-2 rounded-t-lg font-semibold transition-all duration-200 ${
                            location.pathname.startsWith(`${dirRoot}/spaces`) ||
                            location.pathname.startsWith(`${dirRoot}/plants`) ||
                            location.pathname.startsWith(`${dirRoot}/stats`) ||
                            location.pathname.startsWith(`${dirRoot}/plantRecognition`)
                                ? "bg-green-700/20 text-green-300"
                                : "text-white hover:bg-gray-800"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <HiCollection className="text-lg" />
                            My Garden
                        </span>
                        {openGarden ? <HiChevronUp /> : <HiChevronDown />}
                    </button>
                    <div
                        className={`ml-2 mr-2 mt-1 overflow-hidden transition-all duration-300 ${
                            openGarden ? "max-h-40" : "max-h-0"
                        }`}
                    >
                        <SidebarLink to={`${dirRoot}/spaces`} icon={HiOutlineViewGrid} label="Spaces" />
                        <SidebarLink to={`${dirRoot}/plants`} icon={GiFlowerPot} label="Plants" />
                        <SidebarLink to={`${dirRoot}/stats`} icon={PiGraphThin} label="Statistics" />
                        <SidebarLink to={`${dirRoot}/plantRecognition`} icon={FaMagnifyingGlass} label="Plant Recognition" />
                    </div>
                </div>

                {/* Collections */}
                <div className="rounded-lg border border-gray-700">
                    <button
                        onClick={() => setOpenCollections(!openCollections)}
                        className={`flex w-full items-center justify-between px-3 py-2 rounded-t-lg font-semibold transition-all duration-200 ${
                            location.pathname.startsWith(`${dirRoot}/tips`) ||
                            location.pathname.startsWith(`${dirRoot}/todo`) ||
                            location.pathname.startsWith(`${dirRoot}/notes`) ||
                            location.pathname.startsWith(`${dirRoot}/images`)
                                ? "bg-green-700/20 text-green-300"
                                : "text-white hover:bg-gray-800"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <HiOutlineClipboardCheck className="text-lg" />
                            Collections
                        </span>
                        {openCollections ? <HiChevronUp /> : <HiChevronDown />}
                    </button>
                    <div
                        className={`ml-2 mr-2 mt-1 overflow-hidden transition-all duration-300 ${
                            openCollections ? "max-h-64" : "max-h-0"
                        }`}
                    >
                        <SidebarLink to={`${dirRoot}/tips`} icon={HiOutlineCalendar} label="Seasonal Tips" />
                        <SidebarLink to={`${dirRoot}/notes`} icon={HiOutlineDocumentText} label="Notes" />
                        <SidebarLink to={`${dirRoot}/images`} icon={HiOutlinePhoto} label="Images" />
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default MySidebar;
