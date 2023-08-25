import React, { FC, useEffect } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// antd

// antd | icons
import { HomeOutlined, FallOutlined, TableOutlined } from "@ant-design/icons";

// components
import Template from "../components/Template";

const App: FC = () => {
  const breadcrumbItems2 = [
    {
      icon: "HomeOutlined",
      title: "главная",
    },
    {
      icon: "TableOutlined",
      title: "исходные таблицы",
    },
    {
      icon: "FallOutlined",
      title: "расходы",
      menu: [
        {
          key: "1",
          icon: "HomeOutlined",
          label: "исходные таблицы",
        },
        {
          key: "2",
          icon: "HomeOutlined",
          label: "исходные таблицы",
        },
      ],
    },
  ];

  const breadcrumbSubItems = [
    {
      key: "1",
      label: (
        <Link to="/sub1">
          <HomeOutlined />
          <span style={{ marginLeft: "8px" }}>sub1</span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/sub2">
          <FallOutlined />
          <span style={{ marginLeft: "8px" }}>sub2</span>
        </Link>
      ),
    },
  ];
  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined />
          <span style={{ marginLeft: "8px" }}>главная</span>
        </Link>
      ),
    },
    {
      title: (
        <Link to="/source-tables">
          <TableOutlined />
          <span style={{ marginLeft: "8px" }}>исходные таблицы</span>
        </Link>
      ),
    },
    {
      title: (
        <>
          <FallOutlined />
          <span style={{ marginLeft: "8px" }}>расходы</span>
        </>
      ),
      menu: { items: breadcrumbSubItems },
    },
  ];

  useEffect(() => {
    
  }, []);

  return (
    <Template
      title={"расходы"}
      breadcrumbItems={breadcrumbItems}
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
    >
      <span>test</span>
    </Template>
  );
};

export default App;
