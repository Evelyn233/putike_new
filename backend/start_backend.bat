@echo off
echo ========================================
echo   AI写作平台 - 后端启动脚本
echo ========================================
echo.

REM 检查是否在 backend 目录
if not exist "app\main.py" (
    echo [错误] 请在 backend 目录下运行此脚本！
    pause
    exit /b 1
)

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Python，请先安装 Python 3.9+
    pause
    exit /b 1
)

REM 检查 .env 文件
if not exist ".env" (
    echo [警告] 未找到 .env 文件
    echo [提示] 请复制 .env.example 为 .env 并填入你的 API keys
    pause
)

echo [1/3] 检查依赖...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo [提示] 正在安装依赖...
    pip install -r requirements.txt
)

echo.
echo [2/3] 创建数据库...
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine); print('数据库初始化完成')"

echo.
echo [3/3] 启动后端服务...
echo ========================================
echo   后端地址: http://localhost:8000
echo   API文档: http://localhost:8000/docs
echo ========================================
echo.

python -m uvicorn app.main:app --reload --port 8000

pause


