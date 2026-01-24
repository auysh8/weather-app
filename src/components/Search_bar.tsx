import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";

type SearchBarProps = {
  onSearch: (city: string) => void;
};

interface HistroyItems{
  _id: string,
  city: string

}

const Search_bar = ({ onSearch }: SearchBarProps) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [history, setHistory] = useState<HistroyItems[]>([]);
  const API_BASE_URL = "https://weather-app-za51.onrender.com";

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history`);
      const data = await response.json();
      setHistory(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (cityName: string) => {
    onSearch(cityName);
    setIsDropdown(false);

    try {
      await fetch(`${API_BASE_URL}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      });
      fetchHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement> , cityName: string) => {
    if (event.key === "Enter") {
      handleSearch(cityName);
    }
  };

  return (
    <div className="bar">
      <div
        className="search_bar"
        onFocus={() => setIsDropdown(true)}
        onBlur={() => setIsDropdown(false)}
      >
        <i className="fa-solid fa-magnifying-glass"></i>{" "}
        <input
          id="search_input"
          type="text"
          placeholder="Enter city name"
          onChange={(event) => {
            setIsDropdown(false);
            if(event.target.value == ""){
              setIsDropdown(true);
            }
            else{
              setIsDropdown(false)
            }
          }}
          onKeyDown={(event) => handleKeyDown(event , (event.target as HTMLInputElement).value )}
        />
      </div>
      {isDropdown && (
        <div className="dropdown">
          {history.map((item) => (
            <div
              className="history"
              key={item._id}
              onMouseDown={() => {
                handleSearch(item.city);
              }}
            >
              <span className="recent_city">{item.city}</span>
              <FaHistory />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search_bar;
