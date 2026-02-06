import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";

type SearchBarProps = {
  onSearch: (city: string) => void;
};

interface HistroyItems {
  _id: string;
  city: string;
}

const Search_bar = ({ onSearch }: SearchBarProps) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [history, setHistory] = useState<HistroyItems[]>([]);
  const [query, setQuery] = useState("");
  const API_BASE_URL = "http://localhost:5000";

  const fetchHistory = async (cityName = "") => {
    try {
      console.log("Fetching history for:", cityName);
      const response = await fetch(
        `${API_BASE_URL}/api/history?search=${cityName}`,
      );
      const data = await response.json();
      setHistory(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (cityName: string) => {
    setQuery(cityName);
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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    cityName: string,
  ) => {
    if (event.key === "Enter") {
      handleSearch(query);
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
          value={query}
          onChange={(event) => {
            const val = event.target.value;
            setQuery(val);
            setIsDropdown(true);
          }}
          onKeyDown={(event) =>
            handleKeyDown(event, (event.target as HTMLInputElement).value)
          }
        />
      </div>
      {isDropdown && history.length > 0 && (
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
