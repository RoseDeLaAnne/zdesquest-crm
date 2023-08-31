import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";

// stylesheets
import "./index.sass";

// title
import "./assets/stylesheets/title.sass";

// menu
import "./assets/stylesheets/menu.sass";

// breadcrumb
import "./assets/stylesheets/breadcrumb.sass";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={ruRU}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ConfigProvider>
);
