import React from "react";
import Image from "next/image";
import { WeatherCardProps } from "./weatherData";

function WeatherCard({ forecast }:WeatherCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg text-center m-2">
      <h3>{new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
      <p>Temperature: {Math.round(forecast.main.temp)}°C</p>
      <p>Conditions: {forecast.weather[0].description}</p>
      <Image
        src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
        alt="Weather Icon"
        className="w-16 h-16 mx-auto"
        width={100}
        height={100}
      />
    </div>
  );
}

export default WeatherCard;
