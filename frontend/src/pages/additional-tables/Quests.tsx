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
  getQuests,
  postQuest,
  deleteQuest,
  getQuestsWithSpecVersions,
} from "../../api/APIUtils";

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
      icon: QuestionOutlined,
      title: "квесты",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "название",
      dataIndex: "name",
      sorting: true,
      searching: "",
    },
    {
      title: "адрес",
      dataIndex: "address",
      sorting: true,
      searching: "",
    },
    {
      title: "стоимость квеста в будние дни",
      dataIndex: "cost_weekdays",
      sorting: true,
      searching: "",
    },
    {
      title: "стоимость квеста в выходные дни",
      dataIndex: "cost_weekends",
      sorting: true,
      searching: "",
    },
    {
      title: "стоимость квеста в будние дни (пакет)",
      dataIndex: "cost_weekdays_with_package",
      sorting: true,
      searching: "",
    },
    {
      title: "стоимость квеста в выходные дни (пакет)",
      dataIndex: "cost_weekends_with_package",
      sorting: true,
      searching: "",
    },
    {
      title: "ставка администратора",
      dataIndex: "administrator_rate",
      sorting: true,
      searching: "",
    },
    {
      title: "ставка актера",
      dataIndex: "actor_rate",
      sorting: true,
      searching: "",
    },
    {
      title: "ставка аниматора",
      dataIndex: "animator_rate",
      sorting: true,
      searching: "",
    },
    {
      title: "специальные версии",
      dataIndex: "special_versions",

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
      dataIndex: "duration_in_minute",
      sorting: true,
      searching: "",
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
      tableScroll={{ x: 1750 }}
      tableDateColumn={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      operationIsEdit={true}
      operationIsDelete={true}
      getFunction={getQuestsWithSpecVersions}
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
