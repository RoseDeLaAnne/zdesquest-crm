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
import { getQuests, postQuest, deleteQuest, getQuestVersions, deleteQuestVersion, postQuestVersion } from "../../api/APIUtils";

// components
import TemplateTable from "../../components/template/Table";

import { getQuestVersionsFormItems } from "../../constants";

const ATQuestVersions: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "версии квестов",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "название",
      dataIndex: "name",
      key: "name",
      isSorting: false,
      searching: {
        isSearching: false,
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
      isCountable: false,
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
      isCountable: false,
    },
  ];

  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getQuestVersionsFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesQuestVersions"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={false}
      addEntryTitle={"новая версия квеста"}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={null}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getQuestVersions}
      deleteFunction={deleteQuestVersion}
      postFunction={postQuestVersion}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новую версию квеста"}
      formItems={formItems}
      notVisibleFormItems={null}
      defaultValuesFormItems={null}
      formHandleOnChange={null}
    />
  );
};

export default ATQuestVersions;
