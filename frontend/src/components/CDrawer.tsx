import React, { FC, useState, useEffect, useRef } from "react";

// antd
import { Space, Button, Drawer, Form } from "antd";

// components
import CForm from "../components/CForm";

const App: FC = ({
  title,
  onClose,
  open,
  formItems,
  formForm,
  formOnFinish,
}) => {
  return (
    <Drawer
      title={title}
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>отмена</Button>
          <Button onClick={() => formForm.submit()} type="primary">
            создать
          </Button>
        </Space>
      }
    >
      <CForm items={formItems} form={formForm} onFinish={formOnFinish} />
    </Drawer>
  );
};

export default App;
