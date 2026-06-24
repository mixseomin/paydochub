import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbs } from "../lib/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PayDocHub handles your data. No tracking of personal info, no selling, no third-party ad tracking. We never ask for your login or SSN.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-10 prose-sm">
      <JsonLd data={breadcrumbs([{ name: "Privacy", path: "/privacy" }])} />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-xs text-muted mb-8">Last updated: June 19, 2026</p>

      <Section title="Summary">
        We do not sell your data. We do not use third-party advertising trackers. We collect the minimum information needed to run the site and send you the email updates you opted in for.
      </Section>

      <Section title="Who we are (data controller)">
        <p>The data controller for this site is <b>PayDocHub, 10685-B Hazelhurst Dr #43316, Houston, TX 77043, USA</b>. You can reach us about any privacy matter at <a href="mailto:hello@paydochub.com">hello@paydochub.com</a>.</p>
      </Section>

      <Section title="What we collect">
        <ul>
          <li><b>Page activity:</b> Nothing is sent to our server unless you submit a form.</li>
          <li><b>Email subscriptions:</b> If you join the waitlist, we store your email address and optional ZIP code in our email service (Mailjet).</li>
          <li><b>Analytics:</b> We use privacy-respecting analytics (Google Analytics 4 with IP anonymization, and optionally Microsoft Clarity for usage understanding). These are <b>analytics tools, not advertising trackers</b>: we use them only to understand which pages are used and where pages break, never to build advertising profiles or retarget you. Google Signals (cross-device advertising features in GA4) is turned <b>off</b>. No cross-site tracking.</li>
          <li><b>Server logs:</b> Standard web server logs (IP, user agent, timestamps) retained 30 days for security and abuse prevention.</li>
        </ul>
      </Section>

      <Section title="What we do not collect">
        <ul>
          <li>Your employee portal login, username, or password.</li>
          <li>Social Security number, government-issued ID number, or any other sensitive personally-identifying data.</li>
          <li>Bank, financial, or credit information.</li>
        </ul>
      </Section>

      <Section title="How we use your information">
        <ul>
          <li>To send you the email updates you opted in for - a few times a year, mainly when the pay stub generator launches or a new tool ships.</li>
          <li>To understand which pages are most used so we can prioritize improvements.</li>
          <li>To prevent abuse (rate limiting, spam protection).</li>
        </ul>
      </Section>

      <Section title="Email">
        We use <a href="https://www.mailjet.com" target="_blank" rel="noopener noreferrer">Mailjet</a> for transactional and campaign email. Every email we send includes a one-click unsubscribe link. We honor unsubscribe requests immediately and never email an unsubscribed address again.
      </Section>

      <Section title="Data retention">
        <ul>
          <li><b>Email address:</b> We keep your email until you unsubscribe. After you unsubscribe, we retain it only on a suppression list so we can comply with our legal obligation under CAN-SPAM never to email you again.</li>
          <li><b>Server logs:</b> Retained 30 days, then deleted.</li>
          <li><b>Page activity:</b> Never leaves your browser, so there is nothing for us to retain.</li>
        </ul>
      </Section>

      <Section title="Cookies">
        We use a minimal number of first-party cookies for analytics and remembering pages you saved on this device. We do not use third-party advertising cookies.
      </Section>

      <Section title="Legal basis for processing (GDPR)">
        <ul>
          <li><b>Consent:</b> We send marketing and rate-change email only because you opted in. You can withdraw consent at any time by unsubscribing, with no effect on email already sent.</li>
          <li><b>Legitimate interest:</b> We keep short-lived server logs to secure the site and prevent abuse, which is in our legitimate interest in running a safe service.</li>
        </ul>
      </Section>

      <Section title="Your rights">
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li><b>Access</b> the personal data we hold about you.</li>
          <li><b>Rectify</b> inaccurate or incomplete data.</li>
          <li><b>Erase</b> your data (the right to be forgotten).</li>
          <li><b>Restrict</b> how we process your data.</li>
          <li><b>Object</b> to processing based on legitimate interest.</li>
          <li><b>Port</b> your data, receiving it in a portable format.</li>
          <li><b>Complain</b> to a supervisory authority (for EU/UK residents, your local data protection authority).</li>
        </ul>
        <p>You can unsubscribe from email at any time using the link in every email we send, or exercise any of the rights above by emailing <a href="mailto:hello@paydochub.com">hello@paydochub.com</a>. We respond to all such requests within 7 business days.</p>
      </Section>

      <Section title="International data transfers">
        PayDocHub is operated from, and its service providers are based in, the United States. If you contact us or subscribe from outside the US, your data is transferred to and processed in the US. Where required, such transfers rely on appropriate safeguards such as the EU Standard Contractual Clauses (SCCs) or the EU-US Data Privacy Framework (DPF) where applicable.
      </Section>

      <Section title="Third-party services">
        <ul>
          <li><b>Cloudflare</b> for DNS and edge security.</li>
          <li><b>Mailjet</b> for email delivery.</li>
          <li><b>Google Analytics 4</b> for usage statistics (IP anonymized).</li>
          <li><b>Microsoft Clarity</b> (optional) for understanding page usage flows.</li>
        </ul>
      </Section>

      <Section title="Children">
        PayDocHub is intended for adults. We do not knowingly collect information from anyone under 13.
      </Section>

      <Section title="Changes">
        If we update this policy, we will post the new version here with a fresh date. Material changes affecting how we handle email will be announced in our next subscriber email.
      </Section>

      <Section title="Contact">
        Questions about privacy: <a href="mailto:hello@paydochub.com">hello@paydochub.com</a>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="text-sm leading-relaxed space-y-3 [&_a]:text-teal [&_a]:font-semibold [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
