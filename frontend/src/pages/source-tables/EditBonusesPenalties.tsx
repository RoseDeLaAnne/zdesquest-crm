import { FC, useRef, useState, useEffect } from "react";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// api
import { getSTBonusPenalty, putSTBonusPenalty } from "../../api/APIUtils";

// components
import TemplateEdit from "../../components/template/Edit";

import { getSTBonusesPenaltiesFormItems, getSTExpensesFormItems } from "../../constants";

const STEditBonusesPenalties: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "бонусы/штрафы",
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
        {
          key: "3",
          icon: TableOutlined,
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
      to: "/source-tables/bonuses-penalties",
    },
    {
      icon: TableOutlined,
      title: "редактирование",
    },
  ];

  const formHandleOnChange = () => {}

  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getSTBonusesPenaltiesFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])

  return (
    <TemplateEdit
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesBonusesPenalties"]}
      breadcrumbItems={initialBreadcrumbItems}
      getFunction={getSTBonusPenalty}
      putFunction={putSTBonusPenalty}
      isUseParams={true}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STEditBonusesPenalties;
