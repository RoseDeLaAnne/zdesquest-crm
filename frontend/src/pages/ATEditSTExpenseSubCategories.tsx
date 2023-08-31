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
  getSTExpenseCategories,
  getSTExpenseSubCategory,
  putSTExpenseSubCategory,
} from "../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const [optionsSTExpenseCategories, setOptionsSTExpenseCategories] = useState(
    []
  );
  const fetchSTExpenseCategories = async () => {
    try {
      const response = await getSTExpenseCategories();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.name,
        }));
        setOptionsSTExpenseCategories(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "подкатегории расходов",
      to: "/additional-tables/stexpense-subcategories",
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
          label: "название подкатегории",
          rules: {
            required: true,
            message: "пожалуйста, введите название подкатегории",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите название подкатегории",
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
          span: 24,
          name: "category",
          label: "категория",
          rules: {
            required: true,
            message: "пожалуйста, выберите категорию",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите категорию",
            options: optionsSTExpenseCategories,
            multiple: null,
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchSTExpenseCategories();
  }, []);

  return (
    <EditTemplate
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseSubCategories"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"доп. таблицы | подкатегории расходов | ред."}
      fetchFunction={getSTExpenseSubCategory}
      putFunction={putSTExpenseSubCategory}
      formItems={formItems}
    />
  );
};

export default App;
