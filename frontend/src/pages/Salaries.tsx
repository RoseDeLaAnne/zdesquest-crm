import React, { FC } from "react";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// api
import { getSalaries } from "../api/APIUtils";

// components
import TableTemplate2 from "../components/TableTemplate2";

const App: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "зарплаты",
      to: "/salaries",
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

  return (
    <TableTemplate2
      defaultOpenKeys={[]}
      defaultSelectedKeys={["salaries"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={"зарплаты"}
      isDatePicker={true}
      fetchFunction={getSalaries}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      isUseParams={true}
      tableScroll={null}
      tableIsObj={true}
    />
  );
};

export default App;
