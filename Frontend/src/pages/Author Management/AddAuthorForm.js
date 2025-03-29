import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8005/api/authors";

const AuthorManagementSystem = () => {
    const [authors, setAuthors] = useState([]);
    const [form, setForm] = useState({ name: "", email: "", affiliation: "", expertise: "" });

    useEffect(() => {
        fetchAuthors();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchAuthors();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await axios.get(API_URL);
            setAuthors(response.data);
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL + "/", form);
            fetchAuthors();
            setForm({ name: "", email: "", affiliation: "", expertise: "" });
        } catch (error) {
            console.error("Error adding author:", error);
        }
    };

    const handleDelete = async (authorId) => {
        try {
            await axios.delete(`${API_URL}/${authorId}`);
            fetchAuthors();
        } catch (error) {
            console.error("Error deleting author:", error);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Add New Author</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter author’s full name" className="w-full p-2 border rounded" required />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" className="w-full p-2 border rounded" required />
                    <input type="text" name="affiliation" value={form.affiliation} onChange={handleChange} placeholder="Enter institution/organization" className="w-full p-2 border rounded" required />
                    <input type="text" name="expertise" value={form.expertise} onChange={handleChange} placeholder="Enter areas of expertise (comma-separated)" className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full p-2 bg-black text-white rounded">Insert Author</button>
                </form>
            </div>
            <div className="max-w-3xl mx-auto mt-6 grid gap-4">
                {authors.map((author) => (
                    <div key={author.id} className="p-4 bg-white shadow-md rounded-lg">
                        <h3 className="font-semibold">{author.name}</h3>
                        <p className="text-sm text-gray-600">{author.email}</p>
                        <p className="text-sm"><strong>Affiliation:</strong> {author.affiliation}</p>
                        <p className="text-sm"><strong>Expertise:</strong> {author.expertise}</p>
                        <button onClick={() => handleDelete(author.id)} className="mt-2 text-red-500">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuthorManagementSystem;