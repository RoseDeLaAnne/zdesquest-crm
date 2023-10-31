import React from "react";
import { useNavigate } from "react-router-dom";

// antd
import { Button, Form, Input } from "antd";

// api
import { token } from "../../api/APIUtils";

// utils
import { localStorageSetItem } from "../../assets/utilities/jwt";

type FieldType = {
  username?: string;
  password?: string;
};

const App: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await token(values);
      // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      if (response.status === 200) {
        localStorageSetItem(response.data);
        // navigate("/users", { replace: true });
        // window.location.reload();
        window.location.href = '/salaries';
        // navigate("/users");
      }
    } catch (error) {
      throw error;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
