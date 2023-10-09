import React, { FC } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// api
import {
  getExpensesFromTheir,
  getQuestCashRegister,
  getWorkCardExpenses,
  toggleExpensesFromTheir,
} from "../../api/APIUtils";

// components
import TemplateTable from "../../components/template/Table";

const App: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: "радуга",
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
      icon: FallOutlined,
      title: "расходы со своих",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "доходы",
          to: "/quests/rainbow/incomes",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/quests/rainbow/expenses",
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
      defaultOpenKeys={["quests", "questsРадуга"]}
      defaultSelectedKeys={["questsРадугаIncomes"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={null}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={false}
      getFunction={getExpensesFromTheir}
      deleteFunction={null}
      postFunction={null}
      isUseParams={true}
      isAddEntry={null}
      drawerTitle={null}
      formItems={null}
      notVisibleFormItems={null}
      defaultValuesFormItems={null}
      formHandleOnChange={null}
    />
  );
};

export default App;
