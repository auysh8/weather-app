import React from "react";
import { useState } from "react";

import "./Weather_card.css";

const Weather_card = ({ data ,  onBookmark , isBookmark}) => {
  if (!data) {
    return null;
  }

  const cityName = data.city.name;
  const temp = Math.round(data.list[0].main.temp);
  const sky = data.list[0].weather[0].description;
  const handleBookmark = (event) => {
    event.stopPropagation();
    event.preventDefault();

    onBookmark(cityName);
  };
  const getIcons = (conditionId) => {
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
    <div className="weather_card">
      <button className="save_button" onClick={handleBookmark}>
        <i className={isBookmark ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
      </button>
      <div className="weather_details">
        <span className="cityname">{cityName}</span>
        <span className="temp">{temp}°C</span>
        <span className="sky">{sky}</span>
      </div>

      <div className="weather_icon">
        <i className={getIcons(data.list[0].weather[0].id)}></i>
      </div>
    </div>
  );
};

export default Weather_card;
