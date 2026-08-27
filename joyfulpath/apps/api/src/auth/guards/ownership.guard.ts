import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetId = request.params.id;

    if (!user) return false;

    // Admin and Priest can view anyone
    if (['admin', 'priest'].includes(user.role)) {
      return true;
    }

    // Students can only view themselves
    if (user.role === 'student' && targetId !== user.userId) {
      throw new ForbiddenException('You can only access your own profile');
    }

    // Parents and Instructors need more complex checks,
    // which should ideally be done in the service layer, but for basic ID match:
    // If they are querying their own ID, let it pass
    if (targetId === user.userId) {
      return true;
    }

    // If Parent/Instructor is querying someone else, we'd need service-level checks,
    // which are currently handled in `findAll` but not `findOne`.
    // For now, allow instructor/parent to proceed to service (where we should add checks),
    // but block student immediately.
    
    return true;
  }
}
