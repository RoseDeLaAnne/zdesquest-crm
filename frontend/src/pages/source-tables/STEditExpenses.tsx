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
  getSTExpenseSubCategories,
  getSTExpense,
  putSTExpense,
} from "../../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const [optionsSTExpenseSubCategories, setOptionsSTExpenseSubCategories] =
    useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
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
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: FallOutlined,
      title: "расходы",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "бонусы",
          to: "/source-tables/bonuses",
        },
        {
          key: "4",
          icon: DeploymentUnitOutlined,
          label: "штрафы",
          to: "/source-tables/penalties",
        },
      ],
      to: "/source-tables/expenses",
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
  ];

  useEffect(() => {
    fetchSTExpenseSubCategories();
    fetchQuests();
  }, []);

  return (
    <EditTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исх.таблицы | расходы | редактирование"}
      fetchFunction={getSTExpense}
      putFunction={putSTExpense}
      formItems={formItems}
    />
  );
};

export default App;
