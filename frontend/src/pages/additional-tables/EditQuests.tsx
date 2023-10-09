import { FC, useState, useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// components
import TemplateEdit from "../../components/template/Edit.tsx";

// api
import { getQuest, getQuestVersion, putQuest, putQuestVersion } from "../../api/APIUtils.ts";

// constants
import { getQuestVersionsFormItems, getQuestsFormItems } from "../../constants/index.ts";

const EditUsersFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/additional-tables/quests",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
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
    <TemplateEdit
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesQuests"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getQuest}
      putFunction={putQuest}
      isUseParams={true}
      formItems={formItems}
    />
  );
};

export default EditUsersFC;
