#!/bin/bash

echo "========================================"
echo "  AI写作平台 - 后端启动脚本"
echo "========================================"
echo ""

# 检查是否在 backend 目录
if [ ! -f "app/main.py" ]; then
    echo "[错误] 请在 backend 目录下运行此脚本！"
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到 Python，请先安装 Python 3.9+"
    exit 1
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "[警告] 未找到 .env 文件"
    echo "[提示] 请复制 .env.example 为 .env 并填入你的 API keys"
    read -p "按回车键继续..."
fi

echo "[1/3] 检查依赖..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "[提示] 正在安装依赖..."
    pip3 install -r requirements.txt
fi

echo ""
echo "[2/3] 创建数据库..."
python3 -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('数据库初始化完成')"

echo ""
echo "[3/3] 启动后端服务..."
echo "========================================"
echo "  后端地址: http://localhost:8000"
echo "  API文档: http://localhost:8000/docs"
echo "========================================"
echo ""

python3 -m uvicorn app.main:app --reload --port 8000


