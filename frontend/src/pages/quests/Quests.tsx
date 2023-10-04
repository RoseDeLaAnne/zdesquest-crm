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
import { getQuests, postQuest, deleteQuest } from "../../api/APIUtils";

// components
import TableTemplate from "../../components/TableTemplate";

const App: FC = () => {
  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "Ключевое название",
      dataIndex: "latin_name",
      key: "latin_name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "ключевому названию",
      },
      countable: false,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "названию",
      },
      countable: false,
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "адресу",
      },
      countable: false,
    },
    {
      title: "ставка администратора",
      dataIndex: "administrator_rate",
      key: "administrator_rate",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "ставке",
      },
      countable: true,
    },
    {
      title: "ставка актера",
      dataIndex: "actor_rate",
      key: "actor_rate",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "ставке",
      },
      countable: true,
    },
    {
      title: "ставка аниматора",
      dataIndex: "animator_rate",
      key: "animator_rate",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "ставке",
      },
      countable: true,
    },
  ];
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "latin_name",
          label: "ключевое название",
          rules: {
            required: true,
            message: "пожалуйста, введите ключевое название",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите ключевое название",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "name",
          label: "название",
          rules: {
            required: true,
            message: "пожалуйста, введите название",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите название",
            options: [],
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "address",
          label: "адрес",
          rules: {
            required: true,
            message: "пожалуйста, введите адрес",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите адрес",
            options: [],
            multiple: null,
          },
        },
        {
          span: 12,
          name: "rate",
          label: "rate",
          rules: {
            required: true,
            message: "пожалуйста, введите ставку",
          },
          item: {
            name: "Input",
            label: "",
            placeholder: "пожалуйста, введите ставку",
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
      defaultOpenKeys={["quests"]}
      defaultSelectedKeys={["quests"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"квесты"}
      datePicker={false}
      addEntry={true}
      addEntryTitle={"новый квест"}
      fetchFunction={getQuests}
      createFunction={postQuest}
      deleteFunction={deleteQuest}
      initialPackedTableColumns={initialPackedTableColumns}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новый квест"
      formItems={formItems}
    />
  );
};

export default App;
