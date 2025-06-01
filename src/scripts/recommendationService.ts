import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { sowingCalendar } from "./sowingCalendar";

function normalizePlantName(name: string): string {
  return name.trim().toLowerCase();
}

export async function getPlantRecommendations(spaceId: string) {
  const eventSnap = await getDocs(collection(db, `spaces/${spaceId}/plantEvents`));
  const now = new Date();

  const recommendations: string[] = [];
  const eventMap: Record<string, { [key: string]: Date[] }> = {};
  const plantMap: Record<string, string> = {}; // cellId → plantName

  // Organiziraj dogodke
  eventSnap.docs.forEach(doc => {
    const data = doc.data();
    const cell = data.cellId;
    const type = data.eventType;
    const plant = data.plantName;
    const ts = data.timestamp?.toDate?.() ?? new Date();

    if (!eventMap[cell]) eventMap[cell] = {};
    if (!eventMap[cell][type]) eventMap[cell][type] = [];

    eventMap[cell][type].push(ts);
    plantMap[cell] = plant;
  });

  // Priporočila
  for (const [cellId, types] of Object.entries(eventMap)) {
    const plantName = plantMap[cellId] ?? "Plant";
    const normalizedPlantName = normalizePlantName(plantName);

    // Zalivanje
    if (!types["watering"] || types["watering"].length === 0) {
      recommendations.push(`💧 ${plantName} (${cellId}) has never been watered.`);
    } else {
      const last = Math.max(...types["watering"].map(d => d.getTime()));
      const days = (now.getTime() - last) / (1000 * 60 * 60 * 24);
      if (days > 7) {
        recommendations.push(`💧 ${plantName} (${cellId}) hasn't been watered for ${Math.floor(days)} days.`);
      }
    }

    // Gnojenje
    if (!types["fertilizing"] || types["fertilizing"].length === 0) {
      recommendations.push(`🌾 ${plantName} (${cellId}) has never been fertilized.`);
    } else {
      const last = Math.max(...types["fertilizing"].map(d => d.getTime()));
      const days = (now.getTime() - last) / (1000 * 60 * 60 * 24);
      if (days > 14) {
        recommendations.push(`🌾 ${plantName} (${cellId}) hasn't been fertilized for ${Math.floor(days)} days.`);
      }
    }

    // Obrezovanje
    if (!types["trimming"] || types["trimming"].length === 0) {
      recommendations.push(`✂️ ${plantName} (${cellId}) has never been trimmed.`);
    }

    // Žetev
    if (!types["harvest"] || types["harvest"].length === 0) {
      recommendations.push(`🌿 ${plantName} (${cellId}) has not been harvested.`);
    }

    // 📅 Sezonski nasveti – Setveni koledar
    const calendar = sowingCalendar[normalizedPlantName];
    const month = now.getMonth() + 1; // januar = 1

    if (calendar) {
      if (calendar.sow?.includes(month)) {
        recommendations.push(`🌱 It's a good time to sow ${plantName} (${cellId}).`);
      }
      if (calendar.transplant?.includes(month)) {
        recommendations.push(`🌿 It's a good time to transplant ${plantName} (${cellId}).`);
      }
      if (calendar.harvest?.includes(month)) {
        recommendations.push(`🍅 You can harvest ${plantName} (${cellId}) this month.`);
      }
      if (calendar.prune?.includes(month)) {
        recommendations.push(`✂️ You can prune ${plantName} (${cellId}) this month.`);
      }
      if (calendar.fertilize?.includes(month)) {
        recommendations.push(`🌾 Consider fertilizing ${plantName} (${cellId}) this month.`);
      }
    }
  }

  return recommendations;
}
