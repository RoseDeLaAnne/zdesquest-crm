import { ConfigProvider } from "antd";

import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
// import { Register } from "./pages/Register";
import Home from "./pages/Home";
import Income from "./pages/Income";
import QuestExpenses from "./pages/QuestExpenses";

import QuestForm from "./pages/QuestForm";
import QuestTable from "./pages/QuestTable";
import ExpensesForm from "./pages/ExpensesForm";
import BonusesPenaltiesForm from "./pages/BonusesPenaltiesForm";
import Salary from "./pages/Salary";
import Additional1 from "./pages/Additional1";
import Additional1Form from "./pages/Additional1Form";
import Page404 from "./pages/404";

import Users from "./pages/Users";
import User from "./pages/User";

import ATTransactions from "./pages/ATTransactions";
import ATTransaction from "./pages/ATTransaction";

import STQuests from "./pages/STQuests";
import STQuest from "./pages/STQuest";
import STExpenses from "./pages/STExpenses";
import STExpense from "./pages/STExpense";
import STBonusesPenalties from "./pages/STBonusesPenalties";
import STBonusPenalty from "./pages/STBonusPenalty";

import Quests from "./pages/Quests";
import Quest from "./pages/Quest";
import QIncomes from "./pages/QIncomes";
import QExpenses from "./pages/QExpenses";
import QSalaries from "./pages/QSalaries";

import Template from "./pages/Template";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Jost",
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/quests" element={<Quests />} /> */}
        {/* <Route path="/quests/:id" element={<Quest />} /> */}
        {/* <Route path="/quests/:id/income" element={<Income />} />
        <Route path="/quests/:id/expenses" element={<QuestExpenses />} /> */}

        <Route path="/quest-table" element={<QuestTable />} />
        <Route path="/quest-form" element={<QuestForm />} />
        <Route path="/expenses-form" element={<ExpensesForm />} />
        <Route
          path="/bonuses-penalties-form"
          element={<BonusesPenaltiesForm />}
        />
        <Route path="/salary" element={<Salary />} />
        <Route path="/additional1" element={<Additional1 />} />
        <Route path="/additional1-form" element={<Additional1Form />} />
        <Route path="/404" element={<Page404 />} />

        <Route path="/users" element={<Users />} />
        <Route path="/users/edit/:id" element={<User />} />

        {/* <Route path="/source-tables" element={<STQuests />} /> */}
        <Route
          path="/additional-tables/transactions"
          element={<ATTransactions />}
        />
        <Route
          path="/additional-tables/transactions/edit/:tid"
          element={<ATTransaction />}
        />

        {/* <Route path="/source-tables" element={<STQuests />} /> */}
        <Route path="/source-tables/quests" element={<STQuests />} />
        <Route path="/source-tables/quests/edit/:qid" element={<STQuest />} />
        <Route path="/source-tables/expenses" element={<STExpenses />} />
        <Route
          path="/source-tables/expenses/edit/:eid"
          element={<STExpense />}
        />
        <Route
          path="/source-tables/bonuses-penalties"
          element={<STBonusesPenalties />}
        />
        <Route
          path="/source-tables/bonuses-penalties/edit/:bpid"
          element={<STBonusPenalty />}
        />

        <Route path="/quests" element={<Quests />} />
        <Route path="/quests/edit/:name" element={<Quest />} />
        <Route path="/quests/:qname/incomes" element={<QIncomes />} />
        <Route path="/quests/:qname/expenses" element={<QExpenses />} />
        <Route path="/quests/:qname/salaries" element={<QSalaries />} />

        <Route path="/template" element={<Template />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
