import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// utils
import { localStorageGetItem, localStorageSetItem } from "../assets/utilities/jwt";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [refresh, setRefresh_] = useState(localStorageGetItem('refresh'));
  const [access, setAccess_] = useState(localStorageGetItem('access'));

  // Function to set the authentication token
  const setRefresh = (newRefresh) => {
    setRefresh_(newRefresh);
  };
  const setAccess = (newAccess) => {
    setAccess_(newAccess);
  };

  useEffect(() => {
    if (access) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + access;
      localStorage.setItem("access", access);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("access");
    }
  }, [access]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      access,
      setAccess,
    }),
    [access]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
