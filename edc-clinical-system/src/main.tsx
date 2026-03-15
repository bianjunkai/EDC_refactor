import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { antdTheme } from './constants/theme'
import router from './router'
import { PermissionProvider } from './contexts/PermissionContext'

// 导入设计系统 CSS 变量
import './styles/variables.css'

// 设置 antd 中文语言
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <PermissionProvider initialRole="admin">
        <RouterProvider router={router} />
      </PermissionProvider>
    </ConfigProvider>
  </React.StrictMode>
)
