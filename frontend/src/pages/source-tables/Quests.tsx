// libs
import dayjs from "dayjs";

import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  TableOutlined,
  QuestionOutlined,
  FallOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  deleteSTQuest,
  getCurrentUser,
  getQuests,
  getQuestsWithSpecVersions,
  getSTQuests,
  getUserSTQuests,
  postSTQuest,
  putSTQuest,
} from "../../api/APIUtils";

// constants
import { getSTQuestFormItems, getSTQuestsFormItems2 } from "../../constants";

const STQuestsFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
    },
    {
      icon: QuestionOutlined,
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
        // {
        //   key: "3",
        //   icon: DeploymentUnitOutlined,
        //   label: "бонусы/штрафы",
        //   to: "/source-tables/bonuses-penalties",
        // },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "квест",
      dataIndex: "quest",
      render: (quest) => {
        if (quest == 'Итого за день') {
        return (
          <Tag bordered={false} color="orange">
            {quest}
          </Tag>
        );
        } else {
          if (quest !== null) {
            return <Tag color="black">{quest.name}</Tag>;
          } else {
            return null;
          }
        }
      },
      // render: (quest) => {
      //   if (quest !== null) {
      //     return <Tag color="black">{quest.name}</Tag>;
      //   } else {
      //     return null;
      //   }
      // },
      // filters: [
      //   { text: 'детский сад радуга', value: 'детский сад радуга' },
      //   { text: 'тьма', value: 'тьма' },
      // ],
      // onFilter: (value, record) => {
      //   // record.children.map
      //   {record.children.map.map((children2) => {
      //     console.log(children2)
      //     return children2
      //   })}
      //   // return value
      // },
      minWidth: 256,
    },
    {
      title: "пакет",
      dataIndex: "is_package",
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
      title: "видео отзыв",
      dataIndex: "is_video_review",
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
      title: "видео в подарок",
      dataIndex: "video_as_a_gift",
      render: (video_as_a_gift) => {
        let color = "red";
        let formattedIsTravel = "";

        if (video_as_a_gift === true) {
          color = "green";
          formattedIsTravel = "да";
        } else if (video_as_a_gift === false) {
          color = "red";
          formattedIsTravel = "нет";
        }

        return <Tag color={color}>{formattedIsTravel}</Tag>;
      },
    },
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      sorting: true,
      searching: "стоимости квеста",
      countable: true,
    },
    {
      title: "имя клиента",
      dataIndex: "client_name",
    },
    {
      title: "администратор",
      dataIndex: "administrator",
      render: (administrator) => {
        if (administrator !== null) {
          return (
            <Tag color="black">
              {administrator.last_name} {administrator.first_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "актеры",
      dataIndex: "actors",
      render: (_, { actors }) => (
        <>
          {actors.map((actor) => {
            return (
              <Tag color="black" key={actor.id}>
                {actor.last_name} {actor.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "наличный расчет",
      dataIndex: "cash_payment",
      countable: true,
    },
    {
      title: "безналичный расчет",
      dataIndex: "cashless_payment",
      countable: true,
    },
    {
      title: "сдача наличными",
      dataIndex: "cash_delivery",
      countable: true,
    },
    {
      title: "сдача безналичными",
      dataIndex: "cashless_delivery",
      countable: true,
    },
    {
      title: "предоплата",
      dataIndex: "prepayment",
      countable: true,
    },
    {
      title: "сотрудник комнаты",
      dataIndex: "room_employee_name",
      render: (room_employee_name) => {
        if (room_employee_name !== null) {
          return (
            <Tag color="black">
              {room_employee_name.last_name} {room_employee_name.first_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "аниматор",
      dataIndex: "animator",
      render: (animator) => {
        if (animator !== null) {
          return (
            <Tag color="black">
              {animator.last_name} {animator.first_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    
    {
      title: "актеры/второй актер/аниматор",
      dataIndex: "actor_or_second_actor_or_animator",
      countable: true,
    },
    {
      title: "дополнительные игроки",
      dataIndex: "add_players",
    },
    {
      title: "сумма комнат",
      dataIndex: "room_sum",
      countable: true,
    },
    {
      title: "сумма видео",
      dataIndex: "video",
      countable: true,
    },
    {
      title: "видео после",
      dataIndex: "video_after",
      countable: true,
    },
    {
      title: "ночная игра",
      dataIndex: "night_game",
      countable: true,
    },
    {
      title: "простой",
      dataIndex: "easy_work",
      countable: true,
    },
    {
      title: "поздравление именинника",
      dataIndex: "birthday_congr",
      countable: true,
    },
    {
      title: "количество фотомагнитов",
      dataIndex: "photomagnets_quantity",
      countable: true,
    },
    {
      title: "сумма скидки",
      dataIndex: "discount_sum",
      countable: true,
    },
    {
      title: "описание скидки",
      dataIndex: "discount_desc",
    },
    {
      title: "актеры (50%)",
      dataIndex: "actors_half",
      render: (_, { actors_half }) => (
        <>
          {actors_half.map((actor_half) => {
            return (
              <Tag color="black" key={actor_half.id}>
                {actor_half.last_name} {actor_half.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "администраторы (50%)",
      dataIndex: "administrators_half",
      render: (_, { administrators_half }) => (
        <>
          {administrators_half.map((administrator_half) => {
            return (
              <Tag color="black" key={administrator_half.id}>
                {administrator_half.last_name} {administrator_half.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "сотрудники, которые играют в первый раз",
      dataIndex: "employees_first_time",
      render: (_, { employees_first_time }) => (
        <>
          {employees_first_time.map((employee_first_time) => {
            return (
              <Tag color="black" key={employee_first_time.id}>
                {employee_first_time.last_name} {employee_first_time.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTQuestFormItems();
    setFormItems(res);
  };
  const [formItems2, setFormItems2] = useState([]);
  const getFormItems2 = async () => {
    const res = await getSTQuestsFormItems2();
    setFormItems2(res);
  };
  useEffect(() => {
    getFormItems();
    getFormItems2();
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

  const [userId, setUserId] = useState([]);
  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    const res = await getCurrentUser();
    if (res.status === 200) {
      setUser(res.data);      
    }
  };

  useEffect(() => {
    fetchQuests();
    fetchUser();
  }, []);

  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(
    dayjs().day() === 0 || dayjs().day() === 6
  );

  // const [time, setTime] = useState(dayjs().hour(dayjs().hour()).startOf("hour"))
  // const [prepayment, setPrepayment] = useState(500)

  const [quests, setQuests] = useState([]);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState([]);
  const [titlesFormItems, setTitlesFormItems] = useState({});
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});

  const formHandleOnSelect = (value, name) => {
    // setPrepayment(1000)
  }

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
    
    if (name === "is_video_review" || name === 'video_as_a_gift') {
      if (value.target.checked) {
        setNotVisibleFormItems(["video"]);
      } else {
        setNotVisibleFormItems([]);
      }
    }

    if (name === "is_package") {
      setIsPackage(value.target.checked);

      if (value.target.checked) {
        // setNotVisibleFormItems(["birthday_congr", "video"]);
        setNotVisibleFormItems(["video"]);
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

  const formHandleOnSearch = (value: string, name: string) => {}

  const formInitialValues = {
    date: dayjs(),
    time: dayjs().hour(dayjs().hour()).startOf("hour"),
    prepayment: 500,
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
      tableScroll={{ x: 6000, y: 600 }}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getSTQuests}
      deleteFunction={deleteSTQuest}
      postFunction={postSTQuest}
      putFunction={putSTQuest}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      formItems2={formItems2}
      titlesFormItems={titlesFormItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formHandleOnSelect={formHandleOnSelect}
      formHandleOnChange={formHandleOnChange}
      formHandleOnSearch={formHandleOnSearch}
      formInitialValues={formInitialValues}
      operationIsAdd={true}
      operationIsEdit={user.is_superuser ? true : false}
      operationIsDelete={user.is_superuser ? true : false}
    />
  );
};

export default STQuestsFC;
