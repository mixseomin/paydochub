import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-muted-2 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Pay docs</div>
            <ul className="space-y-1.5">
              <li><Link href="/companies" className="hover:underline">Employers</Link></li>
              <li><Link href="/paystub-maker" className="hover:underline">Create Pay Stub</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">About</div>
            <ul className="space-y-1.5">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Legal</div>
            <ul className="space-y-1.5">
              <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms</Link></li>
              <li><Link href="/report" className="hover:underline">Report / Brand removal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-card-border text-xs text-muted flex flex-col md:flex-row gap-2 md:justify-between">
          <div>© {new Date().getFullYear()} PayDocHub. Independent resource, not affiliated with any employer.</div>
          <div className="md:text-right">Informational only - confirm details with your employer or payroll before acting.</div>
        </div>
      </div>
    </footer>
  );
}
