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
  getSTPenalty,
  putSTPenalty,
  getSTQuest,
  putSTQuest,
} from "../api/APIUtils";

// components
import EditTemplate from "../components/EditTemplate";

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
          value: item.first_name.toLowerCase(),
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
      title: "квесты",
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
      to: "/source-tables/quests",
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
          span: 8,
          name: "administrator",
          label: "администратор",
          rules: {
            required: true,
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
          span: 8,
          name: "actor",
          label: "актер",
          rules: {
            required: true,
            message: "пожалуйста, выберите актера",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите актера",
            options: optionsUsers,
            multiple: true,
          },
        },
        {
          span: 8,
          name: "animator",
          label: "аниматор",
          rules: {
            required: true,
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
          name: "package",
          label: "пакет",
          rules: {
            required: true,
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
          name: "travel",
          label: "проезд",
          rules: {
            required: true,
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
      ],
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchQuests();
  }, []);

  return (
    <EditTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исходные таблицы | квесты | редактирование"}
      fetchFunction={getSTQuest}
      putFunction={putSTQuest}
      formItems={formItems}
    />
  );
};

export default App;
