"""
文章导出API
Article Export API
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session
import os
import tempfile
from typing import Literal

from app.database import get_db
from app.models import Article

router = APIRouter()

@router.get("/{article_id}/{format}")
async def export_article(
    article_id: int,
    format: Literal["txt", "md", "html"],
    db: Session = Depends(get_db)
):
    """
    导出文章为指定格式
    Export article to specified format
    """
    # 获取文章
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if not article.content:
        raise HTTPException(status_code=400, detail="Article has no content")
    
    # 根据格式导出
    if format == "txt":
        content = f"{article.title}\n\n{article.content}"
        filename = f"{article.title}.txt"
        media_type = "text/plain"
    
    elif format == "md":
        content = f"# {article.title}\n\n"
        content += f"**主题**: {article.topic}\n\n"
        content += f"**智能体**: {article.agent_type.value}\n\n"
        content += f"---\n\n{article.content}"
        filename = f"{article.title}.md"
        media_type = "text/markdown"
    
    elif format == "html":
        content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{article.title}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            line-height: 1.8;
        }}
        h1 {{
            color: #333;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }}
        .meta {{
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
        }}
        .content {{
            white-space: pre-wrap;
            color: #333;
        }}
    </style>
</head>
<body>
    <h1>{article.title}</h1>
    <div class="meta">
        <p><strong>主题:</strong> {article.topic}</p>
        <p><strong>智能体:</strong> {article.agent_type.value}</p>
        <p><strong>字数:</strong> {len(article.content)} 字</p>
    </div>
    <div class="content">{article.content}</div>
</body>
</html>"""
        filename = f"{article.title}.html"
        media_type = "text/html"
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")
    
    # 返回文件
    return Response(
        content=content.encode('utf-8'),
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.get("/{article_id}/preview/{format}")
async def preview_article(
    article_id: int,
    format: Literal["md", "html"],
    db: Session = Depends(get_db)
):
    """
    预览文章（不下载）
    Preview article (without download)
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if not article.content:
        raise HTTPException(status_code=400, detail="Article has no content")
    
    if format == "md":
        content = f"# {article.title}\n\n{article.content}"
        return Response(content=content, media_type="text/markdown")
    
    elif format == "html":
        content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>{article.title}</title>
    <style>
        body {{ font-family: 'Microsoft YaHei', sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; line-height: 1.8; }}
        h1 {{ color: #333; }}
        .content {{ white-space: pre-wrap; }}
    </style>
</head>
<body>
    <h1>{article.title}</h1>
    <div class="content">{article.content}</div>
</body>
</html>"""
        return Response(content=content, media_type="text/html")
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")


