"""
文章发布器
通过 MCP 协议将文章发布到各个平台
"""

from typing import Dict, Any, List, Optional
from .client import MCPClient, MCPServerType
import asyncio


class PublishConfig:
    """发布配置"""
    
    def __init__(
        self,
        platform: str,
        title: str,
        content: str,
        tags: List[str] = None,
        cover_image: str = None,
        is_draft: bool = False,
        **kwargs
    ):
        self.platform = platform
        self.title = title
        self.content = content
        self.tags = tags or []
        self.cover_image = cover_image
        self.is_draft = is_draft
        self.extra = kwargs


class ArticlePublisher:
    """
    文章发布器
    支持多平台发布
    """
    
    def __init__(self, mcp_client: MCPClient = None):
        """
        初始化发布器
        
        Args:
            mcp_client: MCP 客户端实例，如果为 None 则创建新实例
        """
        self.mcp_client = mcp_client or MCPClient()
        
    async def publish_article(
        self,
        config: PublishConfig
    ) -> Dict[str, Any]:
        """
        发布文章到指定平台
        
        Args:
            config: 发布配置
            
        Returns:
            发布结果，包含文章 URL 等信息
        """
        try:
            # 构建发布参数
            arguments = {
                "platform": config.platform,
                "title": config.title,
                "content": config.content,
                "tags": config.tags,
                "is_draft": config.is_draft,
            }
            
            if config.cover_image:
                arguments["cover_image"] = config.cover_image
            
            # 添加额外参数
            arguments.update(config.extra)
            
            # 调用 MCP 工具发布文章
            result = await self.mcp_client.call_tool(
                tool_name="publish_article",
                arguments=arguments
            )
            
            return {
                "success": True,
                "platform": config.platform,
                "url": result.get("url", ""),
                "article_id": result.get("article_id", ""),
                "message": result.get("message", "发布成功"),
                "data": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "platform": config.platform,
                "error": str(e),
                "message": f"发布失败: {str(e)}"
            }
    
    async def publish_to_multiple_platforms(
        self,
        configs: List[PublishConfig]
    ) -> List[Dict[str, Any]]:
        """
        同时发布到多个平台
        
        Args:
            configs: 多个平台的发布配置列表
            
        Returns:
            每个平台的发布结果列表
        """
        tasks = [self.publish_article(config) for config in configs]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 处理异常
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    "success": False,
                    "platform": configs[i].platform,
                    "error": str(result),
                    "message": f"发布失败: {str(result)}"
                })
            else:
                processed_results.append(result)
        
        return processed_results
    
    async def update_article(
        self,
        platform: str,
        article_id: str,
        title: str = None,
        content: str = None,
        tags: List[str] = None
    ) -> Dict[str, Any]:
        """
        更新已发布的文章
        
        Args:
            platform: 平台名称
            article_id: 文章 ID
            title: 新标题（可选）
            content: 新内容（可选）
            tags: 新标签（可选）
            
        Returns:
            更新结果
        """
        try:
            arguments = {
                "platform": platform,
                "article_id": article_id,
            }
            
            if title:
                arguments["title"] = title
            if content:
                arguments["content"] = content
            if tags:
                arguments["tags"] = tags
            
            result = await self.mcp_client.call_tool(
                tool_name="update_article",
                arguments=arguments
            )
            
            return {
                "success": True,
                "platform": platform,
                "message": "更新成功",
                "data": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "platform": platform,
                "error": str(e),
                "message": f"更新失败: {str(e)}"
            }
    
    async def delete_article(
        self,
        platform: str,
        article_id: str
    ) -> Dict[str, Any]:
        """
        删除已发布的文章
        
        Args:
            platform: 平台名称
            article_id: 文章 ID
            
        Returns:
            删除结果
        """
        try:
            result = await self.mcp_client.call_tool(
                tool_name="delete_article",
                arguments={
                    "platform": platform,
                    "article_id": article_id,
                }
            )
            
            return {
                "success": True,
                "platform": platform,
                "message": "删除成功",
                "data": result
            }
            
        except Exception as e:
            return {
                "success": False,
                "platform": platform,
                "error": str(e),
                "message": f"删除失败: {str(e)}"
            }
    
    async def get_supported_platforms(self) -> List[str]:
        """
        获取支持的发布平台列表
        
        Returns:
            平台名称列表
        """
        try:
            tools = await self.mcp_client.list_tools()
            # 从工具列表中提取支持的平台
            platforms = []
            for tool in tools:
                if tool.get("name") == "publish_article":
                    platforms = tool.get("arguments", {}).get("platform", {}).get("enum", [])
                    break
            return platforms
        except Exception as e:
            print(f"Failed to get supported platforms: {str(e)}")
            return ["wechat", "zhihu", "juejin", "medium", "dev_to"]
    
    async def close(self):
        """关闭连接"""
        await self.mcp_client.close()

