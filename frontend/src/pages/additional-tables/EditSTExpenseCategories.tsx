import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuestVersion, getSTExpenseCategory, putQuestVersion, putSTExpenseCategory } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getSTExpenseCategoriesFormItems } from "../../constants/index.ts";

const EditSTExpenseCategories: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "категория расходов",
      to: "/additional-tables/stexpense-categories",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
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

  return (
    <TemplateEdit
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getSTExpenseCategory}
      putFunction={putSTExpenseCategory}
      isUseParams={true}
      formItems={formItems}
    />
  );
};

export default EditSTExpenseCategories;
