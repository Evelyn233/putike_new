# 部署到 Vercel 完整指南

## 方法一：直接使用 Vercel CLI（推荐，最简单）

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 在项目目录下部署
```bash
cd E:\xsh\ai_writing_platform\frontend
vercel
```

### 3. 按照提示操作
- 首次使用会要求登录，选择 GitHub 登录
- 询问 "Set up and deploy?" 选择 Yes
- 询问 "Which scope?" 选择你的账号
- 询问 "Link to existing project?" 选择 No
- 询问 "What's your project's name?" 输入：ai-writing-agents 或其他名字
- 询问 "In which directory is your code located?" 直接回车（使用当前目录）
- 自动检测到 Vite 项目，询问设置，全部回车使用默认值

### 4. 部署完成
- 会得到一个预览链接，例如：https://ai-writing-agents-xxx.vercel.app
- 可以立即访问！

### 5. 后续更新（可选）
```bash
# 每次修改后，重新部署
vercel --prod
```

---

## 方法二：通过 GitHub + Vercel 网站部署

### 步骤 1: 提交代码到本地仓库
```bash
cd E:\xsh\ai_writing_platform\frontend

# 如果还没提交，执行：
git commit -m "Initial commit: AI写作智能体平台"
```

### 步骤 2: 在 GitHub 创建新仓库
1. 访问 https://github.com/new
2. 仓库名称：`ai-writing-agents`（或你喜欢的名字）
3. 选择 Public（公开）
4. 不要勾选任何初始化选项
5. 点击 "Create repository"

### 步骤 3: 推送代码到 GitHub
```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-writing-agents.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 4: 在 Vercel 部署
1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"，使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你刚才创建的仓库 `ai-writing-agents`
5. 点击 "Import"
6. Framework Preset 会自动检测为 "Vite"
7. Build Command: `npm run build`
8. Output Directory: `dist`
9. 点击 "Deploy"

### 步骤 5: 等待部署完成
- 大约 1-2 分钟后部署完成
- 会得到一个永久链接，例如：`https://ai-writing-agents.vercel.app`
- 这个链接可以分享给任何人！

---

## 自动更新设置

部署后，每次你推送代码到 GitHub，Vercel 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push
```

几分钟后，你的网站就会自动更新！

---

## 常见问题

### Q: 我没有 GitHub 账号怎么办？
A: 访问 https://github.com/signup 注册一个免费账号

### Q: Vercel 是免费的吗？
A: 是的！个人项目完全免费，没有任何费用

### Q: 域名可以自定义吗？
A: 可以！在 Vercel 项目设置中可以添加自定义域名

### Q: 部署后可以修改吗？
A: 可以！只需要修改代码后重新 push 或运行 `vercel --prod`

---

## 推荐方法

**对于你的情况，我推荐使用方法一（Vercel CLI）**，因为：
- ✅ 最简单快速
- ✅ 一条命令搞定
- ✅ 不需要手动创建 GitHub 仓库
- ✅ 自动配置所有设置

只需要运行：
```bash
npm install -g vercel
cd E:\xsh\ai_writing_platform\frontend
vercel
```

就完成了！🚀

