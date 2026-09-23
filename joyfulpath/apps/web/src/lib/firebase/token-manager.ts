/**
 * Register FCM token
 */
export async function registerFCMToken(token: string, userId: string) {
  try {
    // In V1, FCM token registration via backend is omitted unless implemented.
    return true;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    return false;
  }
}

/**
 * Unregister FCM token (on logout)
 */
export async function unregisterFCMToken(token: string, userId: string) {
  try {
    return true;
  } catch (error) {
    console.error('Failed to unregister FCM token:', error);
    return false;
  }
}

/**
 * Get all active tokens for a user
 */
export async function getActiveTokensForUser(userId: string) {
  try {
    return [];
  } catch (error) {
    console.error('Failed to get active tokens:', error);
    return [];
  }
}

/**
 * Clean up expired/inactive tokens
 */
export async function cleanupOldTokens(beforeDate: Date) {
  try {
    return true;
  } catch (error) {
    console.error('Failed to cleanup tokens:', error);
    return false;
  }
}
