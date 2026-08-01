'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string | null;
  role: 'admin' | 'instructor' | 'parent' | 'student' | 'priest';
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getSession() {
      const match = document.cookie.match(new RegExp('(^| )ACCESS_TOKEN=([^;]+)'));
      if (match) {
        const token = match[2];
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            setUser(payload);
            
            setProfile({
              id: payload.sub,
              email: payload.email,
              username: payload.username,
              role: payload.role,
              first_name: payload.username,
              last_name: '',
              display_name: payload.username,
              avatar_url: null,
              locale: 'en',
              total_xp: 0,
              total_points: 0,
              current_streak: 0,
              longest_streak: 0,
              active_title: null,
              active_avatar_frame: null,
              active_profile_theme: null
            });
          }
        } catch (e) {
          console.warn('Failed to parse JWT in useUser', e);
        }
      }
      setLoading(false);
    }

    getSession();
  }, []);

  return { user, profile, loading };
}
