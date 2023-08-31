import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd
import {
  Typography,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Col,
  DatePicker,
  Drawer,
  Form,
  Row,
  Select,
  Space,
  Tag,
  Button,
  Input,
  Table,
  Popconfirm,
  message,
} from "antd";
// antd | type
import type { MenuProps, InputRef } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type {
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from "antd/es/table/interface";
// antd | icons
import {
  HomeOutlined,
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  PlusOutlined,
  SearchOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// libs
import dayjs from "dayjs";

import axios from "axios";

// api
import {
  getQuests,
  getExpenseSubCategories,
  getSTExpense,
  putSTExpense,
  getSTExpenseCategory,
  putSTExpenseCategory,
} from "../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "категории расходов",
      to: "/additional-tables/stexpense-categories",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 24,
          name: "name",
          label: "название категории",
          rules: {
            required: true,
            message: "пожалуйста, введите название категории",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите название категории",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  useEffect(() => {}, []);

  return (
    <EditTemplate
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseCategories"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"доп. таблицы | категории расходов | ред."}
      fetchFunction={getSTExpenseCategory}
      putFunction={putSTExpenseCategory}
      formItems={formItems}
    />
  );
};

export default App;
