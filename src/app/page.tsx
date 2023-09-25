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
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <button
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600"
          onClick={getCurrentLocationWeather}
        >
          Use Current Location
        </button>
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
        {weatherData && weatherData.list && weatherData.list[0] ? (
          <div className="mt-4">
            <WeatherInfo weatherData={weatherData} />
          </div>
        ) : null}
        {weatherData && weatherData.list && weatherData.list[0] ? (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Previsioni a 5 giorni
            </h2>
            <div className="flex flex-wrap text-black">
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
