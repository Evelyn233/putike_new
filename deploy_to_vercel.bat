@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 部署到 Vercel
echo ========================================
echo.

echo 📂 进入前端目录...
cd frontend

echo.
echo 📦 检查 Vercel CLI 是否安装...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI 未安装
    echo.
    echo 正在安装 Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ 安装失败，请手动安装: npm install -g vercel
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI 安装成功
)

echo ✅ Vercel CLI 已安装
echo.
echo ========================================
echo 🔐 登录 Vercel
echo ========================================
echo.
echo 如果浏览器打开，请在浏览器中完成登录...
vercel login

if %errorlevel% neq 0 (
    echo ❌ 登录失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🚀 开始部署
echo ========================================
echo.
echo 选择部署模式:
echo   1. 预览部署 (Preview)
echo   2. 生产部署 (Production)
echo.
set /p choice="请输入选项 (1/2): "

if "%choice%"=="1" (
    echo.
    echo 📤 部署到预览环境...
    vercel
) else if "%choice%"=="2" (
    echo.
    echo 📤 部署到生产环境...
    vercel --prod
) else (
    echo.
    echo ❌ 无效选项，默认部署到预览环境...
    vercel
)

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 部署成功！
    echo ========================================
    echo.
    echo 🌐 你的网站已成功部署到 Vercel
    echo 📝 访问 https://vercel.com/dashboard 查看详情
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ 部署失败
    echo ========================================
    echo.
    echo 请检查错误信息并重试
    echo 或访问 https://vercel.com/docs 查看文档
    echo.
)

pause




