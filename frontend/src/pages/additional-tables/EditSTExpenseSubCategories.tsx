import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuestVersion, getSTExpenseCategory, getSTExpenseSubCategory, putQuestVersion, putSTExpenseCategory, putSTExpenseSubCategory } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getSTExpenseCategoriesFormItems, getSTExpenseSubCategoriesFormItems } from "../../constants/index.ts";

const EditSTExpenseCategories: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "подкатегория расходов",
      to: "/additional-tables/stexpense-subcategories",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
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

  return (
    <TemplateEdit
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseSubCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getSTExpenseSubCategory}
      putFunction={putSTExpenseSubCategory}
      isUseParams={true}
      formItems={formItems}
    />
  );
};

export default EditSTExpenseCategories;
