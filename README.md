# Preferred Partners portal — partners.estimateconsultants.com

Law firms create a promo code, sign in with an emailed 6-digit code, track referrals and the $50 payments, choose where the $50 goes (PayPal, Venmo, check, or charity — as many payees as they like), request business cards, and print a full-page client flyer with their firm name and code.

Everything is stored in your existing Google Sheet (tabs **Referral Codes** and **Referral Redemptions**, plus a new **Business Card Requests** tab). The same code works on estimateconsultants.com because it is the same list the shop codes already use. Codes never expire.

## What is in this folder
| Folder / file | What it is |
|---|---|
| `site/` | The website (plain HTML/CSS/JS, nothing to build). This is what goes on GitHub. |
| `apps-script/PartnerPortal.gs` | New file for your Apps Script project (the partner backend). |
| `apps-script/Code.gs` | Your full Code.gs with the 2 tiny hooks already added (see step 1). |

---
## Step 1 — Install the backend (Apps Script, ~5 min)
1. Open the Google Sheet → **Extensions → Apps Script**.
2. Click **+** next to *Files* → **Script** → name it `PartnerPortal` → paste the entire contents of `apps-script/PartnerPortal.gs`.
3. Open `Code.gs`, select all, and paste the contents of `apps-script/Code.gs` (it is your current file plus two additions: one line at the top of `doPost` that routes `partner_` requests, and two menu items under *Manual steps*: **Partner payouts due** and **Mark selected partner payouts paid**).
4. **Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy.** Keep *Execute as: Me* and *Who has access: Anyone*. The web-app URL does **not** change (the site already points at it).
5. Reload the Sheet. The first time a partner signs up, the script adds the extra columns it needs to **Referral Codes** (F–N) and **Referral Redemptions** (K–M) by itself.

## Step 2 — Put the site on GitHub (~5 min)
1. Sign in at github.com → **New repository** → name it `partners-site` → Public → Create.
2. Click **Add file → Upload files**, drag in **the contents of the `site` folder** (index.html, the `assets` folder, `CNAME`, `.nojekyll`), then **Commit changes**.
3. Repo **Settings → Pages**: *Source* = **Deploy from a branch**, Branch = **main**, folder = **/(root)** → Save.
4. Under *Custom domain* enter `partners.estimateconsultants.com` → Save. (The `CNAME` file already contains it.)
5. After the DNS step below finishes, tick **Enforce HTTPS**.

Updating the site later: edit or re-upload the file on GitHub → it republishes in about a minute.

## Step 3 — Point the subdomain at it (DNS, ~5 min + wait)
Where your domain's DNS lives (your registrar or host — wherever you added `portal.` and `appraisals.`), add one record:

| Type | Host / Name | Value |
|---|---|---|
| **CNAME** | `partners` | `YOUR-GITHUB-USERNAME.github.io` |

Changes can take from a few minutes to a few hours. GitHub's Pages settings page shows a green check when it is ready, then enable *Enforce HTTPS*.

## Step 4 — Logo (optional)
Add your logo (white/gold version that reads on black) as `site/assets/logo.png`, height about 120 px. Until then the site shows the text wordmark.

## Step 5 — Test it (2 min)
1. Open the site → **Create your firm's code** → make a test firm and code.
2. In the Sheet, **Referral Codes** now has the new row (Type = Law Firm). You also get an email.
3. On estimateconsultants.com, enter that code in the Partner section — it is accepted (same list).
4. Back on the partner site → **Sign in** → you receive a 6-digit code by email → the dashboard opens. Add a payout destination, try **Preview & print**, and **Request more cards** (you get an email and a row in *Business Card Requests*).
5. Delete the test rows when done.

---
## How the money side works day to day
- A client enters the code → a row appears in **Referral Redemptions** → the partner sees it as **Code used**.
- When we generate their appraisal / invoice them (your existing step), the row becomes **Qualified** and **Owed** → partner sees **$50 on the way** (this is the existing automation; nothing new for you).
- Menu **Manual steps → 💸 Partner payouts due** builds a tab listing every owed $50: who, which method (PayPal / Venmo / check / charity), and where to send it.
- After you pay, select those rows in **Referral Redemptions** → **Manual steps → ✅ Mark selected partner payouts paid** → type the reference (check #, PayPal ID, or the charity receipt link). The partner sees **Paid**, the date, and your reference — that is the "proof of receipt" for charity donations.
- Business cards: each request emails you and adds a row to **Business Card Requests** (set Status to *Sent* when mailed).

## Safe-by-design notes
- No passwords are stored. Sign-in is a 6-digit emailed code (expires in 10 min, 5 tries, one request per minute).
- The only automatic emails to a partner are that sign-in code. Everything else comes to you.
- Partners only ever see their own code's rows, with client emails masked (j•••@gmail.com).
- Payout details are only shown to the signed-in firm, and only you can mark something Paid.
- Sessions last 30 days on a device; "Sign out" ends it immediately.

## Changing things later
- Prices on the flyer: top of `site/assets/app.js` (`PRICES`). They show the rounded 15%-off prices ($169 / $254), matching your printed graphic.
- Payout amount: `PARTNER_PAYOUT_AMOUNT` at the top of `PartnerPortal.gs` (the existing referral automation also uses $50).
- Colors/fonts: variables at the top of `site/assets/style.css`.
