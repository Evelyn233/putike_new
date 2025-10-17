#!/bin/bash

echo "========================================"
echo "  AI写作平台 - 前端启动脚本"
echo "========================================"
echo ""

# 检查是否在 frontend 目录
if [ ! -f "package.json" ]; then
    echo "[错误] 请在 frontend 目录下运行此脚本！"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "[1/2] 正在安装依赖..."
    npm install
else
    echo "[1/2] 依赖已安装"
fi

echo ""
echo "[2/2] 启动前端开发服务器..."
echo "========================================"
echo "  前端地址: http://localhost:5173"
echo "========================================"
echo ""

npm run dev


