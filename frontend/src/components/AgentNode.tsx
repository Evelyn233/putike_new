import React from 'react'
import { Card, Tooltip } from 'antd'

interface Agent {
  id: string
  name: string
  role: string
  specialization: string
  department: string
  avatar: string
  description: string
  capabilities: string[]
}

interface AgentNodeProps {
  agent: Agent
  onClick: () => void
}

const AgentNode: React.FC<AgentNodeProps> = ({ agent, onClick }) => {
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'personalization':
        return '#667eea'
      case 'wisdom':
        return '#764ba2'
      case 'creation':
        return '#f093fb'
      case 'decision':
        return '#4facfe'
      default:
        return '#667eea'
    }
  }

  const color = getDepartmentColor(agent.department)

  return (
    <Tooltip
      title={
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            {agent.role}
          </div>
          <div style={{ marginBottom: '8px', color: '#e0e0e0' }}>
            {agent.description}
          </div>
          <div style={{ color: color }}>
            能力: {agent.capabilities.join(', ')}
          </div>
        </div>
      }
      placement="top"
      color="rgba(0, 0, 0, 0.8)"
    >
      <Card
        className="agent-node"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
          border: `2px solid ${color}`,
          borderRadius: '50%',
          width: '120px',
          height: '120px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '12px',
          boxShadow: `0 0 20px ${color}40`,
        }}
        onClick={onClick}
        hoverable
      >
        {/* 发光效果 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            opacity: 0.8,
            borderRadius: '50%',
          }}
        />
        
        {/* 头像 */}
        <div
          style={{
            fontSize: '2rem',
            marginBottom: '8px',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
          }}
        >
          {agent.avatar}
        </div>
        
        {/* 角色名称 */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: '600',
            lineHeight: '1.2',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {agent.role}
        </div>
        
        {/* 专业领域 */}
        <div
          style={{
            color: color,
            fontSize: '0.7rem',
            fontWeight: '400',
            opacity: 0.9,
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            lineHeight: '1.1',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {agent.specialization}
        </div>
        
        {/* 悬浮效果 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, ${color}30 50%, transparent 70%)`,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            borderRadius: '50%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0'
          }}
        />
      </Card>
    </Tooltip>
  )
}

export default AgentNode
