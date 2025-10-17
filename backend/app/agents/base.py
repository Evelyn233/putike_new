"""
基础智能体类
Base Agent Class
"""

from abc import ABC, abstractmethod
from typing import Dict, Any
import os
from openai import OpenAI

class BaseAgent(ABC):
    """
    基础智能体类 / Base Agent Class
    所有写作智能体都继承此类
    """
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("DEFAULT_MODEL", "gpt-4-turbo-preview")
        
    @property
    @abstractmethod
    def name(self) -> str:
        """智能体名称 / Agent name"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """智能体描述 / Agent description"""
        pass
    
    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """系统提示词 / System prompt"""
        pass
    
    @property
    def capabilities(self) -> list[str]:
        """智能体能力列表 / Agent capabilities"""
        return []
    
    def build_prompt(
        self,
        topic: str,
        word_count: int = 1000,
        style_requirements: str = None,
        **kwargs
    ) -> str:
        """
        构建用户提示词 / Build user prompt
        
        Args:
            topic: 主题
            word_count: 字数要求
            style_requirements: 风格要求
            **kwargs: 其他参数
        """
        prompt = f"请以{self.name}的身份，围绕以下主题写一篇文章：\n\n"
        prompt += f"主题：{topic}\n"
        prompt += f"字数要求：约{word_count}字\n"
        
        if style_requirements:
            prompt += f"风格要求：{style_requirements}\n"
        
        # 添加额外参数
        for key, value in kwargs.items():
            if value:
                prompt += f"{key}：{value}\n"
        
        prompt += "\n请开始创作："
        return prompt
    
    async def generate(
        self,
        topic: str,
        word_count: int = 1000,
        temperature: float = 0.7,
        style_requirements: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        生成文章 / Generate article
        
        Returns:
            包含内容、tokens等信息的字典
        """
        try:
            # 构建提示词
            user_prompt = self.build_prompt(
                topic=topic,
                word_count=word_count,
                style_requirements=style_requirements,
                **kwargs
            )
            
            # 调用LLM
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=int(word_count * 2.5)  # 预估token数
            )
            
            # 提取结果
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            return {
                "success": True,
                "content": content,
                "tokens_used": tokens_used,
                "model": self.model,
                "error": None
            }
            
        except Exception as e:
            return {
                "success": False,
                "content": None,
                "tokens_used": 0,
                "model": self.model,
                "error": str(e)
            }
    
    def get_info(self) -> Dict[str, Any]:
        """获取智能体信息 / Get agent information"""
        return {
            "name": self.name,
            "description": self.description,
            "capabilities": self.capabilities,
            "model": self.model
        }


