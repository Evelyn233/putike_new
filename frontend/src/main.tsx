import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App.tsx'
import './styles/global.css'

// AI写作平台配置
const appConfig = {
  title: 'AI写作平台 - 多智能体写作助手',
  description: '基于多智能体的智能写作平台，提供8种专业写作助手',
  version: '1.0.0'
}

// 设置页面标题
document.title = appConfig.title

// Ant Design主题配置
const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider 
        locale={zhCN}
        theme={themeConfig}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

