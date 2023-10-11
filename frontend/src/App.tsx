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
      {/* <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/users" element={<Users />} />
          <Route path="/users/edit/:id" element={<EditUsers />} />
        </Route>

        <Route
          path="/source-tables"
          element={<Navigate to="/source-tables/quests" />}
        />
        <Route path="/source-tables/quests" element={<STQuests />} />
        <Route
          path="/source-tables/quests/edit/:id"
          element={<STEditQuests />}
        />
        <Route path="/source-tables/expenses" element={<STExpenses />} />
        <Route
          path="/source-tables/expenses/edit/:id"
          element={<STEditExpenses />}
        />
        <Route
          path="/source-tables/bonuses-penalties"
          element={<STBonusesPenalties />}
        />
        <Route
          path="/source-tables/bonuses-penalties/edit/:id"
          element={<STEditBonusesPenalties />}
        />

        <Route
          path="/additional-tables"
          element={<Navigate to="/additional-tables/stexpense-categories" />}
        />
        <Route
          path="/additional-tables/stexpense-categories"
          element={<ATSTExpenseCategories />}
        />
        <Route
          path="/additional-tables/stexpense-categories/edit/:id"
          element={<ATEditSTExpenseCategories />}
        />
        <Route
          path="/additional-tables/stexpense-subcategories"
          element={<ATSTExpenseSubCategories />}
        />
        <Route
          path="/additional-tables/stexpense-subcategories/edit/:id"
          element={<ATEditSTExpenseSubCategories />}
        />

        <Route path="/quests" element={<Quests />} />
        <Route path="/quests/edit/:id" element={<EditQuests />} />

        <Route path="/quests/:name/incomes" element={<QIncomes />} />
        <Route path="/quests/:name/expenses" element={<QExpenses />} />
        <Route path="/quests/:name/cash-register" element={<QCashRegister />} />

        <Route path="/salaries" element={<Salaries />} />

        <Route
          path="/quests/:name/work-card-expenses"
          element={<WorkCardExpenses />}
        />
        <Route
          path="/quests/:name/expenses-from-their"
          element={<ExpensesFromTheir />}
        />

        <Route path="/forms" element={<Navigate to="/forms/quest" />} />
        <Route path="/forms/quest" element={<FQuest />} />
        <Route path="/forms/expense" element={<FExpense />} />
      </Routes> */}
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
