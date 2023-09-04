import React, { FC, useState, useEffect, useRef } from "react";

// antd
import { Col, DatePicker, Form, Row, Select, Input, Checkbox } from "antd";

const App: FC = ({ items, form, onFinish }) => {
  return (
    <Form form={form} layout={"vertical"} requiredMark onFinish={onFinish}>
      {items.map((item, index) => (
        <Row gutter={item.gutter} key={index}>
          {item.items.map((innerItem, innerIndex) => (
            <Col span={innerItem.span} key={innerIndex}>
              <Form.Item
                name={innerItem.name}
                label={innerItem.label}
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
                  />
                ) : innerItem.item.name === "Checkbox" ? (
                  <Checkbox>{innerItem.item.label}</Checkbox>
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
