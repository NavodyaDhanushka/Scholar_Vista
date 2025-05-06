import React, { useState } from "react";

const AIAssistant = () => {
    const [query, setQuery] = useState("");
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(false);

    const addActivity = (type, text) => {
        const newActivity = {
            id: Date.now(),
            type,
            text,
            time: "Just now"
        };
        setRecentActivity((prev) => [newActivity, ...prev]);
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8005/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: query })  // ✅ Corrected to match backend
            });
            const data = await res.json();
            addActivity("question", `Q: ${query} — A: ${data.answer || "No response"}`);
            setQuery("");
        } catch (err) {
            console.error("Search failed", err);
            addActivity("question", `Q: ${query} — A: Error fetching answer.`);
        } finally {
            setLoading(false);
        }
    };


    const handleIndex = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8005/api/indexing?url=${encodeURIComponent(query)}`, {
                method: "POST"
            });
            const data = await res.json();
            addActivity("link", `Indexed: ${query} — ${data.response || "No confirmation message"}`);
            setQuery("");
        } catch (err) {
            console.error("Indexing failed", err);
            addActivity("link", `Failed to index: ${query}`);
        } finally {
            setLoading(false);
        }
    };


    const handleClear = () => {
        setRecentActivity([]);
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>
                    <h2 style={{ margin: 0 }}>AI Assistant</h2>
                    <nav>
                        <a href="/" style={{ margin: "0 10px", textDecoration: "none", color: "#333" }}>Home</a>
                        <a href="#" style={{ margin: "0 10px", textDecoration: "none", color: "#333" }}>History</a>
                        <a href="#" style={{ margin: "0 10px", textDecoration: "none", color: "#333" }}>Settings</a>
                    </nav>
                </header>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button onClick={handleSearch} style={{ padding: "10px 15px", marginRight: "10px", backgroundColor: "#000", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>🔍 Ask Questions</button>
                    <button onClick={handleIndex} style={{ padding: "10px 15px", backgroundColor: "#000", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>🔗 Index Links</button>
                </div>

                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask a question or paste a link to index..."
                        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "16px" }}
                    />
                    <button onClick={handleSearch} disabled={loading} style={{ padding: "10px 15px", backgroundColor: "#000", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                        {loading ? "Loading..." : "Search"}
                    </button>
                    <button onClick={handleIndex} disabled={loading} style={{ padding: "10px 15px", backgroundColor: "#000", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                        {loading ? "Indexing..." : "+ Index"}
                    </button>
                </div>

                <div style={{ marginTop: "30px", backgroundColor: "#f1f1f1", padding: "15px", borderRadius: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <h3 style={{ margin: 0 }}>Recent Activity</h3>
                        <button onClick={handleClear} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}>Clear All</button>
                    </div>

                    {recentActivity.length === 0 ? (
                        <p>No recent activity</p>
                    ) : (
                        recentActivity.map((activity) => (
                            <div key={activity.id} style={{ padding: "10px", backgroundColor: "#fff", borderRadius: "5px", marginBottom: "5px", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
                                <p style={{ margin: 0 }}>{activity.type === "question" ? "💬" : "🔗"} {activity.text}</p>
                                <small style={{ color: "#777" }}>{activity.time}</small>
                            </div>
                        ))
                    )}
                </div>

                <footer style={{ marginTop: "20px", textAlign: "center", color: "#777", fontSize: "14px" }}>
                    © 2025 AI Assistant. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default AIAssistant;
