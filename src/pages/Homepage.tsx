import React, { useState } from "react";
import "./Homepage.css";
import { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Search_bar from "../components/Search_bar";
import Weather_card from "../components/Weather_card";

const getSavedBookmarks = () => {
  return JSON.parse(localStorage.getItem("bookmarkedCities")) || [];
};
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const Homepage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState(getSavedBookmarks());
  const [bookmarkDataList, setBookmarkDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(bookmarkDataList);

  useEffect(() => {
    const fetchBookmarkData = async () => {
      setIsLoading(true);
      if (bookmarks.length == 0) {
        setIsLoading(false);
        return;
      }

      const promises = bookmarks.map(async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            return null;
          }
          return response.json();
        } catch (error) {
          console.error(error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      setBookmarkDataList(results.filter((data) => data !== null));
      setIsLoading(false);
    };
    fetchBookmarkData();
  }, []);

  const onSuccess = (pos) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    getCityName(lat, long);
  };

  const onFailure = (error) => {
    console.error(error.message);
    getWeather("Delhi");
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by the browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
  }, []);

  const getCityName = async (lat, long) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      getWeather(data.city);
    } catch (error) {
      console.error(error);
    }
  };
  const getWeather = async (city) => {
    setWeatherData(null);
    setError(null);
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
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

  const handleBookmark = (city) => {
    let updatedBookmarks;
    if (bookmarks.includes(city)) {
      updatedBookmarks = bookmarks.filter((b) => b !== city);
    } else {
      updatedBookmarks = [...bookmarks, city];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarkedCities", JSON.stringify(updatedBookmarks));
  };

  if(isLoading){
    return <div className="loading_screen">Loading...</div>;
  }
  console.log(weatherData)
  return (
    <div>
      <div className="homepage">
        <div className="heading">
          <span className="name">Weather Now</span>
          <span className="description">
            Your daily dose of weather, simplified
          </span>
        </div>

        <Search_bar onSearch={getWeather} />

        {weatherData && (
          <Link key={weatherData.city.id} to={`/forecast/${weatherData.city.name}`}>
            <Weather_card
              data={weatherData}
              onBookmark={handleBookmark}
              isBookmark={bookmarks.includes(weatherData.city.name)}
            />
          </Link>
        )}

        <div className="bookmark">
          <span className="bookmark_head">Bookmarks</span>
          {bookmarkDataList.map((item) => (
            <Link key={item.name} to={`/forecast/${item.city.name}`}>
              <Weather_card
                data={item}
                onBookmark={handleBookmark}
                isBookmark={bookmarks.includes(item.city.name)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
