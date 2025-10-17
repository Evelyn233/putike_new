// 智能体类型 / Agent Types
export enum AgentType {
  JOURNALIST = 'journalist',
  ACADEMIC = 'academic',
  CREATIVE = 'creative',
  BUSINESS = 'business',
  TECHNICAL = 'technical',
  SCREENWRITER = 'screenwriter',
  SEO = 'seo',
  SOCIAL_MEDIA = 'social_media',
}

// 文章状态 / Article Status
export enum ArticleStatus {
  DRAFT = 'draft',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// 智能体信息 / Agent Information
export interface AgentInfo {
  type: AgentType
  name: string
  description: string
  capabilities: string[]
  model: string
}

// 文章 / Article
export interface Article {
  id: number
  title: string
  topic: string
  content?: string
  agent_type: AgentType
  status: ArticleStatus
  word_count: number
  temperature: number
  tokens_used: number
  generation_time: number
  created_at: string
}

// 创建文章请求 / Create Article Request
export interface CreateArticleRequest {
  title: string
  topic: string
  agent_type: AgentType
  word_count?: number
  temperature?: number
  style_requirements?: string
}

// 更新文章请求 / Update Article Request
export interface UpdateArticleRequest {
  title?: string
  content?: string
  status?: ArticleStatus
}

// 历史版本 / History Version
export interface HistoryVersion {
  id: number
  version: number
  content: string
  parameters: Record<string, any>
  created_at: string
}




