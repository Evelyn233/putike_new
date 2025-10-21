import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Spin,
  Button,
  Space,
  Tag,
  message,
  Typography,
  Divider,
  Tabs,
  Input,
  Modal,
} from 'antd'
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  EditOutlined,
  SaveOutlined,
  ReloadOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { articlesApi, exportApi, publishApi } from '../services/api'
import type { Article, ArticleStatus } from '../types'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

const statusColors: Record<ArticleStatus, string> = {
  draft: 'default',
  generating: 'processing',
  completed: 'success',
  failed: 'error',
}

const statusTexts: Record<ArticleStatus, string> = {
  draft: '草稿',
  generating: '生成中',
  completed: '已完成',
  failed: '失败',
}

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [publishModalVisible, setPublishModalVisible] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [supportedPlatforms, setSupportedPlatforms] = useState<string[]>([])
  const [publishLoading, setPublishLoading] = useState(false)
  const [publishedInfo, setPublishedInfo] = useState<any>(null)

  useEffect(() => {
    if (id) {
      loadArticle(parseInt(id))
      loadSupportedPlatforms()
      loadPublishedInfo(parseInt(id))
      
      // 如果正在生成，每3秒刷新一次
      const interval = setInterval(() => {
        if (article?.status === 'generating') {
          loadArticle(parseInt(id), true)
        }
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [id, article?.status])

  const loadSupportedPlatforms = async () => {
    try {
      const platforms = await publishApi.getSupportedPlatforms()
      setSupportedPlatforms(platforms)
    } catch (error) {
      console.error('Failed to load platforms:', error)
    }
  }

  const loadPublishedInfo = async (articleId: number) => {
    try {
      const info = await publishApi.getArticlePublishedInfo(articleId)
      setPublishedInfo(info)
    } catch (error) {
      console.error('Failed to load published info:', error)
    }
  }

  const loadArticle = async (articleId: number, silent = false) => {
    try {
      if (!silent) setLoading(true)
      const data = await articlesApi.getArticle(articleId)
      setArticle(data)
      setEditedContent(data.content || '')
    } catch (error) {
      message.error('加载文章失败')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!article) return
    
    try {
      await articlesApi.updateArticle(article.id, {
        content: editedContent,
      })
      message.success('保存成功')
      setEditing(false)
      loadArticle(article.id)
    } catch (error) {
      message.error('保存失败')
    }
  }

  const handleExport = (format: 'txt' | 'md' | 'html') => {
    if (!article) return
    exportApi.exportArticle(article.id, format)
  }

  const handlePublish = async () => {
    if (!article || selectedPlatforms.length === 0) {
      message.warning('请至少选择一个发布平台')
      return
    }

    try {
      setPublishLoading(true)
      const result = await publishApi.publishArticle(
        article.id,
        selectedPlatforms
      )
      
      if (result.success) {
        message.success(result.message)
        setPublishModalVisible(false)
        loadPublishedInfo(article.id)
      } else {
        message.error(result.message)
      }
    } catch (error: any) {
      message.error(error.message || '发布失败')
    } finally {
      setPublishLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Title level={3}>文章不存在</Title>
        <Button onClick={() => navigate('/articles')}>返回列表</Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '50px 0' }}>
      <Card>
        {/* 头部操作栏 */}
        <Space style={{ marginBottom: '24px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/articles')}
          >
            返回列表
          </Button>
          {article.status === 'completed' && (
            <>
              <Button
                icon={<SendOutlined />}
                type="primary"
                onClick={() => setPublishModalVisible(true)}
                style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  border: 'none',
                }}
              >
                发布到平台
              </Button>
              <Button
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
                type={editing ? 'primary' : 'default'}
                onClick={() => {
                  if (editing) {
                    handleSave()
                  } else {
                    setEditing(true)
                  }
                }}
              >
                {editing ? '保存' : '编辑'}
              </Button>
              <Button.Group>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('txt')}
                >
                  TXT
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('md')}
                >
                  Markdown
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('html')}
                >
                  HTML
                </Button>
              </Button.Group>
            </>
          )}
          {article.status === 'generating' && (
            <Button
              icon={<ReloadOutlined spin />}
              onClick={() => loadArticle(article.id)}
            >
              生成中...
            </Button>
          )}
        </Space>

        {/* 文章信息 */}
        <div>
          <Title level={2}>{article.title}</Title>
          <Space size="large" style={{ marginBottom: '16px' }}>
            <Text type="secondary">
              智能体: <Tag color="blue">{article.agent_type}</Tag>
            </Text>
            <Text type="secondary">
              状态: <Tag color={statusColors[article.status]}>{statusTexts[article.status]}</Tag>
            </Text>
            <Text type="secondary">字数: {article.word_count}</Text>
            <Text type="secondary">
              Tokens: {article.tokens_used}
            </Text>
            {article.generation_time > 0 && (
              <Text type="secondary">
                生成时间: {article.generation_time.toFixed(2)}秒
              </Text>
            )}
          </Space>
          <Paragraph>
            <Text strong>主题: </Text>
            <Text>{article.topic}</Text>
          </Paragraph>
        </div>

        <Divider />

        {/* 文章内容 */}
        {article.status === 'generating' && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text type="secondary">AI正在为您创作中，请稍候...</Text>
            </div>
          </div>
        )}

        {article.status === 'failed' && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#ff4d4f' }}>
            <Title level={4}>生成失败</Title>
            <Paragraph>请稍后重试或联系管理员</Paragraph>
          </div>
        )}

        {article.status === 'completed' && (
          <Tabs
            defaultActiveKey="preview"
            items={[
              {
                key: 'preview',
                label: '📄 预览',
                children: editing ? (
                  <TextArea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={20}
                    style={{ fontFamily: 'monospace' }}
                  />
                ) : (
                  <div style={{ 
                    padding: '24px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    lineHeight: '1.8',
                  }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          const isInline = props && 'inline' in props ? props.inline : false
                          return !isInline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow as any}
                              language={match[1]}
                              PreTag="div"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props as any}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {article.content || ''}
                    </ReactMarkdown>
                  </div>
                ),
              },
              {
                key: 'raw',
                label: '📝 原始文本',
                children: (
                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '4px',
                  }}>
                    {article.content}
                  </pre>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* 发布模态框 */}
      <Modal
        title={
          <Space>
            <SendOutlined />
            <span>发布文章到平台</span>
          </Space>
        }
        open={publishModalVisible}
        onOk={handlePublish}
        onCancel={() => setPublishModalVisible(false)}
        confirmLoading={publishLoading}
        okText="确认发布"
        cancelText="取消"
        width={600}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text>选择要发布的平台：</Text>
        </div>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {supportedPlatforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform)
              const isPublished = publishedInfo?.published_platforms?.[platform]
              
              return (
                <Button
                  key={platform}
                  size="large"
                  icon={isPublished ? <CheckCircleOutlined /> : null}
                  type={isSelected ? 'primary' : 'default'}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
                    } else {
                      setSelectedPlatforms([...selectedPlatforms, platform])
                    }
                  }}
                  style={{
                    background: isPublished 
                      ? 'linear-gradient(45deg, #52c41a, #95de64)' 
                      : isSelected 
                      ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                      : undefined,
                    border: isPublished || isSelected ? 'none' : undefined,
                    color: isPublished || isSelected ? '#fff' : undefined,
                  }}
                >
                  {platform}
                </Button>
              )
            })}
          </div>

          {publishedInfo && publishedInfo.total_platforms > 0 && (
            <div style={{ marginTop: '16px' }}>
              <Divider />
              <Title level={5}>已发布平台：</Title>
              {Object.entries(publishedInfo.published_platforms || {}).map(([platform, info]: [string, any]) => (
                <div key={platform} style={{ marginBottom: '8px' }}>
                  <Tag color="success" icon={<CheckCircleOutlined />}>
                    {platform}
                  </Tag>
                  {info.url && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => window.open(info.url, '_blank')}
                    >
                      查看链接
                    </Button>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {info.published_at}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}

export default ArticleDetailPage


