// libs
import dayjs from "dayjs";

import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table1";

// hooks
import useQuestForm from "../../hooks/useQuestForm";

// api
import {
  deleteSTQuest,
  getQuests,
  getQuestsWithSpecVersions,
  getSTQuests,
  postSTQuest,
} from "../../api/APIUtils";

// constants
import { getSTQuestFormItems } from "../../constants";

const STQuests: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
      menu: [
        {
          key: "1",
          icon: TableOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: TableOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
        {
          key: "3",
          icon: TableOutlined,
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "стоимости квеста",
      },
      isCountable: false,
      render: (quest) => {
        if (quest !== null) {
          return <Tag color="black">{quest.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "package",
      dataIndex: "is_package",
      key: "is_package",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (is_package) => {
        let color = "red";
        let formattedIsPackage = "";

        if (is_package === true) {
          color = "green";
          formattedIsPackage = "да";
        } else if (is_package === false) {
          color = "red";
          formattedIsPackage = "нет";
        }

        return <Tag color={color}>{formattedIsPackage}</Tag>;
      },
    },
    {
      title: "is_video_review",
      dataIndex: "is_video_review",
      key: "is_video_review",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (is_video_review) => {
        let color = "red";
        let formattedIsTravel = "";

        if (is_video_review === true) {
          color = "green";
          formattedIsTravel = "да";
        } else if (is_video_review === false) {
          color = "red";
          formattedIsTravel = "нет";
        }

        return <Tag color={color}>{formattedIsTravel}</Tag>;
      },
    },
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      key: "quest_cost",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "стоимости квеста",
      },
      isCountable: true,
    },
    {
      title: "add_players",
      dataIndex: "add_players",
      key: "add_players",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "actor_second_actor",
      dataIndex: "actor_second_actor",
      key: "actor_second_actor",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "discount_sum",
      dataIndex: "discount_sum",
      key: "discount_sum",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "discount_desc",
      dataIndex: "discount_desc",
      key: "discount_desc",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "room_sum",
      dataIndex: "room_sum",
      key: "room_sum",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "room_quantity",
      dataIndex: "room_quantity",
      key: "room_quantity",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "room_employee_name",
      dataIndex: "room_employee_name",
      key: "room_employee_name",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (room_employee_name) => {
        if (room_employee_name !== null) {
          return (
            <Tag color="black">
              {room_employee_name.last_name} {room_employee_name.first_name}{" "}
              {room_employee_name.middle_name
                ? room_employee_name.middle_name
                : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "video",
      dataIndex: "video",
      key: "video",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "photomagnets_quantity",
      dataIndex: "photomagnets_quantity",
      key: "photomagnets_quantity",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "photomagnets_sum",
      dataIndex: "photomagnets_sum",
      key: "photomagnets_sum",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "birthday_congr",
      dataIndex: "birthday_congr",
      key: "birthday_congr",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "easy_work",
      dataIndex: "easy_work",
      key: "easy_work",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "night_game",
      dataIndex: "night_game",
      key: "night_game",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "administrator",
      dataIndex: "administrator",
      key: "administrator",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (administrator) => {
        if (administrator !== null) {
          return (
            <Tag color="black">
              {administrator.last_name} {administrator.first_name}{" "}
              {administrator.middle_name ? administrator.middle_name : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "actors",
      dataIndex: "actors",
      key: "actors",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { actors }) => (
        <>
          {actors.map((actor) => {
            return (
              <Tag color="black" key={actor.id}>
                {actor.last_name} {actor.first_name}{" "}
                {actor.middle_name ? actor.middle_name : ""}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "actors_half",
      dataIndex: "actors_half",
      key: "actors_half",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { actors_half }) => (
        <>
          {actors_half.map((actor_half) => {
            return (
              <Tag color="black" key={actor_half.id}>
                {actor_half.last_name} {actor_half.first_name}{" "}
                {actor_half.middle_name ? actor_half.middle_name : ""}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "animator",
      dataIndex: "animator",
      key: "animator",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (animator) => {
        if (animator !== null) {
          return (
            <Tag color="black">
              {animator.last_name} {animator.first_name}{" "}
              {animator.middle_name ? animator.middle_name : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "cash_payment",
      dataIndex: "cash_payment",
      key: "cash_payment",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "cashless_payment",
      dataIndex: "cashless_payment",
      key: "cashless_payment",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "cash_delivery",
      dataIndex: "cash_delivery",
      key: "cash_delivery",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "cashless_delivery",
      dataIndex: "cashless_delivery",
      key: "cashless_delivery",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "prepayment",
      dataIndex: "prepayment",
      key: "prepayment",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "created_by",
      dataIndex: "created_by",
      key: "created_by",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (created_by) => {
        if (created_by !== null) {
          return (
            <Tag color="black">
              {created_by.last_name} {created_by.first_name}{" "}
              {created_by.middle_name ? created_by.middle_name : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTQuestFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await getQuestsWithSpecVersions();
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

  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(dayjs().day() === 0 || dayjs().day() === 6);

  const [quests, setQuests] = useState([]);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState([]);
  const [titlesFormItems, setTitlesFormItems] = useState({});
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});

  const formHandleOnChange = (value, name) => {
    if (name === "quest") {
      const quest = quests.find((el) => el.id === value);
      setSelectedQuest(quest);

      if (isWeekend) {
        if (isPackage) {
          setDefaultValuesFormItems({
            quest_cost: quest.cost_weekends_with_package,
          });
        } else {
          setDefaultValuesFormItems({
            quest_cost: quest.cost_weekends,
          });
        }
      } else {
        if (isPackage) {
          setDefaultValuesFormItems({
            quest_cost: quest.cost_weekdays_with_package,
          });
        } else {
          setDefaultValuesFormItems({
            quest_cost: quest.cost_weekdays,
          });
        }
      }
    }
    if (name === "is_package") {
      setIsPackage(value.target.checked);

      if (value.target.checked) {
        setNotVisibleFormItems(['birthday_congr', 'video']);
      } else {
        setNotVisibleFormItems([]);
      }

      if (selectedQuest !== null && selectedQuest !== undefined) {
        if (isWeekend) {
          if (value.target.checked) {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekends_with_package,
            });
          } else {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekends,
            });
          }
        } else {
          if (value.target.checked) {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekdays_with_package,
            });
          } else {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekdays,
            });
          }
        }
      }
    }
    if (name === "date") {
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();
      if (selectedQuest !== null && selectedQuest !== undefined) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setIsWeekend(true);

          if (isPackage) {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekends_with_package,
            });
          } else {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekends,
            });
          }
        } else {
          setIsWeekend(false);

          if (isPackage) {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekdays_with_package,
            });
          } else {
            setDefaultValuesFormItems({
              quest_cost: selectedQuest.cost_weekdays,
            });
          }
        }
      }
    }
  };

  return (
    <TemplateTable
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={"новая запись"}
      isCancel={false}
      isCreate={false}
      tableScroll={5000}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getSTQuests}
      deleteFunction={deleteSTQuest}
      postFunction={postSTQuest}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STQuests;
