# MCP 服务器示例

这是一个用于 AI 写作平台的 MCP (Model Context Protocol) 服务器示例实现。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd mcp-server-example
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
MCP_PORT=3000
MCP_API_KEY=your_secret_key

# 各平台API密钥
WECHAT_API_KEY=your_wechat_key
ZHIHU_API_KEY=your_zhihu_key
JUEJIN_API_KEY=your_juejin_key
MEDIUM_API_KEY=your_medium_key
DEV_TO_API_KEY=your_dev_to_key
```

### 3. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动。

## 📡 API 接口

### 健康检查

```bash
GET http://localhost:3000/health
```

### MCP 接口

```bash
POST http://localhost:3000/mcp

{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "publish_article",
    "arguments": {
      "platform": "wechat",
      "title": "文章标题",
      "content": "文章内容...",
      "tags": ["技术", "AI"]
    }
  },
  "id": 1
}
```

## 🔌 集成平台

当前示例支持以下平台（需要实际API实现）：

- ✅ 微信公众号 (wechat)
- ✅ 知乎 (zhihu)
- ✅ 掘金 (juejin)
- ✅ Medium (medium)
- ✅ Dev.to (dev_to)

## 🛠️ 实现自己的发布逻辑

修改 `server.js` 中的发布方法：

```javascript
async publishToWechat(article) {
  // 替换为实际的微信公众号API调用
  const response = await fetch('https://api.weixin.qq.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WECHAT_API_KEY}`
    },
    body: JSON.stringify({
      title: article.title,
      content: article.content,
      // ...其他参数
    })
  });
  
  const data = await response.json();
  
  return {
    success: true,
    url: data.url,
    article_id: data.media_id,
    message: '发布成功'
  };
}
```

## 📝 测试

使用 curl 测试：

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "publish_article",
      "arguments": {
        "platform": "zhihu",
        "title": "测试文章",
        "content": "这是一篇测试文章",
        "tags": ["测试"]
      }
    },
    "id": 1
  }'
```

## 🔐 安全建议

1. 在生产环境中启用 API 密钥验证
2. 使用 HTTPS
3. 实现速率限制
4. 添加日志记录

## 📚 相关文档

- [MCP 协议文档](https://modelcontextprotocol.io/)
- [后端集成指南](../backend/MCP_SETUP.md)

