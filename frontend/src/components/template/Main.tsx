import { FC, ReactNode, useState, useEffect } from "react";

// antd
import {
  Typography,
  Skeleton,
  Layout,
  Space,
  Select,
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
import { useParams } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

const { RangePicker } = DatePicker;

const MainFC: FC = ({
  defaultOpenKeys,
  defaultSelectedKeys,
  breadcrumbItems,
  title,
  isUseParams,
  isRangePicker,
  rangePickerHandleChange,
  isAddEntry,
  isExport,
  addEntryHandleClick,
  addEntryTitle,
  isCancel,
  cancelHandleClick,
  exportHandleOnClick,
  isCreate,
  form,
  isPullOfDates,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOnChange,
  children,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [windowSize, { collapsed, toggleCollapsed }] =
    useWindowWidthAndCollapsed();

  // const [messageApi, contextHolder] = message.useMessage();

  const { id } = isUseParams ? useParams() : { id: "" };

  useEffect(() => {
    document.title = title;
  }, [id]);

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
          {/* {contextHolder} */}
          <div className="main__header">
            <Title>{title}</Title>
            {(isRangePicker === true || isAddEntry === true) && (
              <div className="custom-space">
                {isPullOfDates && (
                  <Select
                    defaultValue={pullOfDatesDefaultValue}
                    options={pullOfDatesOptions}
                    onChange={pullOfDatesOnChange}
                    style={{ minWidth: "256px", width: "100%" }}
                  />
                )}
                {/* {isRangePicker === true && (
                  <RangePicker
                    onChange={rangePickerHandleChange}
                    format={rangePickerFormat}
                    className="m-w100"
                    // defaultValue={
                    //   breadcrumbItems[breadcrumbItems.length - 1].title ===
                    //   "касса"
                    //     ? [dayjs(), dayjs()]
                    //     : ""
                    // }
                  />
                )} */}
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
            {/* {isExport === true && (
              <Button
                type="primary"
                onClick={addEntryHandleClick}
                icon={<PlusOutlined />}
                className="m-w100"
              >
                Excel
              </Button>
            )} */}
            {/* <Button
              type="primary"
              onClick={exportHandleOnClick}
              icon={<PlusOutlined />}
              className="m-w100"
            >
              Excel
            </Button> */}
            {(isCancel === true || isCreate === true) && (
              <Space>
                {isCancel === true && (
                  <Button onClick={cancelHandleClick}>отмена</Button>
                )}
                {isCreate === true && (
                  <Button onClick={() => form.submit()} type="primary">
                    редактировать
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
