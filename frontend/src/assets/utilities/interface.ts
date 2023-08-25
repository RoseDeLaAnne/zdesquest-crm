import { ReactNode } from "react";

// IFC
export interface IFC {
  title: string;
  breadcrumbItems: IBreadcrumbItem[];
  defaultOpenKeys: string[];
  defaultSelectedKeys: string[];
  children: ReactNode;
}

// Sider
export interface IFCSider {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  defaultOpenKeys: string[];
  defaultSelectedKeys: string[];
}

// Breadcrumb
export interface IBreadcrumbItemMenuItems {
  key: string;
  label: ReactNode;
}
export interface IBreadcrumbItemMenu {
  items: IBreadcrumbItemMenuItems[];
}
export interface IBreadcrumbItem {
  title: ReactNode;
  menu?: IBreadcrumbItemMenu;
}
export interface IBreadcrumb {
  items: IBreadcrumbItem[];
}
