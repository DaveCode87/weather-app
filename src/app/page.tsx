"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { WeatherData } from "./shared/weatherData";
import Image from "next/image";

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
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
      );

      const data = await response.json();
      console.log("data", data);

      if (data?.cod === "400" || data?.cod === "404") throw data;

      setWeatherData(data);
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    if (weatherData) {
      switch (weatherData?.weather[0].main.toLowerCase()) {
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
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-black mb-2">
          Get the Weather App
        </h1>
        <p className="text-gray-600 mb-4">
          Enter a city and get the weather below
        </p>
        <input
          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 text-black"
          type="text"
          placeholder="Insert City"
          value={city}
          onChange={handleCityChange}
        />
        <button
          className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleButtonClick}
        >
          Inserisci
        </button>
        {weatherData ? (
          <div className="mt-4">
            <Image
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt="Weather Icon"
              className="w-16 h-16 mx-auto"
              width={100}
              height={100}
            />
            <p className="text-4xl font-semibold text-black">
              {weatherData.name}
              Currently {Math.round(weatherData.main.temp)}°C
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
