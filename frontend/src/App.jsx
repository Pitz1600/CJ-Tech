import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './index.css';
import Landing from "./pages/Landing.jsx";
import Settings from "./pages/Settings.jsx";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import JobOrders from "./pages/JobOrders.jsx";
import Schedules from "./pages/Schedules.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import { AppContext } from "./context/AppContext.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

const App = () => {
  const { loading, getSettings } = useContext(AppContext);

  useEffect(() => {
    getSettings();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <ToastContainer theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job-orders" element={<JobOrders />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};
export default App;