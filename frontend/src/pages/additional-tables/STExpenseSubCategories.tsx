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
  getSTExpenseCategories,
  getSTExpenseSubCategories,
  postSTExpenseSubCategory,
  deleteSTExpenseSubCategory,
} from "../../api/APIUtils";
import { getSTExpenseSubCategoriesFormItems } from "../../constants";


const STExpenseSubCategories: FC = () => {
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
      title: "название подкатегории",
      dataIndex: "name",
    },
    {
      title: "название подкатегории (латинское)",
      dataIndex: "latin_name",
    },
    {
      title: "категория",
      dataIndex: "category",
      render: (category) => <Tag color="black">{category.name}</Tag>,
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTExpenseSubCategoriesFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = () => {}

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseSubCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      isAddEntry={true}
      addEntryTitle={"новая запись"}
      drawerTitle={"создать новую запись"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getSTExpenseSubCategories}
      deleteFunction={deleteSTExpenseSubCategory}
      postFunction={postSTExpenseSubCategory}
      formItems={formItems}
      tableIsOperation={true}
      operationIsEdit={true}
      operationIsDelete={true}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STExpenseSubCategories;
