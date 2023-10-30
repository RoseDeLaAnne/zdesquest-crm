import { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { TableOutlined, QuestionOutlined, FallOutlined, DeploymentUnitOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  deleteSTBonusPenalty,
  getSTBonusesPenalties,
  postSTBonusPenalty,
} from "../../api/APIUtils";

import { getSTBonusesPenaltiesFormItems } from "../../constants";

const STQuests: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: DeploymentUnitOutlined,
      title: "бонусы/штрафы",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "бонусы/штрафы",
          to: "/source-tables/bonuses-penalties",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "тип",
      dataIndex: "type",
      key: "type",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (type) => {
        let color = "red";
        let formattedType = type;

        if (type === "bonus") {
          color = "green";
          formattedType = "бонус";
        } else if (type === "penalty") {
          color = "red";
          formattedType = "штраф";
        }

        return <Tag color={color}>{formattedType}</Tag>;
      },
    },
    {
      title: "наименование",
      dataIndex: "name",
      key: "name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: false,
    },
    {
      title: "сумма",
      dataIndex: "amount",
      key: "amount",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "сумме",
      },
      isCountable: true,
    },
    {
      title: "сотрудник",
      dataIndex: "user",
      key: "user",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (user) => {
        if (user !== null) {
          return (
            <Tag color="black">
              {user.last_name} {user.first_name}{" "}
              {user.middle_name ? user.middle_name : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "квесты",
      dataIndex: "quests",
      key: "quests",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { quests }) => (
        <>
          {quests.map((quest) => {
            return (
              <Tag color="orange" key={quest.id}>
                {quest.name}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getSTBonusesPenaltiesFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])

  const formHandleOnChange = () => {};

  return (
    <TemplateTable
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesBonusesPenalties"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={"новая запись"}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getSTBonusesPenalties}
      deleteFunction={deleteSTBonusPenalty}
      postFunction={postSTBonusPenalty}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STQuests;
