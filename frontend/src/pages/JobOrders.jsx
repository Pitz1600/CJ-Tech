import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/JobOrders.css';
import { Search, Filter, LayoutGrid, List, ChevronUp, ChevronDown } from 'lucide-react';

const JobOrders = () => {
    const { backendUrl } = useContext(AppContext);
    const [jobOrders, setJobOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // New sorting and filtering state
    const [activeFilter, setActiveFilter] = useState(null); // 'Pending', 'Completed', 'High Priority'
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const getLocalISOString = () => new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const [newJob, setNewJob] = useState({ device: '', customerName: '', issueDescription: '', status: 'Pending', priority: false, revenue: 0, noDeadline: false, deadline: getLocalISOString() });

    const fetchJobOrders = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/joborder/all`);
            if (res.data.success) {
                // map legacy 'In Progress' to 'Pending' on fetch if needed
                const jobs = res.data.jobOrders.map(j => ({
                    ...j,
                    status: j.status === 'In Progress' ? 'Pending' : j.status
                }));
                setJobOrders(jobs);
            }
        } catch (error) {
            toast.error("Failed to fetch Job Orders");
        }
    };

    useEffect(() => {
        fetchJobOrders();
    }, [backendUrl]);

    const handleSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <span className="text-transparent inline-block w-4"><ChevronUp size={14} /></span>;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="inline-block" /> : <ChevronDown size={14} className="inline-block" />;
    };

    const sortedAndFilteredOrders = useMemo(() => {
        let filtered = jobOrders.filter(job =>
            job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobId.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (activeFilter === 'Pending') filtered = filtered.filter(j => j.status === 'Pending');
        if (activeFilter === 'Completed') filtered = filtered.filter(j => j.status === 'Completed');
        if (activeFilter === 'High Priority') filtered = filtered.filter(j => j.priority === true);

        return filtered.sort((a, b) => {
            const isAsc = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'createdAt') {
                return (new Date(a.createdAt) - new Date(b.createdAt)) * isAsc;
            }
            if (sortConfig.key === 'priority') {
                return (a.priority === b.priority ? 0 : a.priority ? 1 : -1) * isAsc;
            }
            if (a[sortConfig.key] < b[sortConfig.key]) return -1 * isAsc;
            if (a[sortConfig.key] > b[sortConfig.key]) return 1 * isAsc;
            return 0;
        });
    }, [jobOrders, searchTerm, activeFilter, sortConfig]);

    const itemsPerPage = 8;
    const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);
    const paginatedOrders = sortedAndFilteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleRowClick = (job) => {
        setSelectedJob(job);
        setEditData({
            ...job,
            noDeadline: !job.deadline,
            deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 16) : '',
            completedAt: job.completedAt ? new Date(job.completedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleCreateNewJob = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newJob };
            if (payload.noDeadline) delete payload.deadline;

            const res = await axios.post(`${backendUrl}/api/joborder/create`, payload);
            if (res.data.success) {
                toast.success("Job order created");
                setIsNewJobModalOpen(false);
                setNewJob({ device: '', customerName: '', issueDescription: '', status: 'Pending', priority: false, revenue: 0, noDeadline: false, deadline: getLocalISOString() });
                fetchJobOrders();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdateJob = async () => {
        try {
            const payload = { ...editData, status: editData.status === 'In Progress' ? 'Pending' : editData.status };
            if (payload.noDeadline) payload.deadline = null; // effectively clear it

            const res = await axios.put(`${backendUrl}/api/joborder/update/${selectedJob._id}`, payload);
            if (res.data.success) {
                toast.success("Job order updated");
                setIsModalOpen(false);
                setIsEditing(false);
                fetchJobOrders();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="job-orders-container">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Job Orders</h1>
                    <p className="page-subtitle">Managing {jobOrders.length} active repair operations across all stations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsNewJobModalOpen(true)}>+ New Job Order</button>
            </div>

            <div className="metrics-row mb-6">
                <div
                    className={`card metric-tile cursor-pointer hover:border-[var(--accent-blue)] hover:bg-[#1a1d24] hover:-translate-y-1 transition-all shadow-md ${activeFilter === 'Pending' ? 'border-[var(--accent-blue)] bg-[rgba(0,113,242,0.1)]' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'Pending' ? null : 'Pending')}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary text-xs uppercase font-bold text-wide">Pending</span>
                        <span className="icon-badge">⏱️</span>
                    </div>
                    <h2>{jobOrders.filter(j => j.status === 'Pending').length}</h2>
                </div>
                <div
                    className={`card metric-tile cursor-pointer hover:border-[var(--success)] hover:bg-[#1a1d24] hover:-translate-y-1 transition-all shadow-md ${activeFilter === 'Completed' ? 'border-[var(--success)] bg-[rgba(16,185,129,0.1)]' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'Completed' ? null : 'Completed')}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary text-xs uppercase font-bold text-wide">Completed Today</span>
                        <span className="icon-badge">✓</span>
                    </div>
                    <h2>{jobOrders.filter(j => j.status === 'Completed').length}</h2>
                </div>
                <div
                    className={`card metric-tile alert-border cursor-pointer hover:border-[var(--danger)] hover:bg-[#1a1d24] hover:-translate-y-1 transition-all shadow-md ${activeFilter === 'High Priority' ? 'border-[var(--danger)] bg-[rgba(239,68,68,0.1)]' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'High Priority' ? null : 'High Priority')}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-secondary text-xs uppercase font-bold text-wide">High Priority</span>
                        <span className="icon-badge">⚠️</span>
                    </div>
                    <h2>{jobOrders.filter(j => j.priority).length}</h2>
                    <p className="text-xs text-danger mt-4 font-bold">● CLICK TO VIEW</p>
                </div>
            </div>

            <div className="toolbar-section card mb-6 p-4 flex gap-4 bg-[var(--bg-dark)]">
                <div className="search-bar flex-1 relative max-w-4xl">
                    <Search size={18} className="search-icon absolute top-3 left-3 text-secondary" />
                    <input
                        type="text"
                        placeholder="Search orders, customers, or devices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input w-full pl-10 bg-[#0F1115] border border-[var(--border-color)] rounded p-2 focus:border-[var(--accent-blue)] outline-none text-white transition-colors"
                    />
                </div>
            </div>

            <div className="controls-row flex justify-between items-center mb-4 px-1">
                <div className="flex gap-4">
                    <button
                        className={`btn text-xs ${activeFilter ? 'btn-primary' : 'btn-secondary text-secondary opacity-50 cursor-not-allowed'}`}
                        onClick={() => setActiveFilter(null)}
                        disabled={!activeFilter}
                    >
                        <Filter size={14} /> Show All
                    </button>
                    {/* Sort By Dropdown Removed as requested */}
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary">
                    <div className="view-toggle flex gap-2">
                        <button className="icon-btn active"><List size={16} /></button>
                        <button className="icon-btn"><LayoutGrid size={16} /></button>
                    </div>
                    <span>Showing {sortedAndFilteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedAndFilteredOrders.length)} of {sortedAndFilteredOrders.length}</span>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="cursor-pointer hover:text-white select-none" onClick={() => handleSort('jobId')}>Job ID {getSortIcon('jobId')}</th>
                            <th className="cursor-pointer hover:text-white select-none" onClick={() => handleSort('device')}>Device & Customer {getSortIcon('device')}</th>
                            <th className="cursor-pointer hover:text-white select-none" onClick={() => handleSort('createdAt')}>Deadline {getSortIcon('createdAt')}</th>
                            <th className="cursor-pointer hover:text-white select-none" onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                            <th className="cursor-pointer hover:text-white select-none" onClick={() => handleSort('priority')}>Priority {getSortIcon('priority')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders.map((job) => (
                            <tr key={job._id} onClick={() => handleRowClick(job)} className="clickable-row">
                                <td><span className="job-id-badge">{job.jobId}</span></td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar-circle">{job.customerName.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="font-bold">{job.device}</div>
                                            <div className="text-xs text-secondary">{job.customerName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : <span className="text-secondary italic">No deadline</span>}</td>
                                <td>
                                    <span className={`badge ${job.status === 'Completed' ? 'completed' : 'pending'}`}>
                                        {job.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${job.priority ? 'danger' : 'progress'}`}>
                                        {job.priority ? 'HIGH' : 'NORMAL'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {paginatedOrders.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-8 text-secondary">No job orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination flex justify-between items-center mt-6 card p-2">
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Details & Edit Modal */}
            {isModalOpen && selectedJob && (
                <div className="modal-overlay z-50 fixed inset-0 bg-black/80 flex justify-center items-center" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content overflow-y-auto max-h-[90vh] bg-[#171A21] border border-[var(--border-color)] p-6 rounded-md w-[600px] max-w-full" onClick={e => e.stopPropagation()}>
                        <div className="modal-header flex justify-between items-start mb-6">
                            <div className="w-full mr-4">
                                <span className="job-id-badge">{selectedJob.jobId}</span>
                                {isEditing ? (
                                    <input type="text" className="w-full mt-2 text-xl font-bold bg-transparent border-b border-[var(--border-color)] text-white outline-none focus:border-[var(--accent-blue)]" value={editData.device} onChange={e => setEditData({ ...editData, device: e.target.value })} placeholder="Device Name" />
                                ) : (
                                    <h2 className="mt-2">{selectedJob.device}</h2>
                                )}
                                {isEditing ? (
                                    <input type="text" className="w-full mt-1 text-secondary bg-transparent border-b border-[var(--border-color)] outline-none focus:border-[var(--accent-blue)]" value={editData.customerName} onChange={e => setEditData({ ...editData, customerName: e.target.value })} placeholder="Customer Name" />
                                ) : (
                                    <p className="text-secondary">{selectedJob.customerName}</p>
                                )}
                            </div>
                            <span className={`badge ${editData.status === 'Completed' ? 'completed' : 'pending'}`}>
                                {(editData.status === 'In Progress' ? 'PENDING' : editData.status).toUpperCase()}
                            </span>
                        </div>

                        <div className="modal-body mb-6">
                            <h4 className="text-xs uppercase text-secondary mb-2 font-bold">Issue Description</h4>
                            {isEditing ? (
                                <textarea rows="3" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md mb-4 text-sm text-white outline-none focus:border-[var(--accent-blue)]" value={editData.issueDescription} onChange={e => setEditData({ ...editData, issueDescription: e.target.value })} />
                            ) : (
                                <div className="p-4 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md mb-4 text-sm whitespace-pre-wrap">
                                    {selectedJob.issueDescription}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="text-xs uppercase text-secondary mb-1 font-bold">Priority</h4>
                                    {isEditing ? (
                                        <select className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value === 'true' })}>
                                            <option value={false}>Normal</option>
                                            <option value={true}>High Priority</option>
                                        </select>
                                    ) : (
                                        <p className="text-sm">{selectedJob.priority ? <span className="text-danger font-bold">HIGH</span> : 'Normal'}</p>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase text-secondary mb-1 font-bold">Estimated Revenue</h4>
                                    {isEditing ? (
                                        <input type="number" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={editData.revenue} onChange={e => setEditData({ ...editData, revenue: Number(e.target.value) })} />
                                    ) : (
                                        <p className="text-sm">₱{selectedJob.revenue.toLocaleString()}</p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-xs uppercase text-secondary mb-2 font-bold">Deadline Configuration</h4>
                                    {isEditing ? (
                                        <div className="p-3 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md">
                                            <label className="flex items-center gap-3 cursor-pointer select-none mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-[var(--accent-blue)]"
                                                    checked={editData.noDeadline}
                                                    onChange={(e) => setEditData({ ...editData, noDeadline: e.target.checked, deadline: e.target.checked ? '' : editData.deadline })}
                                                />
                                                <span className="font-bold">No deadline</span>
                                            </label>
                                            {!editData.noDeadline && (
                                                <div className="ml-8 mt-2">
                                                    <span className="text-xs text-secondary uppercase font-bold block mb-1">Target Deadline</span>
                                                    <input
                                                        type="datetime-local"
                                                        className="p-2 w-full bg-[#0F1115] border border-[var(--border-color)] rounded-md text-sm text-white outline-none focus:border-[var(--accent-blue)]"
                                                        value={editData.deadline || ''}
                                                        onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleString() : <span className="text-secondary italic">No deadline set</span>}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 p-4 border border-[var(--border-color)] rounded-md bg-[var(--bg-dark)]">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-[var(--accent-blue)]"
                                        checked={editData.status === 'Completed'}
                                        onChange={(e) => {
                                            const isCompleted = e.target.checked;
                                            setEditData({
                                                ...editData,
                                                status: isCompleted ? 'Completed' : 'Pending',
                                                completedAt: isCompleted ? new Date().toISOString().slice(0, 16) : undefined
                                            });
                                        }}
                                    />
                                    <span className="font-bold">Mark as Completed</span>
                                </label>
                                {editData.status === 'Completed' && (
                                    <div className="mt-3 ml-8">
                                        <span className="text-xs text-secondary uppercase font-bold block mb-1">Completion Date</span>
                                        <input
                                            type="datetime-local"
                                            className="p-2 w-full max-w-[250px] bg-[#0F1115] border border-[var(--border-color)] rounded-md text-sm text-white outline-none focus:border-[var(--accent-blue)]"
                                            value={editData.completedAt || new Date().toISOString().slice(0, 16)}
                                            onChange={(e) => setEditData({ ...editData, completedAt: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-actions flex justify-end gap-3 mt-6 border-t border-[var(--border-color)] pt-4">
                            <button className="btn btn-secondary" onClick={() => { setIsModalOpen(false); setIsEditing(false); }}>Cancel</button>
                            {isEditing ? (
                                <button className="btn btn-primary" onClick={handleUpdateJob}>Save Changes</button>
                            ) : (
                                <>
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Job Order</button>
                                    <button
                                        className="btn btn-primary border-none transition-colors"
                                        style={{ backgroundColor: (editData.status === selectedJob.status && editData.completedAt === selectedJob.completedAt) ? 'var(--bg-hover)' : 'var(--success)', color: (editData.status === selectedJob.status && editData.completedAt === selectedJob.completedAt) ? 'var(--text-secondary)' : 'white' }}
                                        disabled={editData.status === selectedJob.status && editData.completedAt === selectedJob.completedAt}
                                        onClick={handleUpdateJob}
                                    >
                                        Save Status Update
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* New Job Modal */}
            {isNewJobModalOpen && (
                <div className="modal-overlay z-50 fixed inset-0 bg-black/80 flex justify-center items-center" onClick={() => setIsNewJobModalOpen(false)}>
                    <div className="modal-content overflow-y-auto max-h-[90vh] bg-[#171A21] border border-[var(--border-color)] p-6 rounded-md w-[500px] max-w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="mb-2 font-bold text-xl">New Job Order</h2>
                        <p className="text-secondary mb-6 text-sm">Fill details to register a new device repair request.</p>

                        <form onSubmit={handleCreateNewJob}>
                            <div className="form-group mb-4">
                                <label>Customer Name</label>
                                <input required type="text" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={newJob.customerName} onChange={e => setNewJob({ ...newJob, customerName: e.target.value })} />
                            </div>
                            <div className="form-group mb-4">
                                <label>Device Name / Model</label>
                                <input required type="text" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={newJob.device} onChange={e => setNewJob({ ...newJob, device: e.target.value })} />
                            </div>
                            <div className="form-group mb-4">
                                <label>Issue Description</label>
                                <textarea required rows="3" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={newJob.issueDescription} onChange={e => setNewJob({ ...newJob, issueDescription: e.target.value })}></textarea>
                            </div>

                            <div className="form-group mb-4 p-3 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md">
                                <label className="flex items-center gap-3 cursor-pointer select-none mb-2 text-sm font-bold text-white">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-[var(--accent-blue)]"
                                        checked={newJob.noDeadline}
                                        onChange={(e) => setNewJob({ ...newJob, noDeadline: e.target.checked, deadline: e.target.checked ? '' : newJob.deadline })}
                                    />
                                    <span>No deadline</span>
                                </label>
                                {!newJob.noDeadline && (
                                    <div className="ml-7 mt-2">
                                        <label className="text-xs text-secondary uppercase block mb-1">Target Deadline</label>
                                        <input
                                            type="datetime-local"
                                            required={!newJob.noDeadline}
                                            className="w-full p-2 bg-[#0F1115] border border-[var(--border-color)] rounded-md text-white outline-none text-sm"
                                            value={newJob.deadline}
                                            onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mb-6">
                                <div className="form-group w-full">
                                    <label>Priority</label>
                                    <select className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={newJob.priority} onChange={e => setNewJob({ ...newJob, priority: e.target.value === 'true' })}>
                                        <option value="false">Normal</option>
                                        <option value="true">High Priority</option>
                                    </select>
                                </div>
                                <div className="form-group w-full">
                                    <label>Estimated Revenue (₱)</label>
                                    <input type="number" className="w-full p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md text-white outline-none" value={newJob.revenue} onChange={e => setNewJob({ ...newJob, revenue: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-[var(--border-color)] pt-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsNewJobModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Job Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default JobOrders;
