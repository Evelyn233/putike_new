import React, { useState, useEffect } from 'react'
import { Card, Modal, Button, Typography, Space } from 'antd'
import { RobotOutlined, CrownOutlined, ThunderboltOutlined } from '@ant-design/icons'
import AgentAvatar from './AgentAvatar'
import DepartmentNode from './DepartmentNode'
import AgentNode from './AgentNode'
import ConnectionLine from './ConnectionLine'
import { Agent as AgentType } from '../types'
import './OrganizationChart.css'

const { Title, Text } = Typography

interface Department {
  id: string
  name: string
  subtitle: string
  icon: string
  color: string
  agents: AgentType[]
}

const OrganizationChart: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null)
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
        },
        {
          id: 'content-design-2',
          name: '内容设计',
          role: '内容设计',
          specialization: '结构专家',
          department: 'wisdom',
          avatar: '👩‍💼',
          description: '设计内容结构框架，确保逻辑清晰和信息传达有效',
          capabilities: ['结构设计', '逻辑梳理', '信息架构']
        },
        {
          id: 'content-design-3',
          name: '内容设计',
          role: '内容设计',
          specialization: '观点专家',
          department: 'wisdom',
          avatar: '👨‍🏫',
          description: '提炼核心观点，构建独特的价值主张和思想体系',
          capabilities: ['观点提炼', '价值主张', '思想体系']
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
          id: 'title-generator',
          name: 'FEEKR标题生成助手',
          role: 'FEEKR标题生成助手',
          specialization: '腾讯元器',
          department: 'creation',
          avatar: '⚡',
          description: '由腾讯元器提供支持，专业的标题优化智能体。一键生成吸引眼球的标题，多种风格可选，显著提升点击率',
          capabilities: ['智能标题生成', '多风格输出', '点击率优化', '关键词提取'],
          isExternal: true,
          externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/kVZmRQ?appid=1979017835515638528&experience=true'
        },
        {
          id: 'feekr-intro-generator',
          name: 'Feekr引言智能体',
          role: 'Feekr引言智能体',
          specialization: '引言创作专家',
          department: 'creation',
          avatar: '✨',
          description: '专业的引言创作智能体，能够生成吸引人的开头引言，提升文章阅读体验和用户粘性',
          capabilities: ['引言创作', '开头优化', '吸引力提升', '阅读体验'],
          isExternal: true,
          externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/WeHSfY?appid=1980477689380362432&experience=true'
        },
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
        },
        {
          id: 'traffic-capture-2',
          name: '流量捕获',
          role: '流量捕获',
          specialization: '开头专家',
          department: 'creation',
          avatar: '👩‍💼',
          description: '设计引人入胜的开头，快速抓住用户注意力',
          capabilities: ['开头设计', '注意力引导', '用户留存']
        },
        {
          id: 'dissemination-2',
          name: '传播优化',
          role: '传播优化',
          specialization: '标题专家',
          department: 'creation',
          avatar: '👨‍💼',
          description: '创作高转化率的标题，提升内容的传播力',
          capabilities: ['标题创作', '转化优化', '传播力提升']
        },
        {
          id: 'multimodal-2',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '音色专家',
          department: 'creation',
          avatar: '👨‍🎤',
          description: '优化音色表现，打造独特的听觉体验',
          capabilities: ['音色优化', '听觉体验', '声音品牌']
        },
        {
          id: 'traffic-capture-3',
          name: '流量捕获',
          role: '流量捕获',
          specialization: '文案专家',
          department: 'creation',
          avatar: '👩‍✍️',
          description: '创作高质量的营销文案，提升转化效果',
          capabilities: ['文案创作', '转化优化', '营销策略']
        },
        {
          id: 'dissemination-3',
          name: '传播优化',
          role: '传播优化',
          specialization: '洗稿专家',
          department: 'creation',
          avatar: '👨‍✍️',
          description: '优化内容表达，提升传播效果和原创性',
          capabilities: ['内容优化', '原创性提升', '表达优化']
        },
        {
          id: 'multimodal-3',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '视频专家',
          department: 'creation',
          avatar: '👨‍🎬',
          description: '制作高质量的视频内容，包括剪辑、特效等',
          capabilities: ['视频制作', '剪辑技术', '特效设计']
        },
        {
          id: 'traffic-capture-4',
          name: '流量捕获',
          role: '流量捕获',
          specialization: '润色专家',
          department: 'creation',
          avatar: '👩‍🎨',
          description: '润色和优化内容，提升质量和可读性',
          capabilities: ['内容润色', '质量提升', '可读性优化']
        },
        {
          id: 'multimodal-4',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '封面专家',
          department: 'creation',
          avatar: '👩‍🎨',
          description: '设计吸引人的封面和视觉元素',
          capabilities: ['封面设计', '视觉设计', '品牌形象']
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
          id: 'multimodal-6',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '人物复刻专家',
          department: 'decision',
          avatar: '👩‍🎭',
          description: '基于数据复刻人物特征和行为模式',
          capabilities: ['人物建模', '行为分析', '特征提取']
        },
        {
          id: 'purification-center',
          name: '信息提纯中心',
          role: '信息提纯中心',
          specialization: '数据清洗',
          department: 'decision',
          avatar: '👩‍🔬',
          description: '清洗和提纯数据，确保数据质量和准确性',
          capabilities: ['数据清洗', '质量提升', '信息提纯']
        },
        {
          id: 'multimodal-7',
          name: '多模态制作',
          role: '多模态制作',
          specialization: '字幕专家',
          department: 'decision',
          avatar: '👩‍💼',
          description: '制作高质量的字幕和文本内容',
          capabilities: ['字幕制作', '文本优化', '多语言支持']
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
        },
        {
          id: 'data-catcher',
          name: '数据捕网手',
          role: '数据捕网手',
          specialization: '爬虫专家',
          department: 'decision',
          avatar: '👨‍🔬',
          description: '构建高效的数据采集和分析系统',
          capabilities: ['数据采集', '爬虫技术', '系统优化']
        }
      ]
    }
  ]

  const handleAgentClick = (agent: AgentType) => {
    setSelectedAgent(agent)
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedAgent(null)
  }

  return (
    <div className="organization-chart">
      {/* 背景装饰 */}
      <div className="background-decoration">
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }} />
          ))}
        </div>
      </div>

      {/* 主标题 */}
      <div 
        className="chart-header"
        style={{ 
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'all 0.6s ease'
        }}
      >
        <Title level={1} className="main-title">
          <RobotOutlined className="title-icon" />
          AI写作智能体组织架构
        </Title>
        <Text className="subtitle">
          多维度专业智能体协同创作系统
        </Text>
      </div>

      {/* 组织架构图 */}
      <div className="chart-container">
        {/* 顶层部门节点 */}
        <div className="departments-row">
          {departments.map((dept, index) => (
            <div
              key={dept.id}
              className="department-wrapper"
              style={{ 
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'all 0.5s ease',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <DepartmentNode
                department={dept}
                onClick={() => {}}
              />
            </div>
          ))}
        </div>

        {/* 连接线 */}
        <div className="connection-lines">
          {departments.map((dept) => (
            dept.agents.map((agent, index) => (
              <ConnectionLine
                key={`${dept.id}-${agent.id}`}
                from={dept.id}
                to={agent.id}
                delay={index * 0.1}
              />
            ))
          ))}
        </div>

        {/* 智能体节点 */}
        <div className="agents-container">
          {departments.map((dept, deptIndex) => (
            <div key={dept.id} className="department-agents">
              {dept.agents.map((agent, agentIndex) => (
                <div
                  key={agent.id}
                  className="agent-wrapper"
                  style={{ 
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'all 0.5s ease',
                    transitionDelay: `${0.2 + deptIndex * 0.1 + agentIndex * 0.05}s`
                  }}
                >
                  <AgentNode
                    agent={agent}
                    onClick={() => handleAgentClick(agent)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 智能体详情模态框 */}
      <Modal
        title={
          <Space>
            <span className="agent-avatar-large">{selectedAgent?.avatar}</span>
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
          <Button key="select" type="primary" onClick={() => {
            handleCloseModal()
            // 跳转到创作页面，传递智能体信息
            window.location.href = `/create?agent=${encodeURIComponent(JSON.stringify(selectedAgent))}`
          }}>
            选择此智能体
          </Button>
        ]}
        className="agent-modal"
        width={600}
      >
        {selectedAgent && (
          <div className="agent-details">
            <Text className="agent-description">
              {selectedAgent.description}
            </Text>
            <div className="agent-capabilities">
              <Title level={5}>核心能力：</Title>
              <Space wrap>
                {selectedAgent.capabilities.map((capability, index) => (
                  <span key={index} className="capability-tag">
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

export default OrganizationChart
