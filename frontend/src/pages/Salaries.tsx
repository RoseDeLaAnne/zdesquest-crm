import React, { FC, useEffect, useState } from "react";

// antd | icons
import { DollarOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../components/template/Table";

// api
import {
  getCurrentSalaries,
  getCurrentUser,
  getSalaries,
  toggleCorrectnessOfsalary,
} from "../api/APIUtils";
import {
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesWhenLoadingSalaries,
} from "../constants";

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
      // getFunction={user.is_superuser ? getSalaries : getCurrentSalaries}
      getFunction={getSalaries}
      tableScroll={{ x: 2500, y: 600 }}
      tableIsObj={true}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultValue}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingSalaries}
      pullOfDatesOptions={pullOfDatesOptions}
      tableIsOperation={"actions"}
      toggleFunction={toggleCorrectnessOfsalary}
      tableOperationNames={['верно', 'неверно']}
    />
  );
};

export default SalariesFC;
