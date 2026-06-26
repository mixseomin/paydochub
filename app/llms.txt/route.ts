import { EMPLOYERS } from "../lib/employers";

export const dynamic = "force-static";

// llms.txt — concise site map for AI answer engines (GPTBot, ClaudeBot, PerplexityBot, etc.)
export function GET() {
  const top = EMPLOYERS.slice(0, 80);
  const body = `# PayDocHub

> Independent, plain-English guides to employee portal login, pay stub access, and W-2 retrieval for US employers. Not affiliated with or endorsed by any employer.

## What this site answers
- How to log in to a specific employer's employee portal (including the HR/payroll platform it uses)
- How to view or download your pay stub
- How to get your W-2 tax form (employers must furnish it by January 31 each year; IRS Form 4852 is the last-resort substitute)

## Key pages
- All employers: https://paydochub.com/companies
- Create a pay stub: https://paydochub.com/paystub-maker

## Employer guides
${top.map((e) => `- [${e.name}](https://paydochub.com/${e.slug})`).join("\n")}

Full employer list: https://paydochub.com/companies
Sitemap: https://paydochub.com/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
