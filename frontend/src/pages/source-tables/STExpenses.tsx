import React, { FC, useState, useEffect } from "react";

// antd
import { Tag, Image } from "antd";
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
  getUsers,
} from "../../api/APIUtils";

// components
import TableTemplate from "../../components/TableTemplate";

const backendUrl = "http://127.0.0.1:8000";

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [optionsSTExpenseSubCategories, setOptionsSTExpenseSubCategories] =
    useState([]);
  const [filtersSubCategories, setFiltersSubCategories] = useState([]);
  const [filtersQuests, setFiltersQuests] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name.toLowerCase() + " " + item.first_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSTExpenseSubCategories = async () => {
    try {
      const response = await getSTExpenseSubCategories();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.name,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.name,
        }));
        setOptionsSTExpenseSubCategories(formattedOptions);
        setFiltersSubCategories(formattedFilters);
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
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.name,
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
      title: "наименование",
      dataIndex: "name",
      key: "name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "наименованию",
      },
      countable: false,
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
      title: "подкатегория",
      dataIndex: "sub_category",
      key: "sub_category",
      filters: filtersSubCategories,
      onFilter: (value: string, record) =>
        record.sub_category.startsWith(value),
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
      render: (sub_category) => <Tag color="black">{sub_category.name}</Tag>,
    },
    {
      title: "квесты",
      dataIndex: "quests",
      key: "quests",
      filters: filtersQuests,
      onFilter: (value, record) => record.quests.includes(value),
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
              <Tag color="orange" key={quest}>
                {quest}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "оплатил",
      dataIndex: "who_paid",
      key: "who_paid",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (who_paid) => (
        <Tag color="black">
          {who_paid.last_name} {who_paid.first_name}
        </Tag>
      ),
    },
    {
      title: "оплачено",
      dataIndex: "who_paid_amount",
      key: "who_paid_amount",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "изображение",
      dataIndex: "image",
      key: "image",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (text, record) => (
        <Image
          src={`${backendUrl}${record.image}`} // Concatenate the backend URL with the image path
          alt={record.name}
          width={100}
        />
      ),
    },
  ];
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 24,
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
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "amount",
          label: "сумма расхода",
          rules: {
            required: true,
            message: "пожалуйста, введите сумму расхода",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите сумму расхода",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "name",
          label: "наименование расхода",
          rules: {
            required: true,
            message: "пожалуйста, введите наименование расхода",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите наименование расхода",
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
          name: "sub_category",
          label: "подкатегория",
          rules: {
            required: true,
            message: "пожалуйста, выберите подкатегорию",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите подкатегорию",
            options: optionsSTExpenseSubCategories,
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
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "paid_from",
          label: "оплачено",
          rules: {
            required: true,
            message: "пожалуйста, выберите сотрудника",
          },
          item: {
            name: "Select",
            label: "",
            placeholder: "пожалуйста, выберите сотрудника",
            options: [
              {
                label: "с рабочей карты",
                value: "work_card",
              },
              {
                label: "со своих",
                value: "their",
              },
              {
                label: "с кассы",
                value: "cash_register",
              },
            ],
            multiple: false,
          },
        },
        {
          span: 12,
          name: "who_paid",
          label: "оплатил",
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
        // {
        //   span: 12,
        //   name: "who_paid_amount",
        //   label: "оплачено",
        //   rules: {
        //     required: true,
        //     message: "пожалуйста, введите сумму",
        //   },
        //   item: {
        //     name: "Input",
        //     label: "",
        //     placeholder: "пожалуйста, введите сумму",
        //     options: [],
        //     multiple: false,
        //   },
        // },
      ],
    },
    // {
    //   gutter: 16,
    //   items: [
    //     {
    //       span: 24,
    //       name: "image",
    //       label: "изображение",
    //       rules: {
    //         required: true,
    //         message: "пожалуйста, загрузите изображение",
    //       },
    //       item: {
    //         name: "Upload",
    //         label: "Upload",
    //         placeholder: "пожалуйста, загрузите изображение",
    //         options: [],
    //         multiple: false,
    //       },
    //     },
    //   ],
    // },
  ];

  useEffect(() => {
    fetchUsers();
    fetchSTExpenseSubCategories();
    fetchQuests();
  }, []);

  return (
    <TableTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исходные таблицы | расходы"}
      datePicker={true}
      addEntry={true}
      addEntryTitle={"новая запись"}
      fetchFunction={getSTExpenses}
      createFunction={postSTExpense}
      deleteFunction={deleteSTExpense}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новую запись"
      formItems={formItems}
    />
  );
};

export default App;
