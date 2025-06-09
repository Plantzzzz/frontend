import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Popravljena ikona markerja
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Direction = "top" | "bottom" | "left" | "right";

interface SetGridPopupProps {
  spaceId: string;
  latitude?: number;
  longitude?: number;
  onApply: (amount: number, direction: Direction) => void;
  onClose: () => void;

  inputRows: number;
  inputCols: number;
  rows: number;
  cols: number;
  resizeDirection: Direction;

  setInputRows: React.Dispatch<React.SetStateAction<number>>;
  setInputCols: React.Dispatch<React.SetStateAction<number>>;
  setResizeDirection: React.Dispatch<React.SetStateAction<Direction>>;
}


const LocationSelector: React.FC<{ setLatLng: (lat: number, lng: number) => void }> = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const SetGridPopup: React.FC<SetGridPopupProps> = ({
  spaceId,
  latitude: initialLat,
  longitude: initialLon,
  onApply,
  onClose,
}) => {
  const [latitude, setLatitude] = useState<number | "">(initialLat ?? "");
  const [longitude, setLongitude] = useState<number | "">(initialLon ?? "");
  const [saving, setSaving] = useState(false);

  const [amount, setAmount] = useState<string>("1");
  const [resizeDirection, setResizeDirection] = useState<Direction>("bottom");

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!spaceId) return;
      try {
        const ref = doc(db, "spaces", spaceId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const lat = parseFloat(data?.latitude);
          const lng = parseFloat(data?.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            setLatitude(lat);
            setLongitude(lng);
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
    fetchCoordinates();
  }, [spaceId]);

  const handleApply = () => {
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount === 0) {
      return;
    }
    onApply(numericAmount, resizeDirection);
  };

  const handleSaveCoordinates = async () => {
    if (latitude === "" || longitude === "") return;

    try {
      setSaving(true);
      const ref = doc(db, "spaces", spaceId);
      await updateDoc(ref, {
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    } catch (err) {
      console.error("❌ Error saving location:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-900 p-6 rounded shadow-lg text-white w-[28rem] space-y-5 mt-25"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-center">Edit Grid</h2>
        <p className="text-sm text-gray-300 text-center">
          Choose how many rows or columns to add and from which side.
        </p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-6">
            <label className="flex flex-col text-sm font-medium w-1/2">
              Amount
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 border px-3 py-2 rounded text-sm bg-white text-black"
              />
            </label>

            <div className="flex flex-col gap-2 w-1/2">
              <span className="font-medium text-sm">Add to:</span>
              <div className="grid grid-cols-2 gap-2">
                {["top", "bottom", "left", "right"].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setResizeDirection(dir as Direction)}
                    className={`px-3 py-2 rounded text-sm font-semibold border shadow-sm transition ${
                      resizeDirection === dir
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Select Location on Map</h3>
            <div className="h-50 w-full">
              <MapContainer
                center={[
                  typeof latitude === "number" ? latitude : 46.559148,
                  typeof longitude === "number" ? longitude : 15.638043,
                ]}
                zoom={15}
                className="h-60 rounded"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationSelector
                  setLatLng={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
                {typeof latitude === "number" && typeof longitude === "number" && (
                  <Marker position={[latitude, longitude]} icon={markerIcon} />
                )}
              </MapContainer>
            </div>
            <button
              onClick={handleSaveCoordinates}
              disabled={saving}
              className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetGridPopup;
