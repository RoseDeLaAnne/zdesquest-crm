import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import axios from 'axios';

interface DataType {
  key: React.ReactNode;
  date: string,
  topKvestov: number;
  mirKvestov: number;
  questHunter: number;
  stavka: number;
  comunalka: number;
  other: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Агрегаторы',
    children: [
      {
        title: 'top kvestov',
        dataIndex: 'topKvestov',
        key: 'topKvestov',
      },
      {
        title: 'mir-kvestov',
        dataIndex: 'mirKvestov',
        key: 'mirKvestov',
      },
      {
        title: 'quest hunter',
        dataIndex: 'questHunter',
        key: 'questHunter',
      },
    ],
  },
  {
    title: 'Аренда',
    children: [
      {
        title: 'Ставка',
        dataIndex: 'stavka',
        key: 'stavka',
      },
      {
        title: 'Коммуналка',
        dataIndex: 'comunalka',
        key: 'comunalka',
      },
    ],
  },
  {
    title: 'Прочие расходы',
    dataIndex: 'other',
    key: 'other',
  },
];

const data: DataType[] = [
  {
    key: 1,
    date: '10.07.2023',
    topKvestov: 1200,
    mirKvestov: 1000,
    questHunter: 500,
    stavka: 2900,
    comunalka: 1200,
    other: 5000,
  },
  {
    key: 2,
    date: '11.07.2023',
    topKvestov: 2900,
    mirKvestov: 2900,
    questHunter: 2900,
    stavka: 2900,
    comunalka: 1200,
    other: 5000,
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

  const { id } = useParams();

  // const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Define an async function to fetch data
    async function fetchData() {
      try {
        const response = await axios.get<DataType[]>(`http://127.0.0.1:8000/api/expenses/${id}`);

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