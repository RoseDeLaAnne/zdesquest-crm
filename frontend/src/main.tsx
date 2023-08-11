import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.sass'

import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={ruRU}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  </ConfigProvider>
)
