import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Form, Input, Button, Select, Checkbox, DatePicker } from "antd";
import type { FormItemProps } from "antd";
import type { SelectProps } from "antd";

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const MyFormItemContext = React.createContext<(string | number)[]>([]);

interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: React.ReactNode;
}

function toArr(
  str: string | number | (string | number)[]
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix]
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

interface DataItem {
  id: number;
  quest_address: string;
  quest_name: string;
}

const dateFormatList = ["DD.MM.YYYY"];

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const onFinish = async (value: object) => {
    console.log(value);

    const url = 'http://127.0.0.1:8000/api/additional1-form/'; // Replace with your API endpoint
    
    try {
      const response: AxiosResponse = await axios.post(url, value);
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
      <MyFormItem name="date" label="Дата">
        <DatePicker format={dateFormatList} />
      </MyFormItem>
      <MyFormItem name="customValue" label="Значение">
        <Input />
      </MyFormItem>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export default App;
