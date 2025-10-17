"""
AI Writing Platform - 主应用入口
Multi-Agent AI Writing Platform - Main Application Entry
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.routers import agents, articles, export, publish
from app.database import engine, Base

# 加载环境变量 / Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理 / Application lifecycle management"""
    # 启动时创建数据库表 / Create database tables on startup
    Base.metadata.create_all(bind=engine)
    print("✅ 数据库初始化完成 / Database initialized")
    yield
    # 关闭时的清理工作 / Cleanup on shutdown
    print("👋 应用关闭 / Application shutdown")

# 创建FastAPI应用 / Create FastAPI application
app = FastAPI(
    title="AI Writing Platform",
    description="多智能体AI写作平台 / Multi-Agent AI Writing Platform",
    version="1.0.0",
    lifespan=lifespan
)

# 配置CORS / Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由 / Register routers
app.include_router(agents.router, prefix="/api/v1/agents", tags=["智能体 / Agents"])
app.include_router(articles.router, prefix="/api/v1/articles", tags=["文章 / Articles"])
app.include_router(export.router, prefix="/api/v1/export", tags=["导出 / Export"])
app.include_router(publish.router, prefix="/api/v1/publish", tags=["发布 / Publish"])

@app.get("/")
async def root():
    """根路径 / Root endpoint"""
    return {
        "message": "欢迎使用AI写作平台 / Welcome to AI Writing Platform",
        "version": "1.0.0",
        "docs": "/docs",
        "agents_count": 8
    }

@app.get("/health")
async def health_check():
    """健康检查 / Health check"""
    return {
        "status": "healthy",
        "database": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


