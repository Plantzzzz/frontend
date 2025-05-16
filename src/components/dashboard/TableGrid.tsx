import React from "react";

// Notes: add plants by clicking and dragging, make it a separate button (for example) and make maarking easy

interface TableGridProps {
    rows: number;
    cols: number;
    selectedCells: Set<string>;
    editMode: boolean;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: 'inside' | 'outside' };
    onCellClick: (row: number, col: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({
                                                 rows,
                                                 cols,
                                                 selectedCells,
                                                 editMode,
                                                 plantAssignments,
                                                 cellLocations,
                                                 onCellClick,
                                             }) => {

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
  summary: "Zalij rože",
  description: "Zali fikus.",
  start: {
    dateTime: new Date('2025-06-02T18:00:00+02:00').toISOString(), // UTC+2 za Ljubljano poleti
    timeZone: "Europe/Ljubljana",
  },
  end: {
    dateTime: new Date('2025-06-02T19:00:00+02:00').toISOString(), // Traja 1 uro
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
          <div>
                    <button
                onClick={addEventToAppCalendar}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Dodaj dogodek v Google Koledar
            </button>
        <table className="table-auto border-collapse border border-gray-400 text-black">
            <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {Array.from({ length: cols }).map((_, colIndex) => {
                        const key = `${rowIndex}-${colIndex}`;
                        const isSelected = selectedCells.has(key);

                        const location = cellLocations[key];
                        const baseColor = isSelected ? (editMode ? 'bg-yellow-300' : 'bg-blue-300') : 'bg-white';
                        const locationColor = location === 'inside' ? 'bg-green-100' : location === 'outside' ? 'bg-red-100' : '';
                        const cellClasses = `${baseColor} ${locationColor}`;

                        return (
                            <td
                                key={colIndex}
                                className={`border border-gray-400 px-4 py-2 text-center ${editMode || isSelected ? 'cursor-pointer' : ''} ${cellClasses}`}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                            >
                                <div>{`R${rowIndex + 1}C${colIndex + 1}`}</div>
                                <div className="text-sm text-green-700">
                                    {plantAssignments[key] || ''}
                                </div>
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default TableGrid;
