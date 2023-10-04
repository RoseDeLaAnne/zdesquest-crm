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
  getQuest,
  putQuest,
} from "../../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/quests",
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
          span: 12,
          name: "latin_name",
          label: "ключевое название",
          rules: {
            required: true,
            message: "пожалуйста, введите ключевое название",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите ключевое название",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "name",
          label: "название",
          rules: {
            required: true,
            message: "пожалуйста, введите название",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите название",
            options: [],
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "address",
          label: "адрес",
          rules: {
            required: true,
            message: "пожалуйста, введите адрес",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите адрес",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "rate",
          label: "rate",
          rules: {
            required: true,
            message: "пожалуйста, введите ставку",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите ставку",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  return (
    <EditTemplate
      defaultOpenKeys={["quests"]}
      defaultSelectedKeys={["quests"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"квесты | редактирование"}
      fetchFunction={getQuest}
      putFunction={putQuest}
      formItems={formItems}
    />
  );
};

export default App;
