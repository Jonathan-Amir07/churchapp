/**
 * RBAC (Role-Based Access Control) - Central permission definitions
 * 
 * Roles (ordered by privilege level, highest first):
 *   priest  – Full system access, manage roles/permissions/settings/analytics/backups/audit
 *   admin   – Full management of every module
 *   instructor – View almost everything, manage ONLY assigned classes/students
 *   parent  – View own children's data
 *   student – Access only assigned content
 */

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// ─── Role types ──────────────────────────────────────────────────────────────

export type UserRole = 'priest' | 'admin' | 'instructor' | 'parent' | 'student';

export const ALL_ROLES: UserRole[] = ['priest', 'admin', 'instructor', 'parent', 'student'];

// ─── Role hierarchy helpers ──────────────────────────────────────────────────

/** Roles that have full administrative privileges (no resource scoping). */
export const ADMIN_ROLES: UserRole[] = ['priest', 'admin'];

/** Roles that can access the /admin dashboard area. */
export const DASHBOARD_ADMIN_ROLES: UserRole[] = ['priest', 'admin', 'instructor'];

/** Roles that can manage content (create/edit lessons, quizzes, tasks, etc.) */
export const CONTENT_MANAGER_ROLES: UserRole[] = ['priest', 'admin', 'instructor'];

/** Only these roles can permanently delete records. */
export const CAN_HARD_DELETE_ROLES: UserRole[] = ['priest', 'admin'];

/** Only these roles can manage users, permissions, and system settings. */
export const USER_MANAGEMENT_ROLES: UserRole[] = ['priest', 'admin'];

/** Only priest can manage system settings, analytics exports, backups, audit logs. */
export const SYSTEM_SETTINGS_ROLES: UserRole[] = ['priest'];

// ─── Permission check functions ──────────────────────────────────────────────

export function hasRole(userRole: string, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole as UserRole);
}

export function isAdmin(role: string): boolean {
  return hasRole(role, ADMIN_ROLES);
}

export function isContentManager(role: string): boolean {
  return hasRole(role, CONTENT_MANAGER_ROLES);
}

export function canHardDelete(role: string): boolean {
  return hasRole(role, CAN_HARD_DELETE_ROLES);
}

export function canManageUsers(role: string): boolean {
  return hasRole(role, USER_MANAGEMENT_ROLES);
}

export function canManageSystemSettings(role: string): boolean {
  return hasRole(role, SYSTEM_SETTINGS_ROLES);
}

// ─── Session + authorization helpers ─────────────────────────────────────────

export interface AuthSession {
  user: {
    id: string;
    role: string;
    email?: string;
    name?: string;
    accountStatus?: string;
  };
}

/**
 * Require authentication. Returns the session or a 401 JSON response.
 */
export async function requireAuth(): Promise<AuthSession | NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session as AuthSession;
}

/**
 * Require authentication AND one of the specified roles.
 * Returns the session or a 401/403 JSON response.
 */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthSession | NextResponse> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (!hasRole(result.user.role, allowedRoles)) {
    return NextResponse.json(
      { error: 'Forbidden: insufficient permissions' },
      { status: 403 }
    );
  }
  return result;
}

// ─── Resource scoping helpers ────────────────────────────────────────────────

/**
 * For instructors: verify they are assigned to a specific class.
 * Admins/priests bypass this check.
 */
export async function verifyClassAccess(
  userId: string,
  userRole: string,
  classId: string
): Promise<boolean> {
  // Admins and priests have unrestricted access
  if (isAdmin(userRole)) return true;

  // Instructors must be a member of the class
  if (userRole === 'instructor') {
    const membership = await prisma.classMember.findFirst({
      where: {
        classId,
        userId,
        role: 'instructor',
        isActive: true,
      },
    });
    return !!membership;
  }

  // Students must be a member of the class
  if (userRole === 'student') {
    const membership = await prisma.classMember.findFirst({
      where: {
        classId,
        userId,
        role: 'student',
        isActive: true,
      },
    });
    return !!membership;
  }

  return false;
}

/**
 * For parents: verify a student is their child.
 */
export async function verifyParentChildAccess(
  parentId: string,
  studentId: string
): Promise<boolean> {
  const link = await prisma.parentChild.findFirst({
    where: {
      parentId,
      childId: studentId,
    },
  });
  return !!link;
}

/**
 * Get all class IDs an instructor is assigned to.
 */
export async function getInstructorClassIds(userId: string): Promise<string[]> {
  const memberships = await prisma.classMember.findMany({
    where: {
      userId,
      role: 'instructor',
      isActive: true,
    },
    select: { classId: true },
  });
  return memberships.map((m: any) => m.classId);
}

/**
 * Get all student IDs for a parent's children.
 */
export async function getParentChildIds(parentId: string): Promise<string[]> {
  const links = await prisma.parentChild.findMany({
    where: { parentId },
    select: { childId: true },
  });
  return links.map((l: any) => l.childId);
}
