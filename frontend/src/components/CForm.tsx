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

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const App: FC = ({ items, form, onFinish, handleChange, checkboxOnChange }) => {
  return (
    <Form form={form} layout={"vertical"} requiredMark onFinish={onFinish}>
      {items.map((item, index) => (
        <Row gutter={item.gutter} key={index}>
          {item.items.map((innerItem, innerIndex) => (
            <Col span={innerItem.span} key={innerIndex}>
              <Form.Item
                name={innerItem.name}
                label={innerItem.label}
                {...(innerItem.item.name === "Upload"
                  ? { valuePropName: "fileList", getValueFromEvent: normFile }
                  : {})}
                {...(innerItem.item.name === "Checkbox"
                  ? { valuePropName: "checked", initialValue: false }
                  : {})}
                {...(innerItem.item.name !== "Checkbox"
                  ? {
                      rules: [
                        {
                          required: innerItem.rules.required,
                          message: innerItem.rules.message,
                        },
                      ],
                    }
                  : {})}
              >
                {innerItem.item.name === "DatePicker" ? (
                  <DatePicker
                    {...(innerItem.item.picker === "time"
                      ? { picker: "time" }
                      : {})}
                    {...(innerItem.item.picker !== "time"
                      ? { format: "DD.MM.YYYY" }
                      : {})}
                    style={{ width: "100%" }}
                  />
                ) : innerItem.item.name === "Select" ? (
                  <Select
                    {...(innerItem.item.multiple ? { mode: "multiple" } : {})}
                    showSearch
                    allowClear
                    options={innerItem.item.options}
                    onChange={handleChange}
                  />
                ) : innerItem.item.name === "TimePicker" ? (
                  <TimePicker
                    format="HH:mm"
                  />
                ) : innerItem.item.name === "Checkbox" ? (
                  <Checkbox onChange={checkboxOnChange}>{innerItem.item.label}</Checkbox>
                ) : innerItem.item.name === "Upload" ? (
                  <Upload action="/upload.do" listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                ) : (
                  <Input placeholder={innerItem.item.placeholder} />
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
