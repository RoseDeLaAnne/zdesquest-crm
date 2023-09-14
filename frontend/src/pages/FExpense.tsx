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
  getUsers,
  postSTQuest,
  putSTPenalty,
  getSTQuest,
  getSTExpenseSubCategories,
  postSTExpense,
  getSTExpense,
} from "../api/APIUtils";

// components
import CreateTemplate from "../components/CreateTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsSTExpenseSubCategories, setOptionsSTExpenseSubCategories] =
    useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.last_name.toLowerCase() + ' ' + item.first_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSTExpenseSubCategories = async () => {
    try {
      const response = await getSTExpenseSubCategories();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.name,
        }));
        setOptionsSTExpenseSubCategories(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchQuests = async () => {
    try {
      const response = await getQuests();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.name,
        }));
        setOptionsQuests(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "формы",
      to: "/forms",
    },
    {
      icon: TableOutlined,
      title: "расход",
    },
  ];
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 24,
          name: "date",
          label: "дата",
          rules: {
            required: true,
            message: "пожалуйста, введите дату",
          },
          item: {
            name: "DatePicker",
            label: "",
            placeholder: "",
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
          name: "amount",
          label: "сумма расхода",
          rules: {
            required: true,
            message: "пожалуйста, введите сумму расхода",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите сумму расхода",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "name",
          label: "наименование расхода",
          rules: {
            required: true,
            message: "пожалуйста, введите наименование расхода",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите наименование расхода",
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
          name: "sub_category",
          label: "подкатегория",
          rules: {
            required: true,
            message: "пожалуйста, выберите подкатегорию",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите подкатегорию",
            options: optionsSTExpenseSubCategories,
            multiple: false,
          },
        },
        {
          span: 12,
          name: "quests",
          label: "квесты",
          rules: {
            required: true,
            message: "пожалуйста, выберите квесты",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите квесты",
            options: optionsQuests,
            multiple: true,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "who_paid",
          label: "оплатил",
          rules: {
            required: true,
            message: "пожалуйста, выберите сотрудника",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите сотрудника",
            options: optionsUsers,
            multiple: false,
          },
        },
        {
          span: 12,
          name: "who_paid_amount",
          label: "оплачено",
          rules: {
            required: true,
            message: "пожалуйста, введите сумму",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите сумму",
            options: [],
            multiple: false,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 24,
          name: "image",
          label: "изображение",
          rules: {
            required: true,
            message: "пожалуйста, загрузите изображение",
          },
          item: {
            name: "Upload",
            label: "Upload",
            placeholder: "пожалуйста, загрузите изображение",
            options: [],
            multiple: false,
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchSTExpenseSubCategories();
    fetchQuests();
  }, []);

  return (
    <CreateTemplate
      defaultOpenKeys={["forms"]}
      defaultSelectedKeys={["formsExpense"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"формы | расход"}
      createFunction={postSTExpense}
      formItems={formItems}
    />
  );
};

export default App;
