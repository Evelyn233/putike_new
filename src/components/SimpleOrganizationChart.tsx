import { useState } from 'react'
import { Card, Modal, Button, Typography, Space, Row, Col, message } from 'antd'
import { RobotOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

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

interface Department {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  agents: Agent[]
}

const SimpleOrganizationChart: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  // 组织架构数据
  const departments: Department[] = [
    {
      id: 'personalization',
      name: '人格化引擎',
      subtitle: '人设部门',
      icon: '👑',
      color: '#667eea',
      agents: [
        {
          id: 'founder-decoder',
          name: '创始人价值解码',
          role: '创始人价值解码',
          specialization: '商业洞察专家',
          department: 'personalization',
          avatar: '👨‍💼',
          description: '深度解析创始人的核心价值观和商业洞察，构建独特的人格化定位',
          capabilities: ['价值分析', '商业洞察', '定位策略']
        },
        {
          id: 'video-persona',
          name: '短视频人设建模',
          role: '短视频人设建模',
          specialization: '通用人设专家',
          department: 'personalization',
          avatar: '👩‍🎨',
          description: '基于短视频平台特点，构建符合用户喜好的个性化人设模型',
          capabilities: ['人设建模', '用户画像', '内容策略']
        },
        {
          id: 'ip-translator',
          name: '爆款IP翻译官',
          role: '爆款IP翻译官',
          specialization: '通用业务专家',
          department: 'personalization',
          avatar: '👩‍💻',
          description: '将热门IP元素转化为可执行的内容策略和营销方案',
          capabilities: ['IP分析', '趋势解读', '内容转化']
        }
      ]
    },
    {
      id: 'wisdom',
      name: '智慧中枢',
      subtitle: '知识部门',
      icon: '📚',
      color: '#764ba2',
      agents: [
        {
          id: 'competitor-analysis',
          name: '竞品情报分析',
          role: '竞品情报分析',
          specialization: '对标账号专家',
          department: 'wisdom',
          avatar: '👨‍🔬',
          description: '深度分析竞品策略，提供市场情报和竞争优势分析',
          capabilities: ['竞品分析', '市场调研', '策略建议']
        },
        {
          id: 'content-design-1',
          name: '内容设计',
          role: '内容设计',
          specialization: '选题专家',
          department: 'wisdom',
          avatar: '👨‍💼',
          description: '基于用户需求和市场趋势，策划高价值内容选题',
          capabilities: ['选题策划', '趋势分析', '内容规划']
        },
        {
          id: 'knowledge-graph',
          name: '知识图谱构建',
          role: '知识图谱构建',
          specialization: '专业知识专家',
          department: 'wisdom',
          avatar: '👨‍🎓',
          description: '构建专业知识体系，形成结构化的知识图谱',
          capabilities: ['知识管理', '体系构建', '专业研究']
        }
      ]
    },
    {
      id: 'creation',
      name: '创作工厂',
      subtitle: '内容部门',
      icon: '🏭',
      color: '#f093fb',
      agents: [
        {
          id: 'traffic-capture-1',
          name: '流量捕获',
          role: '流量捕获',
          specialization: '钩子专家',
          department: 'creation',
          avatar: '👩‍🎤',
          description: '设计吸引用户注意力的开头和标题，提升点击率',
          capabilities: ['标题优化', '开头设计', '吸引力提升']
        },
        {
          id: 'title-generator',
          name: '标题智能体',
          role: '标题生成专家',
          specialization: '爆款标题创作',
          department: 'creation',
          avatar: '💡',
          description: '专注于创作高转化率的爆款标题，结合热点和用户心理，提升内容传播力',
          capabilities: ['爆款标题', '热点结合', '转化优化', '心理洞察']
        },
        {
          id: 'dissemination-1',
          name: '传播优化',
          role: '传播优化',
          specialization: '风格专家',
          department: 'creation',
          avatar: '👩‍🎨',
          description: '优化内容风格，提升传播效果和用户粘性',
          capabilities: ['风格优化', '传播策略', '用户粘性']
        },
        {
          id: 'multimodal-1',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '音频专家',
          department: 'creation',
          avatar: '👨‍🎵',
          description: '制作高质量的音频内容，包括配音、音效等',
          capabilities: ['音频制作', '配音技术', '音效设计']
        }
      ]
    },
    {
      id: 'decision',
      name: '决策大脑',
      subtitle: '数据部门',
      icon: '🧠',
      color: '#4facfe',
      agents: [
        {
          id: 'multimodal-5',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '照片推理专家',
          department: 'decision',
          avatar: '👨‍💻',
          description: '基于照片进行智能推理和分析，提取关键信息',
          capabilities: ['图像分析', '智能推理', '信息提取']
        },
        {
          id: 'intelligence-system',
          name: '情报侦察系统',
          role: '情报侦察系统',
          specialization: '数据搜索',
          department: 'decision',
          avatar: '👩‍💻',
          description: '构建智能情报收集和分析系统',
          capabilities: ['情报收集', '数据分析', '系统构建']
        },
        {
          id: 'decision-hub',
          name: '智能决策中枢',
          role: '智能决策中枢',
          specialization: '数据分析',
          department: 'decision',
          avatar: '👨‍💻',
          description: '基于数据分析提供智能决策建议',
          capabilities: ['数据分析', '决策支持', '智能建议']
        }
      ]
    }
  ]

  const handleAgentClick = (agent: Agent) => {
    // 如果是标题智能体，直接跳转到外部链接
    if (agent.id === 'title-generator') {
      window.open('https://yuanqi.tencent.com/webim/#/chat/QTWTsO?appid=1979009080824591104&experience=true', '_blank')
      return
    }
    setSelectedAgent(agent)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedAgent(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff'
    }}>
      {/* 主标题 */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ color: '#ffffff', fontSize: '3rem', marginBottom: '16px' }}>
          <RobotOutlined style={{ color: '#667eea', marginRight: '16px' }} />
          AI写作智能体组织架构
        </Title>
        <Text style={{ color: '#a8a8a8', fontSize: '1.2rem' }}>
          多维度专业智能体协同创作系统
        </Text>
      </div>

      {/* 部门展示 */}
      <Row gutter={[24, 48]}>
        {departments.map((dept) => (
          <Col xs={24} lg={12} key={dept.id}>
            <Card
              title={
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{dept.icon}</div>
                  <Title level={3} style={{ color: '#fff', margin: 0 }}>{dept.name}</Title>
                  <Text style={{ color: dept.color }}>{dept.subtitle}</Text>
                </div>
              }
              style={{
                background: `linear-gradient(135deg, ${dept.color}15 0%, ${dept.color}25 100%)`,
                border: `2px solid ${dept.color}`,
                borderRadius: '16px',
                boxShadow: `0 0 30px ${dept.color}30`,
              }}
            >
              <Row gutter={[16, 16]}>
                {dept.agents.map((agent) => (
                  <Col xs={24} sm={12} md={8} key={agent.id}>
                    <Card
                      hoverable
                      onClick={() => handleAgentClick(agent)}
                      style={{
                        background: `linear-gradient(135deg, ${dept.color}20 0%, ${dept.color}30 100%)`,
                        border: `1px solid ${dept.color}`,
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '160px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        {agent.avatar}
                      </div>
                      <Title level={5} style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.9rem' }}>
                        {agent.role}
                      </Title>
                      <Text style={{ color: dept.color, fontSize: '0.8rem' }}>
                        {agent.specialization}
                      </Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 智能体详情模态框 */}
      <Modal
        title={
          <Space>
            <span style={{ fontSize: '2rem' }}>{selectedAgent?.avatar}</span>
            <div>
              <Title level={4} style={{ margin: 0, color: '#fff' }}>
                {selectedAgent?.role}
              </Title>
              <Text type="secondary" style={{ color: '#a8a8a8' }}>
                {selectedAgent?.specialization}
              </Text>
            </div>
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            关闭
          </Button>,
          <Button 
            key="select" 
            type="primary" 
            onClick={() => {
              handleCloseModal()
              message.info(`您选择了：${selectedAgent?.role}（演示版本）`)
            }}
          >
            选择此智能体
          </Button>
        ]}
        style={{ background: 'rgba(0, 0, 0, 0.8)' }}
        width={600}
      >
        {selectedAgent && (
          <div style={{ color: '#fff' }}>
            <Text style={{ color: '#e0e0e0', fontSize: '1rem', lineHeight: '1.6', display: 'block', marginBottom: '24px' }}>
              {selectedAgent.description}
            </Text>
            <div>
              <Title level={5} style={{ color: '#ffffff', marginBottom: '12px' }}>核心能力：</Title>
              <Space wrap>
                {selectedAgent.capabilities.map((capability, index) => (
                  <span 
                    key={index} 
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      margin: '4px',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    {capability}
                  </span>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SimpleOrganizationChart

