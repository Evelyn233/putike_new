# 📖 MCP 服务自动发布功能完整指南

## ✅ 已完成的集成

我已经为您的 AI 写作平台完整集成了 **MCP (Model Context Protocol)** 服务，实现了自动发布文章到多个平台的功能。

## 🏗️ 系统架构

```
┌─────────────────┐
│  前端界面        │
│  - 发布按钮      │
│  - 平台选择      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  后端 API        │
│  FastAPI         │
│  /api/v1/publish │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MCP Client      │
│  Python          │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MCP Server      │
│  Node.js         │
│  (独立服务)      │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────┐
│  目标平台                        │
│  - 微信公众号                    │
│  - 知乎                          │
│  - 掘金                          │
│  - Medium                        │
│  - Dev.to                        │
└─────────────────────────────────┘
```

## 📁 新增文件

### 后端文件

1. **`backend/app/mcp/__init__.py`** - MCP 模块初始化
2. **`backend/app/mcp/client.py`** - MCP 客户端实现
3. **`backend/app/mcp/publisher.py`** - 文章发布器
4. **`backend/app/routers/publish.py`** - 发布 API 路由
5. **`backend/MCP_SETUP.md`** - 详细设置文档

### 前端文件

1. **`frontend/src/services/api.ts`** - 添加了 publishApi
2. **`frontend/src/pages/ArticleDetailPage.tsx`** - 添加了发布UI

### MCP 服务器示例

1. **`mcp-server-example/server.js`** - Node.js MCP 服务器
2. **`mcp-server-example/package.json`** - 依赖配置
3. **`mcp-server-example/README.md`** - 服务器文档

## 🚀 快速启动步骤

### 步骤 1：配置后端环境变量

在 `backend/.env` 中添加：

```env
# MCP 服务器配置
MCP_SERVER_URL=http://localhost:3000
MCP_API_KEY=your_mcp_api_key

# 平台 API 密钥
WECHAT_API_KEY=your_wechat_key
ZHIHU_API_KEY=your_zhihu_key
JUEJIN_API_KEY=your_juejin_key
MEDIUM_API_KEY=your_medium_key
DEV_TO_API_KEY=your_dev_to_key
```

### 步骤 2：启动 MCP 服务器

```bash
# 进入 MCP 服务器目录
cd mcp-server-example

# 安装依赖
npm install

# 启动服务器
npm start
```

服务器将在 `http://localhost:3000` 运行。

### 步骤 3：启动后端服务

```bash
cd backend
conda activate aimedia
python -m uvicorn app.main:app --reload --port 8000
```

### 步骤 4：启动前端服务

```bash
cd frontend
npm run dev
```

## 💡 使用方法

### 在前端界面发布文章

1. **创建并生成文章**
   - 选择智能体
   - 填写标题和主题
   - 点击"开始创作"
   - 等待生成完成

2. **发布文章**
   - 在文章详情页点击 **"发布到平台"** 按钮
   - 选择要发布的平台（可多选）
   - 点击"确认发布"
   - 等待发布完成

3. **查看发布状态**
   - 发布成功的平台会显示绿色标记 ✅
   - 可以点击链接查看已发布的文章

### 通过 API 发布

```bash
curl -X POST http://localhost:8000/api/v1/publish/publish \
  -H "Content-Type: application/json" \
  -d '{
    "article_id": 1,
    "platforms": ["wechat", "zhihu"],
    "tags": ["AI", "写作"],
    "is_draft": false
  }'
```

## 🔌 API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/publish/publish` | POST | 发布文章到平台 |
| `/api/v1/publish/platforms` | GET | 获取支持的平台列表 |
| `/api/v1/publish/article/{id}/published-info` | GET | 获取文章发布信息 |
| `/api/v1/publish/update-published` | PUT | 更新已发布的文章 |
| `/api/v1/publish/{platform}/{article_id}` | DELETE | 删除已发布的文章 |

## 🎨 前端新增功能

### 1. 文章详情页新增按钮

- **"发布到平台"** 按钮（渐变紫色）
- 点击后弹出平台选择模态框

### 2. 发布模态框

- 显示所有支持的平台
- 已发布的平台显示绿色标记
- 可以查看已发布文章的链接
- 支持多选平台同时发布

## 🔧 自定义平台

### 添加新平台（例如：博客园）

#### 1. 在 MCP 服务器中添加发布方法

```javascript
// mcp-server-example/server.js

async publishToCnblogs(article) {
  const response = await fetch('https://api.cnblogs.com/articles', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CNBLOGS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: article.title,
      body: article.content,
      tags: article.tags
    })
  });
  
  const data = await response.json();
  
  return {
    success: true,
    url: data.url,
    article_id: data.id,
    message: '发布到博客园成功'
  };
}
```

#### 2. 注册新平台

```javascript
// 添加到 SUPPORTED_PLATFORMS
const SUPPORTED_PLATFORMS = [
  'wechat',
  'zhihu',
  'juejin',
  'medium',
  'dev_to',
  'cnblogs'  // 新增
];

// 添加到 PublishService
const methodMap = {
  'wechat': this.publishToWechat,
  'zhihu': this.publishToZhihu,
  'juejin': this.publishToJuejin,
  'medium': this.publishToMedium,
  'dev_to': this.publishToDevTo,
  'cnblogs': this.publishToCnblogs  // 新增
};
```

## 🔐 平台 API 密钥获取

### 微信公众号
1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 开发 → 基本配置 → 获取 AppID 和 AppSecret

### 知乎
1. 访问 [知乎开放平台](https://www.zhihu.com/developers)
2. 创建应用获取 Client ID 和 Secret

### 掘金
1. 登录 [掘金](https://juejin.cn/)
2. 设置 → API Token

### Medium
1. 访问 [Medium Settings](https://medium.com/me/settings)
2. Integration tokens → 创建新 token

### Dev.to
1. 访问 [Dev.to Settings](https://dev.to/settings/account)
2. DEV Community API Keys → 生成新 key

## 🧪 测试

### 测试 MCP 服务器

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "params": {},
    "id": 1
  }'
```

### 测试后端 API

```bash
# 获取支持的平台
curl http://localhost:8000/api/v1/publish/platforms

# 发布文章
curl -X POST http://localhost:8000/api/v1/publish/publish \
  -H "Content-Type: application/json" \
  -d '{
    "article_id": 1,
    "platforms": ["wechat"],
    "tags": ["测试"]
  }'
```

## 🐛 故障排除

### 问题 1：无法连接 MCP 服务器

**解决方案**：
```bash
# 检查 MCP 服务器是否运行
curl http://localhost:3000/health

# 检查端口是否被占用
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Linux/Mac
```

### 问题 2：发布失败

**检查步骤**：
1. 查看后端日志
2. 检查 MCP 服务器日志
3. 验证 API 密钥是否正确
4. 确认网络连接

### 问题 3：部分平台发布失败

这是正常的，系统会并行发布到多个平台。查看响应中每个平台的具体错误信息。

## 📊 功能特性

✅ **多平台支持** - 一键发布到多个平台  
✅ **并行发布** - 同时发布到多个平台，提高效率  
✅ **状态追踪** - 实时显示发布状态  
✅ **历史记录** - 保存每个平台的发布链接  
✅ **错误处理** - 详细的错误信息和重试机制  
✅ **可扩展** - 轻松添加新平台  

## 🔄 工作流程

```
用户点击"发布到平台"
    ↓
选择目标平台（支持多选）
    ↓
点击"确认发布"
    ↓
前端调用 /api/v1/publish/publish
    ↓
后端创建发布任务
    ↓
MCP Client 连接 MCP Server
    ↓
MCP Server 调用各平台 API
    ↓
并行发布到所有选中的平台
    ↓
返回每个平台的发布结果
    ↓
前端显示发布状态和链接
    ↓
保存发布信息到数据库
```

## 📞 技术支持

- **MCP 协议**: https://modelcontextprotocol.io/
- **项目文档**: 查看 `backend/MCP_SETUP.md`
- **服务器示例**: 查看 `mcp-server-example/README.md`

## 🎉 总结

现在您的 AI 写作平台已经完全支持自动发布功能！

**核心优势**：
- 🚀 一键发布到多个平台
- ⚡ 并行处理，快速高效
- 🎯 界面友好，操作简单
- 🔧 易于扩展新平台
- 📊 完整的发布追踪

开始使用吧！ 🎊

