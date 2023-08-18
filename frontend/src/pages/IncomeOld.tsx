import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Switch, Table, Typography, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import axios from 'axios';

const { Text } = Typography;

const { RangePicker } = DatePicker;

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

  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  async function fetchData(startDate, endDate) {
    try {
      var response;

      if (startDate !== null && endDate !== null) {
        response = await axios.get<DataType[]>(`http://127.0.0.1:8000/api/incomes/${id}/?start_date=${startDate}&end_date=${endDate}`); 
      } else {
        response = await axios.get<DataType[]>(`http://127.0.0.1:8000/api/incomes/${id}`); 
      }

      setData(response.data); // Set fetched data to the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {   
    fetchData(null, null); // Call the async function
  }, []); // Empty dependency array to run the effect only once

  const handleDateChange = async (dates) => {
    // setSelectedDateRange(dates);

    if (dates !== null) {
      fetchData(dates[0].format('DD-MM-YYYY'), dates[1].format('DD-MM-YYYY'))
    } else {
      fetchData(null, null)
    }
  };

  return (
    <>
      <RangePicker onChange={handleDateChange} />
      <Table
        columns={columns}
        bordered
        rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
        summary={() => {
          if (data.length === 0) {
            return null; // No data, so don't show the summary row
          }

          let totalGame = 0;
          let totalRoom = 0;
          let totalVideo = 0;
          let totalPhotomagnets = 0;
          let totalActor = 0;
          let totalTotal = 0;
  
          data.forEach(({ game, room, video, photomagnets, actor, total }) => {
            totalGame += game;
            totalRoom += room;
            totalVideo += video;
            totalPhotomagnets += photomagnets;
            totalActor += actor;
            totalTotal += total;
          });
  
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>Сумма</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{totalGame}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{totalRoom}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{totalVideo}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{totalPhotomagnets}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text>{totalActor}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <Text>{totalTotal}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default App; 