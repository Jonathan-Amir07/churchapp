import { createBrowserClient } from '@supabase/ssr';
import { isMockMode, createMockSupabase } from './mockClient';

let mockClientInstance: any = null;

export const createClient = () => {
  if (isMockMode()) {
    if (!mockClientInstance) {
      mockClientInstance = createMockSupabase();
    }
    return mockClientInstance;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

