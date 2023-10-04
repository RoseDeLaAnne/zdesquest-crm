import { Link, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";
import { ProtectedRoute } from "./ProtectedRoute";

import Login from "../pages/authentication/Login";

import Users from "../pages/Users";
import EditUsers from "../pages/EditUsers";

// source-tables
import STQuests from "../pages/source-tables/STQuests";
import STEditQuests from "../pages/source-tables/STEditQuests";

// forms
import FQuest from "../pages/forms/FQuest";
import FExpense from "../pages/forms/FExpense";

// quests
import QIncomes from "../pages/quests/QIncomes";
import QExpenses from "../pages/quests/QExpenses";
import QCashRegister from "../pages/quests/QCashRegister";
import QWorkCardExpenses from "../pages/quests/QWorkCardExpenses";
import QExpensesFromTheir from "../pages/quests/QExpensesFromTheir";
import QVideos from "../pages/quests/QVideos";

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
          path: "/users/edit/:id",
          element: <EditUsers />,
        },
        {
          path: "/source-tables/quests",
          element: <STQuests />,
        },
        {
          path: "/source-tables/quests/edit/:id",
          element: <STEditQuests />,
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
          path: "/quests/:id/incomes",
          element: <QIncomes />,
        },
        {
          path: "/quests/:id/expenses",
          element: <QExpenses />,
        },
        {
          path: "/quests/:id/cash-register",
          element: <QCashRegister />,
        },
        {
          path: "/quests/:id/work-card-expenses",
          element: <QWorkCardExpenses />,
        },
        {
          path: "/quests/:id/expenses-from-their",
          element: <QExpensesFromTheir />,
        },
        {
          path: "/quests/:id/videos",
          element: <QVideos />,
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
