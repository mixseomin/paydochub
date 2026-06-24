export type FaqItem = { q: string; a: string };
export type FaqCategory = { category: string; slug: string; items: FaqItem[] };

export const faq: FaqCategory[] = [
  {
    category: "About PayDocHub",
    slug: "about",
    items: [
      {
        q: "What is PayDocHub?",
        a: "PayDocHub is an independent guide that helps employees find their employer's portal login, view or download pay stubs, and access their W-2 tax forms. Each employer has its own page with plain-English steps.",
      },
      {
        q: "Is PayDocHub affiliated with my employer?",
        a: "No. PayDocHub is an independent informational resource and is not affiliated with, endorsed by, or connected to any employer. Company names and trademarks belong to their respective owners.",
      },
      {
        q: "Do I need an account to use PayDocHub?",
        a: "No. The guides are free to read with no sign-up. You can optionally join a waitlist for the pay stub generator.",
      },
    ],
  },
  {
    category: "Login & portal access",
    slug: "login",
    items: [
      {
        q: "How do I log in to my employee portal?",
        a: "Open your employer's official portal, enter your employee ID or username and your password, then sign in. Always start from your employer's own site or a link HR gave you, not a search ad.",
      },
      {
        q: "I'm locked out of my portal - what do I do?",
        a: "Use the \"Forgot password\" link on the login screen to reset by email or text. If that does not work, contact your employer's HR or IT help desk to unlock your account.",
      },
    ],
  },
  {
    category: "Pay stubs",
    slug: "pay-stubs",
    items: [
      {
        q: "Where do I find my pay stub?",
        a: "Log in to your employee portal and open the Pay or Payroll section, often labeled \"Pay statements\" or \"Earnings.\" Select a pay period to view or download the PDF.",
      },
      {
        q: "I lost a pay stub - can I get it again?",
        a: "Yes. Reprint it from the Pay section of your portal, where past stubs are usually stored. If you no longer have access, ask your employer's payroll or HR to resend it. You can also create a replacement with our pay stub generator.",
      },
    ],
  },
  {
    category: "W-2 forms",
    slug: "w-2",
    items: [
      {
        q: "When will I get my W-2?",
        a: "Employers must furnish W-2 forms by January 31 each year, so your W-2 for the prior tax year should be available - in the portal or by mail - by the end of January.",
      },
      {
        q: "My W-2 is missing - what are my options?",
        a: "Check the Tax Documents section of your portal first, then contact payroll for a copy. As a last resort, you can file IRS Form 4852 as a substitute for a missing W-2.",
      },
    ],
  },
  {
    category: "Privacy & email",
    slug: "privacy",
    items: [
      {
        q: "Does PayDocHub store my login or personal data?",
        a: "No. We never ask for your portal login, password, or Social Security number. The only data we keep is an email address if you choose to join the waitlist.",
      },
      {
        q: "How often will you email me?",
        a: "Only if you opt in, and rarely - mainly to let you know when the pay stub generator launches. Every email has a one-click unsubscribe.",
      },
    ],
  },
];

export function totalFaqCount(): number {
  return faq.reduce((sum, c) => sum + c.items.length, 0);
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((c) =>
      c.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    ),
  };
}
