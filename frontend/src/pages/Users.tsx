import React, { FC, ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Skeleton,
  Layout,
  Typography,
  Form,
  Table,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  QuestionOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import axios from "axios";

import SideBar from "../components/SideBar";
import CustomBreadcrumb from "../components/Breadcrumb";
import Main from "../components/Main";

const { Title } = Typography;

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
    link: "/",
  },
  {
    text: "Пользователи",
    link: "",
  },
];

interface Item {
  key: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string;
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

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");

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
      title: "Логин",
      dataIndex: "username",
      width: "15%",
      editable: true,
    },
    {
      title: "Фамилия",
      dataIndex: "last_name",
      width: "22.5%",
      editable: true,
    },
    {
      title: "Имя",
      dataIndex: "first_name",
      width: "22.5%",
      editable: true,
    },
    {
      title: "Отчество",
      dataIndex: "middle_name",
      width: "22.5%",
      editable: true,
    },
    {
      title: "Операция",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8, textTransform: "lowercase" }}
            >
              Сохранить
            </Typography.Link>
            <Popconfirm
              title="Отменить?"
              onConfirm={cancel}
              style={{ textTransform: "lowercase" }}
            >
              <a>Отмена</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            style={{ textTransform: "lowercase" }}
          >
            Редактировать
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

  const getUsers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/users`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    document.title = 'пользователи';

    getUsers();
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
          <Title style={{ textTransform: "lowercase" }}>Пользователи</Title>
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
        </Main>
      </Layout>
    </Layout>
  );
};

export default App;
