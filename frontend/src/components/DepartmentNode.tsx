import React from 'react'
import { Card } from 'antd'
import { CrownOutlined, BookOutlined, ThunderboltOutlined, BulbOutlined } from '@ant-design/icons'

interface Department {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  agents: any[]
}

interface DepartmentNodeProps {
  department: Department
  onClick: () => void
}

const DepartmentNode: React.FC<DepartmentNodeProps> = ({ department, onClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case '👑':
        return <CrownOutlined style={{ fontSize: '2rem', color: '#667eea' }} />
      case '📚':
        return <BookOutlined style={{ fontSize: '2rem', color: '#764ba2' }} />
      case '🏭':
        return <ThunderboltOutlined style={{ fontSize: '2rem', color: '#f093fb' }} />
      case '🧠':
        return <BulbOutlined style={{ fontSize: '2rem', color: '#4facfe' }} />
      default:
        return <span style={{ fontSize: '2rem' }}>{iconName}</span>
    }
  }

  return (
    <Card
      className="department-node"
      style={{
        background: `linear-gradient(135deg, ${department.color}15 0%, ${department.color}25 100%)`,
        border: `2px solid ${department.color}`,
        borderRadius: '16px',
        boxShadow: `0 0 30px ${department.color}30`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
      onClick={onClick}
      hoverable
    >
      {/* 发光效果 */}
      <div
        className="glow-effect"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, transparent 30%, ${department.color}20 50%, transparent 70%)`,
          opacity: 0.3,
          animation: 'glow 3s ease-in-out infinite',
        }}
      />
      
      {/* 图标 */}
      <div style={{ marginBottom: '12px' }}>
        {getIcon(department.icon)}
      </div>
      
      {/* 标题 */}
      <h3
        style={{
          color: '#ffffff',
          fontSize: '1.4rem',
          fontWeight: '600',
          margin: '0 0 8px 0',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        }}
      >
        {department.name}
      </h3>
      
      {/* 副标题 */}
      <p
        style={{
          color: department.color,
          fontSize: '0.9rem',
          fontWeight: '400',
          margin: 0,
          opacity: 0.8,
        }}
      >
        {department.subtitle}
      </p>
      
      {/* 智能体数量指示器 */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: department.color,
          color: '#ffffff',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: `0 0 10px ${department.color}50`,
        }}
      >
        {department.agents.length}
      </div>
    </Card>
  )
}

export default DepartmentNode

