# PayDocHub — Rules

Next.js 16 + TypeScript + Tailwind v4 + Turbopack. Solo-operator civilian US-government-money calculator suite (Social Security, Capital Gains, Child Tax Credit, RMD) plus 4 hubs (retirement, passport, work, benefits). Domain: `paydochub.com`. PostHog-inspired neobrutalism aesthetic (cream BG + yellow accent + chunky borders).

## CẤM
- KHÔNG commit `.env*` (file đã ignore)
- KHÔNG dùng `scp` / `rsync` để push code lên `/opt/paydochub/` (GHA-managed, sẽ wipe khi deploy via `git reset --hard`)
- KHÔNG hardcode số liệu (rate/limit/threshold/bracket) trong code — luôn import từ committed JSON trong `data/`
- KHÔNG dùng emoji trong UI (PostHog clean aesthetic)
- KHÔNG dùng em dash (—); dùng dấu `-` (per `~/.claude/skills/writing/human-voice`)
- Output công khai: **English-only**

## BẮT BUỘC
- Deploy = `git push origin main` → GHA workflow SSH-triggers `/opt/paydochub/deploy.sh` → server self-pulls
- Bump `package.json` version mỗi release significant
- New calculator = `app/<calc-name>/page.tsx` + component in `app/components/` + logic/lookup helper in `app/lib/<calc>.ts`
- Calculators là gov-money: RMD, Social Security, Capital Gains, Child Tax Credit. Data files là committed JSON sourced from IRS/SSA (committed = source of truth for build-time imports, NOT lazy-fetched)
- Mọi calc page phải có: SEO meta, shareable URL state, mobile-first responsive

## Deploy flow
```
local: git push origin main
  → GHA ubuntu-latest runner
    → SSH root@5.78.65.158
      → /opt/paydochub/deploy.sh
        → cd /opt/paydochub
        → git fetch + git reset --hard origin/main
        → pnpm install --frozen-lockfile
        → pnpm build
        → systemctl restart paydochub
```

**Recovery from broken deploy:**
```
ssh root@5.78.65.158 'cd /opt/paydochub && git log -3 && pnpm build && systemctl restart paydochub'
```

## Repo structure

```
app/
  <calc>/page.tsx        # e.g. /rmd, /social-security calc pages
  guides/                # content hub pages (read from content/guides)
  components/            # shared UI (Header, CommandPalette, calc components)
  lib/                   # per-calc logic + cn.ts (clsx merge) + seo/
  globals.css            # PostHog design tokens
  layout.tsx             # root with Inter+JetBrains Mono
  page.tsx               # home
data/
  *.json                 # committed gov data (IRS/SSA sourced)
content/
  guides/                # markdown guide content
.github/workflows/
  deploy.yml             # SSH-trigger deploy
```

## Design tokens (CSS vars in globals.css)
- `--background: #EEEFE9` (cream)
- `--accent: #F9BD2B` (yellow; if copyright concern raised swap to `#FFC429`)
- `--teal: #1D4044` (sub-accent, trust badges)
- `--card-border: #1D1F27` (1.5px borders)
- `--shadow: 4px 4px 0 #1D1F27` (offset drop-shadow)
- Fonts: Inter (sans), JetBrains Mono (numbers/code)
- Border radius: 6px

## Adding new calculator
1. Create `app/<calc>/page.tsx` with metadata + Suspense + `<CalcComponent>`
2. Create `app/components/<Calc>Calc.tsx` with `"use client"` + state in URL
3. Add logic/lookup helpers in `app/lib/<calc>.ts`
4. Add entry to `CommandPalette.tsx` Calculators group
5. Add roadmap pill to home page (move from "soon" to "LIVE")
6. Run `pnpm exec tsc --noEmit` before commit

## Data update
Gov data (IRS/SSA limits, RMD tables, tax brackets, contribution caps) ships as committed JSON in `data/`. When the source agency releases new-year figures:
1. Update the relevant JSON in `data/` with the new figures (cite source agency)
2. Commit the updated JSON
3. Push → auto-deploy

## Server runtime
- Path: `/opt/paydochub/`
- Port: `3812`
- Systemd: `paydochub.service` (next start --port 3812)
- Nginx vhost: `/etc/nginx/sites-enabled/paydochub.com` (reverse proxy to :3812)
- SSL: LE certbot, `/etc/letsencrypt/live/paydochub.com/`
- Repo: `mixseomin/paydochub`
- CF: SSL mode = Full (after first deploy)
