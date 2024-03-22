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
// import { IFCSider } from "../assets/utilities/interface";

// type
import { MenuItem } from "../assets/utilities/type";

// layout
const { Sider, Header } = Layout;

const App: FC = ({
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
      `quests${quest.id}`,
      `/quests/${quest.id}`,
      <QuestionOutlined />,
      [
        getItem(
          "доходы",
          `quests${quest.id}Incomes`,
          `/quests/${quest.id}/incomes`,
          <RiseOutlined />
        ),
        getItem(
          "расходы",
          `quests${quest.id}Expenses`,
          `/quests/${quest.id}/expenses`,
          <FallOutlined />
        ),
        getItem(
          "касса",
          `quests${quest.id}CashRegister`,
          `/quests/${quest.id}/cash-register`,
          <FallOutlined />
        ),
        getItem(
          "расходы с раб. карты",
          `quests${quest.id}WorkCardExpenses`,
          `/quests/${quest.id}/work-card-expenses`,
          <DollarOutlined />
        ),
        getItem(
          "расходы со своих",
          `quests${quest.id}ExpensesFromTheir`,
          `/quests/${quest.id}/expenses-from-their`,
          <DollarOutlined />
        ),
        getItem(
          "видео",
          `quests${quest.id}Videos`,
          `/quests/${quest.id}/videos`,
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
        <>
          {to ? (
            <Link to={to} className="menu__link">
              {label}
            </Link>
          ) : null}
        </>
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

  if (user.is_superuser) {
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
          getItem(
            "квесты",
            "additionalTablesQuests",
            "/additional-tables/quests",
            <QuestionOutlined />
          ),
          getItem(
            "версии квестов",
            "additionalTablesQuestVersions",
            "/additional-tables/quest-versions",
            <QuestionOutlined />
          ),
        ]
      ),
      getItem("квесты", "quests", "/quests", <QuestionOutlined />, [
        ...questsData.map(convertQuestToMenuItem),
      ]),
      getItem("зарплаты", "salaries", "/salaries", <DollarOutlined />),
      // getItem("расходы со своих", "expenses-from-own", "/expenses-from-own", <DollarOutlined />),
    ];
  } else {
    menuItems = [
      getItem("таблицы", "tables", "/tables", <TableOutlined />, [
        getItem(
          "квесты",
          "tablesQuests",
          "/tables/quests",
          <QuestionOutlined />
        ),
        getItem(
          "расходы",
          "tablesExpenses",
          "/tables/expenses",
          <QuestionOutlined />
        ),
      ]),
      getItem("формы", "forms", "/forms", <TableOutlined />, [
        getItem("квесты", "formsQuest", "/forms/quest", <QuestionOutlined />),
        getItem(
          "расходы",
          "formsExpense",
          "/forms/expense",
          <QuestionOutlined />
        ),
      ]),
      getItem("зарплаты", "salaries", "/salaries", <DollarOutlined />),
    ];
  }

  useEffect(() => {
    fetchUser();
    fetchQuests();
  }, []);

  return (
    <>
      <div className="desktop-version">
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
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            items={menuItems}
          />
        </Sider>
      </div>
      <div className="mobile-version">
        <Header
          style={{
            position: "fixed",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            items={menuItems}
          />
        </Header>
      </div>
    </>
  );
};

export default App;
