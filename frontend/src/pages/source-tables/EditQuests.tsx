import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuest, getQuestVersion, getQuests, getSTQuest, putQuest, putQuestVersion, putSTQuest } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getQuestsFormItems, getSTQuestFormItems } from "../../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/additional-tables/quests",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
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

  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState({});
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(null);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState([]);
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});

  const formHandleOnChange = (value, name) => {
    if (name === "quest") {
      const quest = quests.find((el) => el.id === value);

      setSelectedQuest(quest);

      if (isPackage === false) {
        switch (quest.name) {
          case "ДСР":
            setNotVisibleFormItems([""]);
            break;
          case "У57":
            setNotVisibleFormItems([""]);
            break;
          case "Тьма":
            setNotVisibleFormItems(["actor_second_actor"]);
            break;
          case "ДМ":
            setNotVisibleFormItems(["animator"]);
            break;
          case "Они":
            setNotVisibleFormItems(["actor_second_actor"]);
            break;
          case "ОСК":
            setNotVisibleFormItems(["animator"]);
            break;
          case "Логово Ведьмы":
            setNotVisibleFormItems(["animator"]);
            break;
          default:
            setNotVisibleFormItems([]);
            break;
        }
  
        if (quest.address === 'Афанасьева, 13') {
          setNotVisibleFormItems(['photomagnets_quantity']);
        }
      }

      if (isWeekend === true) {
        setDefaultValuesFormItems({
          quest_cost: selectedQuest.cost_weekends,
        });
      } else if (isWeekend === false) {
        setDefaultValuesFormItems({
          quest_cost: selectedQuest.cost_weekdays,
        });
      }
    } else if (name === "is_package") {
      setIsPackage(value.target.checked)
      if (value.target.checked) {
        const names = formItems.reduce((accumulator, currentGroup) => {
          currentGroup.items.forEach((item) => {
            accumulator.push(item.name);
          });
          return accumulator;
        }, []);
        const visibleNames = [
          "quest",
          "is_package",
          "is_video_review",
          "date",
          "time",
          "quest_cost",
          "administrator"
        ];
        const filteredArray = names.filter(
          (item) => !visibleNames.includes(item)
        );
        setNotVisibleFormItems(filteredArray);
      } else {
        setNotVisibleFormItems([]);
      }
    } else if (name === "date") {
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();
      if (Object.keys(selectedQuest).length !== 0) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setIsWeekend(true)
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekends,
          });
        } else {
          setIsWeekend(false)
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekdays,
          });
        }
      }
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await getQuests();
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

  return (
    <TemplateEdit
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getSTQuest}
      putFunction={putSTQuest}
      isUseParams={true}
      formItems={formItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default EditUsersFC;
