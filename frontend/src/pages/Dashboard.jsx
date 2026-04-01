import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [jobOrders, setJobOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const jRes = await axios.get(`${backendUrl}/api/joborder/all`);
        if (jRes.data.success) setJobOrders(jRes.data.jobOrders);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchDashboardData();
  }, [backendUrl]);

  const activeJobs = jobOrders.filter(j => j.status !== 'Completed').length;
  const totalRevenue = jobOrders.reduce((acc, job) => acc + (job.revenue || 0), 0);

  const highPriorityJobs = jobOrders.filter(j => j.status !== 'Completed' && j.priority).slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Systems Overview</h1>
        <p className="page-subtitle">Operational pulse for Today</p>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <span className="stat-label">TOTAL EARNINGS</span>
            <h2>₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-details">
            <span className="stat-label">ACTIVE JOBS</span>
            <h2>{activeJobs} Pending</h2>
          </div>
        </div>

        <div className="card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list mt-4">
            {jobOrders.slice(0, 4).map((job, idx) => (
              <div key={idx} className="activity-item">
                <span className={`activity-dot ${job.status === 'Completed' ? 'bg-[var(--success)] shadow-[0_0_5px_var(--success)]' : 'bg-[var(--warning)] shadow-[0_0_5px_var(--warning)]'}`}></span>
                <div>
                  <h4>{job.jobId} <span className="text-secondary text-xs uppercase ml-1">({job.status})</span></h4>
                  <p>{job.device} • {job.customerName}</p>
                </div>
              </div>
            ))}
            {jobOrders.length === 0 && <p className="text-secondary text-sm mt-4">No recent activity.</p>}
          </div>
        </div>

        <div className="card performance-chart">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3>Job Performance</h3>
              <p className="text-xs text-secondary">Weekly performance metrics and throughput</p>
            </div>
          </div>

          <div className="mock-chart">
            {[40, 60, 100, 70, 50, 30, 20].map((h, i) => (
              <div key={i} className="bar-wrapper">
                <div className="bar-fill" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="chart-labels flex justify-between text-xs text-secondary mt-2">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        <div className="card scheduled-today">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3>Priority Attention Required</h3>
              <p className="text-xs text-secondary">High-priority pending job orders</p>
            </div>
            <button className="btn btn-secondary text-xs" onClick={() => navigate('/job-orders')}>View All Jobs</button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Customer</th>
                  <th>Device / Issue</th>
                  <th>Date Logged</th>
                  <th className="text-right">Est. Revenue</th>
                </tr>
              </thead>
              <tbody>
                {highPriorityJobs.map((j, idx) => (
                  <tr key={idx} onClick={() => navigate('/job-orders')} className="cursor-pointer hover:bg-[var(--bg-hover)]">
                    <td><span className="job-id-badge">{j.jobId}</span></td>
                    <td className="font-bold">{j.customerName}</td>
                    <td>
                      <div className="font-bold">{j.device}</div>
                      <div className="text-xs text-secondary truncate max-w-[200px]">{j.issueDescription}</div>
                    </td>
                    <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td className="text-right text-success font-bold">₱{j.revenue.toLocaleString()}</td>
                  </tr>
                ))}
                {highPriorityJobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-secondary py-8">No high-priority jobs pending!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;