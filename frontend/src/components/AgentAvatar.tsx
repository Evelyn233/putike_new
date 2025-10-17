import React from 'react'

interface AgentAvatarProps {
  avatar: string
  size?: 'small' | 'medium' | 'large'
  glow?: boolean
}

const AgentAvatar: React.FC<AgentAvatarProps> = ({ 
  avatar, 
  size = 'medium', 
  glow = true 
}) => {
  const sizeMap = {
    small: '1.5rem',
    medium: '2rem',
    large: '3rem'
  }

  return (
    <div
      style={{
        fontSize: sizeMap[size],
        filter: glow ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.6))' : 'none',
        transition: 'all 0.3s ease',
      }}
      className={glow ? 'float-effect' : ''}
    >
      {avatar}
    </div>
  )
}

export default AgentAvatar

