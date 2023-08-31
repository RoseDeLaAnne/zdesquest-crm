import React, { useEffect, useState } from "react";

import { Outlet, Navigate } from "react-router-dom";

// libs
import axios from "axios";

// api
import { token, tokenRefresh } from "../api/APIUtils";

// utils
import {
  localStorageGetItem,
  localStorageSetItem,
} from "../assets/utilities/jwt";

const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
