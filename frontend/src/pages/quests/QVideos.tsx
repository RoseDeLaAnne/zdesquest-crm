import React, { FC } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// api
import { getQVideos } from "../../api/APIUtils";

// components
import TemplateTable from "../../components/template/Table";

const QVideos: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: "радуга",
      menu: [
        {
          key: "1",
          icon: FallOutlined,
          label: "радуга",
          to: "/quests/rainbow",
        },
      ],
    },
    {
      icon: FallOutlined,
      title: "видео",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "доходы",
          to: "/quests/rainbow/incomes",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/quests/rainbow/expenses",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      isSorting: false,
      searching: {
        isSearching: true,
        title: "id",
      },
      isCountable: false,
    },
    {
      title: "имя клиента",
      dataIndex: "client_name",
      key: "client_name",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "client_name",
      },
      isCountable: false,
      render: (_, { client_name }) => (
        <>
          {client_name.map((entry: string) => {
            return (
              <Tag color="black" key={entry}>
                {entry}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "отправлено",
      dataIndex: "sent",
      key: "sent",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { sent }) => (
        <>
          {sent.map((entry: string) => {
            let color = ''
            let formatText = ''

            if (entry) {
              color = "green";
              formatText = 'отправлено'
            } else {
              color = "red";
              formatText = 'не отправлено'
            }
            return (
              <Tag color={color} key={entry}>
                {formatText}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "пакет",
      dataIndex: "is_package",
      key: "is_package",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (is_package) => {
        let color = "red";
        let formattedIsPackage = "";

        if (is_package === true) {
          color = "green";
          formattedIsPackage = "да";
        } else if (is_package === false) {
          color = "red";
          formattedIsPackage = "нет";
        }

        return <Tag color={color}>{formattedIsPackage}</Tag>;
      },
    },
    {
      title: "примечание",
      dataIndex: "note",
      key: "note",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={["quests", "questsРадуга"]}
      defaultSelectedKeys={["questsРадугаIncomes"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={null}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={false}
      getFunction={getQVideos}
      deleteFunction={null}
      postFunction={null}
      isUseParams={true}
      isAddEntry={null}
      drawerTitle={null}
      formItems={null}
      notVisibleFormItems={null}
      defaultValuesFormItems={null}
      formHandleOnChange={null}
    />
  );
};

export default QVideos;
