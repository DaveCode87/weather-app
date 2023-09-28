// api.ts
import { APIKey } from "../../../constants";

export async function fetchWeatherByCity(city: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`
    );

    const data = await response.json();
    console.log("data", data);

    if (data?.cod === "400" || data?.cod === "404") throw data;

    return data;
  } catch (err) {
    console.log("error", err);
    throw err;
  }
}

export async function fetchWeatherByCoords(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`
    );

    const data = await response.json();
    console.log("data", data);

    if (data?.cod === 200) {
      return data;
    } else {
      throw data;
    }
  } catch (err) {
    console.error("Error fetching weather data", err);
    throw err;
  }
}
