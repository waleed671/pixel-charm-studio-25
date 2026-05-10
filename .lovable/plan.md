
# DSA Research Hub — Build Plan

A polished, fully responsive React rebuild of your DSA reference site. Dark cyber/terminal aesthetic, refined typography, smooth motion, and a per-topic image gallery where users save question screenshots locally in their browser.

## Note on your choices

You picked **localStorage only** + **per-user private galleries**. Without a real backend there is no true authentication, so "per-user" will work as a **local profile system**: on first visit the user creates a local profile (display name + 4-digit PIN). All their data is namespaced under that profile in localStorage on this device only. They can switch profiles or sign out. If you later want real cross-device accounts, we can add Lovable Cloud.

## Pages / Routes

```
/                  Landing — hero, stats, topic overview, CTA
/topics            All 8 topics grid (filter + search)
/topics/$slug      Topic detail: complexity table, key concepts,
                   algorithms, code snippets, your gallery
/cheatsheet        Big-O cheat sheet across all structures
/profile           Local profile (name, PIN, export/import data, clear)
```

Topics: arrays, linked-lists, stacks-queues, trees, graphs, heaps, sorting, searching.

## Core Features

1. **8 topic detail pages** — each with:
   - Complexity table (operation × time × space)
   - Key concepts / techniques list
   - Algorithms grid with best/avg/worst Big-O badges
   - Optional code snippet (JS/Python tabs) with copy button
   - Personal question-image gallery
2. **Image gallery per topic**
   - Add via drag-drop or file picker (modal)
   - Stored as base64 in localStorage, namespaced by profile + topic
   - Optional caption + difficulty tag (Easy/Medium/Hard)
   - Lightbox preview, delete, reorder
   - Storage-quota warning when nearing ~5 MB
3. **Search** across topics and saved questions (Cmd/Ctrl+K command palette)
4. **Cheat sheet** — sortable table of every operation across structures
5. **Local profiles** — create / switch / sign out, export & import JSON backup
6. **Responsive** — mobile bottom nav, tablet/desktop sidebar; tested at 360 / 768 / 1280
7. **Smooth motion** via framer-motion (hero reveal, card hover, modal transitions)

## Visual Direction (refined)

- Base palette stays dark with cyan/purple accents but tuned with oklch tokens, softer surfaces, and stronger contrast for accessibility
- Typography: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (code/labels) — slightly more modern than Fira Code
- Subtle grid + radial-glow background, glassmorphism nav, gradient accent borders on topic cards
- Hero: animated gradient headline, blinking status badge, animated stat counters
- Micro-interactions: card lift on hover, ripple on buttons, animated underline on nav
- Light mode toggle included (dark default)

## Technical Details

- **Stack**: existing TanStack Start + React 19 + Tailwind v4 + shadcn/ui
- **State**: Zustand store for profile + galleries, persisted to `localStorage`
  - Storage shape: `dsa-hub:v1:{profileId}:gallery:{topicSlug}` → `Item[]`
  - Profile registry: `dsa-hub:v1:profiles`
- **Animation**: framer-motion
- **Icons**: lucide-react
- **Routing**: file-based routes under `src/routes/` with per-route `head()` SEO meta
- **Data**: topics defined in `src/data/topics.ts` (single source of truth for tables, concepts, algorithms, code snippets)
- **Components**: `TopicCard`, `ComplexityTable`, `AlgorithmGrid`, `Gallery`, `UploadModal`, `Lightbox`, `CommandPalette`, `ProfileGate`
- **No backend** — everything local. PIN is hashed before storage (note: local-only protection, not real auth)

## File Structure (new)

```
src/
  routes/
    index.tsx              landing
    topics.tsx             all topics
    topics.$slug.tsx       topic detail
    cheatsheet.tsx
    profile.tsx
  components/
    layout/{Nav,Footer,MobileNav}.tsx
    topic/{ComplexityTable,AlgorithmGrid,CodeBlock}.tsx
    gallery/{Gallery,UploadModal,Lightbox,GalleryItem}.tsx
    ui-extra/{CommandPalette,ProfileGate,EmptyState}.tsx
  data/topics.ts
  store/{profileStore,galleryStore}.ts
  lib/storage.ts
  styles.css               extended tokens
```

## Out of Scope (call out later if you want)

- Real authentication / cross-device sync (would need Lovable Cloud)
- Sharing galleries with other users
- Server-side image storage / large image quota
- Markdown notes per question (can add easily later)

Ready to build when you approve.
