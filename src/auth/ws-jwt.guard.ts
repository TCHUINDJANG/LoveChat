import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard extends AuthGuard('ws-jwt') implements CanActivate {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Conversion du contexte WebSocket en contexte HTTP
    const client = context.switchToWs().getClient();
    const request = client.request;
    
    // Crée un faux contexte HTTP pour le AuthGuard standard
    const httpContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    };

    return super.canActivate(httpContext as ExecutionContext);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}