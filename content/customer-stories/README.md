# Customer Stories

Long-form narratives about Aksha Digital Foundation's client engagements. Each story is a stand-alone folder so the site build can pick it up automatically, and the story + its assets + its metadata stay together.

## Folder layout

```
content/customer-stories/
├── README.md                  ← this file
├── index.json                 ← machine-readable list of published stories
├── _template/                 ← copy-paste starter for new stories
│   ├── story.md
│   ├── metadata.yaml
│   └── assets/
└── YYYY-MM-client-slug/       ← one folder per story
    ├── index.md               ← the story (markdown + frontmatter)
    ├── metadata.yaml          ← structured facts (tech stack, outcomes, tags)
    └── assets/                ← screenshots, logos, hero image
```

## Naming convention

- **Folder name**: `YYYY-MM-client-slug` (e.g. `2026-04-npcws`). The date is *publication* date, not project start.
- **Client slug**: lowercase, hyphen-separated, short. Match the client's shortname.
- **Story file**: always `index.md`. Multi-chapter stories use `chapter-1.md`, `chapter-2.md` alongside `index.md`.

## Frontmatter fields (in `index.md`)

| Key | Required | Example |
|---|---|---|
| `title` | yes | `"First Light — NPCWS Welfare Society"` |
| `slug` | yes | `"npcws"` |
| `client` | yes | `"Nagarampalem Police Children Welfare Society"` |
| `industry` | yes | `"Welfare Society / Non-profit"` |
| `location` | yes | `"Guntur, Andhra Pradesh"` |
| `date_published` | yes | `2026-04-20` |
| `status` | yes | `"live"` / `"draft"` / `"archived"` |
| `phase` | no | `"Phase 1 delivered"` |
| `summary` | yes | One-sentence hook shown in the story index. |
| `hero_image` | no | `assets/hero.png` |
| `tags` | no | `["welfare", "gcp", "kubernetes", "react"]` |
| `featured` | no | `true` to pin to top of listing |

## Adding a new story

1. Copy the `_template/` folder to `YYYY-MM-new-client/`.
2. Rename `story.md` to `index.md`, fill in the frontmatter, write the narrative.
3. Drop client-permitted screenshots and logos into `assets/`.
4. Fill in `metadata.yaml` with the structured facts.
5. Append the new entry to `index.json`.
6. Commit and push — the site picks it up on next build.

## Client approval

**Nothing in this folder is published until the client has approved the story in writing.** Store the approval email/PDF alongside the story as `assets/client-approval.pdf` (do not commit if it contains personal data; keep it locally). Redact member names and faces by default. When in doubt, ask the client.
