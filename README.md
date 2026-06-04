# Zain Latif — zainlatif.com

A multi-page, **ivory-editorial** personal website for **Zain Latif**, Founder & CEO of **TLG Capital** — frontier-markets pioneer investing across Africa & Asia.

Built as a fast, dependency-free static site (HTML + CSS + vanilla JS). No build step, no framework — it runs anywhere.

## Pages

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Clean two-column hero — name, intro, portrait, credentials ticker |
| Profile | `profile.html` | Biography + animated stat counters |
| Trajectory | `trajectory.html` | Career timeline (HSBC → Merrill → Goldman → TLG) |
| Track Record | `track-record.html` | Landmark deals + investment thesis + quote |
| Honours | `honours.html` | Awards ledger, newest-first |
| Press | `press.html` | Media coverage / articles, newest-first (external links) |
| Connect | `connect.html` | Contact form + social profiles with brand logos |

Shared design system in `styles.css`; all behaviour in `script.js`.

## Highlights

- **Subtle warm constellation** — a live `<canvas>` network that reacts to the cursor.
- **Cinematic preloader** (home only) with name reveal and progress bar.
- **Custom magnetic cursor**, **page-transition veil** between pages, and an active-nav indicator.
- **Scroll-reveal choreography**, animated stat counters (`$700M+`, `$250M+`, age `19`, `$1T`), and a scroll-progress bar.
- **3D-tilt + spotlight** deal cards, an editorial timeline, an honours ledger, and a press list.
- **Brand-coloured social logos** (LinkedIn, Instagram, Facebook) in every footer + on the Connect cards.
- **Fully responsive** with a mobile menu; respects `prefers-reduced-motion`.

## Run locally

```bash
npx serve .
# or
python3 -m http.server 8080
```

A local server is recommended (over double-clicking) so web fonts and the canvas behave consistently.

## Deploy

Static — drop onto **Vercel** (current host), Netlify, Cloudflare Pages, GitHub Pages, or S3. `vercel.json` enables clean URLs (`/profile`, `/press`, …) and long-cache headers on `/assets`.

**Custom domain (zainlatif.com, registered at GoDaddy):** in GoDaddy, change the nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (or set `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`). Vercel auto-issues HTTPS.

## Contact form

Floating-label form with inline validation and an in-page success state. **Out of the box** it opens the visitor's email app (`mailto:` draft to `hello@zainlatif.com`). To send in-page instead: create a form at [formspree.io](https://formspree.io) and replace `your-form-id` in `connect.html`'s `<form action=...>` with your endpoint. A honeypot field blocks basic spam bots.

## Customising

- **Portraits:** home uses `assets/zain-chartwell.jpg`; Profile uses `assets/zain-aic.png`. Swap the files or the `src` values.
- **Colours:** edit the CSS custom properties under `:root` in `styles.css` (`--gold`, `--bg`, `--ink`…).
- **Dulcetech credit:** the footer credit links to `https://dulcetech.com` (`.footer__made`). The gradient lives in `styles.css`.
- **Press / Honours:** edit the `press-item` / `honour` rows in `press.html` / `honours.html` (newest at top).

---

Sources for profile, awards & press content: Bloomberg, Private Equity Africa Awards, IFC, Nairametrics, Africa Business+, Moneyweb, How We Made It In Africa, Chartwell Speakers, Crunchbase, and TLG Capital's public materials.
