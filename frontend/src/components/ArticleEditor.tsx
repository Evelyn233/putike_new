import { Input, Form, Slider, Button, Space, message } from 'antd'
import { useState } from 'react'
import type { AgentInfo, CreateArticleRequest } from '../types'
import { articlesApi } from '../services/api'

const { TextArea } = Input

interface ArticleEditorProps {
  selectedAgent: AgentInfo
  onArticleCreated: (articleId: number) => void
}

const ArticleEditor = ({ selectedAgent, onArticleCreated }: ArticleEditorProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      
      const request: CreateArticleRequest = {
        title: values.title,
        topic: values.topic,
        agent_type: selectedAgent.type,
        word_count: values.word_count || 1000,
        temperature: values.temperature || 0.7,
        style_requirements: values.style_requirements,
      }
      
      const article = await articlesApi.createArticle(request)
      
      message.success('文章创作任务已提交！正在生成中...')
      onArticleCreated(article.id)
      
      // 重置表单
      form.resetFields()
      
    } catch (error: any) {
      message.error(error.response?.data?.detail || '创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
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
        label="文章标题"
        name="title"
        rules={[{ required: true, message: '请输入文章标题' }]}
      >
        <Input placeholder="为你的文章起个标题" size="large" />
      </Form.Item>

      <Form.Item
        label="写作主题"
        name="topic"
        rules={[{ required: true, message: '请输入写作主题' }]}
      >
        <TextArea
          placeholder="描述你想要创作的主题和内容要点"
          rows={4}
          size="large"
        />
      </Form.Item>

      <Form.Item label="字数要求" name="word_count">
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
        />
      </Form.Item>

      <Form.Item
        label="创作温度"
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
        />
      </Form.Item>

      <Form.Item label="风格要求（可选）" name="style_requirements">
        <TextArea
          placeholder="例如：幽默风趣、专业严谨、通俗易懂等"
          rows={2}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            开始创作
          </Button>
          <Button onClick={() => form.resetFields()} size="large">
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default ArticleEditor


