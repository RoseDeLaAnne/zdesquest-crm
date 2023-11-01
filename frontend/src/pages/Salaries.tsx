import React, { FC, useEffect, useState } from "react";

// antd | icons
import { DollarOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../components/template/Table";

// api
import { getCurrentSalaries, getCurrentUser, getSalaries } from "../api/APIUtils";

const SalariesFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: DollarOutlined,
      title: "зарплаты",
      to: "/salaries",
    },
  ];  

  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    const response = await getCurrentUser();
    if (response.status === 200) {
      setUser(response.data);

      console.log(response.data.is_superuser)
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <TemplateTable
      defaultOpenKeys={[]}
      defaultSelectedKeys={["salaries"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      getFunction={user.is_superuser === true ? getCurrentSalaries : getSalaries}
      // getFunction={getSalaries}
      tableScroll={{ x: 1000 }}
    />
  );
};

export default SalariesFC;
