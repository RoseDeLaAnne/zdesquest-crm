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
  getRoles,
  putSTPenalty,
  getSTBonus,
  putSTBonus,
  getUser,
  putUser,
} from "../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [filtersUsers, setFiltersUsers] = useState([]);
  const [filtersQuests, setFiltersQuests] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [filtersRoles, setFiltersRoles] = useState([]);
  const [optionsRoles, setOptionsRoles] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.first_name.toLowerCase(),
          value: item.id,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.first_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
        setFiltersUsers(formattedFilters);
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
          value: item.id,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.id,
        }));

        setOptionsQuests(formattedOptions);
        setFiltersQuests(formattedFilters);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.id,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.id,
        }));
        setOptionsRoles(formattedOptions);
        setFiltersRoles(formattedFilters);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "сотрудники",
      to: "/users",
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
          name: "username",
          label: "логин",
          rules: {
            required: true,
            message: "пожалуйста, введите логин",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите логин",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "password",
          label: "пароль",
          rules: {
            required: true,
            message: "пожалуйста, введите пароль",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите пароль",
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
          name: "last_name",
          label: "фамилия",
          rules: {
            required: true,
            message: "пожалуйста, введите фамилию",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите фамилию",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "first_name",
          label: "имя",
          rules: {
            required: true,
            message: "пожалуйста, введите имя",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите имя",
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
          name: "quest",
          label: "квест",
          rules: {
            required: true,
            message: "пожалуйста, выберите квест",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите квест",
            options: optionsQuests,
            multiple: false,
          },
        },
        // {
        //   span: 12,
        //   name: "roles",
        //   label: "роли",
        //   rules: {
        //     required: true,
        //     message: "пожалуйста, выберите роли",
        //   },
        //   item: {
        //     name: "Select",
        //     label: "",
        //     placeholder: "пожалуйста, выберите роли",
        //     options: optionsRoles,
        //     multiple: true,
        //   },
        // },
      ],
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchQuests();
  }, []);

  return (
    <EditTemplate
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={["users"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"сотрудники | редактирование"}
      fetchFunction={getUser}
      putFunction={putUser}
      formItems={formItems}
    />
  );
};

export default App;
