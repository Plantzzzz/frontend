import React, { useEffect, useState } from "react";
import { fetchWeatherData, getSpaceLocation } from "../../scripts/wateringService";

interface TableGridProps {
    spaceId: string;
    rows: number;
    cols: number;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: "inside" | "outside" };
    onCellClick: (row: number, col: number) => void;
    isPlantingMode: boolean;
    currentPlant: string | null;
    isErasing: boolean;
    eraseLocation: boolean;
    erasePlant: boolean;
}

// Hard-coded icons for specific plants
const plantIcons: { [key: string]: string } = {
    "golden pothos": "🌿",
    "Aloe Vera": "🪴",
    "spider plant": "🕸️",
    // Add more mappings here if needed
};

const TableGrid: React.FC<TableGridProps> = ({
                                                 spaceId,
                                                 rows,
                                                 cols,
                                                 plantAssignments,
                                                 cellLocations,
                                                 onCellClick,
                                             }) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [weather, setWeather] = useState<null | {
        temperature: number;
        precipitation: number;
        weatherCode: number;
    }>(null);
    const [rainExpected, setRainExpected] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const { latitude, longitude } = await getSpaceLocation(spaceId);
                const data = await fetchWeatherData(latitude, longitude);

                setWeather({
                    temperature: data.current.temperature_2m,
                    precipitation: data.current.precipitation,
                    weatherCode: data.current.weathercode,
                });

                const next6Hours = data.hourly.precipitation.slice(0, 6);
                const significantRain = next6Hours.some((val: number) => val >= 0.5);
                setRainExpected(significantRain);
            } catch (error: any) {
                console.error("❌ Error fetching weather:", error);
                alert("❌ Error: " + error.message);
            }
        };

        if (spaceId) {
            fetchWeather();
        }
    }, [spaceId]);

    const getWeatherIcon = (code: number) => {
        if ([0].includes(code)) return "☀️";
        if ([1, 2].includes(code)) return "🌤️";
        if ([3].includes(code)) return "☁️";
        if ([45, 48].includes(code)) return "🌫️";
        if ([51, 53, 55, 61, 63].includes(code)) return "🌦️";
        if ([65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
        if ([71, 73, 75, 85, 86].includes(code)) return "❄️";
        if ([95, 96, 99].includes(code)) return "⛈️";
        return "❓";
    };

    const handleMouseDown = (row: number, col: number) => {
        setIsMouseDown(true);
        onCellClick(row, col);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDown) {
            onCellClick(row, col);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const renderGrid = () => {
        const rowsArray = [];

        for (let r = 1; r <= rows; r++) {
            const colsArray = [];
            for (let c = 1; c <= cols; c++) {
                const key = `${r}-${c}`;
                const assignedPlant = plantAssignments[key];
                const location = cellLocations[key];

                let cellClass =
                    "w-20 h-20 border flex items-center justify-center text-sm cursor-pointer ";
                if (location === "inside") cellClass += "bg-blue-300 ";
                else if (location === "outside") cellClass += "bg-yellow-300 ";
                else cellClass += "bg-gray-200 ";

                colsArray.push(
                    <div
                        key={key}
                        className={cellClass}
                        onMouseDown={() => handleMouseDown(r, c)}
                        onMouseEnter={() => handleMouseEnter(r, c)}
                        onMouseUp={handleMouseUp}
                        title={assignedPlant || location || ""}
                    >
                        {assignedPlant && (
                            <span className="text-black font-medium text-sm flex flex-col items-center">
                                <span>{plantIcons[assignedPlant] || "🌱"}</span>
                                <span>{assignedPlant}</span>
                            </span>
                        )}
                    </div>
                );
            }
            rowsArray.push(
                <div key={r} className="flex">
                    {colsArray}
                </div>
            );
        }

        return (
            <div className="flex flex-col">
                {rowsArray}
            </div>
        );
    };

    return (
        <div
            className="select-none flex w-full"
            onMouseLeave={() => setIsMouseDown(false)}
        >
            {/* Left side: Centered table */}
            <div className="w-[85%] flex justify-center">
                {renderGrid()}
            </div>

            {/* Right side: Weather info */}
            <div className="w-[15%] space-y-4">
                {weather && (
                    <div className="p-4 bg-gray-100 rounded shadow flex items-center gap-4">
                        <div className="text-4xl">{getWeatherIcon(weather.weatherCode)}</div>
                        <div className="text-sm text-gray-800">
                            <div><strong>Temperature:</strong> {weather.temperature}°C</div>
                            <div><strong>Precipitation:</strong> {weather.precipitation} mm</div>
                        </div>
                    </div>
                )}

                {rainExpected !== null && (
                    <div
                        className={`p-4 rounded flex items-center gap-4 shadow ${
                            rainExpected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {rainExpected
                            ? "🌧 Rain is expected – watering is not necessary."
                            : "☀️ No rain expected – you might need to water the plants."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableGrid;
