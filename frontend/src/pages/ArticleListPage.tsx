import { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, message, Card, Typography } from 'antd'
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { articlesApi } from '../services/api'
import type { Article, ArticleStatus } from '../types'

const { Title } = Typography

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

const ArticleListPage = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArticles()
    
    // 每5秒自动刷新一次（检查生成状态）
    const interval = setInterval(() => {
      loadArticles()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const data = await articlesApi.listArticles()
      setArticles(data)
    } catch (error) {
      message.error('加载文章列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await articlesApi.deleteArticle(id)
      message.success('删除成功')
      loadArticles()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: '主题',
      dataIndex: 'topic',
      key: 'topic',
      ellipsis: true,
    },
    {
      title: '智能体',
      dataIndex: 'agent_type',
      key: 'agent_type',
      width: 150,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ArticleStatus) => (
        <Tag color={statusColors[status]}>{statusTexts[status]}</Tag>
      ),
    },
    {
      title: '字数',
      dataIndex: 'word_count',
      key: 'word_count',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Article) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/articles/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '50px 0' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>我的文章</Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadArticles}
            loading={loading}
          >
            刷新
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 篇文章`,
          }}
        />
      </Card>
    </div>
  )
}

export default ArticleListPage


