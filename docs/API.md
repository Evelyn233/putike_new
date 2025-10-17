# API 文档

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **响应格式**: JSON
- **字符编码**: UTF-8

## 智能体 API

### 获取所有智能体

```
GET /agents/
```

**响应示例**:
```json
[
  {
    "type": "journalist",
    "name": "新闻记者 📰",
    "description": "专业新闻记者，擅长撰写新闻报道...",
    "capabilities": ["新闻报道", "深度调查", "人物专访"],
    "model": "gpt-4-turbo-preview"
  }
]
```

### 获取指定智能体信息

```
GET /agents/{agent_type}
```

**路径参数**:
- `agent_type`: 智能体类型
  - `journalist` - 新闻记者
  - `academic` - 学术作者
  - `creative` - 创意作家
  - `business` - 商业撰稿人
  - `technical` - 技术博主
  - `screenwriter` - 故事编剧
  - `seo` - SEO优化师
  - `social_media` - 社交媒体运营

## 文章 API

### 创建文章

```
POST /articles/
```

**请求体**:
```json
{
  "title": "文章标题",
  "topic": "写作主题和要求",
  "agent_type": "journalist",
  "word_count": 1000,
  "temperature": 0.7,
  "style_requirements": "风格要求（可选）"
}
```

**响应示例**:
```json
{
  "id": 1,
  "title": "文章标题",
  "topic": "写作主题",
  "content": null,
  "agent_type": "journalist",
  "status": "generating",
  "word_count": 1000,
  "temperature": 0.7,
  "tokens_used": 0,
  "generation_time": 0.0,
  "created_at": "2024-01-01T00:00:00"
}
```

### 获取文章列表

```
GET /articles/
```

**查询参数**:
- `status` (可选): 筛选状态 (`draft`, `generating`, `completed`, `failed`)
- `agent_type` (可选): 筛选智能体类型
- `limit` (可选): 返回数量限制，默认50
- `offset` (可选): 偏移量，默认0

### 获取指定文章

```
GET /articles/{article_id}
```

### 更新文章

```
PUT /articles/{article_id}
```

**请求体**:
```json
{
  "title": "新标题",
  "content": "编辑后的内容",
  "status": "completed"
}
```

### 删除文章

```
DELETE /articles/{article_id}
```

### 获取文章历史

```
GET /articles/{article_id}/history
```

## 导出 API

### 导出文章

```
GET /export/{article_id}/{format}
```

**路径参数**:
- `article_id`: 文章ID
- `format`: 导出格式 (`txt`, `md`, `html`)

**响应**: 文件下载

### 预览文章

```
GET /export/{article_id}/preview/{format}
```

**路径参数**:
- `article_id`: 文章ID
- `format`: 预览格式 (`md`, `html`)

**响应**: 文本内容

## 状态码

- `200`: 成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器错误


