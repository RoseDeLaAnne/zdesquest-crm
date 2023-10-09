import { Link, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";
import { ProtectedRoute } from "./ProtectedRoute";

import Home from "../pages/Home";

import Login from "../pages/authentication/Login";

import Users from "../pages/Users";
import EditUsers from "../pages/EditUsers";

// additional-tables
import ATQuests from "../pages/additional-tables/Quests";
import ATEditQuests from "../pages/additional-tables/EditQuests";
import ATQuestVersions from "../pages/additional-tables/QuestVersions";
import ATEditQuestVersions from "../pages/additional-tables/EditQuestVersions";

// source-tables
import STQuests from "../pages/source-tables/Quests";
import STEditQuests from "../pages/source-tables/EditQuests";
import STExpenses from "../pages/source-tables/STExpenses";
import STEditExpenses from "../pages/source-tables/EditExpenses";
import STBonusesPenalties from "../pages/source-tables/STBonusesPenalties";
import STEditBonusesPenalties from "../pages/source-tables/STEditBonusesPenalties";

// tables
import TQuests from "../pages/tables/Quests";
// import FExpense from "../pages/forms/FExpense";

// forms
import FQuest from "../pages/forms/FQuest";
import FExpenses from "../pages/forms/Expenses";

// quests
import QIncomes from "../pages/quests/QIncomes";
import QExpenses from "../pages/quests/Expenses";
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
          // element: <Link to={'/users'}>to Users</Link>,
          element: <Home />,
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
          path: "/additional-tables/quests",
          element: <ATQuests />,
        },
        {
          path: "/additional-tables/quests/edit/:id",
          element: <ATEditQuests />,
        },
        {
          path: "/additional-tables/quest-versions",
          element: <ATQuestVersions />,
        },
        {
          path: "/additional-tables/quest-versions/edit/:id",
          element: <ATEditQuestVersions />,
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
          path: "/source-tables/expenses",
          element: <STExpenses />,
        },
        {
          path: "/source-tables/expenses/edit/:id",
          element: <STEditExpenses />,
        },
        {
          path: "/source-tables/bonuses-penalties",
          element: <STBonusesPenalties />,
        },
        {
          path: "/source-tables/bonuses-penalties/edit/:id",
          element: <STEditBonusesPenalties />,
        },
        {
          path: "/tables/quests",
          element: <TQuests />,
        },
        {
          path: "/tables/expenses",
          element: <STExpenses />,
        },
        {
          path: "/forms/quest",
          element: <FQuest />,
        },
        {
          path: "/forms/expense",
          element: <FExpenses />,
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
