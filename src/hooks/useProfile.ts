"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserProfile } from "@/lib/types";

const STORAGE_KEY = "interview_simulator_profile";

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const saveProfile = useCallback((p: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      document.cookie = "profile_complete=1; path=/; max-age=31536000";
      setProfileState(p);
    } catch {
      // ignore
    }
  }, []);

  const clearProfile = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = "profile_complete=; path=/; max-age=0";
      setProfileState(null);
    } catch {
      // ignore
    }
  }, []);

  return { profile, loaded, saveProfile, clearProfile };
}
