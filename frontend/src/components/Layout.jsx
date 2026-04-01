import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AppContext } from '../context/AppContext';
import '../styles/Layout.css';
import LoadingScreen from './LoadingScreen';

const Layout = () => {
    const { loading } = useContext(AppContext);

    if (loading) return <LoadingScreen />;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
