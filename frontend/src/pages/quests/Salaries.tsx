import React, { FC, useEffect, useState } from "react";

// antd | icons
import { DollarOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  RiseOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";


// api
import { getQuestSalaries, getQuests } from "../../api/APIUtils";
import { useParams } from "react-router-dom";
import { pullOfDatesDefaultGeneral, pullOfDatesDefaultValue, pullOfDatesOptions, pullOfDatesOptionsGeneral } from "../../constants";

const SalariesFC: FC = () => {
  const { id } = useParams();

  const [currentQuest, setCurrentQuest] = useState({});
  const [quests, setQuests] = useState([]);
  const fetchQuests = async () => {
    const res = await getQuests();
    if (res.status === 200) {
      setCurrentQuest(res.data.find((el) => el.id === parseInt(id)));
      setQuests(res.data);
    }
  };
  useEffect(() => {
    fetchQuests();
  }, []);

  const initialBreadcrumbItems = [
    {
      icon: QuestionOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: currentQuest.name ? currentQuest.name.toLowerCase() : "",
      menu: [
        {
          key: "1",
          icon: FallOutlined,
          label: "радуга",
          to: "/quests/rainbow",
        },
      ],
    },
    {
      icon: RiseOutlined,
      title: "зарплаты",
      menu: [
        {
          key: "1",
          icon: RiseOutlined,
          label: "доходы",
          to: `/quests/${id}/incomes`,
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: `/quests/${id}/expenses`,
        },
        {
          key: "3",
          icon: FallOutlined,
          label: "зарплаты",
          to: `/quests/${id}/salaries`,
        },
        {
          key: "4",
          icon: MoneyCollectOutlined,
          label: "касса",
          to: `/quests/${id}/cash-register`,
        },
        {
          key: "5",
          icon: FallOutlined,
          label: "расходы с рабочей карты",
          to: `/quests/${id}/work-card-expenses`,
        },
        {
          key: "6",
          icon: FallOutlined,
          label: "расходы со своих",
          to: `/quests/${id}/expenses-from-own`,
        },
        {
          key: "7",
          icon: VideoCameraOutlined,
          label: "видео",
          to: `/quests/${id}/videos`,
        },
      ],
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}Salaries`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      getFunction={getQuestSalaries}
      isUseParams={true}
      tableScroll={{ x: 1000 }}
      tableIsObj={true}
      isExport={true}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultValue}
      pullOfDatesOptions={pullOfDatesOptions}
    />
  );
};

export default SalariesFC;
