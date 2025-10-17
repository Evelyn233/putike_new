# MCP 服务集成指南

## 📖 概述

本项目已集成 **MCP (Model Context Protocol)** 服务，用于实现文章自动发布到多个平台的功能。

## 🏗️ 架构说明

```
AI写作平台
    ↓
后端API (FastAPI)
    ↓
MCP Client (Python)
    ↓
MCP Server (独立服务)
    ↓
目标平台 (微信公众号/知乎/掘金/Medium等)
```

## 🚀 快速开始

### 1. 配置环境变量

在 `backend/.env` 文件中添加以下配置：

```env
# MCP 服务器配置
MCP_SERVER_URL=http://localhost:3000
MCP_API_KEY=your_mcp_api_key_here

# 平台 API 密钥（根据需要配置）
WECHAT_API_KEY=your_wechat_key
ZHIHU_API_KEY=your_zhihu_key
JUEJIN_API_KEY=your_juejin_key
MEDIUM_API_KEY=your_medium_key
```

### 2. 启动 MCP 服务器

MCP 服务器是一个独立的服务，需要单独部署。

#### 选项 A：使用官方 MCP 服务器

```bash
# 安装 MCP 服务器
npm install -g @modelcontextprotocol/server

# 启动服务器
mcp-server start --port 3000
```

#### 选项 B：使用自定义 MCP 服务器

创建一个 Node.js MCP 服务器：

```javascript
// mcp-server.js
const express = require('express');
const app = express();

app.use(express.json());

// MCP 接口
app.post('/mcp', async (req, res) => {
  const { method, params } = req.body;
  
  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    
    if (name === 'publish_article') {
      // 实现发布逻辑
      const result = await publishArticle(args);
      res.json({
        jsonrpc: "2.0",
        result: result,
        id: req.body.id
      });
    }
  }
});

app.listen(3000, () => {
  console.log('MCP Server running on port 3000');
});
```

### 3. 实现发布服务

创建各个平台的发布适配器：

```javascript
// publishers/wechat.js
async function publishToWechat(article) {
  // 微信公众号发布逻辑
  const response = await fetch('https://api.weixin.qq.com/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WECHAT_API_KEY}`
    },
    body: JSON.stringify({
      title: article.title,
      content: article.content,
      // ...
    })
  });
  
  return {
    url: response.data.url,
    article_id: response.data.id,
    message: '发布成功'
  };
}

// publishers/zhihu.js
async function publishToZhihu(article) {
  // 知乎发布逻辑
  // ...
}
```

## 📝 API 使用说明

### 发布文章

```bash
POST /api/v1/publish/publish

{
  "article_id": 1,
  "platforms": ["wechat", "zhihu", "juejin"],
  "tags": ["技术", "AI", "写作"],
  "cover_image": "https://example.com/cover.jpg",
  "is_draft": false
}
```

**响应示例**：

```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "platform": "wechat",
      "url": "https://mp.weixin.qq.com/s/xxxxx",
      "article_id": "12345",
      "message": "发布成功"
    },
    {
      "success": true,
      "platform": "zhihu",
      "url": "https://zhuanlan.zhihu.com/p/xxxxx",
      "article_id": "67890",
      "message": "发布成功"
    }
  ],
  "message": "发布完成: 2 成功, 0 失败"
}
```

### 获取支持的平台列表

```bash
GET /api/v1/publish/platforms
```

**响应示例**：

```json
{
  "platforms": ["wechat", "zhihu", "juejin", "medium", "dev_to"],
  "total": 5
}
```

### 获取文章发布信息

```bash
GET /api/v1/publish/article/{article_id}/published-info
```

## 🔌 支持的平台

### 1. 微信公众号 (wechat)
- **API 文档**: https://developers.weixin.qq.com/doc/
- **配置项**: `WECHAT_API_KEY`

### 2. 知乎 (zhihu)
- **API 文档**: https://github.com/zhihu/zhihu-api
- **配置项**: `ZHIHU_API_KEY`

### 3. 掘金 (juejin)
- **API 文档**: https://juejin.cn/api
- **配置项**: `JUEJIN_API_KEY`

### 4. Medium (medium)
- **API 文档**: https://github.com/Medium/medium-api-docs
- **配置项**: `MEDIUM_API_KEY`

### 5. Dev.to (dev_to)
- **API 文档**: https://developers.forem.com/api
- **配置项**: `DEV_TO_API_KEY`

## 🛠️ 自定义平台

要添加新的发布平台，需要：

1. 在 MCP 服务器中创建新的发布适配器
2. 实现发布、更新、删除等接口
3. 在平台列表中注册新平台

示例：

```javascript
// publishers/custom-platform.js
class CustomPlatformPublisher {
  async publish(article) {
    // 实现发布逻辑
    return {
      url: 'https://custom-platform.com/article/123',
      article_id: '123',
      message: '发布成功'
    };
  }
  
  async update(articleId, updates) {
    // 实现更新逻辑
  }
  
  async delete(articleId) {
    // 实现删除逻辑
  }
}
```

## 🔐 安全建议

1. **API 密钥管理**
   - 不要将 API 密钥提交到版本控制系统
   - 使用环境变量或密钥管理服务
   - 定期轮换密钥

2. **访问控制**
   - 在 MCP 服务器上实现身份验证
   - 使用 HTTPS 加密通信
   - 限制请求频率

3. **错误处理**
   - 捕获并记录所有错误
   - 不要在响应中暴露敏感信息
   - 实现重试机制

## 📊 监控和日志

建议在 MCP 服务器中添加：

1. **请求日志**：记录所有发布请求
2. **错误监控**：追踪失败的发布任务
3. **性能指标**：监控响应时间和成功率

## 🚨 故障排除

### 问题 1：连接 MCP 服务器失败

**解决方案**：
- 检查 `MCP_SERVER_URL` 配置是否正确
- 确认 MCP 服务器是否正在运行
- 检查防火墙和网络设置

### 问题 2：发布失败

**解决方案**：
- 检查平台 API 密钥是否有效
- 查看 MCP 服务器日志
- 确认文章格式是否符合平台要求

### 问题 3：部分平台发布成功，部分失败

这是正常的，因为发布是并行进行的。查看响应中每个平台的具体错误信息。

## 📞 技术支持

- **MCP 协议文档**: https://modelcontextprotocol.io/
- **项目仓库**: [GitHub 链接]
- **问题反馈**: [Issue 链接]

## 🔄 版本历史

- **v1.0.0** (2024-10): 初始版本，支持基本发布功能
- 支持平台：微信公众号、知乎、掘金、Medium、Dev.to

---

**注意**：MCP 服务需要单独部署和配置。请根据实际需求选择合适的部署方案。

