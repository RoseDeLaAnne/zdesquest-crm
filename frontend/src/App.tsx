import { ConfigProvider } from "antd";

import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
// import { Register } from "./pages/Register";
import Home from "./pages/Home";
import { Quests } from "./pages/Quests";
import { Quest } from "./pages/Quest";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Users from "./pages/Users";
import QuestForm from "./pages/QuestForm";
import QuestTable from "./pages/QuestTable";
import ExpensesForm from "./pages/ExpensesForm";
import BonusesPenaltiesForm from "./pages/BonusesPenaltiesForm";
import Salary from "./pages/Salary";
import Additional1 from "./pages/Additional1";
import Additional1Form from "./pages/Additional1Form";
import Test from "./pages/Test";
import Page404 from "./pages/404";

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
        <Route path="/quests" element={<Quests />} />
        <Route path="/quests/:id" element={<Quest />} />
        <Route path="/quests/:id/income" element={<Income />} />
        <Route path="/quests/:id/expenses" element={<Expenses />} />
        <Route path="/users" element={<Users />} />
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
        <Route path="/test" element={<Test />} />
        <Route path="/404" element={<Page404 />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
