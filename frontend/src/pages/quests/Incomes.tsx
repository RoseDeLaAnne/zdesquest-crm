import { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Tag, Tooltip } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  RiseOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  getQuests,
  getUsers,
  postSTExpense,
  getSTBonus,
  getSTBonuses,
  postSTBonus,
  deleteSTBonus,
  getQuestIncomes,
} from "../../api/APIUtils";
import {
  pullOfDatesDefaultGeneral,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOptionsGeneral,
  pullOfDatesWhenLoadingGeneral,
} from "../../constants";

const QIncomesFC: FC = () => {
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
      title: "доходы",
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

  const initialPackedTableColumns = [
    {
      title: "игра",
      dataIndex: "game",
      render: (game) => {
        if (game.tooltip !== "") {
          return (
            <Tooltip
              title={<div dangerouslySetInnerHTML={{ __html: game.tooltip }} />}
              placement="topLeft"
            >
              <div>{game.value}</div>
            </Tooltip>
          );
        } else {
          return <div>{game.value}</div>;
        }
      },
    },
    {
      title: "комната",
      dataIndex: "room",
      countable: true,
    },
    {
      title: "видео",
      dataIndex: "video",
      countable: true,
    },
    {
      title: "видео после",
      dataIndex: "video_after",
      countable: true,
    },
    {
      title: "фотомагниты",
      dataIndex: "photomagnets",
      countable: true,
    },
    {
      title: "актер/второй актер/аниматор",
      dataIndex: "actor",
      countable: true,
    },
    {
      title: "итог",
      dataIndex: "total",
      countable: true,
      inSum: true,
    },
    {
      title: "заплачено наличными",
      dataIndex: "paid_cash",
      countable: true,
    },
    {
      title: "заплачено безналичными",
      dataIndex: "paid_non_cash",
      countable: true,
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}Incomes`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getQuestIncomes}
      isUseParams={true}
      isPullOfDates={true}
      tableScroll={{ x: 1000, y: 600 }}
      pullOfDatesDefaultValue={pullOfDatesDefaultGeneral}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingGeneral}
      pullOfDatesOptions={pullOfDatesOptionsGeneral}
    />
  );
};

export default QIncomesFC;
