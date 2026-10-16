# ORYN B — GitHub Pages storefront

## Your 404 fix: Upload the **contents of this folder**, not its ZIP.

A ZIP file is not a website. When you open this folder you should see **index.html**, **styles.css**, **app.js**, **assets/**, **privacy.html**, **terms.html**, **CNAME** and this README. Put those items directly at the ROOT of the `main` branch of `youssefmostafa101/ORYN-B-2`.

### Exactly how (desktop browser, no coding)

1. Download `ORYN-B-GitHub-ready.zip` from ChatGPT. **Extract all** files on your computer; open the extracted folder so `index.html` is visible.
2. In GitHub open `youssefmostafa101/ORYN-B-2` → `Code` → `main`. Remove or ignore the old ZIP file; GitHub Pages will never read it.
3. Choose **Add file → Upload files** and drag **index.html, app.js, styles.css, privacy.html, terms.html, CNAME** into the repository root; also drag the **assets folder** so it creates `assets/...` in GitHub (if your browser does not support folders, first create an `assets` folder and upload the images into it). Confirm the file list and **Commit changes**.
4. Under **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and Save. Wait for GitHub Pages to publish the new commit.
5. The site's custom domain is `orynb.com` from `CNAME`, but that domain works only if your DNS records point to GitHub Pages. If it still shows 404, use the repository's Pages status/deployment URL to separate DNS problems from website problems. The main branch root must contain `index.html`.
6. Refresh hard (Ctrl+Shift+R) if the old version is cached.

### IMPORTANT before accepting signups or orders

- **Email form is deliberately a PREVIEW.** It does not send addresses anywhere. Embed/connect a compliant Omnisend signup form and update Privacy before promoting collection; never put a private API key in website JS.
- The bag is a browser-only **preview**, not an actual order, checkout, booking, or payment.
- The planned **Buy OUTPUT, get DEEP STATE free** founding offer needs eligibility/quantity caps, shipping and tax terms, stock availability and margin validation before it is advertised as a live promise.
- Product ingredient amounts, serving directions, and label artwork must be reconciled against the final approved Supliful label, not just design screenshots. DEEP STATE use should follow the finished label and any relevant safety advice.
- Check legal pages and customer support information before a US launch. These are placeholders for counsel review.

### Assets and design

All live product mockups in `assets/` are derived directly from the supplied `ORYN-B.zip`, captured from Supliful, with only framing/cropping and WebP optimization; no invented bottles or fake humans. `logo-cream.svg` and `logo-green.svg` are your exact supplied vector logos. The favicon is a black monogram on cream. Scroll motion crossfades the provided closed/decorated/open bottle images; it is not a 3D physical simulation.

### Files

- `index.html` — homepage, products, cart, popup
- `styles.css` — layout, typography, responsive design, motion
- `app.js` — bag preview, scratch-card, navigation, scroll reveals
- `assets/*` — local optimized visuals, logos and favicon
- `privacy.html` / `terms.html` — legal drafts to review before launch
- `CNAME` — `orynb.com`

### Checking locally
Open `index.html` in Chrome/Edge to preview it. Some browser features behave better via a local static server, but all assets are referenced relatively and GitHub Pages needs no build step or npm setup.
