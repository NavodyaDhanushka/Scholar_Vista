import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:8005/comments/';


export default function CommentSection({ paperId,paperTitle }) {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState('write');
    const [showWarning, setShowWarning] = useState(false);


    const fetchComments = useCallback(async () => {
        try {
            const res = await axios.get(`${API}paper/${paperId}`);
            setComments(res.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }, [paperId]);

    useEffect(() => {
        if (paperId) {
            fetchComments();
        }
    }, [paperId, fetchComments]);

    useEffect(() => {
        if (!paperId) return;

        const interval = setInterval(() => {
            fetchComments();
        }, 5000); // every 5 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, [paperId, fetchComments]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (comment.trim().length < 15) {
            setShowWarning(true);
            return;
        }

        try {
            await axios.post(API, {
                name: name.trim() || 'Anonymous',
                comment: comment.trim(),
                paper_id: paperId, // 👈 Pass the paperId here
                paper_title: paperTitle,
            });
            setComment('');
            setName('');
            setShowWarning(false);
            fetchComments();
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    const handleLike = async (id) => {
        await axios.post(`${API}${id}/like`);
        fetchComments();
    };

    const handleDislike = async (id) => {
        await axios.post(`${API}${id}/dislike`);
        fetchComments();
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>

            {/* Markdown Toolbar Icons (static, no functionality yet) */}
            <div className="flex gap-3 mb-2 text-gray-500">
                <i className="fa fa-superscript hover:text-gray-800" title="LaTeX equations"></i>
                <i className="fa fa-link hover:text-gray-800" title="Link"></i>
                <i className="fa fa-image hover:text-gray-800" title="Image"></i>
                <i className="fa fa-bold hover:text-gray-800" title="Bold"></i>
                <i className="fa fa-italic hover:text-gray-800" title="Italics"></i>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-2">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'write' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('write')}
                >
                    Write
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {activeTab === 'write' && (
                    <>
                        <textarea
                            placeholder="Your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={6}
                        />

                        <div className="text-sm text-gray-500">
                            <label className="block">
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={() => alert('File upload not implemented')}
                                />
                                <span className="text-blue-600 cursor-pointer">Attach files</span> by dragging & dropping, selecting them, or pasting.
                            </label>
                        </div>

                        {showWarning && comment.trim().length < 15 && (
                            <p className="text-red-600 text-sm">
                                Comment must be at least 15 characters.
                            </p>
                        )}
                    </>
                )}

                {activeTab === 'preview' && (
                    <div className="bg-gray-100 p-4 rounded border text-gray-800 min-h-[6rem]">
                        {comment.trim() ? comment : 'Nothing to preview.'}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </form>

            {/* Comments List */}
            <div className="mt-6 space-y-6 font-sans">
                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="bg-white text-black border border-gray-200 p-5 rounded-xl shadow-sm"
                    >
                        <div className="flex justify-between items-center pb-3 px-3 py-2 bg-gray-200 rounded-t-xl mb-3">
                            <p className="font-semibold text-lg">{c.name || 'Anonymous'}</p>
                        </div>

                        <p className="text-base leading-relaxed whitespace-pre-line px-1">{c.comment}</p>

                        <div className="bg-gray-200 mt-4 px-3 py-2 rounded-b-xl flex gap-6 text-sm text-gray-800">
                            <button
                                onClick={() => handleLike(c.id)}
                                className="flex items-center gap-1 hover:text-black transition"
                            >
                                👍 {c.likes}
                            </button>
                            <button
                                onClick={() => handleDislike(c.id)}
                                className="flex items-center gap-1 hover:text-black transition"
                            >
                                👎 {c.dislikes}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
