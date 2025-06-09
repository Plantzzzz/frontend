import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import SecondaryNavbar from "../../components/dashboard/SecondaryNavbar";
import PlantCareBubble from "../../components/dashboard/PlantCareBubble";

interface TableData {
    rows: number;
    cols: number;
    plantAssignments: { [key: string]: string };
    cellLocations: { [key: string]: "inside" | "outside" };
}

const AreasPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const spaceId = (location.state as any)?.spaceId;

    const [initialData, setInitialData] = useState<TableData | null>(null);
    const [loading, setLoading] = useState(true);
    const [careInstructions, setCareInstructions] = useState<string>("");

    const handlePlantCareInfo = (info: string) => {
        setCareInstructions(info);
        setTimeout(() => setCareInstructions(""), 20000);

    };

    useEffect(() => {
        const fetchTable = async () => {
            if (!spaceId) {
                navigate("/dashboard/spaces");
                return;
            }
            try {
                const ref = doc(db, "spaces", spaceId);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.tableData) {
                        setInitialData(data.tableData);
                    } else {
                        // fallback if no tableData exists yet
                        setInitialData({
                            rows: 3,
                            cols: 4,
                            plantAssignments: {},
                            cellLocations: {},
                        });
                    }
                } else {
                    console.warn("No such space document.");
                    navigate("/dashboard/spaces");
                }
            } catch (error) {
                console.error("Error fetching table data:", error);
                navigate("/dashboard/spaces");
            } finally {
                setLoading(false);
            }
        };
        fetchTable();
    }, [spaceId, navigate]);

    const handleSave = async (updated: TableData) => {
        if (!spaceId) return;
        try {
            await updateDoc(doc(db, "spaces", spaceId), { tableData: updated });
            console.log("✅ Grid saved for space:", spaceId);
        } catch (err) {
            console.error("❌ Failed to save grid:", err);
        }
    };

    if (loading || !initialData) {
        return <p className="text-white p-6">Loading garden grid...</p>;
    }

    return (
        <div className="flex flex-col">
            <SecondaryNavbar
                spaceId={spaceId}
                initialRows={initialData.rows}
                initialCols={initialData.cols}
                initialAssignments={initialData.plantAssignments}
                initialLocations={initialData.cellLocations}
                onSave={handleSave}
                onPlantCareInfo={handlePlantCareInfo}
            />

            {careInstructions && (
                <PlantCareBubble message={careInstructions} />
            )}
        </div>
    );
};

export default AreasPage;
