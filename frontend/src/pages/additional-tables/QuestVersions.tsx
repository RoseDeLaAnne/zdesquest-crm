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
      icon: QuestionOutlined,
      title: "версии квестов",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "название",
      dataIndex: "name",
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
      operationIsDelete={true}
      operationIsEdit={true}
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
