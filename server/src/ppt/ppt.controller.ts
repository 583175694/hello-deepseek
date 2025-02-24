import { Controller, Post, Body } from '@nestjs/common';
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
}
