// libs
import dayjs from "dayjs";

import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuest, getQuestVersion, getQuests, getQuestsWithSpecVersions, getSTQuest, putQuest, putQuestVersion, putSTQuest } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getQuestsFormItems, getSTQuestFormItems, getSTQuestsFormItems2 } from "../../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/source-tables/quests",
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

  useEffect(() => {
    fetchQuests();
  }, []);

  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState(
    dayjs().day() === 0 || dayjs().day() === 6
  );

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
        setNotVisibleFormItems(["birthday_congr", "video"]);
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
