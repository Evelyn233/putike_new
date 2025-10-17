# 部署指南

## 开发环境部署

### 前提条件

- Python 3.9+
- Node.js 16+
- npm 或 yarn

### 后端部署

1. **安装依赖**
```bash
cd backend
pip install -r requirements.txt
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的 API keys
```

3. **启动服务**
```bash
uvicorn app.main:app --reload --port 8000
```

后端将运行在 `http://localhost:8000`

### 前端部署

1. **安装依赖**
```bash
cd frontend
npm install
```

2. **启动开发服务器**
```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

## 生产环境部署

### 使用 Docker

1. **创建 Dockerfile (backend)**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **创建 Dockerfile (frontend)**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. **创建 docker-compose.yml**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - DATABASE_URL=sqlite:///./ai_writing.db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

4. **启动服务**
```bash
docker-compose up -d
```

### 使用传统服务器

#### 后端 (使用 Gunicorn)

```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### 前端 (使用 Nginx)

1. **构建前端**
```bash
cd frontend
npm run build
```

2. **配置 Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 数据库迁移

如果使用 PostgreSQL：

```bash
cd backend
alembic upgrade head
```

## 环境变量说明

### 后端环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API密钥 | - |
| `ANTHROPIC_API_KEY` | Anthropic API密钥 | - |
| `DATABASE_URL` | 数据库连接URL | `sqlite:///./ai_writing.db` |
| `DEFAULT_MODEL` | 默认AI模型 | `gpt-4-turbo-preview` |
| `MAX_TOKENS` | 最大token数 | `4000` |
| `TEMPERATURE` | 默认温度 | `0.7` |
| `ALLOWED_ORIGINS` | CORS允许的源 | `http://localhost:5173` |

## 监控和日志

### 添加日志

在 `app/main.py` 中添加：

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### 性能监控

可以集成 Prometheus 和 Grafana 进行监控。

## 安全建议

1. **API密钥安全**
   - 不要将 API 密钥提交到版本控制
   - 使用环境变量管理敏感信息
   - 定期轮换密钥

2. **HTTPS**
   - 生产环境必须使用 HTTPS
   - 使用 Let's Encrypt 获取免费证书

3. **访问控制**
   - 添加用户认证
   - 实现 API 速率限制
   - 设置 CORS 白名单

4. **数据备份**
   - 定期备份数据库
   - 实现自动备份策略

## 故障排查

### 后端无法启动

1. 检查 Python 版本
2. 确认依赖已安装
3. 检查环境变量配置
4. 查看日志输出

### 前端无法连接后端

1. 检查后端是否运行
2. 确认 API 地址配置正确
3. 检查 CORS 设置
4. 查看浏览器控制台错误

### AI生成失败

1. 确认 API 密钥有效
2. 检查 API 配额
3. 查看错误日志
4. 调整请求参数

## 性能优化

1. **后端优化**
   - 使用数据库连接池
   - 实现响应缓存
   - 优化数据库查询

2. **前端优化**
   - 代码分割和懒加载
   - 静态资源 CDN
   - 启用 gzip 压缩

3. **AI调用优化**
   - 实现请求队列
   - 添加重试机制
   - 缓存常见结果


