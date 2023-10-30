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

  return (
    <TemplateTable
      defaultOpenKeys={[]}
      defaultSelectedKeys={["salaries"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      getFunction={getSalaries}
    />
  );
};

export default SalariesFC;
