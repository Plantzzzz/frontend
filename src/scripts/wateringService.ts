import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
/*
type WateringEvent = {
  cellId: string;
  plantName: string;
  eventType: string;
  notes?: string;
  timestamp: Date;
};
*/
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, " ").trim();
}

// 🔁 Uporabno za obliko YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const getSpaceLocation = async (spaceId: string) => {
  const ref = doc(db, "spaces", spaceId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Prostor ne obstaja ali nima določene lokacije.");
  }

  const data = snap.data();
  if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
    throw new Error("Prostor nima pravilno nastavljenih koordinat.");
  }

  return { latitude: data.latitude, longitude: data.longitude };
};

/**
 * Pridobi vremensko napoved za določene koordinate
 */
export const fetchWeatherData = async (lat: number, lon: number) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weathercode&hourly=precipitation&forecast_days=1&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Napaka pri pridobivanju vremena");
  return await res.json();
};


export const shouldWaterOutsidePlants = async (userId: string): Promise<boolean> => {
  const { latitude, longitude } = await getSpaceLocation(userId);
  const weather = await fetchWeatherData(latitude, longitude);

  // Preveri, ali bo v naslednjih urah deževalo
  const precipitationNextHours = weather.hourly.precipitation.slice(0, 6); // naslednjih 6 ur
  const rainExpected = precipitationNextHours.some((val: number) => val > 0.5); // prag 0.5mm

  return !rainExpected; // če dežuje, ne zalivamo
};

export async function generateWateringEventsForSpace(spaceId: string) {
  console.log("🌿 [START] Generiram zalivalne dogodke za space:", spaceId);

  const calendarToken = sessionStorage.getItem("calendarToken");
  if (!calendarToken) {
    return;
  }

  const spaceSnap = await getDocs(query(collection(db, "spaces"), where("__name__", "==", spaceId)));
  if (spaceSnap.empty) {
    console.warn("❌ Space ni najden.");
    return;
  }

  const spaceData = spaceSnap.docs[0].data();
  const plantAssignments = spaceData.tableData?.plantAssignments || {};
  const spaceName = spaceData.name || "Vrt";
/*
  const eventSnap = await getDocs(collection(db, `spaces/${spaceId}/plantEvents`));
  /*
  const wateringEventsRaw: (WateringEvent | null)[] = eventSnap.docs.map(doc => {
    const data = doc.data();
    if (
      data.eventType === "watering" &&
      data.timestamp &&
      data.plantName &&
      data.cellId
    ) {
      return {
        cellId: data.cellId as string,
        plantName: data.plantName as string,
        eventType: data.eventType as string,
        notes: data.notes ? String(data.notes) : "",
        timestamp: data.timestamp.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
      };
    }
    return null;
  });

/*
  const wateringEvents: WateringEvent[] = wateringEventsRaw.filter((e): e is WateringEvent => e !== null);
*/
  const plantDocs = await getDocs(collection(db, "plants"));
  const wateringRules: Record<string, number> = {};

  const wateringFrequencyMap: Record<string, number> = {
    minimal: 14,
    minimum: 14,
    average: 7,
    frequent: 2,
    unknown: 7,
  };

  plantDocs.docs.forEach(doc => {
    const data = doc.data();
    if (data.name && data.watering) {
      const normName = normalizeName(data.name);
      const freq = wateringFrequencyMap[String(data.watering).toLowerCase()];
      if (freq) {
        wateringRules[normName] = freq;
      }
    }
  });

  const today = new Date();
  const scheduleByDate: Record<string, string[]> = {}; // YYYY-MM-DD → ["Zalij Basil (1-1)", ...]

  for (const [cellId, rawName] of Object.entries(plantAssignments as Record<string, string>)) {
    const plantName = String(rawName);
    const normName = normalizeName(plantName);
    const frequency = wateringRules[normName];

    if (!frequency) {
      console.warn(`⚠️ ${plantName} nima definirane frekvence zalivanja – preskočim`);
      continue;
    }
/*
    const plantWateringEvents = wateringEvents
      .filter(e => normalizeName(e.plantName) === normName)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
/*
    const lastWatered = plantWateringEvents.length > 0
      ? plantWateringEvents[0].timestamp
      : null;
*/
    for (let i = 1; i <= 21; i++) {
      if (i % frequency !== 0) continue;

      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dateKey = formatDate(targetDate);

      const task = `- Zalij ${plantName} (celica ${cellId})`;
      if (!scheduleByDate[dateKey]) {
        scheduleByDate[dateKey] = [];
      }
      scheduleByDate[dateKey].push(task);
    }
  }

  // 🔍 Preveri že obstoječe dogodke (da ne podvajamo)
  const calendarEvents = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=50`, {
    headers: {
      Authorization: `Bearer ${calendarToken}`,
    },
  });

  const calendarData = await calendarEvents.json();
  const existingSummaries = (calendarData.items || []).map((e: any) => e.summary);

  // 🔁 Ustvari dogodke po dnevih
  for (const [dateKey, tasks] of Object.entries(scheduleByDate)) {
    const summary = `Zalivanje rastlin (${spaceName}) – ${dateKey}`;

    if (existingSummaries.includes(summary)) {
      console.log(`⏭️ Dogodek za ${dateKey} že obstaja – preskočim`);
      continue;
    }

    const start = new Date(dateKey + "T10:00:00");
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const event = {
      summary,
      description: tasks.join("\n"),
      start: {
        dateTime: start.toISOString(),
        timeZone: "Europe/Ljubljana",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Europe/Ljubljana",
      },
    };

    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${calendarToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (res.ok) {
      console.log(`✅ Ustvarjen dogodek za ${dateKey} (${tasks.length} rastlin)`);
    } else {
      const err = await res.text();
      console.error(`❌ Napaka pri ustvarjanju dogodka:`, err);
    }
  }
}
