import { create } from "zustand";
import { getGallery, setGallery, type GalleryItem } from "@/lib/storage";

type State = {
  items: GalleryItem[];
  loadedFor: string | null;
  load: (profileId: string) => void;
  add: (profileId: string, item: Omit<GalleryItem, "id" | "createdAt">) => void;
  remove: (profileId: string, id: string) => void;
  clear: (profileId: string) => void;
  importItems: (profileId: string, items: GalleryItem[]) => void;
};

export const useGalleryStore = create<State>((set, get) => ({
  items: [],
  loadedFor: null,
  load: (profileId) => set({ items: getGallery(profileId), loadedFor: profileId }),
  add: (profileId, item) => {
    const next: GalleryItem = {
      ...item,
      id: `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    const items = [next, ...get().items];
    setGallery(profileId, items);
    set({ items });
  },
  remove: (profileId, id) => {
    const items = get().items.filter((x) => x.id !== id);
    setGallery(profileId, items);
    set({ items });
  },
  clear: (profileId) => {
    setGallery(profileId, []);
    set({ items: [] });
  },
  importItems: (profileId, items) => {
    setGallery(profileId, items);
    set({ items });
  },
}));

export const useTopicGallery = (slug: string) =>
  useGalleryStore((s) => s.items.filter((i) => i.topicSlug === slug));
