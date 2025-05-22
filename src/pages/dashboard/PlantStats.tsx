import React from "react";
import GridLayout from "react-grid-layout";
import IndoorOutdoorPieChart from "./stats/IndoorOutdoorPieChart";
import PlantCountChart from "./stats/PlantCountChart";
import WateringTracker from "./stats/WateringTracker";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const PlantStatsDashboard: React.FC = () => {
    const layout = [
        { i: "pie", x: 0, y: 0, w: 6, h: 4 },
        { i: "bar", x: 6, y: 0, w: 6, h: 4 },
        { i: "watering", x: 0, y: 1, w: 12, h: 2 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Plant Statistics Dashboard</h1>

            <GridLayout
                className="layout"
                layout={layout}
                cols={12}
                rowHeight={100}
                width={1200}
                draggableHandle=".drag-handle"
            >
                <div key="pie" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="drag-handle cursor-move font-bold mb-2">↕ Pie Chart</div>
                    <IndoorOutdoorPieChart />
                </div>

                <div key="bar" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="drag-handle cursor-move font-bold mb-2">↕ Bar Chart</div>
                    <PlantCountChart />
                </div>

                <div key="watering" className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="drag-handle cursor-move font-bold mb-2">↕ Watering Tracker</div>
                    <WateringTracker />
                </div>
            </GridLayout>
        </div>
    );
};

export default PlantStatsDashboard;
