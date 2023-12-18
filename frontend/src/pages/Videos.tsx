import React, { FC, useEffect, useState } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import { DollarOutlined } from "@ant-design/icons";

// components
import TemplateTable from "../components/template/Table";

// api
import { getSalaries, getVideos, toggleQuestVideo } from "../api/APIUtils";

const VideosFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: DollarOutlined,
      title: "видео",
      to: "/videos",
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "номер",
      dataIndex: "id",
      render: (id) => {
        if (id !== 0) {
          return <Tag color="">{id}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "квест",
      dataIndex: "quest",
      render: (quest) => {
        if (quest !== {}) {
          return <Tag color="orange">{quest.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "имя клиента",
      dataIndex: "client_name",
      render: (client_name) => {
        if (client_name !== "") {
          return <Tag color="black">{client_name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "тип",
      dataIndex: "type",
      render: (type) => {
        if (type !== "") {
          let text = "";
          if (type == "package") {
            text = "пакет";
          } else if (type == "video_review") {
            text = "видео отзыв";
          } else if (type == "video") {
            text = "видео";
          } else if (type == "video_as_a_gift") {
            text = "видео в подарок";
          }
          return (
            <Tag color="black" key={type}>
              {text}
            </Tag>
          );
        } else {
          return null;
        }
      },
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
      render: (sent) => {
        if (sent !== null) {
          let color = "";
          let text = "";

          if (sent === true) {
            color = "green";
            text = "отправлено";
          } else if (sent === false) {
            color = "red";
            text = "не отправлено";
          }
          return (
            <Tag color={color} key={sent}>
              {text}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "примечание",
      dataIndex: "note",
      countable: false,
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={[]}
      defaultSelectedKeys={["videos"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      getFunction={getVideos}
      toggleFunction={toggleQuestVideo}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={{ x: 1000 }}
      tableIsObj={true}
      tableIsOperation={"toggle"}
    />
  );
};

export default VideosFC;
