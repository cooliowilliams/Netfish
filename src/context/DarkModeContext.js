"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context for Dark Mode
const DarkModeContext = createContext();

// Dark Mode Provider Component
export const DarkModeProvider = ({ children }) => {
    // State to determine whether we're in the client-side or not
    const [isClient, setIsClient] = useState(false);

    const [darkmode, setDarkMode] = useState(false);

    useEffect(() => {
        // Set isClient to true after the first render (client-side only)
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const storedDarkMode = localStorage.getItem('darkmode');
            setDarkMode(storedDarkMode === 'true' || false);
        }
    }, [isClient]);

    useEffect(() => {
        if (isClient) {
            // Only update localStorage and body class on the client side
            localStorage.setItem('darkmode', darkmode);
            document.body.classList.toggle('dark-mode', darkmode);
        }
    }, [darkmode, isClient]);

    // Avoid rendering the provider during SSR, only after the first client-side render
    if (!isClient) {
        return (
            <DarkModeContext.Provider value={{ darkmode: false, setDarkMode: () => {} }}>
                {children}
            </DarkModeContext.Provider>
        );
    }

    return (
        <DarkModeContext.Provider value={{ darkmode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Custom hook for using dark mode context
export const useDarkMode = () => useContext(DarkModeContext);


