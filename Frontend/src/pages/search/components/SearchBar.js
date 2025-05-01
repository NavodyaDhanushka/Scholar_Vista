import React, { useState } from "react";
import '../styles/SearchBar.css'; // Import the CSS file

const SearchBar = ({ onSearch }) => {
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            onSearch(keyword);
        }
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit}>
                {/* Optional label for the search bar */}
                <label htmlFor="search-input">Search for Research Papers</label>
                <input
                    id="search-input"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword..."
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default SearchBar;
