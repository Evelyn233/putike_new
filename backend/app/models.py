"""
数据库模型定义
Database models definition
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Float, JSON
from sqlalchemy.sql import func
from app.database import Base
import enum

class AgentType(str, enum.Enum):
    """智能体类型 / Agent types"""
    JOURNALIST = "journalist"           # 新闻记者
    ACADEMIC = "academic"               # 学术作者
    CREATIVE = "creative"               # 创意作家
    BUSINESS = "business"               # 商业撰稿人
    TECHNICAL = "technical"             # 技术博主
    SCREENWRITER = "screenwriter"       # 故事编剧
    SEO = "seo"                        # SEO优化师
    SOCIAL_MEDIA = "social_media"      # 社交媒体运营

class ArticleStatus(str, enum.Enum):
    """文章状态 / Article status"""
    DRAFT = "draft"                    # 草稿
    GENERATING = "generating"          # 生成中
    COMPLETED = "completed"            # 已完成
    FAILED = "failed"                  # 失败

class Article(Base):
    """文章模型 / Article model"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    
    # 基本信息 / Basic information
    title = Column(String(500), nullable=False)
    topic = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    
    # 智能体信息 / Agent information
    agent_type = Column(Enum(AgentType), nullable=False)
    
    # 参数设置 / Parameter settings
    word_count = Column(Integer, default=1000)
    temperature = Column(Float, default=0.7)
    style_requirements = Column(Text, nullable=True)
    
    # 元数据 / Metadata
    status = Column(Enum(ArticleStatus), default=ArticleStatus.DRAFT)
    model_used = Column(String(100), nullable=True)
    tokens_used = Column(Integer, default=0)
    generation_time = Column(Float, default=0.0)  # 秒 / seconds
    
    # 额外信息 / Additional info
    extra_metadata = Column(JSON, nullable=True)
    
    # 时间戳 / Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class GenerationHistory(Base):
    """生成历史记录 / Generation history"""
    __tablename__ = "generation_history"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, nullable=False)
    
    # 版本信息 / Version information
    version = Column(Integer, default=1)
    content = Column(Text, nullable=False)
    
    # 生成参数 / Generation parameters
    prompt = Column(Text, nullable=True)
    parameters = Column(JSON, nullable=True)
    
    # 时间戳 / Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())


