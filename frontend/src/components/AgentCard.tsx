import { Card, Tag, Space } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import type { AgentInfo } from '../types'

interface AgentCardProps {
  agent: AgentInfo
  selected?: boolean
  onClick?: () => void
}

const AgentCard = ({ agent, selected, onClick }: AgentCardProps) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        height: '100%',
        border: selected ? '2px solid #1890ff' : '1px solid #d9d9d9',
        backgroundColor: selected ? '#e6f7ff' : '#fff',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <RobotOutlined style={{ fontSize: '24px', marginRight: '8px', color: '#1890ff' }} />
          <h3 style={{ margin: 0 }}>{agent.name}</h3>
        </div>
        
        <p style={{ color: '#666', minHeight: '60px' }}>
          {agent.description}
        </p>
        
        <div>
          <div style={{ marginBottom: '4px', fontSize: '12px', color: '#999' }}>
            擅长领域：
          </div>
          <Space size={[0, 8]} wrap>
            {agent.capabilities.slice(0, 4).map((cap, index) => (
              <Tag key={index} color="blue">
                {cap}
              </Tag>
            ))}
          </Space>
        </div>
      </Space>
    </Card>
  )
}

export default AgentCard


