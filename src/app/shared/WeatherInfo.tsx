// WeatherInfo.tsx
import React from "react";
import { WeatherData } from "./weatherData";

interface WeatherInfoProps {
  weatherData: WeatherData;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData }) => {
  const currentWeather = weatherData.list[0];

  return (
    <div className="mt-4">
      <p className="text-4xl font-semibold text-black">
        {weatherData.city.name} - {" "}
        {Math.round(weatherData.list[0].main.temp)}°C
      </p>
    </div>
  );
};

export default WeatherInfo;
