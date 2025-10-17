import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const { Header } = Layout

const HeaderNav = () => {
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/articles',
      icon: <FileTextOutlined />,
      label: <Link to="/articles">我的文章</Link>,
    },
  ]

  return (
    <Header 
      style={{ 
        position: 'fixed', 
        zIndex: 1000, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
        padding: '0 24px',
      }}
    >
      <div style={{ 
        marginRight: '50px', 
        display: 'flex', 
        alignItems: 'center',
        background: '#ffffff',
        padding: '5px 14px',
        borderRadius: '7px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo图片 */}
        <img 
          src="/logo.png"
          alt="PUTIKE & FEEKR Logo"
          style={{
            height: '50px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ 
          flex: 1, 
          minWidth: 0,
          background: 'transparent',
          borderBottom: 'none',
        }}
      />
    </Header>
  )
}

export default HeaderNav

