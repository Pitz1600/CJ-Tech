import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    ClipboardList,
    Settings,
    Bot,
    HelpCircle,
    ArrowLeft
} from 'lucide-react';
import '../styles/Sidebar.css';
import { AppContext } from '../context/AppContext';
import cjtechlogo from '../assets/cj-tech-logo.png';
import cjtechwhite from '../assets/cj-tech-white.jpg';


const Sidebar = () => {
    const navigate = useNavigate();
    const { settings } = useContext(AppContext);

    return (
        <aside className="sidebar">
            <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <img src={cjtechwhite} alt="CJ-Tech Logo" className="sidebar-logo" />
                <div className="sidebar-brand">
                    <h2>{settings?.landingTitle || 'CJ Tech'}</h2>
                    <span>{settings?.landingSubtitle || 'PERSONAL WEBSITE'}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/schedules" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <CalendarDays size={20} />
                    <span>Schedules</span>
                </NavLink>
                <NavLink to="/job-orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <ClipboardList size={20} />
                    <span>Job Orders</span>
                </NavLink>
                <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Bot size={20} />
                    <span>AI Assistant</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-link footer-link">
                    <HelpCircle size={20} />
                    <span>Help</span>
                </button>
                <button className="nav-link footer-link" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
