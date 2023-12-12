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

const EditQuestVersionsFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "версии квестов",
      to: "/additional-tables/quest-versions",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getQuestVersionsFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = () => {};

  return (
    <TemplateEdit
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesQuestVersions"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getQuest}
      putFunction={putQuestVersion}
      isUseParams={true}
      formHandleOnChange={formHandleOnChange}
      formItems={formItems}
    />
  );
};

export default EditQuestVersionsFC;
