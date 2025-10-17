# 🚀 快速开始指南

欢迎使用 AI 写作平台！这是一个完整的多智能体写作系统。

## ⚡ 10分钟快速启动

### 第一步：安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 第二步：配置 API 密钥

创建 `backend/.env` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./ai_writing.db
```

**如何获取 OpenAI API Key:**
1. 访问 https://platform.openai.com/api-keys
2. 登录你的账号
3. 创建新的 API Key
4. 复制并粘贴到 `.env` 文件中

### 第三步：启动后端

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

✅ 后端启动成功！访问 http://localhost:8000/docs 查看 API 文档

### 第四步：安装前端依赖

**打开新的终端窗口**，然后：

```bash
cd frontend
npm install
```

### 第五步：启动前端

```bash
npm run dev
```

✅ 前端启动成功！访问 http://localhost:5173 开始使用

## 🎯 开始创作

1. **选择智能体** - 从8个专业智能体中选择
2. **填写要求** - 输入标题、主题、字数等
3. **开始创作** - 点击按钮，AI开始写作
4. **查看结果** - 实时查看生成进度
5. **编辑导出** - 编辑内容并导出为多种格式

## 📚 智能体介绍

- 📰 **新闻记者** - 新闻报道、时事评论
- 📚 **学术作者** - 学术论文、研究报告  
- 🎨 **创意作家** - 小说、诗歌、故事
- 💼 **商业撰稿人** - 商业计划、营销文案
- 🔬 **技术博主** - 技术文档、教程
- 📖 **故事编剧** - 剧本、人物设定
- 🌏 **SEO优化师** - SEO文章、产品描述
- 📱 **社交媒体运营** - 小红书、抖音文案

## 🔧 常见问题

### Q: 如何获取 OpenAI API Key?
A: 访问 https://platform.openai.com/api-keys 注册并创建

### Q: 可以使用其他 AI 模型吗?
A: 可以！编辑 `backend/app/agents/base.py`，修改 `model` 参数

### Q: 生成速度慢怎么办?
A: 检查网络连接，或者使用更快的模型如 `gpt-3.5-turbo`

### Q: 如何修改智能体的提示词?
A: 编辑 `backend/app/agents/` 目录下对应的文件

### Q: 可以添加新的智能体吗?
A: 当然！参考现有智能体创建新的类即可

## 📖 文档

- [API 文档](docs/API.md)
- [智能体说明](docs/AGENTS.md)
- [部署指南](docs/DEPLOYMENT.md)

## 💡 使用技巧

1. **调整温度参数** - 需要严谨内容用 0.3-0.5，创意内容用 0.7-0.9
2. **详细描述主题** - 提供越详细的要求，生成的内容越符合预期
3. **使用风格要求** - 可以指定"幽默"、"专业"、"通俗"等风格
4. **多次尝试** - 如果结果不满意，可以调整参数重新生成
5. **编辑优化** - 生成后可以手动编辑完善

## 🎨 界面功能

### 首页
- 智能体卡片展示
- 创作参数设置
- 实时创建文章

### 文章列表
- 查看所有文章
- 筛选和搜索
- 自动刷新状态

### 文章详情
- Markdown 预览
- 在线编辑
- 多格式导出（TXT/MD/HTML）

## 🚀 下一步

- 尝试不同的智能体
- 创作你的第一篇文章
- 探索高级参数设置
- 查看 API 文档了解更多

祝写作愉快！✨


