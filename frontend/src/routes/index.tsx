import { Link, Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";
import { ProtectedRoute } from "./ProtectedRoute";

import Test from "../pages/Test";
import InputC from "../pages/InputC";
import Test4 from "../pages/Test4";

import Home from "../pages/Home";

import Login from "../pages/authentication/Login";

import Users from "../pages/Users";
import EditUsers from "../pages/EditUsers";

// additional-tables
import ATQuests from "../pages/additional-tables/Quests";
import ATEditQuests from "../pages/additional-tables/EditQuests";
import ATQuestVersions from "../pages/additional-tables/QuestVersions";
import ATEditQuestVersions from "../pages/additional-tables/EditQuestVersions";
import ATSTExpenseCategories from "../pages/additional-tables/STExpenseCategories";
import ATSTExpenseSubCategories from "../pages/additional-tables/STExpenseSubCategories";
import ATEditSTExpenseCategories from "../pages/additional-tables/EditSTExpenseCategories";
import ATEditSTExpenseSubCategories from "../pages/additional-tables/EditSTExpenseSubCategories";

// source-tables
import STQuests from "../pages/source-tables/Quests";
import STEditQuests from "../pages/source-tables/EditQuests";
import STExpenses from "../pages/source-tables/Expenses";
import STEditExpenses from "../pages/source-tables/EditExpenses";
import STBonusesPenalties from "../pages/source-tables/BonusesPenalties";
import STEditBonusesPenalties from "../pages/source-tables/EditBonusesPenalties";

// tables
import TQuests from "../pages/tables/Quests";
// import FExpense from "../pages/forms/FExpense";

// forms
import FQuest from "../pages/forms/FQuest";
import FExpenses from "../pages/forms/Expenses";

// quests
import QIncomes from "../pages/quests/Incomes";
import QExpenses from "../pages/quests/Expenses";
import QCashRegister from "../pages/quests/CashRegister";
import QCashRegisterDeposited from "../pages/quests/CashRegisterDeposited";
import QCashRegisterTaken from "../pages/quests/CashRegisterTaken";
import QWorkCardExpenses from "../pages/quests/WorkCardExpenses";
import QExpensesFromOwn from "../pages/quests/ExpensesFromOwn";
import QVideos from "../pages/quests/Videos";

import Salaries from "../pages/Salaries";

const Routes = () => {
  const { access } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    // {
    //   path: "/videos",
    //   element: <QVideos />,
    // },
    // {
    //   path: "/salaries",
    //   element: <Salaries />,
    // },
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
          path: "/test",
          element: <Test />,
        },
        {
          path: "/inputc",
          element: <InputC />,
        },
        // {
        //   path: "/test3",
        //   element: <Test3 />,
        // },
        {
          path: "/test4",
          element: <Test4 />,
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
          path: "/additional-tables/stexpense-categories",
          element: <ATSTExpenseCategories />,
        },
        {
          path: "/additional-tables/stexpense-categories/edit/:id",
          element: <ATEditSTExpenseCategories />,
        },
        {
          path: "/additional-tables/stexpense-subcategories",
          element: <ATSTExpenseSubCategories />,
        },
        {
          path: "/additional-tables/stexpense-subcategories/edit/:id",
          element: <ATEditSTExpenseSubCategories />,
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
          element: <STQuests />,
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
          path: "/quests/:id/cash-register-deposited",
          element: <QCashRegisterDeposited />,
        },
        {
          path: "/quests/:id/cash-register-taken",
          element: <QCashRegisterTaken />,
        },
        {
          path: "/quests/:id/work-card-expenses",
          element: <QWorkCardExpenses />,
        },
        {
          path: "/quests/:id/expenses-from-own",
          element: <QExpensesFromOwn />,
        },
        {
          path: "/quests/:id/videos",
          element: <QVideos />,
        },
        {
          path: "/videos",
          element: <QVideos />,
        },
        {
          path: "/salaries",
          element: <Salaries />,
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
