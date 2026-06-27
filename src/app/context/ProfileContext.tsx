import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ProfileData {
  name: string;
  email: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  goal: string;
  memberSince: string;
}

const URLS = {
  READ:   'http://localhost:3001/api/profile',
  UPDATE: 'http://localhost:3001/api/profile/update',
};

async function postJson<T = unknown>(url: string, body?: object): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  const text = await res.text();
  if (!text.trim()) return undefined as unknown as T;
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Omit<ProfileData, 'memberSince'>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(URLS.READ);
      if (!res.ok) throw new Error(`Erro ${res.status} ao obter perfil`);
      const data = await res.json();
      setProfile({
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        age: data.age !== null ? Number(data.age) : null,
        weight: data.weight !== null ? Number(data.weight) : null,
        height: data.height !== null ? Number(data.height) : null,
        goal: String(data.goal ?? ''),
        memberSince: String(data.memberSince ?? 'junho de 2025'),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao obter dados de perfil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updatedData: Omit<ProfileData, 'memberSince'>) => {
    setLoading(true);
    setError(null);
    try {
      await postJson(URLS.UPDATE, updatedData);
      await fetchProfile();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao atualizar perfil';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, error, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
