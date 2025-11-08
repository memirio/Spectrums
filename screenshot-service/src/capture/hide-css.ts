export const HIDE_OVERLAYS = `
/* Cookie consent banners and popups */
[id*="cookie"], 
[id*="Cookie"], 
[id*="COOKIE"],
[class*="cookie"], 
[class*="Cookie"], 
[class*="COOKIE"],
[id*="consent"],
[class*="consent"],
[id*="gdpr"],
[class*="gdpr"],
[id*="cookie-banner"],
[class*="cookie-banner"],
[id*="cookie-notice"],
[class*="cookie-notice"],
[id*="cookie-policy"],
[class*="cookie-policy"],
[data-cookie*="consent"],
[data-testid*="cookie"],
[data-testid*="consent"],
[id*="onetrust"],
[class*="onetrust"],
[id="onetrust-banner-sdk"],
[id="onetrust-consent-sdk"],
[class*="ot-sdk-container"],
[class*="ot-sdk-row"],
[class*="ot-floating-button"],
[class*="ot-pc-footer"],
[class*="ot-pc-header"],
[class*="ot-pc-container"],
[id*="cookiebot"],
[class*="cookiebot"],
[class*="cc-window"],
[class*="cc-banner"],
[id*="CybotCookie"],
[class*="CybotCookie"],
[id*="cookie-consent"],
[class*="cookie-consent"],
[id*="cookieBar"],
[class*="cookieBar"],
[id*="cookieBarContainer"],
[class*="cookieBarContainer"],
[class*="truste"],
[id*="truste"],
[class*="optanon"],
[id*="optanon"],
[class*="quantcast"],
[id*="quantcast"],

/* Common dialog/modal patterns */
[role="dialog"][aria-modal="true"],
[role="alertdialog"],
.modal:not([class*="tooltip"]),
.overlay,
.popup:not([class*="tooltip"]),
[class*="fixed"][class*="bottom"],
[class*="sticky"][class*="bottom"],
[style*="position: fixed"][style*="bottom"],

/* Newsletters and promotional banners */
.newsletter,
[id*="newsletter"],
[class*="newsletter"],
[class*="marketing-banner"],
[id*="marketing"],
[class*="promo-banner"],

/* GDPR and legal notices */
.gdpr,
[id*="gdpr"],
[class*="gdpr"],

/* General consent patterns */
[class*="consent-"],
[id*="consent-"],
[data-consent],

/* Stripe specific cookie banner (often has id ending in -banner) */
[id$="-banner"][class*="banner"],
[class*="legal-banner"],
[id*="legal-banner"],

/* Dribbble specific patterns */
[id*="dribbble"][class*="banner"],
[class*="site-banner"],

/* Figma specific patterns */
[class*="figma-consent"],
[id*="figma-cookie"] { 
  display: none !important; 
  visibility: hidden !important; 
  opacity: 0 !important;
  height: 0 !important;
  width: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

/* Also hide body-level cookie consent styles */
body.cookie-consent-open,
html.cookie-consent-open { 
  overflow: auto !important;
}
`;

