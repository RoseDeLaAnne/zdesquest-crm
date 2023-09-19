import { Link, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";
import { ProtectedRoute } from "./ProtectedRoute";

import Login from "../pages/Login";

import Users from "../pages/Users";

// source-tables
import STQuests from "../pages/STQuests";

// forms
import FQuest from "../pages/FQuest";
import FExpense from "../pages/FExpense";

import Salaries from "../pages/Salaries";

const Routes = () => {
  const { access } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/salaries",
      element: <Salaries />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    // {
    //   path: "/users",
    //   element: <Users />,
    // },
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "",
          element: <Link to={'/users'}>to Users</Link>,
          // element: <Navigate to="/users" />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/source-tables/quests",
          element: <STQuests />,
        },
        {
          path: "/forms/quest",
          element: <FQuest />,
        },
        {
          path: "/forms/expense",
          element: <FExpense />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <>
      <Link to={'/login'}>to Login</Link>
      <Link to={'/users'}>to Users</Link></>,
      // element: <Navigate to="/login" />,
    },
    // {
    //   path: "/users",
    //   element: <Users />,
    // },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/source-tables/quests",
      element: <STQuests />,
    },
    {
      path: "/forms/quest",
      element: <FQuest />,
    },
    {
      path: "/forms/expense",
      element: <FExpense />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!access ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
