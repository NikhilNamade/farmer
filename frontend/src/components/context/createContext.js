import React, { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [click, setClick] = useState(false);
  const [productType, setProductType] = useState(null);
  const [productName, setProductName] = useState(null);
  return (
    <AppContext.Provider
      value={{
        setProductType,
        productType,
        setProductName,
        productName,
        click,
        setClick
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
