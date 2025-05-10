import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8005/comments';

export default function CommentManagement() {
    const [comments, setComments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAllComments(); // initial fetch

        const interval = setInterval(() => {
            fetchAllComments(); // fetch every X seconds
        }, 5000); // auto-refresh every 5 seconds

        return () => clearInterval(interval); // cleanup on unmount
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
        if (filter === 'approved') return c.approved;
        if (filter === 'pending') return !c.approved;
        return true;
    });

    const pendingCount = comments.filter(c => !c.approved).length;

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans text-black">
            <h2 className="text-3xl font-bold mb-4">Comment Moderation Panel</h2>

            {/* Pending Count Box + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg text-center w-full sm:w-auto">
                    <p className="text-sm font-medium text-gray-500 uppercase">Pending</p>
                    <p className="text-4xl font-bold text-black">{pendingCount}</p>
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
                        {/* Name */}
                        <p className="text-sm text-gray-500">Anonymous — <span className="italic">{c.paper_title}</span></p>


                        {/* Comment or Edit Mode */}
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

                        {/* Timestamp */}
                        <p className="text-sm text-gray-500 mt-2">
                            {new Date(c.created_at).toLocaleString()}
                        </p>

                        {/* Status */}
                        <p className={`mt-1 font-medium ${c.approved ? 'text-green-600' : 'text-yellow-500'}`}>
                            {c.approved ? 'Approved' : 'Pending Approval'}
                        </p>

                        {/* Action Buttons */}
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
    );
}
