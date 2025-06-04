import { useEffect, useState, useRef } from "react";
import { sowingCalendar } from "../../scripts/sowingCalendar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const activityColors: Record<string, string> = {
  sow: "#81c784",          // malo bolj temna zelena
  transplant: "#fdd835",   // bolj zlatorumena
  prune: "#ba68c8",        // bolj vijolična
  fertilize: "#ffb74d",    // oranžna
  harvest: "#ff8a65",      // koralna
};

const activityIcons: Record<string, string> = {
  sow: "Sow",
  transplant: "Transplant",
  prune: "Prune",
  fertilize: "Fertilize",
  harvest: "Harvest",
};

export default function SeasonalCalendar() {
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<string[]>(["sow", "transplant", "prune", "fertilize", "harvest"]);
  const calendarRef = useRef<HTMLDivElement>(null);

  const allPlants = Object.keys(sowingCalendar).sort();
  const activityTypes = Object.keys(activityIcons);

  useEffect(() => {
    const saved = localStorage.getItem("selectedPlants");
    if (saved) {
      setSelectedPlants(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPlants", JSON.stringify(selectedPlants));
  }, [selectedPlants]);

  const togglePlant = (plant: string) => {
    setSelectedPlants(prev =>
      prev.includes(plant) ? prev.filter(p => p !== plant) : [...prev, plant]
    );
  };

  const toggleActivityType = (type: string) => {
    setSelectedActivityTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const visiblePlants = selectedPlants.length > 0 ? selectedPlants : allPlants;

const pdfActivityColors: Record<string, [number, number, number]> = {
  sow: [56, 142, 60],       // temna zelena
  transplant: [251, 192, 45], // temno rumena
  prune: [123, 31, 162],     // temna vijolična
  fertilize: [255, 152, 0],  // temno oranžna
  harvest: [244, 81, 30],    // temno rdeča
};

const exportToPDF = (selectedPlants: string[]) => {
  const doc = new jsPDF("landscape");
  const headers = ["Plant", ...months];

  // Priprava vrstic za tabelo
  const rows = visiblePlants.map(plant => {
    const actions = sowingCalendar[plant];
    const row = [plant];
    for (let i = 1; i <= 12; i++) {
      const monthActivities = Object.entries(actions)
        .filter(([type, months]) =>
          selectedActivityTypes.includes(type) && months?.includes(i)
        )
        .map(([type]) => activityIcons[type] || type);
      row.push(monthActivities.join(", "));
    }
    return row;
  });

  // Tabela z barvami celic za aktivnosti
  const cellStyles = (rowIndex: number, colIndex: number) => {
    if (colIndex === 0) return {}; // prva kolona - ime rastline, ni barve
    const plant = visiblePlants[rowIndex];
    const month = colIndex;
    const actions = sowingCalendar[plant];
    const activeTypes = Object.entries(actions)
      .filter(([type, months]) =>
        selectedActivityTypes.includes(type) && months?.includes(month)
      )
      .map(([type]) => type);

    if (activeTypes.length === 0) return {};

    // Za PDF bomo uporabili prvo aktivnost v celici za barvo ozadja
    const firstType = activeTypes[0];
    const rgb = pdfActivityColors[firstType];
    if (!rgb) return {};

    return { fillColor: rgb };
  };

  autoTable(doc, {
    head: [headers],
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: 20, // temno besedilo
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      halign: "center",
    },
    margin: { top: 20 },
    didParseCell: (data) => {
      if (data.section === 'body') {
        const style = cellStyles(data.row.index, data.column.index);
        if (style.fillColor) {
          data.cell.styles.fillColor = style.fillColor;
          data.cell.styles.textColor = 255; // belo besedilo na barvnem ozadju
        }
      }
    },
  });

  doc.save("seasonal_calendar.pdf");
};


  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-200 font-sans">
      <h1 className="text-3xl font-extrabold mb-6 text-green-400 select-none">🌱 Seasonal Planting Calendar</h1>

      {/* Export gumbi */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => exportToPDF(selectedPlants)}
          className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition shadow-md"
        >
          🖨️ Export to PDF (Text Table)
        </button>
      </div>

      {/* Filtriranje po aktivnostih */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2 text-gray-300">Filter by activity type:</p>
        <div className="flex flex-wrap gap-3">
          {activityTypes.map(type => {
            const isActive = selectedActivityTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleActivityType(type)}
                className={`px-4 py-1 rounded-full text-sm font-semibold border transition
                  ${isActive
                    ? "text-gray-900"
                    : "text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-gray-200"}
                `}
                style={{
                  backgroundColor: isActive ? activityColors[type] : undefined,
                  borderColor: isActive ? activityColors[type] : undefined,
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtriranje po rastlinah */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3 text-gray-300">Filter: Choose Plants</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[250px] overflow-y-auto border border-gray-700 p-4 rounded-md bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
          {allPlants.map(plant => (
            <label
              key={plant}
              className={`flex items-center gap-2 text-sm p-2 border rounded-md cursor-pointer transition-all select-none
                ${selectedPlants.includes(plant) ? 'bg-green-700 border-green-500 text-green-200' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}
              `}
            >
              <input
                type="checkbox"
                checked={selectedPlants.includes(plant)}
                onChange={() => togglePlant(plant)}
                className="accent-green-500"
              />
              <span className="capitalize">{plant}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Koledar */}
      <div ref={calendarRef} className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
        <table className="table-auto border-collapse w-full text-sm text-gray-100">
          <thead>
            <tr>
              <th className="border-b border-gray-700 p-3 bg-gray-700 text-left font-semibold">Plant</th>
              {months.map((m, i) => (
                <th
                  key={i}
                  className="border-b border-gray-700 p-2 bg-gray-700 text-center font-semibold"
                  title={`Month: ${m}`}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiblePlants.map(plant => {
              const actions = sowingCalendar[plant];
              return (
                <tr
                  key={plant}
                  className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition-colors cursor-default"
                >
                  <td className="border border-gray-700 p-2 font-medium capitalize">{plant}</td>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const activities = Object.entries(actions)
                      .filter(
                        ([type, months]) =>
                          selectedActivityTypes.includes(type) && months?.includes(month)
                      )
                      .map(([type]) => type);

                    return (
                      <td key={i} className="border border-gray-700 p-1 text-center">
                        {activities.map(act => (
                          <span
                            key={act}
                            className="inline-block w-4 h-4 rounded-full mr-1"
                            title={act.charAt(0).toUpperCase() + act.slice(1)}
                            style={{ backgroundColor: activityColors[act] }}
                          ></span>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="mt-6 text-gray-300">
        <p className="text-sm font-semibold mb-2">Legend:</p>
        <div className="flex gap-6 flex-wrap">
          {Object.entries(activityColors).map(([activity, color]) => (
            <div key={activity} className="flex items-center gap-2 text-sm select-none">
              <div
                className="w-4 h-4 rounded-full border border-gray-600"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
