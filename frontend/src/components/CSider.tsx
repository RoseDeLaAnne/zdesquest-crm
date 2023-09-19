import React, { FC, useState, useEffect } from "react";

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

// api
import { getQuests, getCurrentUser } from "../api/APIUtils";

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
  const [user, setUser] = useState([]);
  const [questsData, setQuestsData] = useState([]);
  const fetchUser = async () => {
    const response = await getCurrentUser();
    if (response.status === 200) {
      setUser(response.data);
    }
  };
  const fetchQuests = async () => {
    const response = await getQuests();
    if (response.status === 200) {
      setQuestsData(response.data);
    }
  };

  function convertQuestToMenuItem(quest) {
    return getItem(
      quest.name,
      `quests${quest.key}`,
      `/quests/${quest.latin_name}`,
      <QuestionOutlined />,
      [
        getItem(
          "доходы",
          `quests${quest.key}Incomes`,
          `/quests/${quest.latin_name}/incomes`,
          <RiseOutlined />
        ),
        getItem(
          "расходы",
          `quests${quest.key}Expenses`,
          `/quests/${quest.latin_name}/expenses`,
          <FallOutlined />
        ),
        getItem(
          "касса",
          `quests${quest.key}CashRegister`,
          `/quests/${quest.latin_name}/cash-register`,
          <FallOutlined />
        ),
        getItem(
          "расходы с раб. карты",
          `quests${quest.key}WorkCardExpenses`,
          `/quests/${quest.latin_name}/work-card-expenses`,
          <DollarOutlined />
        ),
        getItem(
          "расходы со своих",
          `quests${quest.key}ExpensesFromTheir`,
          `/quests/${quest.latin_name}/expenses-from-their`,
          <DollarOutlined />
        ),
      ]
    );
  }

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

  // const menuItems: MenuItem[] = [
  //   getItem("сотрудники", "users", "/users", <UserOutlined />),
  //   getItem(
  //     "исх. таблицы",
  //     "sourceTables",
  //     "/source-tables",
  //     <TableOutlined />,
  //     [
  //       getItem(
  //         "квесты",
  //         "sourceTablesQuests",
  //         "/source-tables/quests",
  //         <QuestionOutlined />
  //       ),
  //       getItem(
  //         "расходы",
  //         "sourceTablesExpenses",
  //         "/source-tables/expenses",
  //         <FallOutlined />
  //       ),
  //       getItem(
  //         "бонусы/штрафы",
  //         "sourceTablesBonusesPenalties",
  //         "/source-tables/bonuses-penalties",
  //         <DeploymentUnitOutlined />
  //       ),
  //     ]
  //   ),
  //   getItem(
  //     "доп. таблицы",
  //     "additionalTables",
  //     "/additional-tables",
  //     <TableOutlined />,
  //     [
  //       getItem(
  //         "категории расходов",
  //         "additionalTablesSTExpenseCategories",
  //         "/additional-tables/stexpense-categories",
  //         <QuestionOutlined />
  //       ),
  //       getItem(
  //         "подкатегории расходов",
  //         "additionalTablesSTExpenseSubCategories",
  //         "/additional-tables/stexpense-subcategories",
  //         <QuestionOutlined />
  //       ),
  //     ]
  //   ),
  //   getItem("квесты", "quests", "/quests", <QuestionOutlined />, [
  //     ...questsData.map(convertQuestToMenuItem),
  //   ]),
  //   getItem("зарплаты", "salaries", "/salaries", <DollarOutlined />),
  // ];

  let menuItems = [];

  // if (user.is_superuser) {
    menuItems = [
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
            "бонусы/штрафы",
            "sourceTablesBonusesPenalties",
            "/source-tables/bonuses-penalties",
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
        ...questsData.map(convertQuestToMenuItem),
      ]),
      getItem("зарплаты", "salaries", "/salaries", <DollarOutlined />),
    ];
  // } else {
  //   menuItems = [
  //     getItem(
  //       "формы",
  //       "forms",
  //       "/forms",
  //       <TableOutlined />,
  //       [
  //         getItem(
  //           "квесты",
  //           "formsQuest",
  //           "/forms/quest",
  //           <QuestionOutlined />
  //         ),
  //         getItem(
  //           "расходы",
  //           "formsExpense",
  //           "/forms/expense",
  //           <QuestionOutlined />
  //         ),
  //       ]
  //     ),
  //     getItem("зарплаты", "salaries", "/salaries", <DollarOutlined />),
  //   ];
  // }

  useEffect(() => {
    fetchUser();
    fetchQuests();
  }, []);

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
