import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const TrendingReport = () => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [trendingData, setTrendingData] = useState([]);
    const [timeframe, setTimeframe] = useState("alltime");
    const [chartType, setChartType] = useState("bar");
    const [loading, setLoading] = useState(false);

    const fetchTrendingData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8005/api/trending?timeframe=${timeframe}`);
            setTrendingData(response.data);
        } catch (error) {
            console.error("Error fetching trending data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrendingData();
    }, [timeframe]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        if (trendingData.length === 0) return;

        const ctx = canvasRef.current.getContext("2d");
        chartRef.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: trendingData.map((item) => item.keyword),
                datasets: [
                    {
                        label: "Search Count",
                        data: trendingData.map((item) => item.count),
                        backgroundColor: ["#4F46E5", "#EF4444", "#F59E0B", "#10B981", "#6366F1"],
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "#374151" } },
                },
                scales: {
                    x: { ticks: { color: "#4B5563" } },
                    y: { ticks: { color: "#4B5563" } },
                },
            },
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [trendingData, chartType]);

    const handleGeneratePDF = async () => {
        try {
            const canvas = canvasRef.current;
            const chartImage = canvas.toDataURL("image/png");

            const response = await axios.post(
                "http://127.0.0.1:8005/api/generate_report",
                { timeframe, chartImage },
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Trending_Report_${timeframe}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating report", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            <div className="w-64 bg-gray-100 shadow-lg p-6 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">📊 Trending Researches</h2>
                <div className="mb-4">
                    <h3 className="text-gray-700 font-semibold mb-2">🔍 Filters</h3>
                    <label className="block text-sm text-gray-600">Timeframe:</label>
                    <select
                        onChange={(e) => setTimeframe(e.target.value)}
                        value={timeframe}
                        className="w-full mt-2 p-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg"
                    >
                        <option value="alltime">All Time</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
                <div className="mb-4">
                    <h3 className="text-gray-700 font-semibold mb-2">📊 Chart Type</h3>
                    <select
                        onChange={(e) => setChartType(e.target.value)}
                        value={chartType}
                        className="w-full mt-2 p-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-lg"
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="doughnut">Doughnut Chart</option>
                    </select>
                </div>
                <button
                    onClick={handleGeneratePDF}
                    className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                    📄 Generate PDF Report
                </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {loading ? (
                    <p className="text-gray-600 text-lg">Loading...</p>
                ) : (
                    <div className="w-full max-w-4xl h-[500px] bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                        <canvas ref={canvasRef} className="w-full h-full"></canvas>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendingReport;