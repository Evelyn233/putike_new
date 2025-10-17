@echo off
echo ========================================
echo   AI写作平台 - 前端启动脚本
echo ========================================
echo.

REM 检查是否在 frontend 目录
if not exist "package.json" (
    echo [错误] 请在 frontend 目录下运行此脚本！
    pause
    exit /b 1
)

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

REM 检查 node_modules
if not exist "node_modules" (
    echo [1/2] 正在安装依赖...
    npm install
) else (
    echo [1/2] 依赖已安装
)

echo.
echo [2/2] 启动前端开发服务器...
echo ========================================
echo   前端地址: http://localhost:5173
echo ========================================
echo.

npm run dev

pause


