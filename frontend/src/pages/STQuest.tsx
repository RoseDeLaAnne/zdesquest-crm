import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useParams, useNavigate } from "react-router-dom";

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
  Checkbox,
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
  getUsers,
  getUsersByRole,
  getQuests,
  getSTQuest,
  getSTQuests,
  putSTQuest,
  deleteSTQuest,
  postSTQuest,
} from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const App: FC = () => {
  const navigate = useNavigate();

  const { qid } = useParams();

  const onClose = () => {
    navigate("/source-tables/quests");
  };

  const fetchData = async () => {
    try {
      const response = await getSTQuest(qid);
      if (response.status === 200) {
        console.log(response.data);
        const actors = response.data.actor.map((actor) => {
          return actor.id
        })  
        form.setFieldsValue({
          quest: response.data.quest.id,
          date: dayjs(response.data.date, "DD.MM.YYYY"),
          time: dayjs(response.data.time, "HH:mm:ss"),
          quest_cost: response.data.quest_cost,
          add_players: response.data.add_players,
          actor_second_actor: response.data.actor_second_actor,
          discount_sum: response.data.discount_sum,
          discount_desc: response.data.discount_desc,
          room_sum: response.data.room_sum,
          room_quantity: response.data.room_quantity,
          room_employee_name: response.data.room_employee_name.id,
          video: response.data.video,
          photomagnets_quantity: response.data.photomagnets_quantity,
          birthday_congr: response.data.birthday_congr,
          easy_work: response.data.easy_work,
          night_game: response.data.night_game,
          administrator: response.data.administrator.id,
          actor: actors,
          animator: response.data.animator.id,
          package: response.data.package,
          travel: response.data.travel,
        });
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

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAdministrators = async () => {
    try {
      const response = await getUsersByRole("administrator");
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));
        setOptionsAdministrators(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActors = async () => {
    try {
      const response = await getUsersByRole("actor");
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));
        setOptionsActors(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnimators = async () => {
    try {
      const response = await getUsersByRole("animator");
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));
        setOptionsAnimators(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await putSTQuest(qid, value);
      if (response.status === 200) {
        messageApi.open({
          type: "success",
          content: "запись отредактирована",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не отредактирована",
      });
    }
  };

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsAdministrators, setOptionsAdministrators] = useState([]);
  const [optionsActors, setOptionsActors] = useState([]);
  const [optionsAnimators, setOptionsAnimators] = useState([]);

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
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
      to: "/source-tables/expenses",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  useEffect(() => {
    fetchData();
    fetchQuests();
    fetchUsers();
    fetchAdministrators();
    fetchActors();
    fetchAnimators();
  }, []);

  return (
    <Template
      breadcrumbItems={sourceBreadcrumbItems}
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
    >
      {contextHolder}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>исх. таблицы | квесты | редактирование</Title>
        <Space>
          <Button onClick={onClose}>отмена</Button>
          <Button onClick={() => form.submit()} type="primary">
            сохранить
          </Button>
        </Space>
      </div>
      <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="quest"
              label="квест"
              rules={[
                { required: true, message: "пожалуйста, выберите квест" },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите квест"
                options={optionsQuests}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="дата"
              rules={[{ required: true, message: "пожалуйста, выберите дату" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="time"
              label="время"
              rules={[
                { required: true, message: "пожалуйста, выберите время" },
              ]}
            >
              <DatePicker picker="time" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="quest_cost"
              label="стоимость квеста"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите стоимость квеста",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите стоимость квеста" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="add_players"
              label="дополнительные игроки"
              rules={[
                {
                  required: true,
                  message:
                    "пожалуйста, введите сумму за дополнительных игроков",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму за дополнительных игроков" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="actor_second_actor"
              label="актеры/второй актер"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму актеров/второго актера",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму актеров/второго актера" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="discount_sum"
              label="сумма скидки"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму скидки",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму скидки" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="discount_desc"
              label="описание скидки"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите описание скидки",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите описание скидки" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="room_sum"
              label="сумма комнат"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму комнат",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму комнат" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="room_quantity"
              label="количество комнат"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите количество комнат",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите количество комнат" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="room_employee_name"
              label="сотрудник комнаты"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите сотрудника комнаты",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите сотрудника комнаты"
                options={optionsUsers}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="video"
              label="сумма видео"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму видео",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму видео" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="photomagnets_quantity"
              label="количество фотомагнитов"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите количество фотомагнитов",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите количество фотомагнитов" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="birthday_congr"
              label="поздравление именинника"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму поздравления именинника",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму поздравления именинника" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="easy_work"
              label="простой"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму простоя",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму простоя" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="night_game"
              label="ночная игра"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, введите сумму ночной игры",
                },
              ]}
            >
              <Input placeholder="пожалуйста, введите сумму ночной игры" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="administrator"
              label="администратор"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите администратора",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите администратора"
                options={optionsAdministrators}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="actor"
              label="актер"
              rules={[
                { required: true, message: "пожалуйста, выберите актера" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите актера"
                options={optionsActors}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="animator"
              label="аниматор"
              rules={[
                {
                  required: true,
                  message: "пожалуйста, выберите аниматора",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="пожалуйста, выберите аниматора"
                options={optionsAnimators}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="package"
              label="пакет"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>да/нет</Checkbox>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="travel"
              label="проезд"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>да/нет</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Template>
  );
};

export default App;
