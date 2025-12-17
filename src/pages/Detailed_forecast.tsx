import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./Detailed_forecast.css";

type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
  pop: number;
};

type WeatherData = {
  city: {
    name: string;
  };
  list: ForecastItem[];
};

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

const Detailed_forecast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [iconIndex, setIconIndex] = useState(0);
  const { city } = useParams<{ city: string }>();
  const loadingIcons = [
    "fa-solid fa-cloud-sun",
    "fa-solid fa-cloud-rain",
    "fa-solid fa-snowflake",
    "fa-solid fa-wind",
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setIconIndex((prevIndex) => (prevIndex + 1) % loadingIcons.length);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    const getWeather = async () => {
      setIsLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        await new Promise((r) => setTimeout(r, 4000)); // 1.5s delay
        setWeatherData(data);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      } finally{
        setIsLoading(false);
      }
    };
    getWeather();
  }, [city]);
  if (isLoading) {
    return (
      <motion.div
        className="loading_screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          <motion.i
            key={loadingIcons[iconIndex]} // A unique key is CRITICAL
            className={loadingIcons[iconIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ position: "absolute", fontSize: "3rem" }}
          ></motion.i>
        </AnimatePresence>
      </motion.div>
    );
  }

  if (weatherData) {
    const date = new Date(weatherData.list[0].dt * 1000);
    const day = date.toLocaleDateString("en-in", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });

    const processDailyData = () => {
      const dailyData: Record<string,number[]> = {};
      const dailyIcon: Record<string , number[]> = {};
      weatherData.list.forEach((i:ForecastItem) => {
        const date = i.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
          dailyIcon[date] = [];
        }
        if (i.dt_txt.split(" ")[1] === "00:00:00") {
          dailyIcon[date].push(i.weather[0].id);
        }
        dailyData[date].push(i.main.temp);
      });
      return { dailyData, dailyIcon };
    };
    const { dailyData, dailyIcon } = processDailyData();

    const min_temp = (date:string) => {
      return Math.min(...dailyData[date]);
    };

    const max_temp = (date:string) => {
      return Math.max(...dailyData[date]);
    };

    const getDay = (date:string) => {
      const weekDay = new Date(date);
      return weekDay.toLocaleDateString("en-us", { weekday: "long" });
    };

    const hourlyForecast:ForecastItem[] = weatherData.list.slice(1, 17);

    const getIcons = (conditionId:number) => {
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
      return "fa-solid fa-cloud";
    };

    return (
      <div className="forecast_page">
        <div className="forecast_header">
          <span className="forecast_header_location">
            {weatherData.city.name}
          </span>
          <span className="forecast_header_date">{day}</span>
        </div>

        <div className="current_weather">
          <div className="current_weather_icon">
            <i className={getIcons(weatherData.list[0].weather[0].id)}></i>
          </div>
          <div className="current_weather_temp_des">
            <span className="current_weather_temp">
              {Math.round(hourlyForecast[0].main.temp)}°C
            </span>
            <span className="current_weather_description">
              {weatherData.list[0].weather[0].description}
            </span>
          </div>
        </div>

        <div className="hourly_forecast">
          <span className="section_title">Hourly Forecast</span>
          <ul className="hourly_forecast_list">
            {hourlyForecast.map((item) => (
              <li className="hour_card" key={item.dt}>
                <span className="hour_card_time">
                  {item.dt_txt.split(" ")[1].substring(0, 5)}
                </span>
                <span className="hour_card_icon">
                  <i className={getIcons(item.weather[0].id)}></i>
                </span>
                <span className="hour_card_temp">
                  {Math.round(item.main.temp)}°C
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="multi_day_forecast">
          <span className="section_title">Multi-Day Forecast</span>
          <ul className="multi_day_forecast_list">
            {Object.keys(dailyData)
              .slice(1)
              .map((date) => (
                <li className="day_row" key={date}>
                  <span className="day_row_name">{getDay(date)}</span>
                  <span className="day_row_icon">
                    <i className={getIcons(dailyIcon[date][0])}></i>
                  </span>
                  <span className="day_row_temps">
                    {Math.round(min_temp(date))}
                    °/
                    {Math.round(max_temp(date))}°
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="detailed_grid">
          <span id="grid1" className="section_title">
            Today's Highlights
          </span>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Feels Like</div>
            <div className="detailed_card_value">
              {Math.round(weatherData.list[0].main.feels_like)}°C
            </div>
          </div>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Wind</div>
            <div className="detailed_card_value">
              {Math.round(weatherData.list[0].wind.speed * 3.6)} km/h
            </div>
          </div>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Precipitation</div>
            <div className="detailed_card_value">
              {weatherData.list[0].pop * 100}%
            </div>
          </div>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Humidity</div>
            <div className="detailed_card_value">
              {weatherData.list[0].main.humidity}%
            </div>
          </div>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Pressure</div>
            <div className="detailed_card_value">
              {weatherData.list[0].main.pressure} hpa
            </div>
          </div>
          <div className="detailed_card">
            <div className="detailed_card_icon"></div>
            <div className="detailed_card_title">Visibility</div>
            <div className="detailed_card_value">
              {weatherData.list[0].visibility / 1000} km
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Detailed_forecast;
