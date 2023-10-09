import React, { FC } from "react";

// antd | icons
import { TableOutlined } from "@ant-design/icons";

// api
import { getSalaries } from "../api/APIUtils";

// components
import TemplateTable from "../components/template/Table";

const Salaries: FC = () => {
  const initialBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "зарплаты",
      to: "/salaries",
    },
  ];

  return (
    <TemplateTable
      defaultOpenKeys={null}
      defaultSelectedKeys={["salaries"]}
      breadcrumbItems={initialBreadcrumbItems}
      isRangePicker={false}
      addEntryTitle={null}
      isCancel={false}
      isCreate={false}
      tableScroll={null}
      tableDateColumn={null}
      initialPackedTableColumns={null}
      tableIsOperation={false}
      getFunction={getSalaries}
      deleteFunction={null}
      postFunction={null}
      isUseParams={false}
      isAddEntry={false}
      drawerTitle={null}
      formItems={null}
      notVisibleFormItems={null}
      defaultValuesFormItems={null}
      formHandleOnChange={null}
    />
  );
};

export default Salaries;
