import React, { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// api
import {
  getQuests,
  getUsers,
  postSTExpense,
  getSTBonus,
  getSTBonuses,
  postSTBonus,
  deleteSTBonus,
  getQuestIncomes,
} from "../api/APIUtils";

// components
import TableTemplate from "../components/TableTemplate";

const App: FC = () => {
  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: "радуга",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квартира 404",
          to: "/quests/room-404",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "радуга",
          to: "/quests/rainbow",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "тьма",
          to: "/quests/dark",
        },
      ],
    },
    {
      icon: FallOutlined,
      title: "доходы",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "доходы",
          to: "/quests/rainbow/incomes",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/quests/rainbow/expenses",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "дата/время",
      dataIndex: "date",
      key: "date",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      width: 112,
    },
    {
      title: "игра",
      dataIndex: "game",
      key: "game",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "комната",
      dataIndex: "room",
      key: "room",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "видео",
      dataIndex: "video",
      key: "video",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "фотомагниты",
      dataIndex: "photomagnets",
      key: "photomagnets",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "актер",
      dataIndex: "actor",
      key: "actor",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "итог",
      dataIndex: "total",
      key: "total",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
  ];

  return (
    <TableTemplate
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowIncomes"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"радуга | доходы"}
      datePicker={true}
      addEntry={false}
      addEntryTitle={""}
      questTables={true}
      fetchFunction={getQuestIncomes}
      createFunction={null}
      deleteFunction={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={false}
      tableBordered={true}
      drawerTitle=""
      formItems={null}
    />
  );
};

export default App;
