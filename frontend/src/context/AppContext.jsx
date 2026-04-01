import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext();

const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    const getSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(backendUrl + '/api/settings/get');
            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const updateSettings = async (newSettings) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/settings/update', newSettings);
            if (data.success) {
                setSettings(data.settings);
                toast.success("Settings updated successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        backendUrl,
        loading,
        settings, setSettings,
        getSettings, updateSettings
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export { AppContext, AppContextProvider };