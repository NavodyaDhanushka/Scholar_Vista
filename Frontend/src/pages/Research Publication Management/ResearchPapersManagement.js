import React, { useState, useEffect } from "react";
import {
    FileText,
    Upload,
    Trash2,
    Edit2,
    Search,
    Filter,
    Download,
    Plus,
    AlertCircle
} from "lucide-react";

const ResearchPapersManagement = () => {
    const [papers, setPapers] = useState([]);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [editData, setEditData] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminName");
        window.location.href = "/login"; // Redirect to login page
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

    const filteredPapers = papers
        .filter(paper => paper.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(paper => filterStatus === "all" ? true : paper.status === filterStatus);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Research Admin</h2>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                            <FileText className="w-5 h-5 mr-3" />
                            Research Papers
                        </a>
                        <a href="/addAuthor" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Filter className="w-5 h-5 mr-3" />
                            Authors
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Download className="w-5 h-5 mr-3" />
                            Downloads
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-8 flex-shrink-0">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Research Papers</h1>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search papers..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">Upload Research Paper</h3>
                            <p className="mt-1 text-sm text-gray-500">PDF files up to 10MB</p>
                            <div className="mt-6">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="fileUpload"
                                />
                                <label
                                    htmlFor="fileUpload"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Select File
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Papers List */}
                <div className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="divide-y divide-gray-200">
                            {filteredPapers.map((paper) => (
                                <div key={paper.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900">{paper.title}</h4>
                                                <p className="text-sm text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setEditData(paper)}
                                                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedPaper(paper); setShowDeleteConfirm(true); }}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Paper Details</h3>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        />
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setEditData(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                        </div>
                        <p className="text-gray-500 mb-4">Are you sure you want to delete this paper? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResearchPapersManagement;