# Security overview

Summary of the security review and how the app handles common vulnerabilities.

---

## XSS (Cross-Site Scripting)

**Status: Protected by design**

- The app does **not** use `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, or `document.write`.
- All user- or storage-derived data (player names, match labels, etc.) is rendered as **React text content** (e.g. `{name}`, `{getPlayerName(id)}`). React escapes these by default, so script injection via those values is not possible.
- No user input is interpolated into `className` or `style` in a way that could execute script.

**Recommendation:** Keep avoiding raw HTML injection. If you ever need to render HTML from a string, use a sanitization library (e.g. DOMPurify) and still prefer React’s default escaping.

---

## Admin password (previously critical)

**Status: Mitigated**

- The admin password is **no longer hardcoded** in source. It is read from the environment variable **`VITE_ADMIN_PASSWORD`** at build time.
- Set `VITE_ADMIN_PASSWORD` in your deploy environment (e.g. Railway Variables). If unset, no password will work for admin login.
- **Important:** This is a **client-side check only**. The value is still present in the built JavaScript bundle. Anyone who inspects the built app can find or bypass it. For real protection you need **server-side authentication** (e.g. a backend that issues a session or token after verifying the password).

---

## localStorage

**Status: Hardened**

- **Tampering / crash:** `JSON.parse(localStorage)` for tournament and user state is wrapped in **try/catch**. Corrupted or malicious JSON no longer crashes the app; the app falls back to default state.
- **Data integrity:** Tournament and “logged in” user are stored only in the browser. A user can alter or clear localStorage and change results or impersonate others. This is acceptable only if the app is for **non-critical, same-device use** (e.g. a single tournament on one device). For shared or important data, use a backend and server-side validation.

---

## Other checks

| Area | Status | Notes |
|------|--------|------|
| **CSRF** | N/A | No state-changing requests to your own server; no forms that submit to a server. |
| **Open redirect** | OK | No use of `window.location` or `href` with user-controlled URLs. |
| **Sensitive data in repo** | OK | No API keys or passwords in source (admin password is env-only). |
| **Third-party scripts** | Partial | Tailwind and React are loaded from CDNs (cdn.tailwindcss.com, esm.sh). Trust those providers; for stricter control consider self-hosting or Subresource Integrity (SRI). |
| **Content-Security-Policy** | Optional | No CSP in the app. You can add CSP headers (or meta) on the server for extra hardening; ensure they allow the CDNs you use. |

---

## Recommendations for production

1. **Admin access:** Implement real auth (e.g. backend login that sets an HTTP-only cookie or issues a token). Do not rely only on `VITE_ADMIN_PASSWORD` in the client.
2. **Persistence:** If tournament data must be trusted and shared, move it to a backend with authentication and authorization.
3. **HTTPS:** Serve the app only over HTTPS (Railway and similar hosts do this by default).
4. **Headers:** On the server, consider security headers such as `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or a more permissive value if you need embedding), and optionally a CSP.

---

*Last review: 2026 (static frontend, no backend).*
