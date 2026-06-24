# PayDocHub

Fast, free calculators for US-government money decisions - Social Security, Capital Gains, Child Tax Credit, and Required Minimum Distributions (RMD). Built for clear answers, not lead-gen funnels.

Live: https://paydochub.com

## Stack

Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + cmdk + Recharts.

## Calculators and hubs

- Calculators: Social Security, Capital Gains, Child Tax Credit, RMD (Required Minimum Distribution)
- Hubs: Retirement, Passport, Work, Benefits

## Local dev

```bash
pnpm install
pnpm dev --port 3812
# Open http://localhost:3812
```

## Data

Calculator figures (IRS/SSA limits, tax brackets, RMD tables, contribution caps) ship as committed JSON in `data/`, sourced from the relevant US government agency. Updating a figure means editing the JSON and committing it.

## Deploy

`git push origin main` triggers GitHub Actions, which SSHes into Hetzner and runs `/opt/paydochub/deploy.sh` (git pull + build + systemd restart). See `CLAUDE.md` for details.

## License

Code: MIT. Data: U.S. Government public domain (IRS / SSA published figures).
