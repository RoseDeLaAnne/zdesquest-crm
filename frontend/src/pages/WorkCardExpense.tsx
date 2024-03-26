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
import TemplateTable from "../components/template/Table";

// api
import {
  getExpensesFromOwn,
  getExpensesFromOwnAll,
  getQuestCashRegister,
  getQuests,
  getWorkCardExpenses,
  getWorkCardExpensesAll,
  toggleExpensesFromOwn,
} from "../api/APIUtils";
import {
  pullOfDatesDefaultGeneral,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOptionsGeneral,
  pullOfDatesWhenLoadingGeneral,
} from "../constants";

const ExpensesFromOwnFC: FC = () => {
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
      icon: RiseOutlined,
      title: "расходы с рабочей карты",
      // menu: [
      //   {
      //     key: "1",
      //     icon: RiseOutlined,
      //     label: "доходы",
      //     to: `/quests/${id}/incomes`,
      //   },
      //   {
      //     key: "2",
      //     icon: FallOutlined,
      //     label: "расходы",
      //     to: `/quests/${id}/expenses`,
      //   },
      //   {
      //     key: "3",
      //     icon: MoneyCollectOutlined,
      //     label: "касса",
      //     to: `/quests/${id}/cash-register`,
      //   },
      //   {
      //     key: "4",
      //     icon: FallOutlined,
      //     label: "расходы с рабочей карты",
      //     to: `/quests/${id}/work-card-expenses`,
      //   },
      //   {
      //     key: "5",
      //     icon: FallOutlined,
      //     label: "расходы со своих",
      //     to: `/quests/${id}/expenses-from-own`,
      //   },
      //   {
      //     key: "6",
      //     icon: VideoCameraOutlined,
      //     label: "видео",
      //     to: `/quests/${id}/videos`,
      //   },
      // ],
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
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "quest",
      },
      countable: false,
      render: (quest) => {
        if (quest !== null) {
          return <Tag color="black">{quest.name}</Tag>;
        } else {
          return null;
        }
      },
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
      title: "создатель",
      dataIndex: "created_by",
      render: (created_by) => {
        if (created_by !== "") {
          return <Tag color="black">{created_by}</Tag>;
        } else {
          return null;
        }
      },
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["workCardExpenses"]}
      defaultSelectedKeys={[`workCardExpenses`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getWorkCardExpensesAll}
      tableScroll={{ x: 1000, y: 600 }}
      isUseParams={true}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultGeneral}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingGeneral}
      pullOfDatesOptions={pullOfDatesOptionsGeneral}
    />
  );
};

export default ExpensesFromOwnFC;
