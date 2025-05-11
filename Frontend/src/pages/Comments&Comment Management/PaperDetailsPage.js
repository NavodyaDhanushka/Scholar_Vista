import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentForm from "../Comments&Comment Management/CommentForm"; // ✅ Make sure the path is correct

const PaperDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPaperDetails = async () => {
            try {
                const paperRes = await fetch(`http://localhost:8005/api/papers/${id}`);
                if (!paperRes.ok) throw new Error("Failed to fetch paper details");
                const paperData = await paperRes.json();
                setPaper(paperData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaperDetails();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <>
            {/* Navbar */}
            <header style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "16px 32px",
                backgroundColor: "#FFFFFF", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}>
                <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>📚 Scholar Vista</h1>
                <nav style={{ display: "flex", gap: "16px" }}>
                    <a href="#" style={{ color: "#555", textDecoration: "none" }}>Home</a>
                    <a href="/author" style={{ color: "#555", textDecoration: "none" }}>Authors</a>
                    <a href="/searchLogs" style={{ color: "#555", textDecoration: "none" }}>Discover</a>
                    <a href="/trendingReport" style={{ color: "#555", textDecoration: "none" }}>Trending Researches</a>
                    <a href="/aiAssistant" style={{ color: "#555", textDecoration: "none" }}>Q & A</a>
                </nav>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => navigate("/login")} style={{ color: "#555", background: "none", border: "none" }}>
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            backgroundColor: "#000", color: "#FFF", padding: "8px 16px",
                            borderRadius: "8px", border: "none", cursor: "pointer"
                        }}
                    >
                        Sign Up
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                <div className="bg-white p-6 rounded shadow">
                    <h1 className="text-3xl font-bold mb-4">{paper?.title || "Paper Title"}</h1>
                    <p className="text-lg text-gray-700 mb-2">
                        <span className="font-semibold">Author:</span> {paper?.author}
                    </p>
                </div>

                {/* ✅ Comment Section */}
                <CommentForm paperId={id} paperTitle={paper?.title} />
            </div>
        </>
    );
};

export default PaperDetailsPage;
