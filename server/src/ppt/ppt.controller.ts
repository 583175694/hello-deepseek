import { Controller, Post, Body, Get, Logger, Headers } from '@nestjs/common';
import { PPTService } from './ppt.service';

interface GenerateOutlineDto {
  title: string;
}

interface GenerateContentDto {
  title: string;
  outline: string;
}

@Controller('ppt')
export class PPTController {
  private readonly logger = new Logger(PPTController.name);

  constructor(private readonly pptService: PPTService) {}

  @Post('generate-outline')
  async generateOutline(@Body() dto: GenerateOutlineDto) {
    const outline = await this.pptService.generateOutline(dto.title);
    return { outline };
  }

  @Post('generate-content')
  async generateContent(@Body() dto: GenerateContentDto) {
    const content = await this.pptService.generateContent(
      dto.title,
      dto.outline,
    );
    return { content };
  }

  @Get('auth/code')
  async getAuthCode(@Headers('x-client-id') clientId: string) {
    try {
      return await this.pptService.getAuthCode();
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }
}
