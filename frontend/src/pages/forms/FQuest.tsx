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
} from "../../api/APIUtils";

// components
import CreateTemplate from "../../components/CreateTemplate";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.first_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
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
      title: "квест",
    },
  ];
  const formItems = [
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
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите квест",
            options: optionsQuests,
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
          name: "date",
          label: "дата",
          rules: {
            required: true,
            message: "пожалуйста, выберите дату",
          },
          item: {
            name: "DatePicker",
            picker: "",
            label: "",
            placeholder: "",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "time",
          label: "время",
          rules: {
            required: true,
            message: "пожалуйста, выберите время",
          },
          item: {
            name: "DatePicker",
            picker: "time",
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
          span: 8,
          name: "quest_cost",
          label: "стоимость квеста",
          rules: {
            required: true,
            message: "пожалуйста, введите стоимость квеста",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите стоимость квеста",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "add_players",
          label: "дополнительные игроки",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму за дополнительных игроков",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму за дополнительных игроков",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "actor_second_actor",
          label: "актеры/второй актер",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму актеров/второго актера",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму актеров/второго актера",
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
          name: "discount_sum",
          label: "сумма скидки",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму скидки",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму скидки",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "discount_desc",
          label: "описание скидки",
          rules: {
            required: false,
            message: "пожалуйста, введите описание скидки",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите описание скидки",
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
          span: 8,
          name: "room_sum",
          label: "сумма комнат",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму комнат",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму комнат",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "room_quantity",
          label: "количество комнат",
          rules: {
            required: false,
            message: "пожалуйста, введите количество комнат",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите количество комнат",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "room_employee_name",
          label: "сотрудник комнаты",
          rules: {
            required: false,
            message: "пожалуйста, выберите сотрудника комнаты",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите сотрудника комнаты",
            options: optionsUsers,
            multiple: false,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 8,
          name: "video",
          label: "сумма видео",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму видео",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму видео",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "photomagnets_quantity",
          label: "количество фотомагнитов",
          rules: {
            required: false,
            message: "пожалуйста, введите количество фотомагнитов",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите количество фотомагнитов",
            options: [],
            multiple: null,
          },
        },
        {
          span: 8,
          name: "birthday_congr",
          label: "поздравление именинника",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму поздравления именинника",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму поздравления именинника",
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
          name: "easy_work",
          label: "простой",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму простоя",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму простоя",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "night_game",
          label: "ночная игра",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму ночной игры",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму ночной игры",
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
          name: "administrator",
          label: "администратор",
          rules: {
            required: false,
            message: "пожалуйста, выберите администратора",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите администратора",
            options: optionsUsers,
            multiple: false,
          },
        },
        {
          span: 12,
          name: "animator",
          label: "аниматор",
          rules: {
            required: false,
            message: "пожалуйста, выберите аниматора",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите аниматора",
            options: optionsUsers,
            multiple: false,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "actors",
          label: "актеры",
          rules: {
            required: false,
            message: "пожалуйста, выберите актеров",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите актеров",
            options: optionsUsers,
            multiple: true,
          },
        },
        {
          span: 12,
          name: "actors_half",
          label: "актеры (50%)",
          rules: {
            required: false,
            message: "пожалуйста, выберите актеров (50%)",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите актеров (50%)",
            options: optionsUsers,
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
          name: "cash_payment",
          label: "наличный расчет",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму наличного расчета",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму наличного расчета",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "cashless_payment",
          label: "безналичный расчет",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму безналичного расчета",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму безналичного расчета",
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
          name: "cash_delivery",
          label: "сдача наличными",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму сдачи наличными",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму сдачи наличными",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "cashless_delivery",
          label: "сдача безналичными",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму сдачи безналичными",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму сдачи безналичными",
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
          span: 6,
          name: "package",
          label: "пакет",
          rules: {
            required: false,
            message: "",
          },
          item: {
            name: "Checkbox",
            picker: "",
            label: "да/нет",
            placeholder: "",
            options: [],
            multiple: null,
          },
        },
        {
          span: 6,
          name: "travel",
          label: "проезд",
          rules: {
            required: false,
            message: "",
          },
          item: {
            name: "Checkbox",
            picker: "",
            label: "да/нет",
            placeholder: "",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "prepayment",
          label: "предоплата",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму предоплаты",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму предоплаты",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchQuests();
  }, []);

  return (
    <CreateTemplate
      defaultOpenKeys={["forms"]}
      defaultSelectedKeys={["formsQuest"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"формы | квест"}
      createFunction={postSTQuest}
      formItems={formItems}
    />
  );
};

export default App;
