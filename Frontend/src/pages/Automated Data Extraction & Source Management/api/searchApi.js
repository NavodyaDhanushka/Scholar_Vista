import axios from "axios";

const BASE_URL = "http://127.0.0.1:8005"; // Adjust if needed

// ✅ Fetch search logs
export async function fetchSearchLogs() {
    try {
        const response = await axios.get(`${BASE_URL}/api/search/logs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
}

// ✅ Search for research papers
export async function searchPaper(keyword) {
    try {
        const response = await axios.post(`${BASE_URL}/api/search`, { keyword });

        // If no exact matches found, check if there's a suggestion
        if (response.data.results.length === 0 && response.data.suggestion) {
            return { results: [], suggestion: response.data.suggestion };
        }

        return { results: response.data.results, suggestion: null };
    } catch (error) {
        console.error("Search error:", error);
        return { results: [], suggestion: null };
    }
}

// ✅ Fetch trending topics
export async function fetchTrendingTopics() {
    try {
        const response = await axios.get(`${BASE_URL}/api/trending`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trending topics:", error);
        return [];
    }
}

// ✅ Update search log (Mark as reviewed)
export async function updateSearchLog(logId) {
    try {
        const response = await axios.put(`${BASE_URL}/api/search_logs/${logId}`);
        return response.data;
    } catch (error) {
        console.error("Error updating log:", error);
    }
}

// ✅ Delete search log
export async function deleteSearchLog(logId) {
    try {
        await axios.delete(`${BASE_URL}/api/search_logs/${logId}`);
    } catch (error) {
        console.error("Error deleting log:", error);
    }
}

// ✅ Generate Report
export async function generateReport() {
    try {
        const response = await axios.get(`${BASE_URL}/api/generate_report`);
        return response.data;
    } catch (error) {
        console.error("Error generating report:", error);
        return {};
    }
}
