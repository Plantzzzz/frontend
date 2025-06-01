import { useEffect, useState, useRef } from "react";
import { sowingCalendar } from "../../scripts/sowingCalendar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const activityColors: Record<string, string> = {
  sow: "#a5d6a7",
  transplant: "#fff59d",
  prune: "#ce93d8",
  fertilize: "#ffcc80",
  harvest: "#ffab91",
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

  const exportToPDF = (selectedPlants: string[]) => {
    const doc = new jsPDF("landscape");
    const headers = ["Plant", ...months];

    const rows = visiblePlants.map(plant => {
      const actions = sowingCalendar[plant];
      const row = [plant];
      for (let i = 1; i <= 12; i++) {
        const monthActivities = Object.entries(actions)
          .filter(([type, months]) =>
            selectedActivityTypes.includes(type) && months?.includes(i)
          )
          .map(([type]) => activityIcons[type] || type);
        row.push(monthActivities.join(" "));
      }
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        halign: "center",
      },
      margin: { top: 20 },
    });

    doc.save("seasonal_calendar.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🌱 Seasonal Planting Calendar</h1>

      {/* Export gumbi */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => exportToPDF(selectedPlants)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🖨️ Export to PDF (Text Table)
        </button>
      </div>

      {/* Filtriranje po aktivnostih */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Filter by activity type:</p>
        <div className="flex flex-wrap gap-3">
          {activityTypes.map(type => {
            const isActive = selectedActivityTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleActivityType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-800 border-gray-300 bg-white hover:bg-gray-100"
                }`}
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
<div className="mb-6">
  <h2 className="font-semibold mb-2">Filter: Choose Plants</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[250px] overflow-y-auto border p-4 rounded-md bg-gray-600">
    {allPlants.map(plant => (
      <label
        key={plant}
        className={`flex items-center gap-2 text-sm p-2 border rounded-md cursor-pointer transition-all 
          ${selectedPlants.includes(plant) ? 'bg-green-600 border-green-400' : 'bg-gray-500 hover:bg-gray-600'}`}>
        <input
          type="checkbox"
          checked={selectedPlants.includes(plant)}
          onChange={() => togglePlant(plant)}
          className="accent-green-600"
        />
        <span className="capitalize">{plant}</span>
      </label>
    ))}
  </div>
</div>


      {/* Koledar */}
      <div ref={calendarRef}>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse w-full text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-600 text-left text-white">Plant</th>
                {months.map((m, i) => (
                  <th key={i} className="border p-2 bg-gray-600 text-center text-white">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiblePlants.map(plant => {
                const actions = sowingCalendar[plant];
                return (
                  <tr key={plant}>
                    <td className="border p-2 font-medium capitalize">{plant}</td>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      const activities = Object.entries(actions)
                        .filter(
                          ([type, months]) =>
                            selectedActivityTypes.includes(type) && months?.includes(month)
                        )
                        .map(([type]) => type);

                      return (
                        <td key={i} className="border p-1 text-center">
                          {activities.map(act => (
                            <span
                              key={act}
                              className="inline-block w-3 h-3 rounded-full mr-1"
                              title={act}
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
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Legend:</p>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(activityColors).map(([activity, color]) => (
              <div key={activity} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
