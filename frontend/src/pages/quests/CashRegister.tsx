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
  getQuestCashRegister,
  getQuests,
  postQCashRegister,
  toggleQuestCashRegister,
} from "../../api/APIUtils";
import {
  getCashRegisterFormItems,
  pullOfDatesDefaultGeneral,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOptionsGeneral,
  pullOfDatesWhenLoadingGeneral,
} from "../../constants";

const QCashRegisterFC: FC = () => {
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
      title: "касса",
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
      title: "сумма",
      dataIndex: "amount",
      sorting: true,
      searching: "сумме",
      countable: true,
      render: (amount) => {
        let color = "black";
        let formattedStatus = amount;

        if (amount < 0) {
          color = "red";
        } else if (amount > 0) {
          formattedStatus = `+${amount}`;
          color = "green";
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
    {
      title: "описание",
      dataIndex: "description",
      key: "description",
      sorting: true,
      searching: "описанию",
    },
    // {
    //   title: "статус",
    //   dataIndex: "status",
    //   key: "статус",
    //   isSorting: false,
    //   searching: {
    //     isSearching: false,
    //     title: "статусу",
    //   },
    //   countable: false,
    //   render: (status) => {
    //     let color = "red";
    //     let formattedStatus = status;

    //     if (status === "reset") {
    //       color = "green";
    //       formattedStatus = "обнулено";
    //     } else if (status === "not_reset") {
    //       color = "red";
    //       formattedStatus = `не обнулено`;
    //     }

    //     return <Tag color={color}>{formattedStatus}</Tag>;
    //   },
    // },
  ];

  const formHandleOnChange = () => {};

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getCashRegisterFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}CashRegister`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getQuestCashRegister}
      postFunction={postQCashRegister}
      isUseParams={true}
      isAddEntry={true}
      tableScroll={{ x: 1000, y: 600 }}
      addEntryTitle={"новая запись"}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultGeneral}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingGeneral}
      pullOfDatesOptions={pullOfDatesOptionsGeneral}
    />
  );
};

export default QCashRegisterFC;
