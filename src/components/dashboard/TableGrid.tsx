import React, { useEffect, useState } from "react";
import {
  fetchWeatherData,
  getSpaceLocation,
} from "../../scripts/wateringService";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(null); // počisti prejšnjo napako
      } catch (error: any) {
        console.error("❌ Error fetching weather:", error);
        setErrorMessage(
          "⚠️ Unable to retrieve location, please set it."
        );
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
          "w-24 h-24 border border-gray-700 cursor-pointer flex items-center justify-center rounded-md transition duration-150 ease-in-out ";

        if (location === "inside") cellClass += "bg-blue-700 hover:bg-blue-600";
        else if (location === "outside")
          cellClass += "bg-yellow-400 hover:bg-yellow-300";
        else cellClass += "bg-gray-600 hover:bg-gray-500";

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
              <span className="text-white font-semibold text-base text-center">
                {assignedPlant}
              </span>
            )}
          </div>
        );
      }

      rowsArray.push(
        <div key={r} className="flex gap-1 mb-1">
          {colsArray}
        </div>
      );
    }

    return (
      <div className="p-6 rounded-lg shadow-md border border-gray-700 bg-gray-800 w-fit">
        {rowsArray}
      </div>
    );
  };
/*
  const findOrCreateAppCalendar = async (accessToken: string) => {
    // 1. Pokliči calendarList in takoj preveri status
    const listRes = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!listRes.ok) {
      const error = await listRes.json();
      console.error("Napaka pri branju calendarList:", error);
      throw new Error("Ni dovoljenja za branje seznama koledarjev.");
    }

    // 2. Če je vse OK, nadaljuj z branjem podatkov
    const listData = await listRes.json();

    const existing = listData.items.find(
      (cal: any) => cal.summary === "Moja Aplikacija"
    );
    if (existing) return existing.id;

    // 3. Če ni, ustvari nov koledar
    const createRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: "Moja Aplikacija",
          timeZone: "Europe/Ljubljana",
        }),
      }
    );

    if (!createRes.ok) {
      const error = await createRes.json();
      console.error("Napaka pri ustvarjanju koledarja:", error);
      throw new Error("Napaka pri ustvarjanju koledarja.");
    }

    const newCal = await createRes.json();
    return newCal.id;
  };
/*
  const addEventToAppCalendar = async () => {
    const accessToken = localStorage.getItem("calendarToken");
    if (!accessToken) {
      alert("Uporabnik ni prijavljen.");
      return;
    }

    const calendarId = await findOrCreateAppCalendar(accessToken);

    const event = {
      summary: "Poreži rožmarin",
      description: "Poreži rožmarin.",
      start: {
        dateTime: new Date("2025-07-04T10:00:00+02:00").toISOString(), // UTC+2 za Ljubljano poleti
        timeZone: "Europe/Ljubljana",
      },
      end: {
        dateTime: new Date("2025-07-04T13:00:00+02:00").toISOString(), // Traja 1 uro
        timeZone: "Europe/Ljubljana",
      },
    };

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (res.ok) alert("Dogodek dodan!");
    else alert("Napaka pri dodajanju dogodka.");
  };
*/
  return (
    <div
      className="select-none flex justify-center items-start w-full min-h-screen bg-gray-900 py-8"
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <div className="flex w-full max-w-[90%] gap-8">
        {/* Levi del: tabela */}
        <div className="flex-1 flex justify-center">{renderGrid()}</div>

        {/* Desni del: vreme in opozorilo */}
        <div className="w-[250px] space-y-4">
          {errorMessage && (
            <div className="p-4 bg-yellow-900 text-yellow-200 rounded shadow">
              {errorMessage}
            </div>
          )}
          {weather && (
            <div className="p-4 bg-gray-800 text-white rounded shadow flex items-center gap-4">
              <div className="text-4xl">
                {getWeatherIcon(weather.weatherCode)}
              </div>
              <div className="text-sm">
                <div>
                  <strong>Temperature:</strong> {weather.temperature}°C
                </div>
                <div>
                  <strong>Precipitation:</strong> {weather.precipitation} mm
                </div>
              </div>
            </div>
          )}

          {rainExpected !== null && (
            <div
              className={`p-4 rounded flex items-center gap-4 shadow ${
                rainExpected
                  ? "bg-green-900 text-green-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {rainExpected
                ? "🌧 Rain is expected – watering is not necessary."
                : "☀️ No rain expected – you might need to water the plants."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableGrid;
