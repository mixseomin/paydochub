import Script from "next/script";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              var rh = '(direct)';
              try { if (document.referrer) rh = new URL(document.referrer).hostname; } catch (e) {}
              gtag('set', { ref_host: rh });
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}
          </Script>
          {/* page-events.js — chuẩn đo trang chung (cuộn 10→100 · giây hiện · click_inside/click_buy/click_out
              với chiều `label`); nguồn duy nhất repo adfond packages/page-events, chuẩn adfond/docs/page-events.md.
              Một URL cho mọi site: đổi nguồn là mọi site lên bản mới sau ≤10 phút, không dựng lại. */}
          <Script src="https://adfond.com/page-events.js" strategy="afterInteractive" />
        </>
      )}
      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}
    </>
  );
}
