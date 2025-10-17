"""
文章相关API
Articles API
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field
import time

from app.database import get_db
from app.models import Article, ArticleStatus, AgentType, GenerationHistory
from app.routers.agents import get_agent

router = APIRouter()

# Pydantic schemas
class ArticleCreate(BaseModel):
    """创建文章请求"""
    title: str = Field(..., description="文章标题")
    topic: str = Field(..., description="写作主题")
    agent_type: AgentType = Field(..., description="智能体类型")
    word_count: int = Field(1000, description="字数要求")
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="创作温度")
    style_requirements: Optional[str] = Field(None, description="风格要求")

class ArticleResponse(BaseModel):
    """文章响应"""
    id: int
    title: str
    topic: str
    content: Optional[str]
    agent_type: AgentType
    status: ArticleStatus
    word_count: int
    temperature: float
    tokens_used: int
    generation_time: float
    created_at: str
    
    class Config:
        from_attributes = True

class ArticleUpdate(BaseModel):
    """更新文章请求"""
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[ArticleStatus] = None

@router.post("/", response_model=ArticleResponse)
async def create_article(
    article_data: ArticleCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    创建文章并开始生成
    Create article and start generation
    """
    # 创建数据库记录
    article = Article(
        title=article_data.title,
        topic=article_data.topic,
        agent_type=article_data.agent_type,
        word_count=article_data.word_count,
        temperature=article_data.temperature,
        style_requirements=article_data.style_requirements,
        status=ArticleStatus.GENERATING
    )
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    # 在后台生成文章
    background_tasks.add_task(
        generate_article_content,
        article.id,
        article_data.agent_type,
        article_data.topic,
        article_data.word_count,
        article_data.temperature,
        article_data.style_requirements
    )
    
    return article

async def generate_article_content(
    article_id: int,
    agent_type: AgentType,
    topic: str,
    word_count: int,
    temperature: float,
    style_requirements: Optional[str]
):
    """
    后台任务：生成文章内容
    Background task: Generate article content
    """
    from app.database import SessionLocal
    
    db = SessionLocal()
    try:
        # 获取智能体
        agent = get_agent(agent_type)
        if not agent:
            raise ValueError("Agent not found")
        
        # 记录开始时间
        start_time = time.time()
        
        # 生成内容
        result = await agent.generate(
            topic=topic,
            word_count=word_count,
            temperature=temperature,
            style_requirements=style_requirements
        )
        
        # 计算生成时间
        generation_time = time.time() - start_time
        
        # 更新数据库
        article = db.query(Article).filter(Article.id == article_id).first()
        if article:
            if result["success"]:
                article.content = result["content"]
                article.status = ArticleStatus.COMPLETED
                article.tokens_used = result["tokens_used"]
                article.model_used = result["model"]
            else:
                article.status = ArticleStatus.FAILED
                article.metadata = {"error": result["error"]}
            
            article.generation_time = generation_time
            
            # 保存历史记录
            history = GenerationHistory(
                article_id=article_id,
                version=1,
                content=result.get("content", ""),
                parameters={
                    "topic": topic,
                    "word_count": word_count,
                    "temperature": temperature,
                    "style_requirements": style_requirements
                }
            )
            db.add(history)
            
            db.commit()
    
    except Exception as e:
        # 标记为失败
        article = db.query(Article).filter(Article.id == article_id).first()
        if article:
            article.status = ArticleStatus.FAILED
            article.metadata = {"error": str(e)}
            db.commit()
    
    finally:
        db.close()

@router.get("/", response_model=List[ArticleResponse])
async def list_articles(
    status: Optional[ArticleStatus] = None,
    agent_type: Optional[AgentType] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    获取文章列表
    Get articles list
    """
    query = db.query(Article)
    
    if status:
        query = query.filter(Article.status == status)
    if agent_type:
        query = query.filter(Article.agent_type == agent_type)
    
    articles = query.order_by(Article.created_at.desc()).offset(offset).limit(limit).all()
    
    # 转换时间格式
    result = []
    for article in articles:
        article_dict = {
            "id": article.id,
            "title": article.title,
            "topic": article.topic,
            "content": article.content,
            "agent_type": article.agent_type,
            "status": article.status,
            "word_count": article.word_count,
            "temperature": article.temperature,
            "tokens_used": article.tokens_used,
            "generation_time": article.generation_time,
            "created_at": str(article.created_at) if article.created_at else ""
        }
        result.append(article_dict)
    
    return result

@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: Session = Depends(get_db)):
    """
    获取指定文章
    Get specific article
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {
        "id": article.id,
        "title": article.title,
        "topic": article.topic,
        "content": article.content,
        "agent_type": article.agent_type,
        "status": article.status,
        "word_count": article.word_count,
        "temperature": article.temperature,
        "tokens_used": article.tokens_used,
        "generation_time": article.generation_time,
        "created_at": str(article.created_at) if article.created_at else ""
    }

@router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: int,
    article_update: ArticleUpdate,
    db: Session = Depends(get_db)
):
    """
    更新文章
    Update article
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article_update.title is not None:
        article.title = article_update.title
    if article_update.content is not None:
        article.content = article_update.content
    if article_update.status is not None:
        article.status = article_update.status
    
    db.commit()
    db.refresh(article)
    
    return {
        "id": article.id,
        "title": article.title,
        "topic": article.topic,
        "content": article.content,
        "agent_type": article.agent_type,
        "status": article.status,
        "word_count": article.word_count,
        "temperature": article.temperature,
        "tokens_used": article.tokens_used,
        "generation_time": article.generation_time,
        "created_at": str(article.created_at) if article.created_at else ""
    }

@router.delete("/{article_id}")
async def delete_article(article_id: int, db: Session = Depends(get_db)):
    """
    删除文章
    Delete article
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(article)
    db.commit()
    
    return {"message": "Article deleted successfully"}

@router.get("/{article_id}/history")
async def get_article_history(article_id: int, db: Session = Depends(get_db)):
    """
    获取文章历史版本
    Get article history versions
    """
    history = db.query(GenerationHistory).filter(
        GenerationHistory.article_id == article_id
    ).order_by(GenerationHistory.created_at.desc()).all()
    
    return [
        {
            "id": h.id,
            "version": h.version,
            "content": h.content,
            "parameters": h.parameters,
            "created_at": str(h.created_at)
        }
        for h in history
    ]


