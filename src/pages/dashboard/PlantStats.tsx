import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import IndoorOutdoorPieChart from "../../components/dashboard/stats/IndoorOutdoorPieChart";
import PlantCountChart from "../../components/dashboard/stats/PlantCountChart";
import WateringTracker from "../../components/dashboard/stats/WateringTracker";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const PlantStatsDashboard: React.FC = () => {
    const layouts = {
        lg: [
            { i: "watering", x: 0, y: 1, w: 12, h: 2, static: true },
            { i: "pie", x: 0, y: 0, w: 6, h: 4, static: true },
            { i: "bar", x: 6, y: 0, w: 6, h: 4, static: true },
        ],
        md: [
            { i: "watering", x: 0, y: 2, w: 10, h: 2, static: true },
            { i: "pie", x: 0, y: 0, w: 5, h: 4, static: true },
            { i: "bar", x: 5, y: 0, w: 5, h: 4, static: true },
        ],
        sm: [
            { i: "watering", x: 0, y: 2, w: 6, h: 2, static: true },
            { i: "pie", x: 0, y: 0, w: 6, h: 4, static: true },
            { i: "bar", x: 0, y: 4, w: 6, h: 4, static: true },
        ],
        xs: [
            { i: "watering", x: 0, y: 2, w: 4, h: 2, static: true },
            { i: "pie", x: 0, y: 0, w: 4, h: 4, static: true },
            { i: "bar", x: 0, y: 4, w: 4, h: 4, static: true },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
                rowHeight={100}
                isResizable={false}
                isDraggable={false}
            >
                <div key="watering" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="font-bold mb-2">Watering Tracker</div>
                    <WateringTracker />
                </div>
                <div key="pie" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="font-bold mb-2">Pie Chart</div>
                    <IndoorOutdoorPieChart />
                </div>
                <div key="bar" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="font-bold mb-2">Bar Chart</div>
                    <PlantCountChart />
                </div>
            </ResponsiveGridLayout>
        </div>
    );
};

export default PlantStatsDashboard;
