import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加全局路由前缀
  app.setGlobalPrefix('api');

  // 启用 CORS
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
