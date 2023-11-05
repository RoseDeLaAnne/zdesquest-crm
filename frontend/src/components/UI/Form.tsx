import { FC, useState } from "react";

// antd
import {
  Col,
  DatePicker,
  TimePicker,
  Form,
  Row,
  Select,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  Modal,
  AutoComplete,
} from "antd";
// antd | icons
import { PlusOutlined } from "@ant-design/icons";

// constants
import {
  datePickerFormat,
  minuteStep,
  timePickerFormat,
} from "../../constants";

import locale from "antd/es/date-picker/locale/ru_RU";

import "dayjs/locale/ru";

const { RangePicker } = DatePicker;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FormFC: FC = ({
  items,
  fileList,
  setFileList,
  form,
  onFinish,
  handleOnSelect,
  handleOnChange,
  initialValues,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  const handleBeforeUpload = (file) => {
    // Custom logic to handle the file before uploading
    console.log("Before upload:", file);
    return false; // Prevent automatic upload
  };

  return (
    <Form
      form={form}
      layout={"vertical"}
      requiredMark
      onFinish={onFinish}
      initialValues={initialValues}
    >
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
                  : // ? { valuePropName: "fileList" }
                    {})}
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
                ) : innerItem.element.name === "AutoComplete" ? (
                  <AutoComplete
                    options={innerItem.element.options}
                    style={{ width: "100%" }}
                  />
                ) : innerItem.element.name === "DatePicker" ? (
                  <DatePicker
                    defaultValue={innerItem.element.defaultValue}
                    locale={locale}
                    format={datePickerFormat}
                    onChange={(selectedValues) =>
                      handleOnChange(selectedValues, innerItem.name)
                    }
                    style={{ width: "100%" }}
                  />
                ) : innerItem.element.name === "TimePicker" ? (
                  <TimePicker
                    // onSelect={(selectedValues) => {
                    //   handleOnSelect(selectedValues, innerItem.name);
                    // }}
                    // value={initialValues.time}
                    // defaultValue={innerItem.element.defaultValue}
                    format={timePickerFormat}
                    minuteStep={minuteStep}
                    style={{ width: "100%" }}
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
                  <>
                    <Upload
                      name="logo"
                      listType="picture-card"
                      beforeUpload={handleBeforeUpload}
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={({ fileList: newFileList }) => {
                        if (newFileList.length > 1) {
                          newFileList.shift();
                        }
                        setFileList(newFileList);
                      }}
                      maxCount={1}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Добавить</div>
                      </div>
                    </Upload>
                    <Modal
                      open={previewOpen}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancel}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                  </>
                ) : innerItem.element.name === "InputNumber" ? (
                  <InputNumber
                    defaultValue={innerItem.element.defaultValue}
                    placeholder={innerItem.placeholder}
                    onChange={(selectedValues) =>
                      handleOnChange(selectedValues, innerItem.name)
                    }
                    style={{ width: "100%" }}
                  />
                ) : (
                  <Input
                    defaultValue={innerItem.element.defaultValue}
                    onChange={(event) =>
                      handleOnChange(event.target.value, innerItem.name)
                    }
                    placeholder={innerItem.placeholder}
                  />
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
