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
  getSTQuests,
  postSTQuest,
  deleteSTQuest,
} from "../api/APIUtils";

// components
import TableTemplate from "../components/TableTemplate";

const App: FC = () => {
  const [optionsUsers, setOptionsUsers] =
    useState([]);
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
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "дата/время",
      dataIndex: "date_time",
      key: "date_time",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      width: 112,
      // fixed: "left",
    },
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      filters: filtersQuests,
      onFilter: (value: string, record) =>
        record.quest.startsWith(value),
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
      render: (quest) => <Tag color="orange">{quest}</Tag>,
    },
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      key: "quest_cost",
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
      title: "дополнительные игороки",
      dataIndex: "add_players",
      key: "add_players",
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
      title: "актеры/второй актер",
      dataIndex: "actor_second_actor",
      key: "actor_second_actor",
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
      title: "сумма скидки",
      dataIndex: "discount_sum",
      key: "discount_sum",
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
      title: "описание скидки",
      dataIndex: "discount_desc",
      key: "discount_desc",
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
      title: "сумма комнат",
      dataIndex: "room_sum",
      key: "room_sum",
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
      title: "количество комнат",
      dataIndex: "room_quantity",
      key: "room_quantity",
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
      title: "сотрудник комнаты",
      dataIndex: "room_employee_name",
      key: "room_employee_name",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
    },
    {
      title: "сумма видео",
      dataIndex: "video",
      key: "video",
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
      title: "сумма фотомагнитов",
      dataIndex: "photomagnets_sum",
      key: "photomagnets_sum",
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
      title: "количество фотомагнитов",
      dataIndex: "photomagnets_quantity",
      key: "photomagnets_quantity",
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
      title: "поздравление именинника",
      dataIndex: "birthday_congr",
      key: "birthday_congr",
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
      title: "сумма простоя",
      dataIndex: "easy_work",
      key: "easy_work",
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
      title: "сумма ночной игры",
      dataIndex: "night_game",
      key: "night_game",
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
      title: "администратор",
      dataIndex: "administrator",
      key: "administrator",
      filters: filtersUsers,
      onFilter: (value: string, record) =>
        record.administrator.startsWith(value),
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
      render: (user) => <Tag color="black">{user}</Tag>,
    },
    {
      title: "актеры",
      dataIndex: "actor",
      key: "actor",
      filters: filtersUsers,
      onFilter: (value, record) => record.actors.includes(value),
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
      render: (_, { actors }) => (
        <>
          {actors.map((actor) => {
            return (
              <Tag color="black" key={actor}>
                {actor}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "аниматор",
      dataIndex: "animator",
      key: "animator",
      filters: filtersUsers,
      onFilter: (value: string, record) =>
        record.animator.startsWith(value),
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
      render: (user) => <Tag color="black">{user}</Tag>,
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
    <TableTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исходные таблицы | квесты"}
      datePicker={true}
      addEntry={true}
      addEntryTitle={"новая запись"}
      fetchFunction={getSTQuests}
      createFunction={postSTQuest}
      deleteFunction={deleteSTQuest}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={{ x: 4500 }}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новую запись"
      formItems={formItems}
    />
  );
};

export default App;
