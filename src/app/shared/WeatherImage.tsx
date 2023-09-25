// WeatherImage.tsx
import React from "react";
import Image from "next/image";

interface WeatherImageProps {
  icon: string;
}

const WeatherImage: React.FC<WeatherImageProps> = ({ icon }) => {
  return (
    <div className="mt-4">
      <Image
        src={icon}
        alt="Weather Icon"
        width={100}
        height={100}
      />
    </div>
  );
};

export default WeatherImage;
