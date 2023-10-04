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
  getQuests,
  getUsers,
  getSTBonusesPenalties,
  postSTBonusPenalty,
  deleteSTBonusPenalty,
} from "../../api/APIUtils";

// components
import TableTemplate from "../../components/TableTemplate";

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [filtersUsers, setFiltersUsers] = useState([]);
  const [filtersQuests, setFiltersQuests] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
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

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: FallOutlined,
      title: "бонусы/штрафы",
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

  const initialPackedTableColumns = [
    {
      title: "дата",
      dataIndex: "date",
      key: "date",
      sorting: {
        isSorting: true,
        isDate: true,
      },
      searching: {
        isSearching: true,
        title: "дате",
      },
      countable: false,
      width: 112,
    },
    {
      title: "тип",
      dataIndex: "type",
      key: "type",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (type) => {
        let color = "red";
        let formattedType = type;

        if (type === "bonus") {
          color = "green";
          formattedType = "бонус";
        } else if (type === "penalty") {
          color = "red";
          formattedType = "штраф";
        }

        return <Tag color={color}>{formattedType}</Tag>;
      },
    },
    {
      title: "сумма",
      dataIndex: "amount",
      key: "amount",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "сумме",
      },
      countable: true,
    },
    {
      title: "описание",
      dataIndex: "name",
      key: "name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "описанию бонуса",
      },
      countable: false,
    },
    {
      title: "сотрудник",
      dataIndex: "user",
      key: "user",
      filters: filtersUsers,
      onFilter: (value: string, record) =>
        record.user.first_name.startsWith(value),
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
      render: (user) => <Tag color="black">{user.username}</Tag>,
    },
    {
      title: "квесты",
      dataIndex: "quests",
      key: "quests",
      filters: filtersQuests,
      onFilter: (value, record) =>
        record.quests.some((quest) => quest.name === value),
      filterSearch: true,
      filterMultiple: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (_, { quests }) => (
        <>
          {quests.map((quest) => {
            return (
              <Tag color="orange" key={quest.id}>
                {quest.name}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "date",
          label: "дата",
          rules: {
            required: true,
            message: "пожалуйста, введите дату",
          },
          item: {
            name: "DatePicker",
            label: "",
            placeholder: "",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "type",
          label: "тип",
          rules: {
            required: true,
            message: "пожалуйста, введите дату",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "",
            options: [
              {
                label: "бонус",
                value: "bonus",
              },
              {
                label: "штраф",
                value: "penalty",
              },
            ],
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
          name: "amount",
          label: "сумма",
          rules: {
            required: true,
            message: "пожалуйста, введите сумму бонуса",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите сумму бонуса",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "name",
          label: "описание",
          rules: {
            required: true,
            message: "пожалуйста, введите описание бонуса",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите описание бонуса",
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
          name: "user",
          label: "сотрудник",
          rules: {
            required: true,
            message: "пожалуйста, выберите сотрудника",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите сотрудника",
            options: optionsUsers,
            multiple: false,
          },
        },
        {
          span: 12,
          name: "quests",
          label: "квесты",
          rules: {
            required: true,
            message: "пожалуйста, выберите квесты",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите квесты",
            options: optionsQuests,
            multiple: true,
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
    <TableTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesBonusesPenalties"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исходные таблицы | бонусы/штрафы"}
      datePicker={true}
      addEntry={true}
      addEntryTitle={"новая запись"}
      fetchFunction={getSTBonusesPenalties}
      createFunction={postSTBonusPenalty}
      deleteFunction={deleteSTBonusPenalty}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новую запись"
      formItems={formItems}
    />
  );
};

export default App;
