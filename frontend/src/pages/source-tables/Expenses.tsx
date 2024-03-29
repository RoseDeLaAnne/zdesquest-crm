// libs
import dayjs from "dayjs";

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
// import TemplateTable from "../../components/template/Table11";
import TemplateTable from "../../components/template/Table";

// api
import {
  deleteSTExpense,
  getCurrentUser,
  getSTExpenses,
  getUserSTExpenses,
  postSTExpense,
} from "../../api/APIUtils";

// constants
import {
  getSTExpensesFormItems,
  pullOfDatesDefaultGeneral,
  pullOfDatesDefaultValue,
  pullOfDatesOptions,
  pullOfDatesOptionsGeneral,
  pullOfDatesWhenLoadingGeneral,
} from "../../constants";

// const backendUrl = 'http://localhost:8000/'
const backendUrl = "http://crm.zdesquest.ru/";

const STExpensesFC: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
    },
    {
      icon: FallOutlined,
      title: "расходы",
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
      title: "наименование расхода",
      dataIndex: "name",
      sorting: true,
      searching: "наименованию расхода",
    },
    {
      title: "сумма расхода",
      dataIndex: "amount",
      sorting: true,
      searching: "наименованию расхода",
      countable: true,
    },
    {
      title: "категория",
      dataIndex: "sub_category",
      render: (sub_category) => {
        if (sub_category !== null) {
          return <Tag color="black">{sub_category.name}</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: "квесты",
      dataIndex: "quests",
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
      render: (who_paid) => {
        if (who_paid !== null) {
          return (
            <Tag color="black">
              {who_paid.last_name} {who_paid.first_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "приложение",
      dataIndex: "attachment",
      render: (value) =>
        value ? (
          <Image
            src={`${backendUrl}${value}`}
            width={100}
            height={64}
            className="object-fit_cover"
          />
        ) : null,
    },
    {
      title: "сотрудники",
      dataIndex: "employees",
      render: (_, { employees }) => (
        <>
          {employees &&
            employees.map((employee) => {
              return (
                <Tag color="orange" key={employee.id}>
                  {employee.last_name} {employee.first_name}
                </Tag>
              );
            })}
        </>
      ),
    },
    {
      title: "кто создал",
      dataIndex: "created_by",
      render: (created_by) => {
        if (created_by !== null) {
          return (
            <Tag color="black">
              {created_by.first_name} {created_by.last_name}
            </Tag>
          );
        } else {
          return null;
        }
      },
    },
  ];

  const [isTaxi, setIsTaxi] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState([
    "who_paid",
    "employees",
  ]);
  const [defaultValuesFormItems, setDefaultValuesFormItems] = useState({});
  const [formItems, setFormItems] = useState([]);
  const getFormItems = async () => {
    const res = await getSTExpensesFormItems();
    setFormItems(res);
  };
  useEffect(() => {
    getFormItems();
  }, []);

  const formHandleOnChange = (value, name) => {
    if (name === "name") {
      if (value === "Такси" || value === "Обед") {
        setNotVisibleFormItems((prevState) =>
          prevState.filter((item) => item !== "employees")
        );
      } else {
        setNotVisibleFormItems((prevState) =>
          prevState.filter((item) => item !== "who_paid")
        );
      }
    }
    if (name === "paid_from") {
      if (value === "own") {
        setNotVisibleFormItems((prevState) =>
          prevState.filter((item) => item !== "who_paid")
        );
      } else {
      }
    }
  };

  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    const response = await getCurrentUser();
    if (response.status === 200) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const formInitialValues = {
    date: dayjs(),
  };

  return (
    <TemplateTable
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesExpenses"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      addEntryTitle={"новая запись"}
      tableDateColumn={"date"}
      initialPackedTableColumns={initialPackedTableColumns}
      tableIsOperation={user.is_superuser ? true : false}
      operationIsEdit={true}
      operationIsDelete={true}
      getFunction={getSTExpenses}
      deleteFunction={deleteSTExpense}
      postFunction={postSTExpense}
      isAddEntry={true}
      drawerTitle={"создать новую запись"}
      formItems={formItems}
      notVisibleFormItems={notVisibleFormItems}
      defaultValuesFormItems={defaultValuesFormItems}
      formInitialValues={formInitialValues}
      formHandleOnChange={formHandleOnChange}
      tableScroll={{ x: 1500, y: 600 }}
      isPullOfDates={true}
      pullOfDatesDefaultValue={pullOfDatesDefaultGeneral}
      pullOfDatesWhenLoading={pullOfDatesWhenLoadingGeneral}
      pullOfDatesOptions={pullOfDatesOptionsGeneral}
    />
  );
};

export default STExpensesFC;
