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
  deleteSTExpenseSubCategory,
  postSTExpenseSubCategory,
} from "../../api/APIUtils";
import { getSTExpenseCategoriesFormItems } from "../../constants";

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

  const initialPackedTableColumns = [
    {
      title: "название категории",
      dataIndex: "name",
    },
    {
      title: "название категории (латинское)",
      dataIndex: "latin_name",
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTExpenseCategoriesFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = () => {};

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      isAddEntry={true}
      addEntryTitle={"новая запись"}
      drawerTitle={"создать новую запись"}
      // tableDateColumn={"date_time"}
      tableScroll={{ x: 1750, y: 600 }}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getSTExpenseCategories}
      deleteFunction={deleteSTExpenseCategory}
      postFunction={postSTExpenseCategory}
      formItems={formItems}
      tableIsOperation={true}
      operationIsEdit={true}
      operationIsDelete={true}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STExpenseCategoriesFC;
