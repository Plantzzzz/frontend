import React, { useEffect, useState } from "react";
import {
  Flower2,
  LineChart,
  Globe2,
  Wand2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import dayjs from "dayjs";

interface WeatherData {
  temp?: number;
  description?: string;
  icon?: string;
  loading: boolean;
  error?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [, setUserId] = useState<string | null>(null);
  const [, setLoadingWater] = useState(true);
  const [, setWateringStreak] = useState(0);
  const [, setLastWateredDate] = useState<string | null>(null);
  const [, setButtonDisabled] = useState(false);

  const OPEN_WEATHER_API_KEY = "c6c9bd51d22ce9242b41cf9c508a4cb9";

  const [weather, setWeather] = useState<WeatherData>({
    loading: true,
  });

  const tips: string[] = [
    "Don't water your plants every day – most houseplants prefer to dry out a bit rather than be overwatered.",
    "Place your plants in a spot with plenty of light, but avoid direct, intense sunlight.",
    "Use fertilizer at least once a month to promote healthy plant growth.",
    "Regularly remove dead or damaged leaves to prevent the spread of disease.",
    "Ensure your plant pots have proper drainage – standing water can cause root rot.",
    "Ventilate the room where your plants are to prevent mold and pests.",
    "Use rainwater or water that has been left to sit overnight for better results.",
    "Rotate your plants occasionally so all sides receive equal light and grow evenly.",
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
          setButtonDisabled(data.lastWateredDate === today);
        } else {
          setButtonDisabled(false);
        }
      } else {
        setUserId(null);
        setButtonDisabled(true);
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
        if (!res.ok) throw new Error("Napaka pri pridobivanju vremena");
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
/*
  const handleWater = async () => {
    if (!userId) return;

    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    let newStreak = 1;
    if (lastWateredDate === yesterday) {
      newStreak = wateringStreak + 1;
    }

    await setDoc(
        doc(db, "users", userId),
        { wateringStreak: newStreak, lastWateredDate: today },
        { merge: true }
    );

    setWateringStreak(newStreak);
    setLastWateredDate(today);
    setButtonDisabled(true);
  };
*/
  const cardClasses =
      "bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.01] cursor-pointer";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(path);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br text-gray-100 px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/dashboard/stats")}
              onKeyDown={(e) => handleKeyDown(e, "/dashboard/stats")}
              className={cardClasses}
            >
              <div className="flex items-center space-x-4">
                <LineChart className="text-green-400 w-12 h-12 animate-pulse" />
                <div>
                  <h2 className="text-xl font-semibold">Statistics</h2>
                  <p className="text-sm text-gray-400">Check the information about your plants</p>
                </div>
              </div>
            </div>

            {/* Plants Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/dashboard/plants")}
              onKeyDown={(e) => handleKeyDown(e, "/dashboard/plants")}
              className={cardClasses}
            >
              <div className="flex items-center space-x-4">
                <Flower2 className="text-green-400 w-12 h-12 animate-spin-slow" />
                <div>
                  <h2 className="text-xl font-semibold">Plants</h2>
                  <p className="text-sm text-gray-400">Manage your plants</p>
                </div>
              </div>
            </div>

            {/* Plant Recognition Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/dashboard/plantRecognition")}
              onKeyDown={(e) => handleKeyDown(e, "/dashboard/plantRecognition")}
              className={cardClasses}
            >
              <div className="flex items-center space-x-4">
                <Wand2 className="text-green-400 w-12 h-12 animate-wiggle" />
                <div>
                  <h2 className="text-xl font-semibold">Plant Recognition</h2>
                  <p className="text-sm text-gray-400">Recognize plants from an image</p>
                </div>
              </div>
            </div>

            {/* Spaces Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/dashboard/spaces")}
              onKeyDown={(e) => handleKeyDown(e, "/dashboard/spaces")}
              className={cardClasses}
            >
              <div className="flex items-center space-x-4">
                <Globe2 className="text-green-400 w-12 h-12" />
                <div>
                  <h2 className="text-xl font-semibold">Spaces</h2>
                  <p className="text-sm text-gray-400">Manage the spaces and environment of plants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-green-900 border border-green-700 p-6 rounded-2xl shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold mb-2 text-green-100">🌦️ Weather</h2>
              {weather.loading ? (
                  <p className="text-gray-300 text-sm">Loading weather...</p>
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
                        Last update: {dayjs().format("H:mm")}
                      </p>
                    </div>
                  </div>
              )}
            </div>

            <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold text-green-300 mb-2">🌱 Daily tip</h2>
              <p className="text-gray-400 italic">{dailyTip}</p>
            </div>
          </div>
        </div>
      </div>
  );
}
