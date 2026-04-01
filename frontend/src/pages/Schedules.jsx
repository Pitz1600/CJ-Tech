import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Schedules.css';

const Schedules = () => {
    const { backendUrl } = useContext(AppContext);

    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDeadlines, setShowDeadlines] = useState(true);
    const [showDateCreated, setShowDateCreated] = useState(false);

    // Day Modal states
    const [selectedDayJobs, setSelectedDayJobs] = useState(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);

    // Job Modal states
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchJobOrders = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/joborder/all`);
            if (res.data.success) {
                // map legacy 'In Progress' to 'Pending' on fetch if needed
                const jobs = res.data.jobOrders.map(j => ({
                    ...j,
                    status: j.status === 'In Progress' ? 'Pending' : j.status
                }));
                setSchedules(jobs);
            }
        } catch (error) {
            toast.error("Failed to fetch schedules (job orders)");
        }
    };

    useEffect(() => {
        fetchJobOrders();
    }, [backendUrl]);

    // Calendar logic helpers
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getSchedulesForDay = (day) => {
        return schedules.filter(s => {
            let match = false;
            if (showDeadlines && s.deadline) {
                const d = new Date(s.deadline);
                if (d.getDate() === day && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()) {
                    match = true;
                }
            }
            if (showDateCreated) {
                const c = new Date(s.createdAt);
                if (c.getDate() === day && c.getMonth() === selectedDate.getMonth() && c.getFullYear() === selectedDate.getFullYear()) {
                    match = true;
                }
            }
            return match;
        });
    };

    const handleDayClick = (daySchedules) => {
        if (daySchedules.length > 0) {
            setSelectedDayJobs(daySchedules);
            setIsDayModalOpen(true);
        }
    };

    const handleScheduleClick = (schedule) => {
        setSelectedJob(schedule);
        setEditData({
            ...schedule,
            noDeadline: !schedule.deadline,
            deadline: schedule.deadline ? new Date(schedule.deadline).toISOString().slice(0, 16) : '',
            completedAt: schedule.completedAt ? new Date(schedule.completedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleUpdateJob = async () => {
        try {
            const payload = { ...editData, status: editData.status === 'In Progress' ? 'Pending' : editData.status };
            if (payload.noDeadline) payload.deadline = null;

            const res = await axios.put(`${backendUrl}/api/joborder/update/${selectedJob._id}`, payload);
            if (res.data.success) {
                toast.success("Job order updated");
                setIsModalOpen(false);
                setIsEditing(false);
                if (isDayModalOpen) setIsDayModalOpen(false); // Cascade close if opened from day modal
                fetchJobOrders();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="schedules-container">
            <div className="page-header flex justify-between items-end mb-6">
                <div>
                    <h1 className="page-title">Schedules</h1>
                    <p className="page-subtitle">Technician dispatch and target deadlines overview.</p>
                </div>
                <div className="flex gap-6 bg-[#171A21] p-3 rounded-md border border-[var(--border-color)]">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-[var(--accent-blue)]"
                            checked={showDeadlines}
                            onChange={(e) => setShowDeadlines(e.target.checked)}
                        />
                        Show deadlines
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-[var(--accent-blue)]"
                            checked={showDateCreated}
                            onChange={(e) => setShowDateCreated(e.target.checked)}
                        />
                        Show date created
                    </label>
                </div>
            </div>

            <div className="card calendar-card p-0 overflow-hidden">
                <div className="calendar-header flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                    <h2>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary text-xs" onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>Prev</button>
                        <button className="btn btn-secondary text-xs" onClick={() => setSelectedDate(new Date())}>Today</button>
                        <button className="btn btn-secondary text-xs" onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>Next</button>
                    </div>
                </div>

                <div className="calendar-grid">
                    <div className="day-name">SUN</div>
                    <div className="day-name">MON</div>
                    <div className="day-name">TUE</div>
                    <div className="day-name">WED</div>
                    <div className="day-name">THU</div>
                    <div className="day-name">FRI</div>
                    <div className="day-name">SAT</div>

                    {blanks.map(b => <div key={`blank-${b}`} className="calendar-day blank"></div>)}

                    {days.map(day => {
                        const daySchedules = getSchedulesForDay(day);
                        const isToday = new Date().getDate() === day && new Date().getMonth() === new Date().getMonth() && new Date().getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={`calendar-day min-h-[100px] flex flex-col items-center justify-center ${isToday ? 'today' : ''} ${daySchedules.length > 0 ? 'has-events cursor-pointer hover:bg-[#1a1d24] transition-colors border-b-2 border-b-[var(--accent-blue)]' : ''}`}
                                onClick={() => handleDayClick(daySchedules)}
                            >
                                <span className={`day-number mb-1 ${isToday ? 'bg-[var(--accent-blue)] text-white w-8 h-8 rounded-full flex items-center justify-center' : ''}`}>{day}</span>
                                {daySchedules.length > 0 && <span className="text-xs font-bold text-[var(--accent-blue)]">{daySchedules.length} {daySchedules.length === 1 ? 'Job' : 'Jobs'}</span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Day Modal */}
            {isDayModalOpen && selectedDayJobs && (
                <div className="modal-overlay z-40 fixed inset-0 bg-black/80 flex justify-center items-center" onClick={() => setIsDayModalOpen(false)}>
                    <div className="modal-content overflow-y-auto bg-[#171A21] border border-[var(--border-color)] p-6 rounded-md w-[500px] max-h-[80vh] max-w-full" onClick={e => e.stopPropagation()}>
                        <h2 className="mb-4 text-xl font-bold flex justify-between items-center bg-[#0F1115] p-3 rounded border border-[var(--border-color)]">
                            Jobs on {new Date(selectedDayJobs[0].deadline || selectedDayJobs[0].createdAt).toLocaleDateString()}
                            <span className="text-sm text-secondary bg-[#171A21] px-2 py-1 rounded">{selectedDayJobs.length} total</span>
                        </h2>

                        <div className="flex flex-col gap-3">
                            {selectedDayJobs.map((job) => (
                                <div key={job._id} className="p-4 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded hover:border-[var(--accent-blue)] cursor-pointer transition-colors" onClick={() => { handleScheduleClick(job); }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="job-id-badge font-bold">{job.jobId}</span>
                                        <span className={`badge ${job.status === 'Completed' ? 'completed' : 'pending'}`}>
                                            {job.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg">{job.customerName}</h3>
                                    <p className="text-sm text-secondary mb-2">{job.device}</p>
                                    <div className="text-xs font-bold text-secondary mt-2 flex justify-between items-center border-t border-[var(--border-color)] pt-2">
                                        <span>Time logged: {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button className="btn btn-secondary" onClick={() => setIsDayModalOpen(false)}>Close</button>
                        </div>
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

        </div>
    );
};

export default Schedules;
