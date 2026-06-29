import { createBrowserClient } from '@supabase/ssr';
import { isMockMode, createMockSupabase } from './mockClient';

export const createClient = () => {
  if (isMockMode()) {
    return createMockSupabase();
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

