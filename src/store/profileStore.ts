import { create } from "zustand";
import {
  getActiveProfileId,
  getProfiles,
  hashPin,
  setActiveProfileId,
  setProfiles,
  type Profile,
} from "@/lib/storage";

type State = {
  hydrated: boolean;
  profiles: Profile[];
  activeId: string | null;
  hydrate: () => void;
  createProfile: (name: string, pin: string) => Profile;
  signIn: (id: string, pin: string) => boolean;
  signOut: () => void;
  deleteProfile: (id: string) => void;
};

export const useProfileStore = create<State>((set, get) => ({
  hydrated: false,
  profiles: [],
  activeId: null,
  hydrate: () => {
    set({ profiles: getProfiles(), activeId: getActiveProfileId(), hydrated: true });
  },
  createProfile: (name, pin) => {
    const profile: Profile = {
      id: `p_${Date.now().toString(36)}`,
      name: name.trim(),
      pinHash: hashPin(pin),
      createdAt: Date.now(),
    };
    const next = [...get().profiles, profile];
    setProfiles(next);
    setActiveProfileId(profile.id);
    set({ profiles: next, activeId: profile.id });
    return profile;
  },
  signIn: (id, pin) => {
    const p = get().profiles.find((x) => x.id === id);
    if (!p || p.pinHash !== hashPin(pin)) return false;
    setActiveProfileId(id);
    set({ activeId: id });
    return true;
  },
  signOut: () => {
    setActiveProfileId(null);
    set({ activeId: null });
  },
  deleteProfile: (id) => {
    const next = get().profiles.filter((p) => p.id !== id);
    setProfiles(next);
    if (get().activeId === id) {
      setActiveProfileId(null);
      set({ activeId: null });
    }
    set({ profiles: next });
    if (typeof window !== "undefined") localStorage.removeItem(`dsa-hub:v1:${id}:gallery`);
  },
}));

export const useActiveProfile = (): Profile | null => {
  const { profiles, activeId } = useProfileStore();
  return profiles.find((p) => p.id === activeId) ?? null;
};
