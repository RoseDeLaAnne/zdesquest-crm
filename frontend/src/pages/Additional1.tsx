import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table, DatePicker, Badge, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form';
import axios from 'axios';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const { RangePicker } = DatePicker;

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  date: string;
  value: number;
  status: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      date: '10.08.2023',
      value: 5000,
      status: 'processing',
    }
  ]);

  const getAdditional1 = async (startDate, endDate) => {
    var response;

    if (startDate !== null && endDate !== null) {
      response = await axios.get(`http://127.0.0.1:8000/api/additional1/?start_date=${startDate}&end_date=${endDate}`);
    } else {
      response = await axios.get(`http://127.0.0.1:8000/api/additional1/`);
    }

    console.log(response.data)

    setDataSource(response.data)
  };

  useEffect(() => {   
    getAdditional1(null, null);
  }, []);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleConfirm = async (key: React.Key) => {
    const response = await axios.put(`http://127.0.0.1:8000/api/additional1-update/${key}/`);

    if (response.status === 200) {
      const updatedData = [...dataSource];
      updatedData[key-1] = {
        ...updatedData[key-1],
        status: 'success',
      };
      setDataSource(updatedData);
    }
  };

  const handleDateChange = async (dates) => {
    if (dates !== null) {
      getAdditional1(dates[0].format('DD-MM-YYYY'), dates[1].format('DD-MM-YYYY'))
    } else {
      getAdditional1(null, null)
    }
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Дата',
      dataIndex: 'date',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      editable: true,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (status) => <Badge status={status} text={status === 'processing' ? 'В ожидании' : status === 'success' ? 'Одобрена' : 'Отклонена'} />,
    },
    {
      title: 'Операция',
      dataIndex: 'operation',
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <>
            <Popconfirm title="Sure to confirm?" onConfirm={() => handleConfirm(record.key)}>
              <a>Confirm</a>
            </Popconfirm>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  // const handleAdd = () => {
  //   const newData: DataType = {
  //     key: count,
  //     date: `${new Date(Date.now()).getDate().toString().padStart(2, '0')}.${(new Date(Date.now()).getMonth() + 1).toString().padStart(2, '0')}.${new Date(Date.now()).getFullYear()}`,
  //     value: 0,
  //   };
  //   setDataSource([...dataSource, newData]);
  //   setCount(count + 1);
  // };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
      <RangePicker onChange={handleDateChange} />
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default App;