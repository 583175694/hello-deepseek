import { Controller, Get, Logger, Headers } from '@nestjs/common';
import { AipptService } from './aippt.service';

@Controller('aippt')
export class AipptController {
  private readonly logger = new Logger(AipptController.name);

  constructor(private readonly aipptService: AipptService) {}

  @Get('auth/code')
  async getAuthCode(@Headers('x-client-id') clientId: string) {
    try {
      const code = await this.aipptService.getAuthCode();
      return { code };
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }
}
