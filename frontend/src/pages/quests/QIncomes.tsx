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
} from "@ant-design/icons";

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

// components
import TemplateTable from "../../components/template/Table10";

const QIncomesFC: FC = () => {
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
      title: "доходы",
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
      title: "игра",
      dataIndex: "game",
      key: "game",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "комната",
      dataIndex: "room",
      key: "room",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "видео",
      dataIndex: "video",
      key: "video",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "фотомагниты",
      dataIndex: "photomagnets",
      key: "photomagnets",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "актер",
      dataIndex: "actor",
      key: "actor",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "итог",
      dataIndex: "total",
      key: "total",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "уплачено наличными",
      dataIndex: "paid_cash",
      key: "paid_cash",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "уплачено безналичными",
      dataIndex: "paid_non_cash",
      key: "paid_non_cash",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: true,
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
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={false}
      getFunction={getQuestIncomes}
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

export default QIncomesFC;
