import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "../Comments&Comment Management/CommentForm"; // ✅ Make sure the path is correct

const PaperDetailsPage = () => {
    const { id } = useParams();
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
    );
};

export default PaperDetailsPage;
