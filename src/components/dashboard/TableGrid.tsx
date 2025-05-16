import React, { useState } from "react";

interface TableGridProps {
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
                                                 rows,
                                                 cols,
                                                 plantAssignments,
                                                 cellLocations,
                                                 onCellClick,
                                             }) => {
    const [isMouseDown, setIsMouseDown] = useState(false);

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

                let cellClass = "w-20 h-20 border flex items-center justify-center text-sm cursor-pointer ";
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
                            <span className="text-black font-medium text-sm">{assignedPlant}</span>
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

        return rowsArray;
    };
    const findOrCreateAppCalendar = async (accessToken: string) => {
  // 1. Pokliči calendarList in takoj preveri status
  const listRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!listRes.ok) {
    const error = await listRes.json();
    console.error("Napaka pri branju calendarList:", error);
    throw new Error("Ni dovoljenja za branje seznama koledarjev.");
  }

  // 2. Če je vse OK, nadaljuj z branjem podatkov
  const listData = await listRes.json();

  const existing = listData.items.find((cal: any) => cal.summary === "Moja Aplikacija");
  if (existing) return existing.id;

  // 3. Če ni, ustvari nov koledar
  const createRes = await fetch("https://www.googleapis.com/calendar/v3/calendars", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: "Moja Aplikacija",
      timeZone: "Europe/Ljubljana",
    }),
  });

  if (!createRes.ok) {
    const error = await createRes.json();
    console.error("Napaka pri ustvarjanju koledarja:", error);
    throw new Error("Napaka pri ustvarjanju koledarja.");
  }

  const newCal = await createRes.json();
  return newCal.id;
};


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
    dateTime: new Date('2025-07-04T10:00:00+02:00').toISOString(), // UTC+2 za Ljubljano poleti
    timeZone: "Europe/Ljubljana",
  },
  end: {
    dateTime: new Date('2025-07-04T13:00:00+02:00').toISOString(), // Traja 1 uro
    timeZone: "Europe/Ljubljana",
  },
};


  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (res.ok) alert("Dogodek dodan!");
  else alert("Napaka pri dodajanju dogodka.");
};

    return (
        <div
            className="select-none"
            onMouseLeave={() => setIsMouseDown(false)}
        >
        <button
                onClick={addEventToAppCalendar}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Dodaj dogodek v Google Koledar
        </button>
            {renderGrid()}
            
        </div>
    );
};

export default TableGrid;
