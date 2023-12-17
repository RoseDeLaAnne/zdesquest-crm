import { ConfigProvider } from "antd";
import ruRU from 'antd/lib/locale/ru_RU';

// import { Route, Routes, Navigate } from "react-router-dom";
import { Route, Navigate } from "react-router-dom";

import PrivateRoutes from "./utils/PrivateRoutes";

// import Login from "./pages/Login";

import Users from "./pages/Users";
import EditUsers from "./pages/EditUsers";

// import ATCashRegister from "./pages/ATCashRegister";
// import ATEditCashRegister from "./pages/ATEditCashRegister";

// import STQuests from "./pages/STQuests";
// import STEditQuests from "./pages/STEditQuests";
// import STExpenses from "./pages/STExpenses";
// import STEditExpenses from "./pages/STEditExpenses";
// import STBonusesPenalties from "./pages/STBonusesPenalties";
// import STEditBonusesPenalties from "./pages/STEditBonusesPenalties";
// import STBonuses from "./pages/STBonuses";
// import STEditBonuses from "./pages/STEditBonuses";
// import STPenalties from "./pages/STPenalties";
// import STEditPenalties from "./pages/STEditPenalties";

// import ATSTExpenseCategories from "./pages/ATSTExpenseCategories";
// import ATEditSTExpenseCategories from "./pages/ATEditSTExpenseCategories";
// import ATSTExpenseSubCategories from "./pages/ATSTExpenseSubCategories";
// import ATEditSTExpenseSubCategories from "./pages/ATEditSTExpenseSubCategories";

import QCashRegister from "./pages/QCashRegister";

import Quests from "./pages/Quests";
import EditQuests from "./pages/EditQuests";

// import QIncomes from "./pages/QIncomes";
// import QExpenses from "./pages/QExpenses";

import Salaries from "./pages/Salaries";

import WorkCardExpenses from "./pages/WorkCardExpenses";
import ExpensesFromTheir from "./pages/ExpensesFromTheir";

// import FQuest from "./pages/FQuest";
// import FExpense from "./pages/FExpense";

import AuthProvider from "./provider/authProdiver";
import Routes from "./routes";

function App() {
  return (
    <ConfigProvider locale={ruRU}
      theme={{
        token: {
          fontFamily: "Jost",
        },
      }}
    >
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
