import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  TimePicker,
  DatePicker,
  message,
} from "antd";
import type { FormItemProps } from "antd";
import type { SelectProps, TimePickerProps } from "antd";

// const options: SelectProps["options"] = [];

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
  quest_rate: number;
}

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const [optionsUsers, setOptionUsers] = useState([]);
  const [optionsAdministrator, setOptionsAdministrator] = useState([]);
  const [optionsAnimators, setOptionsAnimators] = useState([]);
  const [optionsQuest, setOptionsQuest] = useState([]);
  const [optionsActors, setOptionsActors] = useState([]);

  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/");

        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));

        setOptionUsers(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    async function getAdministrators() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/administrators/"
        );

        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));

        setOptionsAdministrator(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    async function getAnimators() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/animators/"
        );

        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));

        setOptionsAnimators(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    async function getActors() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/actors/");

        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name + " " + item.first_name + " " + item.middle_name,
          value: item.id,
        }));

        setOptionsActors(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    async function fetchData() {
      try {
        const response = await axios.get<DataItem[]>(
          "http://127.0.0.1:8000/api/quests/"
        );

        const formattedOptions = response.data.map((item) => ({
          label: item.quest_name,
          value: item.id,
        }));

        setOptionsQuest(formattedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getUsers(); // Call the async function
    getAdministrators(); // Call the async function
    getAnimators(); // Call the async function
    getActors(); // Call the async function
    fetchData(); // Call the async function
  }, []); // Empty dependency array to run the effect only once

  const success = () => {
    messageApi.open({
      type: "success",
      content: "This is a success message",
    });
  };

  const onFinish = async (value: object) => {
    console.log(value);

    const url = "http://127.0.0.1:8000/api/quest-form/"; // Replace with your API endpoint

    try {
      const response: AxiosResponse = await axios.post(url, value);
      console.log(response);
      // setResponse(response.data);
      // setError(null);

      if (response.status === 200) {
        console.log("succed");
        messageApi.open({
          type: "success",
          content: "Данные успешно добавлены",
        });
      }
    } catch (error) {
      setError("An error occurred.");
      messageApi.open({
        type: "error",
        content: "Неизвестная ошибка. Данные не добавлены!",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
        <MyFormItem name="quest" label="Квест">
          <Select
            options={optionsQuest}
            allowClear
            placeholder="Please select"
          />
        </MyFormItem>
        <MyFormItem name="date" label="Дата">
          <DatePicker format={dateFormatList} />
        </MyFormItem>
        <MyFormItem name="time" label="Время">
          <TimePicker />
        </MyFormItem>
        <MyFormItem name="questCost" label="Стоимость квеста">
          <Input />
        </MyFormItem>
        <MyFormItem name="package" valuePropName="checked" noStyle>
          <Checkbox>Пакет</Checkbox>
        </MyFormItem>
        <MyFormItem name="addPlayers" label="Дополнительные игроки">
          <Input />
        </MyFormItem>
        <MyFormItem name="actorSecondActor" label="Актеры/Второй актер">
          <Input />
        </MyFormItem>
        <MyFormItem name="discount" label="Скидка">
          <Input />
        </MyFormItem>
        <MyFormItem name="discountDescription" label="Описание скидки">
          <Input />
        </MyFormItem>
        <MyFormItem name="roomSum" label="Комната">
          <Input />
        </MyFormItem>
        <MyFormItem name="roomQuantity" label="Количество комнат">
          <Input />
        </MyFormItem>
        <MyFormItem name="roomEmployeeName" label="Имя сотрудника">
          <Select
            options={optionsUsers}
            allowClear
            placeholder="Please select"
          />
        </MyFormItem>
        <MyFormItem name="video" label="Видео">
          <Input />
        </MyFormItem>
        <MyFormItem
          name="photomagnetsNotPromoSum"
          label="Фотомагниты не акционные"
        >
          <Input />
        </MyFormItem>
        <MyFormItem
          name="photomagnetsNotPromoQuantity"
          label="Фотомагниты не акционные количество"
        >
          <Input />
        </MyFormItem>
        <MyFormItem name="photomagnetsPromoSum" label="Фотомагниты акционные">
          <Input />
        </MyFormItem>
        <MyFormItem
          name="photomagnetsPromoQuantity"
          label="Фотомагниты акционные количество"
        >
          <Input />
        </MyFormItem>
        <MyFormItem
          name="birthdayCongratulations"
          label="Поздравление именинника"
        >
          <Input />
        </MyFormItem>
        <MyFormItem name="easyWork" label="Простой">
          <Input />
        </MyFormItem>
        <MyFormItem name="nightGame" label="Ночная игра">
          <Input />
        </MyFormItem>
        <MyFormItem name="travel" valuePropName="checked" noStyle>
          <Checkbox>Проезд</Checkbox>
        </MyFormItem>
        <MyFormItem name="administrator" label="Администратор">
          <Select
            options={optionsAdministrator}
            allowClear
            placeholder="Please select"
          />
        </MyFormItem>
        <MyFormItem name="actor" label="Актер">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            onChange={handleChange}
            options={optionsActors}
          />
        </MyFormItem>
        <MyFormItem name="animator" label="Аниматор">
          <Select
            options={optionsAnimators}
            allowClear
            placeholder="Please select"
          />
        </MyFormItem>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default App;
