import React, { useState, useEffect } from "react";

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

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const response = await fetch("http://localhost:8005/api/papers/");
            if (response.ok) {
                const data = await response.json();
                setPapers(data);
            }
        } catch (error) {
            console.error("Error fetching papers:", error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || file.type !== "application/pdf") {
            alert("Only PDF files are allowed!");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to upload files!");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("http://localhost:8005/api/upload/", {
                method: "POST",
                body: formData,
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                fetchPapers();
                alert("File uploaded successfully!");
            }
        } catch (error) {
            alert("Error uploading file: " + error.message);
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`http://localhost:8005/api/papers/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editData),
            });
            if (response.ok) {
                fetchPapers();
                setEditData(null);
            }
        } catch (error) {
            console.error("Error updating paper:", error);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8005/api/papers/${selectedPaper.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });
            if (response.ok) {
                fetchPapers();
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            console.error("Error deleting paper:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}> <h2>📚 Research Admin</h2> </div>
            <div style={styles.mainContent}>
                <div style={styles.header}><h2>Research Papers Management</h2></div>
                <div style={styles.uploadSection}>
                    <p>📤 Drag and drop your research paper PDF or</p>
                    <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: "none" }} id="fileUpload" />
                    <label htmlFor="fileUpload" style={styles.button}>Browse Files</label>
                </div>
                <div style={styles.fileList}>
                    <h3>Uploaded Papers</h3>
                    {papers.map((paper) => (
                        <div key={paper.id} style={styles.fileItem}>
                            <strong>📄 {paper.title}</strong>
                            <div style={styles.fileActions}>
                                <span style={styles.icon} onClick={() => setEditData(paper)}>✏️</span>
                                <span style={styles.icon} onClick={() => { setSelectedPaper(paper); setShowDeleteConfirm(true); }}>🗑️</span>
                            </div>
                        </div>
                    ))}
                </div>
                {editData && <div style={styles.modal}><input type="text" name="title" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /><button onClick={handleEditSave}>Save</button></div>}
                {showDeleteConfirm && <div style={styles.modal}><p>Are you sure?</p><button onClick={confirmDelete}>Yes</button><button onClick={() => setShowDeleteConfirm(false)}>No</button></div>}
            </div>
        </div>
    );
};

export default ResearchPapersManagement;