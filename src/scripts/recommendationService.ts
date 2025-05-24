import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getPlantRecommendations(spaceId: string) {
  const eventSnap = await getDocs(collection(db, `spaces/${spaceId}/plantEvents`));
  const now = new Date();

  const recommendations: string[] = [];
  const eventMap: Record<string, { [key: string]: Date[] }> = {};

  eventSnap.docs.forEach(doc => {
    const data = doc.data();
    const cell = data.cellId;
    const type = data.eventType;
    const plant = data.plantName;
    const ts = data.timestamp?.toDate?.() ?? new Date();

    if (!eventMap[cell]) eventMap[cell] = {};
    if (!eventMap[cell][type]) eventMap[cell][type] = [];

    eventMap[cell][type].push(ts);
  });

  for (const [cellId, types] of Object.entries(eventMap)) {
    const plantName = types["watering"]?.[0]?.plantName ?? "Rastlina";

    // Zalivanje
    if (!types["watering"] || types["watering"].length === 0) {
      recommendations.push(`💧 ${plantName} (${cellId}) še ni bila nikoli zalita.`);
    } else {
      const last = Math.max(...types["watering"].map(d => d.getTime()));
      const days = (now.getTime() - last) / (1000 * 60 * 60 * 24);
      if (days > 7) recommendations.push(`💧 ${plantName} (${cellId}) ni bila zalita že ${Math.floor(days)} dni.`);
    }

    // Gnojenje
    if (!types["fertilizing"] || types["fertilizing"].length === 0) {
      recommendations.push(`🌾 ${plantName} (${cellId}) še ni bila gnojena.`);
    } else {
      const last = Math.max(...types["fertilizing"].map(d => d.getTime()));
      const days = (now.getTime() - last) / (1000 * 60 * 60 * 24);
      if (days > 14) recommendations.push(`🌾 ${plantName} (${cellId}) ni bila gnojena že ${Math.floor(days)} dni.`);
    }

    // Obrezovanje
    if (!types["trimming"] || types["trimming"].length === 0) {
      recommendations.push(`✂️ ${plantName} (${cellId}) še ni bila obrezana.`);
    }

    // Žetev
    if (!types["harvest"] || types["harvest"].length === 0) {
      recommendations.push(`🌿 ${plantName} (${cellId}) še ni bila požeta.`);
    }
  }

  return recommendations;
}
