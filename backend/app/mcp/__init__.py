"""
MCP (Model Context Protocol) 集成模块
用于连接外部发布服务
"""

from .client import MCPClient
from .publisher import ArticlePublisher

__all__ = ['MCPClient', 'ArticlePublisher']

