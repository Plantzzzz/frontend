import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PlantProfileModal from "./PlantProfileModal";

interface GroupedPlant {
  key: string;
  plant: string;
  location: string;
  cells?: string[];
  image?: string;
  source: "spaces" | "saved";
}

const PlantList: React.FC = () => {
  const [groups, setGroups] = useState<GroupedPlant[]>([]);
  const [selected, setSelected] = useState<GroupedPlant | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const allGroups: GroupedPlant[] = [];

      // === 1. PLANTS FROM 'spaces' ===
      const qSpaces = query(collection(db, "spaces"), where("userId", "==", user.uid));
      const snapSpaces = await getDocs(qSpaces);

      const groupsFromSpaces: Record<string, GroupedPlant> = {};
      for (const docSnap of snapSpaces.docs) {
        const data = docSnap.data();
        const plantAssignments = data.tableData?.plantAssignments || {};
        const cellLocations = data.tableData?.cellLocations || {};

        for (const [cell, plant] of Object.entries(plantAssignments)) {
          const location = cellLocations[cell];
          if (!location) continue;

          const key = `${plant}_${location}`;
          if (!groupsFromSpaces[key]) {
            const plantQuery = query(collection(db, "plants"), where("common_name", "==", plant));
            const plantSnap = await getDocs(plantQuery);
            const image = plantSnap.empty
              ? "https://source.unsplash.com/300x200/?plant"
              : plantSnap.docs[0].data().image;

            groupsFromSpaces[key] = {
              key,
              plant,
              location,
              cells: [],
              image,
              source: "spaces",
            };
          }
          groupsFromSpaces[key].cells!.push(cell);
        }
      }

      allGroups.push(...Object.values(groupsFromSpaces));

      // === 2. PLANTS FROM 'saved_plants' ===
      const qSaved = query(collection(db, "saved_plants"), where("uid", "==", user.uid));
      const snapSaved = await getDocs(qSaved);

      for (const docSnap of snapSaved.docs) {
        const data = docSnap.data();
        const plantName =
          data.customName ||
          data.commonName || // fallback
          data.scientificName ||
          "Unnamed Plant";

        const location = data.location || "Unknown";
        const image =
          data.image ||
          "https://source.unsplash.com/300x200/?plant";

        allGroups.push({
          key: `saved_${docSnap.id}`,
          plant: plantName,
          location,
          image,
          source: "saved",
        });
      }

      setGroups(allGroups);
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchPlants();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto px-4 py-6">
      {groups.map((group) => (
        <div
          key={group.key}
          className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
          onClick={() => setSelected(group)}
        >
          <img
            src={group.image || "/plant.jpg"}
            alt={group.plant}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/plant.jpg";
            }}
          />

          <div className="p-4">
            <h3 className="text-lg font-semibold text-white">{group.plant}</h3>
            <p className="text-sm text-gray-400">Location: {group.location}</p>
            {group.source === "spaces" && group.cells && (
              <p className="text-sm text-gray-500">Cells: {group.cells.length}</p>
            )}
            {group.source === "saved" && (
              <p className="text-sm text-green-400">Saved manually</p>
            )}
          </div>
        </div>
      ))}

      {selected && (
        <PlantProfileModal plant={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default PlantList;
