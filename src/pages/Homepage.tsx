import React, { useState } from "react";
import "./Homepage.css";
import { Link, Route, Routes } from "react-router-dom";
import Search_bar from "../components/Search_bar";
import Weather_card from "../components/Weather_card";

const Homepage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const getWeather = async (city) => {
    setWeatherData(null);
    setError(null);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=583052238ecee9e8ac1cd44dc8c1de86&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="homepage">
      <div className="heading">
        <span className="name">Weather Now</span>
        <span className="description">
          Your daily dose of weather, simplified
        </span>
      </div>

      <Search_bar onSearch={getWeather} />

      {weatherData && (
        <Link to={`/forecast/${weatherData.city.name}`}>
          <Weather_card data={weatherData} />
        </Link>
      )}
    </div>
  );
};

export default Homepage;
