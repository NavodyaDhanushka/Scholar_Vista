import React, { useState } from "react";

const ResearchPapersManagement = () => {
    const styles = {
        container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa" },
        sidebar: { width: "250px", backgroundColor: "#fff", padding: "20px", boxShadow: "2px 0px 5px rgba(0,0,0,0.1)" },
        mainContent: { flex: 1, padding: "20px", display: "flex", flexDirection: "column" },
        header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
        uploadSection: { border: "2px dashed #ccc", padding: "40px", textAlign: "center", borderRadius: "10px", backgroundColor: "#fff", cursor: "pointer" },
        fileList: { marginTop: "20px", backgroundColor: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
        fileItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #eee" },
        fileActions: { display: "flex", gap: "10px" },
        icon: { cursor: "pointer", fontSize: "18px" },
        modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", zIndex: 1000 },
        overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 999 },
        input: { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" },
        button: { padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#333", color: "#fff", cursor: "pointer", marginRight: "5px" },
    };

    const [papers, setPapers] = useState([]);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [editData, setEditData] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Upload File Handler
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            // Get the token from local storage (or wherever it's stored)
            const token = localStorage.getItem("access_token");  // Adjust based on where you store the token

            if (!token) {
                alert("You must be logged in to upload files!");
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://127.0.0.1:8005/api/upload/", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`,  // Add token to Authorization header
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    const newPaper = {
                        id: papers.length + 1,
                        title: file.name.replace(".pdf", ""),
                        author: "Unknown Author",  // Placeholder
                        year: new Date().getFullYear().toString(),
                        size: (file.size / 1024 / 1024).toFixed(2) + "MB",
                        date: new Date().toLocaleDateString(),
                    };

                    setPapers([...papers, newPaper]);
                    alert("File uploaded successfully!");
                } else {
                    alert(`Upload failed with status: ${response.status}`);
                }
            } catch (error) {
                alert("Error uploading file: " + error.message);
            }
        } else {
            alert("Only PDF files are allowed!");
        }
    };


    // View Paper Details
    const handleView = (paper) => setSelectedPaper(paper);

    // Edit Paper
    const handleEdit = (paper) => setEditData({ ...paper });

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSave = () => {
        setPapers(papers.map((p) => (p.id === editData.id ? editData : p)));
        setEditData(null);
    };

    // Delete Paper
    const handleDelete = (paper) => {
        setSelectedPaper(paper);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setPapers(papers.filter((p) => p.id !== selectedPaper.id));
        setShowDeleteConfirm(false);
        setSelectedPaper(null);
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2>📚 Research Admin</h2>
                <nav>
                    <p>📄 Research Papers</p>
                    <p>📊 Analytics</p>
                    <p>⚙️ Settings</p>
                </nav>
            </div>

            {/* Main Content */}
            <div style={styles.mainContent}>
                <div style={styles.header}>
                    <h2>Research Papers Management</h2>
                    <input type="text" placeholder="Search papers..." style={{ padding: "8px", borderRadius: "5px" }} />
                    <span>👤 Admin User</span>
                </div>

                <div style={styles.uploadSection}>
                    <p>📤 Drag and drop your research paper PDF or</p>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: "none" }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={styles.button}>Browse Files</label>
                </div>

                <div style={styles.fileList}>
                    <h3>Uploaded Papers</h3>
                    {papers.length === 0 ? <p>No papers uploaded yet.</p> : papers.map((paper) => (
                        <div key={paper.id} style={styles.fileItem}>
                            <div>
                                <strong>📄 {paper.title}</strong>
                                <p style={{ margin: "5px 0", color: "#777" }}>
                                    {paper.author} • {paper.year} • Uploaded on {paper.date} • {paper.size}
                                </p>
                            </div>
                            <div style={styles.fileActions}>
                                <span style={styles.icon} onClick={() => handleView(paper)}>👁️</span>
                                <span style={styles.icon} onClick={() => handleEdit(paper)}>✏️</span>
                                <span style={styles.icon} onClick={() => handleDelete(paper)}>🗑️</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Modal */}
            {selectedPaper && (
                <>
                    <div style={styles.overlay} onClick={() => setSelectedPaper(null)} />
                    <div style={styles.modal}>
                        <h3>📄 {selectedPaper.title}</h3>
                        <p><strong>Author:</strong> {selectedPaper.author}</p>
                        <p><strong>Year:</strong> {selectedPaper.year}</p>
                        <button style={styles.button} onClick={() => setSelectedPaper(null)}>Close</button>
                    </div>
                </>
            )}

            {/* Edit Modal */}
            {editData && (
                <>
                    <div style={styles.overlay} onClick={() => setEditData(null)} />
                    <div style={styles.modal}>
                        <h3>Edit Paper</h3>
                        <input type="text" name="title" value={editData.title} onChange={handleEditChange} style={styles.input} />
                        <input type="text" name="author" value={editData.author} onChange={handleEditChange} style={styles.input} />
                        <input type="text" name="year" value={editData.year} onChange={handleEditChange} style={styles.input} />
                        <button style={styles.button} onClick={handleEditSave}>Save</button>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <>
                    <div style={styles.overlay} onClick={() => setShowDeleteConfirm(false)} />
                    <div style={styles.modal}>
                        <h3>Are you sure you want to delete?</h3>
                        <button style={styles.button} onClick={confirmDelete}>Yes</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ResearchPapersManagement;
