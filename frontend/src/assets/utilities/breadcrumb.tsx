import React from "react";

// react-router-dom
import { Link } from "react-router-dom";

export function generateBreadcrumbItems(sourceBreadcrumbItemsWithDefault) {
  const breadcrumbItems = [];

  for (let i = 0; i < sourceBreadcrumbItemsWithDefault.length; i++) {
    const item = sourceBreadcrumbItemsWithDefault[i];
    const isLast = i === sourceBreadcrumbItemsWithDefault.length - 1;

    const titleContent = (
      <>
        {item.icon && <item.icon />}
        <span style={{ marginLeft: "8px" }}>{item.title}</span>
      </>
    );

    const breadcrumbItem = isLast
      ? { title: titleContent }
      : {
          title: <Link to={item.to}>{titleContent}</Link>,
        };

    if (item.menu) {
      const breadcrumbSubItems = [];

      for (const subItem of item.menu) {
        breadcrumbSubItems.push({
          key: subItem.key,
          label: (
            <Link to={subItem.to}>
              {subItem.icon && <subItem.icon />}
              <span style={{ marginLeft: "8px" }}>{subItem.label}</span>
            </Link>
          ),
        });
      }

      breadcrumbItem.menu = { items: breadcrumbSubItems };
    }

    breadcrumbItems.push(breadcrumbItem);
  }

  return breadcrumbItems;
}
