"""
MCP 客户端实现
负责与 MCP 服务器通信
"""

import os
import json
import httpx
from typing import Dict, Any, Optional
from enum import Enum


class MCPServerType(str, Enum):
    """MCP 服务器类型"""
    WECHAT = "wechat"  # 微信公众号
    ZHIHU = "zhihu"    # 知乎
    JUEJIN = "juejin"  # 掘金
    MEDIUM = "medium"  # Medium
    DEV_TO = "dev_to"  # Dev.to
    CUSTOM = "custom"  # 自定义服务器


class MCPClient:
    """
    MCP 客户端
    用于连接和调用 MCP 服务器
    """
    
    def __init__(self, server_url: str = None, api_key: str = None):
        """
        初始化 MCP 客户端
        
        Args:
            server_url: MCP 服务器 URL，默认从环境变量读取
            api_key: API 密钥，默认从环境变量读取
        """
        self.server_url = server_url or os.getenv("MCP_SERVER_URL", "http://localhost:3000")
        self.api_key = api_key or os.getenv("MCP_API_KEY", "")
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def call_tool(
        self,
        tool_name: str,
        arguments: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        调用 MCP 工具
        
        Args:
            tool_name: 工具名称（如 "publish_article"）
            arguments: 工具参数
            
        Returns:
            工具执行结果
        """
        try:
            headers = {
                "Content-Type": "application/json",
            }
            
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            payload = {
                "jsonrpc": "2.0",
                "method": "tools/call",
                "params": {
                    "name": tool_name,
                    "arguments": arguments
                },
                "id": 1
            }
            
            response = await self.client.post(
                f"{self.server_url}/mcp",
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            result = response.json()
            
            if "error" in result:
                raise Exception(f"MCP Error: {result['error']}")
            
            return result.get("result", {})
            
        except httpx.HTTPError as e:
            raise Exception(f"HTTP Error: {str(e)}")
        except Exception as e:
            raise Exception(f"MCP Client Error: {str(e)}")
    
    async def list_tools(self) -> list:
        """
        获取可用工具列表
        
        Returns:
            工具列表
        """
        try:
            headers = {
                "Content-Type": "application/json",
            }
            
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            
            payload = {
                "jsonrpc": "2.0",
                "method": "tools/list",
                "params": {},
                "id": 1
            }
            
            response = await self.client.post(
                f"{self.server_url}/mcp",
                headers=headers,
                json=payload
            )
            
            response.raise_for_status()
            result = response.json()
            
            return result.get("result", {}).get("tools", [])
            
        except Exception as e:
            print(f"Failed to list tools: {str(e)}")
            return []
    
    async def close(self):
        """关闭客户端连接"""
        await self.client.aclose()

