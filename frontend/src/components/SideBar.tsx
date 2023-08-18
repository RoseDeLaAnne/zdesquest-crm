import React, { useState, FC, ReactNode } from "react";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

interface MainProps {
  items: any[]; // Update the type of 'items' prop as needed
  // children: ReactNode;
}

const SideBar: FC<MainProps> = ({ items }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={items}
        style={{
          marginTop: "8px",
          textTransform: "lowercase",
          letterSpacing: "0.1em",
        }}
      />
    </Sider>
  );
};

export default SideBar;
