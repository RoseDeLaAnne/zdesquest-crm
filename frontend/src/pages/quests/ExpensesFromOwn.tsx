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
  toggleExpensesFromOwn,
  toggleExpensesFromTheir,
} from "../../api/APIUtils";
import {
  pullOfDatesDefaultGeneral,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOptionsGeneral,
  pullOfDatesWhenLoadingGeneral,
} from "../../constants";

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
        if (user !== null) {
          return (
            <Tag color="black">
              {user.first_name} {user.last_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "номер телефона для перевода",
      dataIndex: "phone_number_for_transfer",
      sorting: true,
      searching: "номеру телефона для перевода",
      width: 280,
    },
    {
      title: "банк",
      dataIndex: "bank",
      sorting: true,
      searching: "банку",
      width: 120,
      render: (bank) => {
        if (bank !== null) {
          let color = "black";
          let formattedText = "";

          if (bank === "sberbank") {
            color = "green";
            formattedText = "сбербанк";
          } else if (bank === "tinkoff") {
            color = "yellow";
            formattedText = "тинькофф";
          } else if (bank === "alfabank") {
            color = "red";
            formattedText = "альфа-банк";
          } else if (bank === "vtb") {
            color = "blue";
            formattedText = "втб";
          }
          return <Tag color={color}>{formattedText}</Tag>;
        } else {
          return null;
        }
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
        if (status !== null) {
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
        } else {
          return null;
        }
      },
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}ExpensesFromOwn`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getExpensesFromOwn}
      toggleFunction={toggleExpensesFromOwn}
      tableScroll={{ x: 1000, y: 600 }}
      isUseParams={true}
      tableIsOperation={"toggle"}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultGeneral}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingGeneral}
      pullOfDatesOptions={pullOfDatesOptionsGeneral}
    />
  );
};

export default QExpensesFromOwnFC;
