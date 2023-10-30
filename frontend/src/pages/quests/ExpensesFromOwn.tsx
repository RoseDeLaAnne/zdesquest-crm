import { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Tag } from "antd";
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
  getExpensesFromOwn,
  getQuestCashRegister,
  getQuests,
  getWorkCardExpenses,
  toggleExpensesFromTheir,
} from "../../api/APIUtils";

const QExpensesFromOwnFC: FC = () => {
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
      title: "расходы со своих",
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
          label: "расходы с рабочей карты",
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
      title: "сумма",
      dataIndex: "amount",
      key: "amount",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "сумме",
      },
      countable: true,
    },
    {
      title: "описание",
      dataIndex: "description",
      key: "description",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "описанию",
      },
      countable: false,
    },
    {
      title: "оплатил",
      dataIndex: "who_paid",
      key: "who_paid",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "оплатил",
      },
      countable: false,
      render: (user) => {
        return (
          <Tag color="black">
            {user.first_name} {user.last_name}
          </Tag>
        );
      },
    },
    {
      title: "статус",
      dataIndex: "status",
      key: "статус",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "статусу",
      },
      countable: false,
      render: (status) => {
        let color = "red";
        let formattedStatus = status;

        if (status === "paid") {
          color = "green";
          formattedStatus = "выплачено";
        } else if (status === "not_paid") {
          color = "red";
          formattedStatus = "не выплачено";
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}ExpensesFromOwn`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getExpensesFromOwn}
      isUseParams={true}
    />
  );
};

export default QExpensesFromOwnFC;
