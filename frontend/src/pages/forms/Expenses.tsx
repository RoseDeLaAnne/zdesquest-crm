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
  putSTQuest,
  postSTExpense,
} from "../../api/APIUtils";

import { getQuestsFormItems, getSTExpensesFormItems, getSTQuestFormItems } from "../../constants/index.ts";

// components
import TemplateCreate from "../../components/template/Create.tsx";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const QuestFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "формы",
      to: "/forms",
    },
    {
      icon: TableOutlined,
      title: "квест",
    },
  ];
  const title = `${
    initialBreadcrumbItems[initialBreadcrumbItems.length - 2].title
  } | ${initialBreadcrumbItems[initialBreadcrumbItems.length - 1].title}`;

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTExpensesFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = (value, name) => {
  };

  return (
    <TemplateCreate
      defaultOpenKeys={["forms"]}
      defaultSelectedKeys={["formsQuest"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={title}
      postFunction={postSTExpense}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default QuestFC;
