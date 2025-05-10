import React, { useEffect, useState } from "react";
import { FaSearch, FaRegBookmark } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const HomePage = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query
    const [filteredPapers, setFilteredPapers] = useState([]); // State for the filtered papers

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await fetch("http://localhost:8005/api/papers"); // Adjust API endpoint if needed
                if (!response.ok) throw new Error("Failed to fetch papers");

                const data = await response.json();
                setPapers(data);
                setFilteredPapers(data); // Initially, show all papers
            } catch (error) {
                console.error("Error fetching papers:", error);
            }
        };

        fetchPapers();
    }, []);

    // Search handler function
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = papers.filter((paper) => {
            return (
                (paper.title && paper.title.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (paper.author && paper.author.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (paper.institution && paper.institution.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (paper.keywords && paper.keywords.toLowerCase().includes(e.target.value.toLowerCase())) // Include other fields you want to search
            );
        });
        setFilteredPapers(filtered);
    };


    const handleDownload = async (filePath) => {
        try {
            const cleanedFilePath = filePath.replace(/\\/g, "/").replace("uploads/", "");
            const response = await fetch(`http://localhost:8005/api/download/${encodeURIComponent(cleanedFilePath)}`, {
                method: "GET",
            });

            if (!response.ok) throw new Error("Failed to download file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = cleanedFilePath.split("/").pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F8F9FA" }}>
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

            {/* Hero Section */}
            <div style={{ textAlign: "center", padding: "48px 0" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Find Research Papers</h2>
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                    <input
                        type="text"
                        placeholder="Search by title, author, or keywords..."
                        value={searchQuery}
                        onChange={handleSearch} // Handle input change for search
                        style={{
                            width: "350px", padding: "12px", border: "1px solid #CCC",
                            borderRadius: "8px 0 0 8px", outline: "none"
                        }}
                    />
                    <button style={{
                        backgroundColor: "#000", color: "#FFF", padding: "12px 24px",
                        borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center",
                        border: "none", cursor: "pointer"
                    }}>
                        <FaSearch style={{ marginRight: "8px" }} /> Search
                    </button>
                </div>
            </div>

            {/* Trending Research Papers */}
            <div style={{ padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Trending Research Papers</h3>
                    <a href="#" style={{ color: "#555", textDecoration: "none", display: "flex", alignItems: "center" }}>
                        View all <FiArrowRight style={{ marginLeft: "8px" }} />
                    </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                    {filteredPapers.length > 0 ? (
                        filteredPapers.map((paper, index) => (
                            <div key={index} style={{
                                backgroundColor: "#FFF", padding: "24px", borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}>
                                <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{paper.author}</h4>
                                <p style={{ color: "#777", fontSize: "14px" }}>{paper.institution}</p>
                                <h5 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "bold" }}>
                                    <Link
                                        to={`/paper/${paper.id}`}
                                        style={{ color: "#000", textDecoration: "none" }}
                                    >
                                        {paper.title}
                                    </Link>
                                </h5>

                                <p style={{ color: "#777", fontSize: "14px" }}>{paper.published}</p>

                                <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ color: "#555" }}>{paper.citations} citations</span>
                                    <div style={{ display: "flex", gap: "12px" }}>
                                        <button
                                            onClick={() => handleDownload(paper.file_path)}
                                            style={{
                                                backgroundColor: "#000", color: "#FFF",
                                                padding: "8px 12px", borderRadius: "6px",
                                                border: "none", cursor: "pointer",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Download PDF
                                        </button>
                                        <FaRegBookmark style={{ cursor: "pointer", color: "#555", fontSize: "18px" }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", color: "#777" }}>No research papers found.</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={{ backgroundColor: "#F0F0F0", padding: "32px", marginTop: "48px" }}>
                <div style={{ maxWidth: "1000px", margin: "auto", display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h1 style={{ fontSize: "16px", fontWeight: "bold" }}>📚 Scholar Vista</h1>
                        <p style={{ color: "#777", fontSize: "14px", marginTop: "8px" }}>Your gateway to academic research</p>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: "bold" }}>Follow Us</h4>
                        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                            <BsTwitter style={{ color: "#555", cursor: "pointer" }} />
                            <BsLinkedin style={{ color: "#555", cursor: "pointer" }} />
                            <BsGithub style={{ color: "#555", cursor: "pointer" }} />
                        </div>
                    </div>
                </div>
                <p style={{ textAlign: "center", color: "#777", fontSize: "12px", marginTop: "24px" }}>
                    © 2025 Scholar Vista. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
