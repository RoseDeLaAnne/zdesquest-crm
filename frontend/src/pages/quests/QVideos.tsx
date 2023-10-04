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
import TableTemplate3 from "../../components/TableTemplate3";

const QVideos: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "видео",
    },
  ];
  const title = initialBreadcrumbItems[initialBreadcrumbItems.length - 1].title;

  const initialPackedTableDataColumn = {
    title: "date_time",
    dataIndex: "date_time",
    key: "date_time",
    width: 140,
    isSorting: true,
    searching: {
      isSearching: true,
      title: "date_time",
    },
    fixed: "left",
  };
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
      title: "client_name",
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
      title: "sent",
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
  ];

  return (
    <TableTemplate3
      defaultOpenKeys={["quests"]}
      defaultSelectedKeys={["workCardExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      title={title}
      isDatePicker={true}
      fetchFunction={getQVideos}
      isUseParams={true}
      initialPackedTableDataColumn={initialPackedTableDataColumn}
      initialPackedTableColumns={initialPackedTableColumns}
      isOperation={false}
      tableScroll={null}
    />
  );
};

export default QVideos;
