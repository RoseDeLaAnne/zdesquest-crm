import React, { FC } from "react";

// antd
import { Breadcrumb } from "antd";

// antd | icons
import { HomeOutlined, FallOutlined, TableOutlined } from "@ant-design/icons";

// utilities

import { generateBreadcrumbItems } from "../../assets/utilities/breadcrumb";

// interface
import { IBreadcrumb } from "../../assets/utilities/interface";

const App: FC<IBreadcrumb> = ({ items }) => {
  const defaultSourceBreadcrumbItem = {
    icon: HomeOutlined,
    title: "главная",
    to: "/",
  };
  const sourceBreadcrumbItemsWithDefault = [
    defaultSourceBreadcrumbItem,
    ...items,
  ];
  const breadcrumbItems = generateBreadcrumbItems(sourceBreadcrumbItemsWithDefault);

  return (
    <Breadcrumb items={breadcrumbItems} className="breadcrumb" />
  );
};

export default App;
