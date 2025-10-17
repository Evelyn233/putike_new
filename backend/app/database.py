"""
数据库配置和会话管理
Database configuration and session management
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# 数据库URL / Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_writing.db")

# 创建数据库引擎 / Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# 创建会话工厂 / Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类 / Create base class
Base = declarative_base()

# 依赖项：获取数据库会话 / Dependency: Get database session
def get_db():
    """获取数据库会话 / Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


