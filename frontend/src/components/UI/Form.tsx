import { FC } from "react";

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

// constants
import {
  datePickerFormat,
  minuteStep,
  timePickerFormat,
} from "../../constants";

import locale from 'antd/es/date-picker/locale/ru_RU';

import 'dayjs/locale/ru';

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const { RangePicker } = DatePicker;

const FormFC: FC = ({ items, form, onFinish, handleOnChange }) => {
  return (
    <Form form={form} layout={"vertical"} requiredMark onFinish={onFinish}>
      {items.map((item, index) => (
        <Row gutter={item.gutter} key={index}>
          {item.items.map((innerItem, innerIndex) => (
            <Col
              xs={innerItem.spanXS}
              sm={innerItem.spanSM}
              md={innerItem.spanMD}
              key={innerIndex}
            >
              <Form.Item
                name={innerItem.name}
                label={innerItem.label}
                {...(innerItem.element.name === "Checkbox"
                  ? { valuePropName: "checked", initialValue: false }
                  : {})}
                {...(innerItem.element.name === "Upload"
                  ? { valuePropName: "fileList", getValueFromEvent: normFile }
                  : {})}
                {...(innerItem.element.name !== "Checkbox"
                  ? {
                      rules: [
                        {
                          required: innerItem.isRequired,
                          message: innerItem.placeholder,
                        },
                      ],
                    }
                  : {})}
              >
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
                ) : innerItem.element.name === "DatePicker" ? (
                  <DatePicker
                    locale={locale}
                    format={datePickerFormat}
                    style={{ width: "100%" }}
                    onChange={(selectedValues) =>
                      handleOnChange(selectedValues, innerItem.name)
                    }
                  />
                ) : innerItem.element.name === "TimePicker" ? (
                  <TimePicker
                    format={timePickerFormat}
                    style={{ width: "100%" }}
                    minuteStep={minuteStep}
                  />
                ) : innerItem.element.name === "RangePicker" ? (
                  <RangePicker
                    format={datePickerFormat}
                    style={{ width: "100%" }}
                  />
                ) : innerItem.element.name === "Checkbox" ? (
                  <Checkbox
                    onChange={(selectedValues) =>
                      handleOnChange(selectedValues, innerItem.name)
                    }
                  >
                    {innerItem.placeholder}
                  </Checkbox>
                ) : innerItem.element.name === "Upload" ? (
                  <Upload action="/upload.do" listType="picture-card" maxCount={1}>
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
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

export default FormFC;
