import { useState } from "react";
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
import { Link, useLocation } from "react-router-dom";

const MySidebar = () => {
    const [openGarden, setOpenGarden] = useState(true);
    const [openCollections, setOpenCollections] = useState(false);
    const dirRoot = "/dashboard";
    const location = useLocation();

    return (
        <aside className="w-64 bg-gray-900 text-white h-full p-4 border-r border-gray-700">
            <nav className="space-y-2 text-sm font-medium">
                {/* Dashboard */}
                <Link
                    to={`${dirRoot}`}
                    className={`flex items-center gap-2 p-2 rounded font-semibold hover:bg-gray-800 ${
                        location.pathname === dirRoot ? "bg-green-600/30 text-green-300" : "text-white"
                    }`}
                >
                    <HiOutlineViewGrid className="text-xl" />
                    Dashboard
                </Link>

                {/* My Garden */}
                <button
                    onClick={() => setOpenGarden(!openGarden)}
                    className="flex w-full items-center justify-between p-2 hover:bg-gray-800 rounded text-white"
                >
                    <span className="flex items-center gap-2 font-semibold ">
                        <HiCollection className="text-xl" />
                        My Garden
                    </span>
                    {openGarden ? <HiChevronUp /> : <HiChevronDown />}
                </button>
                {openGarden && (
                    <div className="ml-6 space-y-1">
                        <Link to={`${dirRoot}/spaces`} className="flex items-center gap-2 p-1 text-gray-300 hover:bg-gray-800 rounded">
                            <HiOutlineViewGrid />
                            Spaces
                        </Link>
                        <Link to={`${dirRoot}/plants`} className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                            <GiFlowerPot />
                            Plants
                        </Link>
                    </div>
                )}

                {/* Collections */}
                <button
                    onClick={() => setOpenCollections(!openCollections)}
                    className="flex w-full items-center justify-between p-2 hover:bg-gray-800 rounded text-white"
                >
                    <span className="flex items-center gap-2 font-semibold">
                        <HiOutlineClipboardCheck className="text-xl" />
                        Collections
                    </span>
                    {openCollections ? <HiChevronUp /> : <HiChevronDown />}
                </button>
                {openCollections && (
                    <div className="ml-6 space-y-1">
                        <Link to={`${dirRoot}/schedule`} className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                            <HiOutlineCalendar />
                            Feeding Schedule
                        </Link>
                        <Link to={`${dirRoot}/todo`} className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                            <HiOutlineClipboardCheck />
                            ToDo
                        </Link>
                        <Link to={`${dirRoot}/notes`} className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                            <HiOutlineDocumentText />
                            Notes
                        </Link>
                        <Link to={`${dirRoot}/images`} className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                            <HiOutlinePhoto />
                            Images
                        </Link>
                    </div>
                )}
            </nav>
        </aside>
    );
};

export default MySidebar;
