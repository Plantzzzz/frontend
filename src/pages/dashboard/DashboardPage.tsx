import React, { useEffect, useState } from "react";
import { Sparkles, Flower2, Droplets, LineChart, Globe2, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";  // prilagodi pot, če je drugačna
import dayjs from "dayjs";

export default function Dashboard() {
  const navigate = useNavigate();

  // Za zalivanje
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingWater, setLoadingWater] = useState(true);
  const [wateringStreak, setWateringStreak] = useState(0);
  const [lastWateredDate, setLastWateredDate] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

    const OPEN_WEATHER_API_KEY = "c6c9bd51d22ce9242b41cf9c508a4cb9";

    const [weather, setWeather] = useState<{
    temp?: number;
    description?: string;
    icon?: string;
    loading: boolean;
    error?: string;
  }>({ loading: true });

    
    const tips = [
    "Ne zalivaj svojih rastlin vsak dan – večina sobnih rastlin raje presuši kot prekomerno zamoči.",
    "Rastline postavi na mesto z dovolj svetlobe, a ne direktne močne sončne svetlobe.",
    "Uporabi gnojilo vsaj enkrat na mesec za boljšo rast rastlin.",
    "Redno odstranjuj suhe ali poškodovane liste, da preprečiš širjenje bolezni.",
    "Preveri, ali ima rastlina dovolj drenaže – stojna voda lahko povzroči gnitje korenin.",
    "Zrači prostor, kjer so rastline, za preprečevanje plesni in škodljivcev.",
    "Uporabi deževnico ali odstajano vodo za zalivanje, da rastline bolje uspevajo."
  ];
   const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setWateringStreak(data.wateringStreak || 0);
          setLastWateredDate(data.lastWateredDate || null);

          const today = dayjs().format("YYYY-MM-DD");
          if (data.lastWateredDate === today) {
            setButtonDisabled(true);
          } else {
            setButtonDisabled(false);
          }
        } else {
          setButtonDisabled(false);
        }
      } else {
        setUserId(null);
        setButtonDisabled(true); // če ni prijavljen, gumb ne dela
      }
      setLoadingWater(false);
    });

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Maribor,SI&units=metric&appid=${OPEN_WEATHER_API_KEY}&lang=sl`
        );
        if (!res.ok) {
          throw new Error("Napaka pri pridobivanju vremena");
        }
        const data = await res.json();
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
        });
      } catch (error: any) {
        setWeather({ loading: false, error: error.message });
      }
    };

    fetchWeather();

    return () => unsubscribe();
  }, []);

  const handleWater = async () => {
    if (!userId) return;

    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    let newStreak = 1;
    if (lastWateredDate === yesterday) {
      newStreak = wateringStreak + 1;
    }

    await setDoc(doc(db, "users", userId), {
      wateringStreak: newStreak,
      lastWateredDate: today,
    }, { merge: true });

    setWateringStreak(newStreak);
    setLastWateredDate(today);
    setButtonDisabled(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 px-6 py-10">
      <h1 className="text-4xl font-bold mb-12 text-green-400 text-center animate-fade-in-up">
        🌱 Tvoj rastlinski kotiček
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="md:col-span-7 space-y-6">
          <div
            onClick={() => navigate("/dashboard/stats")}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <LineChart className="text-green-400 w-12 h-12 animate-pulse" />
              <div>
                <h2 className="text-xl font-semibold">Statistika</h2>
                <p className="text-sm text-gray-400">Poglej podatke o tvoji rastlinski rasti</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/plants")}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <Flower2 className="text-green-400 w-12 h-12 animate-spin-slow" />
              <div>
                <h2 className="text-xl font-semibold">Rastline</h2>
                <p className="text-sm text-gray-400">Upravljaj svoje rastline</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/recognition")}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <Wand2 className="text-green-400 w-12 h-12 animate-wiggle" />
              <div>
                <h2 className="text-xl font-semibold">Prepoznava</h2>
                <p className="text-sm text-gray-400">Prepoznaj novo rastlino iz slike</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate("/dashboard/spaces")}
            className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <Globe2 className="text-green-400 w-12 h-12" />
              <div>
                <h2 className="text-xl font-semibold">Prostori</h2>
                <p className="text-sm text-gray-400">Upravljaj prostore in okolja rastlin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-green-900 border border-green-700 p-6 rounded-2xl shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-2 text-green-100">🌦️ Trenutno vreme</h2>
            {weather.loading ? (
              <p className="text-gray-300 text-sm">Nalaganje vremena...</p>
            ) : weather.error ? (
              <p className="text-red-400 text-sm">Napaka: {weather.error}</p>
            ) : (
              <div className="flex items-center space-x-4">
                {weather.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-12 h-12"
                  />
                )}
                <div>
                  <p className="text-gray-300 text-lg font-semibold">
                    Maribor, {Math.round(weather.temp!)}°C
                  </p>
                  <p className="capitalize text-gray-400 text-sm">{weather.description}</p>
                  <p className="text-xs text-gray-500">
                    Zadnja posodobitev: {dayjs().format("H:mm")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-green-300 mb-2">🌱 Dnevni nasvet</h2>
            <p className="text-gray-400 italic">
              {dailyTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
