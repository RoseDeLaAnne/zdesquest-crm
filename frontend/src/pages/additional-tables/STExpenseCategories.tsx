import React, { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  getSTExpenseSubCategories,
  getQuests,
  getSTExpenseCategories,
  postSTExpenseCategory,
  deleteSTExpenseCategory,
} from "../../api/APIUtils";

const STExpenseCategoriesFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "категории расходов",
    },
  ];

  // const initialPackedTableColumns = [
  //   {
  //     title: "название категории",
  //     dataIndex: "name",
  //     key: "name",
  //     sorting: {
  //       isSorting: true,
  //       isDate: false,
  //     },
  //     searching: {
  //       isSearching: true,
  //       title: "названию категории",
  //     },
  //     countable: false,
  //   },
  // ];
  // const formItems = [
  //   {
  //     gutter: 16,
  //     items: [
  //       {
  //         span: 24,
  //         name: "name",
  //         label: "название категории",
  //         rules: {
  //           required: true,
  //           message: "пожалуйста, введите название категории",
  //         },
  //         item: {
  //           name: "Input",
  //           label: "",
  //           placeholder: "пожалуйста, введите название категории",
  //           options: [],
  //           multiple: null,
  //         },
  //       },
  //     ],
  //   },
  // ];

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date_time"}
      // initialPackedTableColumns={initialPackedTableColumns}
      // getFunction={getQuestIncomes}
    />
  );
};

export default STExpenseCategoriesFC;
