import React from "react";
import "../styles/components/SearchBar.css";

const SearchBar = ({
  searchValue,
  onSearchChange,
  onSearchClick,
  sortBy,
  onSortByChange,
  sortOptions,
}) => {
  return (
    <div className="searchbar-container">
      {/* Search Input + Button */}
      <div className="searchbar-input-group">
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={onSearchChange}
          className="searchbar-input"
        />
        <button onClick={onSearchClick} className="searchbar-button">
          <img
            src="/src/assets/icon_search.png"
            alt="Search Icon"
            className="searchbar-icon"
          />
        </button>
      </div>

      {/* Dropdown */}
      <div className="sortbar-dropdown">
        <span className="sortbar-label">Sort By:</span>
        <select
          className="sortbar-select"
          value={sortBy}
          onChange={onSortByChange}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;