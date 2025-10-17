import { Routes, Route } from 'react-router-dom'
import { Layout, Typography } from 'antd'
import HomePage from './pages/HomePage'
import CreateArticlePage from './pages/CreateArticlePage'
import ArticleListPage from './pages/ArticleListPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import HeaderNav from './components/HeaderNav'
import './App.css'

const { Content, Footer } = Layout
const { Text } = Typography

function App() {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <HeaderNav />
      <Content style={{ padding: 0, marginTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateArticlePage />} />
          <Route path="/articles" element={<ArticleListPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
        </Routes>
      </Content>
      <Footer style={{ 
        background: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px 50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div>
          <Text style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.5' }}>
            © 2025 PUTIKE & FEEKR. All rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  )
}

export default App

