import React, { useState } from "react";
import "./Search_bar.css";

const Search_bar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    onSearch(city);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search_bar">
      <i className="fa-solid fa-magnifying-glass"></i>{" "}
      <input
        id="search_input"
        type="text"
        placeholder="Enter city name"
        onChange={(event) => setCity(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Search_bar;
