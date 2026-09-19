import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor that converts null or undefined responses into safe empty objects or arrays
 * depending on what the endpoint might expect.
 *
 * If a response is null or undefined:
 * - If the request path ends with a specific ID (e.g. /users/1), it returns {}
 * - If the request path is a collection (e.g. /users), it returns []
 */
@Injectable()
export class NullToEmptyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If data is already valid, return it
        if (data !== null && data !== undefined) {
          return data;
        }

        // Otherwise, infer from URL whether to return [] or {}
        const req = context.switchToHttp().getRequest();
        const path = req.path; // e.g., /api/classes/123

        // A simple heuristic: if the path ends with a UUID or number, it's likely a single resource request
        // Otherwise, it's likely a collection request.
        // Let's use a regex to see if it ends with an ID-like segment
        const endsWithIdRegex = /\/[a-zA-Z0-9-]{10,}$|\/\d+$/;

        if (endsWithIdRegex.test(path)) {
          return {}; // single item fallback
        } else {
          return []; // collection fallback
        }
      }),
    );
  }
}
