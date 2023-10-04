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
  getExpensesFromTheir,
  getQuestCashRegister,
  getWorkCardExpenses,
  toggleExpensesFromTheir,
} from "../../api/APIUtils";

// components
import TableTemplate3 from "../../components/TableTemplate3";

const App: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "расходы с рабочей карты",
    },
  ];

  const initialPackedTableDataColumn = {
    title: "дата",
    dataIndex: "date",
    key: "date",
    width: 140,
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
      title: "оплатил",
      dataIndex: "who_paid",
      key: "who_paid",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "оплатил",
      },
      countable: false,
      render: (user) => {
        return (
          <Tag color="black">
            {user.first_name} {user.last_name}
          </Tag>
        );
      },
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

        if (status === "paid") {
          color = "green";
          formattedStatus = "выплачено";
        } else if (status === "not_paid") {
          color = "red";
          formattedStatus = "не выплачено";
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
  ];

  return (
    <TableTemplate3
      defaultOpenKeys={["quests"]}
      defaultSelectedKeys={["workCardExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={"расходы со своих"}
      isDatePicker={true}
      fetchFunction={getExpensesFromTheir}
      toggleFunction={toggleExpensesFromTheir}
      isUseParams={true}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={null}
    />
  );
};

export default App;
