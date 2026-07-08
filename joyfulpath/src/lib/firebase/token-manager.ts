import { createClient } from '@/lib/supabase/client';

/**
 * Register FCM token in Supabase for push notifications
 */
export async function registerFCMToken(token: string, userId: string) {
  try {
    const supabase = createClient();

    // Store token with device info
    const deviceInfo = {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    };

    // Try to update existing token, or insert new
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: userId,
        token,
        device_info: deviceInfo,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,token',
      });

    if (error) {
      console.error('Error registering FCM token:', error);
      return false;
    }

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
    const supabase = createClient();

    const { error } = await supabase
      .from('fcm_tokens')
      .update({ is_active: false })
      .eq('token', token)
      .eq('user_id', userId);

    if (error) throw error;
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
    const supabase = createClient();

    const { data, error } = await supabase
      .from('fcm_tokens')
      .select('token')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data?.map(t => t.token) || [];
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
    const supabase = createClient();

    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .lt('updated_at', beforeDate.toISOString())
      .eq('is_active', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to cleanup tokens:', error);
    return false;
  }
}
