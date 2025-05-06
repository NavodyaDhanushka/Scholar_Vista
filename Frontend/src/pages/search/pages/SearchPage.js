import React, { useState } from "react";
import { searchPaper } from "../api/searchApi"; // Adjust path as needed
import SearchResults from "../components/SearchResults"; // Import results component
import '../styles/SearchPage.css'; // Import the CSS file

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setResults([]);
        setSuggestion(null);

        try {
            const data = await searchPaper(query);
            setResults(data.results);
            setSuggestion(data.suggestion);
        } catch (err) {
            setError("Failed to fetch results");
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = async () => {
        if (suggestion) {
            setQuery(suggestion); // Set the query to the suggestion
            handleSearch(); // Perform the search with the suggestion
        }
    };

    return (
        <div className="search-container">
            <h2>Search for Research Papers</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter keyword..."
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {results.length > 0 && <SearchResults results={results} />}
            {suggestion && (
                <div className="suggestion-container">
                    <p>No exact matches found. Did you mean:</p>
                    <p
                        onClick={handleSuggestionClick} // Handle suggestion click
                    >
                        <span>{suggestion}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
