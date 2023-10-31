import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuest, getQuestVersion, getQuests, getSTExpense, getSTQuest, putQuest, putQuestVersion, putSTExpense, putSTQuest } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getQuestsFormItems, getSTExpensesFormItems, getSTQuestFormItems } from "../../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "расходы",
      to: "/source-tables/expenses",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTExpensesFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = () => {}

  return (
    <TemplateEdit
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getSTExpense}
      putFunction={putSTExpense}
      isUseParams={true}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default EditUsersFC;
