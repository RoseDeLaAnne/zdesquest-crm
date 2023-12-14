import React, { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
  RiseOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  getQuestExpenses,
  getQuests,
} from "../../api/APIUtils";

const QExpensesFC: FC = () => {
  const { id } = useParams();

  const [currentQuest, setCurrentQuest] = useState({})
  const [quests, setQuests] = useState([])
  const fetchQuests = async () => {
    const res = await getQuests()
    if (res.status === 200) {
      setCurrentQuest(res.data.find(el => el.id === parseInt(id)))
      setQuests(res.data)
    }
  }
  useEffect(() => {
    fetchQuests()
  }, [])

  const initialBreadcrumbItems = [
    {
      icon: QuestionOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: currentQuest.name ? currentQuest.name.toLowerCase() : '',
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
      title: "расходы",
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
          icon: MoneyCollectOutlined,
          label: "касса",
          to: `/quests/${id}/cash-register`,
        },
        {
          key: "4",
          icon: FallOutlined,
          label: "расходы с раб. карты",
          to: `/quests/${id}/work-card-expenses`,
        },
        {
          key: "5",
          icon: FallOutlined,
          label: "расходы со своих",
          to: `/quests/${id}/expenses-from-own`,
        },
        {
          key: "6",
          icon: VideoCameraOutlined,
          label: "видео",
          to: `/quests/${id}/videos`,
        },
      ],
    },
  ];

  // const initialPackedTableColumns = [
  //   {
  //     title: "дата",
  //     dataIndex: "date",
  //     key: "date",
  //     sorting: {
  //       isSorting: true,
  //       isDate: true,
  //     },
  //     searching: {
  //       isSearching: true,
  //       title: "",
  //     },
  //     countable: false,
  //     width: 140,
  //   },
  // ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}Expenses`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      // initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getQuestExpenses}
      isUseParams={true}
      tableIsObj={true}
    />
  );
};

export default QExpensesFC;
