'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string | null;
  role: 'admin' | 'instructor' | 'parent' | 'student';
  locale: string;
  total_xp: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  active_title: string | null;
  active_avatar_frame: string | null;
  active_profile_theme: string | null;
}

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
