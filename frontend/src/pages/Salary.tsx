import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Switch, Table, Tooltip  } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import axios from 'axios';

interface DataType {
  key: React.ReactNode;
  date: string,
  gregory: number;
  yulia: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Гриша',
    dataIndex: 'gregory',
    key: 'gregory',
    render: (text) => (
      <Tooltip title={(
        <React.Fragment>
          Максим - 650
          <br />
          1) 500р. - 1 игра
          <br />
          2) 100р. - 1 видео
          <br />
          3) 50р. - проезд
          <br />
        </React.Fragment>
      )}>
        <span>{text}</span>
      </Tooltip>
    ),
  },
  {
    title: 'Юля',
    dataIndex: 'yulia',
    key: 'yulia',
  },
];

const data: DataType[] = [
  {
    key: 1,
    date: '10.07.2023',
    gregory: 2900,
    yulia: 1200,
  },
  {
    key: 2,
    date: '11.07.2023',
    gregory: 120,
    yulia: 4500,
  },
];

// rowSelection objects indicates the need for row selection
const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

const App: React.FC = () => {
  const checkStrictly = false;

  // const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Define an async function to fetch data
    async function fetchData() {
      try {
        const response = await axios.get<DataType[]>(`http://127.0.0.1:8000/api/salaries`);

        console.log(response)
        // setData(response.data); // Set fetched data to the state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData(); // Call the async function
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <Table
        columns={columns}
        bordered
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
    </>
  );
};

export default App; 