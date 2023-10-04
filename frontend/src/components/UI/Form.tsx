import React, { FC, useState, useEffect, useRef } from "react";

// antd
import {
  Col,
  DatePicker,
  TimePicker,
  Form,
  Row,
  Select,
  Input,
  Checkbox,
  Upload,
} from "antd";
// antd | icons
import { PlusOutlined } from "@ant-design/icons";

const App: FC = ({ items, form, onFinish, handleOnChange }) => {
  // const handleOnChange = (e, name) => {
  //   console.log(e)
  //   console.log(name)
  // }

  return (
    <Form form={form} layout={"vertical"} requiredMark onFinish={onFinish}>
      {items.map((item, index) => (
        <Row gutter={item.gutter} key={index}>
          {item.items.map((innerItem, innerIndex) => (
            <Col span={innerItem.span} key={innerIndex}>
              <Form.Item name={innerItem.name} label={innerItem.label}>
                {innerItem.element.name === "Select" ? (
                  <Select
                    {...(innerItem.element.multiple
                      ? { mode: "multiple" }
                      : {})}
                    showSearch
                    allowClear
                    options={innerItem.element.options}
                    onChange={(selectedValues) =>
                      handleOnChange(selectedValues, innerItem.name)
                    }
                  />
                ) : (
                  <Input placeholder={innerItem.placeholder} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      ))}
    </Form>
  );
};

export default App;
