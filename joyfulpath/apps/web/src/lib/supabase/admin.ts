import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { isMockMode, createMockSupabase } from './mockClient';

export const createAdminClient = () => {
  if (isMockMode()) {
    return createMockSupabase();
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

