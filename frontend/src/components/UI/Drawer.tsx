
import React, { FC, useState, useEffect, useRef } from "react";

// antd
import { Space, Button, Drawer, Form } from "antd";

// components
import CForm from "./Form";

const DrawerFC: FC = ({
  title,
  onClose,
  open,
  formForm,
  formItems,
  formFileList,
  formSetFileList,
  formOnFinish,
  formHandleOnSelect,
  formHandleOnChange,
  // formHandleOnSearch,
  formInitialValues
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
      <CForm form={formForm} items={formItems} fileList={formFileList} setFileList={formSetFileList} onFinish={formOnFinish} handleOnSelect={formHandleOnSelect} handleOnChange={formHandleOnChange} initialValues={formInitialValues} />
    </Drawer>
  );
};

export default DrawerFC;
