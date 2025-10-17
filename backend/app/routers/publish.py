"""
文章发布相关API
通过 MCP 协议发布文章到各个平台
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

from app.database import get_db
from app.models import Article
from app.mcp.publisher import ArticlePublisher, PublishConfig
from app.mcp.client import MCPClient

router = APIRouter()

# 创建全局发布器实例
publisher = ArticlePublisher()


# Pydantic schemas
class PublishRequest(BaseModel):
    """发布请求"""
    article_id: int = Field(..., description="文章ID")
    platforms: List[str] = Field(..., description="目标平台列表", example=["wechat", "zhihu"])
    tags: List[str] = Field(default=[], description="标签列表")
    cover_image: Optional[str] = Field(None, description="封面图片URL")
    is_draft: bool = Field(False, description="是否发布为草稿")


class PublishResponse(BaseModel):
    """发布响应"""
    success: bool
    results: List[dict]
    message: str


class UpdatePublishedArticleRequest(BaseModel):
    """更新已发布文章请求"""
    platform: str = Field(..., description="平台名称")
    article_id: str = Field(..., description="平台上的文章ID")
    title: Optional[str] = Field(None, description="新标题")
    content: Optional[str] = Field(None, description="新内容")
    tags: Optional[List[str]] = Field(None, description="新标签")


@router.post("/publish", response_model=PublishResponse)
async def publish_article(
    publish_request: PublishRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    发布文章到指定平台
    支持同时发布到多个平台
    """
    # 获取文章
    article = db.query(Article).filter(Article.id == publish_request.article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    if not article.content:
        raise HTTPException(status_code=400, detail="文章内容为空，无法发布")
    
    # 构建发布配置
    configs = []
    for platform in publish_request.platforms:
        config = PublishConfig(
            platform=platform,
            title=article.title,
            content=article.content,
            tags=publish_request.tags,
            cover_image=publish_request.cover_image,
            is_draft=publish_request.is_draft
        )
        configs.append(config)
    
    try:
        # 异步发布到多个平台
        results = await publisher.publish_to_multiple_platforms(configs)
        
        # 统计成功和失败数量
        success_count = sum(1 for r in results if r.get("success"))
        fail_count = len(results) - success_count
        
        message = f"发布完成: {success_count} 成功, {fail_count} 失败"
        
        # 更新文章元数据（保存发布信息）
        if article.extra_metadata is None:
            article.extra_metadata = {}
        
        if "published_platforms" not in article.extra_metadata:
            article.extra_metadata["published_platforms"] = {}
        
        # 保存每个平台的发布结果
        for result in results:
            if result.get("success"):
                platform = result.get("platform")
                article.extra_metadata["published_platforms"][platform] = {
                    "url": result.get("url"),
                    "article_id": result.get("article_id"),
                    "published_at": datetime.now().isoformat()
                }
        
        db.commit()
        
        return PublishResponse(
            success=success_count > 0,
            results=results,
            message=message
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"发布失败: {str(e)}")


@router.get("/platforms")
async def get_supported_platforms():
    """
    获取支持的发布平台列表
    """
    try:
        platforms = await publisher.get_supported_platforms()
        return {
            "platforms": platforms,
            "total": len(platforms)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取平台列表失败: {str(e)}")


@router.put("/update-published")
async def update_published_article(
    update_request: UpdatePublishedArticleRequest,
    db: Session = Depends(get_db)
):
    """
    更新已发布的文章
    """
    try:
        result = await publisher.update_article(
            platform=update_request.platform,
            article_id=update_request.article_id,
            title=update_request.title,
            content=update_request.content,
            tags=update_request.tags
        )
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("message"))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新失败: {str(e)}")


@router.delete("/{platform}/{article_id}")
async def delete_published_article(
    platform: str,
    article_id: str,
    db: Session = Depends(get_db)
):
    """
    删除已发布的文章
    """
    try:
        result = await publisher.delete_article(
            platform=platform,
            article_id=article_id
        )
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("message"))
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除失败: {str(e)}")


@router.get("/article/{article_id}/published-info")
async def get_article_published_info(
    article_id: int,
    db: Session = Depends(get_db)
):
    """
    获取文章的发布信息
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    published_platforms = {}
    if article.extra_metadata and "published_platforms" in article.extra_metadata:
        published_platforms = article.extra_metadata["published_platforms"]
    
    return {
        "article_id": article_id,
        "published_platforms": published_platforms,
        "total_platforms": len(published_platforms)
    }

