"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { WeatherData } from "./shared/weatherData";
import Image from "next/image";
import WeatherCard from "./shared/WeatherCard";
import WeatherImage from "./shared/WeatherImage";
import WeatherInfo from "./shared/WeatherInfo";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/images/clear.jpeg");

  const APIKey: string = "e142aa80633f6b8932694e428510798d";

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  async function handleButtonClick() {
    console.log(`Meteo per la città: ${city}`);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`
      );

      const data = await response.json();
      console.log("data", data);

      if (data?.cod === "400" || data?.cod === "404") throw data;

      setWeatherData(data);
    } catch (err) {
      console.log("error", err);
    }
  }

  const getCurrentLocationWeather = async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`
          );
          const data = await response.json();
          if (data?.cod === 200) {
            setCity(data.name);
            setWeatherData(data);
            // Chiamata aggiunta per ottenere i dati meteorologici dopo aver impostato la città
            await fetchWeatherData(data.name);
          }
        });
      } else {
        console.log("Geolocation not available");
      }
    } catch (err) {
      console.error("Error fetching weather data", err);
    }
  };

  const fetchWeatherData = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=metric`
      );

      const data = await response.json();
      console.log("data", data);

      if (data?.cod === "400" || data?.cod === "404") throw data;

      setWeatherData(data);
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    if (weatherData && weatherData.list && weatherData.list[0]) {
      switch (weatherData.list[0].weather[0].main.toLowerCase()) {
        case "clear":
          setImageUrl("/images/clear.jpeg");
          break;
        case "rain":
          setImageUrl("/images/rain.jpg");
          break;
        case "clouds":
          setImageUrl("/images/clouds.jpg");
          break;
        // Aggiungi altri casi per le condizioni meteo desiderate
        default:
          setImageUrl("/images/clear.jpeg");
      }
    }
  }, [weatherData]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center">
        {/* Box principale al centro */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-black mb-2">
            Weather App
          </h1>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 text-black"
            type="text"
            placeholder="Enter a city and get the weather below"
            value={city}
            onChange={handleCityChange}
          />
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-gray-600">Use Current Location</span>
            <div className="relative w-12 h-6 bg-gray-300 rounded-full shadow-inner cursor-pointer">
              <input
                type="checkbox"
                className="hidden absolute w-6 h-6 rounded-full bg-white border-2 border-blue-500 appearance-none cursor-pointer"
                onChange={(e) => {
                  if (e.target.checked) {
                    getCurrentLocationWeather();
                  }
                }}
              />
              <div className="toggle-dot absolute w-4 h-4 bg-blue-500 rounded-full transition transform translate-x-0 cursor-pointer"></div>
            </div>
          </label>
          <button
            className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleButtonClick}
          >
            Inserisci
          </button>
          {weatherData && weatherData.list && weatherData.list[0] ? (
            <div className="mt-4">
              <WeatherInfo weatherData={weatherData} />
            </div>
          ) : null}
        </div>

        {/* Spazio tra i box */}
        <div className="my-8"></div>

        {/* Box trasparente per le card previsionali */}
        {weatherData && weatherData.list && weatherData.list[0] ? (
          <div className="bg-opacity-75 p-4 rounded-lg text-black">
            <div className="flex flex-wrap">
              {weatherData.list
                .filter((forecast, index) => index % 8 === 0)
                .map((forecast) => (
                  <WeatherCard key={forecast.dt} forecast={forecast} />
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
