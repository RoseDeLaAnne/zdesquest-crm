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
import { getQuestCashRegister, getWorkCardExpenses } from "../api/APIUtils";

// components
import TableTemplate3 from "../components/TableTemplate3";

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
  ]

  return (
    <TableTemplate3
      defaultOpenKeys={[]}
      defaultSelectedKeys={["workCardExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={"расходы с рабочей карты"}
      isDatePicker={true}
      fetchFunction={getWorkCardExpenses}
      isUseParams={false}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={null}
    />
  );
};

export default App;
