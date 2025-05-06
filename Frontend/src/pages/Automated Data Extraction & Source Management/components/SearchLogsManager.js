import React, { useEffect, useState } from "react";
import { fetchSearchLogs, updateSearchLog, deleteSearchLog } from "../api/searchApi";
import "../styles/SearchLogsManager.css";

const SearchLogsManager = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    // Fetch logs
    async function loadLogs() {
        setLoading(true);
        try {
            const data = await fetchSearchLogs();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    }

    // Handle update (toggle status only if external)
    const handleUpdate = async (log) => {
        if (!log.found_in_db) {
            await updateSearchLog(log.id);
            loadLogs(); // Refresh logs
        }
    };

    // Handle delete log
    const handleDelete = async (logId) => {
        if (window.confirm("Are you sure you want to delete this log?")) {
            await deleteSearchLog(logId);
            loadLogs(); // Refresh logs
        }
    };

    return (

        <div className="logs-container">
            <h2>🔍 Search Logs</h2>
            {loading ? (
                <p>Loading logs...</p>
            ) : logs.length === 0 ? (
                <p>No logs found. Try searching for papers.</p>
            ) : (
                <table className="logs-table">
                    <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Date Searched</th>
                        <th>Source</th>
                        <th>Category</th> {/* ✅ Show category */}
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.keyword}</td>
                            <td>{new Date(log.date_searched).toLocaleString()}</td>
                            <td>{log.found_in_db ? "Internal" : "External"}</td>
                            <td>{log.category}</td> {/* ✅ Show category */}
                            <td>
                                {log.found_in_db ? (
                                    "N/A"
                                ) : (
                                    <input
                                        type="checkbox"
                                        checked={log.found_in_db}
                                        onChange={() => handleUpdate(log)}
                                    />
                                )}
                            </td>
                            <td>
                                <button className="delete-btn" onClick={() => handleDelete(log.id)}>
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchLogsManager;
