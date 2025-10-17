import axios from 'axios'
import type {
  AgentInfo,
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  HistoryVersion,
} from '../types'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 60000, // 60秒超时，考虑到AI生成可能需要时间
})

// 智能体相关API / Agents API
export const agentsApi = {
  // 获取所有智能体
  listAgents: async (): Promise<AgentInfo[]> => {
    const { data } = await api.get('/agents/')
    return data
  },

  // 获取指定智能体信息
  getAgent: async (agentType: string): Promise<AgentInfo> => {
    const { data } = await api.get(`/agents/${agentType}`)
    return data
  },
}

// 文章相关API / Articles API
export const articlesApi = {
  // 创建文章
  createArticle: async (articleData: CreateArticleRequest): Promise<Article> => {
    const { data } = await api.post('/articles/', articleData)
    return data
  },

  // 获取文章列表
  listArticles: async (params?: {
    status?: string
    agent_type?: string
    limit?: number
    offset?: number
  }): Promise<Article[]> => {
    const { data } = await api.get('/articles/', { params })
    return data
  },

  // 获取指定文章
  getArticle: async (articleId: number): Promise<Article> => {
    const { data } = await api.get(`/articles/${articleId}`)
    return data
  },

  // 更新文章
  updateArticle: async (
    articleId: number,
    updates: UpdateArticleRequest
  ): Promise<Article> => {
    const { data } = await api.put(`/articles/${articleId}`, updates)
    return data
  },

  // 删除文章
  deleteArticle: async (articleId: number): Promise<void> => {
    await api.delete(`/articles/${articleId}`)
  },

  // 获取文章历史
  getArticleHistory: async (articleId: number): Promise<HistoryVersion[]> => {
    const { data } = await api.get(`/articles/${articleId}/history`)
    return data
  },
}

// 导出相关API / Export API
export const exportApi = {
  // 导出文章
  exportArticle: async (articleId: number, format: 'txt' | 'md' | 'html'): Promise<void> => {
    window.open(`/api/v1/export/${articleId}/${format}`, '_blank')
  },

  // 预览文章
  previewArticle: async (articleId: number, format: 'md' | 'html'): Promise<string> => {
    const { data } = await api.get(`/export/${articleId}/preview/${format}`)
    return data
  },
}

// 发布相关API / Publish API
export const publishApi = {
  // 发布文章到平台
  publishArticle: async (
    articleId: number,
    platforms: string[],
    tags: string[] = [],
    coverImage?: string,
    isDraft: boolean = false
  ): Promise<any> => {
    const { data } = await api.post('/publish/publish', {
      article_id: articleId,
      platforms,
      tags,
      cover_image: coverImage,
      is_draft: isDraft,
    })
    return data
  },

  // 获取支持的平台列表
  getSupportedPlatforms: async (): Promise<string[]> => {
    const { data } = await api.get('/publish/platforms')
    return data.platforms
  },

  // 获取文章发布信息
  getArticlePublishedInfo: async (articleId: number): Promise<any> => {
    const { data } = await api.get(`/publish/article/${articleId}/published-info`)
    return data
  },

  // 更新已发布的文章
  updatePublishedArticle: async (
    platform: string,
    articleId: string,
    updates: {
      title?: string
      content?: string
      tags?: string[]
    }
  ): Promise<any> => {
    const { data } = await api.put('/publish/update-published', {
      platform,
      article_id: articleId,
      ...updates,
    })
    return data
  },

  // 删除已发布的文章
  deletePublishedArticle: async (platform: string, articleId: string): Promise<any> => {
    const { data } = await api.delete(`/publish/${platform}/${articleId}`)
    return data
  },
}

export default api


