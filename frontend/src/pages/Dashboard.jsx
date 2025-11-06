import React, { useState, useEffect, useContext } from "react";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar.jsx";
import Container from "../components/Container.jsx";
import { AppContext } from "../context/AppContext.jsx";

const Dashboard = () => {
  const [showData, setShowData] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    biased: 0,
    neutral: 0,
    reviewable: 0,
    avgSentimentScore: 0,
    highestPositiveSentiment: 0,
    highestNegativeSentiment: 0,
    mostCommon: "",
  });
  const [showExportModal, setShowExportModal] = useState(false);

  const { userData } = useContext(AppContext);
  const name = userData.name || "PureText_User";

  // 🧾 CSV Export Helper
  const exportToCSV = (analyses) => {
    if (!analyses || analyses.length === 0) {
      alert("No analyses available to export.");
      return;
    }

    // Define CSV header (removed "Type")
    const headers = [
      "Analysis ID",
      "Date",
      "Category",
      "Original Text",
      "Correction",
      "Reason of Correction",
      "Sentiment Score",
    ];

    const rows = [];

    analyses.forEach((analysis) => {
      // ✅ Try multiple possible date fields
      const rawDate =
        analysis.createdAt || analysis.date || analysis.updatedAt || null;

      // ✅ Fix "Invalid date" issue
      const date = rawDate ? new Date(rawDate).toLocaleString() : "Unknown";

      // Flatten results
      if (analysis.results && Array.isArray(analysis.results)) {
        analysis.results.forEach((r) => {
          rows.push([
            analysis._id,
            date,
            r.category || "N/A",
            r.original_text?.replace(/\n/g, " ") || "",
            r.correction?.replace(/\n/g, " ") || "",
            r.reason_of_correction?.replace(/\n/g, " ") || "",
            r.sentiment_score || "N/A",
          ]);
        });
      }
    });

    // ✅ Convert to CSV text
    const csvContent =
      [headers.join(","), ...rows.map((r) => r.map(escapeCSV).join(","))].join(
        "\n"
      );

    // ✅ Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name} Analyses ${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🧹 Escape quotes/commas/newlines
  const escapeCSV = (value) => {
    if (value == null) return "";
    const str = String(value).replace(/"/g, '""'); // escape quotes
    if (str.search(/("|,|\n)/g) >= 0) return `"${str}"`;
    return str;
  };

  const handleExportData = () => {
    exportToCSV(analyses);
    console.log("Exporting data...");
    setShowExportModal(false);
    toast.success("Data exported successfully!");
  };

  const fetchAnalyses = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/user/analysis", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setAnalyses(data.analyses || []);
        computeStats(data.analyses || []);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    }
  };

  // 🧮 Compute sentiment statistics
  const computeStats = (analysesData) => {
    let total = 0;
    let biased = 0;
    let neutral = 0;
    let reviewable = 0;
    let sentimentScores = [];

    analysesData.forEach((analysis) => {
      analysis.results.forEach((r) => {
        total++;

        const category = r.category?.toLowerCase();
        if (category === "biased") biased++;
        else if (category === "neutral") neutral++;
        else reviewable++;

        const score = parseFloat(r.sentiment_score);
        if (!isNaN(score)) sentimentScores.push(score);
      });
    });

    const avgSentimentScore =
      sentimentScores.length > 0
        ? (
            sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length
          ).toFixed(2)
        : 0;

    const highestPositiveSentiment =
      sentimentScores.length > 0 ? Math.max(...sentimentScores) : 0;

    const highestNegativeSentiment =
      sentimentScores.length > 0 ? Math.min(...sentimentScores) : 0;

    const counts = { biased, neutral, reviewable };
    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

    setStats({
      total,
      biased,
      neutral,
      reviewable,
      avgSentimentScore: (avgSentimentScore * 100).toFixed(2),
      highestPositiveSentiment: (highestPositiveSentiment * 100).toFixed(2),
      highestNegativeSentiment: (highestNegativeSentiment * 100).toFixed(2),
      mostCommon: mostCommon?.toUpperCase() || "",
    });
  };

  // 🧩 When "Start Analyzing" is clicked
  const handleStartAnalyzing = async () => {
    setShowPopup(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // simulate loading
    setShowPopup(false);
    await fetchAnalyses();
    setShowData(true);
  };

  // 🟣 Pie chart data
  const chartData = [
    { name: "Biased", value: stats.biased, color: "#FF7F7F" },
    { name: "Neutral", value: stats.neutral, color: "#00FF00" },
    { name: "Reviewable", value: stats.reviewable, color: "#FFFF00" },
  ];

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />

      <Container>
        {!analyses.length === 0 ? (
          // ===== EMPTY PAGE =====
          <div className="empty-page">
            <div className="empty-wrapper">
              <div className="empty-card">
                <div className="empty-left">
                  <p className="usage-text">Usage statistics is empty.</p>
                  <button className="start-btn" onClick={handleStartAnalyzing}>
                    Start <br /> Analyzing
                  </button>
                </div>

                <div className="empty-right">
                  <div className="circle"></div>
                  <p className="no-stats">No statistics yet</p>
                  <p className="description">
                    Click “Start Analyzing” to view your usage statistics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ===== WITH DATA PAGE =====
          <div className="data-page">
            <div className="data-card">
              <div className="overview-left">
                <h2>OVERVIEW</h2>
                <div className="overview-row">
                  <span>Total Text Analyzed:</span>
                  <span className="data-number">{stats.total}</span>
                </div>
                <div className="overview-row">
                  <span>Biased Results:</span>
                  <span>{stats.biased}</span>
                </div>
                <div className="overview-row">
                  <span>Neutral Results:</span>
                  <span>{stats.neutral}</span>
                </div>
                <div className="overview-row">
                  <span>Reviewable Results:</span>
                  <span>{stats.reviewable}</span>
                </div>
                <div className="overview-row">
                  <span>Most Common Result:</span>
                  <span>
                    <b>{stats.mostCommon}</b>
                  </span>
                </div>
                <div className="overview-row">
                  <span>Average Sentiment Score:</span>
                  <span>{stats.avgSentimentScore}%</span>
                </div>
                <div className="overview-row">
                  <span>Highest Positive Sentiment Score:</span>
                  <span>{stats.highestPositiveSentiment}%</span>
                </div>
                <div className="overview-row">
                  <span>Highest Negative Sentiment Score:</span>
                  <span>{stats.highestNegativeSentiment}%</span>
                </div>

                {/* <div className="filter-row">
                  <label>Filter:</label>
                  <select>
                    <option>Select Date</option>
                    <option>October 2025</option>
                    <option>September 2025</option>
                  </select>
                </div> */}
                <div className="export-row">
                  <button className="export-btn" onClick={() => setShowExportModal(true)}>
                    Export Data</button>
                </div>
              </div>

              <div className="vertical-divider"></div>

              <div className="overview-right">
                <PieChart data={chartData} />
                <p className="chart-description">
                  The pie chart represents the proportion of each sentiment category identified 
                  in the analysis, helping visualize the balance between biased, neutral, and reviewable results.
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* Export Modal */}
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportData}
      />
    </div>
  );
};

export default Dashboard;