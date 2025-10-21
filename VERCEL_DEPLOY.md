# 🚀 Vercel 部署指南

## 快速部署步骤

### 方法一：通过 Vercel CLI（推荐）

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
cd frontend
vercel
```

4. **生产环境部署**
```bash
vercel --prod
```

---

### 方法二：通过 Vercel 网站

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库：`Evelyn233/putike_new`
   - 选择分支：`dev/complete-project`

3. **配置项目**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

---

## 项目配置

### vercel.json
项目已包含 `frontend/vercel.json` 配置文件：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 配置说明
- **buildCommand**: 构建命令
- **outputDirectory**: 构建输出目录
- **framework**: 使用 Vite 框架
- **rewrites**: 支持 React Router 的单页应用路由

---

## 环境变量（如需要）

如果项目需要 API 密钥或环境变量：

1. 在 Vercel 项目设置中找到 **Environment Variables**
2. 添加需要的环境变量
3. 重新部署

---

## 自动部署

### GitHub 集成
部署后，Vercel 会自动：
- 监听 `dev/complete-project` 分支的更新
- 每次 push 后自动构建和部署
- 提供预览链接

### 部署流程
```
git push origin dev/complete-project
    ↓
GitHub 触发 webhook
    ↓
Vercel 自动构建
    ↓
部署到生产环境
```

---

## 验证部署

部署成功后：
1. Vercel 会提供一个 URL（例如：`https://your-project.vercel.app`）
2. 访问该 URL 查看网站
3. 检查所有页面是否正常工作

---

## 常见问题

### Q: 构建失败？
A: 检查：
- `package.json` 中的依赖是否完整
- TypeScript 编译是否有错误
- 运行 `npm run build` 本地测试

### Q: 页面 404？
A: 确保 `vercel.json` 中有正确的 rewrites 配置

### Q: 如何查看构建日志？
A: 在 Vercel 项目页面 → Deployments → 点击具体部署 → 查看日志

### Q: 如何回滚到之前的版本？
A: Vercel 项目页面 → Deployments → 找到之前的部署 → Promote to Production

---

## 性能优化建议

1. **启用 Vercel Analytics**
   - 在项目设置中启用
   - 监控网站性能

2. **优化构建**
   - 使用代码分割
   - 启用压缩
   - 优化图片资源

3. **CDN 加速**
   - Vercel 自动使用全球 CDN
   - 静态资源自动缓存

---

## 自定义域名

1. 在 Vercel 项目设置中找到 **Domains**
2. 添加你的域名
3. 按照提示配置 DNS 记录
4. 等待 SSL 证书自动生成

---

## 部署命令速查

```bash
# 登录
vercel login

# 部署预览环境
vercel

# 部署生产环境
vercel --prod

# 查看部署列表
vercel ls

# 查看项目信息
vercel inspect

# 删除部署
vercel rm [deployment-url]
```

---

## 监控和维护

### Vercel Dashboard
- 访问量统计
- 构建历史
- 错误日志
- 性能监控

### 定期检查
- 依赖更新
- 安全漏洞扫描
- 性能优化

---

## 下一步

部署成功后：
1. ✅ 分享你的网站 URL
2. ✅ 设置自定义域名（可选）
3. ✅ 启用 Analytics（可选）
4. ✅ 继续开发新功能

---

**祝部署顺利！** 🎉

如有问题，请查看 [Vercel 文档](https://vercel.com/docs)




