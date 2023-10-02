"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { WeatherData } from "./shared/weatherData";
import WeatherCard from "./shared/WeatherCard";
import WeatherInfo from "./shared/WeatherInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchWeatherByCity, fetchWeatherByCoords } from "./shared/Api"; // Importa le funzioni di fetch API
import "../../fontawesome";

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/images/clear.jpeg");

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleButtonClick = async () => {
    await fetchWeatherData(city);
  };

  const getCurrentLocationWeather = async () => {
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherByCoords(latitude, longitude);
          if (data?.cod === 200) {
            setCity(data.name);
            setWeatherData(data);
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

  const fetchWeatherData = async (city: string) => {
    try {
      const data = await fetchWeatherByCity(city);
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="relative mt-4">
            <input
              className="w-full px-3 py-2 pr-10 border rounded focus:outline-none focus:border-blue-500 text-black"
              type="text"
              placeholder="Enter a city and get the weather below"
              value={city}
              onChange={handleCityChange}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                className="bg-transparent text-blue-500 font-semibold px-2 py-1 rounded hover:bg-blue-100"
                onClick={handleButtonClick}
              >
                <FontAwesomeIcon icon="search" className="text-blue-500" />
              </button>
            </div>
          </div>

          <label className="bg-center flex justify-center items-center p-8 space-x-2 cursor-pointer">
            <button
              className="bg-gray-300 text-gray-600 px-3 py-2 rounded-full hover:bg-blue-500 hover:text-white"
              onClick={() => {
                getCurrentLocationWeather();
              }}
            >
              Location
            </button>
          </label>
          {weatherData && weatherData.list && weatherData.list[0] ? (
            <div className="mt-4">
              <WeatherInfo weatherData={weatherData} />
            </div>
          ) : null}
        </div>
        <div className="my-8"></div>
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
