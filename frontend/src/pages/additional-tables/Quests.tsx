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
import TemplateTable from "../../components/template/Table";

import { getQuestsFormItems } from "../../constants";

const ATQuests: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "название",
      dataIndex: "name",
      key: "name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "адрес",
      dataIndex: "address",
      key: "address",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "стоимость квеста в будние дни",
      dataIndex: "cost_weekdays",
      key: "cost_weekdays",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "стоимость квеста в выходные дни",
      dataIndex: "cost_weekends",
      key: "cost_weekends",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "ставка актера",
      dataIndex: "actor_rate",
      key: "actor_rate",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "ставка аниматора",
      dataIndex: "animator_rate",
      key: "animator_rate",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
    },
    {
      title: "специальные версии",
      dataIndex: "special_versions",
      key: "special_versions",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { special_versions }) => (
        <>
          {special_versions.map((special_version) => {
            return (
              <Tag color="orange" key={special_version.id}>
                {special_version.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "версии",
      dataIndex: "versions",
      key: "versions",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { versions }) => (
        <>
          {versions.map((version) => {
            return (
              <Tag color="red" key={version.id}>
                {version.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "продолжительность квеста в минутах",
      dataIndex: "duration_minute",
      key: "duration_minute",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getQuestsFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesQuests"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={false}
      addEntryTitle={"новый квест"}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getQuests}
      deleteFunction={deleteQuest}
      postFunction={postQuest}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новый квест"}
      formItems={formItems}
      notVisibleFormItems={null}
      defaultValuesFormItems={null}
      formHandleOnChange={null}
    />
  );
};

export default ATQuests;
