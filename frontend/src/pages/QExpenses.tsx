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
  getQuestExpenses,
  getSTExpenses,
  getSalaries,
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
      title: "расходы",
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
      title: "дата",
      dataIndex: "date",
      key: "date",
      sorting: {
        isSorting: true,
        isDate: true,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: false,
      width: 112,
    },
  ];

  return (
    <TableTemplate
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowExpenses"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"радуга | расходы"}
      datePicker={true}
      addEntry={false}
      addEntryTitle={""}
      questTables={true}
      fetchFunction={getQuestExpenses}
      createFunction={null}
      deleteFunction={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableColumnWithHead={true}
      tableOperation={false}
      tableBordered={true}
      drawerTitle=""
      formItems={null}
    />
  );
};

export default App;
