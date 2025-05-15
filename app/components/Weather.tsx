// components/Weather.tsx
"use client";

import { useEffect, useState } from "react";

export default function Weather({
  onWeatherChange,
}: {
  onWeatherChange?: (weather: string) => void;
}) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error("Weather fetch failed");
        const data = await response.json();
        setWeather(data);
        if (onWeatherChange) {
          onWeatherChange(data.weather[0].description);
        }
      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Geolocation permission denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported");
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>{error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-widget">
      <h2>Current Weather</h2>
      <div className="flex items-center gap-4">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
        <div>
          <p className="text-xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
        </div>
      </div>
    </div>
  );
}
