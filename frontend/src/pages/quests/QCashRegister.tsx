import React, { FC } from "react";

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
  getQuestCashRegister,
  toggleQuestCashRegister,
} from "../../api/APIUtils";

// components
import TableTemplate3 from "../../components/TableTemplate3";

const App: FC = () => {
  const initialBreadcrumbItems = [
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
      title: "касса",
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
        {
          key: "3",
          icon: FallOutlined,
          label: "касса",
          to: "/quests/rainbow/cash-register",
        },
      ],
    },
  ];

  const initialPackedTableDataColumn = {
    title: "дата",
    dataIndex: "date",
    key: "date",
    width: 112,
    isSorting: true,
    searching: {
      isSearching: true,
      title: "дате",
    },
    fixed: "left",
  };

  const initialPackedTableColumns = [
    {
      title: "сумма",
      dataIndex: "amount",
      key: "amount",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "сумме",
      },
      countable: true,
      render: (amount) => {
        let color = "black";
        let formattedStatus = amount;

        if (amount < 0) {
          color = "red";
        } else if (amount > 0) {
          formattedStatus = `+${amount}`;
          color = "green";
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
    {
      title: "описание",
      dataIndex: "description",
      key: "description",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "описанию",
      },
      countable: false,
    },
    {
      title: "статус",
      dataIndex: "status",
      key: "статус",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "статусу",
      },
      countable: false,
      render: (status) => {
        let color = "red";
        let formattedStatus = status;

        if (status === "reset") {
          color = "green";
          formattedStatus = "обнулено";
        } else if (status === "not_reset") {
          color = "red";
          formattedStatus = `не обнулено`;
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
  ];

  return (
    <TableTemplate3
      defaultOpenKeys={["quests", "questsRainbow"]}
      defaultSelectedKeys={["questsRainbowCashRegister"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={"касса"}
      isDatePicker={true}
      fetchFunction={getQuestCashRegister}
      toggleFunction={toggleQuestCashRegister}
      isUseParams={true}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={null}
    />
  );
};

export default App;
