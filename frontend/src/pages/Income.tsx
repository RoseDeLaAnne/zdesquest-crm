import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Switch, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import axios from 'axios';

interface DataType {
  key: React.ReactNode;
  dateTime: string;
  time: string;
  game: number;
  room: number;
  video: number;
  photomagnets: number;
  actor: number;
  total: number;
  children?: DataType[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Дата/Время',
    dataIndex: 'dateTime',
    key: 'dateTime',
  },
  {
    title: 'Игра',
    dataIndex: 'game',
    key: 'game',
  },
  {
    title: 'Комната',
    dataIndex: 'room',
    key: 'room',
  },
  {
    title: 'Видео',
    dataIndex: 'video',
    key: 'video',
  },
  {
    title: 'Фотомагниты',
    dataIndex: 'photomagnets',
    key: 'photomagnets',
  },
  {
    title: 'Актер',
    dataIndex: 'actor',
    key: 'actor',
  },
  {
    title: 'Итог',
    dataIndex: 'total',
    key: 'total',
  },
];

// const data: DataType[] = [
//   {
//     key: 1,
//     date: '10.07.2023',
//     game: 2900,
//     room: 600,
//     video: 450,
//     photomagnets: 450,
//     actor: 800,
//     total: 800,
//     children: [
//       {
//         key: 11,
//         date: '12:00',
//         game: 2900,
//         room: 600,
//         video: 450,
//         photomagnets: 450,
//         actor: 800,
//         total: 800,
//       },
//       {
//         key: 12,
//         date: '14:00',
//         game: 2900,
//         room: 600,
//         video: 450,
//         photomagnets: 450,
//         actor: 800,
//         total: 800,
//       },
//     ],
//   },
//   {
//     key: 2,
//     date: '11.07.2023',
//     game: 2900,
//     room: 600,
//     video: 450,
//     photomagnets: 450,
//     actor: 800,
//     total: 800,
//   },
// ];

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


  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Define an async function to fetch data
    async function fetchData() {
      try {
        const response = await axios.get<DataType[]>(`http://127.0.0.1:8000/api/incomes/${id}`);
        setData(response.data); // Set fetched data to the state
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