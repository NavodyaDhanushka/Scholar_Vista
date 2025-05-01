import React from "react";
import '../styles/SearchResults.css'; // Import the CSS file

const SearchResults = ({ results }) => {
    return (
        <div className="search-results-container">
            {results.length > 0 ? (
                <ul className="results-list">
                    {results.map((paper, index) => (
                        <li key={index} className="result-item">
                            <h3>{paper.title}</h3>
                            <p className="author">👨‍🏫 Author: <span>{paper.author}</span></p>
                            <p className="abstract">📖 Abstract: {paper.abstract || "No abstract available"}</p>
                            <p className="source">🔍 Source: {paper.source}</p>

                            {/* The download paper button is removed */}
                            {paper.file_path ? (
                                <p className="file-available">File available</p>
                            ) : (
                                <p className="no-file-available">No file available</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-results-message">No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
