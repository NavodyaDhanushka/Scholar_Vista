import React, { useEffect, useState } from "react";
import axios from "axios";

const AuthorsList = () => {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await axios.get("http://localhost:8005/api/authors");
                setAuthors(res.data);
                setFilteredAuthors(res.data); // Initially show all authors
            } catch (err) {
                console.error("Error fetching authors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = authors.filter((author) =>
            author.name.toLowerCase().includes(term)
        );
        setFilteredAuthors(filtered);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Author ID Cards</h1>

            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search author by name..."
                    className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : filteredAuthors.length === 0 ? (
                <div className="text-center text-gray-500">No authors found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="bg-white border rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-4xl font-bold">
                                {author.name?.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-1">{author.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">{author.email}</p>

                            {author.affiliation && (
                                <p className="text-sm text-gray-700 mb-1">
                                    <strong>Affiliation:</strong> {author.affiliation}
                                </p>
                            )}

                            {author.areas_of_expertise && (
                                <p className="text-sm text-gray-700">
                                    <strong>Expertise:</strong> {author.areas_of_expertise}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuthorsList;
