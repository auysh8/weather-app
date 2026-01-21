import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search_bar from "../components/Search_bar";
import Weather_card from "../components/Weather_card";
import { AnimatePresence } from "framer-motion";

// FIX 1: Update the type to match "Current Weather" API response
type WeatherData = {
  id: number;       // ID is at the root
  name: string;     // Name is at the root
  main: any;        // Contains temp, humidity etc.
  weather: any[];   // Contains icon, description
  sys: {            // Contains country code
      country: string;
  };
  wind: {
    speed: number;
    deg: number;
  }
};

const getSavedBookmarks = (): string[] => {
  return JSON.parse(localStorage.getItem("bookmarkedCities") || "[]");
};

const Homepage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(getSavedBookmarks());
  const [bookmarkDataList, setBookmarkDataList] = useState<WeatherData[]>([]);

  useEffect(() => {
    const fetchBookmarkData = async () => {
      if (bookmarks.length === 0) {
        return;
      }

      const promises = bookmarks.map(async (city: string) => {
        // Note: Using 127.0.0.1 to avoid the localhost/ipv6 issue
        const url = `http://localhost:5000/weather?city=${city}`;
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
      setBookmarkDataList(results.filter((data) => data !== null) as WeatherData[]);
    };
    fetchBookmarkData();
  }, [bookmarks]);

  const onSuccess = (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    getCityName(lat, long);
  };

  const onFailure = (error: GeolocationPositionError) => {
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

  const getCityName = async (lat: number, long: number) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      getWeather(data.city);
    } catch (error) {
      console.error(error);
    }
  };

  const getWeather = async (city: string) => {
    setWeatherData(null);
    const url = `http://127.0.0.1:5000/weather?city=${city}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleBookmark = (city: string) => {
    let updatedBookmarks;
    if (bookmarks.includes(city)) {
      updatedBookmarks = bookmarks.filter((b: string) => b !== city);
    } else {
      updatedBookmarks = [...bookmarks, city];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarkedCities", JSON.stringify(updatedBookmarks));
  };

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
          <AnimatePresence>
            {/* FIX 2: Changed weatherData.city.id -> weatherData.id */}
            <Link
              key={weatherData.id} 
              to={`/forecast/${weatherData.name}`} 
            >
              <Weather_card
                data={weatherData}
                onBookmark={() => handleBookmark(weatherData.name)}
                isBookmark={bookmarks.includes(weatherData.name)}
              />
            </Link>
          </AnimatePresence>
        )}

        <div className="bookmark">
          {bookmarks.length > 0 && (
            <span className="bookmark_head">Bookmarks</span>
          )}

          <AnimatePresence>
            {bookmarks.length > 0 &&
              bookmarkDataList.map((item) => (
                 /* FIX 3: Updated all '.city.' references here too */
                <Link key={item.id} to={`/forecast/${item.name}`}>
                  <Weather_card
                    data={item}
                    onBookmark={() => handleBookmark(item.name)}
                    isBookmark={bookmarks.includes(item.name)}
                  />
                </Link>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Homepage;