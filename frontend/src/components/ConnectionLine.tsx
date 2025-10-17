import React, { useEffect, useRef } from 'react'

interface ConnectionLineProps {
  from: string
  to: string
  delay?: number
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ from, to, delay = 0 }) => {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lineRef.current) {
        lineRef.current.style.opacity = '1'
      }
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      ref={lineRef}
      className="connection-line"
      style={{
        position: 'absolute',
        opacity: 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* 这里可以根据需要实现连接线的绘制逻辑 */}
      <div
        style={{
          position: 'absolute',
          width: '2px',
          height: '60px',
          background: 'linear-gradient(180deg, #667eea 0%, transparent 100%)',
          boxShadow: '0 0 10px rgba(102, 126, 234, 0.6)',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
    </div>
  )
}

export default ConnectionLine

