import React, { createContext, useState, useEffect } from "react";
// Create Context
export const PortfolioContext = createContext();

// Create Provider Component
export const PortfolioProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dsa_stats, setdsa_stats] = useState(null);
  return (
    <PortfolioContext.Provider value={{ setUserData,userData,setLoading, loading, error,setError,dsa_stats,setdsa_stats }}>
      {children}
    </PortfolioContext.Provider>
  );
};