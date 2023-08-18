import React, { useState, FC, ReactNode } from "react";
import { Layout, theme } from "antd";

const { Content } = Layout;

interface MainProps {
  children: ReactNode;
}

const Main: FC<MainProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content style={{ margin: "24px 16px", overflow: "initial" }}>
      <div
        style={{
          padding: 16,
          minHeight: "calc(100vh - 48px - 18.85px - 24px)",
          background: colorBgContainer,
          borderRadius: "4px",
        }}
      >
        {children}
      </div>
    </Content>
  );
};

export default Main;
