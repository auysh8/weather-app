import { motion } from "framer-motion";
import type React from "react";

type WeatherItem = {
  main: {
    temp: number;
  };
  weather: {
    id: number;
    description: string;
  }[];
};

type WeatherData = {
  city: {
    name: string;
  };
  list: WeatherItem[];
};

type WeatherCardProps = {
  data: WeatherData;
  onBookmark: (city: string) => void;
  isBookmark: boolean;
};

const Weather_card = ({ data, onBookmark, isBookmark }: WeatherCardProps) => {
  if (!data) {
    return null;
  }

  const cityName = data.city.name;
  const temp = Math.round(data.list[0].main.temp);
  const sky = data.list[0].weather[0].description;
  const handleBookmark = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    onBookmark(cityName);
  };
  const getIcons = (conditionId: number) => {
    if (conditionId >= 200 && conditionId < 300) {
      return "fa-solid fa-cloud-bolt";
    }
    if (conditionId >= 300 && conditionId < 600) {
      return "fa-solid fa-cloud-showers-heavy";
    }
    if (conditionId >= 600 && conditionId < 700) {
      return "fa-solid fa-snowflake";
    }
    if (conditionId > 700 && conditionId < 800) {
      return "fa-solid fa-smog";
    }
    if (conditionId > 800 && conditionId < 805) {
      return "fa-solid fa-cloud";
    }
    if (conditionId === 800) {
      return "fa-solid fa-circle";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2, type: "tween" },
      }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2, type: "spring" },
      }}
      whileTap={{ scale: 0.98 }}
      className="weather_card"
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.4, type: "tween" },
      }}
    >
      <button className="save_button" onClick={handleBookmark}>
        <i
          className={
            isBookmark ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"
          }
        ></i>
      </button>
      <div className="weather_details">
        <span className="cityname">{cityName}</span>
        <span className="temp">{temp}°C</span>
        <span className="sky">{sky}</span>
      </div>

      <div className="weather_icon">
        <i className={getIcons(data.list[0].weather[0].id)}></i>
      </div>
    </motion.div>
  );
};

export default Weather_card;
