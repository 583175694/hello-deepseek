import {
  Controller,
  Post,
  Body,
  Get,
  Logger,
  Headers,
  Param,
  Query,
} from '@nestjs/common';
import { PPTService } from './ppt.service';

interface GenerateOutlineDto {
  title: string;
  pptId?: string;
}

interface GenerateContentDto {
  title: string;
  outline: string;
  pptId?: string;
}

@Controller('ppt')
export class PPTController {
  private readonly logger = new Logger(PPTController.name);

  constructor(private readonly pptService: PPTService) {}

  @Post('generate-outline')
  async generateOutline(
    @Headers('x-client-id') clientId: string,
    @Body() dto: GenerateOutlineDto,
  ) {
    return await this.pptService.generateOutline(
      clientId,
      dto.title,
      dto.pptId,
    );
  }

  @Post('generate-content')
  async generateContent(
    @Headers('x-client-id') clientId: string,
    @Body() dto: GenerateContentDto,
  ) {
    return await this.pptService.generateContent(
      clientId,
      dto.title,
      dto.outline,
      dto.pptId,
    );
  }

  @Get('auth/code')
  async getAuthCode(@Headers('x-client-id') clientId: string) {
    try {
      return await this.pptService.getAuthCode(clientId);
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }

  @Get('operations/:operationId')
  async getOperationById(@Param('operationId') operationId: number) {
    return await this.pptService.getOperationById(operationId);
  }

  @Get('operations')
  async getOperationsByClientId(
    @Headers('x-client-id') clientId: string,
    @Query('pptId') pptId?: string,
  ) {
    if (pptId) {
      return await this.pptService.getOperationsByPptId(pptId);
    }
    return await this.pptService.getOperationsByClientId(clientId);
  }
}
