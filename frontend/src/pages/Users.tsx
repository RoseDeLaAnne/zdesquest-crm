import React, { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// api
import {
  deleteSTExpense,
  getSTExpenseSubCategories,
  getQuests,
  getSTExpenses,
  postSTExpense,
  getSTPenalties,
  postSTPenalty,
  deleteSTPenalty,
  getUsers,
  postUser,
  deleteUser,
  getRoles,
} from "../api/APIUtils";

// components
import TableTemplate from "../components/TableTemplate";

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
  ];

  const initialPackedTableColumns = [
    {
      title: "логин",
      dataIndex: "username",
      key: "username",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: false,
    },
    {
      title: "фамилия",
      dataIndex: "last_name",
      key: "last_name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: false,
    },
    {
      title: "имя",
      dataIndex: "first_name",
      key: "first_name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: false,
    },
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      filters: filtersQuests,
      onFilter: (value: string, record) => record.quest.name.startsWith(value),
      filterSearch: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (quest) => <Tag color="orange">{quest.name}</Tag>,
    },
    // {
    //   title: "роли",
    //   dataIndex: "roles",
    //   key: "roles",
    //   filters: filtersRoles,
    //   onFilter: (value, record) => record.roles.name.includes(value),
    //   filterSearch: true,
    //   filterMultiple: true,
    //   sorting: {
    //     isSorting: false,
    //     isDate: false,
    //   },
    //   searching: {
    //     isSearching: false,
    //     title: "",
    //   },
    //   countable: false,
    //   render: (_, { roles }) => (
    //     <>
    //       {roles.map((role) => {
    //         return (
    //           <Tag color="geekblue" key={role.id}>
    //             {role.name}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
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
    // fetchRoles();
    fetchQuests();
  }, []);

  return (
    <TableTemplate
      defaultOpenKeys={["users"]}
      defaultSelectedKeys={["users"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"сотрудники"}
      datePicker={false}
      addEntry={true}
      addEntryTitle={"новый сотрудник"}
      fetchFunction={getUsers}
      createFunction={postUser}
      deleteFunction={deleteUser}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать нового сотрудника"
      formItems={formItems}
    />
  );
};

export default App;
