import React, { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link } from "react-router-dom";

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
import axios from "axios";

import Highlighter from "react-highlight-words";

// api
import {
  getUsers,
  getUsersByRole,
  getSTQuests,
  deleteSTQuest,
  postSTQuest,
  getQuests,
} from "../api/APIUtils";

// components
import Template from "../components/Template";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

const App: FC = () => {
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleDelete = async (key: React.Key) => {
    const response = await deleteEntry(key);
    if (response.status === 200) {
      const newData = data.filter((item) => item.key !== key);
      setData(newData);
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    title: string
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`поиск по ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            сброс
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const showDrawer = () => {
    setOpen(true);
    localStorage.setItem("stQuestsDrawerIsOpen", "true");
  };

  const onClose = () => {
    setOpen(false);
    localStorage.setItem("stQuestsDrawerIsOpen", "false");
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await getSTQuests(startDate, endDate);
      if (response.status === 200) {
        console.log(response.data);
        const formattedData = response.data.map((item) => ({
          key: item.key,
          date_time: item.date,
          quest: item.quest.name,
          quest_cost: item.quest_cost,
          add_players: item.add_players,
          actor_second_actor: item.actor_second_actor,
          discount_sum: item.discount_sum,
          discount_desc: item.discount_desc,
          room_sum: item.room_sum,
          room_quantity: item.room_quantity,
          room_employee_name: item.room_employee_name.first_name,
          video: item.video,
          photomagnets_sum: item.photomagnets_sum,
          photomagnets_quantity: item.photomagnets_quantity,
          birthday_congr: item.birthday_congr,
          easy_work: item.easy_work,
          night_game: item.night_game,
          administrator: item.administrator.first_name,
          actor: item.actor.map((a) => a.first_name),
          animator: item.animator.first_name,
        }));
        setData(formattedData);
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

  const deleteEntry = async (key) => {
    try {
      const response = await deleteSTQuest(key);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = async (dates) => {
    setDates(dates);
    if (dates !== null) {
      fetchData(dates[0].format("DD-MM-YYYY"), dates[1].format("DD-MM-YYYY"));
    } else {
      fetchData(null, null);
    }
  };

  const onFinish = async (value: object) => {
    try {
      const response = await postSTQuest(value);
      if (response.status === 201) {
        messageApi.open({
          type: "success",
          content: "запись создана",
        });
        if (dates.length !== 0) {
          fetchData(
            dates[0].format("DD-MM-YYYY"),
            dates[1].format("DD-MM-YYYY")
          );
        } else {
          fetchData(null, null);
        }
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "запись не создана",
      });
    }
  };

  const [open, setOpen] = useState(
    localStorage.getItem("stQuestsDrawerIsOpen")
      ? localStorage.getItem("stQuestsDrawerIsOpen") === "true"
      : false
  );
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsAdministrators, setOptionsAdministrators] = useState([]);
  const [optionsActors, setOptionsActors] = useState([]);
  const [optionsAnimators, setOptionsAnimators] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
    },
  ];
  const columns = [
    {
      title: "Дата/Время",
      dataIndex: "date_time",
      key: "date_time",
      width: 112,
      fixed: "left",
    },
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
    },
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      key: "quest_cost",
      ...getColumnSearchProps("quest_cost", ""),
      sorter: {
        compare: (a, b) => a.quest_cost - b.quest_cost,
      },
    },
    {
      title: "дополнительные игроки",
      dataIndex: "add_players",
      key: "add_players",
      ...getColumnSearchProps("add_players", ""),
      sorter: {
        compare: (a, b) => a.add_players - b.add_players,
      },
    },
    {
      title: "актеры/второй актер",
      dataIndex: "actor_second_actor",
      key: "actor_second_actor",
      ...getColumnSearchProps("actor_second_actor", ""),
      sorter: {
        compare: (a, b) => a.actor_second_actor - b.actor_second_actor,
      },
    },
    {
      title: "сумма скидки",
      dataIndex: "discount_sum",
      key: "discount_sum",
      ...getColumnSearchProps("discount_sum", ""),
      sorter: {
        compare: (a, b) => a.discount_sum - b.discount_sum,
      },
    },
    {
      title: "описание скидки",
      dataIndex: "discount_desc",
      key: "discount_desc",
      ...getColumnSearchProps("discount_desc", ""),
      sorter: {
        compare: (a, b) => a.discount_desc - b.discount_desc,
      },
    },
    {
      title: "сумма комнат",
      dataIndex: "room_sum",
      key: "room_sum",
      ...getColumnSearchProps("room_sum", ""),
      sorter: {
        compare: (a, b) => a.room_sum - b.room_sum,
      },
    },
    {
      title: "количество комнат",
      dataIndex: "room_quantity",
      key: "room_quantity",
      ...getColumnSearchProps("room_quantity", ""),
      sorter: {
        compare: (a, b) => a.room_quantity - b.room_quantity,
      },
    },
    {
      title: "сотрудник комнаты",
      dataIndex: "room_employee_name",
      key: "room_employee_name",
    },
    {
      title: "сумма видео",
      dataIndex: "video",
      key: "video",
      ...getColumnSearchProps("video", ""),
      sorter: {
        compare: (a, b) => a.video - b.video,
      },
    },
    {
      title: "сумма фотомагнитов",
      dataIndex: "photomagnets_sum",
      key: "photomagnets_sum",
      ...getColumnSearchProps("photomagnets_sum", ""),
      sorter: {
        compare: (a, b) => a.photomagnets_sum - b.photomagnets_sum,
      },
    },
    {
      title: "количество фотомагнитов",
      dataIndex: "photomagnets_quantity",
      key: "photomagnets_quantity",
      ...getColumnSearchProps("photomagnets_quantity", ""),
      sorter: {
        compare: (a, b) => a.photomagnets_quantity - b.photomagnets_quantity,
      },
    },

    {
      title: "поздравление именинника",
      dataIndex: "birthday_congr",
      key: "birthday_congr",
      ...getColumnSearchProps("birthday_congr", ""),
      sorter: {
        compare: (a, b) => a.birthday_congr - b.birthday_congr,
      },
    },
    {
      title: "сумма простоя",
      dataIndex: "easy_work",
      key: "easy_work",
      ...getColumnSearchProps("easy_work", ""),
      sorter: {
        compare: (a, b) => a.easy_work - b.easy_work,
      },
    },
    {
      title: "сумма ночной игры",
      dataIndex: "night_game",
      key: "night_game",
      ...getColumnSearchProps("night_game", ""),
      sorter: {
        compare: (a, b) => a.night_game - b.night_game,
      },
    },
    {
      title: "администратор",
      dataIndex: "administrator",
      key: "administrator",
    },
    {
      title: "актеры",
      dataIndex: "actor",
      key: "actor",
    },
    {
      title: "аниматор",
      dataIndex: "animator",
      key: "animator",
    },
    {
      title: "операция",
      dataIndex: "operation",
      render: (_, record: { key: React.Key }) =>
        data.length >= 1 ? (
          <Space>
            <Link to={`edit/${record.key}`}>редактировать</Link>
            <Popconfirm
              title="уверены, что нужно удалить?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a>удалить</a>
            </Popconfirm>
          </Space>
        ) : null,
      width: 192,
      fixed: "right",
    },
  ];

  useEffect(() => {
    fetchData(null, null);
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
        <Title>исходные таблицы | квесты</Title>
        <Space size="middle">
          <RangePicker onChange={handleDateChange} />
          <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
            новая запись
          </Button>
        </Space>
      </div>
      <Table
        scroll={{ x: 4500 }}
        columns={columns}
        dataSource={data}
        bordered
        summary={() => {
          if (data.length === 0) {
            return null;
          }

          let tquest_cost = 0;
          let tadd_players = 0;
          let tactor_second_actor = 0;
          let tdiscount_sum = 0;
          let troom_sum = 0;
          let troom_quantity = 0;
          let tvideo = 0;
          let tphotomagnets_sum = 0;
          let tphotomagnets_quantity = 0;
          let tbirthday_congr = 0;
          let teasy_work = 0;
          let tnight_game = 0;

          data.forEach(
            ({
              quest_cost,
              add_players,
              actor_second_actor,
              discount_sum,
              room_sum,
              room_quantity,
              video,
              photomagnets_sum,
              photomagnets_quantity,
              birthday_congr,
              easy_work,
              night_game,
            }) => {
              tquest_cost += quest_cost;
              tadd_players += add_players;
              tactor_second_actor += actor_second_actor;
              tdiscount_sum += discount_sum;
              troom_sum += room_sum;
              troom_quantity += room_quantity;
              tvideo += video;
              tphotomagnets_sum += photomagnets_sum;
              tphotomagnets_quantity += photomagnets_quantity;
              tbirthday_congr += birthday_congr;
              teasy_work += easy_work;
              tnight_game += night_game;
            }
          );

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>итого</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{tquest_cost}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{tadd_players}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{tactor_second_actor}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{tdiscount_sum}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <Text>{troom_sum}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <Text>{troom_quantity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}></Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <Text>{tvideo}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11}>
                  <Text>{tphotomagnets_sum}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  <Text>{tphotomagnets_quantity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13}>
                  <Text>{tbirthday_congr}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={14}>
                  <Text>{teasy_work}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={15}>
                  <Text>{tnight_game}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={16}></Table.Summary.Cell>
                <Table.Summary.Cell index={17}></Table.Summary.Cell>
                <Table.Summary.Cell index={18}></Table.Summary.Cell>
                <Table.Summary.Cell index={19}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      <Drawer
        title="создать новую запись"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>отмена</Button>
            <Button onClick={() => form.submit()} type="primary">
              создать
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
        >
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
                rules={[
                  { required: true, message: "пожалуйста, выберите дату" },
                ]}
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
                    message:
                      "пожалуйста, введите сумму поздравления именинника",
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
      </Drawer>
    </Template>
  );
};

export default App;
