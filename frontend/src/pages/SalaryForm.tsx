import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker, Space } from "antd";

dayjs.extend(customParseFormat);

/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];
const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker
      defaultValue={dayjs("01/01/2015", dateFormatList[0])}
      format={dateFormatList}
    />
  </Space>
);

export default App;
