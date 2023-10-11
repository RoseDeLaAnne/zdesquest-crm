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

import { getQuestsFormItems, getSTQuestFormItems } from "../../constants/index.ts";

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
    const res = await getSTQuestFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState({});
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(null);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState([]);
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});

  const formHandleOnChange = (value, name) => {
    console.log('hello2')
    if (name === "quest") {
      const quest = quests.find((el) => el.id === value);

      setSelectedQuest(quest);

      if (isPackage === false) {
        switch (quest.name) {
          case "ДСР":
            setNotVisibleFormItems([""]);
            break;
          case "У57":
            setNotVisibleFormItems([""]);
            break;
          case "Тьма":
            setNotVisibleFormItems(["actor_second_actor"]);
            break;
          case "ДМ":
            setNotVisibleFormItems(["animator"]);
            break;
          case "Они":
            setNotVisibleFormItems(["actor_second_actor"]);
            break;
          case "ОСК":
            setNotVisibleFormItems(["animator"]);
            break;
          case "Логово Ведьмы":
            setNotVisibleFormItems(["animator"]);
            break;
          default:
            setNotVisibleFormItems([]);
            break;
        }
  
        // if (quest.address === 'Афанасьева, 13') {
        //   setNotVisibleFormItems(['photomagnets_quantity']);
        // }
      }

      if (isWeekend === true) {
        setDefaultValuesFormItems({
          quest_cost: selectedQuest.cost_weekends,
        });
      } else if (isWeekend === false) {
        setDefaultValuesFormItems({
          quest_cost: selectedQuest.cost_weekdays,
        });
      }
    } else if (name === "is_package") {
      setIsPackage(value.target.checked)
      if (value.target.checked) {
        const names = formItems.reduce((accumulator, currentGroup) => {
          currentGroup.items.forEach((item) => {
            accumulator.push(item.name);
          });
          return accumulator;
        }, []);
        // const visibleNames = [
        //   "quest",
        //   "is_package",
        //   "is_video_review",
        //   "date",
        //   "time",
        //   "quest_cost",
        //   "administrator"
        // ];
        // const filteredArray = names.filter(
        //   (item) => !visibleNames.includes(item)
        // );
        setNotVisibleFormItems(['birthday_congr', 'video']);
      } else {
        setNotVisibleFormItems([]);
      }
    } else if (name === "date") {
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();
      if (Object.keys(selectedQuest).length !== 0) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setIsWeekend(true)
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekends,
          });
        } else {
          setIsWeekend(false)
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekdays,
          });
        }
      }
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await getQuests();
      if (response.status === 200) {
        setQuests(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return (
    <TemplateCreate
      defaultOpenKeys={["forms"]}
      defaultSelectedKeys={["formsQuest"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={title}
      postFunction={postSTQuest}
      formItems={formItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default QuestFC;
