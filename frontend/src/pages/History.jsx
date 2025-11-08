import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "../styles/History.css";
import Container from "../components/Container";

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("dateCreated");
  const [taskData, setTaskData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortOptions = [
    { value: "dateCreated", label: "Date Created" },
    { value: "title", label: "Title" },
    { value: "deadline", label: "Deadline" },
    { value: "status", label: "Status" },
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

  const handleSearchChange = (e) => setSearchValue(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);

  // ✅ Fetch tasks from new endpoint
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch("http://localhost:3001/api/task", {
          method: "GET",
          credentials: "include",
        });
        if (!resp.ok) throw new Error(`Failed to fetch tasks: ${resp.status}`);

        const json = await resp.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch tasks");

        // ✅ Map data to new fields
        const mapped = (json.tasks || []).map((t) => ({
          id: t._id || t.id,
          _rawDateISO: t.createdAt ? new Date(t.createdAt).toISOString() : null,
          dateCreated: t.createdAt
            ? new Date(t.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : "",
          title: t.title || t.name || t.prompt || "(Untitled Task)",
          deadline: t.deadline
            ? new Date(t.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No Deadline",
          status: t.status || "Pending",
          raw: t,
        }));

        setTaskData(mapped);
        setFilteredData(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 🔍 Filter and sort logic for new fields
  useEffect(() => {
    const term = searchValue.toLowerCase().trim();

    const baseFiltered = taskData.filter((item) => {
      if (!term) return true;
      return (
        String(item.dateCreated || "").toLowerCase().includes(term) ||
        String(item.title || "").toLowerCase().includes(term) ||
        String(item.deadline || "").toLowerCase().includes(term) ||
        String(item.status || "").toLowerCase().includes(term)
      );
    });

    const sorted = [...baseFiltered].sort((a, b) => {
      if (sortBy === "dateCreated") {
        const da = a._rawDateISO ? new Date(a._rawDateISO) : new Date(a.dateCreated || 0);
        const db = b._rawDateISO ? new Date(b._rawDateISO) : new Date(b.dateCreated || 0);
        return db - da; // newest first
      }

      const va = String(a[sortBy] || "").toLowerCase();
      const vb = String(b[sortBy] || "").toLowerCase();
      return va.localeCompare(vb);
    });

    setFilteredData(sorted);
    setCurrentPage(1);
  }, [taskData, searchValue, sortBy]);

  // 🗑️ Handle task deletion
  const handleDeleteSuccess = (deletedId) => {
    setTaskData((prev) => prev.filter((item) => item.id !== deletedId));
    setFilteredData((prev) => prev.filter((item) => item.id !== deletedId));
  };

  // 🧭 Open modal when navigated with state
  useEffect(() => {
    if (location.state?.selectedTask) {
      setSelectedTask(location.state.selectedTask);
      setShowModal(true);
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
                <p>{loading ? "Loading..." : "No tasks found."}</p>
              </div>
            ) : (
              <>
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date Created</th>
                        <th>Title</th>
                        <th>Deadline</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedTask(item.raw);
                            setShowModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="history-date-ellipsis" title={item.dateCreated}>
                            {item.dateCreated}
                          </td>
                          <td className="history-text-ellipsis" title={item.title}>
                            {item.title}
                          </td>
                          <td>{item.deadline}</td>
                          <td>{item.status}</td>
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
        <TaskModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default History;