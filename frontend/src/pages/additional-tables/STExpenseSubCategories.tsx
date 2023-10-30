import React, { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// components
import TemplateTable from "../../components/template/Table";

// api
import {
  getSTExpenseCategories,
  getSTExpenseSubCategories,
  postSTExpenseSubCategory,
  deleteSTExpenseSubCategory,
} from "../../api/APIUtils";


const STExpenseSubCategories: FC = () => {
  const [optionsSTExpenseCategories, setOptionsSTExpenseCategories] = useState(
    []
  );
  const [filtersSTExpenseCategories, setFiltersSTExpenseCategories] = useState(
    []
  );
  const fetchSTExpenseCategories = async () => {
    try {
      const response = await getSTExpenseCategories();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.name,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.name,
        }));
        setOptionsSTExpenseCategories(formattedOptions);
        setFiltersSTExpenseCategories(formattedFilters);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "дополнительные таблицы",
      to: "/additional-tables",
    },
    {
      icon: TableOutlined,
      title: "категории расходов",
    },
  ];

  // const initialPackedTableColumns = [
  //   {
  //     title: "название подкатегории",
  //     dataIndex: "name",
  //     key: "name",
  //     sorting: {
  //       isSorting: true,
  //       isDate: false,
  //     },
  //     searching: {
  //       isSearching: true,
  //       title: "названию подкатегории",
  //     },
  //     countable: false,
  //   },
  //   {
  //     title: "категория",
  //     dataIndex: "category",
  //     key: "category",
  //     filters: filtersSTExpenseCategories,
  //     onFilter: (value: string, record) =>
  //       record.category.name.startsWith(value),
  //     filterSearch: true,
  //     sorting: {
  //       isSorting: false,
  //       isDate: false,
  //     },
  //     searching: {
  //       isSearching: false,
  //       title: "",
  //     },
  //     countable: false,
  //     render: (category) => <Tag color="black">{category.name}</Tag>,
  //   },
  // ];
  // const formItems = [
  //   {
  //     gutter: 16,
  //     items: [
  //       {
  //         span: 24,
  //         name: "name",
  //         label: "название подкатегории",
  //         rules: {
  //           required: true,
  //           message: "пожалуйста, введите название подкатегории",
  //         },
  //         item: {
  //           name: "Input",
  //           label: "",
  //           placeholder: "пожалуйста, введите название подкатегории",
  //           options: [],
  //           multiple: null,
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     gutter: 16,
  //     items: [
  //       {
  //         span: 24,
  //         name: "category",
  //         label: "категория",
  //         rules: {
  //           required: true,
  //           message: "пожалуйста, выберите категорию",
  //         },
  //         item: {
  //           name: "Select",
  //           label: "",
  //           placeholder: "пожалуйста, выберите категорию",
  //           options: optionsSTExpenseCategories,
  //           multiple: null,
  //         },
  //       },
  //     ],
  //   },
  // ];

  // useEffect(() => {
  //   fetchSTExpenseCategories();
  // }, []);

  return (
    <TemplateTable
      defaultOpenKeys={["additionalTables"]}
      defaultSelectedKeys={["additionalTablesSTExpenseSubCategories"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={true}
      tableDateColumn={"date_time"}
      // initialPackedTableColumns={initialPackedTableColumns}
      // getFunction={getQuestIncomes}
    />
  );
};

export default STExpenseSubCategories;
