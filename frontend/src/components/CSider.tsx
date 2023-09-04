import React, { FC, useState } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// antd
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// interface
import { IFCSider } from "../assets/utilities/interface";

// type
import { MenuItem } from "../assets/utilities/type";

// layout
const { Sider } = Layout;

const App: FC<IFCSider> = ({
  collapsed,
  setCollapsed,
  defaultOpenKeys,
  defaultSelectedKeys,
}) => {
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    to: string,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label: (
        <Link to={to} className="menu__link">
          {label}
        </Link>
      ),
      type,
    } as MenuItem;
  }
  const menuItems: MenuItem[] = [
    getItem("сотрудники", "users", "/users", <UserOutlined />),
    getItem(
      "исх. таблицы",
      "sourceTables",
      "/source-tables",
      <TableOutlined />,
      [
        getItem(
          "квесты",
          "sourceTablesQuests",
          "/source-tables/quests",
          <QuestionOutlined />
        ),
        getItem(
          "расходы",
          "sourceTablesExpenses",
          "/source-tables/expenses",
          <FallOutlined />
        ),
        getItem(
          "бонусы",
          "sourceTablesBonuses",
          "/source-tables/bonuses",
          <DeploymentUnitOutlined />
        ),
        getItem(
          "штрафы",
          "sourceTablesPenalties",
          "/source-tables/penalties",
          <DeploymentUnitOutlined />
        ),
      ]
    ),
    getItem(
      "доп. таблицы",
      "additionalTables",
      "/additional-tables",
      <TableOutlined />,
      [
        getItem(
          "категории расходов",
          "additionalTablesSTExpenseCategories",
          "/additional-tables/stexpense-categories",
          <QuestionOutlined />
        ),
        getItem(
          "подкатегории расходов",
          "additionalTablesSTExpenseSubCategories",
          "/additional-tables/stexpense-subcategories",
          <QuestionOutlined />
        ),
      ]
    ),

    getItem("квесты", "quests", "/quests", <QuestionOutlined />, [
      getItem(
        "Радуга",
        "questsRainbow",
        "/quests/rainbow",
        <QuestionOutlined />,
        [
          getItem(
            "Доходы",
            "questsRainbowIncomes",
            "/quests/rainbow/incomes",
            <RiseOutlined />
          ),
          getItem(
            "Расходы",
            "questsRainbowExpenses",
            "/quests/rainbow/expenses",
            <FallOutlined />
          ),
          getItem(
            "касса",
            "questsRainbowCashRegister",
            "/quests/rainbow/cash-register",
            <FallOutlined />
          ),
        ]
      ),
    ]),

    getItem(
      "зарплаты",
      "salaries",
      "/salaries",
      <DollarOutlined />
    ),
    getItem(
      "расходы с раб. карты",
      "workCardExpenses",
      "/work-card-expenses",
      <DollarOutlined />
    ),
    getItem(
      "расходы со своих",
      "expensesFromTheir",
      "/expenses-from-their",
      <DollarOutlined />
    ),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => {
        setCollapsed(value);
        localStorage.setItem("collapsed", value.toString());
      }}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        mode="inline"
        items={menuItems}
      />
    </Sider>
  );
};

export default App;
