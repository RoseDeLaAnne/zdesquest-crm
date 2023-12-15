import React, { FC, useState, useEffect, useRef } from "react";

// antd
import { Typography, Table } from "antd";

const { Text } = Typography;

const App: FC = ({ scroll, columns, dataSource, countingFields, isObj }) => {
  // console.log('columns', columns)

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

        // console.log('countingFields uitable', countingFields)

        // console.log('columns', columns)

        let total = [];
        for (const column of columns) {
          if (column.children) {
            for (const nestedColumn of column.children) {
              console.log(nestedColumn.key)
              total.push({
                key: nestedColumn.key,
                total: countingFields.includes(nestedColumn.key) ? 0 : null,
              });
            }
          }
          else {
            total.push({
              key: column.key,
              total: countingFields.includes(column.key) ? 0 : null,
            });
          }
        }

        dataSource.forEach((dataSourceColumns) => {
          if (
            dataSourceColumns.status !== "reset" &&
            dataSourceColumns.status !== "paid"
          ) {
            total.forEach((totalEach) => {
              if (totalEach.total !== null && isObj && dataSourceColumns[totalEach.key]) {
                totalEach.total += dataSourceColumns[totalEach.key].value;
              } else if (totalEach["key"] === "game") {
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
              {total.map((item, index) => (
                <Table.Summary.Cell index={index} key={index}>
                  {index === 0 ? "итого" : <Text>{total[index].total !== null ? total[index].total.toFixed(2) : null}</Text>}
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
