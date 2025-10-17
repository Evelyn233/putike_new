import { create } from 'zustand'
import type { Article, AgentInfo } from '../types'

interface ArticleStore {
  // 智能体列表
  agents: AgentInfo[]
  setAgents: (agents: AgentInfo[]) => void

  // 文章列表
  articles: Article[]
  setArticles: (articles: Article[]) => void

  // 当前文章
  currentArticle: Article | null
  setCurrentArticle: (article: Article | null) => void

  // 加载状态
  loading: boolean
  setLoading: (loading: boolean) => void

  // 错误信息
  error: string | null
  setError: (error: string | null) => void
}

export const useArticleStore = create<ArticleStore>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),

  articles: [],
  setArticles: (articles) => set({ articles }),

  currentArticle: null,
  setCurrentArticle: (currentArticle) => set({ currentArticle }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),
}))


