import React from "react";
import { FaSearch, FaRegBookmark } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const navigate = useNavigate();

  const papers = [
    {
      author: "Dr. Sarah Johnson",
      institution: "Stanford University",
      title: "Quantum Computing: A New Era in Information Processing",
      published: "Published in Nature, 2025",
      citations: "1,245",
    },
    {
      author: "Prof. Michael Chen",
      institution: "MIT",
      title: "Machine Learning in Healthcare: Predictive Analytics",
      published: "Published in Science, 2025",
      citations: "892",
    },
    {
      author: "Dr. Emily Brown",
      institution: "Oxford University",
      title: "Climate Change: Impact on Global Ecosystems",
      published: "Published in Nature Climate, 2025",
      citations: "756",
    },
  ];

  return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F8F9FA" }}>
        {/* Navbar */}
        <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 32px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>📚 Scholar Vista</h1>
          <nav style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ color: "#555", textDecoration: "none" }}>
              Home
            </a>
            <a href="#" style={{ color: "#555", textDecoration: "none" }}>
              Browse
            </a>
            <a href="#" style={{ color: "#555", textDecoration: "none" }}>
              Categories
            </a>
            <a href="#" style={{ color: "#555", textDecoration: "none" }}>
              About
            </a>
          </nav>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => navigate("/login")} style={{ color: "#555", background: "none", border: "none" }}>
              Sign In
            </button>
            <button
                onClick={() => navigate("/register")}
                style={{
                  backgroundColor: "#000",
                  color: "#FFF",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
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
                style={{
                  width: "350px",
                  padding: "12px",
                  border: "1px solid #CCC",
                  borderRadius: "8px 0 0 8px",
                  outline: "none",
                }}
            />
            <button
                style={{
                  backgroundColor: "#000",
                  color: "#FFF",
                  padding: "12px 24px",
                  borderRadius: "0 8px 8px 0",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  cursor: "pointer",
                }}
            >
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
            {papers.map((paper, index) => (
                <div
                    key={index}
                    style={{
                      backgroundColor: "#FFF",
                      padding: "24px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                >
                  <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{paper.author}</h4>
                  <p style={{ color: "#777", fontSize: "14px" }}>{paper.institution}</p>
                  <h5 style={{ marginTop: "12px", fontSize: "16px", fontWeight: "bold" }}>{paper.title}</h5>
                  <p style={{ color: "#777", fontSize: "14px" }}>{paper.published}</p>
                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", color: "#555" }}>
                    <span>{paper.citations} citations</span>
                    <FaRegBookmark style={{ cursor: "pointer" }} />
                  </div>
                </div>
            ))}
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
              <h4 style={{ fontWeight: "bold" }}>Resources</h4>
              <ul style={{ color: "#777", fontSize: "14px", marginTop: "8px" }}>
                <li><a href="#">Browse Papers</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">Authors</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: "bold" }}>Company</h4>
              <ul style={{ color: "#777", fontSize: "14px", marginTop: "8px" }}>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
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
