import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";

interface BreadcrumbItem {
  text: string;
  link?: string;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb
      style={{
        margin: "24px 16px 0",
        textTransform: "lowercase",
        letterSpacing: "0.1em",
      }}
    >
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.link ? (
            <Link to={item.link}>{item.text}</Link>
          ) : (
            <span>{item.text}</span>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
