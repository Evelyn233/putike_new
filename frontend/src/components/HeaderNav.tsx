import { Layout, Menu, Button } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  FileTextOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  SearchOutlined,
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

  // 跳转到腾讯元器标题智能体
  const handleTitleAgentClick = () => {
    window.open('https://yuanqi.tencent.com/webim/#/chat/kVZmRQ?appid=1979017835515638528&experience=true', '_blank')
  }

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
        padding: '4px 12px',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo图片 */}
        <img 
          src="/logo.png"
          alt="PUTIKE & FEEKR Logo"
          style={{
            height: '40px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button
          type="text"
          icon={<ThunderboltOutlined />}
          onClick={handleTitleAgentClick}
          style={{
            color: '#ffd700',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            background: 'rgba(255, 215, 0, 0.1)',
            fontWeight: 'bold',
          }}
        >
          写作服务
        </Button>
        <Button
          type="text"
          style={{
            color: '#333333',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            background: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          案例展示
        </Button>
        <Button
          type="text"
          style={{
            color: '#333333',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            background: 'rgba(0, 0, 0, 0.05)',
          }}
        >
          帮助中心
        </Button>
        <Button
          type="text"
          icon={<SearchOutlined />}
          style={{
            color: '#333333',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            background: 'rgba(0, 0, 0, 0.05)',
          }}
        />
      </div>
    </Header>
  )
}

export default HeaderNav

