import { useEffect, useState } from 'react'
import { Row, Col, Typography, message, Spin, Card, Button, Space, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ThunderboltOutlined, SearchOutlined } from '@ant-design/icons'
import AgentCard from '../components/AgentCard'
import ArticleEditor from '../components/ArticleEditor'
import { agentsApi } from '../services/api'
import { useArticleStore } from '../stores/useArticleStore'
import type { AgentInfo } from '../types'

const { Title, Paragraph, Text } = Typography

interface OrgAgent {
  id: string
  name: string
  role: string
  specialization: string
  department: string
  avatar: string
  description: string
  capabilities: string[]
  isExternal?: boolean
  externalUrl?: string
}

const HomePage = () => {
  const navigate = useNavigate()
  const { agents, setAgents } = useArticleStore()
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedOrgAgent, setSelectedOrgAgent] = useState<OrgAgent | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleArticleCreated = (articleId: number) => {
    // 跳转到文章详情页
    navigate(`/articles/${articleId}`)
  }

  // 打开标题生成助手
  const handleOpenTitleAgent = () => {
    window.open('https://yuanqi.tencent.com/webim/#/chat/kVZmRQ?appid=1979017835515638528&experience=true', '_blank')
  }

  // 处理智能体点击
  const handleAgentClick = (agent: OrgAgent) => {
    if (agent.isExternal && agent.externalUrl) {
      window.open(agent.externalUrl, '_blank')
      return
    }
    setSelectedOrgAgent(agent)
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalVisible(false)
    setSelectedOrgAgent(null)
  }

  // 定义所有智能体数据
  const orgAgents: Record<string, OrgAgent> = {
    founder: {
      id: 'founder-decoder',
      name: '创始人价值解码',
      role: '创始人价值解码',
      specialization: '商业洞察专家',
      department: 'personalization',
      avatar: '👨‍💼',
      description: '深度解析创始人的核心价值观和商业洞察，构建独特的人格化定位',
      capabilities: ['价值分析', '商业洞察', '定位策略']
    },
    videoPersona: {
      id: 'video-persona',
      name: '短视频人设建模',
      role: '短视频人设建模',
      specialization: '通用人设专家',
      department: 'personalization',
      avatar: '👩‍🎨',
      description: '基于短视频平台特点，构建符合用户喜好的个性化人设模型',
      capabilities: ['人设建模', '用户画像', '内容策略']
    },
    ipTranslator: {
      id: 'ip-translator',
      name: '爆款IP翻译官',
      role: '爆款IP翻译官',
      specialization: '通用业务专家',
      department: 'personalization',
      avatar: '👩‍💻',
      description: '将热门IP元素转化为可执行的内容策略和营销方案',
      capabilities: ['IP分析', '趋势解读', '内容转化']
    },
    competitor: {
      id: 'competitor-analysis',
      name: '竞品情报分析',
      role: '竞品情报分析',
      specialization: '对标账号专家',
      department: 'wisdom',
      avatar: '👨‍🔬',
      description: '深度分析竞品策略，提供市场情报和竞争优势分析',
      capabilities: ['竞品分析', '市场调研', '策略建议']
    },
    contentDesign: {
      id: 'content-design',
      name: '内容设计',
      role: '内容设计',
      specialization: '选题专家',
      department: 'wisdom',
      avatar: '👨‍💼',
      description: '基于用户需求和市场趋势，策划高价值内容选题',
      capabilities: ['选题策划', '趋势分析', '内容规划']
    },
    knowledgeGraph: {
      id: 'knowledge-graph',
      name: '知识图谱构建',
      role: '知识图谱构建',
      specialization: '专业知识专家',
      department: 'wisdom',
      avatar: '👨‍🎓',
      description: '构建专业知识体系，形成结构化的知识图谱',
      capabilities: ['知识管理', '体系构建', '专业研究']
    },
    shundeFoodGuide: {
      id: 'shunde-food-guide',
      name: '顺德美食旅游攻略',
      role: '美食旅游顾问',
      specialization: '顺德美食专家',
      department: 'wisdom',
      avatar: '🍜',
      description: '提供专业的顺德美食旅游攻略，带你吃遍顺德特色美食，配图版详细指南',
      capabilities: ['美食推荐', '旅游规划', '地道体验', '配图攻略'],
      isExternal: true,
      externalUrl: 'https://space.coze.cn/share/7551670233943392562?share_id=7551676178559582464&secret=MyxY5dR4&from=home_case_list'
    },
    titleGenerator: {
      id: 'title-generator',
      name: '璞缇客标题生成助手',
      role: '璞缇客标题生成助手',
      specialization: '腾讯元器',
      department: 'creation',
      avatar: '⚡',
      description: '由腾讯元器提供支持，专业的标题优化智能体。一键生成吸引眼球的标题，多种风格可选，显著提升点击率',
      capabilities: ['智能标题生成', '多风格输出', '点击率优化', '关键词提取'],
      isExternal: true,
      externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/kVZmRQ?appid=1979017835515638528&experience=true'
    },
    tasteTitleGenerator: {
      id: 'taste-title-generator',
      name: '寻味标题智能体',
      role: '寻味标题智能体',
      specialization: '美食标题专家',
      department: 'creation',
      avatar: '🍴',
      description: '专注美食领域的标题创作，结合美食文化和旅游体验，打造吸引眼球的美食标题',
      capabilities: ['美食标题', '文化融合', '旅游体验', '吸引力优化'],
      isExternal: true,
      externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/QTWTsO?appid=1979009080824591104&experience=true'
    },
    feekrTitleGenerator: {
      id: 'feekr-title-generator',
      name: 'Feekr标题智能体',
      role: 'Feekr标题智能体',
      specialization: '腾讯元器',
      department: 'creation',
      avatar: '💫',
      description: '专业的Feekr品牌标题生成智能体，由腾讯元器提供支持，打造符合品牌调性的标题',
      capabilities: ['品牌标题', '智能生成', '风格定制', '点击优化'],
      isExternal: true,
      externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/uKtAAr?appid=1983113539579839424&experience=true'
    },
    feekrIntroGenerator: {
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
    tastePlanetIntroGenerator: {
      id: 'taste-planet-intro-generator',
      name: '寻味星球引言智能体',
      role: '寻味星球引言智能体',
      specialization: '美食引言专家',
      department: 'creation',
      avatar: '🌍',
      description: '专业的寻味星球引言创作智能体，专注于美食旅游领域的引言创作，打造引人入胜的美食故事开头',
      capabilities: ['美食引言', '旅游故事', '文化融合', '情感共鸣'],
      isExternal: true,
      externalUrl: 'https://yuanqi.tencent.com/webim/#/chat/IWjiGJ?appid=1980513123539008256&experience=true'
    },
    trafficCapture: {
      id: 'traffic-capture',
      name: '流量捕获',
      role: '流量捕获',
      specialization: '钩子专家',
      department: 'creation',
      avatar: '👩‍🎤',
      description: '设计吸引用户注意力的开头和标题，提升点击率',
      capabilities: ['标题优化', '开头设计', '吸引力提升']
    },
    dissemination: {
      id: 'dissemination',
      name: '传播优化',
      role: '传播优化',
      specialization: '风格专家',
      department: 'creation',
      avatar: '👩‍🎨',
      description: '优化内容风格，提升传播效果和用户粘性',
      capabilities: ['风格优化', '传播策略', '用户粘性']
    },
    multimodalAudio: {
      id: 'multimodal-audio',
      name: '多模态制作',
      role: '多模态制作',
      specialization: '音频专家',
      department: 'creation',
      avatar: '👨‍🎵',
      description: '制作高质量的音频内容，包括配音、音效等',
      capabilities: ['音频制作', '配音技术', '音效设计']
    },
    multimodalPhoto: {
      id: 'multimodal-photo',
      name: '多模态制作',
      role: '多模态制作',
      specialization: '照片推理专家',
      department: 'decision',
      avatar: '👨‍💻',
      description: '基于照片进行智能推理和分析，提取关键信息',
      capabilities: ['图像分析', '智能推理', '信息提取']
    },
    intelligence: {
      id: 'intelligence-system',
      name: '情报侦察系统',
      role: '情报侦察系统',
      specialization: '数据搜索',
      department: 'decision',
      avatar: '👩‍💻',
      description: '构建智能情报收集和分析系统',
      capabilities: ['情报收集', '数据分析', '系统构建']
    },
    decisionHub: {
      id: 'decision-hub',
      name: '智能决策中枢',
      role: '智能决策中枢',
      specialization: '数据分析',
      department: 'decision',
      avatar: '👨‍💻',
      description: '基于数据分析提供智能决策建议',
      capabilities: ['数据分析', '决策支持', '智能建议']
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 浮动圆点装饰 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {/* 浮动圆点 */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* 主内容区域 */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* 主标题区域 */}
        <div style={{ 
          textAlign: 'center', 
          padding: '120px 20px 80px 20px',
          position: 'relative',
          zIndex: 2
        }}>
          <Title level={1} style={{ 
            color: '#ffffff', 
            fontSize: '4.5rem', 
            marginBottom: '30px',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            letterSpacing: '2px'
          }}>
            璞缇客内容引擎
          </Title>
          <Text style={{ 
            color: '#e0e0e0', 
            fontSize: '1.4rem',
            display: 'block',
            marginBottom: '15px',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 15px auto'
          }}>
            AI智能体协同创作系统
          </Text>
      </div>

        {/* 智能体架构区域 */}
        <div style={{ 
          maxWidth: '1600px', 
          margin: '0 auto', 
          padding: '0 20px 100px 20px',
          position: 'relative',
          zIndex: 2
        }}>
          <Row gutter={[40, 40]}>
            {/* 第一行：人格化引擎 + 智慧中枢 */}
            <Col xs={24} lg={12}>
          {/* 人格化引擎 */}
          <div style={{ 
            marginBottom: '0',
            border: '2px solid rgba(102, 126, 234, 0.6)',
            borderRadius: '24px',
            padding: '40px 30px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👑</div>
              <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
                人格化引擎
              </Title>
              <Text style={{ color: '#667eea', fontSize: '1rem' }}>人设部门</Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.founder)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.15)',
                    border: '2px solid #667eea',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#667eea'
                  }}>
                    👨‍💼
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    创始人价值解码
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    商业洞察专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.videoPersona)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.15)',
                    border: '2px solid #667eea',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#667eea'
                  }}>
                    👩‍🎨
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    短视频人设建模
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    通用人设专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.ipTranslator)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.15)',
                    border: '2px solid #667eea',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#667eea'
                  }}>
                    👩‍💻
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    爆款IP翻译官
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    通用业务专家
                  </Text>
                </Card>
              </Col>
            </Row>
      </div>
            </Col>
            
            <Col xs={24} lg={12}>
          {/* 智慧中枢 */}
          <div style={{ 
            marginBottom: '0',
            border: '2px solid rgba(118, 75, 162, 0.6)',
            borderRadius: '24px',
            padding: '40px 30px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📚</div>
              <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
                智慧中枢
              </Title>
              <Text style={{ color: '#764ba2', fontSize: '1rem' }}>知识部门</Text>
            </div>
      <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(118, 75, 162, 0.15)',
                    border: '2px solid #764ba2',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(118, 75, 162, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#764ba2'
                  }}>
                    👨‍🔬
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    竞品情报分析
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    对标账号专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(118, 75, 162, 0.15)',
                    border: '2px solid #764ba2',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(118, 75, 162, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#764ba2'
                  }}>
                    👨‍💼
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    内容设计
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    选题专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(118, 75, 162, 0.15)',
                    border: '2px solid #764ba2',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(118, 75, 162, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#764ba2'
                  }}>
                    👨‍🎓
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    知识图谱构建
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    专业知识专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => {
                    if (orgAgents.shundeFoodGuide.externalUrl) {
                      window.open(orgAgents.shundeFoodGuide.externalUrl, '_blank')
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.25) 0%, rgba(102, 126, 234, 0.25) 100%)',
                    border: '2px solid rgba(118, 75, 162, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(118, 75, 162, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #764ba2, #667eea)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#764ba2'
                  }}>
                    🍜
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    顺德美食旅游攻略
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    顺德美食专家
                  </Text>
                </Card>
                </Col>
            </Row>
          </div>
            </Col>
          </Row>
          
          <Row gutter={[40, 40]}>
            {/* 第二行：创作工厂 + 决策大脑 */}
            <Col xs={24} lg={12}>
          {/* 创作工厂 */}
          <div style={{ 
            marginBottom: '0',
            border: '2px solid rgba(240, 147, 251, 0.6)',
            borderRadius: '24px',
            padding: '40px 30px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🏭</div>
              <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
                创作工厂
              </Title>
              <Text style={{ color: '#f093fb', fontSize: '1rem' }}>内容部门</Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.titleGenerator)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(245, 87, 108, 0.25) 100%)',
                    border: '2px solid rgba(245, 87, 108, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    ⚡
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    璞缇客标题生成助手
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    腾讯元器
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => {
                    if (orgAgents.feekrIntroGenerator.externalUrl) {
                      window.open(orgAgents.feekrIntroGenerator.externalUrl, '_blank')
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(245, 87, 108, 0.25) 100%)',
                    border: '2px solid rgba(245, 87, 108, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    ✨
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    Feekr引言智能体
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    引言创作专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => {
                    if (orgAgents.tastePlanetIntroGenerator.externalUrl) {
                      window.open(orgAgents.tastePlanetIntroGenerator.externalUrl, '_blank')
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(245, 87, 108, 0.25) 100%)',
                    border: '2px solid rgba(245, 87, 108, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    🌍
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    寻味星球引言智能体
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    美食引言专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(240, 147, 251, 0.15)',
                    border: '2px solid #f093fb',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    👩‍🎤
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    流量捕获
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    钩子专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(240, 147, 251, 0.15)',
                    border: '2px solid #f093fb',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    👩‍🎨
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    传播优化
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    风格专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(240, 147, 251, 0.15)',
                    border: '2px solid #f093fb',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    👨‍🎵
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    多模态制作
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    音频专家
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.tasteTitleGenerator)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(245, 87, 108, 0.25) 100%)',
                    border: '2px solid rgba(245, 87, 108, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    🍴
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    寻味标题智能体
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    美食标题专家
                  </Text>
          </Card>
                </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  onClick={() => handleAgentClick(orgAgents.feekrTitleGenerator)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(245, 87, 108, 0.25) 100%)',
                    border: '2px solid rgba(245, 87, 108, 0.8)',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(245, 87, 108, 0.4)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}>
                    外部
                  </div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#f093fb'
                  }}>
                    💫
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    Feekr标题智能体
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    腾讯元器
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
            
            <Col xs={24} lg={12}>
          {/* 决策大脑 */}
          <div style={{ 
            marginBottom: '0',
            border: '2px solid rgba(79, 172, 254, 0.6)',
            borderRadius: '24px',
            padding: '40px 30px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🧠</div>
              <Title level={2} style={{ color: '#ffffff', margin: 0 }}>
                决策大脑
              </Title>
              <Text style={{ color: '#4facfe', fontSize: '1rem' }}>战略部门</Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(79, 172, 254, 0.15)',
                    border: '2px solid #4facfe',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#4facfe'
                  }}>
                    👩‍💻
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    情报侦察系统
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    数据搜索
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(79, 172, 254, 0.15)',
                    border: '2px solid #4facfe',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#4facfe'
                  }}>
                    👨‍💻
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    智能决策中枢
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    数据分析
                  </Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  style={{
                    background: 'rgba(79, 172, 254, 0.15)',
                    border: '2px solid #4facfe',
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '30px 20px' }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: '15px',
                    color: '#4facfe'
                  }}>
                    📊
                  </div>
                  <Text style={{ 
                    color: '#ffffff', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word'
                  }}>
                    数据分析中心
                  </Text>
                  <Text style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem'
                  }}>
                    战略决策
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
            </Col>
          </Row>
        </div>

        {/* 创作面板 */}

        {/* 智能体详情模态框 */}
        <Modal
          title={
            <Space>
              <span style={{ fontSize: '2rem' }}>{selectedOrgAgent?.avatar}</span>
              <div>
                <Title level={4} style={{ margin: 0, color: '#fff' }}>
                  {selectedOrgAgent?.role}
                </Title>
                <Text type="secondary" style={{ color: '#a8a8a8' }}>
                  {selectedOrgAgent?.specialization}
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
            selectedOrgAgent?.isExternal ? (
              <Button 
                key="external" 
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={() => {
                  if (selectedOrgAgent?.externalUrl) {
                    window.open(selectedOrgAgent.externalUrl, '_blank')
                  }
                  handleCloseModal()
                }}
                style={{
                  background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                  border: 'none',
                }}
              >
                访问外部链接
              </Button>
            ) : (
              <Button 
                key="select" 
                type="primary" 
                onClick={() => {
                  handleCloseModal()
                  message.info('此智能体功能正在开发中')
                }}
              >
                选择此智能体
              </Button>
            )
          ]}
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          width={600}
        >
          {selectedOrgAgent && (
            <div style={{ color: '#fff' }}>
              <Text style={{ color: '#e0e0e0', fontSize: '1rem', lineHeight: '1.6', display: 'block', marginBottom: '24px' }}>
                {selectedOrgAgent.description}
              </Text>
              <div>
                <Title level={5} style={{ color: '#ffffff', marginBottom: '12px' }}>核心能力：</Title>
                <Space wrap>
                  {selectedOrgAgent.capabilities.map((capability, index) => (
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
    </div>
  )
}

export default HomePage


