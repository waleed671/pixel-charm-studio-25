import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Download, LogOut, Trash2, Upload, UserCircle2 } from "lucide-react";
import { useActiveProfile, useProfileStore } from "@/store/profileStore";
import { useGalleryStore } from "@/store/galleryStore";
import { storageUsageKB, type GalleryItem } from "@/lib/storage";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — DSA Hub" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useActiveProfile();
  const { signOut } = useProfileStore();
  const { items, importItems, clear } = useGalleryStore();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ profile: profile.name, items }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `dsa-hub-${profile.name}-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.items)) throw new Error("Invalid file");
      importItems(profile.id, parsed.items as GalleryItem[]);
      alert(`Imported ${parsed.items.length} items.`);
    } catch (e) {
      alert("Import failed: " + (e instanceof Error ? e.message : "unknown error"));
    }
  };

  const usage = storageUsageKB();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--surface-2)] text-[color:var(--cyan)]">
          <UserCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{profile.name}</h1>
          <p className="font-mono text-xs text-muted-foreground">// local profile · {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={signOut} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-border-strong">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Saved questions" value={items.length} />
        <Stat label="Storage used" value={`${usage} KB`} />
        <Stat label="Topics with images" value={new Set(items.map((i) => i.topicSlug)).size} />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-[color:var(--surface)] p-6">
        <h2 className="text-lg font-semibold">Backup & restore</h2>
        <p className="mt-1 text-sm text-muted-foreground">Export your gallery as JSON or import a previous backup.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={exportData} className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--cyan)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-foreground)]">
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:border-border-strong">
            <Upload className="h-4 w-4" /> Import JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[color:var(--red)]/30 bg-[color:var(--red)]/5 p-6">
        <h2 className="text-lg font-semibold text-[color:var(--red)]">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Permanently delete every saved image for this profile.</p>
        <button
          onClick={() => { if (confirm("Delete ALL saved images for this profile?")) clear(profile.id); }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[color:var(--red)]/40 bg-[color:var(--red)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--red)]"
        >
          <Trash2 className="h-4 w-4" /> Clear all images
        </button>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-[color:var(--surface)] p-4">
      <div className="font-mono text-3xl font-bold text-[color:var(--cyan)]">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
