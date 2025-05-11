import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, User, Search , MessageSquare } from 'lucide-react'; // Make sure you have lucide-react installed

const API = 'http://localhost:8005/comments';

export default function CommentManagement() {
    const [comments, setComments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editContent, setEditContent] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAllComments();
        const interval = setInterval(() => {
            fetchAllComments();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllComments = async () => {
        const res = await axios.get(`${API}/moderation`);
        setComments(res.data);
    };

    const approveComment = async (id) => {
        await axios.post(`${API}/${id}/approve`);
        fetchAllComments();
    };

    const deleteComment = async (id) => {
        await axios.delete(`${API}/${id}`);
        fetchAllComments();
    };

    const handleEdit = (id, comment) => {
        setEditingId(id);
        setEditContent(comment);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const saveEdit = async (id) => {
        await axios.put(`${API}/${id}`, { comment: editContent });
        cancelEdit();
        fetchAllComments();
    };

    const filteredComments = comments.filter((c) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'approved' && c.approved) ||
            (filter === 'pending' && !c.approved);

        const matchesSearch = c.paper_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.comment.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });


   /* const filteredComments = comments.filter((c) => {
        if (filter === 'approved') return c.approved;
        if (filter === 'pending') return !c.approved;
        return true;
    });*/

    const pendingCount = comments.filter(c => !c.approved).length;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                    <nav className="space-y-2">
                        <a href="/researchPaperManagement" className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">
                            <FileText className="w-5 h-5 mr-3" />
                            Research Papers
                        </a>
                        <a href="/addAuthor" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <User className="w-5 h-5 mr-3" />
                            Authors
                        </a>
                        <a href="/searchLogsManagement" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Search className="w-5 h-5 mr-3" />
                            Search Log Management
                        </a>
                        <a href="/adminModeration" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 mr-3" />
                            Comment Moderation
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-3xl font-bold mb-4">Comment Moderation Panel</h2>

                {/* Pending Count Box + Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg text-center w-full sm:w-auto">
                        <p className="text-sm font-medium text-gray-500 uppercase">Pending</p>
                        <p className="text-4xl font-bold text-black">{pendingCount}</p>
                    </div>

                    <div className="mb-6">
                        {/*<label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Comments or Titles</label>*/}
                        <div className="relative w-96">
                            <input
                                type="text"
                                id="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Comments or Titles..."
                                className="w-full border border-gray-300 rounded-md py-2 px-3 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>


                    <div>
                        <label className="mr-2 font-medium">Filter:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 bg-white px-3 py-2 rounded-md focus:outline-none"
                        >
                            <option value="all">All</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Comment List */}
                {filteredComments.length === 0 ? (
                    <p className="text-gray-500">No comments found.</p>
                ) : (
                    filteredComments.map((c) => (
                        <div key={c.id} className="border border-gray-200 bg-white rounded-lg p-5 mb-4 shadow-sm">
                            <p className="text-sm text-gray-500">Anonymous — <span className="italic">{c.paper_title}</span></p>
                            {editingId === c.id ? (
                                <>
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(c.id)}
                                            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-base text-gray-800">{c.comment}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                {new Date(c.created_at).toLocaleString()}
                            </p>
                            <p className={`mt-1 font-medium ${c.approved ? 'text-green-600' : 'text-yellow-500'}`}>
                                {c.approved ? 'Approved' : 'Pending Approval'}
                            </p>
                            <div className="flex gap-3 mt-3">
                                {!c.approved && (
                                    <button
                                        onClick={() => approveComment(c.id)}
                                        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                                    >
                                        Approve
                                    </button>
                                )}
                                <button
                                    onClick={() => handleEdit(c.id, c.comment)}
                                    className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-900 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteComment(c.id)}
                                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Deny / Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
