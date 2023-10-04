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

// api
import {
  getSTExpenseSubCategories,
  getQuests,
  getSTExpenseCategories,
  postSTExpenseCategory,
  deleteSTExpenseCategory,
} from "../../api/APIUtils";

// components
import TableTemplate from "../../components/TableTemplate";

const App: FC = () => {
  const sourceBreadcrumbItems = [
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

  const initialPackedTableColumns = [
    {
      title: "название категории",
      dataIndex: "name",
      key: "name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "названию категории",
      },
      countable: false,
    },
  ];
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 24,
          name: "name",
          label: "название категории",
          rules: {
            required: true,
            message: "пожалуйста, введите название категории",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите название категории",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  useEffect(() => {}, []);

  return (
    <TableTemplate
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseCategories"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"доп. таблицы | категории расходов"}
      datePicker={false}
      addEntry={true}
      addEntryTitle={"новая категория"}
      fetchFunction={getSTExpenseCategories}
      createFunction={postSTExpenseCategory}
      deleteFunction={deleteSTExpenseCategory}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новую категорию"
      formItems={formItems}
    />
  );
};

export default App;
