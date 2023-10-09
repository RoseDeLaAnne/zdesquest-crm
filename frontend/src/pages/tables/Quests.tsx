import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import { deleteSTQuest, getSTQuests, getUserSTQuests, postSTQuest } from "../../api/APIUtils";

import { getSTQuestFormItems } from "../../constants";

const TQuests: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
      menu: [
        {
          key: "1",
          icon: TableOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: TableOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      key: "quest_cost",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "стоимости квеста",
      },
      isCountable: true,
    },
  ];

  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getSTQuestFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])

  const formHandleOnChange = () => {};

  return (
    <TemplateTable
      defaultOpenKeys={["tables"]}
      defaultSelectedKeys={["tablesQuests"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={"новая запись"}
      isCancel={false}
      isCreate={false}
      tableScroll={5000}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getUserSTQuests}
      deleteFunction={deleteSTQuest}
      postFunction={postSTQuest}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default TQuests;
