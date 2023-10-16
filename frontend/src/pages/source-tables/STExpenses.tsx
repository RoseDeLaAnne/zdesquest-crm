import { FC, useState, useEffect } from "react";

// antd
import { Tag, Image } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table11";

// api
import {
  deleteSTExpense,
  getSTExpenses,
  postSTExpense,
} from "../../api/APIUtils";

// constants
import { getSTExpensesFormItems } from "../../constants";

const backendUrl = "http://127.0.0.1:8000";

const STExpensesFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: TableOutlined,
      title: "квесты",
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
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "наименование расхода",
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
      title: "сумма расхода",
      dataIndex: "amount",
      key: "amount",
      isSorting: true,
      searching: {
        isSearching: true,
        title: "",
      },
      isCountable: true,
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
    {
      title: "кто оплатил",
      dataIndex: "who_paid",
      key: "who_paid",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (who_paid) => {
        if (who_paid !== null) {
          return (
            <Tag color="black">
              {who_paid.last_name} {who_paid.first_name}{" "}
              {who_paid.middle_name ? who_paid.middle_name : ""}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    // {
    //   title: "приложение",
    //   dataIndex: "attachment",
    //   key: "attachment",
    //   isSorting: false,
    //   searching: {
    //     isSearching: false,
    //     title: "",
    //   },
    //   isCountable: false,
    //   render: (text, record) => (
    //     <Image
    //       src={`${backendUrl}${record.image}`}
    //       width={100}
    //       height={64}
    //     />
    //   ),
    // },
    {
      title: "кто уехали",
      dataIndex: "paid_tax",
      key: "paid_tax",
      isSorting: false,
      searching: {
        isSearching: false,
        title: "",
      },
      isCountable: false,
      render: (_, { paid_tax }) => (
        <>
          {paid_tax && paid_tax.map((el) => {
            return (
              <Tag color="orange" key={el.id}>
                {el.name}
              </Tag>
            );
          })}
        </>
      )
    },
  ];

  const [notVisibleFormItems, setNotVisibleFormItems] = useState([]);
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});
  const [formItems, setFormItems] = useState([])
  const getFormItems = async () => {
    const res = await getSTExpensesFormItems()
    setFormItems(res)
  }
  useEffect(() => {
    getFormItems();
  }, [])

  const formHandleOnChange = (value, name) => {
    // if (name === 'name') {
    //   if (value === 'taxi') {
    //     setNotVisibleFormItems(['paid_tax', 'who_paid'])
    //   } else {
    //     setNotVisibleFormItems(['paid_tax'])
    //   }
    // }

    // if (name === 'paid_from') {
    //   if (value === 'own') {
    //     setNotVisibleFormItems(['paid_tax', 'who_paid'])
    //   } else {
    //     setNotVisibleFormItems(['who_paid'])
    //   }
    // }
  }

  return (
    <TemplateTable
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={"новая запись"}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={true}
      getFunction={getSTExpenses}
      deleteFunction={deleteSTExpense}
      postFunction={postSTExpense}
      isUseParams={false}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formHandleOnChange={formHandleOnChange}
    />
  );
};

export default STExpensesFC;
