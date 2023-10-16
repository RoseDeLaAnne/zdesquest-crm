import React, { FC, useEffect, useState } from "react";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// api
import { getCurrentSalaries, getCurrentUser, getSalaries } from "../api/APIUtils";

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

  const [isSuperUser, setIsSuperUser] = useState(false)

  const fetchCurrentUser = async () => {
    const res = await getCurrentUser()
    setIsSuperUser(res.data.is_superuser)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])
  

  return (
    <TableTemplate2
      defaultOpenKeys={[]}
      defaultSelectedKeys={["salaries"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={"зарплаты"}
      isDatePicker={true}
      // fetchFunction={isSuperUser === true ? getSalaries : getCurrentSalaries}
      fetchFunction={getSalaries}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      isUseParams={true}
      tableScroll={{ x: 1500 }}
      tableIsObj={true}
    />
  );
};

export default App;
