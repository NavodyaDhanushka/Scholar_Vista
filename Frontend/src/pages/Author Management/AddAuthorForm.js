import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8005/api/authors";

const AuthorManagementSystem = () => {
    const [authors, setAuthors] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", affiliation: "", areas_of_expertise: "" });
    const [editAuthorId, setEditAuthorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAuthors();
        const interval = setInterval(fetchAuthors, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAuthors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL);
            setAuthors(response.data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch authors");
            console.error("Error fetching authors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editAuthorId) {
                // Update existing author
                await axios.put(`${API_URL}/${editAuthorId}`, form);
                setEditAuthorId(null);
            } else {
                // Create new author
                await axios.post(`${API_URL}/`, form);
            }
            setForm({ name: "", email: "", affiliation: "", areas_of_expertise: "" });
            fetchAuthors();
            setError(null);
        } catch (error) {
            setError(editAuthorId ? "Failed to update author" : "Failed to add author");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (author) => {
        setEditAuthorId(author.id);
        setForm({
            name: author.name,
            email: author.email,
            affiliation: author.affiliation || "",
            areas_of_expertise: author.areas_of_expertise || ""
        });
    };

    const handleDelete = async (authorId) => {
        if (window.confirm("Are you sure you want to delete this author?")) {
            setIsLoading(true);
            try {
                await axios.delete(`${API_URL}/${authorId}`);
                fetchAuthors();
                setError(null);
            } catch (error) {
                setError("Failed to delete author");
                console.error("Error deleting author:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const generateReport = () => {
        const reportData = authors.map(author => ({
            Name: author.name,
            Email: author.email,
            Affiliation: author.affiliation || "N/A",
            Expertise: author.areas_of_expertise || "N/A",
            Achievements: author.achievements?.length || 0
        }));

        // Generate CSV
        const headers = ["Name", "Email", "Affiliation", "Expertise", "Achievements"];
        const csvContent = [
            headers.join(","),
            ...reportData.map(row =>
                `"${row.Name}","${row.Email}","${row.Affiliation}","${row.Expertise}",${row.Achievements}`
            )

        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `authors_report_${new Date().toISOString().split("T")[0]}.csv`;

        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (author.areas_of_expertise?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {error && (
                <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by name, email, or expertise..."
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={generateReport}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">
                    {editAuthorId ? "Edit Author" : "Add New Author"}
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter author's full name"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="affiliation"
                        value={form.affiliation}
                        onChange={handleChange}
                        placeholder="Enter institution/organization"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="areas_of_expertise"
                        value={form.areas_of_expertise}
                        onChange={handleChange}
                        placeholder="Enter areas of expertise (comma-separated)"
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 p-2 bg-black text-white rounded disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Processing..."
                                : editAuthorId
                                    ? "Update Author"
                                    : "Insert Author"}
                        </button>
                        {editAuthorId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditAuthorId(null);
                                    setForm({ name: "", email: "", affiliation: "", areas_of_expertise: "" });
                                }}
                                className="p-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Authors List */}
            <div className="max-w-3xl mx-auto grid gap-4">
                {isLoading && !authors.length ? (
                    <p>Loading authors...</p>
                ) : filteredAuthors.length === 0 ? (
                    <p>No authors found</p>
                ) : (
                    filteredAuthors.map((author) => (
                        <div key={author.id} className="p-4 bg-white shadow-md rounded-lg">
                            <h3 className="font-semibold">{author.name}</h3>
                            <p className="text-sm text-gray-600">{author.email}</p>
                            <p className="text-sm">
                                <strong>Affiliation:</strong> {author.affiliation || "N/A"}
                            </p>
                            <p className="text-sm">
                                <strong>Expertise:</strong> {author.areas_of_expertise || "N/A"}
                            </p>
                            {/*<p className="text-sm">
                                <strong>Achievements:</strong>{" "}
                                {author.achievements?.length || 0}
                            </p>*/}
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(author)}
                                    className="text-blue-500 hover:underline"
                                    disabled={isLoading}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(author.id)}
                                    className="text-red-500 hover:underline"
                                    disabled={isLoading}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuthorManagementSystem;