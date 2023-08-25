import React, { FC, ReactNode, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Skeleton,
  Layout,
  Typography,
  Form,
  Button,
  Result,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Col,
  DatePicker,
  Drawer,
  Row,
  Select,
  Space,
} from "antd";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import axios from "axios";

import SideBar from "../components/SideBar";
import CustomBreadcrumb from "../components/Breadcrumb";
import Main from "../components/Main";

const { Title, Text } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

type MenuItem = Required<MenuProps>["items"][number];

interface MainProps {
  children: ReactNode;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  to: string, // Add the 'to' prop for the link
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    // Wrap the label in a Link component
    label: <Link to={to}>{label}</Link>,
    type,
  } as MenuItem;
}

const sideBarItems: MenuItem[] = [
  getItem("Пользователи", "users", "/users", <UserOutlined />),

  getItem("Квесты", "quests", "/quests", <QuestionOutlined />, [
    getItem("Радуга", "sub3", "/quests", <QuestionOutlined />, [
      getItem("Доходы", "11", "/quests", <RiseOutlined />),
      getItem("Расходы", "12", "/quests", <FallOutlined />),
      getItem("Зарплаты", "13", "/quests", <DollarOutlined />),
    ]),
    getItem("Добавить", "questsAdd", "/quests/add", <AppstoreAddOutlined />),
  ]),
];

const breadCrumbItems = [
  {
    text: "Главная",
    link: `/`,
  },
  {
    text: "Исходные таблицы",
    link: `/source-tables`,
  },
  {
    text: "Квест-таблица",
    link: ``,
  },
];

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Дата/Время",
      dataIndex: "date",
    },
    {
      title: "Стоимость квеста",
      dataIndex: "quest_cost",
      editable: true,
    },
    {
      title: "Дополнительные игроки",
      dataIndex: "add_players",
      editable: true,
    },
    {
      title: "Актеры/Второй актер",
      dataIndex: "actor_second_actor",
      editable: true,
    },
    {
      title: "Скидка",
      dataIndex: "discount_sum",
      editable: true,
    },
    {
      title: "операция",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const getQuestTable = async () => {
    const url = `http://127.0.0.1:8000/api/quest-table/`
    try {
      const response = await axios.get(
        url
      );
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    document.title = "исходные таблицы | квест-таблица";

    getQuestTable()
  }, []);

  return (
    <Layout hasSider>
      <SideBar items={sideBarItems} />
      <Layout
        className="site-layout"
        style={{ marginLeft: collapsed ? "80px" : "200px" }}
      >
        <CustomBreadcrumb items={breadCrumbItems} />
        <Main>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title style={{ textTransform: "lowercase" }}>Квест-таблица</Title>
            <div>
              <RangePicker />
              <Button
                type="primary"
                onClick={showDrawer}
                icon={<PlusOutlined />}
              >
                Добавить запись
              </Button>
            </div>
          </div>

          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
            />
          </Form>
          <Drawer
            title="Добавить новую запись"
            width={720}
            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
              <Space>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={onClose} type="primary">
                  Добавить
                </Button>
              </Space>
            }
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                      { required: true, message: "Please enter user name" },
                    ]}
                  >
                    <Input placeholder="Please enter user name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="url"
                    label="Url"
                    rules={[{ required: true, message: "Please enter url" }]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      addonBefore="http://"
                      addonAfter=".com"
                      placeholder="Please enter url"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="owner"
                    label="Owner"
                    rules={[
                      { required: true, message: "Please select an owner" },
                    ]}
                  >
                    <Select placeholder="Please select an owner">
                      <Option value="xiao">Xiaoxiao Fu</Option>
                      <Option value="mao">Maomao Zhou</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Type"
                    rules={[
                      { required: true, message: "Please choose the type" },
                    ]}
                  >
                    <Select placeholder="Please choose the type">
                      <Option value="private">Private</Option>
                      <Option value="public">Public</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="approver"
                    label="Approver"
                    rules={[
                      { required: true, message: "Please choose the approver" },
                    ]}
                  >
                    <Select placeholder="Please choose the approver">
                      <Option value="jack">Jack Ma</Option>
                      <Option value="tom">Tom Liu</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateTime"
                    label="DateTime"
                    rules={[
                      { required: true, message: "Please choose the dateTime" },
                    ]}
                  >
                    <DatePicker.RangePicker
                      style={{ width: "100%" }}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "please enter url description",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="please enter url description"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </Main>
      </Layout>
    </Layout>
  );
};

export default App;
