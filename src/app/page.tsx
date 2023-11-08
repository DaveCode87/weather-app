"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { WeatherData } from "./shared/weatherData";
import WeatherCard from "./shared/WeatherCard";
import WeatherInfo from "./shared/WeatherInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchWeatherByCity, fetchWeatherByCoords } from "./shared/Api"; // Importa le funzioni di fetch API
import "../../fontawesome";
import { MapPin ,Search } from "lucide-react";

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

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleButtonClick();
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
        <div className="bg-white p-8 rounded-lg shadow-lg text-center flex ">
          <div className="relative m-auto mr-4 flex-row">
            <input
              className="w-full px-3 py-2 pr-10 rounded focus:outline-none focus:border-blue-500 text-black"
              type="text"
              placeholder="Enter a city"
              value={city}
              onChange={handleCityChange}
              onKeyDown={handleEnterPress}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                className="relative m-auto text-gray-600 cursor-pointer"
                onClick={handleButtonClick}
              >
                <Search color="#174be8"/>
              </button>
            </div>
          </div>
          <div
            className="relative m-auto text-gray-600 cursor-pointer"
            onClick={() => {
              getCurrentLocationWeather();
            }}
          >
            <MapPin size="24" color="#174be8"/>{" "}
          </div>
        </div>

        {/* {weatherData && weatherData.list && weatherData.list[0] ? (
          <div className=" p-4 rounded-lg text-black mt-4">
            <div className=" p-4 rounded-lg  text-center m-2">
              <h3>{weatherData.city.name}</h3>
              <p>Temperature: {Math.round(weatherData.list[0].main.temp)}°C</p>
            </div>
          </div>
        ) : null} */}

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
