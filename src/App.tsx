import { Layout } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import SimpleOrganizationChart from './components/SimpleOrganizationChart'
import './App.css'

const { Header, Content } = Layout

function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header 
        style={{ 
          position: 'fixed', 
          zIndex: 1000, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(26, 26, 46, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.3)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ 
          color: '#fff', 
          fontSize: '20px', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center',
          textShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
        }}>
          <RobotOutlined style={{ marginRight: '8px', color: '#667eea' }} />
          AI写作智能体平台
        </div>
      </Header>
      <Content style={{ padding: 0, marginTop: 64 }}>
        <SimpleOrganizationChart />
      </Content>
    </Layout>
  )
}

export default App

