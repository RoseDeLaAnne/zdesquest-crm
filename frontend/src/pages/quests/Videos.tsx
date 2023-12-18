import { FC, useState, useEffect } from "react";

// react-router-dom
import { Link, useParams } from "react-router-dom";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  RiseOutlined,
  VideoCameraOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import { getCurrentUser, getQVideos, getQuests, toggleQuestVideo } from "../../api/APIUtils";

const QVideosFC: FC = () => {
  const { id } = useParams();

  const [currentQuest, setCurrentQuest] = useState({});
  const [quests, setQuests] = useState([]);
  const fetchQuests = async () => {
    const res = await getQuests();
    if (res.status === 200) {
      setCurrentQuest(res.data.find((el) => el.id === parseInt(id)));
      setQuests(res.data);
    }
  };
  useEffect(() => {
    fetchQuests();
  }, []);

  const initialBreadcrumbItems = [
    {
      icon: QuestionOutlined,
      title: "квесты",
      to: "/quests",
    },
    {
      icon: FallOutlined,
      title: currentQuest.name ? currentQuest.name.toLowerCase() : "",
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
      icon: RiseOutlined,
      title: "видео",
      menu: [
        {
          key: "1",
          icon: RiseOutlined,
          label: "доходы",
          to: `/quests/${id}/incomes`,
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: `/quests/${id}/expenses`,
        },
        {
          key: "3",
          icon: MoneyCollectOutlined,
          label: "касса",
          to: `/quests/${id}/cash-register`,
        },
        {
          key: "4",
          icon: FallOutlined,
          label: "расходы с рабочей карты",
          to: `/quests/${id}/work-card-expenses`,
        },
        {
          key: "5",
          icon: FallOutlined,
          label: "расходы со своих",
          to: `/quests/${id}/expenses-from-own`,
        },
        {
          key: "6",
          icon: VideoCameraOutlined,
          label: "видео",
          to: `/quests/${id}/videos`,
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    // {
    //   title: "id",
    //   dataIndex: "id",
    //   key: "id",
    //   isSorting: false,
    //   searching: {
    //     isSearching: true,
    //     title: "id",
    //   },
    //   isCountable: false,
    // },
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

    // {
    //   title: "пакет",
    //   dataIndex: "is_package",
    //   key: "is_package",
    //   isSorting: false,
    //   searching: {
    //     isSearching: false,
    //     title: "",
    //   },
    //   isCountable: false,
    //   render: (_, { is_package }) => (
    //     <>
    //       {is_package.map((is_package_single: boolean) => {
    //         let color = ''
    //         let formatText = ''

    //         if (is_package_single == true) {
    //           color = "green";
    //           formatText = 'да'
    //         } else {
    //           color = "red";
    //           formatText = 'нет'
    //         }
    //         return (
    //           <Tag color={color} key={formatText}>
    //             {formatText}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
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
      render: (_, { type }) => (
        <>
          {type.map((type_single: string) => {
            let color = "black";
            let formatText = "";

            if (type_single == "package") {
              // color = "green";
              formatText = "пакет";
            } else if (type_single == "video_review") {
              // color = "red";
              formatText = "видео отзыв";
            } else if (type_single == 'video') {
              formatText = "видео"
            } else if (type_single == 'video_as_a_gift') {
              formatText = "видео в подарок"
            }
            return (
              <Tag color={color} key={formatText}>
                {formatText}
              </Tag>
            );
          })}
        </>
      ),

      // render: (is_package) => {
      //   let color = "red";
      //   let formattedIsPackage = "";

      //   if (is_package === true) {
      //     color = "green";
      //     formattedIsPackage = "да";
      //   } else if (is_package === false) {
      //     color = "red";
      //     formattedIsPackage = "нет";
      //   }

      //   return <Tag color={color}>{formattedIsPackage}</Tag>;
      // },
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
            let color = "";
            let formatText = "";

            if (entry) {
              color = "green";
              formatText = "отправлено";
            } else {
              color = "red";
              formatText = "не отправлено";
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

  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    const response = await getCurrentUser();
    if (response.status === 200) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  return (
    <TemplateTable
      defaultOpenKeys={["quests", `quests${id}`]}
      defaultSelectedKeys={[`quests${id}Videos`]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableIsOperation={"toggle"}
      tableDateColumn={"date_time"}
      initialPackedTableColumns={initialPackedTableColumns}
      getFunction={getQVideos}
      toggleFunction={toggleQuestVideo}
      isUseParams={true}
      tableScroll={{ x: 1000 }}
    />
  );
};

export default QVideosFC;
