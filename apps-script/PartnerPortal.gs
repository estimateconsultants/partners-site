// ============================================================================
//  PARTNER PORTAL API  (partners.estimateconsultants.com)
//  Law-firm partners create a promo code, sign in with an emailed 6-digit code, track referrals, and choose where the $50 goes.
//
//  Lives in the SAME Google Sheet as the shop codes:
//    "Referral Codes"        - one row per code (columns A-E already existed; F-L added here)
//    "Referral Redemptions"  - one row per client who used a code (columns A-J already existed; K-M added here)
//
//  Called from the website as POST (Content-Type text/plain, JSON body):  { action: "partner_...", ... }
//  Hooked in from doPost() with ONE line - see the install steps in README.
// ============================================================================

const PARTNER_TYPE = 'Law Firm';
const PARTNER_PAYOUT_AMOUNT = 50;
const PARTNER_SESSION_DAYS = 30;
const PARTNER_METHODS = ['paypal', 'venmo', 'check', 'charity'];
const PARTNER_RESERVED_CODES = ['ADMIN', 'TEST', 'FREE', 'PARTNER', 'PARTNERS', 'ESTIMATE', 'ESTIMATECONSULTANTS', 'KEVIN', 'NONE', 'NULL', 'CODE', 'PROMO'];

// Referral Codes columns (1-based)
const PC_CODE = 1, PC_NAME = 2, PC_EMAIL = 3, PC_CREATED = 4, PC_EXPIRES = 5, PC_TYPE = 6, PC_CONTACT = 7, PC_PHONE = 8, PC_PAYEES = 9, PC_DEFAULT = 10, PC_VERIFIED = 11, PC_LASTLOGIN = 12, PC_SHIP = 13, PC_CARDS = 14;
// Referral Redemptions columns (1-based)
const PR_CODE = 1, PR_CUSTOMER = 4, PR_VEHICLE = 5, PR_SUBMITTED = 7, PR_QUALIFIED = 8, PR_STATUS = 9, PR_PAYEE = 11, PR_PAIDON = 12, PR_REF = 13;

// ---------- entry point (called from doPost) ----------
function partnerHandle_(data) {
  let out;
  try {
    switch (data.action) {
      case 'partner_check_code': out = partnerCheckCode_(data); break;
      case 'partner_signup': out = partnerSignup_(data); break;
      case 'partner_login_request': out = partnerLoginRequest_(data); break;
      case 'partner_login_verify': out = partnerLoginVerify_(data); break;
      case 'partner_me': out = partnerMe_(data); break;
      case 'partner_update_profile': out = partnerUpdateProfile_(data); break;
      case 'partner_save_payees': out = partnerSavePayees_(data); break;
      case 'partner_assign_payee': out = partnerAssignPayee_(data); break;
      case 'partner_request_cards': out = partnerRequestCards_(data); break;
      case 'partner_logout': out = partnerLogout_(data); break;
      default: out = { ok: false, error: 'Unknown request.' };
    }
  } catch (err) {
    out = { ok: false, error: (err && err.partnerMessage) ? err.message : 'Something went wrong. Please try again, or call 910-333-6001.' };
    if (!(err && err.partnerMessage)) { try { console.error('partner api: ' + err + ' ' + (err && err.stack)); } catch (e) {} }
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function partnerFail_(msg) { const e = new Error(msg); e.partnerMessage = true; return e; }

// ---------- small helpers ----------
function partnerHex_(bytes) { return bytes.map(function(b) { return ('0' + (b < 0 ? b + 256 : b).toString(16)).slice(-2); }).join(''); }
function partnerSha_(s) { return partnerHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8)); }
function partnerEmail_(s) { return String(s || '').trim().toLowerCase(); }
function partnerEmailOk_(s) { return /^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$/.test(s) && s.length <= 120; }
// Plain text only: no leading =, +, -, @ (spreadsheet formulas), no control characters, bounded length.
function partnerText_(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/^[\s=+\-@]+/, '').trim().substring(0, max || 120); }
function partnerCode_(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function partnerSheet_() {
  const ss = getWorkingSpreadsheet();
  let sh = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME);
  if (!sh) { setupReferralCodesSheet(); sh = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME); }
  const heads = ['Type', 'Contact Name', 'Phone', 'Payees (JSON)', 'Default Payee ID', 'Email Verified At', 'Last Sign-in', 'Card Ship-To', 'Last Card Request'];
  if (!String(sh.getRange(1, PC_TYPE).getValue() || '').trim()) {
    sh.getRange(1, PC_TYPE, 1, heads.length).setValues([heads]).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  }
  return sh;
}
function partnerRedemptions_() {
  const ss = getWorkingSpreadsheet();
  let sh = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!sh) { setupReferralCodesSheet(); sh = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME); }
  if (!String(sh.getRange(1, PR_PAYEE).getValue() || '').trim()) {
    sh.getRange(1, PR_PAYEE, 1, 3).setValues([['Payee ID (partner portal)', 'Paid On', 'Payment Reference / Charity Receipt']]).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  }
  return sh;
}
// All code rows as objects (row = sheet row number).
function partnerRows_() {
  const sh = partnerSheet_(); const last = sh.getLastRow(); if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, PC_CARDS).getValues().map(function(r, i) {
    return { row: i + 2, code: partnerCode_(r[PC_CODE - 1]), name: String(r[PC_NAME - 1] || ''), email: partnerEmail_(r[PC_EMAIL - 1]), created: r[PC_CREATED - 1], type: String(r[PC_TYPE - 1] || ''), contact: String(r[PC_CONTACT - 1] || ''), phone: String(r[PC_PHONE - 1] || ''), payeesJson: String(r[PC_PAYEES - 1] || ''), defaultId: String(r[PC_DEFAULT - 1] || ''), verified: r[PC_VERIFIED - 1], ship: String(r[PC_SHIP - 1] || ''), cardsAt: r[PC_CARDS - 1] };
  });
}
function partnerFindByEmail_(email) { const rows = partnerRows_(); for (let i = 0; i < rows.length; i++) if (rows[i].type === PARTNER_TYPE && rows[i].email === email) return rows[i]; return null; }
function partnerFindByRow_(row) { const rows = partnerRows_(); for (let i = 0; i < rows.length; i++) if (rows[i].row === row) return rows[i]; return null; }
function partnerPayees_(p) { try { const a = JSON.parse(p.payeesJson || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }

// ---------- code availability + signup ----------
function partnerCodeProblem_(code) {
  if (code.length < 3) return 'Codes need at least 3 letters or numbers.';
  if (code.length > 24) return 'Codes can be up to 24 characters.';
  if (/^\d+$/.test(code)) return 'Please include at least one letter.';
  if (PARTNER_RESERVED_CODES.indexOf(code) >= 0) return 'That code is reserved. Please choose another.';
  const rows = partnerRows_();
  for (let i = 0; i < rows.length; i++) if (rows[i].code === code) return 'That code is already taken. Please choose another.';
  return '';
}
function partnerCheckCode_(data) {
  const code = partnerCode_(data.code);
  if (!code) return { ok: true, available: false, code: '', reason: '' };
  const problem = partnerCodeProblem_(code);
  return { ok: true, available: !problem, code: code, reason: problem };
}
function partnerSignup_(data) {
  const firm = partnerText_(data.firm, 100), contact = partnerText_(data.contact, 80), phone = partnerText_(String(data.phone || '').replace(/[^0-9()+\-.\s]/g, ''), 25);
  const email = partnerEmail_(data.email), code = partnerCode_(data.code);
  if (!firm) throw partnerFail_('Please enter your firm name.');
  if (!contact) throw partnerFail_('Please enter a contact name.');
  if (!partnerEmailOk_(email)) throw partnerFail_('Please enter a valid email address.');
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const problem = partnerCodeProblem_(code);
    if (problem) throw partnerFail_(problem);
    if (partnerFindByEmail_(email)) throw partnerFail_('That email already has a partner account. Please sign in instead.');
    const sh = partnerSheet_();
    // blank expiration = the code never expires
    sh.appendRow([code, firm, email, new Date(), '', PARTNER_TYPE, contact, phone, '[]', '', '', '', '', '']);
  } finally { lock.releaseLock(); }
  try {
    MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '🤝 New law-firm partner: ' + firm + ' (' + code + ')',
      firm + ' just created a Preferred Partners code.\n\nCode: ' + code + '\nContact: ' + contact + '\nEmail: ' + email + '\nPhone: ' + phone + '\n\nThe code already works for 15% off. They are listed in the "' + REFERRAL_CODES_SHEET_NAME + '" tab (Type = ' + PARTNER_TYPE + '). The email is verified when they first sign in.\nNext: send them the counter display and business cards.');
  } catch (e) {}
  return { ok: true, code: code, firm: firm };
}

// ---------- email-code sign in (no passwords to store) ----------
function partnerLoginRequest_(data) {
  const email = partnerEmail_(data.email);
  const generic = { ok: true, message: 'If that email is registered, a 6-digit code is on its way. It expires in 10 minutes.' };
  if (!partnerEmailOk_(email)) throw partnerFail_('Please enter a valid email address.');
  const cache = CacheService.getScriptCache(); const key = partnerSha_(email);
  if (cache.get('PLR_' + key)) throw partnerFail_('A code was just sent. Please wait a minute before asking for another.');
  cache.put('PLR_' + key, '1', 60);
  const p = partnerFindByEmail_(email);
  if (!p) return generic;
  const otp = ('000000' + Math.floor(Math.random() * 1000000)).slice(-6);
  cache.put('PLO_' + key, JSON.stringify({ h: partnerSha_(otp + ':' + key), tries: 0 }), 600);
  MailApp.sendEmail(email, 'Your Preferred Partners sign-in code: ' + otp,
    'Your Estimate Consultants Preferred Partners sign-in code is:\n\n    ' + otp + '\n\nIt expires in 10 minutes. If you did not request it, you can ignore this email.\n\nEstimate Consultants\n' + OWNER_PHONE,
    { name: 'Estimate Consultants Partners', replyTo: 'customerservice@estimateconsultants.com' });
  return generic;
}
function partnerLoginVerify_(data) {
  const email = partnerEmail_(data.email), otp = String(data.otp || '').replace(/\D/g, '');
  if (!partnerEmailOk_(email) || otp.length !== 6) throw partnerFail_('Please enter the 6-digit code from your email.');
  const cache = CacheService.getScriptCache(); const key = partnerSha_(email);
  const raw = cache.get('PLO_' + key);
  if (!raw) throw partnerFail_('That code has expired. Please request a new one.');
  const rec = JSON.parse(raw);
  if (rec.tries >= 5) { cache.remove('PLO_' + key); throw partnerFail_('Too many attempts. Please request a new code.'); }
  if (partnerSha_(otp + ':' + key) !== rec.h) {
    rec.tries++; cache.put('PLO_' + key, JSON.stringify(rec), 600);
    throw partnerFail_('That code is not right. Please check and try again.');
  }
  cache.remove('PLO_' + key);
  const p = partnerFindByEmail_(email);
  if (!p) throw partnerFail_('No partner account was found for that email.');
  const sh = partnerSheet_();
  if (!p.verified) sh.getRange(p.row, PC_VERIFIED).setValue(new Date());
  sh.getRange(p.row, PC_LASTLOGIN).setValue(new Date());
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  const props = PropertiesService.getScriptProperties();
  partnerPruneSessions_(props);
  props.setProperty('PSESS_' + partnerSha_(token), JSON.stringify({ email: email, exp: Date.now() + PARTNER_SESSION_DAYS * 86400000 }));
  return Object.assign({ token: token }, partnerMe_({ token: token }));
}
function partnerPruneSessions_(props) {
  const all = props.getProperties(); const now = Date.now();
  Object.keys(all).forEach(function(k) { if (k.indexOf('PSESS_') !== 0) return; try { if (JSON.parse(all[k]).exp < now) props.deleteProperty(k); } catch (e) { props.deleteProperty(k); } });
}
function partnerSession_(token) {
  token = String(token || '');
  if (token.length < 32) throw partnerFail_('Your session has ended. Please sign in again.');
  const raw = PropertiesService.getScriptProperties().getProperty('PSESS_' + partnerSha_(token));
  if (!raw) throw partnerFail_('Your session has ended. Please sign in again.');
  const s = JSON.parse(raw);
  if (s.exp < Date.now()) throw partnerFail_('Your session has ended. Please sign in again.');
  const p = partnerFindByEmail_(s.email);
  if (!p) throw partnerFail_('Your session has ended. Please sign in again.');
  return p;
}
function partnerLogout_(data) { try { PropertiesService.getScriptProperties().deleteProperty('PSESS_' + partnerSha_(String(data.token || ''))); } catch (e) {} return { ok: true }; }

// ---------- dashboard ----------
function partnerMaskEmail_(e) {
  e = String(e || ''); const at = e.indexOf('@'); if (at < 1) return '';
  return e.charAt(0).toLowerCase() + '•••' + e.substring(at);
}
function partnerFmtDate_(d) { return (d instanceof Date) ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'MMM d, yyyy') : ''; }
function partnerMe_(data) {
  const p = partnerSession_(data.token);
  const payees = partnerPayees_(p);
  const byId = {}; payees.forEach(function(x) { byId[x.id] = x; });
  const sh = partnerRedemptions_(); const last = sh.getLastRow();
  const refs = []; let submitted = 0, appraisals = 0, owed = 0, paid = 0;
  if (last >= 2) {
    sh.getRange(2, 1, last - 1, PR_REF).getValues().forEach(function(r, i) {
      if (partnerCode_(r[PR_CODE - 1]) !== p.code) return;
      submitted++;
      const qualified = !!r[PR_QUALIFIED - 1]; const status = String(r[PR_STATUS - 1] || '').trim();
      let state = 'submitted';
      if (qualified) { appraisals++; if (/^paid/i.test(status)) { state = 'paid'; paid++; } else { state = 'owed'; owed++; } }
      const pid = String(r[PR_PAYEE - 1] || '');
      const payee = byId[pid] || byId[p.defaultId] || null;
      refs.push({ id: i + 2, submitted: partnerFmtDate_(r[PR_SUBMITTED - 1]), submittedTs: r[PR_SUBMITTED - 1] instanceof Date ? r[PR_SUBMITTED - 1].getTime() : 0, client: partnerMaskEmail_(r[PR_CUSTOMER - 1]), vehicle: String(r[PR_VEHICLE - 1] || ''), state: state, payeeId: payee ? payee.id : '', payeeLabel: payee ? payee.label : '', paidOn: partnerFmtDate_(r[PR_PAIDON - 1]), reference: state === 'paid' ? String(r[PR_REF - 1] || '') : '' });
    });
  }
  refs.sort(function(a, b) { return b.submittedTs - a.submittedTs; });
  return {
    ok: true,
    profile: { firm: p.name, contact: p.contact, email: p.email, phone: p.phone, code: p.code, since: partnerFmtDate_(p.created), verified: !!p.verified, ship: p.ship, cardsAt: partnerFmtDate_(p.cardsAt) },
    payees: payees, defaultId: p.defaultId || (payees[0] ? payees[0].id : ''),
    stats: { submitted: submitted, appraisals: appraisals, owed: owed, paid: paid, owedAmount: owed * PARTNER_PAYOUT_AMOUNT, paidAmount: paid * PARTNER_PAYOUT_AMOUNT, amount: PARTNER_PAYOUT_AMOUNT },
    referrals: refs
  };
}
function partnerUpdateProfile_(data) {
  const p = partnerSession_(data.token);
  const firm = partnerText_(data.firm, 100), contact = partnerText_(data.contact, 80), phone = partnerText_(String(data.phone || '').replace(/[^0-9()+\-.\s]/g, ''), 25);
  if (!firm) throw partnerFail_('Please enter your firm name.');
  if (!contact) throw partnerFail_('Please enter a contact name.');
  const sh = partnerSheet_();
  sh.getRange(p.row, PC_NAME).setValue(firm); sh.getRange(p.row, PC_CONTACT).setValue(contact); sh.getRange(p.row, PC_PHONE).setValue(phone);
  return partnerMe_(data);
}

// ---------- business card requests: logged in the sheet + emailed to you ----------
const PARTNER_CARDS_SHEET_ = 'Business Card Requests';
function partnerRequestCards_(data) {
  const p = partnerSession_(data.token);
  const ship = String(data.ship == null ? '' : data.ship).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/^[\s=+\-@]+/, '').trim().substring(0, 300);
  const note = partnerText_(data.note, 300);
  if (ship.replace(/\s/g, '').length < 10) throw partnerFail_('Please enter the name and full mailing address to ship to.');
  const cache = CacheService.getScriptCache(); const key = 'PCR_' + partnerSha_(p.email);
  if (cache.get(key)) throw partnerFail_('We just received a request from your firm. If you need to change it, please call ' + OWNER_PHONE + '.');
  cache.put(key, '1', 600);
  const ss = getWorkingSpreadsheet(); let sh = ss.getSheetByName(PARTNER_CARDS_SHEET_);
  if (!sh) {
    sh = ss.insertSheet(PARTNER_CARDS_SHEET_);
    const heads = ['Requested At', 'Firm', 'Code', 'Contact', 'Email', 'Phone', 'Ship To', 'Note', 'Status (New / Sent)'];
    sh.getRange(1, 1, 1, heads.length).setValues([heads]).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff'); sh.setFrozenRows(1);
    sh.getRange('I2:I1000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['New', 'Sent'], true).setAllowInvalid(true).build());
  }
  sh.appendRow([new Date(), p.name, p.code, p.contact, p.email, p.phone, ship, note, 'New']);
  const psh = partnerSheet_(); psh.getRange(p.row, PC_SHIP).setValue(ship); psh.getRange(p.row, PC_CARDS).setValue(new Date());
  try {
    MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '📇 Business cards requested: ' + p.name + ' (' + p.code + ')',
      p.name + ' (' + p.code + ') requested more business cards.\n\nSHIP TO:\n' + ship + '\n\n' + (note ? 'NOTE: ' + note + '\n\n' : '') +
      'Contact: ' + p.contact + '\nEmail: ' + p.email + '\nPhone: ' + p.phone + '\n\nLogged in the "' + PARTNER_CARDS_SHEET_ + '" tab - set Status to Sent when they go out. Reply to this email to reach the firm.',
      { name: 'Estimate Consultants Partners', replyTo: p.email });
  } catch (e) { try { console.error('card request email failed: ' + e); } catch (e2) {} }
  return partnerMe_(data);
}

// ---------- where the $50 goes (one or several destinations) ----------
function partnerSavePayees_(data) {
  const p = partnerSession_(data.token);
  const list = Array.isArray(data.payees) ? data.payees.slice(0, 12) : [];
  const out = []; const seen = {};
  list.forEach(function(x) {
    const method = String(x.method || '').toLowerCase();
    if (PARTNER_METHODS.indexOf(method) < 0) throw partnerFail_('Please choose how this payee should be paid.');
    const label = partnerText_(x.label, 60);
    if (!label) throw partnerFail_('Each payee needs a name (for example "Intake team" or "Maria").');
    let detail = partnerText_(x.detail, 300), extra = partnerText_(x.extra, 200);
    if (!detail) throw partnerFail_(method === 'check' ? 'Please enter the name and mailing address for the check.' : method === 'charity' ? 'Please enter the charity\'s name.' : 'Please enter the ' + (method === 'paypal' ? 'PayPal email' : 'Venmo username') + ' for "' + label + '".');
    if (method === 'paypal' && !partnerEmailOk_(partnerEmail_(detail))) throw partnerFail_('The PayPal address for "' + label + '" should be an email address.');
    if (method === 'venmo') detail = '@' + detail.replace(/^@+/, '').replace(/[^A-Za-z0-9_\-]/g, '').substring(0, 40);
    let id = String(x.id || '').replace(/[^A-Za-z0-9]/g, '').substring(0, 16);
    if (!id || seen[id]) id = 'P' + Utilities.getUuid().replace(/-/g, '').substring(0, 8);
    seen[id] = 1;
    out.push({ id: id, label: label, method: method, detail: detail, extra: extra });
  });
  let def = String(data.defaultId || '');
  if (!out.some(function(x) { return x.id === def; })) def = out[0] ? out[0].id : '';
  const sh = partnerSheet_();
  sh.getRange(p.row, PC_PAYEES).setValue(JSON.stringify(out)); sh.getRange(p.row, PC_DEFAULT).setValue(def);
  return partnerMe_(data);
}
function partnerAssignPayee_(data) {
  const p = partnerSession_(data.token);
  const rid = parseInt(data.referralId, 10); const pid = String(data.payeeId || '');
  const payees = partnerPayees_(p);
  if (pid && !payees.some(function(x) { return x.id === pid; })) throw partnerFail_('Please choose one of your payees.');
  const sh = partnerRedemptions_();
  if (!rid || rid < 2 || rid > sh.getLastRow()) throw partnerFail_('That referral was not found.');
  const r = sh.getRange(rid, 1, 1, PR_REF).getValues()[0];
  if (partnerCode_(r[PR_CODE - 1]) !== p.code) throw partnerFail_('That referral was not found.');
  if (/^paid/i.test(String(r[PR_STATUS - 1] || ''))) throw partnerFail_('That payment has already been sent, so the payee can no longer be changed.');
  sh.getRange(rid, PR_PAYEE).setValue(pid);
  return partnerMe_(data);
}

// ============================================================================
//  YOUR SIDE (Google Sheet menu): who to pay, how, and marking it paid
// ============================================================================
const PARTNER_DUE_SHEET_ = '💸 Partner Payouts Due';
// Builds a fresh tab listing every owed $50: who, how to send it, where, and which Referral Redemptions row it is.
function partnerPayoutsDue() {
  const ss = getWorkingSpreadsheet(); const codes = {};
  partnerRows_().forEach(function(c) { codes[c.code] = c; });
  const rs = partnerRedemptions_(); const last = rs.getLastRow();
  const rows = [];
  if (last >= 2) rs.getRange(2, 1, last - 1, PR_REF).getValues().forEach(function(r, i) {
    if (!r[PR_QUALIFIED - 1] || /^paid/i.test(String(r[PR_STATUS - 1] || ''))) return;
    const code = partnerCode_(r[PR_CODE - 1]); const c = codes[code]; let method = '(no payout details on file)', detail = '', payee = '';
    if (c) {
      const payees = partnerPayees_(c); const pid = String(r[PR_PAYEE - 1] || '') || c.defaultId;
      const x = payees.filter(function(y) { return y.id === pid; })[0] || payees[0];
      if (x) { payee = x.label; method = { paypal: 'PayPal', venmo: 'Venmo', check: 'Check', charity: 'Charity donation' }[x.method] || x.method; detail = x.detail + (x.extra ? ' - ' + x.extra : ''); }
    }
    rows.push([r[PR_QUALIFIED - 1], String(r[1] || ''), code, payee, method, detail, PARTNER_PAYOUT_AMOUNT, i + 2]);
  });
  let sh = ss.getSheetByName(PARTNER_DUE_SHEET_); if (sh) sh.clear(); else sh = ss.insertSheet(PARTNER_DUE_SHEET_);
  const heads = ['Qualified On', 'Firm / Shop', 'Code', 'Pay To', 'How', 'Where', 'Amount', 'Row in Referral Redemptions'];
  sh.getRange(1, 1, 1, heads.length).setValues([heads]).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff'); sh.setFrozenRows(1);
  if (rows.length) { sh.getRange(2, 1, rows.length, heads.length).setValues(rows); sh.getRange(2, 1, rows.length, 1).setNumberFormat('MM/dd/yyyy'); sh.getRange(2, 7, rows.length, 1).setNumberFormat('$0'); }
  sh.setColumnWidths(1, 8, 150); sh.setColumnWidth(6, 330);
  ss.setActiveSheet(sh);
  try { SpreadsheetApp.getUi().alert(rows.length ? rows.length + ' payout(s) due ($' + (rows.length * PARTNER_PAYOUT_AMOUNT) + ' total). After you send them, select those rows in "' + REFERRAL_REDEMPTIONS_SHEET_NAME + '" and use Partner program > Mark selected payouts paid.' : 'Nothing is owed right now.'); } catch (e) {}
}
// Select the paid rows on the Referral Redemptions tab, then run this: sets Paid, today's date, and your reference (check #, PayPal ID, charity receipt link).
function partnerMarkSelectedPaid() {
  const ui = SpreadsheetApp.getUi(); const sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== REFERRAL_REDEMPTIONS_SHEET_NAME) return ui.alert('Open the "' + REFERRAL_REDEMPTIONS_SHEET_NAME + '" tab and select the rows you paid first.');
  partnerRedemptions_();
  const sel = sh.getActiveRange(); const r1 = Math.max(2, sel.getRow()), r2 = sel.getRow() + sel.getNumRows() - 1;
  if (r2 < r1) return ui.alert('Select the rows you paid first.');
  const ref = ui.prompt('Mark paid', 'Reference for these payment(s) - check #, PayPal/Venmo note, or the charity receipt link (shown to the partner):', ui.ButtonSet.OK_CANCEL);
  if (ref.getSelectedButton() !== ui.Button.OK) return;
  let n = 0; const now = new Date();
  for (let r = r1; r <= r2; r++) {
    if (!sh.getRange(r, PR_QUALIFIED).getValue() || /^paid/i.test(String(sh.getRange(r, PR_STATUS).getValue() || ''))) continue;
    sh.getRange(r, PR_STATUS).setValue('Paid'); sh.getRange(r, PR_PAIDON).setValue(now).setNumberFormat('MM/dd/yyyy'); sh.getRange(r, PR_REF).setValue(ref.getResponseText().trim()); n++;
  }
  ui.alert(n ? 'Marked ' + n + ' payout(s) paid.' : 'Nothing changed - only qualified, unpaid rows can be marked paid.');
}
