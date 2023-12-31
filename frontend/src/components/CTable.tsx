import React, { FC, useState, useEffect, useRef } from "react";

// antd
import { Typography, Table } from "antd";

const { Text } = Typography;

const App: FC = ({ scroll, columns, dataSource, countingFields, isObj }) => {
  return (
    <Table
      scroll={scroll}
      columns={columns}
      dataSource={dataSource}
      bordered
      summary={() => {
        if (dataSource.length === 0 || countingFields.length === 0) {
          return null;
        }

        let total = [];
        for (const column of columns) {
          total.push({
            key: column.key,
            total: countingFields.includes(column.key) ? 0 : null,
          });
        }

        dataSource.forEach((dataSourceColumns) => {
          if (dataSourceColumns.status !== "reset" && dataSourceColumns.status !== "paid") {
            total.forEach((totalEach) => {
              if (totalEach.total !== null && isObj) {
                totalEach.total += dataSourceColumns[totalEach.key].value;
              } else if (totalEach.total !== null && !isObj) {
                totalEach.total += dataSourceColumns[totalEach.key];
              }
            });
          }
        });

        return (
          <>
            <Table.Summary.Row>
              {columns.map((item, index) => (
                // <Table.Summary.Cell index={index + 1} key={index}>
                <Table.Summary.Cell index={index} key={index}>
                  {index === 0 ? "итого" : <Text>{total[index].total}</Text>}
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          </>
        );
      }}
    />
  );
};

export default App;
