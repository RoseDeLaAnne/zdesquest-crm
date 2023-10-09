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
  getQuestCashRegister,
  toggleQuestCashRegister,
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
      title: "касса",
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
        {
          key: "3",
          icon: FallOutlined,
          label: "касса",
          to: "/quests/rainbow/cash-register",
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
      isSorting: true,
      searching: {
        isSearching: true,
        title: "описанию",
      },
      countable: false,
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

        if (status === "reset") {
          color = "green";
          formattedStatus = "обнулено";
        } else if (status === "not_reset") {
          color = "red";
          formattedStatus = `не обнулено`;
        }

        return <Tag color={color}>{formattedStatus}</Tag>;
      },
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", "questsРадуга"]}
      defaultSelectedKeys={["questsРадугаCashRegister"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={null}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={false}
      getFunction={getQuestCashRegister}
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
