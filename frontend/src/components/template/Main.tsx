import { FC, ReactNode, useState, useEffect } from "react";

// antd
import {
  Typography,
  Layout,
  Space,
  Button,
  DatePicker,
  theme,
  message,
} from "antd";
// antd | icons
import { PlusOutlined } from "@ant-design/icons";

// components
import CSider from "../UI/Sider.tsx";
import CBreadcrumb from "../UI/Breadcrumb.tsx";

// hooks
import useWindowWidthAndCollapsed from "../../useWindowWidthAndCollapsed";

// constants
import { layoutMarginLeft, rangePickerFormat } from "../../constants";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;

const { RangePicker } = DatePicker;

const MainFC: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  title,
  isRangePicker,
  rangePickerHandleChange,
  isAddEntry,
  addEntryHandleClick,
  addEntryTitle,
  isCancel,
  cancelHandleClick,
  isCreate,
  form,
  children,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [windowSize, { collapsed, toggleCollapsed }] =
    useWindowWidthAndCollapsed();

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Layout hasSider>
      <CSider
        collapsed={collapsed}
        setCollapsed={toggleCollapsed}
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={defaultSelectedKeys}
      />
      <Layout
        className="site-layout"
        style={{ marginLeft: !collapsed ? `${layoutMarginLeft}px` : "" }}
      >
        <CBreadcrumb items={breadcrumbItems} />

        <Content
          className="main__inner"
          style={{
            background: colorBgContainer,
          }}
        >
          {contextHolder}
          <div className="main__header">
            <Title>{title}</Title>
            {(isRangePicker === true || isAddEntry === true) && (
              <div className="custom-space">
                {isRangePicker === true && (
                  <RangePicker
                    onChange={rangePickerHandleChange}
                    format={rangePickerFormat}
                    className="m-w100"
                    defaultValue={[dayjs(), dayjs()]}
                  />
                )}
                {isAddEntry === true && (
                  <Button
                    type="primary"
                    onClick={addEntryHandleClick}
                    icon={<PlusOutlined />}
                    className="m-w100"
                  >
                    {addEntryTitle}
                  </Button>
                )}
              </div>
            )}
            {(isCancel === true || isCreate === true) && (
              <Space>
                {isCancel === true && (
                  <Button onClick={cancelHandleClick}>отмена</Button>
                )}
                {isCreate === true && (
                  <Button onClick={() => form.submit()} type="primary">
                    создать
                  </Button>
                )}
              </Space>
            )}
          </div>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainFC;
