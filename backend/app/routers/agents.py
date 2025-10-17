"""
智能体相关API
Agents API
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from app.agents import (
    JournalistAgent, AcademicAgent, CreativeAgent, BusinessAgent,
    TechnicalAgent, ScreenwriterAgent, SEOAgent, SocialMediaAgent
)
from app.models import AgentType

router = APIRouter()

# 智能体实例映射 / Agent instances mapping
AGENTS = {
    AgentType.JOURNALIST: JournalistAgent(),
    AgentType.ACADEMIC: AcademicAgent(),
    AgentType.CREATIVE: CreativeAgent(),
    AgentType.BUSINESS: BusinessAgent(),
    AgentType.TECHNICAL: TechnicalAgent(),
    AgentType.SCREENWRITER: ScreenwriterAgent(),
    AgentType.SEO: SEOAgent(),
    AgentType.SOCIAL_MEDIA: SocialMediaAgent(),
}

@router.get("/", response_model=List[Dict[str, Any]])
async def list_agents():
    """
    获取所有智能体列表
    Get all agents list
    """
    agents_info = []
    for agent_type, agent in AGENTS.items():
        info = agent.get_info()
        info["type"] = agent_type.value
        agents_info.append(info)
    
    return agents_info

@router.get("/{agent_type}", response_model=Dict[str, Any])
async def get_agent_info(agent_type: AgentType):
    """
    获取指定智能体信息
    Get specific agent information
    """
    agent = AGENTS.get(agent_type)
    if not agent:
        return {"error": "Agent not found"}
    
    info = agent.get_info()
    info["type"] = agent_type.value
    return info

def get_agent(agent_type: AgentType):
    """
    获取智能体实例（供其他路由使用）
    Get agent instance (for use in other routers)
    """
    return AGENTS.get(agent_type)


