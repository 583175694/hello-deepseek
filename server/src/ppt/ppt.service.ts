import { Injectable } from '@nestjs/common';
import { AIChatService } from '../chat/services/ai-chat.service';

@Injectable()
export class PPTService {
  constructor(private readonly aiChatService: AIChatService) {}

  private async getAIResponse(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let response = '';
      this.aiChatService
        .streamChat(
          prompt,
          'ppt-service',
          undefined,
          (chunk) => {
            if (chunk.type === 'content') {
              response += chunk.content;
            }
          },
          false,
          false,
          false,
          'bytedance_deepseek_v3',
        )
        .then(() => resolve(response))
        .catch(reject);
    });
  }

  private extractCodeBlock(markdown: string): string {
    // 匹配 ```json ... ``` 格式的代码块
    const codeBlockMatch = markdown.match(/```json\s*([\s\S]*?)\s*```/);
    if (!codeBlockMatch) {
      throw new Error('未找到JSON代码块');
    }
    return codeBlockMatch[1].trim();
  }

  async generateOutline(title: string): Promise<string> {
    const prompt = `请为标题为"${title}"的PPT生成一个详细的大纲。要求：
1. 大纲应该包含3-5个主要章节
2. 每个章节下应该有2-4个子要点
3. 大纲层次要清晰，使用数字编号（1., 1.1, 1.2等）
4. 内容要有逻辑性和连贯性
5. 大纲的深度和广度要适中，既不能太简单也不能太复杂
6. 确保每个要点都与主题相关，并能支撑主题
7. 用中文输出

请直接输出大纲内容，不要有任何额外的解释或说明。`;

    return this.getAIResponse(prompt);
  }

  async generateContent(title: string, outline: string): Promise<any[]> {
    const prompt = `你是一个专业的PPT内容生成专家。请基于以下信息生成PPT内容：

标题：${title}
大纲：
${outline}

要求：
1. 为每个大纲章节生成对应的PPT页面内容
2. 每个页面包含：标题、主要内容（要点列表）、可选的图表或图片描述
3. 内容要专业、准确、有深度
4. 语言要简洁清晰
5. 每个页面的内容量要适中
6. 确保内容的连贯性和逻辑性
7. 用中文输出

请使用以下格式输出（注意是markdown格式，包含代码块）：

\`\`\`json
[
  {
    "title": "页面标题",
    "content": [
      "要点1",
      "要点2",
      "要点3"
    ],
    "imageDescription": "建议的图片描述（可选）"
  }
]
\`\`\`

注意：
1. 必须使用双引号，不能用单引号
2. 数组和对象的最后一项后面不要加逗号
3. 所有字符串都要用双引号包裹
4. 确保输出的是一个合法的JSON数组`;

    try {
      const response = await this.getAIResponse(prompt);
      const jsonStr = this.extractCodeBlock(response);

      console.log('提取的JSON字符串:', jsonStr);

      const content = JSON.parse(jsonStr);

      if (!Array.isArray(content)) {
        throw new Error('返回的内容不是数组格式');
      }

      // 验证每个页面的格式
      content.forEach((slide, index) => {
        if (
          !slide.title ||
          !Array.isArray(slide.content) ||
          slide.content.length === 0
        ) {
          throw new Error(`第 ${index + 1} 页的格式不正确`);
        }
      });

      return content;
    } catch (error) {
      console.error('生成PPT内容失败:', error);
      throw new Error('生成的PPT内容格式不正确');
    }
  }
}
