import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnalysisModal from "../components/AnalysisModal";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "../styles/History.css";
import Container from "../components/Container";

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("dateTime");
  const [historyData, setHistoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortOptions = [
    { value: "id", label: "ID" },
    { value: "dateTime", label: "Date/Time" },
    { value: "prompt", label: "Prompt" },
    { value: "category", label: "Category" },
    { value: "score", label: "Sentiment Score" },
  ];

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const newTotal = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    if (currentPage > newTotal) setCurrentPage(newTotal);
  }, [itemsPerPage, filteredData, currentPage]);

  const handleStartAnalyzing = () => navigate("/analyzer");
  const handleSearchChange = (e) => setSearchValue(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);

  const formatIdDisplay = (id) => {
    if (!id) return "";
    const str = String(id);
    if (str.length <= 8) return str;
    return `${str.slice(0, 4)}...${str.slice(-2)}`;
  };

  useEffect(() => {
    const fetchAnalyses = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("http://localhost:3001/api/user/analysis", {
          method: "GET",
          credentials: "include",
        });
        if (!resp.ok) throw new Error(`Failed to fetch analyses: ${resp.status}`);

        const json = await resp.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch analyses");

        const mapped = (json.analyses || []).map((a) => {
          const resultsArray = Array.isArray(a.results) ? a.results : [a];

          let category = "Neutral";
          const allCategories = resultsArray.map((r) => (r.category || "").toLowerCase());
          if (allCategories.includes("reviewable")) category = "Reviewable";
          else if (allCategories.includes("biased")) category = "Biased";

          const validScores = resultsArray
            .map((r) => parseFloat(r.sentiment_score))
            .filter((s) => !isNaN(s));
          const avgSentiment =
            validScores.length > 0
              ? (validScores.reduce((sum, s) => sum + s, 0) / validScores.length).toFixed(2)
              : "N/A";

          return {
            id: a._id || a.id || Math.random().toString(36).slice(2, 9),
            _rawDateISO: a.date ? new Date(a.date).toISOString() : null,
            dateTime: a.date
              ? new Date(a.date)
                  .toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(",", "")
              : "",
            prompt: a.prompt || a.text || a.original_text || "",
            category,
            sentiment_score: avgSentiment,
            raw: a,
          };
        });

        setHistoryData(mapped);
        setFilteredData(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching analyses");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  useEffect(() => {
    const term = searchValue.toLowerCase().trim();

    const baseFiltered = historyData.filter((item) => {
      if (!term) return true;
      return (
        String(item.id || "").toLowerCase().includes(term) ||
        String(item.dateTime || "").toLowerCase().includes(term) ||
        String(item.prompt || "").toLowerCase().includes(term) ||
        String(item.category || "").toLowerCase().includes(term) ||
        String(item.sentiment_score || "").toLowerCase().includes(term)
      );
    });

    const sorted = [...baseFiltered].sort((a, b) => {
      if (sortBy === "dateTime") {
        const da = a._rawDateISO ? new Date(a._rawDateISO) : new Date(a.dateTime || 0);
        const db = b._rawDateISO ? new Date(b._rawDateISO) : new Date(b.dateTime || 0);
        return db - da;
      }

      if (sortBy === "score") {
        const aIsNA = a.sentiment_score === "N/A" || a.sentiment_score === "" || a.sentiment_score == null;
        const bIsNA = b.sentiment_score === "N/A" || b.sentiment_score === "" || b.sentiment_score == null;
        if (aIsNA && bIsNA) return 0;
        if (aIsNA) return 1;
        if (bIsNA) return -1;
        const va = parseFloat(a.sentiment_score);
        const vb = parseFloat(b.sentiment_score);
        return vb - va;
      }

      const va = String(a[sortBy] || "").toLowerCase();
      const vb = String(b[sortBy] || "").toLowerCase();
      return va.localeCompare(vb);
    });

    setFilteredData(sorted);
    setCurrentPage(1);
  }, [historyData, searchValue, sortBy]);

  const handleDeleteSuccess = (deletedId) => {
    setHistoryData((prev) => prev.filter((item) => item.id !== deletedId));
    setFilteredData((prev) => prev.filter((item) => item.id !== deletedId));
  };

  useEffect(() => {
  if (location.state?.selectedAnalysis) {
    setSelectedAnalysis(location.state.selectedAnalysis);
    setShowModal(true);
    // Clear state so modal doesn’t reopen on refresh
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-content">
        <Container>
          <div className="history-search-section">
            <SearchBar
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
              sortOptions={sortOptions}
            />
          </div>

          <div className="history-table-container">
            {filteredData.length === 0 ? (
              <div className="history-empty">
                <p>{loading ? "Loading..." : "No results found."}</p>
                <StartAnalyzingButton onClick={handleStartAnalyzing} />
              </div>
            ) : (
              <>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date / Time</th>
                        <th>Prompt</th>
                        <th>Category</th>
                        <th>Sentiment Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedAnalysis(item.raw);
                            setShowModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="history-id-ellipsis" title={item.id}>
                            {formatIdDisplay(item.id)}
                          </td>
                          <td className="history-date-ellipsis" title={item.dateTime}>
                            {item.dateTime}
                          </td>
                          <td className="history-text-ellipsis" title={item.prompt}>
                            {item.prompt}
                          </td>
                          <td>{item.category}</td>
                          <td>{item.sentiment_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-divider"></div>

                {/* ✅ Reusable Pagination Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onRowsPerPageChange={(val) => {
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </Container>
      </div>

      {showModal && (
        <AnalysisModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedAnalysis(null);
          }}
          analysis={selectedAnalysis}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default History;