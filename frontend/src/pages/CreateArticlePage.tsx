import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Slider, 
  message, 
  Row, 
  Col,
  Tag,
  Divider 
} from 'antd'
import { ArrowLeftOutlined, SendOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { articlesApi } from '../services/api'
import type { Agent, CreateArticleRequest, AgentType } from '../types'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const CreateArticlePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  
  // 从URL参数获取选中的智能体信息
  const getAgentFromUrl = (): Agent | null => {
    const urlParams = new URLSearchParams(window.location.search)
    const agentParam = urlParams.get('agent')
    if (agentParam) {
      try {
        return JSON.parse(decodeURIComponent(agentParam))
      } catch (error) {
        console.error('Failed to parse agent parameter:', error)
        return null
      }
    }
    return null
  }
  
  const selectedAgent = getAgentFromUrl()

  const handleSubmit = async (values: any) => {
    if (!selectedAgent) {
      message.error('未选择智能体')
      return
    }

    try {
      setLoading(true)
      
      const request: CreateArticleRequest = {
        title: values.title,
        topic: values.topic,
        agent_type: 'creative' as AgentType, // 默认使用创意作家类型
        word_count: values.word_count || 1000,
        temperature: values.temperature || 0.7,
        style_requirements: values.style_requirements,
      }
      
      const article = await articlesApi.createArticle(request)
      
      message.success('文章创作任务已提交！正在生成中...')
      navigate(`/articles/${article.id}`)
      
    } catch (error: any) {
      message.error(error.response?.data?.detail || '创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/')
  }

  // 打开标题生成助手
  const handleOpenTitleAgent = () => {
    window.open('https://yuanqi.tencent.com/webim/#/chat/kVZmRQ?appid=1979017835515638528&experience=true', '_blank')
  }

  if (!selectedAgent) {
    return (
      <div style={{ 
        padding: '100px 50px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        minHeight: '100vh',
        color: '#fff'
      }}>
        <Title level={2} style={{ color: '#fff' }}>未选择智能体</Title>
        <Paragraph style={{ color: '#a8a8a8', marginBottom: '24px' }}>
          请从智能体架构页面选择一个智能体
        </Paragraph>
        <Button type="primary" onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
          返回选择智能体
        </Button>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '50px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 返回按钮 */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          style={{ marginBottom: '24px' }}
        >
          返回智能体架构
        </Button>

        <Row gutter={[24, 24]}>
          {/* 左侧：智能体信息 */}
          <Col xs={24} lg={8}>
            <Card
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '16px',
                height: 'fit-content',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
                  {selectedAgent.avatar}
                </div>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>
                  {selectedAgent.role}
                </Title>
                <Text style={{ color: '#667eea', fontSize: '1rem' }}>
                  {selectedAgent.specialization}
                </Text>
              </div>

              <Divider style={{ borderColor: 'rgba(102, 126, 234, 0.3)' }} />

              <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: '#a8a8a8', display: 'block', marginBottom: '8px' }}>
                  智能体描述：
                </Text>
                <Paragraph style={{ color: '#e0e0e0', margin: 0 }}>
                  {selectedAgent.description}
                </Paragraph>
              </div>

              <div>
                <Text style={{ color: '#a8a8a8', display: 'block', marginBottom: '12px' }}>
                  核心能力：
                </Text>
                <Space wrap>
                  {selectedAgent.capabilities.map((capability, index) => (
                    <Tag 
                      key={index} 
                      style={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '20px',
                        padding: '4px 12px',
                      }}
                    >
                      {capability}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Card>
          </Col>

          {/* 右侧：创作表单 */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <SendOutlined style={{ color: '#667eea' }} />
                  <span style={{ color: '#fff' }}>开始创作</span>
                </Space>
              }
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '16px',
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  word_count: 1000,
                  temperature: 0.7,
                }}
              >
                <Form.Item
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ color: '#fff' }}>文章标题</span>
                      <Button
                        size="small"
                        icon={<ThunderboltOutlined />}
                        onClick={handleOpenTitleAgent}
                        style={{
                          background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '0.85rem',
                        }}
                      >
                        AI标题建议
                      </Button>
                    </div>
                  }
                  name="title"
                  rules={[{ required: true, message: '请输入文章标题' }]}
                >
                  <Input 
                    placeholder="为你的文章起个标题（可使用AI标题助手获取灵感）" 
                    size="large"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      color: '#fff',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={{ color: '#fff' }}>写作主题</span>}
                  name="topic"
                  rules={[{ required: true, message: '请输入写作主题' }]}
                >
                  <TextArea
                    placeholder="描述你想要创作的主题和内容要点"
                    rows={4}
                    size="large"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      color: '#fff',
                    }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span style={{ color: '#fff' }}>字数要求</span>}
                      name="word_count"
                    >
                      <Slider
                        min={500}
                        max={5000}
                        step={100}
                        marks={{
                          500: '500字',
                          1000: '1000字',
                          2000: '2000字',
                          3000: '3000字',
                          5000: '5000字',
                        }}
                        trackStyle={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
                        handleStyle={{ borderColor: '#667eea' }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span style={{ color: '#fff' }}>创作温度</span>}
                      name="temperature"
                      tooltip="温度越高，创作越有创意；温度越低，创作越严谨"
                    >
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        marks={{
                          0: '严谨',
                          0.5: '平衡',
                          1: '创意',
                        }}
                        trackStyle={{ background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
                        handleStyle={{ borderColor: '#667eea' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span style={{ color: '#fff' }}>风格要求（可选）</span>}
                  name="style_requirements"
                >
                  <TextArea
                    placeholder="例如：幽默风趣、专业严谨、通俗易懂等"
                    rows={2}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      color: '#fff',
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading} 
                      size="large"
                      icon={<SendOutlined />}
                      style={{
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      }}
                    >
                      开始创作
                    </Button>
                    <Button 
                      onClick={() => form.resetFields()} 
                      size="large"
                      icon={<ReloadOutlined />}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        color: '#fff',
                      }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CreateArticlePage
