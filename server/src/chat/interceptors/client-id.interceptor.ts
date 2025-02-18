import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ClientIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const clientId = request.headers['x-client-id'];

    if (!clientId) {
      throw new UnauthorizedException('Client ID is required');
    }

    // 将 clientId 添加到请求对象中，以便在控制器中使用
    request.clientId = clientId;

    return next.handle();
  }
}
