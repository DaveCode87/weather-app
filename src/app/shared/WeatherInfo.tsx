// WeatherInfo.tsx
import React from "react";
import { WeatherData } from "./weatherData";

interface WeatherInfoProps {
  weatherData: WeatherData;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weatherData }) => {
  return (
    <div className="mt-4">
      <p className="text-4xl font-semibold text-black">
        {weatherData.name}
        Currently {Math.round(weatherData.main.temp)}°C
      </p>
    </div>
  );
};

export default WeatherInfo;
