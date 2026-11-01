// ==========================================
// CONFIGURATION & INTEGRATED CREDENTIALS
// ==========================================
const MAIN_FOLDER_NAME = 'Appraisals'; 
const WEBSITE_SIGNING_URL = 'https://sign.estimateconsultants.com';
const WEBSITE_BASE_URL = 'https://estimateconsultants.com';

const PHOTO_GUIDE_FILE_ID = '1BuV0r3T3_Cbj-oKERSR0xDPilXbMKMdJ';

const WAVE_BUSINESS_ID = '1d5c64cc-f5d8-4f9d-824a-14d10d1d9aba';
const WAVE_ACCESS_TOKEN = 'M35lTi15VLVhbF437HGu6wkmwXMkxE';

const VALUATIONS_SPREADSHEET_ID = "1kEr00BZS-_GMTmvyyG_0xmLALCwBhB2NiILadR9ZrSg";
const VALUATIONS_TAB_NAME = "valuations";

// Must be declared before anything at top level uses it.
const DIRECT_DV_LABEL = 'Diminished Value Appraisal (No Insurer - Direct)';

// North Carolina (1st- or 3rd-party) Diminished Value handled through the policy's Appraisal Clause (flat $299, invoiced before delivery,
// same flow as Total Loss). Its 3 templates (intake, report, demand letter) are installed with the
// "Install NC Appraisal Clause DV Templates" menu item and their IDs are kept in Script Properties.
const NC_DV_AC_LABEL = 'North Carolina Diminished Value - Policy Appraisal Clause';
const NC_DV_AC_LABEL_OLD_ = 'North Carolina Diminished Value - Policy Appraisal Clause (1st-Party)';   // rows saved before the tag was removed
function isNcDv_(u) { return u === NC_DV_AC_LABEL || u === NC_DV_AC_LABEL_OLD_; }
const NC_DV_AC_AWARD_PROP = 'NC_DV_AC_AWARD_ID';
const NC_DV_AC_PROP = 'NC_DV_AC_TEMPLATE_IDS';

const MASTER_DOC_MAP = {
  [NC_DV_AC_LABEL]: [],   // filled from Script Properties - see getDocIdArray_()
  '3rd-Party Loss in Market Value (Diminished Value) Claim': [
    '187h0llBgJsS6brZzE0rBRXyRbgloKwm0s4wPmf4ns34',
    '1YAsyIvU_g9bmOznb_iS_vuufY9jc3AmnzjlkQbDFY04',
    '13_claKCXnQGhJaZCdGGVpzrLp7wUndGBBu8o-R9VD3A',
    '12ySYJcBZFZTv9AG_Ihmu9z8pRGBH9onL5fff5ZEtR9U'
  ],
  // Direct (no-insurer) Diminished Value: NO intake form, NO signing link. Just the folder + the report document
  // (same report template the insurer DV flow uses - slot 2 of its list). Key must equal DIRECT_DV_LABEL below.
  'Diminished Value Appraisal (No Insurer - Direct)': [
    '1YAsyIvU_g9bmOznb_iS_vuufY9jc3AmnzjlkQbDFY04'
  ],
  'Insurance Total Loss ACV Dispute': [
    '1B5FbMqBUndj9xPuREBdyIxUFwPcB7hPS0sF_KMUTUeM',
    '1FFH1nq-u0gfBoZxG6WG5YNYzFQBik9SGZcUfU5O4CTQ'
  ],
  '1st-Party Policy Appraisal Clause Dispute': [
    '1ikgnm0Ho4Oo0oYyuAINQJHwvdLPFuxexBmlJN4UTsEM',
    '1FFH1nq-u0gfBoZxG6WG5YNYzFQBik9SGZcUfU5O4CTQ'
  ],
  'Estate / Probate / Tax / Divorce Fair Market Value (FMV)': [
    '1ikgnm0Ho4Oo0oYyuAINQJHwvdLPFuxexBmlJN4UTsEM',
    '1FFH1nq-u0gfBoZxG6WG5YNYzFQBik9SGZcUfU5O4CTQ'
  ],
  'Bank & Collateral Loan Vehicle Appraisal': [
    '1ikgnm0Ho4Oo0oYyuAINQJHwvdLPFuxexBmlJN4UTsEM',
    '1FFH1nq-u0gfBoZxG6WG5YNYzFQBik9SGZcUfU5O4CTQ'
  ],
  'IRS Vehicle Donation Appraisal': [
    '1ikgnm0Ho4Oo0oYyuAINQJHwvdLPFuxexBmlJN4UTsEM',
    '1FFH1nq-u0gfBoZxG6WG5YNYzFQBik9SGZcUfU5O4CTQ'
  ]
};

// ==========================================
// EXTRA COLUMNS (added Sept 2026)
// ==========================================
// Column 31 (Appraisal ID) used to double as the "auth signed" flag, so the
// Appraisal ID got overwritten with "Signed via Website" / "Sent via Web Link".
// Column 33 (Insurance Offer Amount) used to be overwritten with the
// calculated DV/ACV every time the sidebar saved. Both now have their own columns.
const COL_AUTH_SIGN_STATUS = 96;   // Column CR
const COL_CALC_FINAL_DV = 97;      // Column CS
const COL_CALC_FINAL_ACV = 98;     // Column CT
const COL_AWARD_ACV = 99;          // Column CU — agreed ACV for the Appraisal Award Document
const COL_CARRIER_APPRAISER = 100; // Column CV — insurance carrier's appraiser name
const COL_CARRIER_APPRAISER_CO = 101; // Column CW — carrier appraiser's company
// Options adjustments (added Oct 2026): +/- dollar amount and an explanation for each comp and for the appraised vehicle.
// A comp that LACKS options the client's vehicle has gets a + adjustment; a comp that has EXTRA options gets a - adjustment.
const COL_COMP1_OPT_ADJ = 102, COL_COMP1_OPT_NOTES = 103;     // CX, CY
const COL_COMP2_OPT_ADJ = 104, COL_COMP2_OPT_NOTES = 105;     // CZ, DA
const COL_COMP3_OPT_ADJ = 106, COL_COMP3_OPT_NOTES = 107;     // DB, DC
const COL_SUBJ_OPT_ADJ = 108, COL_SUBJ_OPT_NOTES = 109;       // DD, DE  (the appraised vehicle)
const OPTION_HEADERS_ = ['Comp 1 Options +/- ($)', 'Comp 1 Options Notes', 'Comp 2 Options +/- ($)', 'Comp 2 Options Notes', 'Comp 3 Options +/- ($)', 'Comp 3 Options Notes', 'Appraised Vehicle Options +/- ($)', 'Appraised Vehicle Options Notes'];
// Trade-in dealer names (slots 1 & 2; slot 3 already has Dealer 3 Name in column BF). Whatever dealer you type here
// is what the report prints instead of "CarMax" / "Carvana" / "Dealer 1/2/3".
const COL_DEALER1_NAME = 110, COL_DEALER2_NAME = 111;          // DF, DG
const DEALER_HEADERS_ = ['Trade-In Dealer 1 Name', 'Trade-In Dealer 2 Name'];
const COL_CARRIER_ADDR = 112;                                 // DH  carrier mailing address (for certified mail)
const COL_CARRIER_APPRAISER_EMAIL = 114, COL_LAST_WEEKLY = 115, COL_LAST_INSURER_FU = 116, COL_AWARD_DOC_ID = 117;   // DJ, DK, DL, DM
const ADDR_HEADERS_ = ['Carrier Mailing Address', 'Approval Requested', 'Carrier Appraiser Email', 'Last Weekly Update Sent', 'Last Insurer Follow-Up', 'Award Doc ID', 'Exhibits (JSON)', 'Closed On | Previous Status', 'Follow-Up Reason', 'Comp 1 Options Lines', 'Comp 2 Options Lines', 'Comp 3 Options Lines', 'Appraised Vehicle Options Lines', 'Other Email Addresses (filing)', 'Progress Override (steps done)'];
const COL_PREV_STATUS = 119;   // DO - "date|status before closing"
const COL_FU_REASON = 120;   // DP - why to follow up
const COL_OPT_LINES = { comp1: 121, comp2: 122, comp3: 123, subject: 124 };   // DQ-DT: JSON line items behind each options adjustment
const MAIN_ROW_WIDTH = 126;
const COL_PROG_MANUAL = 126;   // DV - steps already done (manual override); blank = automatic

// Makes sure the main sheet actually has the option columns (and their headers) before anything reads/writes them.
function ensureMainWidth_(sheet) {
  try {
    if (sheet.getMaxColumns() < MAIN_ROW_WIDTH) sheet.insertColumnsAfter(sheet.getMaxColumns(), MAIN_ROW_WIDTH - sheet.getMaxColumns());
    const allHeaders = OPTION_HEADERS_.concat(DEALER_HEADERS_).concat(ADDR_HEADERS_);
    const hdr = sheet.getRange(1, COL_COMP1_OPT_ADJ, 1, allHeaders.length);
    const cur = hdr.getValues()[0];
    if (cur.some(function(v, i) { return !v; })) hdr.setValues([allHeaders.map(function(h, i) { return cur[i] || h; })]);
  } catch (e) { console.error('ensureMainWidth_: ' + e); }
}
const AWARD_TEMPLATE_KEY = 'AWARD_TEMPLATE_ID';

// ==========================================
// DOCUMENT TEMPLATE INSTALLER
// ==========================================
// Put the new .docx (or Google Doc) templates in a Drive folder with this
// name, then run ⚙️ Setup & Help → 📄 Install New Document Templates.
// The IDs in MASTER_DOC_MAP above never need to be edited — the installer
// stores an "old ID → new ID" map in Script Properties, and every place that
// copies a template goes through getTemplateId().
const NEW_TEMPLATES_FOLDER_NAME = 'New Templates';
const TEMPLATE_OVERRIDES_KEY = 'TEMPLATE_OVERRIDES';

function getTemplateId(masterId) {
  try {
    var map = JSON.parse(PropertiesService.getScriptProperties().getProperty(TEMPLATE_OVERRIDES_KEY) || '{}');
    return map[masterId] || masterId;
  } catch (e) {
    return masterId;
  }
}

function classifyTemplateName_(name) {
  var n = String(name || '').toLowerCase();
  if (n.indexOf('award') !== -1) return 'award';
  if (n.indexOf('offer') !== -1) return 'offer';
  if (n.indexOf('notice') !== -1 || n.indexOf('demand') !== -1) return 'notice';
  if (n.indexOf('dossier') !== -1 || n.indexOf('certified valuation') !== -1) return 'dossier';
  if (n.indexOf('report') !== -1) return 'tl_report';
  if (n.indexOf('non-dv') !== -1 || n.indexOf('non dv') !== -1 || n.indexOf('non_dv') !== -1) return 'nondv_intake';
  if (n.indexOf('intake') !== -1 && /(^|[^a-z])dv([^a-z]|$)/.test(n)) return 'dv_intake';
  if (n.indexOf('intake') !== -1) return 'tl_intake';
  return null;
}

var TEMPLATE_ROLE_LABELS_ = {
  dv_intake: 'DV Client Intake & Service Agreement',
  tl_intake: 'TL Client Intake & Service Agreement',
  nondv_intake: 'Non-DV TL Client Intake & Service Agreement',
  dossier: 'Certified Valuation Appraisal Report Dossier',
  tl_report: 'Appraisal TL Report',
  notice: 'Notice of Representation & Demand',
  offer: 'Client DV Offer',
  award: 'Appraisal Award Document'
};

function roleForMasterSlot_(intendedUse, index, oldName) {
  var byName = classifyTemplateName_(oldName);
  if (byName) return byName;
  var isDV = intendedUse.indexOf('Diminished Value') !== -1;
  var isTL = intendedUse.indexOf('Total Loss') !== -1;
  if (index === 0) return isDV ? 'dv_intake' : (isTL ? 'tl_intake' : 'nondv_intake');
  if (!isDV && index === 1) return 'tl_report';
  return null;
}

// Template list for a claim type. The NC appraisal-clause DV list lives in Script Properties: [intake, report, demand letter].
function getDocIdArray_(intendedUse) {
  if (isNcDv_(intendedUse)) {
    try {
      var ids = JSON.parse(PropertiesService.getScriptProperties().getProperty(NC_DV_AC_PROP) || '[]');
      return ids.length ? ids : null;
    } catch (e) { return null; }
  }
  return MASTER_DOC_MAP[intendedUse];
}

// Menu: converts the 3 "NC DV Appraisal Clause - ..." .docx files in the 'New Templates' Drive folder into Google Docs
// and registers them as the templates for the NC appraisal-clause DV claim type.
function installNcDvTemplates() {
  var ui = SpreadsheetApp.getUi();
  var folders = DriveApp.getFoldersByName(NEW_TEMPLATES_FOLDER_NAME);
  if (!folders.hasNext()) return ui.alert("Couldn't find a Drive folder named '" + NEW_TEMPLATES_FOLDER_NAME + "'. Create it, upload the three 'NC DV Appraisal Clause - ...' .docx files into it, then run this again.");
  var folder = folders.next();
  var found = { intake: null, report: null, demand: null };
  var awardFile = null;
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    var n = f.getName().toLowerCase();
    if (f.isTrashed() || n.indexOf('nc dv appraisal clause') === -1) continue;
    if (n.indexOf('award') !== -1) { if (!awardFile || f.getLastUpdated().getTime() > awardFile.getLastUpdated().getTime()) awardFile = f; continue; }
    var role = n.indexOf('intake') !== -1 ? 'intake' : (n.indexOf('report') !== -1 ? 'report' : ((n.indexOf('demand') !== -1 || n.indexOf('notice') !== -1) ? 'demand' : null));
    if (!role) continue;
    if (!found[role] || f.getLastUpdated().getTime() > found[role].getLastUpdated().getTime()) found[role] = f;
  }
  var missing = Object.keys(found).filter(function(k) { return !found[k]; });
  if (missing.length) return ui.alert("Missing in '" + NEW_TEMPLATES_FOLDER_NAME + "': " + missing.join(', ') + ".\n\nUpload all three 'NC DV Appraisal Clause - Client Intake / Certified Valuation Appraisal Report / Notice of Appraisal Clause Invocation & Demand' .docx files and run this again.");
  var ids = ['intake', 'report', 'demand'].map(function(role) {
    var f = found[role];
    var id = f.getMimeType() === MimeType.GOOGLE_DOCS ? f.getId() : convertDocxToGoogleDoc_(f, folder);
    try { DriveApp.getFileById(id).setName(f.getName().replace(/\.docx?$/i, '')); } catch (e) {}
    return id;
  });
  PropertiesService.getScriptProperties().setProperty(NC_DV_AC_PROP, JSON.stringify(ids));
  var awardNote = ' (No NC Award Letter file found - upload \'NC DV Appraisal Clause - Appraisal Award Document\' and run this again to enable it.)';
  if (awardFile) {
    var aid = awardFile.getMimeType() === MimeType.GOOGLE_DOCS ? awardFile.getId() : convertDocxToGoogleDoc_(awardFile, folder);
    try { DriveApp.getFileById(aid).setName(awardFile.getName().replace(/\.docx?$/i, '')); } catch (e) {}
    PropertiesService.getScriptProperties().setProperty(NC_DV_AC_AWARD_PROP, aid);
    awardNote = ' NC Award Letter installed too.';
  }
  ui.alert("✅ NC Appraisal Clause DV templates installed." + awardNote + "\n\nNext: run Setup Main Sheet Headers & Dropdowns (so the new Intended Use appears in the dropdown), then pick that Intended Use on a row and run Step 4.");
}

function convertDocxToGoogleDoc_(file, folder) {
  if (typeof Drive === 'undefined') {
    throw new Error("The Drive API service isn't turned on. In Apps Script click Services (+) → Drive API → Add, then run this again. " +
      "(Or right-click each .docx in the '" + NEW_TEMPLATES_FOLDER_NAME + "' folder → Open with → Google Docs, and run this again.)");
  }
  var blob = file.getBlob();
  var baseName = file.getName().replace(/\.docx?$/i, '');
  if (typeof Drive.Files.create === 'function') {
    return Drive.Files.create({ name: baseName, mimeType: MimeType.GOOGLE_DOCS, parents: [folder.getId()] }, blob).id;
  }
  return Drive.Files.insert({ title: baseName, mimeType: MimeType.GOOGLE_DOCS, parents: [{ id: folder.getId() }] }, blob, { convert: true }).id;
}

function installNewTemplates() {
  var ui = SpreadsheetApp.getUi();
  var folders = DriveApp.getFoldersByName(NEW_TEMPLATES_FOLDER_NAME);
  if (!folders.hasNext()) {
    return ui.alert("Couldn't find a Google Drive folder named '" + NEW_TEMPLATES_FOLDER_NAME + "'.\n\n" +
      "Create a folder with exactly that name in your Drive, upload the new template .docx files into it, then run this again.");
  }
  var folder = folders.next();

  // 1. Find the new templates in the folder. If there's more than one file
  // for the same document (e.g. an older upload), the NEWEST one wins.
  var newByRole = {};
  var docxByRole = {};
  var newest = {};
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    if (f.isTrashed() || /nc dv appraisal clause/i.test(f.getName())) continue;   // NC files are installed by their own menu item
    var role = classifyTemplateName_(f.getName());
    if (!role) continue;
    var mime = f.getMimeType();
    var isGDoc = mime === MimeType.GOOGLE_DOCS;
    var isDocx = /\.docx?$/i.test(f.getName()) || mime === MimeType.MICROSOFT_WORD;
    if (!isGDoc && !isDocx) continue;
    var stamp = Math.max(f.getDateCreated().getTime(), f.getLastUpdated().getTime());
    if (newest[role] && newest[role] >= stamp) continue;
    newest[role] = stamp;
    if (isGDoc) { newByRole[role] = f.getId(); delete docxByRole[role]; }
    else { docxByRole[role] = f; delete newByRole[role]; }
  }

  // 2. Work out which role each existing master template plays
  var slots = [];
  var seen = {};
  Object.keys(MASTER_DOC_MAP).forEach(function(use) {
    MASTER_DOC_MAP[use].forEach(function(oldId, idx) {
      if (seen[oldId]) return;
      seen[oldId] = true;
      var oldName = '(could not open)';
      try { oldName = DriveApp.getFileById(oldId).getName(); } catch (e) {}
      slots.push({ oldId: oldId, oldName: oldName, role: roleForMasterSlot_(use, idx, oldName) });
    });
  });

  var lines = [];
  var missing = [];
  slots.forEach(function(s) {
    var has = s.role && (newByRole[s.role] || docxByRole[s.role]);
    if (has) lines.push('✅ ' + s.oldName + '  →  new ' + TEMPLATE_ROLE_LABELS_[s.role]);
    else missing.push('⚠️ ' + s.oldName + (s.role ? '  (no new ' + TEMPLATE_ROLE_LABELS_[s.role] + ' found in folder)' : '  (couldn\'t tell which document this is)'));
  });

  var hasAward = !!(newByRole.award || docxByRole.award);
  if (hasAward) lines.push('✅ NEW: Appraisal Award Document (adds 📜 Create Appraisal Award Document to the menus)');
  var msg = "These templates will be switched to the new design:\n\n" + lines.join("\n") +
    (missing.length ? "\n\nThese will be left as they are:\n" + missing.join("\n") : "") +
    "\n\nYour old templates are NOT deleted or changed — you can undo this any time with ⚙️ Setup & Help → ↩️ Undo Template Install.\n\nContinue?";
  if (ui.alert("Install New Document Templates", msg, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  // 3. Convert any .docx we need, rename to the old template name, save the map
  var map = {};
  try { map = JSON.parse(PropertiesService.getScriptProperties().getProperty(TEMPLATE_OVERRIDES_KEY) || '{}'); } catch (e) { map = {}; }
  var done = 0;
  slots.forEach(function(s) {
    if (!s.role) return;
    var newId = newByRole[s.role];
    if (!newId && docxByRole[s.role]) {
      newId = convertDocxToGoogleDoc_(docxByRole[s.role], folder);
      newByRole[s.role] = newId;
    }
    if (!newId) return;
    // Same name as the old master, so generated copies keep the same file
    // names (Regenerate Report and the Offer/Report searches rely on names).
    try { DriveApp.getFileById(newId).setName(s.oldName); } catch (e) {}
    map[s.oldId] = newId;
    done++;
  });
  PropertiesService.getScriptProperties().setProperty(TEMPLATE_OVERRIDES_KEY, JSON.stringify(map));

  if (hasAward) {
    var awardId = newByRole.award || convertDocxToGoogleDoc_(docxByRole.award, folder);
    try { DriveApp.getFileById(awardId).setName('Appraisal Award Document - Estimate Consultants (Master Template)'); } catch (e) {}
    PropertiesService.getScriptProperties().setProperty(AWARD_TEMPLATE_KEY, awardId);
    done++;
  }

  ui.alert("✅ Installed " + done + " new template(s).\n\nNext: pick a test client row and run Step 4 (Create Client Folder & Master Docs) to check the new documents fill in correctly.");
}

function undoTemplateInstall() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert("Undo Template Install", "Go back to using the original document templates?", ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  PropertiesService.getScriptProperties().deleteProperty(TEMPLATE_OVERRIDES_KEY);
  ui.alert("↩️ Done — the original templates are in use again.");
}

// ==========================================
// NUMBER / MONEY HELPERS
// ==========================================
// parseFloat("25,995") is 25 and parseFloat("$25,995") is NaN — that's what
// was breaking the math whenever a value had a comma or a $ in it.
function toNum(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (val instanceof Date) return 0;
  var s = String(val).trim();
  var negative = /^\(.*\)$/.test(s) || /^-/.test(s.replace(/[$\s]/g, ''));
  var n = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (isNaN(n)) return 0;
  return negative ? -n : n;
}

function fmtMoney(n) {
  var v = toNum(n);
  var s = '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return v < 0 ? '-' + s : s;
}

function fmtMiles(n) {
  return Math.round(toNum(n)).toLocaleString('en-US');
}

function fmtRate(n) {
  return '$' + toNum(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// Mileage adjustment for one comp, per the JD Power/NADA rate per mile.
// A comp with MORE miles than the client's vehicle is adjusted UP (the
// client's lower-mileage car is worth more); fewer miles → adjusted DOWN.
function buildCompMath(n, price, compMiles, clientMiles, rate, optAdj, optNotes) {
  optAdj = toNum(optAdj); optNotes = String(optNotes || '').trim();
  price = toNum(price); compMiles = toNum(compMiles); clientMiles = toNum(clientMiles); rate = toNum(rate);
  if (!(price > 0)) {
    return { diff: 0, adj: 0, val: 0, diffText: '', text: 'Comp ' + n + ': no list price entered.' };
  }
  if (!compMiles) compMiles = clientMiles;
  var diff = compMiles - clientMiles;
  var adj = diff * rate;
  var val = price + adj;
  var diffText, text;
  if (diff === 0) {
    diffText = '0 mi (same mileage)';
    text = 'Comp mileage ' + fmtMiles(compMiles) + ' mi − client mileage ' + fmtMiles(clientMiles) + ' mi = 0 mi. ' +
      'No mileage adjustment. List price ' + fmtMoney(price) + ' = adjusted value ' + fmtMoney(val) + '.';
  } else {
    var more = diff > 0;
    diffText = (more ? '+' : '−') + fmtMiles(Math.abs(diff)) + ' mi (' + (more ? 'more' : 'fewer') + ' than client vehicle)';
    text = 'Comp mileage ' + fmtMiles(compMiles) + ' mi − client mileage ' + fmtMiles(clientMiles) + ' mi = ' +
      (more ? '+' : '−') + fmtMiles(Math.abs(diff)) + ' mi. ' +
      fmtMiles(Math.abs(diff)) + ' mi × ' + fmtRate(rate) + '/mi (JD Power/NADA mileage rate) = ' +
      (more ? '+' : '−') + fmtMoney(Math.abs(adj)) + (more ? ' added to' : ' deducted from') + ' the ' + fmtMoney(price) + ' list price. ' +
      'Mileage-adjusted value: ' + fmtMoney(val) + '.';
    if (!rate) text += ' (No rate per mile entered — enter the JD Power rate to apply the adjustment.)';
  }
  var optText = '';
  if (optAdj !== 0) {
    optText = 'Options adjustment: ' + (optAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(optAdj)) + (optNotes ? ' — ' + optNotes : '') + '.';
    val += optAdj;
    text += ' ' + optText + ' Adjusted value after options: ' + fmtMoney(val) + '.';
  }
  return { diff: diff, adj: adj, val: val, diffText: diffText, text: text, optAdj: optAdj, optText: optText };
}

// Builds the calculateAppraisalMetrics() input straight from a Sheet1 row
// (0-based array from getValues()).
function rowValuesToMathInput(r) {
  return {
    mileage: r[20], ratePerMile: r[61], nadaVal: r[44], kbbVal: r[48],
    carmaxOffer: r[53], carvanaOffer: r[55], dealer3Offer: r[58],
    comp1Price: r[62], comp1Miles: r[65], comp1Fee: r[66],
    comp2Price: r[68], comp2Miles: r[71], comp2Fee: r[72],
    comp3Price: r[74], comp3Miles: r[77], comp3Fee: r[78],
    carGurusDate: r[81], carGurusPct: r[82], priorDamageDeduct: r[84],
    salesTaxPct: r[86], tagTitleFee: r[87],
    comp1OptAdj: r[COL_COMP1_OPT_ADJ - 1], comp1OptNotes: r[COL_COMP1_OPT_NOTES - 1],
    comp2OptAdj: r[COL_COMP2_OPT_ADJ - 1], comp2OptNotes: r[COL_COMP2_OPT_NOTES - 1],
    comp3OptAdj: r[COL_COMP3_OPT_ADJ - 1], comp3OptNotes: r[COL_COMP3_OPT_NOTES - 1],
    subjectOptAdj: r[COL_SUBJ_OPT_ADJ - 1], subjectOptNotes: r[COL_SUBJ_OPT_NOTES - 1]
  };
}

// ==========================================
// DOCUMENT FILL HELPERS
// ==========================================
// Literal find-and-replace that keeps the tag's formatting. (Body.replaceText
// treats the replacement as a regex replacement, so values containing "$" —
// every dollar amount — could come out mangled.)
function docSections_(doc) {
  var sections = [doc.getBody()];
  try { if (doc.getHeader()) sections.push(doc.getHeader()); } catch (e) {}
  try { if (doc.getFooter()) sections.push(doc.getFooter()); } catch (e) {}
  return sections;
}

function escapeRegex_(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fillTagIn_(section, tag, value) {
  var pattern = escapeRegex_(tag);
  var text = (value === null || value === undefined) ? '' : String(value);
  var count = 0;
  var found = section.findText(pattern);
  while (found && count < 200) {
    var el = found.getElement().asText();
    var start = found.getStartOffset();
    var end = found.getEndOffsetInclusive();
    var raw = el.getAttributes(start);
    var attrs = {};
    Object.keys(raw).forEach(function(k) { if (raw[k] !== null && raw[k] !== undefined) attrs[k] = raw[k]; });
    el.deleteText(start, end);
    if (text.length) {
      el.insertText(start, text);
      try { el.setAttributes(start, start + text.length - 1, attrs); } catch (e) {}
    }
    count++;
    found = section.findText(pattern);
  }
  return count;
}

function fillTag(doc, tag, value) {
  var total = 0;
  docSections_(doc).forEach(function(section) { total += fillTagIn_(section, tag, value); });
  return total;
}

function normForMatch_(s) {
  return String(s || '').replace(/[☐☒]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Ticks the ☐ boxes in a generated document for the options chosen in the
// sheet (NAAA grade, repair categories, JD Power & KBB condition).
// Replaces the fixed dealer labels in the templates with the real dealer names:
//  - "Carmax Trade-In Offer:" / "Carvana Trade-In Offer:" lines and the Carmax / Carvana / 3rd Dealer column headers
//    of the trade-in average table  ->  the trade-in dealer names typed in the sheet
//  - the "Dealer 1 / Dealer 2 / 3rd Dealer" column headers of the comp table  ->  each comp's dealer
function renameDealersInDoc_(doc, names, compDealers) {
  try {
    fillTag(doc, 'Carmax Trade-In Offer:', names.d1 + ' Trade-In Offer:');
    fillTag(doc, 'Carvana Trade-In Offer:', names.d2 + ' Trade-In Offer:');   // (older templates only)
    const body = doc.getBody();
    const tables = body.getTables();
    for (let t = 0; t < tables.length; t++) {
      const table = tables[t];
      const isTradeTable = /carmax|carvana/i.test(table.getText());
      for (let r = 0; r < table.getNumRows(); r++) {
        const row = table.getRow(r);
        for (let c = 0; c < row.getNumCells(); c++) {
          const cell = row.getCell(c);
          const txt = cell.getText().trim();
          const key = txt.toLowerCase();
          const upper = txt.length > 0 && txt === txt.toUpperCase();   // the redesigned templates use ALL-CAPS labels
          let repl = null;
          if (key === 'carmax') repl = names.d1;
          else if (key === 'carvana') repl = names.d2;
          else if (key === '3rd dealer') repl = isTradeTable ? names.d3 : (compDealers[2] || null);
          else if (key === 'dealer 1') repl = compDealers[0] || null;
          else if (key === 'dealer 2') repl = compDealers[1] || null;
          if (repl) {
            const clean = String(repl).replace(/[\\$]/g, '');
            cell.editAsText().replaceText('^' + escapeRegex_(txt) + '$', upper ? clean.toUpperCase() : clean);
          }
        }
      }
    }
  } catch (e) { console.error('renameDealersInDoc_: ' + e); }
}

function markCheckboxes_(doc, rowData) {
  var body = doc.getBody();
  var exact = {};
  var naaa = normForMatch_(rowData[38]);
  if (naaa) exact[naaa] = true;

  var nadaMap = {
    'HIGH TRADE-IN VALUE': 'HIGHTRADEINVALUE', 'AVERAGE TRADE-IN VALUE': 'AVERAGETRADEINVALUE', 'LOW TRADE-IN VALUE': 'LOWTRADEINVALUE',
    'EXCELLENT': 'HIGHTRADEINVALUE', 'VERY GOOD': 'HIGHTRADEINVALUE', 'GOOD': 'AVERAGETRADEINVALUE', 'FAIR': 'LOWTRADEINVALUE', 'POOR': 'LOWTRADEINVALUE'
  };
  var nada = nadaMap[String(rowData[46] || '').trim().toUpperCase()];
  if (nada) exact[nada] = true;

  var kbb = normForMatch_(rowData[50]);
  if (kbb && ['FAIR', 'GOOD', 'VERYGOOD', 'EXCELLENT'].indexOf(kbb) !== -1) exact[kbb] = true;

  var cats = {};
  String(rowData[42] || '').replace(/cat\s*(\d+)/gi, function(m, d) { cats[d] = true; return m; });

  var hits = [];
  var found = body.findText('☐');
  while (found) {
    hits.push({ el: found.getElement().asText(), off: found.getStartOffset() });
    found = body.findText('☐', found);
  }
  for (var i = hits.length - 1; i >= 0; i--) {
    var h = hits[i];
    var paraText = '';
    try { paraText = h.el.getParent().asParagraph().getText(); } catch (e) { paraText = h.el.getText(); }
    var norm = normForMatch_(paraText);
    var catMatch = norm.match(/^CAT(\d+)/);
    var hit = exact[norm] || (catMatch && cats[catMatch[1]]);
    if (!hit) continue;
    var raw = h.el.getAttributes(h.off);
    var attrs = {};
    Object.keys(raw).forEach(function(k) { if (raw[k] !== null && raw[k] !== undefined) attrs[k] = raw[k]; });
    h.el.deleteText(h.off, h.off);
    h.el.insertText(h.off, '☒');
    try { h.el.setAttributes(h.off, h.off, attrs); } catch (e) {}
  }
}


// ==========================================
// APPRAISAL AWARD DOCUMENT
// ==========================================
// For appraisal-clause claims: once you and the carrier's appraiser agree
// on a value, this creates the Award Document in the client's folder with
// the claim/vehicle filled from the sheet and your signature already on it.
// Agreed ACV → column CU, carrier appraiser name/company → CV/CW (or the
// Claim tab of the sidebar). Anything left blank prints as a fill-in line.
function createAwardDocCore_(row, rowData) {
  const sheet = getMainSheet();
  const clientName = String(rowData[0] || 'Client').trim();
  const props = PropertiesService.getScriptProperties();
  const ncAward = props.getProperty(NC_DV_AC_AWARD_PROP);
  const templateId = (isAppraisalClauseDV_(rowData[25]) && ncAward) ? ncAward : props.getProperty(AWARD_TEMPLATE_KEY);
  if (!templateId) throw new Error('Award Document template is not installed.');
  // Save into the client's Completed folder (or their folder / the Appraisals folder)
  let dest = null;
  const m = String(rowData[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
  if (m) {
    try {
      const clientFolder = DriveApp.getFolderById(m[1]);
      const it = clientFolder.getFoldersByName("Completed");
      dest = it.hasNext() ? it.next() : clientFolder;
    } catch (e) {}
  }
  if (!dest) {
    const it = DriveApp.getFoldersByName(MAIN_FOLDER_NAME);
    dest = it.hasNext() ? it.next() : DriveApp.createFolder(MAIN_FOLDER_NAME);
  }

  const docName = "Appraisal Award Document - " + clientName;
  const existing = dest.getFilesByName(docName);
  while (existing.hasNext()) existing.next().setTrashed(true); // re-running replaces the old one

  const copy = DriveApp.getFileById(templateId).makeCopy(docName, dest);
  replaceTagsInDoc(copy.getId(), null, rowData);

  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy");
  const logCell = sheet.getRange(row, 94);
  const log = String(logCell.getValue() || '').trim();
  logCell.setValue(dateStr + " — Appraisal Award Document created" + (log ? "\n" + log : ""));
  sheet.getRange(row, 30).setValue("Award Document Created");

  return copy;
}

function createAwardDocument() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const row = activeFileRow_();
  if (row <= 1) return ui.alert("Select a client row first.");

  const templateId = PropertiesService.getScriptProperties().getProperty(AWARD_TEMPLATE_KEY);
  if (!templateId && !PropertiesService.getScriptProperties().getProperty(NC_DV_AC_AWARD_PROP)) {
    return ui.alert("The Award Document template isn't installed yet.\n\nPut '5. Appraisal Award Document - Estimate Consultants.docx' in your '" +
      NEW_TEMPLATES_FOLDER_NAME + "' Drive folder, then run ⚙️ Setup & Help → 📄 Install New Document Templates.");
  }

  const rowData = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const clientName = String(rowData[0] || 'Client').trim();

  if (!(toNum(rowData[COL_AWARD_ACV - 1]) > 0)) {
    const res = ui.prompt(isAppraisalClauseDV_(rowData[25]) ? "Agreed Diminished Value" : "Agreed Actual Cash Value",
      "Enter the " + (isAppraisalClauseDV_(rowData[25]) ? "diminished value" : "ACV") + " both appraisers agreed on.\n(Leave blank to print a fill-in line instead.)", ui.ButtonSet.OK_CANCEL);
    if (res.getSelectedButton() !== ui.Button.OK) return;
    const txt = res.getResponseText().trim();
    if (txt) {
      rowData[COL_AWARD_ACV - 1] = toNum(txt);
      sheet.getRange(row, COL_AWARD_ACV).setValue(toNum(txt));
    }
  }
  if (!String(rowData[COL_CARRIER_APPRAISER - 1] || '').trim()) {
    const res = ui.prompt("Carrier's Appraiser",
      "Name of the insurance carrier's appraiser / agent.\n(Optional — leave blank for a fill-in line.)", ui.ButtonSet.OK_CANCEL);
    if (res.getSelectedButton() !== ui.Button.OK) return;
    const txt = res.getResponseText().trim();
    if (txt) { rowData[COL_CARRIER_APPRAISER - 1] = txt; sheet.getRange(row, COL_CARRIER_APPRAISER).setValue(txt); }
  }
  if (!String(rowData[COL_CARRIER_APPRAISER_CO - 1] || '').trim()) {
    const res = ui.prompt("Carrier Appraiser's Company",
      "Company the carrier's appraiser works for.\n(Optional — leave blank for a fill-in line.)", ui.ButtonSet.OK_CANCEL);
    if (res.getSelectedButton() !== ui.Button.OK) return;
    const txt = res.getResponseText().trim();
    if (txt) { rowData[COL_CARRIER_APPRAISER_CO - 1] = txt; sheet.getRange(row, COL_CARRIER_APPRAISER_CO).setValue(txt); }
  }
  if (!String(rowData[COL_CARRIER_APPRAISER_EMAIL - 1] || '').trim()) {
    const res = ui.prompt("Carrier Appraiser's Email", "Enter their email and the sheet will email them the e-sign link when you approve it.\n(Leave blank to only create the document.)", ui.ButtonSet.OK_CANCEL);
    if (res.getSelectedButton() !== ui.Button.OK) return;
    const txt = res.getResponseText().trim();
    if (txt) { rowData[COL_CARRIER_APPRAISER_EMAIL - 1] = txt; sheet.getRange(row, COL_CARRIER_APPRAISER_EMAIL).setValue(txt); }
  }

  const copy = createAwardDocCore_(row, rowData);

  const url = copy.getUrl();
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">' +
    '✅ Award Document created for <b>' + clientName.replace(/</g, '&lt;') + '</b>.<br><br>' +
    '<a href="' + url + '" target="_blank" style="font-weight:bold">Open the Award Document ↗</a><br><br>' +
    '<span style="color:#666;font-size:12px">Saved in the client\'s Completed folder. Send it to the carrier\'s appraiser to sign.</span></div>'
  ).setWidth(420).setHeight(170);
  ui.showModalDialog(html, "📜 Appraisal Award Document");
}

function addProgressNote() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getMainSheet();
  var row = activeFileRow_();
  if (row <= 1) return ui.alert("Select a client row first.");

  var res = ui.prompt("Add Progress Note", "What's the update?", ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var note = res.getResponseText().trim();
  if (!note) return;

  var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy");
  var entry = dateStr + " — " + note;

  var cell = sheet.getRange(row, 94);
  var existing = String(cell.getValue() || "").trim();
  cell.setValue(existing ? entry + "\n" + existing : entry);

  ui.alert("✅ Note added.");
}

function searchAddressSuggestions(query) {
  if (!query || query.length < 3) return [];
  try {
    var url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=5&countrycodes=us&q=" + encodeURIComponent(query);
    var response = UrlFetchApp.fetch(url, {
      headers: { "User-Agent": "EstimateConsultantsAppraisalTool/1.0 (internal business tool)" },
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) return [];
    var results = JSON.parse(response.getContentText());
    return results.map(function(r) { return r.display_name; });
  } catch (err) {
    console.error("Address search failed: " + err);
    return [];
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('🚗 Appraisals')
    .addItem('📂 Open File Panel (edit the selected file)', 'showFilePanel')
    .addItem('✅ Needs Action (only what is waiting on me)', 'goToNeedsAction')
    .addItem('🔥 Refresh Active Files', 'goToActiveFiles')
    .addItem('🗄 Closed Files (undo a close)', 'goToClosedFiles')
    .addItem('📬 New Emails (people not in the sheet)', 'goToNewEmails')
    .addItem('🧾 Receipts (tax records)', 'goToReceipts')
    .addItem('🧾 Add a receipt (photo / PDF)', 'showAddReceiptForm')
    .addItem('🧾 Open the Receipts folder', 'openReceiptsFolder')
    .addItem('👥 Add / reset an app login (you or an employee)', 'addAppLogin')
    .addItem('👥 App logins (turn someone off)', 'goToAppLogins')
    .addSeparator()
    .addItem('➕ New Client Entry', 'showManualClaimForm')
    .addItem('✉️ Email a Prospective Client', 'showProspectEmailForm')
    .addItem('📝 Add Progress Note', 'addProgressNote')
    .addItem('✅ Check for Pending Approvals Now', 'checkPendingApprovalsNow')
    .addSeparator()
    .addSubMenu(ui.createMenu('🛠️ Manual Steps (normally automatic)')
      .addItem('Build folder & documents', 'generateClientFile')
      .addItem('Re-run comps', 'rerunCompsForActiveRow')
      .addItem('Get dealer / guide offers', 'triggerOffersForActiveRow')
      .addItem('Fill sales tax & tag fees', 'populateTaxAndFeesForActiveRow')
      .addItem('Refresh report from the data', 'regenerateDocsForRow')
      .addItem('Add offer & comp screenshots to report', 'appendScreenshotsToReport')
      .addItem('Compile final appraisal PDF', 'compileAndFinalizeAppraisalPdf')
      .addItem('📥 File email attachments now', 'fileEmailAttachmentsNow')
      .addItem('📤 Send appraisal to the client for approval (diminished value)', 'requestDvDeliveryNow')
      .addItem('🧾 Scan Gmail for receipts now (last 60 days)', 'scanReceiptsNow')
      .addSeparator()
      .addItem('Send intake / signing link (+ $199 retainer for insurer DV)', 'sendAuthAndInvoice')
      .addItem('Send invoice and deliver report', 'sendFinalInvoiceAndDeliver')
      .addItem('📨 Deliver the finished report NOW (already paid)', 'deliverReportNow')
      .addItem('🔎 Check what Wave says about this invoice', 'checkInvoiceNow')
      .addItem('Send demand / notice to the adjuster', 'sendAdjusterDemandEmail')
      .addItem('Send final offer link + $299 invoice (insurer DV)', 'sendFinalPhase')
      .addItem('Create & send award letter', 'createAwardDocument')
      .addSeparator()
      .addItem('Update settlement offer document', 'createClientOfferDoc')
      .addItem('Apply shop promo code (15% off)', 'applyShopPromoToActiveRow')
      .addItem('💸 Partner payouts due (who to pay, how)', 'partnerPayoutsDue')
      .addItem('✅ Mark selected partner payouts paid', 'partnerMarkSelectedPaid')
      .addItem('Get client intake form link', 'generateIntakeFormLink')
      .addItem('Jump to this vehicle in all tabs', 'jumpToVehicleInAllTabs'))
    .addSubMenu(ui.createMenu('⚙️ Setup (one-time)')
      .addItem('⚡ Turn on ALL automations', 'enableAllAutomations')
      .addItem('Set up main sheet headers & dropdowns', 'setupSheetHeaders')
      .addItem('Install new document templates', 'installNewTemplates')
      .addItem('Install NC appraisal clause DV templates (+ award)', 'installNcDvTemplates')
      .addItem('Undo template install', 'undoTemplateInstall')
      .addItem('Upload sample report (for prospect emails)', 'showSampleReportUpload')
      .addItem('Set CarMax/Carvana/Edmunds access key', 'setCarMaxCarvanaEdmundsAccessKey')
      .addItem('Set Vehicles.dev API key', 'setVehiclesDevApiKey')
      .addItem('Test report delivery (selected file)', 'testReportDelivery')
      .addSeparator()
      .addItem('Customer portal: set up directory headers', 'setupCustomerSheetHeaders')
      .addItem('Customer portal: 2-day upload reminders on', 'setupUploadReminderTrigger')
      .addItem('Estimator follow-ups: set up sheet', 'setupEstimatorFollowupSheet')
      .addItem('Estimator follow-ups: turn on', 'setupEstimatorFollowupTrigger')
      .addItem('Shop referral codes: set up sheet', 'setupReferralCodesSheet')
      .addItem('Shop referral codes: create new code', 'createReferralCode'))
    .addSeparator()
    .addItem('📖 How-To Guide', 'showHowToGuide')
    .addToUi();

  try { refreshActiveFiles(); } catch (err) { console.error('Active Files refresh on open failed: ' + err); }
  try { refreshClosedFiles_(); } catch (err) { console.error('Closed Files refresh failed: ' + err); }
}

function goToActiveFiles() {
  const n = refreshActiveFiles();
  const sh = getWorkingSpreadsheet().getSheetByName(ACTIVE_SHEET_NAME);
  if (sh) getWorkingSpreadsheet().setActiveSheet(sh);
  getWorkingSpreadsheet().toast(n + ' active file' + (n === 1 ? '' : 's'), '🔥 Active Files', 4);
}

function enableAllAutomations() {
  const want = { checkStatusAndDeliver: function(b) { return b.timeBased().everyMinutes(5); }, dailyAutomationRun: function(b) { return b.timeBased().everyDays(1).atHour(7); }, fileEmailAttachments: function(b) { return b.timeBased().everyMinutes(10); } };
  const have = {};
  ScriptApp.getProjectTriggers().forEach(function(t) { have[t.getHandlerFunction()] = true; });
  const done = [];
  Object.keys(want).forEach(function(fn) {
    if (have[fn]) { done.push(fn + ' (already on)'); return; }
    want[fn](ScriptApp.newTrigger(fn)).create(); done.push(fn + ' (turned on)');
  });
  try { refreshActiveFiles(); } catch (e) {}
  SpreadsheetApp.getUi().alert('⚡ Automations are on:\n\n- Every 5 minutes: payments, report delivery, approvals, Active Files refresh\n- Every 10 minutes: email attachments are filed into client folders\n- Every morning ~7 AM: daily briefing, weekly-update batch, insurer & prospect follow-ups\n\n' + done.join('\n'));
}

function getWorkingSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(VALUATIONS_SPREADSHEET_ID);
}

const MAIN_SHEET_NAME = "Sheet1";
function getMainSheet() {
  var ss = getWorkingSpreadsheet();
  // (Previously called itself forever if "Sheet1" was ever renamed.)
  var sh = ss.getSheetByName(MAIN_SHEET_NAME) || ss.getSheets().filter(function(x) { return x.getName() !== ACTIVE_SHEET_NAME; })[0];
  try { if (sh && sh.getMaxColumns() < MAIN_ROW_WIDTH) { sh.insertColumnsAfter(sh.getMaxColumns(), MAIN_ROW_WIDTH - sh.getMaxColumns()); ensureMainWidth_(sh); } } catch (e) {}
  return sh;
}

function getValuationsDataForMainRow() {
  var mainSheet = getMainSheet();
  var mainRow = activeFileRow_();
  if (mainRow <= 1) return null;

  var sessionId = String(mainSheet.getRange(mainRow, 93).getValue() || "");
  if (!sessionId) return { noSessionId: true };

  var valSheet = getTargetValuationsSheet();
  if (!valSheet) return null;
  var valRow = findRowBySessionId(valSheet, VALUATIONS_TOTAL_COLS + 1, sessionId, 2000);
  if (!valRow) return { noMatch: true };

  var r = valSheet.getRange(valRow, 1, 1, VALUATIONS_TOTAL_COLS).getValues()[0];

  function fmt(val) {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  }
  function fmtMoney(val) {
    var num = parseFloat(val);
    if (isNaN(num)) return '';
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  var subject = {
    date: fmt(r[0]), stateZip: fmt(r[1]), vin: fmt(r[2]), year: fmt(r[3]),
    make: fmt(r[4]), model: fmt(r[5]), trim: fmt(r[6]), drivetrain: fmt(r[7]),
    packageCodes: fmt(r[8]), options: fmt(r[9]), msrp: fmtMoney(r[10]), mileage: fmt(r[11]),
    estimatedValue: fmtMoney(r[12]), compsCount: fmt(r[13]), searchTierUsed: fmt(r[14]),
    cpmRate: fmt(r[15])
  };

  var comps = [];
  for (var i = 0; i < VALUATIONS_MAX_COMPS; i++) {
    var startIdx = VALUATIONS_SUBJECT_COLS + (i * VALUATIONS_COLS_PER_COMP);
    var title = fmt(r[startIdx + 1]);
    if (title) {
      comps.push({
        source: fmt(r[startIdx]), title: title, price: fmtMoney(r[startIdx + 2]),
        mileage: fmt(r[startIdx + 3]), adjPrice: fmtMoney(r[startIdx + 4]),
        distance: fmt(r[startIdx + 5]), dealer: fmt(r[startIdx + 6]),
        vin: fmt(r[startIdx + 7]), url: fmt(r[startIdx + 8]), msrp: fmtMoney(r[startIdx + 9]),
        packageCodes: fmt(r[startIdx + 10]), options: fmt(r[startIdx + 11]),
        accidentHistory: fmt(r[startIdx + 12])
      });
    }
  }

  return { subject: subject, comps: comps };
}

function setupValuationsTabHeaders() {
  var sheet = getTargetValuationsSheet();

  var headers = [
    "Date", "State / ZIP", "VIN", "Year", "Make", "Model", "Trim", "Drivetrain",
    "Subject Package Codes", "Subject Options", "Subject MSRP", "Mileage",
    "Estimated Fair Market Value", "Total Comps Found", "Search Tier Used", "J.D. Power Mileage Rate"
  ];

  for (var i = 1; i <= VALUATIONS_MAX_COMPS; i++) {
    headers.push(
      "Comp " + i + " Source", "Comp " + i + " Listing", "Comp " + i + " Price",
      "Comp " + i + " Mileage", "Comp " + i + " Adj Price", "Comp " + i + " Distance",
      "Comp " + i + " Dealer", "Comp " + i + " VIN", "Comp " + i + " URL",
      "Comp " + i + " MSRP", "Comp " + i + " Package Codes", "Comp " + i + " Options",
      "Comp " + i + " Accident History"
    );
  }

  headers.push("Session ID");

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight("bold").setBackground("#1c4587").setFontColor("#ffffff").setVerticalAlignment("middle");
  sheet.setRowHeight(1, 35);
  sheet.setFrozenRows(1);
  SpreadsheetApp.getUi().alert("🎉 All " + headers.length + " 'valuations' tab columns and headers are configured!");
}

function triggerOffersForActiveRow() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getTargetValuationsSheet();
  var row = activeFileRow_();

  if (row <= 1) return ui.alert("Please select a valid vehicle row (Row 2 or below) first.");

  var CODESPACE_LISTENER_URL = "https://shiny-space-halibut-xrrjx46grjj4h9x99-5000.app.github.dev/run-offers";
  try {
    UrlFetchApp.fetch(CODESPACE_LISTENER_URL + "?row=" + row, { method: "post", muteHttpExceptions: true });
    ui.alert("🚀 Offer automation triggered for Row " + row + "! Check your Codespace terminal.");
  } catch (err) {
    ui.alert("Error connecting to Codespace listener: " + err);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (typeof data.action === 'string' && data.action.indexOf('partner_') === 0) return partnerHandle_(data);   // Preferred Partners website (PartnerPortal.gs)

    // ============================================================
    // 🚗 APPRAISAL CUSTOMER PORTAL ACTIONS — checked first, before any
    // of the pre-existing routes below. Fully email-based (no SMS/text
    // anywhere — that service has been discontinued).
    // ============================================================
    if (typeof data.action === 'string' && data.action.indexOf('exp_') === 0) return expHandle_(data);
    if (data.action === "register_shop") return handlePortalRegistration(data);
    if (data.action === "request_otp_email") return sendPortalOtpEmail(data);
    if (data.action === "verify_otp") return verifyPortalOtp(data);
    if (data.action === "forgot") return sendPortalForgotEmail(data);
    if (data.action === "changePassword") return changePortalPassword(data);
    if (data.action === "fetch_claims") return fetchPortalClaimsResponse(data);
    if (data.action === "init_submission") return handlePortalInitSubmission(data);
    if (data.action === "upload_chunk") return handlePortalUploadChunk(data);

    if (data.action === "logWebSubmission" || data.action === "logEstimate") {
      return handleWebSubmission(data);
    }

    if (data.action === "submitVinMileage") {
      return handleVinMileageSubmission(data);
    }

    if (data.action === "submitIntakeForm") {
      return handleIntakeFormSubmission(data);
    }

    var result = processValuationAndLog(data);
    
    if (result.finalValue > 2000) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "marketValue": result.finalValue }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ "status": "fallback", "marketValue": 0 }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "error": String(err) }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function findRowBySessionId(sheet, sessionIdColIndex, sessionId, maxLookback) {
  if (!sessionId) return null;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  var startRow = Math.max(2, lastRow - (maxLookback || 50) + 1);
  var numRows = lastRow - startRow + 1;
  var values = sheet.getRange(startRow, sessionIdColIndex, numRows, 1).getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] === sessionId) return startRow + i;
  }
  return null;
}

function handleWebSubmission(data) {
  try {
    var ss = getWorkingSpreadsheet();
    var mainSheet = ss.getSheetByName("Sheet1") || getMainSheet();

    var clientName = data.clientName || data.name || "Web Lead";
    var clientEmail = data.email || data.clientEmail || "";
    var phone = data.phone || data.clientPhone || "";
    var address = data.address || "";
    var mailingAddress = data.mailingAddress || "";
    var dateOfLoss = data.dateOfLossOrPassing || data.dateOfLoss || "";
    var dateRepaired = data.vehicleRepairedDate || data.dateRepaired || "";
    var carrier = data.insuranceCompany || data.carrier || "";
    var partyType = data.partyType || "3rd Party";
    var claimNumber = data.claimNumber || "";
    var adjusterName = data.adjusterName || "";
    var adjusterPhone = data.adjusterPhone || "";
    var adjusterEmail = data.adjusterEmail || "";
    var atFaultDriver = data.atFaultDriver || "";
    var state = data.state || data.clientState || "";
    var zip = data.zipCode || "";
    var year = data.year || data.vehicleYear || "";
    var vin = data.vin || "N/A";
    var make = data.make || data.vehicleMake || "";
    var model = data.model || data.vehicleModel || "";
    var trim = data.trim || data.customTrim || "";
    var mileage = data.mileage || "";
    var plate = data.plate || "";
    var regState = data.regState || state;
    var color = data.color || "";
    var titleBranding = data.titleStatus || data.titleBranding || "";
    var claimType = data.claimType || "3rd-Party Loss in Market Value (Diminished Value) Claim";
    var isAtFault = data.isAtFault || "";
    var damageSeverity = data.damageSeverity || "";
    var priorAccident = data.priorAccident || "";
    var estimatedDvRange = data.estimatedDvRange || "";
    var minDv = data.minDv || "";
    var maxDv = data.maxDv || "";
    var marketValue = data.marketValue || "";
    var submissionMethod = data.submissionMethod || (data.action === "logEstimate" ? "Wizard Estimator" : "Web Form");
    var timestamp = new Date();

    var sessionId = data.sessionId || "";

    var existingMainRow = findRowBySessionId(mainSheet, 93, sessionId, 50);
    var targetRow = existingMainRow || (mainSheet.getLastRow() + 1);
    var yearStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy");
    var appraisalId = "EC-" + yearStr + "-" + String(targetRow).padStart(4, '0');

    var mainRowData = [
      clientName, phone, address, mailingAddress, clientEmail, dateOfLoss, dateRepaired, carrier, partyType, claimNumber, adjusterName, adjusterPhone, adjusterEmail,
      state, atFaultDriver, year, vin, make, model, trim, mileage, plate, regState, color, titleBranding,
      claimType, "USPAP Compliant Appraisal",
      "", "", "Web Lead Submitted", appraisalId, "", ""
    ];

    if (existingMainRow) {
      mainSheet.getRange(targetRow, 1, 1, mainRowData.length).setValues([mainRowData]);
    } else {
      mainSheet.appendRow(mainRowData);
    }

    mainSheet.getRange(targetRow, 89).setValue("Web Lead Submitted");
    mainSheet.getRange(targetRow, 90).setValue(submissionMethod);
    mainSheet.getRange(targetRow, 91).setValue(timestamp);
    mainSheet.getRange(targetRow, 91).setNumberFormat("MM/dd/yyyy h:mm:ss AM/PM");
    mainSheet.getRange(targetRow, 92).setValue(estimatedDvRange);
    mainSheet.getRange(targetRow, 93).setValue(sessionId);
    mainSheet.getRange(targetRow, 91).setNumberFormat("MM/dd/yyyy h:mm:ss AM/PM");

    var note =
      "WEB LEAD SUBMISSION\n" +
      "====================\n" +
      "Submission Method: " + submissionMethod + "\n" +
      "Timestamp: " + Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss") + "\n" +
      "Name: " + clientName + "\n" +
      "Phone: " + phone + "\n" +
      "Email: " + clientEmail + "\n" +
      "State: " + state + "\n" +
      "ZIP: " + zip + "\n" +
      "Vehicle: " + year + " " + make + " " + model + "\n" +
      "Trim: " + trim + "\n" +
      "Mileage: " + mileage + "\n" +
      "VIN: " + vin + "\n" +
      "Claim Type: " + claimType + "\n" +
      "At Fault: " + isAtFault + "\n" +
      "Damage Severity: " + damageSeverity + "\n" +
      "Prior Accident: " + priorAccident + "\n" +
      "Estimated DV Range: " + estimatedDvRange + "\n" +
      "Minimum DV: " + minDv + "\n" +
      "Maximum DV: " + maxDv + "\n" +
      "Market Value: " + marketValue;

    mainSheet.getRange(targetRow, 89).setNote(note);

    var logSheet = ss.getSheetByName("Estimates_Log");
    if (!logSheet) {
      logSheet = ss.insertSheet("Estimates_Log");
      logSheet.appendRow([
        "Timestamp", "Year", "Make", "Model", "Trim", "Mileage", 
        "State", "ZIP Code", "Damage Severity", "Prior History", 
        "Market Value", "Estimated DV Range", "Min DV", "Max DV", "Session ID"
      ]);
      logSheet.getRange(1, 1, 1, 15).setFontWeight("bold").setBackground("#1c4587").setFontColor("#ffffff");
      logSheet.setFrozenRows(1);
    }

    var logRowData = [
      timestamp, year, make, model, trim, mileage, state, zip,
      damageSeverity, priorAccident, marketValue, estimatedDvRange, minDv, maxDv, sessionId
    ];
    var existingLogRow = findRowBySessionId(logSheet, 15, sessionId, 50);
    if (existingLogRow) {
      logSheet.getRange(existingLogRow, 1, 1, logRowData.length).setValues([logRowData]);
    } else {
      logSheet.appendRow(logRowData);
    }

    var valResult = { finalValue: 0, compsCount: 0 };
    if (year && make && model) {
      try {
        valResult = processValuationAndLog(data);
      } catch (scrapErr) {
        console.error("Valuation scrape error: " + scrapErr);
      }
    }

    if ((submissionMethod === "Email" || submissionMethod === "Text") && clientEmail) {
      sendPhotoRequestEmail(clientName, clientEmail, year, make, model, claimType, sessionId);
    }

    // 📧 ESTIMATOR LEAD FOLLOW-UP — only for the actual DV calculator (gated
    // behind email on the marketing site), not the passive wizard views that
    // used to log with no email at all. Upserts by sessionId so a repeat
    // estimator run for the same browser session updates the same row
    // instead of restarting the follow-up sequence from scratch.
    if (submissionMethod === "Wizard Estimator" && clientEmail) {
      try {
        logEstimatorFollowupLead(clientName, clientEmail, year, make, model, vin, state, mileage, estimatedDvRange, sessionId);
      } catch (followupErr) {
        console.error("logEstimatorFollowupLead failed: " + followupErr);
      }
    }

    try {
      var notifyBody = "A web submission was just logged.\n\n" +
        "Name: " + clientName + "\n" +
        "Phone: " + phone + "\n" +
        "Email: " + clientEmail + "\n" +
        "State: " + state + "\n" +
        "Vehicle: " + year + " " + make + " " + model + " " + trim + "\n" +
        "Mileage: " + mileage + "\n" +
        "Submission Method: " + submissionMethod + "\n" +
        "Estimated Payout Range: " + (estimatedDvRange || "N/A") + "\n" +
        "Appraisal ID: " + appraisalId + "\n" +
        "Sheet Row: " + targetRow + (existingMainRow ? " (updated existing row)" : " (new row)") + "\n\n" +
        "View the sheet: " + ss.getUrl();

      MailApp.sendEmail({
        to: "kevin@estimateconsultants.com",
        subject: "New Web Submission: " + clientName + " — " + year + " " + make + " " + model,
        body: notifyBody
      });
    } catch (mailErr) {
      console.error("Submission notification email failed: " + mailErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        logged: true,
        row: targetRow,
        appraisalId: appraisalId,
        submissionMethod: submissionMethod,
        marketValueScraped: valResult.finalValue,
        compsFound: valResult.compsCount
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("handleWebSubmission error: " + err);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        logged: false,
        error: String(err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleLogEstimate(data) {
  return handleWebSubmission(data);
}

const COMPS_API_ENDPOINT = "https://car-trim-api.vercel.app/api/comps";
const VALUATIONS_SUBJECT_COLS = 16;
const VALUATIONS_COLS_PER_COMP = 13;
const VALUATIONS_MAX_COMPS = 8;
const VALUATIONS_TOTAL_COLS = VALUATIONS_SUBJECT_COLS + (VALUATIONS_COLS_PER_COMP * VALUATIONS_MAX_COMPS);

function handleIntakeFormSubmission(data) {
  try {
    var sessionId = data.sessionId || "";
    if (!sessionId) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", error: "Missing reference ID." })).setMimeType(ContentService.MimeType.JSON);
    }

    var mainSheet = getMainSheet();
    var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);
    if (!mainRow) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", error: "We couldn't find your original submission. Please contact us directly at kevin@estimateconsultants.com." })).setMimeType(ContentService.MimeType.JSON);
    }

    var fieldColumnMap = {
      year: 16, make: 18, model: 19, trim: 20, vin: 17, mileage: 21,
      state: 23, plate: 22, titleStatus: 25,
      address: 3, mailingAddress: 4,
      insuranceCompany: 8, adjusterName: 11, adjusterPhone: 12, adjusterEmail: 13,
      claimNumber: 10, atFaultDriver: 15,
      dateOfLossOrPassing: 6, vehicleRepairedDate: 7
    };

    Object.keys(fieldColumnMap).forEach(function(key) {
      if (data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== '') {
        mainSheet.getRange(mainRow, fieldColumnMap[key]).setValue(data[key]);
      }
    });

    var claimType = String(mainSheet.getRange(mainRow, 26).getValue() || "");
    var isDvOrTL = claimType.includes('Diminished Value') || claimType.includes('3rd-Party') || claimType.includes('Total Loss');
    if (isDvOrTL && data.state) {
      mainSheet.getRange(mainRow, 14).setValue(data.state);
    }

    if (data.vin && data.mileage) {
      try {
        var year = data.year || mainSheet.getRange(mainRow, 16).getValue();
        var make = data.make || mainSheet.getRange(mainRow, 18).getValue();
        var model = data.model || mainSheet.getRange(mainRow, 19).getValue();
        var trim = data.trim || mainSheet.getRange(mainRow, 20).getValue();
        var state = data.state || mainSheet.getRange(mainRow, 14).getValue();

        var zip = "";
        var logSheet = getWorkingSpreadsheet().getSheetByName("Estimates_Log");
        if (logSheet) {
          var logRow = findRowBySessionId(logSheet, 15, sessionId, 500);
          if (logRow) zip = logSheet.getRange(logRow, 8).getValue();
        }

        if (year && make && model) {
          processValuationAndLog({
            year: year, make: make, model: model, trim: trim,
            zip: zip, mileage: data.mileage, drivetrain: "", vin: data.vin,
            state: state, sessionId: sessionId
          });
        }
      } catch (valErr) {
        console.error("Intake form comps run failed: " + valErr);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error("handleIntakeFormSubmission error: " + err);
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleVinMileageSubmission(data) {
  try {
    var sessionId = data.sessionId || "";
    var vin = String(data.vin || "").trim().toUpperCase();
    var mileage = data.mileage || "";

    if (!sessionId) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", error: "Missing reference ID — please use the link from your email." })).setMimeType(ContentService.MimeType.JSON);
    }
    if (!mileage) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", error: "Mileage is required." })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = getWorkingSpreadsheet();
    var mainSheet = ss.getSheetByName("Sheet1") || getMainSheet();
    var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);

    if (!mainRow) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", error: "We couldn't find your original submission. Please contact us directly at kevin@estimateconsultants.com." })).setMimeType(ContentService.MimeType.JSON);
    }

    var rowVals = mainSheet.getRange(mainRow, 1, 1, 26).getValues()[0];
    var clientName = rowVals[0];
    var state = rowVals[13];
    var year = rowVals[15];
    var make = rowVals[17];
    var model = rowVals[18];
    var trim = rowVals[19];

    if (vin) mainSheet.getRange(mainRow, 17).setValue(vin);
    mainSheet.getRange(mainRow, 21).setValue(mileage);

    var zip = "";
    var logSheet = ss.getSheetByName("Estimates_Log");
    if (logSheet) {
      var logRow = findRowBySessionId(logSheet, 15, sessionId, 500);
      if (logRow) zip = logSheet.getRange(logRow, 8).getValue();
    }

    var valResult = { finalValue: 0, compsCount: 0 };
    if (year && make && model) {
      try {
        valResult = processValuationAndLog({
          year: year, make: make, model: model, trim: trim,
          zip: zip, mileage: mileage, drivetrain: "", vin: vin,
          state: state, sessionId: sessionId
        });
      } catch (valErr) {
        console.error("VIN/mileage comps run failed: " + valErr);
      }
    }

    try {
      MailApp.sendEmail({
        to: "kevin@estimateconsultants.com",
        subject: "VIN/Mileage Received: " + clientName + " — " + year + " " + make + " " + model,
        body: "Client submitted VIN/mileage via the follow-up form.\n\n" +
          "VIN: " + (vin || "N/A") + "\nMileage: " + mileage + "\n" +
          "Estimated Value: " + (valResult.finalValue > 0 ? "$" + valResult.finalValue.toLocaleString() : "No comps found") + "\n" +
          "Comps Found: " + valResult.compsCount + "\n\n" +
          "Sheet Row: " + mainRow + "\nView the sheet: " + ss.getUrl()
      });
    } catch (mailErr) {
      console.error("VIN/mileage notification email failed: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      clientName: clientName,
      vehicle: (String(year) + " " + make + " " + model).trim()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("handleVinMileageSubmission error: " + err);
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function processValuationAndLog(data, targetRow) {
  var year = parseInt(data.year || data.vehicleYear) || 2021;
  var make = data.make || data.vehicleMake || "";
  var model = data.model || data.vehicleModel || "";
  var trim = data.trim || data.customTrim || "";
  var mileage = parseInt(data.mileage) || 45000;
  var zip = data.zipCode || data.clientZip || "";
  var state = data.state || data.clientState || "";
  var vin = data.vin || data.vinNumber || "N/A";
  var drivetrain = data.drivetrain || "";

  var compResults = data.compResults;

  if (!compResults || !compResults.success) {
    compResults = fetchCompsFromVercel({
      year: year, make: make, model: model, trim: trim,
      zip: zip, mileage: mileage, drivetrain: drivetrain,
      vin: (vin && vin !== "N/A") ? vin : ""
    });
  }

  var finalValue = (compResults && compResults.success) ? compResults.finalFairMarketValue : 0;
  var comps = (compResults && compResults.comps) ? compResults.comps : [];

  var sessionId = data.sessionId || "";
  var resolvedRow = targetRow;
  if (!resolvedRow) {
    var sheetForLookup = getTargetValuationsSheet();
    resolvedRow = findRowBySessionId(sheetForLookup, VALUATIONS_TOTAL_COLS + 1, sessionId, 50) || (sheetForLookup.getLastRow() + 1);
  }

  writeToValuationsSheetColumns(resolvedRow, {
    date: new Date(),
    stateZip: state + " / " + zip,
    vin: vin,
    year: year,
    make: make,
    model: model,
    trim: trim,
    drivetrain: drivetrain || "N/A",
    subjectPackageCodes: compResults ? (compResults.subjectPackageCodes || []) : [],
    subjectOptions: compResults ? (compResults.subjectOptions || []) : [],
    subjectMsrp: compResults ? (compResults.subjectCombinedMsrp || null) : null,
    mileage: mileage,
    finalValue: finalValue,
    compsCount: comps.length,
    searchTierUsed: compResults ? (compResults.searchTierUsed || "N/A") : "No comps found",
    cpmRate: compResults ? (compResults.jdPowerMileageRate || 0) : 0,
    comps: comps,
    sessionId: sessionId
  });

  syncCompsToMainSheet(sessionId, compResults);

  return { finalValue: finalValue, compsCount: comps.length, row: resolvedRow };
}

function syncCompsToMainSheet(sessionId, compResults) {
  if (!sessionId || !compResults || !compResults.success) return;
  try {
    var ss = getWorkingSpreadsheet();
    var mainSheet = ss.getSheetByName("Sheet1") || getMainSheet();
    var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);
    if (!mainRow) return;

    if (compResults.jdPowerMileageRate) {
      mainSheet.getRange(mainRow, 62).setValue(compResults.jdPowerMileageRate);
    }

    var comps = compResults.comps || [];
    var colStarts = [63, 69, 75];
    for (var i = 0; i < 3; i++) {
      var c = comps[i];
      if (!c) continue;
      var startCol = colStarts[i];
      mainSheet.getRange(mainRow, startCol).setValue(c.price || '');
      mainSheet.getRange(mainRow, startCol + 1).setValue(c.dealer || '');
      mainSheet.getRange(mainRow, startCol + 2).setValue(new Date());
      mainSheet.getRange(mainRow, startCol + 3).setValue(c.mileage || '');
    }
  } catch (err) {
    console.error("syncCompsToMainSheet failed: " + err);
  }
}

function fetchCompsFromVercel(vehicle) {
  try {
    var url = COMPS_API_ENDPOINT +
      "?year=" + encodeURIComponent(vehicle.year) +
      "&make=" + encodeURIComponent(vehicle.make) +
      "&model=" + encodeURIComponent(vehicle.model) +
      "&trim=" + encodeURIComponent(vehicle.trim || "") +
      "&zip=" + encodeURIComponent(vehicle.zip || "") +
      "&mileage=" + encodeURIComponent(vehicle.mileage || "") +
      "&drivetrain=" + encodeURIComponent(vehicle.drivetrain || "") +
      "&vin=" + encodeURIComponent(vehicle.vin || "");

    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (response.getResponseCode() !== 200) return null;
    return JSON.parse(response.getContentText());
  } catch (e) {
    console.error("fetchCompsFromVercel error: " + e);
    return null;
  }
}

function rerunCompsForActiveRow() {
  var sheet = getTargetValuationsSheet();
  var row = activeFileRow_();

  if (row <= 1) return SpreadsheetApp.getUi().alert("Please select a valid data row (Row 2 or below) in the 'valuations' tab.");

  var rowValues = sheet.getRange(row, 1, 1, VALUATIONS_SUBJECT_COLS).getValues()[0];
  var stateZip = String(rowValues[1] || "").split("/");

  var payload = {
    state: stateZip[0] ? stateZip[0].trim() : "TX",
    zipCode: stateZip[1] ? stateZip[1].trim() : "77056",
    vin: String(rowValues[2] || "N/A"),
    year: rowValues[3],
    make: rowValues[4],
    model: rowValues[5],
    trim: rowValues[6],
    drivetrain: String(rowValues[7] || ""),
    mileage: rowValues[11]
  };

  SpreadsheetApp.getActiveSpreadsheet().toast("Re-running comps for Row " + row + " via live comps API...", "Working", 5);
  processValuationAndLog(payload, row);
  SpreadsheetApp.getUi().alert("Row " + row + " in 'valuations' tab updated successfully!");
}

function getTargetValuationsSheet() {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(VALUATIONS_TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(VALUATIONS_TAB_NAME);
  return sheet;
}

function formatOptionsForSheet(options) {
  if (!options || !options.length) return "None Detected";
  return options.map(function(o) {
    var price = (o.msrp !== null && o.msrp !== undefined) ? (" ($" + o.msrp.toLocaleString() + ")") : "";
    return o.code + ": " + o.name + price;
  }).join(" | ");
}

function writeToValuationsSheetColumns(targetRow, data) {
  var sheet = getTargetValuationsSheet();
  var row = targetRow || (sheet.getLastRow() + 1);

  var rowData = [
    data.date, data.stateZip, data.vin, data.year, data.make, data.model,
    data.trim, data.drivetrain,
    (data.subjectPackageCodes || []).join(", ") || "N/A",
    formatOptionsForSheet(data.subjectOptions),
    data.subjectMsrp ? ("$" + data.subjectMsrp.toLocaleString()) : "N/A (no VIN / not on file)",
    data.mileage,
    data.finalValue > 0 ? "$" + data.finalValue.toLocaleString() : "No Comps Found",
    data.compsCount, data.searchTierUsed,
    data.cpmRate ? ("$" + data.cpmRate.toFixed(2) + "/mi") : "N/A"
  ];

  for (var i = 0; i < VALUATIONS_MAX_COMPS; i++) {
    if (i < data.comps.length) {
      var c = data.comps[i];
      rowData.push(
        c.source || "Visor",
        c.title || "",
        c.price ? ("$" + c.price.toLocaleString()) : "",
        c.mileage || "",
        c.adjustedPrice ? ("$" + c.adjustedPrice.toLocaleString()) : "",
        c.distance || "",
        c.dealer || "",
        c.vin || "",
        c.url || "",
        c.msrp ? ("$" + c.msrp.toLocaleString()) : "N/A",
        (c.packageCodes || []).join(", ") || "N/A",
        formatOptionsForSheet(c.options),
        c.noAccidentsVerified ? "No Accidents Reported" : "Unverified"
      );
    } else {
      rowData.push("", "", "", "", "", "", "", "", "", "", "", "", "");
    }
  }

  sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
  sheet.getRange(row, VALUATIONS_TOTAL_COLS + 1).setValue(data.sessionId || "");
}

function setupAutomatedPaymentTrigger() {
  const ui = SpreadsheetApp.getUi();
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'checkStatusAndDeliver') ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger('checkStatusAndDeliver').timeBased().everyMinutes(5).create();
  ui.alert("⚡ Automated Payment Check Enabled!");
}

function showVehicleSidebar() {
  const html = HtmlService.createTemplateFromFile('Sidebar').evaluate().setTitle('🚗 Vehicle Control Panel').setWidth(760);
  SpreadsheetApp.getUi().showSidebar(html);
}

// =====================================================================
//  NEW MANUAL CLAIM FORM  (menu item "0. New Manual Entry")
//  One pop-up form for clients who call/text instead of using the website:
//  fills the row, assigns the Appraisal ID, and attaches a partner-shop code
//  (validated against the Referral Codes tab) so every invoice gets 15% off.
// =====================================================================
const MANUAL_CLAIM_TYPES = [
  ['Diminished Value (other driver\'s insurance, not at fault)', '3rd-Party Loss in Market Value (Diminished Value) Claim', '3rd Party'],
  ['Diminished Value - NO insurer (direct, $299, paid after completion)', DIRECT_DV_LABEL, ''],
  ['NC Diminished Value - Appraisal Clause (1st or 3rd party, $299)', NC_DV_AC_LABEL, ''],
  ['Total Loss Appraisal Clause (own insurance)',               'Insurance Total Loss ACV Dispute',                        '1st Party'],
  ['Other 1st-party appraisal clause dispute',                  '1st-Party Policy Appraisal Clause Dispute',               '1st Party'],
  ['Estate / Probate / Divorce (FMV)',                          'Estate / Probate / Tax / Divorce Fair Market Value (FMV)', ''],
  ['Bank & Collateral Loan',                                    'Bank & Collateral Loan Vehicle Appraisal',                ''],
  ['IRS Vehicle Donation',                                      'IRS Vehicle Donation Appraisal',                          '']
];

function showManualClaimForm() {
  const opts = MANUAL_CLAIM_TYPES.map((t, i) => '<option value="' + i + '">' + t[0].replace(/&/g, '&amp;') + '</option>').join('');
  const html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><base target="_top"><style>' +
    'body{font-family:Arial,sans-serif;font-size:13px;margin:14px;color:#222}h3{margin:0 0 10px}' +
    'label{display:block;font-weight:bold;margin:9px 0 3px;font-size:12px}' +
    'input,select{width:100%;padding:7px;box-sizing:border-box;border:1px solid #bbb;border-radius:4px;font-size:13px}' +
    '.row{display:flex;gap:8px}.row>div{flex:1}' +
    'button{padding:9px 14px;border:0;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px}' +
    '#save{background:#1c4587;color:#fff;margin-top:14px;width:100%}#chk{background:#e8eaed;margin-top:0;white-space:nowrap}' +
    '.promo{background:#fff7e0;border:1px solid #f0c36d;border-radius:6px;padding:9px;margin-top:12px}' +
    '#msg{margin-top:10px;font-weight:bold}.ok{color:#137333}.err{color:#c5221f}.hint{font-size:11px;color:#666;font-weight:normal}' +
    '</style></head><body><h3>➕ New Manual Claim</h3>' +
    '<label>Claim type *</label><select id="type">' + opts + '</select>' +
    '<div class="row"><div><label>Client name *</label><input id="name"></div><div><label>Phone</label><input id="phone" type="tel"></div></div>' +
    '<label>Email * <span class="hint">(invoices and the signing link go here)</span></label><input id="email" type="email">' +
    '<div class="row"><div><label>State</label><input id="state" maxlength="2" placeholder="NC"></div><div><label>Date of loss</label><input id="dol" placeholder="MM/DD/YYYY"></div></div>' +
    '<div class="row"><div><label>Year</label><input id="year"></div><div><label>Make</label><input id="make"></div><div><label>Model</label><input id="model"></div></div>' +
    '<div class="row"><div><label>Trim</label><input id="trim"></div><div><label>Mileage</label><input id="mileage"></div></div>' +
    '<label>VIN</label><input id="vin">' +
    '<div class="row"><div><label>Insurance carrier</label><input id="carrier"></div><div><label>Claim #</label><input id="claim"></div></div>' +
    '<div class="promo"><label style="margin-top:0">🤝 Partner shop code <span class="hint">(optional - 15% off every invoice)</span></label>' +
    '<div class="row"><div><input id="promo" style="text-transform:uppercase" placeholder="e.g. PRECISION"></div><div style="flex:0"><button id="chk" type="button" onclick="checkCode()">Check</button></div></div>' +
    '<div id="promoMsg" class="hint" style="margin-top:4px"></div></div>' +
    '<button id="save" type="button" onclick="save()">Add Claim to Sheet</button><div id="msg"></div>' +
    '<script>function fp(v){v=String(v==null?"":v);var ex="",hasX=false,m=v.match(/(?:ext\\.?|extension|x|#)\\s*(\\d*)\\s*$/i);if(m){hasX=true;ex=m[1];v=v.slice(0,m.index)}var d=v.replace(/\\D/g,"");if(d.length>10&&d.charAt(0)=="1")d=d.slice(1);if(d.length>10){if(!hasX){ex=d.slice(10);hasX=true}d=d.slice(0,10)}var o=d.length>6?d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6):d.length>3?d.slice(0,3)+"-"+d.slice(3):d;return hasX&&d.length===10?(ex?o+" ext. "+ex:o+" x"):o}document.getElementById("phone").addEventListener("input",function(){this.value=fp(this.value)});document.getElementById("mileage").addEventListener("input",function(){this.value=this.value.replace(/\\D/g,"").replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")});document.getElementById("vin").addEventListener("input",function(){this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,17)});' +
    '' +
    'function $(i){return document.getElementById(i)}' +
    'function checkCode(){var c=$("promo").value;if(!c.trim()){$("promoMsg").textContent="";return}$("promoMsg").textContent="Checking...";' +
    'google.script.run.withSuccessHandler(function(r){$("promoMsg").className="hint "+(r.valid?"ok":"err");$("promoMsg").textContent=r.valid?("✓ "+r.shopName+" - 15% off will be applied"):r.reason}).validateReferralCode(c)}' +
    'function save(){var d={typeIdx:$("type").value};["name","phone","email","state","dol","year","make","model","trim","mileage","vin","carrier","claim","promo"].forEach(function(k){d[k]=$(k).value.trim()});' +
    'if(!d.name||!d.email){$("msg").className="err";$("msg").textContent="Name and email are required.";return}' +
    '$("save").disabled=true;$("msg").className="";$("msg").textContent="Saving...";' +
    'google.script.run.withSuccessHandler(function(r){if(r.error){$("save").disabled=false;$("msg").className="err";$("msg").textContent=r.error;return}' +
    '$("msg").className="ok";$("msg").textContent="✓ Added as row "+r.row+" ("+r.appraisalId+")"+(r.shopName?" - "+r.shopName+" code applied":"");setTimeout(function(){google.script.host.close()},1400)})' +
    '.withFailureHandler(function(e){$("save").disabled=false;$("msg").className="err";$("msg").textContent=e.message}).addManualClaim(d)}' +
    '</script></body></html>'
  ).setWidth(520).setHeight(700);
  SpreadsheetApp.getUi().showModalDialog(html, 'New Manual Claim');
}

function addManualClaim(f) {
  const t = MANUAL_CLAIM_TYPES[parseInt(f.typeIdx, 10)];
  if (!t) return { error: 'Choose a claim type.' };
  if (!f.name || !f.email) return { error: 'Name and email are required.' };

  let shopName = '', promo = '';
  if (f.promo && isDirectDV_(t[1])) return { error: 'Shop codes do not apply to the Direct (no-insurer) Diminished Value appraisal - clear the shop code box.' };
  if (f.promo) {
    const v = validateReferralCode(f.promo);
    if (!v.valid) return { error: 'Shop code not applied: ' + v.reason + ' (fix it or clear the box).' };
    shopName = v.shopName; promo = String(f.promo).trim().toUpperCase();
  }

  const sheet = getMainSheet();
  const row = sheet.getLastRow() + 1;
  const now = new Date();
  const appraisalId = 'EC-' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy') + '-' + String(row).padStart(4, '0');
  const sessionId = Utilities.getUuid();

  const rowData = [
    f.name, f.phone || '', '', '', f.email, f.dol || '', '', f.carrier || '', t[2], f.claim || '', '', '', '',
    String(f.state || '').toUpperCase(), '', f.year || '', f.vin || '', f.make || '', f.model || '', f.trim || '', f.mileage || '', '', String(f.state || '').toUpperCase(), '', '',
    t[1], 'USPAP Compliant Appraisal',
    '', '', 'Manual Entry - New', appraisalId, '', ''
  ];
  sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
  sheet.getRange(row, 90).setValue('Manual Entry');
  sheet.getRange(row, 91).setValue(now).setNumberFormat('MM/dd/yyyy h:mm:ss AM/PM');
  sheet.getRange(row, 93).setValue(sessionId);

  if (promo) {
    const vehicle = [f.year, f.make, f.model].filter(Boolean).join(' ');
    logReferralRedemptionIfValid(promo, f.name, f.email, vehicle, sessionId, row);
  }

  sheet.setActiveSelection(sheet.getRange(row, 1));
  SpreadsheetApp.flush();
  return { row: row, appraisalId: appraisalId, shopName: shopName };
}

function createNewManualEntry() {
  const sheet = getMainSheet();
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  const yearStr = new Date().getFullYear();
  const appraisalId = "EC-" + yearStr + "-" + String(newRow).padStart(4, '0');
  const sessionId = Utilities.getUuid();

  sheet.getRange(newRow, 30).setValue("Manual Entry - New");
  sheet.getRange(newRow, 31).setValue(appraisalId);
  sheet.getRange(newRow, 93).setValue(sessionId);

  sheet.setActiveSelection(sheet.getRange(newRow, 1));
  SpreadsheetApp.flush();

  return { row: newRow, appraisalId: appraisalId };
}

const LOCK_HIGHLIGHT_COLOR = "#fef08a";
const LOCK_PROPERTY_KEY = "LOCKED_VEHICLE_CELLS";

function lockVehicleAcrossTabs() {
  unlockVehicleHighlight(true);

  const ss = getWorkingSpreadsheet();
  const mainSheet = getMainSheet();
  const mainRow = activeFileRow_();
  if (mainRow <= 1) {
    SpreadsheetApp.getUi().alert("Select a vehicle row on the main sheet first.");
    return;
  }

  const sessionId = String(mainSheet.getRange(mainRow, 93).getValue() || "");
  if (!sessionId) {
    SpreadsheetApp.getUi().alert("This row has no Session ID yet, so it can't be matched across tabs. (Web leads and rows created via 'New Manual Entry' get one automatically.)");
    return;
  }

  const lockedCells = [];
  const fullRowHighlight = function(sheet, row, numCols) {
    sheet.getRange(row, 1, 1, numCols).setBackground(LOCK_HIGHLIGHT_COLOR);
    lockedCells.push({ sheetName: sheet.getName(), row: row });
  };

  fullRowHighlight(mainSheet, mainRow, 93);
  mainSheet.setActiveSelection(mainSheet.getRange(mainRow, 1));

  let found = ["Sheet1 (row " + mainRow + ")"];

  const valSheet = getTargetValuationsSheet();
  if (valSheet) {
    const valRow = findRowBySessionId(valSheet, VALUATIONS_TOTAL_COLS + 1, sessionId, 2000);
    if (valRow) {
      fullRowHighlight(valSheet, valRow, VALUATIONS_TOTAL_COLS);
      valSheet.setActiveSelection(valSheet.getRange(valRow, 1));
      found.push("Valuations (row " + valRow + ")");
    }
  }

  const logSheet = ss.getSheetByName("Estimates_Log");
  if (logSheet) {
    const logRow = findRowBySessionId(logSheet, 15, sessionId, 2000);
    if (logRow) {
      fullRowHighlight(logSheet, logRow, 15);
      logSheet.setActiveSelection(logSheet.getRange(logRow, 1));
      found.push("Estimates_Log (row " + logRow + ")");
    }
  }

  PropertiesService.getScriptProperties().setProperty(LOCK_PROPERTY_KEY, JSON.stringify(lockedCells));

  mainSheet.activate();
  SpreadsheetApp.flush();

  const msg = found.length > 0
    ? "Selected the matching row in: " + found.join(", ") + ".\n\nSwitch tabs — the right row is already highlighted."
    : "Couldn't find a matching row in the other tabs yet (comps may not have run for this vehicle yet).";
  SpreadsheetApp.getUi().alert(msg);
}

function unlockVehicleHighlight(silent) {
  const ss = getWorkingSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  const stored = props.getProperty(LOCK_PROPERTY_KEY);

  if (!stored) {
    if (!silent) SpreadsheetApp.getUi().alert("Nothing is currently locked.");
    return;
  }

  let lockedCells;
  try {
    lockedCells = JSON.parse(stored);
  } catch (e) {
    props.deleteProperty(LOCK_PROPERTY_KEY);
    return;
  }

  lockedCells.forEach(function(cell) {
    const sheet = ss.getSheetByName(cell.sheetName);
    if (!sheet) return;
    const numCols = sheet.getName() === "Estimates_Log" ? 15
      : sheet.getName() === getMainSheet().getName() ? 93
      : VALUATIONS_TOTAL_COLS;
    sheet.getRange(cell.row, 1, 1, numCols).setBackground(null);
  });

  props.deleteProperty(LOCK_PROPERTY_KEY);

  if (!silent) SpreadsheetApp.getUi().alert("Unlocked — highlight cleared.");
}

const FOLLOW_UP_HIGHLIGHT_COLOR = "#fecaca";
const FOLLOW_UP_PROPERTY_KEY = "FOLLOW_UP_HIGHLIGHTED_CELLS";

function syncFollowUpHighlightsAcrossTabs() {
  const ss = getWorkingSpreadsheet();
  const props = PropertiesService.getScriptProperties();

  const stored = props.getProperty(FOLLOW_UP_PROPERTY_KEY);
  if (stored) {
    try {
      const previousCells = JSON.parse(stored);
      previousCells.forEach(function(cell) {
        const sheet = ss.getSheetByName(cell.sheetName);
        if (!sheet) return;
        const numCols = cell.sheetName === "Estimates_Log" ? 15 : VALUATIONS_TOTAL_COLS + 1;
        sheet.getRange(cell.row, 1, 1, numCols).setBackground(null);
      });    } catch (e) {
    }
  }

  const mainSheet = getMainSheet();
  const lastRow = mainSheet.getLastRow();
  const newlyHighlighted = [];

  if (lastRow >= 2) {
    const data = mainSheet.getRange(2, 1, lastRow - 1, 95).getValues();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const valSheet = getTargetValuationsSheet();
    const logSheet = ss.getSheetByName("Estimates_Log");

    for (let i = 0; i < data.length; i++) {
      const followUpDate = data[i][94];
      const sessionId = data[i][92];
      if (!(followUpDate instanceof Date) || !sessionId) continue;

      const fd = new Date(followUpDate);
      fd.setHours(0, 0, 0, 0);
      if (fd > today) continue;

      if (valSheet) {
        const valRow = findRowBySessionId(valSheet, VALUATIONS_TOTAL_COLS + 1, sessionId, 2000);
        if (valRow) {
          valSheet.getRange(valRow, 1, 1, VALUATIONS_TOTAL_COLS + 1).setBackground(FOLLOW_UP_HIGHLIGHT_COLOR);
          newlyHighlighted.push({ sheetName: VALUATIONS_TAB_NAME, row: valRow });
        }
      }
      if (logSheet) {
        const logRow = findRowBySessionId(logSheet, 15, sessionId, 500);
        if (logRow) {
          logSheet.getRange(logRow, 1, 1, 15).setBackground(FOLLOW_UP_HIGHLIGHT_COLOR);
          newlyHighlighted.push({ sheetName: "Estimates_Log", row: logRow });
        }
      }
    }
  }

  props.setProperty(FOLLOW_UP_PROPERTY_KEY, JSON.stringify(newlyHighlighted));
}

function jumpToVehicleInAllTabs() {
  const ss = getWorkingSpreadsheet();
  const mainSheet = getMainSheet();
  const mainRow = activeFileRow_();
  if (mainRow <= 1) {
    SpreadsheetApp.getUi().alert("Select a vehicle row on the main sheet first.");
    return;
  }

  const sessionId = String(mainSheet.getRange(mainRow, 93).getValue() || "");
  if (!sessionId) {
    SpreadsheetApp.getUi().alert("This row has no Session ID yet, so it can't be matched across tabs. (Web leads and rows created via 'New Manual Entry' get one automatically.)");
    return;
  }

  let found = [];

  const valSheet = getTargetValuationsSheet();
  if (valSheet) {
    const valRow = findRowBySessionId(valSheet, VALUATIONS_TOTAL_COLS + 1, sessionId, 2000);
    if (valRow) {
      valSheet.setActiveSelection(valSheet.getRange(valRow, 1));
      found.push("Valuations (row " + valRow + ")");
    }
  }

  const logSheet = ss.getSheetByName("Estimates_Log");
  if (logSheet) {
    const logRow = findRowBySessionId(logSheet, 15, sessionId, 2000);
    if (logRow) {
      logSheet.setActiveSelection(logSheet.getRange(logRow, 1));
      found.push("Estimates_Log (row " + logRow + ")");
    }
  }

  mainSheet.activate();
  SpreadsheetApp.flush();

  const msg = found.length > 0
    ? "Selected the matching row in: " + found.join(", ") + ".\n\nSwitch tabs — the right row is already highlighted."
    : "Couldn't find a matching row in the other tabs yet (comps may not have run for this vehicle yet).";
  SpreadsheetApp.getUi().alert(msg);
}

function calculateAppraisalMetrics(data) {
  const clientMiles = toNum(data.mileage);
  const ratePerMile = toNum(data.ratePerMile);

  const nada = toNum(data.nadaVal);
  const kbb = toNum(data.kbbVal);
  let preTradeCount = 0;
  if (nada > 0) preTradeCount++;
  if (kbb > 0) preTradeCount++;
  const preAccidentTradeAvg = preTradeCount > 0 ? (Math.max(nada, 0) + Math.max(kbb, 0)) / preTradeCount : 0;

  const carmaxOffer = toNum(data.carmaxOffer);
  const carvanaOffer = toNum(data.carvanaOffer);
  const dealer3Offer = toNum(data.dealer3Offer);
  let postOfferCount = 0;
  let postOfferSum = 0;
  [carmaxOffer, carvanaOffer, dealer3Offer].forEach(v => { if (v > 0) { postOfferCount++; postOfferSum += v; } });
  const postAccidentTradeAvg = postOfferCount > 0 ? postOfferSum / postOfferCount : 0;

  // Only meaningful when BOTH sides have values — otherwise a missing
  // post-accident offer would read as a 100% loss.
  const hasTradeData = preAccidentTradeAvg > 0 && postAccidentTradeAvg > 0;
  const tradeDiff = hasTradeData ? preAccidentTradeAvg - postAccidentTradeAvg : 0;
  const pctLoss = hasTradeData ? (tradeDiff / preAccidentTradeAvg) : 0;

  const c1 = buildCompMath(1, data.comp1Price, data.comp1Miles, clientMiles, ratePerMile, data.comp1OptAdj, data.comp1OptNotes);
  const c2 = buildCompMath(2, data.comp2Price, data.comp2Miles, clientMiles, ratePerMile, data.comp2OptAdj, data.comp2OptNotes);
  const c3 = buildCompMath(3, data.comp3Price, data.comp3Miles, clientMiles, ratePerMile, data.comp3OptAdj, data.comp3OptNotes);

  let compCount = 0;
  let compSum = 0;
  [c1, c2, c3].forEach(c => { if (c.val > 0) { compCount++; compSum += c.val; } });
  const fmvTodayAvg = compCount > 0 ? compSum / compCount : 0;

  let feeCount = 0;
  let feeSum = 0;
  [toNum(data.comp1Fee), toNum(data.comp2Fee), toNum(data.comp3Fee)].forEach(v => { if (v > 0) { feeCount++; feeSum += v; } });
  const avgDealerFee = feeCount > 0 ? feeSum / feeCount : 0;

  const rawGurusPct = String(data.carGurusPct === undefined || data.carGurusPct === null ? '' : data.carGurusPct).trim();
  const carGurusDate = String(data.carGurusDate || '').trim();
  const carGurusPct = toNum(rawGurusPct);
  const hasHistoricalData = (carGurusDate !== '' || carGurusPct !== 0);

  const historicalFMV = hasHistoricalData ? fmvTodayAvg * (1 + (carGurusPct / 100)) : fmvTodayAvg;
  // Options on the appraised vehicle (+ adds value, − deducts) flow straight into the FMV / ACV.
  const subjectOptAdj = toNum(data.subjectOptAdj);
  const subjectOptNotes = String(data.subjectOptNotes || '').trim();
  const subjectOptText = subjectOptAdj !== 0
    ? 'Options adjustment for the appraised vehicle: ' + (subjectOptAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(subjectOptAdj)) + (subjectOptNotes ? ' — ' + subjectOptNotes : '') + '.'
    : '';
  const baseFMVBeforeOptions = hasHistoricalData ? historicalFMV : fmvTodayAvg;
  const baseFMV = baseFMVBeforeOptions + subjectOptAdj;

  const rawDV = pctLoss * baseFMV;
  const priorDamageDeduct = toNum(data.priorDamageDeduct);
  const finalInherentDV = Math.max(0, rawDV - priorDamageDeduct);
  const postRepairFMV = Math.max(0, baseFMV - finalInherentDV);

  const salesTaxPct = toNum(data.salesTaxPct);
  const salesTaxVal = baseFMV * (salesTaxPct / 100);
  const tagTitleVal = toNum(data.tagTitleFee);

  const finalTotalLossACV = baseFMV + avgDealerFee + salesTaxVal + tagTitleVal;

  return {
    preAccidentTradeAvg, postAccidentTradeAvg, tradeDiff, pctLoss: pctLoss * 100,
    c1Diff: c1.diff, c1Adj: c1.adj, c1Val: c1.val, c1Math: c1.text, c1DiffText: c1.diffText,
    c2Diff: c2.diff, c2Adj: c2.adj, c2Val: c2.val, c2Math: c2.text, c2DiffText: c2.diffText,
    c3Diff: c3.diff, c3Adj: c3.adj, c3Val: c3.val, c3Math: c3.text, c3DiffText: c3.diffText,
    c1OptAdj: c1.optAdj, c1OptText: c1.optText, c2OptAdj: c2.optAdj, c2OptText: c2.optText, c3OptAdj: c3.optAdj, c3OptText: c3.optText,
    subjectOptAdj, subjectOptText, baseFMVBeforeOptions,
    fmvTodayAvg, avgDealerFee, hasHistoricalData, carGurusPct, historicalFMV, baseFMV, rawDV,
    priorDamageDeduct, finalInherentDV, postRepairFMV, salesTaxVal, tagTitleVal, finalTotalLossACV
  };
}

function getActiveRowData() {
  const sheet = getMainSheet();
  const row = activeFileRow_();
  if (row <= 1) return null;

  ensureMainWidth_(sheet);
  const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];

  function fmt(val) {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return Utilities.formatDate(val, Session.getScriptTimeZone(), "MM/dd/yyyy");
    return String(val).trim();
  }

  let appraisalId = fmt(r[30]);
  // Older rows had "Signed via Website" / "Sent via Web Link" written over the ID.
  if (!appraisalId || /signed via website|sent via web link/i.test(appraisalId)) {
    const yearStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy");
    appraisalId = `EC-${yearStr}-${String(row).padStart(4, '0')}`;
    sheet.getRange(row, 31).setValue(appraisalId);
  }

  return {
    row: row, name: fmt(r[0]), phone: fmt(r[1]), address: fmt(r[2]), mailingAddress: fmt(r[3]), email: fmt(r[4]), dateOfLoss: fmt(r[5]), dateRepaired: fmt(r[6]), carrier: fmt(r[7]), partyType: fmt(r[8]), claim: fmt(r[9]), adjName: fmt(r[10]), adjPhone: fmt(r[11]), adjEmail: fmt(r[12]), lossState: fmt(r[13]), atFaultDriver: fmt(r[14]), year: fmt(r[15]), vin: fmt(r[16]), make: fmt(r[17]), model: fmt(r[18]), trim: fmt(r[19]), mileage: fmt(r[20]), plate: fmt(r[21]), regState: fmt(r[22]), color: fmt(r[23]), titleBranding: fmt(r[24]), intendedUse: fmt(r[25]), uspapType: fmt(r[26]), folderUrl: fmt(r[27]), docUrl: fmt(r[28]), status: fmt(r[29]), appraisalId: appraisalId, waveInvId: fmt(r[31]), offerAmount: fmt(r[32]), finalSignId: fmt(r[33]), finalWaveInvoiceId: fmt(r[34]), damagePhoto1Url: fmt(r[35]), compPhoto1Url: fmt(r[36]), titleBrandNotes: fmt(r[37]), naaaGrade: fmt(r[38]), conditionNotes: fmt(r[39]), historyNotes: fmt(r[40]), finalRepairBill: fmt(r[41]), repairCategories: fmt(r[42]), repairNotes: fmt(r[43]), nadaVal: fmt(r[44]), nadaDate: fmt(r[45]), nadaDef: fmt(r[46]), nadaNotes: fmt(r[47]), kbbVal: fmt(r[48]), kbbDate: fmt(r[49]), kbbDef: fmt(r[50]), kbbNotes: fmt(r[51]), tradeInCompNotes: fmt(r[52]), carmaxOffer: fmt(r[53]), carmaxDate: fmt(r[54]), carvanaOffer: fmt(r[55]), carvanaDate: fmt(r[56]), dealer3Name: fmt(r[57]), dealer3Offer: fmt(r[58]), dealer3Date: fmt(r[59]), tradeValNotes: fmt(r[60]), ratePerMile: fmt(r[61]), comp1Price: fmt(r[62]), comp1Dealer: fmt(r[63]), comp1Date: fmt(r[64]), comp1Miles: fmt(r[65]), comp1Fee: fmt(r[66]), comp1Notes: fmt(r[67]), comp2Price: fmt(r[68]), comp2Dealer: fmt(r[69]), comp2Date: fmt(r[70]), comp2Miles: fmt(r[71]), comp2Fee: fmt(r[72]), comp2Notes: fmt(r[73]), comp3Price: fmt(r[74]), comp3Dealer: fmt(r[75]), comp3Date: fmt(r[76]), comp3Miles: fmt(r[77]), comp3Fee: fmt(r[78]), comp3Notes: fmt(r[79]), fmvCompNotes: fmt(r[80]), carGurusDate: fmt(r[81]), carGurusPct: fmt(r[82]), historicalNotes: fmt(r[83]), priorDamageDeduct: fmt(r[84]), valuationNotes: fmt(r[85]), salesTaxPct: fmt(r[86]), tagTitleFee: fmt(r[87]), webLeadStatus: fmt(r[88]), webSubmissionMethod: fmt(r[89]), webSubmissionDate: fmt(r[90]), estimatedPayoutRange: fmt(r[91]), sessionId: fmt(r[92]), progressLog: fmt(r[93]), followUpDate: (r[94] instanceof Date ? Utilities.formatDate(r[94], Session.getScriptTimeZone(), "yyyy-MM-dd") : ''), authSignStatus: fmt(r[95]), calcFinalDV: toNum(r[96]), calcFinalACV: toNum(r[97]), awardAcv: fmt(r[98]), carrierAppraiserName: fmt(r[99]), carrierAppraiserCompany: fmt(r[100]),
    comp1OptAdj: fmt(r[101]), comp1OptNotes: fmt(r[102]), comp2OptAdj: fmt(r[103]), comp2OptNotes: fmt(r[104]), comp3OptAdj: fmt(r[105]), comp3OptNotes: fmt(r[106]), subjectOptAdj: fmt(r[107]), subjectOptNotes: fmt(r[108]),
    dealer1Name: fmt(r[109]), dealer2Name: fmt(r[110]),
    carrierAddress: fmt(r[111]), carrierAppraiserEmail: fmt(r[113]), lastWeeklySent: fmt(r[114]), followUpWhy: fmt(r[COL_FU_REASON - 1]), comp1OptLines: fmt(r[120]), comp2OptLines: fmt(r[121]), comp3OptLines: fmt(r[122]), subjectOptLines: fmt(r[123]), extraEmails: fmt(r[124])
  };
}

function saveSidebarData(data) {
  const sheet = getMainSheet();
  const row = parseInt(data && data.row, 10);
  if (!row || row <= 1) {
    throw new Error("No client row is loaded in the sidebar. Click the client's row in Sheet1, press 🔄 Reload Active Row, then Save again.");
  }

  // Sheet column (1-based) for every field the sidebar edits.
  const FIELD_COLS = {
    name: 1, phone: 2, address: 3, mailingAddress: 4, email: 5, dateOfLoss: 6, dateRepaired: 7, carrier: 8,
    partyType: 9, claim: 10, adjName: 11, adjPhone: 12, adjEmail: 13, lossState: 14, atFaultDriver: 15,
    year: 16, vin: 17, make: 18, model: 19, trim: 20, mileage: 21, plate: 22, regState: 23, color: 24,
    titleBranding: 25, intendedUse: 26, uspapType: 27, appraisalId: 31, offerAmount: 33,
    titleBrandNotes: 38, naaaGrade: 39, conditionNotes: 40, historyNotes: 41, finalRepairBill: 42,
    repairCategories: 43, repairNotes: 44, nadaVal: 45, nadaDate: 46, nadaDef: 47, nadaNotes: 48,
    kbbVal: 49, kbbDate: 50, kbbDef: 51, kbbNotes: 52, tradeInCompNotes: 53, carmaxOffer: 54,
    carmaxDate: 55, carvanaOffer: 56, carvanaDate: 57, dealer3Name: 58, dealer3Offer: 59, dealer3Date: 60,
    tradeValNotes: 61, ratePerMile: 62,
    comp1Price: 63, comp1Dealer: 64, comp1Date: 65, comp1Miles: 66, comp1Fee: 67, comp1Notes: 68,
    comp2Price: 69, comp2Dealer: 70, comp2Date: 71, comp2Miles: 72, comp2Fee: 73, comp2Notes: 74,
    comp3Price: 75, comp3Dealer: 76, comp3Date: 77, comp3Miles: 78, comp3Fee: 79, comp3Notes: 80,
    fmvCompNotes: 81, carGurusDate: 82, carGurusPct: 83, historicalNotes: 84, priorDamageDeduct: 85,
    valuationNotes: 86, salesTaxPct: 87, tagTitleFee: 88, progressLog: 94,
    awardAcv: COL_AWARD_ACV, carrierAppraiserName: COL_CARRIER_APPRAISER, carrierAppraiserCompany: COL_CARRIER_APPRAISER_CO,
    comp1OptAdj: COL_COMP1_OPT_ADJ, comp1OptNotes: COL_COMP1_OPT_NOTES, comp2OptAdj: COL_COMP2_OPT_ADJ, comp2OptNotes: COL_COMP2_OPT_NOTES,
    comp3OptAdj: COL_COMP3_OPT_ADJ, comp3OptNotes: COL_COMP3_OPT_NOTES, subjectOptAdj: COL_SUBJ_OPT_ADJ, subjectOptNotes: COL_SUBJ_OPT_NOTES,
    dealer1Name: COL_DEALER1_NAME, dealer2Name: COL_DEALER2_NAME,
    carrierAddress: COL_CARRIER_ADDR, carrierAppraiserEmail: COL_CARRIER_APPRAISER_EMAIL, followUpWhy: COL_FU_REASON,
    comp1OptLines: 121, comp2OptLines: 122, comp3OptLines: 123, subjectOptLines: 124, extraEmails: 125
  };
  // Stored as real numbers (commas / $ stripped) so the math always works.
  const NUMERIC = ['mileage', 'finalRepairBill', 'nadaVal', 'kbbVal', 'carmaxOffer', 'carvanaOffer', 'dealer3Offer',
    'ratePerMile', 'comp1Price', 'comp1Miles', 'comp1Fee', 'comp2Price', 'comp2Miles', 'comp2Fee',
    'comp3Price', 'comp3Miles', 'comp3Fee', 'carGurusPct', 'priorDamageDeduct', 'salesTaxPct', 'tagTitleFee', 'offerAmount', 'awardAcv',
    'comp1OptAdj', 'comp2OptAdj', 'comp3OptAdj', 'subjectOptAdj'];

  ensureMainWidth_(sheet);
  const lock = LockService.getDocumentLock();
  lock.waitLock(20000);
  try {
    const values = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];

    Object.keys(FIELD_COLS).forEach(key => {
      // Fields the sidebar doesn't send are left exactly as they are
      // (previously they were blanked — e.g. USPAP Report Type).
      if (data[key] === undefined || data[key] === null) return;
      let v = data[key];
      if (NUMERIC.indexOf(key) !== -1) v = String(v).trim() === '' ? '' : toNum(v);
      else v = String(v);
      if (key === 'appraisalId' && !v) return; // never blank the Appraisal ID
      values[FIELD_COLS[key] - 1] = v;
    });

    if (data.followUpDate !== undefined) {
      if (data.followUpDate) {
        const p = String(data.followUpDate).split('-');
        values[94] = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
      } else {
        values[94] = '';
      }
    }

    const math = calculateAppraisalMetrics(rowValuesToMathInput(values));
    values[COL_CALC_FINAL_DV - 1] = Math.round(math.finalInherentDV * 100) / 100;
    values[COL_CALC_FINAL_ACV - 1] = Math.round(math.finalTotalLossACV * 100) / 100;

    // One write per block of editable columns (instead of ~90 separate
    // writes), never touching the automation-managed columns in between.
    [[1, 27], [31, 31], [33, 33], [38, 88], [94, 95], [COL_CALC_FINAL_DV, COL_CALC_FINAL_ACV], [COL_AWARD_ACV, COL_CARRIER_APPRAISER_CO], [COL_COMP1_OPT_ADJ, COL_CARRIER_ADDR], [COL_CARRIER_APPRAISER_EMAIL, COL_CARRIER_APPRAISER_EMAIL], [COL_FU_REASON, 125]].forEach(block => {
      const from = block[0], to = block[1];
      sheet.getRange(row, from, 1, to - from + 1).setValues([values.slice(from - 1, to)]);
    });
    SpreadsheetApp.flush();
    try { if (String(values[16] || '').trim()) decodeVinFill_(row); } catch (e) {}

    return {
      row: row,
      savedAt: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "h:mm a"),
      finalDV: math.finalInherentDV,
      finalACV: math.finalTotalLossACV
    };
  } finally {
    lock.releaseLock();
  }
}

function uploadSidebarPhoto(fileData) {
  const sheet = getMainSheet();
  const row = parseInt(fileData.row, 10);
  if (row <= 1) return { success: false, message: 'Invalid row.' };

  const folderUrl = sheet.getRange(row, 28).getValue();
  if (!folderUrl) return { success: false, message: 'Please create client folder first (Step 1).' };

  const folderIdMatch = String(folderUrl).match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!folderIdMatch) return { success: false, message: 'Invalid folder URL in Column AB.' };

  const clientFolder = DriveApp.getFolderById(folderIdMatch[1]);
  
  let photosFolder;
  const photoFolders = clientFolder.getFoldersByName("Photos");
  if (photoFolders.hasNext()) photosFolder = photoFolders.next();
  else photosFolder = clientFolder.createFolder("Photos");

  const base64Clean = fileData.base64.split(',')[1] || fileData.base64;
  const imageBytes = Utilities.base64Decode(base64Clean);
  const blob = Utilities.newBlob(imageBytes, fileData.mimeType, fileData.fileName);
  const savedFile = photosFolder.createFile(blob);
  savedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileUrl = savedFile.getUrl();

  if (fileData.photoType === 'damage1') sheet.getRange(row, 36).setValue(fileUrl);
  else if (fileData.photoType === 'comp1') sheet.getRange(row, 37).setValue(fileUrl);

  return { success: true, url: fileUrl, fileId: savedFile.getId() };
}

function doGet(e) {
  // ============================================================
  // 🚗 APPRAISAL CUSTOMER PORTAL — email lookup / login endpoint.
  // Checked first via a distinct param name (portalEmailCheck) so it
  // can never collide with the row/type e-signing flow, or the
  // action=getVehicleData / action=getIntakeFormData endpoints below.
  // ============================================================
  if (e.parameter.portalEmailCheck) {
    return portalEmailLookup(e.parameter);
  }

  // 🤝 Live referral code check — called as the customer types a code into
  // the intake form, so they see a checkmark/error before submitting.
  if (e.parameter.checkPromoCode) {
    var codeResult = validateReferralCode(e.parameter.checkPromoCode);
    return ContentService.createTextOutput(JSON.stringify(codeResult)).setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter.action === 'getVehicleData') {
    return getVehicleDataForOfferAutomation(e.parameter.row, e.parameter.token);
  }

  if (e.parameter.action === 'getIntakeFormData') {
    return getIntakeFormData(e.parameter.sid);
  }

  if (String(e.parameter.type || '').toLowerCase().trim() === 'proceed' && e.parameter.row) {
    return proceedConfirmPage_(e.parameter.row, e.parameter.t);
  }
  if (String(e.parameter.type || '').toLowerCase().trim() === 'weekly' && e.parameter.row) return weeklyApprovalPage_(e.parameter.t);
  if (String(e.parameter.type || '').toLowerCase().trim() === 'prospects' && e.parameter.row) return prospectApprovalPage_(e.parameter.t);
  if (String(e.parameter.type || '').toLowerCase().trim() === 'awardsign' && e.parameter.row) return awardSignPage_(e.parameter.row, e.parameter.t);
  if (/^do_/.test(String(e.parameter.type || '').toLowerCase().trim()) && e.parameter.row) return approvalPage_(e.parameter.row, e.parameter.t, String(e.parameter.type).toLowerCase().trim().substring(3));
  if (String(e.parameter.type || '').toLowerCase().trim() === 'approve' && e.parameter.row) return approveDemandPage_(e.parameter.row, e.parameter.t);
  if (String(e.parameter.type || '').toLowerCase().trim() === 'certified' && e.parameter.row) return certifiedMailPage_(e.parameter.row, e.parameter.t);

  const row = e.parameter.row;
  const docType = String(e.parameter.type || 'auth').toLowerCase().trim(); 

  if (!row) return HtmlService.createHtmlOutput("Invalid request link: Missing claim row parameter.");

  const sheet = getMainSheet();
  const targetRow = parseInt(row, 10);
  const rowData = sheet.getRange(targetRow, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  
  const isAuthSigned = (rowData[COL_AUTH_SIGN_STATUS - 1] === "Signed via Website" || rowData[30] === "Signed via Website");
  const isOfferSigned = (rowData[33] === "Signed via Website");

  if ((docType === 'auth' && isAuthSigned) || (docType === 'offer' && isOfferSigned)) {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background-color:#f4f6f9;display:flex;justify-content:center;align-items:flex-start;padding-top:50px;margin:0;}.card{background:white;padding:40px 20px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.06);text-align:center;max-width:90%;width:500px;}h2{color:#1c4587;margin-top:15px;margin-bottom:10px;font-size:22px;}p{color:#555;line-height:1.5;font-size:15px;margin:0;}.icon{font-size:55px;}</style></head><body><div class="card"><div class="icon">✅</div><h2>Already Signed</h2><p>This document has already been securely signed. A completed PDF copy was emailed to you for your records.</p></div></body></html>
    `).setTitle('Already Signed').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const clientName = String(rowData[0] || '').trim();
  const folderUrl = String(rowData[27] || '').trim();
  const rawDocUrls = rowData[28] ? String(rowData[28]).split(/\r?\n/) : [];

  let docId = '';

  if (docType === 'auth' && rawDocUrls.length > 0) {
    const match = rawDocUrls[0].match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) docId = match[1];
  } else if (docType === 'offer' && folderUrl) {
    const folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
    if (folderIdMatch) {
      const folderId = folderIdMatch[1];
      const completedFoldersIter = DriveApp.getFolderById(folderId).getFoldersByName("Completed");
      if (completedFoldersIter.hasNext()) {
        const completedFolder = completedFoldersIter.next();
        const offerDocs = completedFolder.searchFiles("mimeType = 'application/vnd.google-apps.document' and (title contains 'Offer' or title contains 'Doc 7')");
        if (offerDocs.hasNext()) docId = offerDocs.next().getId();
      }
    }
  }

  let docPreviewUrl = '';
  if (docId) {
    try {
      const file = DriveApp.getFileById(docId);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      docPreviewUrl = `https://docs.google.com/document/d/${docId}/preview?rm=minimal`;
    } catch (err) {
      Logger.log("Sharing error: " + err);
    }
  }

  const template = HtmlService.createTemplateFromFile('Index');
  template.row = targetRow;
  template.docType = docType;
  template.clientName = clientName;
  template.docPreviewUrl = docPreviewUrl;

  return template.evaluate().setTitle('Estimate Consultants - Sign Document').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getIntakeFormData(sessionId) {
  var output;
  try {
    if (!sessionId) {
      output = { error: "Missing reference ID." };
    } else {
      var mainSheet = getMainSheet();
      var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);
      if (!mainRow) {
        output = { error: "We couldn't find your original submission. Please contact us directly at kevin@estimateconsultants.com." };
      } else {
        var r = mainSheet.getRange(mainRow, 1, 1, 26).getValues()[0];
        function fmt(val) {
          if (val === null || val === undefined) return '';
          if (val instanceof Date) return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
          return String(val).trim();
        }
        output = {
          clientName: fmt(r[0]),
          claimType: fmt(r[25]),
          year: fmt(r[15]), make: fmt(r[17]), model: fmt(r[18]), trim: fmt(r[19]),
          vin: fmt(r[16]), mileage: fmt(r[20]),
          state: fmt(r[13]), plate: fmt(r[21]), titleStatus: fmt(r[24]),
          address: fmt(r[2]), mailingAddress: fmt(r[3]),
          insuranceCompany: fmt(r[7]), adjusterName: fmt(r[10]), adjusterPhone: fmt(r[11]),
          adjusterEmail: fmt(r[12]), claimNumber: fmt(r[9]), atFaultDriver: fmt(r[14]),
          dateOfLossOrPassing: fmt(r[5]), vehicleRepairedDate: fmt(r[6])
        };
      }
    }
  } catch (err) {
    output = { error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function getVehicleDataForOfferAutomation(row, token) {
  var output;
  try {
    var expectedToken = PropertiesService.getScriptProperties().getProperty('OFFER_AUTOMATION_TOKEN');
    if (!expectedToken || token !== expectedToken) {
      output = { error: "Unauthorized" };
    } else {
      var targetRow = parseInt(row, 10);
      if (!targetRow || targetRow <= 1) {
        output = { error: "Invalid row number" };
      } else {
        var sheet = getTargetValuationsSheet();
        var r = sheet.getRange(targetRow, 1, 1, VALUATIONS_TOTAL_COLS + 1).getValues()[0];
        var stateZip = String(r[1] || "").split("/");
        var sessionId = String(r[VALUATIONS_TOTAL_COLS] || "");

        var comps = [];
        for (var i = 0; i < VALUATIONS_MAX_COMPS; i++) {
          var startIdx = VALUATIONS_SUBJECT_COLS + (i * VALUATIONS_COLS_PER_COMP);
          var title = String(r[startIdx + 1] || "");
          if (title) {
            comps.push({
              source: String(r[startIdx] || ""), title: title,
              price: String(r[startIdx + 2] || ""), mileage: String(r[startIdx + 3] || ""),
              adjPrice: String(r[startIdx + 4] || ""), distance: String(r[startIdx + 5] || ""),
              dealer: String(r[startIdx + 6] || "")
            });
          }
        }

        var folderUrl = "";
        var clientFolderName = "";
        var intendedUseFolderName = "";
        if (sessionId) {
          var mainSheet = getMainSheet();
          var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);
          if (mainRow) {
            folderUrl = String(mainSheet.getRange(mainRow, 28).getValue() || "");
            var folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
            if (folderIdMatch) {
              try {
                var clientFolder = DriveApp.getFolderById(folderIdMatch[1]);
                clientFolderName = clientFolder.getName();
                var parents = clientFolder.getParents();
                if (parents.hasNext()) intendedUseFolderName = parents.next().getName();
              } catch (folderErr) {
                console.error("Could not resolve folder names: " + folderErr);
              }
            }
          }
        }

        output = {
          vin: String(r[2] || ""),
          year: String(r[3] || ""),
          make: String(r[4] || ""),
          model: String(r[5] || ""),
          trim: String(r[6] || ""),
          drivetrain: String(r[7] || ""),
          mileage: String(r[11] || ""),
          state: stateZip[0] ? stateZip[0].trim() : "",
          zip: stateZip[1] ? stateZip[1].trim() : "",
          folderUrl: folderUrl,
          clientFolderName: clientFolderName,
          intendedUseFolderName: intendedUseFolderName,
          mainFolderName: MAIN_FOLDER_NAME,
          comps: comps
        };
      }
    }
  } catch (err) {
    output = { error: String(err) };
  }

  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}

function generateIntakeFormLink() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getMainSheet();
  var row = activeFileRow_();
  if (row <= 1) return ui.alert("Select a client row first.");

  var sessionId = String(sheet.getRange(row, 93).getValue() || "").trim();
  if (!sessionId) {
    sessionId = Utilities.getUuid();
    sheet.getRange(row, 93).setValue(sessionId);
  }

  var link = WEBSITE_BASE_URL + "/intake-form.html?sid=" + encodeURIComponent(sessionId);
  ui.alert("Intake form link for this client:\n\n" + link + "\n\nCopy this into an email to send it.");
}

function setCarMaxCarvanaEdmundsAccessKey() {
  var ui = SpreadsheetApp.getUi();
  var existing = PropertiesService.getScriptProperties().getProperty('OFFER_AUTOMATION_TOKEN');
  var promptText = existing
    ? "An access key is already set. Enter a new one to replace it (any random string — you'll paste this same value into offer_automation.py as OFFER_AUTOMATION_TOKEN). This key is what lets the CarMax/Carvana/Edmunds automation script pull vehicle data from this sheet."
    : "Enter a secret access key (any random string — you'll paste this same value into offer_automation.py as OFFER_AUTOMATION_TOKEN). This key is what lets the CarMax/Carvana/Edmunds automation script pull vehicle data from this sheet.";
  var res = ui.prompt("Set CarMax/Carvana/Edmunds Access Key", promptText, ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var token = res.getResponseText().trim();
  if (!token) return ui.alert("Token cannot be empty.");
  PropertiesService.getScriptProperties().setProperty('OFFER_AUTOMATION_TOKEN', token);
  ui.alert("✅ Access key saved. Paste this exact value into OFFER_AUTOMATION_TOKEN in offer_automation.py, then redeploy the web app (Deploy → Manage deployments → Edit → New version) if you haven't already.");
}

function setVehiclesDevApiKey() {
  var ui = SpreadsheetApp.getUi();
  var existing = PropertiesService.getScriptProperties().getProperty('VEHICLES_DEV_API_KEY');
  var promptText = existing
    ? "A vehicles.dev API key is already set. Enter a new one to replace it."
    : "Enter your vehicles.dev API key (starts with 'vdev_'). Get a free one at vehicles.dev — no card required, 1,000 calls/month included on the free Starter plan.";
  var res = ui.prompt("Set Vehicles.dev API Key", promptText, ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var key = res.getResponseText().trim();
  if (!key) return ui.alert("Key cannot be empty.");
  PropertiesService.getScriptProperties().setProperty('VEHICLES_DEV_API_KEY', key);
  ui.alert("✅ Vehicles.dev API key saved.");
}

function populateTaxAndFeesForActiveRow() {
  var ui = SpreadsheetApp.getUi();
  var apiKey = PropertiesService.getScriptProperties().getProperty('VEHICLES_DEV_API_KEY');

  var sheet = getMainSheet();
  var row = activeFileRow_();
  if (row <= 1) return ui.alert("Select a client row first.");

  var zip = "";
  var state = "";
  var sessionId = String(sheet.getRange(row, 93).getValue() || "");
  if (sessionId) {
    var valSheet = getTargetValuationsSheet();
    if (valSheet) {
      var valRow = findRowBySessionId(valSheet, VALUATIONS_TOTAL_COLS + 1, sessionId, 2000);
      if (valRow) {
        var stateZipRaw = String(valSheet.getRange(valRow, 2).getValue() || "");
        var stateZipParts = stateZipRaw.split("/");
        state = stateZipParts[0] ? stateZipParts[0].trim() : "";
        zip = stateZipParts[1] ? stateZipParts[1].trim() : "";
      }
    }
  }

  if (!state) {
    var regState = String(sheet.getRange(row, 23).getValue() || "").trim();
    var lossState = String(sheet.getRange(row, 14).getValue() || "").trim();
    state = regState || lossState;
  }

  if (!zip && (!state || state.length !== 2)) {
    return ui.alert("No State/ZIP found on the Valuations tab for this vehicle (comps may not have run yet), and no valid state on the main sheet either. Run comps for this row first, or fill in Registration State / Loss State.");
  }

  var taxPct = null;
  var taxSourceLabel = "";

  if (zip) {
    try {
      var zipResponse = UrlFetchApp.fetch("https://salestaxzip.com/api/v1/rate/" + encodeURIComponent(zip), { muteHttpExceptions: true });
      if (zipResponse.getResponseCode() === 200) {
        var zipBody = JSON.parse(zipResponse.getContentText());
        if (zipBody.success && zipBody.data && zipBody.data.rates && typeof zipBody.data.rates.combined === 'number') {
          taxPct = (zipBody.data.rates.combined * 100).toFixed(3);
          taxSourceLabel = "SalesTaxZip, ZIP " + zip;
        }
      }
    } catch (zipErr) {
      console.error("SalesTaxZip lookup failed: " + zipErr);
    }
  }

  var titleAndRegistration = null;
  if (state && state.length === 2 && apiKey) {
    try {
      var vdevUrl = "https://api.vehicles.dev/v1/vehicles/purchase-costs?price=10000&state=" + encodeURIComponent(state.toUpperCase());
      var vdevResponse = UrlFetchApp.fetch(vdevUrl, {
        headers: { "Authorization": "Bearer " + apiKey },
        muteHttpExceptions: true
      });
      if (vdevResponse.getResponseCode() === 200) {
        var vdevBody = JSON.parse(vdevResponse.getContentText());
        if (taxPct === null && vdevBody.taxRate !== null && vdevBody.taxRate !== undefined) {
          taxPct = (vdevBody.taxRate * 100).toFixed(2);
          taxSourceLabel = "vehicles.dev, state " + state + " (ZIP lookup unavailable)";
        }
        if (vdevBody.titleAndRegistration !== null && vdevBody.titleAndRegistration !== undefined) {
          titleAndRegistration = vdevBody.titleAndRegistration;
        }
      }
    } catch (vdevErr) {
      console.error("vehicles.dev lookup failed: " + vdevErr);
    }
  }

  if (taxPct === null) {
    return ui.alert("Couldn't get a tax rate from either source. Check that the ZIP/state on this row are valid.");
  }

  sheet.getRange(row, 87).setValue(taxPct);
  if (titleAndRegistration !== null) {
    sheet.getRange(row, 88).setValue(titleAndRegistration);
  }

  ui.alert("✅ Sales Tax " + taxPct + "% (" + taxSourceLabel + ")" +
    (titleAndRegistration !== null ? ", Tag & Title Fee $" + titleAndRegistration + " (vehicles.dev, state " + state + ")"
      : apiKey ? ", Tag & Title Fee not available (no valid state on file)"
      : ", Tag & Title Fee skipped (no vehicles.dev API key set — run ⚙️ Setup & Help → Set Vehicles.dev API Key)") + ".");
}

function processClientSignature(data) {
  const sheet = getMainSheet();
  const row = parseInt(data.row, 10);
  const ownerEmail = ADMIN_NOTIFICATION_EMAIL; 

  const rowData = sheet.getRange(row, 1, 1, 35).getValues()[0];
  const clientName = data.clientName;
  const clientEmail = rowData[4];
  const folderUrl = rowData[27];
  const rawDocUrls = rowData[28] ? String(rowData[28]).split(/\r?\n/) : [];

  const folderMatch = folderUrl ? folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/) : null;
  if (!folderMatch) throw new Error("Could not find this client's Drive folder — the link may be out of date.");
  const folderId = folderMatch[1];
  const completedFoldersIter = DriveApp.getFolderById(folderId).getFoldersByName("Completed");
  const completedFolder = completedFoldersIter.hasNext() ? completedFoldersIter.next() : DriveApp.getFolderById(folderId).createFolder("Completed");

  const sigBytes = Utilities.base64Decode(data.signatureBase64.split(',')[1]);
  const sigBlob = Utilities.newBlob(sigBytes, 'image/png', 'signature.png');
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy");

  if (data.docType === 'auth') {
    const firstDocId = rawDocUrls[0].match(/\/d\/([a-zA-Z0-9-_]+)/)[1];
    stampDocument(firstDocId, clientName, null, todayStr, sigBlob, data.clientIp);

    Utilities.sleep(2000);

    const pdfBlob = DriveApp.getFileById(firstDocId).getAs(MimeType.PDF).setName(`Signed Authorization - ${clientName}.pdf`);
    completedFolder.createFile(pdfBlob);

    if (clientEmail) {
      GmailApp.sendEmail(
        clientEmail, `Signed Authorization Agreement Copy - ${clientName}`, `Hello ${clientName},\n\nThank you for executing your Service Authorization Agreement. Attached is a completed copy for your records.\n\nBest regards,\nEstimate Consultants`, { attachments: [pdfBlob] }
      );
    }

    GmailApp.sendEmail(ownerEmail, `✅ Document Signed: ${clientName} (Auth)`, `Client ${clientName} has signed their intake form via the website.`);
    sheet.getRange(row, 30).setValue("Auth Signed ✅").setBackground("#d4edda").setFontColor("#155724");
    sheet.getRange(row, COL_AUTH_SIGN_STATUS).setValue("Signed via Website"); // (was column 31 — overwrote the Appraisal ID)

  } else if (data.docType === 'offer') {
    const offerDocs = completedFolder.searchFiles("mimeType = 'application/vnd.google-apps.document' and (title contains 'Offer' or title contains 'Doc 7')");
    if (offerDocs.hasNext()) {
      const offerDocId = offerDocs.next().getId();
      stampDocument(offerDocId, clientName, data.checkAddress, todayStr, sigBlob, data.clientIp);

      Utilities.sleep(2000);

      const pdfBlob = DriveApp.getFileById(offerDocId).getAs(MimeType.PDF).setName(`Signed Insurance Offer - ${clientName}.pdf`);
      completedFolder.createFile(pdfBlob);

      if (clientEmail) {
        GmailApp.sendEmail(
          clientEmail, `Signed Insurance Settlement Offer Copy - ${clientName}`, `Hello ${clientName},\n\nThank you for confirming your settlement offer. Attached is a completed copy.`, { attachments: [pdfBlob] }
        );
      }
    }

    GmailApp.sendEmail(ownerEmail, `⏳ Offer Signed, Awaiting Payment: ${clientName}`, `Client ${clientName} has signed their settlement offer.`);
    sheet.getRange(row, 30).setValue("Offer Signed, Awaiting Payment ⏳").setBackground("#fff3cd").setFontColor("#856404");
    sheet.getRange(row, 34).setValue("Signed via Website");
  }

  return true;
}

function stampDocument(docId, name, address, dateStr, sigBlob, clientIp) {
  const doc = DocumentApp.openById(docId);
  const timeStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy hh:mm a z");

  fillTag(doc, '{{Client_Printed_Name}}', name || '');
  fillTag(doc, '{{Date_Signed}}', dateStr || '');
  fillTag(doc, '{{Time_Signed}}', timeStr || '');
  fillTag(doc, '{{IP_Address}}', clientIp || 'N/A');
  fillTag(doc, '{{Check_Mailing_Address}}', address || '');

  docSections_(doc).forEach(section => {
    let found = section.findText(escapeRegex_('{{Client_Signature}}'));
    if (found) {
      const el = found.getElement();
      const parent = el.getParent();
      let img = null;
      if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) {
        img = parent.asParagraph().appendInlineImage(sigBlob);
      } else if (parent.getType() === DocumentApp.ElementType.TABLE_CELL) {
        img = parent.asTableCell().appendParagraph('').appendInlineImage(sigBlob);
      }
      if (img) {
        // Keep the signature's real proportions (it used to be squashed to 180×55)
        const w = img.getWidth(), h = img.getHeight();
        const targetW = 200;
        img.setWidth(targetW).setHeight(Math.max(30, Math.round(h * (targetW / (w || targetW)))));
        el.removeFromParent();
      }
    }
  });

  doc.saveAndClose();
}

// ============================================================================
//  DEMAND LETTER AUTOMATION  (client OK -> you approve -> emailed to adjuster -> certified-mail prompt)
// ============================================================================
function findFolderPdf_(folderUrl) {
  const m = String(folderUrl || '').match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!m) return null;
  const c = DriveApp.getFolderById(m[1]).getFoldersByName('Completed');
  if (!c.hasNext()) return null;
  const pf = c.next().getFoldersByName('Final Appraisal PDF');
  if (!pf.hasNext()) return null;
  const files = pf.next().getFiles();
  return files.hasNext() ? files.next() : null;
}

// The generated demand letter / notice doc (listed in column AC) as a PDF, if present.
function findDemandLetterPdf_(docUrlsCell) {
  const urls = String(docUrlsCell || '').split(/\r?\n/);
  for (let i = 0; i < urls.length; i++) {
    const m = urls[i].match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!m) continue;
    try {
      const f = DriveApp.getFileById(m[1]);
      if (/demand|notice/i.test(f.getName())) return f.getAs(MimeType.PDF).setName(f.getName().replace(/\.pdf$/i, '') + '.pdf');
    } catch (e) {}
  }
  return null;
}

// Builds (does not send) the adjuster email for a row.
function buildDemandPackage_(row) {
  const sheet = getMainSheet();
  const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const m = calculateAppraisalMetrics(rowValuesToMathInput(r));
  const use = String(r[25] || '');
  const clientName = r[0], carrier = r[7] || 'N/A', claimNum = r[9] || 'N/A';
  const adjName = r[10] ? String(r[10]).trim() : 'Adjuster';
  const adjEmail = String(r[12] || '').trim();
  const vehicle = [r[15], r[17], r[18]].join(' ').trim() + ' (VIN: ' + r[16] + ')';
  const variant = deliveryVariant_(use);
  const sig = '\n\nBest regards,\nEstimate Consultants\nPhone: ' + OWNER_PHONE + ' | Email: customerservice@estimateconsultants.com';
  let subject, body;
  if (variant === 'acDV') {
    subject = 'Notice of Appraisal Clause Invocation - ' + clientName + ' (Claim #' + claimNum + ')';
    body = 'NOTICE OF APPRAISAL CLAUSE INVOCATION & DEMAND FOR APPRAISAL\n\nClaim Number: ' + claimNum + '\nInsurance Carrier: ' + carrier + '\nPolicyholder/Claimant: ' + clientName + '\nVehicle: ' + vehicle + '\n\nDear ' + adjName + ',\n\nPlease be advised that Estimate Consultants has been retained by ' + clientName + ' and appointed as their independent appraiser under the Appraisal Clause of the above-referenced insurance policy, and also serves as their authorized liaison and technical representative, with respect to the diminished value (loss in market value) of the vehicle referenced above. The policyholder invokes the policy\'s Appraisal Clause.\n\nEnclosed is our certified Valuation Appraisal Report.\n\nAPPRAISED LOSS IN VALUE:\n- Established Pre-Loss FMV: ' + fmtMoney(m.baseFMV) + '\n- Appraised Inherent Diminished Value: ' + fmtMoney(m.finalInherentDV) + '\n\nPlease confirm receipt and identify the carrier\'s appointed appraiser in writing within ten (10) business days so the appraisal process can proceed.' + sig;
  } else if (variant === 'acTL') {
    subject = 'Notice of Appraisal Clause Invocation - ' + clientName + ' (Claim #' + claimNum + ')';
    body = 'NOTICE OF APPRAISAL CLAUSE INVOCATION & DEMAND FOR APPRAISAL\n\nClaim Number: ' + claimNum + '\nInsurance Carrier: ' + carrier + '\nPolicyholder: ' + clientName + '\nVehicle: ' + vehicle + '\n\nDear ' + adjName + ',\n\nPlease be advised that Estimate Consultants has been retained by ' + clientName + ' and appointed as their independent appraiser under the Appraisal Clause of the above-referenced insurance policy, and also serves as their authorized liaison and technical representative, with respect to the actual cash value of the vehicle referenced above. The policyholder invokes the policy\'s Appraisal Clause.\n\nEnclosed is our certified Valuation Appraisal Report.\n\nAPPRAISED VALUE:\n- Appraised Pre-Loss Fair Market Value / Actual Cash Value: ' + fmtMoney(m.baseFMV) + '\n\nPlease confirm receipt and identify the carrier\'s appointed appraiser in writing within ten (10) business days so the appraisal process can proceed.' + sig;
  } else {
    subject = 'Formal Diminished Value Settlement Demand - ' + clientName + ' (Claim #' + claimNum + ')';
    body = 'NOTICE OF REPRESENTATION & FORMAL SETTLEMENT DEMAND\n\nClaim Number: ' + claimNum + '\nInsurance Carrier: ' + carrier + '\nClaimant/Owner: ' + clientName + '\nVehicle: ' + vehicle + '\n\nDear ' + adjName + ',\n\nPlease be advised that Estimate Consultants has been retained by ' + clientName + ' as their technical representative regarding the property damage claim referenced above.\n\nEnclosed is our certified Valuation Appraisal Report & Formal Settlement Demand Packet.\n\nSUMMARY OF DEMAND:\n- Established Pre-Loss FMV: ' + fmtMoney(m.baseFMV) + '\n- Net Demand for Inherent Diminished Value: ' + fmtMoney(m.finalInherentDV) + '\n\nAll settlement figures discussed are Subject to Client Approval (STCA). Please review the attached appraisal dossier and confirm receipt within ten (10) business days.' + sig;
  }
  const attachments = [];
  const report = findFolderPdf_(r[27]);
  if (report) attachments.push(report.getAs(MimeType.PDF));
  const letter = findDemandLetterPdf_(r[28]);
  if (letter) attachments.push(letter);
  return { row: row, r: r, clientName: clientName, carrier: carrier, claimNum: claimNum, adjName: adjName, adjEmail: adjEmail, subject: subject, body: body, attachments: attachments, hasReport: !!report, hasLetter: !!letter, variant: variant, carrierAddress: String(r[COL_CARRIER_ADDR - 1] || '').trim() };
}

// CC list for the demand: the vehicle owner (client email, column E) unless you changed/cleared the CC box on the approval page.
function demandCc_(pkg, edits) {
  const raw = (edits && edits.cc !== undefined && edits.cc !== null) ? String(edits.cc) : String(pkg.r[4] || '');
  const adj = String(pkg.adjEmail || '').toLowerCase();
  const seen = {}, out = [];
  raw.split(/[,;\s]+/).forEach(function(a) { a = a.trim(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a)) return; const k = a.toLowerCase(); if (k === adj || seen[k]) return; seen[k] = 1; out.push(a); });
  return out.join(',');
}
// Sends the adjuster email, marks the sheet, and prompts you to mail the certified copy. No UI calls, so it works from the web page too.
function sendDemandForRow_(row, edits) {
  edits = edits || {};
  const pkg = buildDemandPackage_(row);
  if (edits.subject && String(edits.subject).trim()) pkg.subject = String(edits.subject).trim();
  if (edits.body && String(edits.body).trim()) pkg.body = String(edits.body);
  if (!pkg.adjEmail) return { ok: false, error: 'Adjuster email is missing in Column M of row ' + row + '. Add it, then use the sheet menu step to send.' };
  if (!pkg.hasReport) return { ok: false, error: 'No finished appraisal PDF found in Completed / Final Appraisal PDF for this client.' };
  const sheet = getMainSheet();
  const cur = String(sheet.getRange(row, 30).getValue() || '');
  if (cur.indexOf('Demand Emailed') >= 0) return { ok: false, error: 'The demand was already emailed to the adjuster for this row.' };
  const ccList = demandCc_(pkg, edits);
  const mo = { attachments: pkg.attachments, name: 'Estimate Consultants', replyTo: 'customerservice@estimateconsultants.com' };
  if (ccList) mo.cc = ccList;
  GmailApp.sendEmail(pkg.adjEmail, pkg.subject, pkg.body, mo);
  sheet.getRange(row, COL_LAST_INSURER_FU).setValue(new Date()).setNumberFormat('MM/dd/yyyy');
  sheet.getRange(row, 30).setValue('Demand Emailed to Adjuster ✅ (certified mail pending)').setBackground('#d4edda').setFontColor('#155724');
  try { sendCertifiedMailPrompt_(pkg); } catch (e) { console.error('Certified mail prompt failed: ' + e); }
  return { ok: true, adjEmail: pkg.adjEmail, adjName: pkg.adjName };
}

// ---- MAILED (certified mail) version of the demand letter ----
// Same wording as the emailed demand for every type (insurer/direct DV, NC appraisal-clause DV, total loss / appraisal clause), except the
// "Enclosed is our certified ... Report" line, which becomes a pointer to the appraisal already EMAILED to the adjuster. The appraisal is NOT mailed.
// The letter is a Google Doc in the client's folder; once created it is never overwritten, so you can edit it freely.
function mailedLetterName_(clientName) { return 'Certified Mail Letter - ' + clientName; }   // (no "demand"/"notice" in the name on purpose, so it is never attached to the email)
function mailedLetterBody_(pkg) {
  const emailedOn = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM d, yyyy');
  let b = String(pkg.body || '').replace(/\n*Best regards,[\s\S]*$/, '');
  const pointer = 'Our certified Valuation Appraisal Report was delivered to you electronically by email on ' + emailedOn + ' at ' + (pkg.adjEmail || '(adjuster email)') + '. It is not enclosed with this mailed copy; please refer to that emailed report, which is incorporated into this letter by reference. If you did not receive it, contact us at ' + OWNER_PHONE + ' or customerservice@estimateconsultants.com and we will resend it immediately.';
  if (/Enclosed is our certified[^\n]*/.test(b)) b = b.replace(/Enclosed is our certified[^\n]*/, pointer);
  else b += '\n\n' + pointer;
  return b;
}
function mailedLetterFile_(row, create) {
  const sheet = getMainSheet(); const d = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/); if (!m) return null;
  const folder = DriveApp.getFolderById(m[1]); const nm = mailedLetterName_(d[0]);
  const it = folder.getFilesByName(nm); while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) return f; }
  if (!create) return null;
  const pkg = buildDemandPackage_(row);
  const doc = DocumentApp.create(nm);
  const body = doc.getBody(); body.clear();
  body.setMarginTop(54).setMarginBottom(54).setMarginLeft(72).setMarginRight(72);
  const add = function(t, size, bold, after) { const p = body.appendParagraph(t); p.setSpacingAfter(after == null ? 0 : after).setSpacingBefore(0); p.editAsText().setFontFamily('Arial').setFontSize(size || 11).setBold(!!bold); return p; };
  String(OWNER_MAIL_ADDRESS).split('\n').forEach(function(l, i) { add(l, i === 0 ? 12 : 10, i === 0, 0); });
  add('Phone: ' + OWNER_PHONE + '  |  customerservice@estimateconsultants.com', 10, false, 14);
  add(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM d, yyyy'), 11, false, 10);
  add('VIA CERTIFIED MAIL - RETURN RECEIPT REQUESTED', 11, true, 0);
  add('(Appraisal report delivered separately by email)', 10, false, 10);
  add(pkg.carrier, 11, true, 0);
  if (pkg.adjName && pkg.adjName !== 'Adjuster') add('Attn: ' + pkg.adjName, 11, false, 0);
  String(pkg.carrierAddress || '(ADD CARRIER MAILING ADDRESS)').split('\n').forEach(function(l) { if (String(l).trim()) add(String(l).trim(), 11, false, 0); });
  add('', 11, false, 8);
  mailedLetterBody_(pkg).split('\n').forEach(function(l) { add(l, 11, /^[A-Z &\-]{12,}$/.test(l.trim()), 0); });
  add('', 11, false, 14);
  add('Sincerely,', 11, false, 30);
  add('Kevin Murty', 11, true, 0);
  add('Estimate Consultants', 11, false, 0);
  add('Phone: ' + OWNER_PHONE, 11, false, 0);
  doc.saveAndClose();
  const f = DriveApp.getFileById(doc.getId()); f.moveTo(folder);
  return f;
}

function sendCertifiedMailPrompt_(pkg) {
  const link = actionLink_(pkg.row, 'certified');
  const mailedAtt = []; try { const lf = mailedLetterFile_(pkg.row, true); if (lf) mailedAtt.push(lf.getAs(MimeType.PDF).setName(lf.getName() + '.pdf')); } catch (e) { console.error('Mailed letter failed: ' + e); }
  const addr = pkg.carrierAddress ? pkg.carrierAddress.replace(/\n/g, '\n    ') : '(no address in Column DH - add it, then re-send this from the sheet)';
  const body = 'The demand was emailed to ' + pkg.adjName + ' (' + pkg.adjEmail + ') for ' + pkg.clientName + '.\n\n' +
    'TO DO: mail the letter by CERTIFIED MAIL (return receipt requested). The appraisal is NOT mailed - it went by email.\n' +
    '  Carrier: ' + pkg.carrier + '\n  Claim #: ' + pkg.claimNum + '\n  Adjuster: ' + pkg.adjName + '\n' +
    '  Mail to:\n    ' + addr + '\n\n' +
    'WHAT IS ATTACHED:\n' +
    '  1. "Label - Envelope" - full page for the envelope: return address, Certified Mail - Return Receipt Requested, and the carrier address.\n' +
    '  2. "Label - Certified Mail Form + Return Receipt" - ONE small page with two small labels, stacked (the first for the green certified mail form, the second for the return receipt card). Cut along the thin border.\n' +
    '  3. The certified mail LETTER (edit it first under Actions > "Certified mail letter"). Mail ONLY this letter - the appraisal was already emailed and the letter says to refer to that email.\n' +
    '  TIP: for ALL the labels in ONE PDF, open the file panel > Actions tab > "Print certified mail labels".\n' +
    '  Each label PDF is one page sized exactly to the label, so it fills the label when printed from your label printer at 100% (Actual size). Sizes are set in the script (CERT_TAG_*, LABEL_*).\n\n' +
    'STEPS: print the letter, put it in the envelope, apply the labels, fill in the green certified mail form + return receipt card, mail it at the post office counter or hand it to your carrier, then click here and enter the tracking number:\n' + link + '\n';
  GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '📮 Certified mail to send: ' + pkg.clientName + ' - ' + pkg.carrier, body, { attachments: mailedAtt.concat([buildCertifiedLabelPdf_(pkg).setName('Label - Envelope - ' + pkg.clientName + '.pdf')].concat(buildCertifiedFormLabelsPdf_(pkg))) });
}

// Sent to you the moment the client clicks OK.
function requestDemandApproval_(row) {
  const pkg = buildDemandPackage_(row);
  const warn = [];
  if (!pkg.adjEmail) warn.push('Adjuster email (Claim & Carrier tab) is empty.');
  if (!pkg.hasReport) warn.push('No final appraisal PDF found in the client folder.');
  if (!pkg.carrierAddress) warn.push('Carrier mailing address is empty - needed for the certified mail labels.');
  if (!pkg.hasLetter) warn.push('No demand/notice letter document was found to attach.');
  const body = pkg.clientName + ' gave the OK to proceed. NOTHING has been sent to the adjuster.\n\n' +
    (warn.length ? 'CHECK FIRST:\n- ' + warn.join('\n- ') + '\n\n' : '') +
    'NEXT: open the file panel > ⚡ Actions tab > "Send demand / notice to the adjuster". You can edit the message and CC before it sends.';
  GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '✅ Client OK to proceed: ' + pkg.clientName + ' - ' + pkg.carrier, body);
  getMainSheet().getRange(row, 30).setValue('Client OK to Proceed ✅ - Demand Awaiting Your Approval').setBackground('#fff3cd').setFontColor('#856404');
}

function approveDemandPage_(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'approve')) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2>');
  const pkg = buildDemandPackage_(r);
  const sent = String(getMainSheet().getRange(r, 30).getValue() || '').indexOf('Demand Emailed') >= 0;
  if (sent) return proceedPageHtml_('Already Sent', '<div class="big">✅</div><h2>Already sent</h2><p>The demand for ' + escHtml_(pkg.clientName) + ' was already emailed to the adjuster.</p>');
  const inp = 'width:100%;box-sizing:border-box;padding:7px;border:1px solid #bbb;border-radius:6px;font:13px Arial,sans-serif;';
  const html = '<h2>Approve demand for ' + escHtml_(pkg.clientName) + '</h2><p style="font-size:13px;color:#555">You can edit the subject, CC and message below before sending. The attached PDFs are the ones listed.</p>' +
    '<p style="margin:6px 0"><strong>To:</strong> ' + escHtml_(pkg.adjEmail || '(missing)') + '</p>' +
    '<label style="font-size:13px"><strong>CC</strong> (vehicle owner - separate several with commas)</label><input id="cc" style="' + inp + '" value="' + escHtml_(demandCc_(pkg, null)) + '">' +
    '<label style="font-size:13px"><strong>Subject</strong></label><input id="sub" style="' + inp + '" value="' + escHtml_(pkg.subject) + '">' +
    '<p style="margin:6px 0"><strong>Attachments:</strong> ' + escHtml_(pkg.attachments.map(function(a) { return a.getName(); }).join(', ') || 'none') + '</p>' +
    docLinksHtml_(approvalDocs_(r, 'demand', false)) +
    '<label style="font-size:13px"><strong>Message</strong> (edit as needed)</label><textarea id="bod" rows="16" style="' + inp + 'white-space:pre-wrap">' + escHtml_(pkg.body) + '</textarea>' +
    '<p></p><button id="b" onclick="go()">Approve &amp; Send to Adjuster</button><p id="m"></p>' +
    '<script>function go(){var b=document.getElementById("b");b.disabled=true;b.textContent="Sending...";google.script.run.withSuccessHandler(function(x){var m=document.getElementById("m");if(x.ok){document.querySelector(".card").innerHTML=\'<div class="big">✅</div><h2>Sent</h2><p>Emailed to \'+x.adjEmail+\'. Check your inbox for the certified mail reminder.</p>\'}else{b.disabled=false;b.textContent="Approve & Send to Adjuster";m.className="err";m.textContent=x.error}}).withFailureHandler(function(e){b.disabled=false;document.getElementById("m").className="err";document.getElementById("m").textContent=e.message}).approveAndSendDemand(' + r + ',"' + token + '",{cc:document.getElementById("cc").value,subject:document.getElementById("sub").value,body:document.getElementById("bod").value})}</script>';
  return proceedPageHtml_('Approve Demand', html);
}

function approveAndSendDemand(row, token, edits) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'approve')) return { ok: false, error: 'Invalid link.' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return sendDemandForRow_(r, edits); } catch (e) { return { ok: false, error: String(e) }; } finally { lock.releaseLock(); }
}

function certifiedMailPage_(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'certified')) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2>');
  const name = String(getMainSheet().getRange(r, 1).getValue() || '');
  return proceedPageHtml_('Certified Mail', '<h2>Certified mail sent - ' + escHtml_(name) + '</h2><p>Enter the tracking number from the receipt.</p><input id="t" style="width:100%;padding:10px;font-size:15px;box-sizing:border-box" placeholder="Tracking number"><p></p><button id="b" onclick="go()">Save</button><p id="m"></p>' +
    '<script>function go(){var t=document.getElementById("t").value;if(!t){document.getElementById("m").textContent="Enter the tracking number.";return}google.script.run.withSuccessHandler(function(){document.querySelector(".card").innerHTML=\'<div class="big">✅</div><h2>Saved</h2>\'}).markCertifiedSent(' + r + ',"' + token + '",t)}</script>');
}

function certTracking_(row) { try { return PropertiesService.getScriptProperties().getProperty('CERTTRK_' + row) || ''; } catch (e) { return ''; } }
function saveCertTracking_(row, tracking) {
  const sheet = getMainSheet();
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM d, yyyy');
  tracking = String(tracking).substring(0, 60);
  PropertiesService.getScriptProperties().setProperty('CERTTRK_' + row, tracking);
  sheet.getRange(row, 30).setValue('Demand Emailed + Certified Mail Sent ✅').setBackground('#d4edda').setFontColor('#155724');
  sheet.getRange(row, 30).setNote('Certified mail sent ' + stamp + '. Tracking: ' + tracking);
}
function markCertifiedSent(row, token, tracking) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'certified')) return false;
  saveCertTracking_(r, tracking);
  return true;
}

// Menu step: manual send (same code path as the approval page).
// Manual override: emails the finished PDF to the selected client right now (for payments Wave doesn't show, or if you don't want to wait for the 5-minute check).
function deliverReportNow() {
  const ui = SpreadsheetApp.getUi(); const row = activeFileRow_();
  if (row <= 1) return ui.alert('Select a client row first.');
  const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, 35).getValues()[0];
  if (!d[4]) return ui.alert('No client email in column E.');
  const pdf = d[27] ? findFolderPdf_(d[27]) : null;
  if (!pdf) return ui.alert('No final appraisal PDF found yet - click Compile final PDF first.');
  let paid = 'NOT confirmed in Wave';
  try { const inv = d[34] || d[31]; if (inv) paid = checkWavePaymentStatus(inv) ? 'PAID in Wave' : 'not yet showing paid in Wave'; } catch (e) {}
  const stNow = String(d[29] || '');
  if (/Delivered/.test(stNow) && ui.alert('The status already says "' + stNow + '" - the report was already emailed to ' + d[0] + '.\n\nSend it AGAIN?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  if (ui.alert('Email the report to ' + d[0] + ' (' + d[4] + ') now?\n\nFile: ' + pdf.getName() + '\nPayment: ' + paid, ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return;
  const res = performApprovalAction_(row, 'deliver');
  ui.alert(res.ok ? 'Sent. ' + res.msg : 'Not sent: ' + res.msg);
}
function requestDvDeliveryNow() {
  const ui = SpreadsheetApp.getUi(); const row = activeFileRow_();
  if (row <= 1) return ui.alert('Select a client row first.');
  const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, 35).getValues()[0];
  if (!isDvApprovalType_(String(d[25] || ''))) return ui.alert('This is for diminished value files. Other types are delivered after payment.');
  if (!findFolderPdf_(d[27])) return ui.alert('No final appraisal PDF yet - click Compile final PDF first.');
  ui.alert('Open the File Panel > ⚡ Actions tab > "Send appraisal to the client". It shows you the exact email and PDF first, then sends it to ' + d[0] + ' with the Approve & Proceed button.');
}
function sendAdjusterDemandEmail() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert('Select a client row first.');
  const pkg = buildDemandPackage_(activeRow);
  if (ui.alert('Send demand to ' + pkg.adjName + ' (' + (pkg.adjEmail || 'no email') + ')?\n\nSubject: ' + pkg.subject + '\nAttachments: ' + (pkg.attachments.map(function(a) { return a.getName(); }).join(', ') || 'none'), ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return;
  const res = sendDemandForRow_(activeRow);
  ui.alert(res.ok ? 'Demand emailed to ' + res.adjName + ' (' + res.adjEmail + '). A certified-mail reminder was emailed to you.' : res.error);
}

function sendAuthAndInvoice() {
  const ui = SpreadsheetApp.getUi();
  const activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert("Select a client row.");
  return sendAuthAndInvoiceCore_(activeRow, ui);
}

function sendAuthAndInvoiceCore_(activeRow, ui, ov) {
  ov = ov || {};
  const sheet = getMainSheet();

  const data = sheet.getRange(activeRow, 1, 1, 35).getValues()[0];
  const clientName = data[0];
  const clientEmail = data[4];
  const intendedUse = String(data[25] || '');

  if (isDirectDV_(intendedUse)) return ui.alert("This is a Direct (no-insurer) Diminished Value appraisal - there is no intake form, signing link or retainer. Run Step 4 (folder + report), finish the appraisal, then use Step 6 to send the $299 invoice.");
  if (!clientEmail) return ui.alert("Client Email is missing in Column E.");

  const signingLink = `${WEBSITE_SIGNING_URL}?row=${activeRow}&type=auth`;

  let nextStepsMsg = "Welcome to Estimate Consultants! Please review and sign your agreement:";
  { const io = {}; if (ov.cc) io.cc = ov.cc; GmailApp.sendEmail(clientEmail, ov.subject || "Action Required: Service Authorization", ov.body || `${nextStepsMsg}\n\nSign here:\n${signingLink}`, io); }

  if (isInsurerDV_(intendedUse)) {
    if (data[31]) {
      ui.alert("A retainer invoice already exists for this row (column AF), so a second one was NOT created.");
    } else {
      const promo = getShopPromoForEmail_(clientEmail);
      const r = createWaveInvoice(clientName, clientEmail, 'DV_RETAINER', Object.assign({ promoCode: promo, vehicle: invVehicle_(sheet, activeRow) }, ov.inv || {}));
      if (r.id) sheet.getRange(activeRow, 32).setValue(r.id);
      if (r.ok) {
        sheet.getRange(activeRow, 30).setValue("Initial Auth Link Sent - Retainer Invoice Sent ($" + r.price.toFixed(2) + ")").setBackground("#e2e3e5").setFontColor("#383d41");
      } else {
        ui.alert("⚠️ Retainer invoice problem: " + r.error);
      }
    }
  }

  if (!String(sheet.getRange(activeRow, 30).getValue() || '').startsWith("Initial Auth Link Sent")) {
    sheet.getRange(activeRow, 30).setValue("Initial Auth Link Sent").setBackground("#e2e3e5").setFontColor("#383d41");
  }
  sheet.getRange(activeRow, COL_AUTH_SIGN_STATUS).setValue("Sent via Web Link"); // (was column 31 — overwrote the Appraisal ID)
  ui.alert("Emailed onboarding instructions and signing link to client!");
}

function sendFinalPhase() {
  const ui = SpreadsheetApp.getUi();
  const activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert("Select a client row.");
  return sendFinalPhaseCore_(activeRow, ui);
}

function sendFinalPhaseCore_(activeRow, ui) {
  const sheet = getMainSheet();

  const data = sheet.getRange(activeRow, 1, 1, 35).getValues()[0];
  const clientName = data[0];
  const clientEmail = data[4];
  const intendedUse = String(data[25] || '');
  const folderUrl = data[27];

  let rawOfferAmount = data[32];
  let offerAmount = (rawOfferAmount === "" || isNaN(parseFloat(String(rawOfferAmount).replace(/[^0-9.]/g, '')))) ? 0 : parseFloat(String(rawOfferAmount).replace(/[^0-9.]/g, ''));

  if (!(offerAmount > 0)) return ui.alert("Enter the Insurance Offer Amount (column AG) first. The $299 final invoice is only sent once an offer exists.");
  if (data[34]) return ui.alert("A final-payment invoice already exists for this row (column AI), so nothing was re-sent.");

  updateOfferDocAmount(folderUrl, offerAmount);

  if (isDirectDV_(intendedUse)) return ui.alert('This is a Direct (no-insurer) Diminished Value appraisal - there is no insurance offer or Step 8. Use Step 6 to send the $299 invoice once the appraisal is finished.');
  if (isAppraisalClauseDV_(intendedUse)) return ui.alert('This is an Appraisal Clause Diminished Value appraisal - it is billed like Total Loss. Use Step 6 to send the $299 invoice (before delivery); there is no Step 8 / second invoice.');
  if (isInsurerDV_(intendedUse)) {
    const signingLink = `${WEBSITE_SIGNING_URL}?row=${activeRow}&type=offer`;

    // 💸 One-time $100 discount — only applies if this exact client email was
    // sent the discount offer (Email 4 of the estimator follow-up sequence)
    // and hasn't already used it. Consumed here, at the moment the real
    // invoice goes out, however long after that email that ends up being.
    // (The $50 shop referral discount applies to the FIRST/$199 invoice
    // instead — see processPortalIntakeDocs — not this one.)
    // A partner-shop code (15% off every payment) takes priority over the one-time $100 offer; the two are not stacked.
    const promo = getShopPromoForEmail_(clientEmail);
    const hasDiscount = !promo && getAndConsumeDiscountForEmail(clientEmail, true);   // peek only - consumed after the invoice succeeds
    const finalAmount = hasDiscount ? 199.00 : null; // null = Wave's own product price
    const invoiceDescription = hasDiscount ? "(One-Time $100 Discount Applied)" : "";

    let signEmailBody = `Hello ${clientName},\n\nPlease review and approve your final offer:\n\n${signingLink}`;
    if (hasDiscount) signEmailBody += `\n\nYour final invoice reflects the one-time $100 discount we sent you ($199 instead of $299).`;
    GmailApp.sendEmail(clientEmail, "Signature Required: Insurance Offer Confirmation", signEmailBody);
    sheet.getRange(activeRow, 34).setValue("Sent via Web Link");

    const r = createWaveInvoice(clientName, clientEmail, 'DV_FINAL', { promoCode: promo, priceOverride: finalAmount, descSuffix: invoiceDescription, vehicle: invVehicle_(sheet, activeRow) });
    if (r.id) sheet.getRange(activeRow, 35).setValue(r.id);
    if (r.id && hasDiscount) getAndConsumeDiscountForEmail(clientEmail);   // now mark the $100 offer used

    sheet.getRange(activeRow, 30).setValue("Final Offer Link Sent").setBackground("#e2e3e5").setFontColor("#383d41");
    if (r.ok) {
      ui.alert("Updated Offer Doc, emailed the Offer Signing Link, and sent the $" + r.price.toFixed(2) + " Wave invoice!" + (promo ? " (Shop code " + promo + " - 15% off.)" : "") + (hasDiscount ? " ($100 discount applied.)" : ""));
    } else {
      ui.alert("Offer doc updated and signing link emailed, BUT the final invoice had a problem: " + r.error);
    }
  }
}

// Checks whether this exact email was sent the $100 discount offer (Email 4
// of the estimator follow-up sequence) and hasn't already used it. If found,
// marks it used (one-time only) and returns true.
function getAndConsumeDiscountForEmail(email, peekOnly) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME);
  if (!sheet) return false;

  var cleanEmail = sanitizeEmail(email);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var data = sheet.getRange(2, 1, lastRow - 1, 16).getValues();
  for (var i = 0; i < data.length; i++) {
    if (sanitizeEmail(data[i][0]) === cleanEmail && data[i][14] && !data[i][15]) {
      if (!peekOnly) sheet.getRange(i + 2, 16).setValue(new Date()); // Discount Used At
      return true;
    }
  }
  return false;
}

function updateOfferDocAmount(folderUrl, amount) {
  if (!folderUrl) return 0;
  const folderIdMatch = String(folderUrl).match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!folderIdMatch) return 0;
  const completedFolders = DriveApp.getFolderById(folderIdMatch[1]).getFoldersByName("Completed");
  if (!completedFolders.hasNext()) return 0;
  const offerDocs = completedFolders.next().searchFiles("mimeType = 'application/vnd.google-apps.document' and (title contains 'Offer' or title contains 'Doc 7')");
  if (!offerDocs.hasNext()) return 0;
  const doc = DocumentApp.openById(offerDocs.next().getId());
  const count = fillTag(doc, '{{Offer_Amount}}', fmtMoney(amount));
  cleanDollarSigns_(doc);
  doc.saveAndClose();
  return count;
}

function setupSheetHeaders() {
  const sheet = getMainSheet();
  const headers = [
    'Client/Owner Name', 'Phone Number', 'Address', 'Mailing Address', 'Email Address', 'Date of Loss', 'Date Vehicle Repaired', 'Insurance Carrier', '1st or 3rd Party', 'Claim Number', 'Adjuster Name', 'Adjuster Phone', 'Adjuster Email', 'Loss State', 'At-Fault Driver', 'Vehicle Year', 'VIN Number', 'Vehicle Make', 'Vehicle Model', 'Vehicle Trim', 'Vehicle Mileage', 'Vehicle Plate Number', 'Registration State', 'Color', 'Title Branding', 'Intended Use', 'USPAP Report Type', 'Folder URL', 'Doc URL', 'System Status', 'Appraisal ID', 'Wave Invoice ID', 'Insurance Offer Amount', 'Final Sign ID', 'Final Wave Invoice ID', 'Damage Photo 1 URL', 'Comp Photo 1 URL', 'Title Brand Notes', 'NAAA Condition Grade', 'Condition Notes', 'Vehicle History Notes', 'Final Repair Bill', 'Repair Categories', 'Repair Severity Notes', 'NADA Valuation', 'NADA Date', 'NADA Definition', 'NADA Notes', 'KBB Valuation', 'KBB Date', 'KBB Definition', 'KBB Notes', 'Pre-Accident Trade Comp Notes', 'CarMax Offer', 'CarMax Date', 'Carvana Offer', 'Carvana Date', '3rd Dealer Name', '3rd Dealer Offer', '3rd Dealer Date', 'Trade Valuation Notes', 'Comp Rate Per Mile', 'Comp 1 Price', 'Comp 1 Dealer', 'Comp 1 Date', 'Comp 1 Miles', 'Comp 1 Fee', 'Comp 1 Notes', 'Comp 2 Price', 'Comp 2 Dealer', 'Comp 2 Date', 'Comp 2 Miles', 'Comp 2 Fee', 'Comp 2 Notes', 'Comp 3 Price', 'Comp 3 Dealer', 'Comp 3 Date', 'Comp 3 Miles', 'Comp 3 Fee', 'Comp 3 Notes', 'FMV Comp Summary Notes', 'CarGurus Date', 'CarGurus %', 'Historical Shift Notes', 'Prior Damage Deduction', 'Valuation Rationale Notes', 'Sales Tax %', 'Tag & Title Fee'
  ];
  while (headers.length < 88) {
    headers.push('');
  }
  headers[88] = 'Web Lead Status';
  headers[89] = 'Web Submission Method';
  headers[90] = 'Web Submission Date';
  headers[91] = 'Estimated Payout Range (Auto-Estimate)';
  headers[92] = 'Session ID';
  headers[93] = 'Progress Log';
  headers[94] = 'Follow-Up Date';
  headers[95] = 'Auth Sign Status';
  headers[96] = 'Calculated Final DV';
  headers[97] = 'Calculated Final ACV / FMV';
  headers[98] = 'Agreed Award Value (ACV or Diminished Value)';
  headers[99] = 'Carrier Appraiser Name';
  headers[100] = 'Carrier Appraiser Company';
  OPTION_HEADERS_.concat(DEALER_HEADERS_).forEach(function(h, i) { headers[COL_COMP1_OPT_ADJ - 1 + i] = h; });
  ensureMainWidth_(sheet);

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var conditionRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  var ratingValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(conditionRatings, true)
    .setAllowInvalid(false)
    .build();
  var jdPowerValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High Trade-In Value', 'Average Trade-In Value', 'Low Trade-In Value'].concat(conditionRatings), true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 47, 999, 1).setDataValidation(jdPowerValidation);
  sheet.getRange(2, 51, 999, 1).setDataValidation(ratingValidation);

  var naaaGrades = ['#1 EXCELLENT', '#2 BETTER THAN AVERAGE', '#3 NORMAL WEAR AND TEAR', '#4 EXCESSIVE WEAR AND TEAR', '#5 SHOWS SIGNS OF SEVERE ABUSE'];
  var naaaValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(naaaGrades, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 39, 999, 1).setDataValidation(naaaValidation);

  var intendedUseValues = Object.keys(MASTER_DOC_MAP);
  var intendedUseValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(intendedUseValues, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 26, 999, 1).setDataValidation(intendedUseValidation);

  sheet.hideColumns(36, 2);

  var existingBandings = sheet.getRange(1, 1, 1000, MAIN_ROW_WIDTH).getBandings();
  existingBandings.forEach(function(b) { b.remove(); });
  sheet.getRange(1, 1, 1000, MAIN_ROW_WIDTH).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);

  var followUpDateRange = sheet.getRange(2, 95, 999, 1);
  followUpDateRange.setNumberFormat("MM/dd/yyyy");
  applyColumnFormats_(sheet);

  var rules = sheet.getConditionalFormatRules();
  rules = rules.filter(function(r) {
    var ranges = r.getRanges();
    return !(ranges.length === 1 && ranges[0].getColumn() === 1 && ranges[0].getRow() === 2 && (ranges[0].getNumColumns() === 95 || ranges[0].getNumColumns() === MAIN_ROW_WIDTH));
  });
  var followUpRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($CQ2<>"", $CQ2<=TODAY())')
    .setBackground("#fecaca")
    .setRanges([sheet.getRange(2, 1, 999, MAIN_ROW_WIDTH)])
    .build();
  rules.push(followUpRule);
  sheet.setConditionalFormatRules(rules);

  SpreadsheetApp.getUi().alert("Sheet headers fully configured through Column CW!");
}

function packageDocRole_(name) {
  const n = String(name || '');
  if (/intake|agreement|authoriz|service|award|offer|doc ?7|signed/i.test(n)) return 'skip';
  if (/demand|notice/i.test(n)) return 'demand';
  return 'report';
}
function compileBaseParts_(clientName, clientFolder, docUrls) {
  // Each document is exported to its OWN PDF (so every one keeps its own page size and margins - merging them into one
  // Google Doc is what pushed pages off-center). The intake/authorization form is NOT included here (only the SIGNED copy goes
  // at the very end, added by the combine step) and the award letter / insurer-offer document are never part of this package.
  var completedFolders = clientFolder.getFoldersByName("Completed");
  var completedFolder = completedFolders.hasNext() ? completedFolders.next() : clientFolder.createFolder("Completed");
  var finalPdfFolders = completedFolder.getFoldersByName("Final Appraisal PDF");
  var finalPdfFolder = finalPdfFolders.hasNext() ? finalPdfFolders.next() : completedFolder.createFolder("Final Appraisal PDF");

  var reportBlobs = [], demandBlobs = [], skipped = [];
  docUrls.forEach(function(url) {
    var idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!idMatch) return;
    var f;
    try { f = DriveApp.getFileById(idMatch[1]); } catch (openErr) { console.error("Skipped a doc that failed to open: " + openErr); return; }
    var nm = String(f.getName() || '');
    var role = packageDocRole_(nm);
    if (role === 'skip') { skipped.push(nm); return; }
    var b; try { b = f.getAs(MimeType.PDF); } catch (pe) { console.error("PDF export failed for " + nm + ": " + pe); return; }
    if (role === 'demand') demandBlobs.push(b); else reportBlobs.push(b);
  });
  var openedCount = reportBlobs.length + demandBlobs.length;
  if (reportBlobs.length === 0) throw new Error("Couldn't find the appraisal report document in this file's document list - nothing to compile.");

  // clear the old base parts, then write the new ones
  var oldParts = completedFolder.getFiles();
  while (oldParts.hasNext()) { var op = oldParts.next(); if (/\(base[^)]*\)\.pdf$/i.test(op.getName())) op.setTrashed(true); }
  reportBlobs.forEach(function(b, k) { completedFolder.createFile(b.copyBlob().setName(k === 0 ? EXH_BASE_NAME : 'Appraisal Part ' + (k + 1) + ' (base).pdf')); });
  demandBlobs.forEach(function(b, k) { completedFolder.createFile(b.copyBlob().setName(k === 0 ? 'Demand Letter (base).pdf' : 'Demand Letter ' + (k + 1) + ' (base).pdf')); });
  // safety net: the appraisal report on its own is in the sending folder right away (replaced by the full PDF when it is built)
  var existingFiles = finalPdfFolder.getFiles();
  while (existingFiles.hasNext()) existingFiles.next().setTrashed(true);
  finalPdfFolder.createFile(reportBlobs[0].copyBlob().setName(clientName + " - Complete Appraisal.pdf"));
  return { reports: reportBlobs.length, demands: demandBlobs.length, skipped: skipped, count: openedCount };
}
function compileAndFinalizeAppraisalPdf() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getMainSheet();
  var activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert("Select a client row first.");

  var rowData = sheet.getRange(activeRow, 1, 1, 35).getValues()[0];
  var clientName = String(rowData[0] || "Client");
  var folderUrl = String(rowData[27] || "");
  var docUrlsRaw = String(rowData[28] || "");

  if (!folderUrl || !docUrlsRaw) return ui.alert("No generated docs found for this row yet — run Step 1 first.");

  var docUrls = docUrlsRaw.split(/\r?\n/).map(function(u) { return u.trim(); }).filter(function(u) { return u; });
  if (docUrls.length === 0) return ui.alert("No document URLs found for this row.");

  var folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!folderIdMatch) return ui.alert("Couldn't parse the client's Drive folder.");
  var clientFolder = DriveApp.getFolderById(folderIdMatch[1]);

  var cp;
  try { cp = compileBaseParts_(clientName, clientFolder, docUrls); } catch (cbe) { return ui.alert(String(cbe.message || cbe)); }
  var openedCount = cp.count, reportBlobs = new Array(cp.reports), demandBlobs = new Array(cp.demands), skipped = cp.skipped;

  assembleFullAppraisalJob(activeRow, 'auto');
  ui.alert("✅ Compiled " + openedCount + " document(s) (" + reportBlobs.length + " appraisal, " + demandBlobs.length + " demand/notice letter). "
    + (skipped.length ? "Left out on purpose: " + skipped.join('; ') + ".\n\n" : "\n")
    + "Now combining: demand letter (first) -> appraisal -> your supporting exhibits -> the SIGNED authorization form (last pages). You'll get an email with the finished PDF attached so you can review exactly what the client will receive (usually under a minute). "
    + "For diminished value you'll get an approval email (no payment needed yet); other types send after payment. The client gets Proceed / Do Not Proceed buttons.");
}

function appendScreenshotsToReport() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getTargetValuationsSheet();
  var row = activeFileRow_();
  if (row <= 1) return ui.alert("Please select a valid vehicle row (Row 2 or below) first.");

  var sessionId = String(sheet.getRange(row, VALUATIONS_TOTAL_COLS + 1).getValue() || "");
  if (!sessionId) return ui.alert("No Session ID on this row — can't find the matching client folder.");

  var mainSheet = getMainSheet();
  var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 500);
  if (!mainRow) return ui.alert("Couldn't match this row to a client folder. Has Step 1 (Create Client Folder) been run yet?");

  var folderUrl = String(mainSheet.getRange(mainRow, 28).getValue() || "");
  var folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!folderIdMatch) return ui.alert("No client folder found for this row yet — run Step 1 first.");

  var clientFolder = DriveApp.getFolderById(folderIdMatch[1]);
  var screenshotFolders = clientFolder.getFoldersByName("Screenshots");
  if (!screenshotFolders.hasNext()) {
    return ui.alert("No 'Screenshots' folder found inside the client's Drive folder. Drag the folder offer_automation.py created (named exactly 'Screenshots') into the client's folder first.");
  }
  var screenshotFolder = screenshotFolders.next();

  var reportDocs = clientFolder.searchFiles("mimeType = 'application/vnd.google-apps.document' and (title contains 'Report' or title contains 'Dossier')");
  if (!reportDocs.hasNext()) return ui.alert("Couldn't find a Report or Dossier doc in this client's folder.");
  var reportDoc = DocumentApp.openById(reportDocs.next().getId());
  var body = reportDoc.getBody();

  var images = screenshotFolder.getFiles();
  var count = 0;
  var appendedAnyContent = false;

  body.appendPageBreak();
  body.appendParagraph("SUPPORTING DOCUMENTATION — OFFER & COMP SCREENSHOTS")
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);

  while (images.hasNext()) {
    var file = images.next();
    var mime = file.getMimeType();
    if (mime === MimeType.PNG || mime === MimeType.JPEG || mime === 'image/jpeg' || mime === 'image/png') {
      body.appendParagraph(file.getName()).setHeading(DocumentApp.ParagraphHeading.HEADING3);
      var img = body.appendImage(file.getBlob());
      var maxWidth = 500;
      if (img.getWidth() > maxWidth) {
        var ratio = maxWidth / img.getWidth();
        img.setWidth(maxWidth);
        img.setHeight(Math.round(img.getHeight() * ratio));
      }
      body.appendParagraph("");
      count++;
      appendedAnyContent = true;
    }
  }

  if (!appendedAnyContent) {
    ui.alert("The 'Screenshots' folder was found but had no image files in it.");
    return;
  }

  reportDoc.saveAndClose();
  ui.alert("✅ Appended " + count + " screenshot(s) to the end of: " + reportDoc.getName());
}

function generateClientFile() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert("Select a client row.");

  var result = generateClientFileForRow(activeRow);
  if (!result.success) {
    ui.alert(result.message);
    return;
  }
  ui.alert(`Created folder & docs for ${result.clientName}!`);
}

// Refreshes an ALREADY-GENERATED doc so it reflects whatever's currently
// in the sheet — e.g. valuation figures you've updated since the doc was
// first created. Document generation is a one-time snapshot: {{tags}}
// get replaced with real text the moment the doc is made, so editing the
// sheet afterward has nothing left to find-and-replace. This re-copies a
// clean master template (which has intact tags again) and re-fills it
// with the current row data, replacing the old doc in the SAME existing
// folder — it does not create a duplicate new folder.
//
// ⚠️ This will discard anything typed directly into the old doc that
// isn't in the sheet — manual notes, handwritten edits, anything added
// after the doc was generated. It only pulls from the sheet.
function regenerateDocsForRow() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const activeRow = activeFileRow_();
  if (activeRow <= 1) return ui.alert("Select a client row first.");

  ensureMainWidth_(sheet);
  const rowData = sheet.getRange(activeRow, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const headers = sheet.getRange(1, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const clientName = rowData[0];
  const intendedUse = rowData[25];
  const existingFolderUrl = rowData[27];
  const existingDocUrls = String(rowData[28] || '').split('\n');

  if (!existingFolderUrl) {
    return ui.alert("No documents have been generated yet for this row — run Step 4 (Create Client Folder & Master Docs) first, not this.");
  }

  const docIdArray = getDocIdArray_(intendedUse);
  if (!docIdArray) {
    return ui.alert("Can't regenerate — \"" + intendedUse + "\" doesn't match a known claim type.");
  }
  const directDV = isDirectDV_(intendedUse);   // direct DV has no intake form: every listed doc is a report
  if (docIdArray.length < 2 && !directDV) {
    return ui.alert("This claim type only has an Intake Form — there's no separate report document to regenerate, and the signed Intake Form itself is never touched by this.");
  }

  // docIdArray[0] is ALWAYS the Intake Form — this never gets regenerated.
  // Once a client has signed it, it needs to stay exactly as it was at
  // signing. Only the report document(s) — docIdArray[1] onward — reflect
  // updated sheet data here.
  const reportDocIds = directDV ? docIdArray.slice() : docIdArray.slice(1);
  const intakeCopiedName = directDV ? '\u0000none' : `${DriveApp.getFileById(getTemplateId(docIdArray[0])).getName()} - ${clientName}`;

  const confirmRes = ui.alert(
    "Regenerate Report Document?",
    "This replaces the existing appraisal REPORT for " + clientName + " with a fresh copy filled from the CURRENT sheet data.\n\n" +
    "The signed Intake Form is never touched — it stays exactly as it was when signed.\n\n" +
    "⚠️ Anything typed directly into the old report that isn't in the sheet — manual notes, handwritten edits — will be lost. Only what's in the sheet carries over.\n\n" +
    "Continue?",
    ui.ButtonSet.YES_NO
  );
  if (confirmRes !== ui.Button.YES) return;

  const folderIdMatch = existingFolderUrl.match(/[-\w]{25,}/);
  if (!folderIdMatch) return ui.alert("Couldn't read the existing folder link — it may have been moved or deleted. Run Step 4 again instead.");

  let clientFolder, completedFolder;
  try {
    clientFolder = DriveApp.getFolderById(folderIdMatch[0]);
    const completedIter = clientFolder.getFoldersByName("Completed");
    if (!completedIter.hasNext()) return ui.alert("Couldn't find the 'Completed' subfolder inside the client folder.");
    completedFolder = completedIter.next();
  } catch (folderErr) {
    return ui.alert("Couldn't open the existing folder — it may have been moved or deleted. Run Step 4 again instead.\n\n" + folderErr);
  }

  // Build the exact set of report filenames to trash — explicitly
  // excluding the Intake Form's filename, so it's never at risk even if
  // its name happens to also contain the client's name.
  const reportCopiedNames = reportDocIds.map(docId => `${DriveApp.getFileById(getTemplateId(docId)).getName()} - ${clientName}`);
  const oldFiles = completedFolder.getFiles();
  while (oldFiles.hasNext()) {
    const f = oldFiles.next();
    if (f.getName() === intakeCopiedName) continue; // never trash the signed Intake Form
    if (reportCopiedNames.indexOf(f.getName()) !== -1) f.setTrashed(true);
  }

  let newReportUrls = [];
  reportDocIds.forEach((docId) => {
    const masterFile = DriveApp.getFileById(getTemplateId(docId));
    const copiedFile = masterFile.makeCopy(`${masterFile.getName()} - ${clientName}`, completedFolder);
    replaceTagsInDoc(copiedFile.getId(), headers, rowData);
    newReportUrls.push(copiedFile.getUrl());
  });

  // Keep the existing Intake Form URL (index 0) exactly as it was; only
  // the report URL(s) after it get replaced.
  const finalDocUrls = directDV ? newReportUrls : [existingDocUrls[0] || ''].concat(newReportUrls);
  sheet.getRange(activeRow, 29).setValue(finalDocUrls.join("\n"));
  sheet.getRange(activeRow, 30).setValue("Report Regenerated From Sheet — " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy h:mm a"));

  ui.alert("✅ Report regenerated with the current sheet data (Intake Form untouched):\n\n" + newReportUrls.join("\n"));
}

// Core folder+document generation logic, extracted so it can be called
// programmatically (from the portal's auto-intake handler below) as well
// as from the menu button above — same result either way.
function generateClientFileForRow(activeRow) {
  const sheet = getMainSheet();
  ensureMainWidth_(sheet);
  const headers = sheet.getRange(1, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const rowData = sheet.getRange(activeRow, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const clientName = rowData[0];
  const intendedUse = rowData[25];

  const parentFoldersIter = DriveApp.getFoldersByName(MAIN_FOLDER_NAME);
  const parentFolder = parentFoldersIter.hasNext() ? parentFoldersIter.next() : DriveApp.createFolder(MAIN_FOLDER_NAME);
  let typeFolderIter = parentFolder.getFoldersByName(intendedUse);
  let typeFolder = typeFolderIter.hasNext() ? typeFolderIter.next() : parentFolder.createFolder(intendedUse);
  
  const dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM-dd-yyyy");
  const clientFolder = typeFolder.createFolder(`${clientName} - ${dateStr}`);
  const completedFolder = clientFolder.createFolder("Completed");
  completedFolder.createFolder("Final Appraisal PDF");
  completedFolder.createFolder("Photos");

  const docIdArray = getDocIdArray_(intendedUse);
  if (!docIdArray) {
    return {
      success: false,
      message: "Can't create documents — \"" + intendedUse + "\" doesn't exactly match a known claim type.\n\n" +
      (isNcDv_(intendedUse) ? "The NC Appraisal Clause DV templates aren't installed yet - run Setup & Help > Install NC Appraisal Clause DV Templates first.\n\n" : "") +
      "This usually means Intended Use is blank (common right after New Manual Entry, before a type is picked) " +
      "or was typed instead of selected from the dropdown.\n\n" +
      "Valid values are:\n" + Object.keys(MASTER_DOC_MAP).join("\n")
    };
  }
  let generatedDocUrls = [];
  let generatedDocIds = [];
  docIdArray.forEach((docId) => {
    const masterFile = DriveApp.getFileById(getTemplateId(docId));
    const copiedFile = masterFile.makeCopy(`${masterFile.getName()} - ${clientName}`, completedFolder);
    replaceTagsInDoc(copiedFile.getId(), headers, rowData);
    generatedDocUrls.push(copiedFile.getUrl());
    generatedDocIds.push(copiedFile.getId());
  });

  sheet.getRange(activeRow, 28).setValue(clientFolder.getUrl());
  sheet.getRange(activeRow, 29).setValue(generatedDocUrls.join("\n"));
  sheet.getRange(activeRow, 30).setValue("Folders & Docs Created");

  return {
    success: true,
    clientName: clientName,
    intendedUse: intendedUse,
    clientFolder: clientFolder,
    completedFolder: completedFolder,
    docUrls: generatedDocUrls,
    docIds: generatedDocIds // docIds[0] is always the Intake Form doc — every MASTER_DOC_MAP entry lists it first
  };
}

// Every template still carrying the old number gets the right one, body + headers + footers.
function fixPhoneInDoc_(doc) {
  const pat = '\\(?910\\)?[ .-]?613[ .-]?6001';
  try { doc.getBody().replaceText(pat, OWNER_PHONE); } catch (e) {}
  try { const h = doc.getHeader(); if (h) h.replaceText(pat, OWNER_PHONE); } catch (e) {}
  try { const f = doc.getFooter(); if (f) f.replaceText(pat, OWNER_PHONE); } catch (e) {}
}

function replaceTagsInDoc(docId, headers, rowData) {
  const doc = DocumentApp.openById(docId);
  const tz = Session.getScriptTimeZone();
  const todayStr = Utilities.formatDate(new Date(), tz, "MM/dd/yyyy");

  function getValue(idx) {
    const val = rowData[idx];
    if (val === null || val === undefined) return '';
    return val instanceof Date ? Utilities.formatDate(val, tz, "MM/dd/yyyy") : String(val);
  }
  function money(idx) {
    const v = rowData[idx];
    return (v === '' || v === null || v === undefined) ? '' : fmtMoney(v);
  }
  function miles(idx) {
    const v = rowData[idx];
    return (v === '' || v === null || v === undefined) ? '' : fmtMiles(v);
  }
  // Trade-in dealer names as typed in the sheet. Older rows with no name typed keep the old CarMax/Carvana labels.
  const dealerNames = {
    d1: getValue(COL_DEALER1_NAME - 1).trim() || (toNum(rowData[53]) > 0 ? 'CarMax' : 'Dealer 1'),
    d2: getValue(COL_DEALER2_NAME - 1).trim() || (toNum(rowData[55]) > 0 ? 'Carvana' : 'Dealer 2'),
    d3: getValue(57).trim() || '3rd Dealer'
  };
  function naIfBlank(v) { return String(v === null || v === undefined ? '' : v).trim() === '' ? 'N/A' : v; }   // blank claim/adjuster/at-fault fields print as N/A
  function withOptions(notes, optText) {
    notes = String(notes || '').trim();
    return optText ? (notes ? notes + '\n' + optText : optText) : notes;
  }
  function withNotes(autoText, notesIdx) {
    const notes = getValue(notesIdx).trim();
    return notes ? autoText + '\n' + notes : autoText;
  }

  const math = calculateAppraisalMetrics(rowValuesToMathInput(rowData));
  const gurusPct = math.carGurusPct;

  const tags = {
    // Calculated values (the templates no longer put a "$ " in front of these)
    '{{Established_Pre_Loss_FMV}}': fmtMoney(math.baseFMV),
    '{{Established_Post_Repair_FMV}}': fmtMoney(math.postRepairFMV),
    '{{Base_FMV}}': fmtMoney(math.baseFMV),
    '{{Historical_FMV}}': fmtMoney(math.historicalFMV),
    '{{FMV_Today_Avg}}': fmtMoney(math.fmvTodayAvg),
    '{{Pre_Trade_Avg}}': fmtMoney(math.preAccidentTradeAvg),
    '{{Post_Trade_Avg}}': fmtMoney(math.postAccidentTradeAvg),
    '{{Trade_Diff}}': fmtMoney(math.tradeDiff),
    '{{Pct_DV}}': (math.pctLoss || 0).toFixed(2) + '%',
    '{{Raw_DV}}': fmtMoney(math.rawDV),
    '{{Prior_Damage_Deduct}}': fmtMoney(math.priorDamageDeduct),
    '{{Final_DV}}': fmtMoney(math.finalInherentDV),
    '{{Total_Loss_ACV}}': fmtMoney(math.finalTotalLossACV),
    '{{Avg_Dealer_Fee}}': fmtMoney(math.avgDealerFee),
    '{{Tax_And_Title}}': fmtMoney((math.salesTaxVal || 0) + (math.tagTitleVal || 0)),

    // Comps — including the mileage math shown for each comp
    '{{Rate_Per_Mile}}': rowData[61] === '' ? '' : fmtRate(rowData[61]) + ' per mile',
    '{{Comp_1_Adj}}': math.c1Val ? fmtMoney(math.c1Val) : '', '{{Comp_2_Adj}}': math.c2Val ? fmtMoney(math.c2Val) : '', '{{Comp_3_Adj}}': math.c3Val ? fmtMoney(math.c3Val) : '',
    '{{Comp_1_Mile_Diff}}': math.c1DiffText, '{{Comp_2_Mile_Diff}}': math.c2DiffText, '{{Comp_3_Mile_Diff}}': math.c3DiffText,
    '{{Comp_1_Mile_Math}}': withNotes(math.c1Math, 67), '{{Comp_2_Mile_Math}}': withNotes(math.c2Math, 73), '{{Comp_3_Mile_Math}}': withNotes(math.c3Math, 79),
    '{{Comp_1_Price}}': money(62), '{{Comp_1_Dealer}}': getValue(63), '{{Comp_1_Date}}': getValue(64), '{{Comp_1_Miles}}': miles(65), '{{Comp_1_Fee}}': money(66), '{{Comp_1_Notes}}': withOptions(getValue(67), math.c1OptText), '{{Comp_1_Options_Adj}}': math.c1OptAdj ? ((math.c1OptAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(math.c1OptAdj))) : '',
    '{{Comp_2_Price}}': money(68), '{{Comp_2_Dealer}}': getValue(69), '{{Comp_2_Date}}': getValue(70), '{{Comp_2_Miles}}': miles(71), '{{Comp_2_Fee}}': money(72), '{{Comp_2_Notes}}': withOptions(getValue(73), math.c2OptText), '{{Comp_2_Options_Adj}}': math.c2OptAdj ? ((math.c2OptAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(math.c2OptAdj))) : '',
    '{{Comp_3_Price}}': money(74), '{{Comp_3_Dealer}}': getValue(75), '{{Comp_3_Date}}': getValue(76), '{{Comp_3_Miles}}': miles(77), '{{Comp_3_Fee}}': money(78), '{{Comp_3_Notes}}': withOptions(getValue(79), math.c3OptText), '{{Comp_3_Options_Adj}}': math.c3OptAdj ? ((math.c3OptAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(math.c3OptAdj))) : '',

    // Historical (CarGurus)
    '{{CarGurus_Date}}': getValue(81),
    '{{CarGurus_Pct}}': (rowData[82] === '' || rowData[82] === null) ? '' : (gurusPct > 0 ? '+' : '') + gurusPct.toFixed(2) + '%',

    // Notes
    '{{Title_Brand_Notes}}': getValue(37), '{{Condition_Notes}}': getValue(39), '{{History_Notes}}': getValue(40),
    '{{Repair_Notes}}': getValue(43), '{{NADA_Notes}}': getValue(47), '{{KBB_Notes}}': getValue(51),
    '{{Trade_In_Comp_Notes}}': getValue(52), '{{Trade_Valuation_Notes}}': getValue(60),
    '{{FMV_Comp_Notes}}': getValue(80), '{{Historical_Notes}}': getValue(83), '{{Valuation_Notes}}': withOptions(getValue(85), math.subjectOptText),
    '{{Subject_Options_Adj}}': math.subjectOptAdj ? ((math.subjectOptAdj > 0 ? '+' : '−') + fmtMoney(Math.abs(math.subjectOptAdj))) : '',
    '{{Subject_Options_Notes}}': math.subjectOptText,
    '{{Final_Repair_Bill}}': money(41),

    // Dates
    '{{Doc_Created_Date}}': todayStr, '{{Report_Date}}': todayStr, '{{Appraisal_Date}}': todayStr,

    // Client & claim
    '{{Client_Name}}': getValue(0), '{{Phone}}': getValue(1), '{{Address}}': getValue(2),
    '{{Mailing_Address}}': getValue(3) || getValue(2), '{{Email_Address}}': getValue(4),
    '{{Date_of_Loss}}': getValue(5), '{{Date_Repaired}}': getValue(6), '{{Carrier}}': naIfBlank(getValue(7)),
    '{{Party_Type}}': getValue(8), '{{Claim_Number}}': naIfBlank(getValue(9)), '{{Adj_Name}}': naIfBlank(getValue(10)),
    '{{Adj_Phone}}': naIfBlank(getValue(11)), '{{Adj_Email}}': naIfBlank(getValue(12)), '{{Loss_State}}': getValue(13),
    '{{At_Fault_Driver}}': naIfBlank(getValue(14)),

    // Vehicle
    '{{Year}}': getValue(15), '{{VIN}}': getValue(16), '{{Make}}': getValue(17), '{{Model}}': getValue(18),
    '{{Trim}}': getValue(19), '{{Mileage}}': miles(20), '{{Plate}}': getValue(21), '{{Reg_State}}': getValue(22),
    '{{Color}}': getValue(23), '{{Intended_Use}}': getValue(25), '{{Appraisal_ID}}': getValue(30),

    // Trade-in values & dealer offers
    '{{NADA_Val}}': money(44), '{{NADA_Date}}': getValue(45), '{{NADA_Definition}}': getValue(46),
    '{{KBB_Val}}': money(48), '{{KBB_Date}}': getValue(49), '{{KBB_Definition}}': getValue(50),
    '{{CarMax_Offer}}': money(53), '{{CarMax_Date}}': getValue(54),
    '{{Carvana_Offer}}': money(55), '{{Carvana_Date}}': getValue(56),
    '{{Dealer1_Name}}': dealerNames.d1, '{{Dealer1_Offer}}': money(53), '{{Dealer1_Date}}': getValue(54),
    '{{Dealer2_Name}}': dealerNames.d2, '{{Dealer2_Offer}}': money(55), '{{Dealer2_Date}}': getValue(56),
    '{{Dealer3_Name}}': dealerNames.d3, '{{Dealer3_Offer}}': money(58), '{{Dealer3_Date}}': getValue(59),

    // Appraisal Award Document — anything not in the sheet becomes a fill-in-the-blank line
    '{{Award_Value}}': (rowData[COL_AWARD_ACV - 1] !== undefined && rowData[COL_AWARD_ACV - 1] !== '' && toNum(rowData[COL_AWARD_ACV - 1]) > 0) ? fmtMoney(rowData[COL_AWARD_ACV - 1]) : '$ ____________________',
    '{{Award_ACV}}': (rowData[COL_AWARD_ACV - 1] !== undefined && rowData[COL_AWARD_ACV - 1] !== '' && toNum(rowData[COL_AWARD_ACV - 1]) > 0) ? fmtMoney(rowData[COL_AWARD_ACV - 1]) : '$ ____________________',
    '{{Carrier_Appraiser_Name}}': getValue(COL_CARRIER_APPRAISER - 1).trim() || '______________________________',
    '{{Carrier_Appraiser_Company}}': getValue(COL_CARRIER_APPRAISER_CO - 1).trim() || '______________________________'
  };

  // Offer amount: only filled once there IS an offer. Leaving the tag in
  // place lets Step 7 (Update Settlement Offer Amount) fill it in later —
  // previously it was blanked here, so Step 7 had nothing left to replace.
  if (rowData[32] !== '' && rowData[32] !== null && rowData[32] !== undefined && toNum(rowData[32]) > 0) {
    tags['{{Offer_Amount}}'] = fmtMoney(rowData[32]);
  }

  Object.keys(tags).forEach(tag => fillTag(doc, tag, tags[tag]));
  markCheckboxes_(doc, rowData);
  renameDealersInDoc_(doc, dealerNames, [getValue(63).trim(), getValue(69).trim(), getValue(75).trim()]);
  fixPhoneInDoc_(doc);
  cleanDollarSigns_(doc);

  doc.saveAndClose();
}

function createClientOfferDoc() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const activeRow = activeFileRow_();

  if (activeRow <= 1) return ui.alert("Select a client row.");

  const rowData = sheet.getRange(activeRow, 1, 1, 35).getValues()[0];
  let rawAmount = rowData[32];

  if (!rawAmount) {
    const promptRes = ui.prompt("Enter Final Settlement Offer", "Column AG is empty. Enter offer amount ($):", ui.ButtonSet.OK_CANCEL);
    if (promptRes.getSelectedButton() !== ui.Button.OK) return;
    rawAmount = parseFloat(promptRes.getResponseText().replace(/[^0-9.]/g, '')).toFixed(2);
    sheet.getRange(activeRow, 33).setValue(rawAmount);
  }

  const finalAmount = toNum(rawAmount);
  const filled = updateOfferDocAmount(rowData[27], finalAmount);

  if (!filled) {
    return ui.alert("⚠️ Couldn't find an {{Offer_Amount}} spot to fill in this client's Offer document.\n\n" +
      "Either the Offer doc hasn't been created yet (run Step 4), or it was created before this fix and the spot was already blanked. " +
      "Run ↻ Regenerate Report Only (Refresh From Sheet) for this row — it rebuilds the Offer doc with " + fmtMoney(finalAmount) + " filled in.");
  }
  ui.alert(`Settlement offer document updated with ${fmtMoney(finalAmount)}!`);
}

// =====================================================================
//  WAVE INVOICING
//  Each invoice "kind" is matched to a Wave product by words in the
//  product NAME or DESCRIPTION (case-insensitive). If nothing matches,
//  NO invoice is sent - it never silently falls back to the first product
//  (that was why Wave kept showing one product name). Run
//  diagnoseWaveSetup() from the Apps Script editor to see what each kind
//  resolves to.
// =====================================================================
const WAVE_API = 'https://gql.waveapps.com/graphql/public';
const SHOP_PROMO_DISCOUNT = 0.15;   // partner-shop customers: 15% off every payment

// Diminished Value with NO insurance company involved: one flat invoice ($299), sent after the appraisal is finished,
// report e-mailed automatically once it is paid. No shop-code discount. Identified by "No Insurer" in Intended Use.
// Any appraisal-clause file: NC DV appraisal clause, 1st-party appraisal clause disputes, and "Insurance Total Loss ACV Dispute".
function isAppraisalClauseAny_(use) { return /appraisal clause|acv dispute/i.test(String(use || '')); }
function isAppraisalClauseDV_(intendedUse) {
  const u = String(intendedUse || '').toLowerCase();
  return u.includes('diminished value') && u.includes('appraisal clause');
}
// Any diminished-value claim that goes to a client for approval (insurer DV and North Carolina appraisal-clause DV).
function isDvApprovalType_(use) { return isInsurerDV_(use) || isAppraisalClauseDV_(use) || isDirectDV_(use) || /diminished value/i.test(String(use || '')); }
function isDirectDV_(intendedUse) { return String(intendedUse || '').toLowerCase().includes('no insurer'); }
// The 2-step insurer-claim Diminished Value flow ($199 retainer + $299 after offer).
function isInsurerDV_(intendedUse) {
  const u = String(intendedUse || '');
  return !isDirectDV_(u) && !isAppraisalClauseDV_(u) && (u.toLowerCase().includes('diminished value') || u.includes('3rd-Party'));
}

const WAVE_KINDS = {
  DV_RETAINER: { all: ['diminished'], any: ['retainer', 'initial', 'intake', 'down', 'deposit'], none: ['final', 'balance', 'remaining', 'deferred', 'direct', 'no insurer', 'appraisal clause'], fallbackPrice: 199 },
  DV_FINAL:    { all: ['diminished'], any: ['final', 'balance', 'remaining', 'deferred'], none: ['retainer', 'initial', 'intake', 'down', 'deposit', 'direct', 'no insurer', 'appraisal clause'], fallbackPrice: 299 },
  DV_DIRECT:   { all: ['diminished'], any: ['direct', 'no insurer', 'without insurer', 'no insurance'], none: ['retainer', 'initial', 'intake', 'down', 'deposit', 'balance', 'remaining', 'deferred', 'appraisal clause'], fallbackPrice: 299 },
  DV_APPRAISAL_CLAUSE: { all: ['diminished', 'appraisal clause'], any: [], none: ['retainer', 'initial', 'intake', 'down', 'deposit', 'balance', 'remaining', 'deferred', 'direct', 'no insurer'], fallbackPrice: 299 },
  TOTAL_LOSS:  { all: ['total loss'], any: [], none: ['diminished'], fallbackPrice: 299 },
  STANDARD:    { all: [], any: ['estate', 'probate', 'bank', 'collateral', 'irs', 'donation', 'divorce', 'fair market', 'fmv', 'standard'], none: ['diminished', 'total loss'], fallbackPrice: 299 }
};

function waveGql_(query, variables) {
  try {
    const res = UrlFetchApp.fetch(WAVE_API, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      headers: { 'Authorization': 'Bearer ' + WAVE_ACCESS_TOKEN },
      payload: JSON.stringify({ query: query, variables: variables || {} })
    });
    const json = JSON.parse(res.getContentText());
    if (json.errors && json.errors.length) console.error('Wave GraphQL error: ' + JSON.stringify(json.errors));
    return json;
  } catch (e) {
    console.error('Wave request failed: ' + e);
    return { errors: [{ message: String(e) }] };
  }
}

function waveBusinessId_() {
  return WAVE_BUSINESS_ID.startsWith('QnVzaW5lc3M') ? WAVE_BUSINESS_ID : Utilities.base64Encode('Business:' + WAVE_BUSINESS_ID);
}

function listWaveProducts_() {
  const json = waveGql_(
    `query ($businessId: ID!) { business(id: $businessId) { products(page: 1, pageSize: 100) { edges { node { id name description unitPrice isArchived } } } } }`,
    { businessId: waveBusinessId_() });
  const edges = (json.data && json.data.business && json.data.business.products && json.data.business.products.edges) || [];
  return edges.map(e => e.node).filter(p => !p.isArchived);
}

function resolveWaveProduct_(kind, products) {
  const cfg = WAVE_KINDS[kind];
  if (!cfg) return null;
  let best = null, bestScore = -1;
  (products || listWaveProducts_()).forEach(p => {
    const text = ((p.name || '') + ' ' + (p.description || '')).toLowerCase();
    if (!cfg.all.every(w => text.includes(w))) return;
    if (cfg.none.some(w => text.includes(w))) return;
    const hits = cfg.any.filter(w => text.includes(w)).length;
    if (cfg.any.length && hits === 0) return;
    if (hits > bestScore) { best = p; bestScore = hits; }
  });
  if (!best) return null;
  return { id: best.id, name: best.name, description: best.description || '', unitPrice: best.unitPrice ? parseFloat(best.unitPrice) : null };
}

// Reuses an existing Wave customer with the same email, otherwise creates one.
function getOrCreateWaveCustomer_(bizId, name, email) {
  const want = String(email || '').trim().toLowerCase();
  for (let page = 1; page <= 10 && want; page++) {
    const json = waveGql_(
      `query ($businessId: ID!, $page: Int!) { business(id: $businessId) { customers(page: $page, pageSize: 100) { pageInfo { totalPages } edges { node { id email } } } } }`,
      { businessId: bizId, page: page });
    const conn = json.data && json.data.business && json.data.business.customers;
    if (!conn) break;
    const hit = conn.edges.map(e => e.node).find(c => String(c.email || '').trim().toLowerCase() === want);
    if (hit) return hit.id;
    if (page >= (conn.pageInfo ? conn.pageInfo.totalPages : 1)) break;
  }
  const created = waveGql_(
    `mutation ($input: CustomerCreateInput!) { customerCreate(input: $input) { didSucceed inputErrors { message path } customer { id } } }`,
    { input: { businessId: bizId, name: name, email: email } });
  return (created.data && created.data.customerCreate && created.data.customerCreate.customer && created.data.customerCreate.customer.id) || null;
}

// Returns the shop promo code logged for this client email (Referral Redemptions tab), or ''.
function getShopPromoForEmail_(email) {
  const sheet = getWorkingSpreadsheet().getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!sheet || !email) return '';
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return '';
  const clean = sanitizeEmail(email);
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  for (let i = 0; i < data.length; i++) {
    if (sanitizeEmail(data[i][3]) === clean) return String(data[i][0]).trim().toUpperCase();
  }
  return '';
}

// Marks the first not-yet-qualified redemption for this email as qualified ($50 owed to the shop) and emails Kevin.
function qualifyReferralForEmail_(email) {
  const sheet = getWorkingSpreadsheet().getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!sheet || !email) return;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  const clean = sanitizeEmail(email);
  const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  for (let i = 0; i < data.length; i++) {
    if (sanitizeEmail(data[i][3]) === clean && !data[i][7]) {
      const row = i + 2, now = new Date();
      sheet.getRange(row, 8).setValue(now);
      sheet.getRange(row, 9).setValue('Owed');
      sheet.getRange(row, 10).setValue(now);
      try {
        MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '🤝 Referral Qualified — $50 Owed to ' + data[i][1],
          data[i][1] + ' referred ' + data[i][3] + ', promo code ' + data[i][0] + '. They have been invoiced, so a $50 payout is now owed. Mark it "Paid" in the "' + REFERRAL_REDEMPTIONS_SHEET_NAME + '" tab once sent.');
      } catch (e) {}
      return;
    }
  }
}

/**
 * Creates, approves and SENDS a Wave invoice.
 * kind: DV_RETAINER | DV_FINAL | TOTAL_LOSS | STANDARD
 * opts: { promoCode, priceOverride, descSuffix }
 * Returns { ok, id, sent, error, price } - id is set whenever an invoice exists in Wave, even if sending failed.
 */
// "2019 Honda Accord (VIN ...)" from the client's own row, for the invoice line.
function invVehicle_(sheet, row) {
  try { const r = sheet.getRange(row, 1, 1, 35).getValues()[0]; const v = vehicleForName_(r); const vin = String(r[16] || '').trim(); return (v + (vin ? ' (VIN ' + vin + ')' : '')).trim(); } catch (e) { return ''; }
}
// What the invoice WILL look like (nothing is created). Used by createWaveInvoice and by the Actions review box.
function waveInvoiceDraft_(kind, opts) {
  opts = opts || {};
  const product = resolveWaveProduct_(kind);
  if (!product) return { error: 'No Wave product matched "' + kind + '". Run diagnoseWaveSetup() and check the product names/descriptions in Wave.' };
  let price = opts.priceOverride > 0 ? opts.priceOverride : ((product.unitPrice && product.unitPrice > 0) ? product.unitPrice : WAVE_KINDS[kind].fallbackPrice);
  let desc = opts.vehicle ? (product.name + ' - ' + opts.vehicle) : (product.description || product.name);   // vehicle comes from THIS client's row, never from the saved Wave product text
  if (opts.promoCode) {
    price = Math.round(price * (1 - SHOP_PROMO_DISCOUNT) * 100) / 100;
    desc += ' (Partner shop code ' + opts.promoCode + ' - ' + Math.round(SHOP_PROMO_DISCOUNT * 100) + '% off)';
  }
  if (opts.descSuffix) desc += ' ' + opts.descSuffix;
  return { product: product, price: price, desc: desc, subject: 'Invoice from Estimate Consultants: ' + product.name, message: 'Thank you for choosing Estimate Consultants. Please review and complete payment using the link in this invoice.' };
}
function createWaveInvoice(clientName, clientEmail, kind, opts) {
  opts = opts || {};
  if (!clientEmail) return { ok: false, id: null, sent: false, price: 0, error: 'Client email is missing.' };
  const bizId = waveBusinessId_();
  const draft = waveInvoiceDraft_(kind, opts);
  if (draft.error) return { ok: false, id: null, sent: false, price: 0, error: draft.error };
  const product = draft.product;
  let price = draft.price, desc = draft.desc;
  // values you typed on the review box win over the defaults
  if (opts.finalPrice > 0) price = opts.finalPrice;
  if (opts.descFull) desc = String(opts.descFull);

  const customerId = getOrCreateWaveCustomer_(bizId, clientName, clientEmail);
  if (!customerId) return { ok: false, id: null, sent: false, price: price, error: 'Could not find or create the Wave customer.' };

  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const inv = waveGql_(
    `mutation ($input: InvoiceCreateInput!) { invoiceCreate(input: $input) { didSucceed inputErrors { message path } invoice { id } } }`,
    { input: Object.assign({ businessId: bizId, customerId: customerId, invoiceDate: today, items: [{ productId: product.id, description: desc, unitPrice: price.toFixed(2), quantity: 1 }] }, opts.invoiceNumber ? { invoiceNumber: String(opts.invoiceNumber).trim() } : {}) });
  const invoiceId = inv.data && inv.data.invoiceCreate && inv.data.invoiceCreate.invoice && inv.data.invoiceCreate.invoice.id;
  if (!invoiceId) return { ok: false, id: null, sent: false, price: price, error: 'Wave refused to create the invoice: ' + JSON.stringify((inv.data && inv.data.invoiceCreate && inv.data.invoiceCreate.inputErrors) || inv.errors || '') };

  const appr = waveGql_(`mutation ($input: InvoiceApproveInput!) { invoiceApprove(input: $input) { didSucceed inputErrors { message } } }`, { input: { invoiceId: invoiceId } });
  const approved = !!(appr.data && appr.data.invoiceApprove && appr.data.invoiceApprove.didSucceed);

  let sent = false;
  if (approved) {
    const snd = waveGql_(
      `mutation ($input: InvoiceSendInput!) { invoiceSend(input: $input) { didSucceed inputErrors { message } } }`,
      { input: { invoiceId: invoiceId, to: [clientEmail], attachPDF: true, subject: String(opts.waveSubject || draft.subject), message: String(opts.waveMessage || draft.message), ccMyself: !!opts.ccMe } });
    sent = !!(snd.data && snd.data.invoiceSend && snd.data.invoiceSend.didSucceed);
  }
  const ok = approved && sent;
  if (ok && opts.promoCode) { try { qualifyReferralForEmail_(clientEmail); } catch (e) {} }
  return { ok: ok, id: invoiceId, sent: sent, price: price, error: ok ? '' : (approved ? 'Invoice was created and approved but Wave did not send it - send it from Wave.' : 'Invoice was created but Wave did not approve it - finish it in Wave.') };
}

// Menu: tie a partner-shop code to the selected client (for call/text clients who never used the portal form).
function applyShopPromoToActiveRow() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const row = activeFileRow_();
  if (row <= 1) return ui.alert('Select a client row first.');
  const d = sheet.getRange(row, 1, 1, 35).getValues()[0];
  const name = d[0], email = d[4];
  if (!email) return ui.alert('Client email is missing in Column E.');
  if (isDirectDV_(d[25])) return ui.alert('Shop codes do not apply to the Direct (no-insurer) Diminished Value appraisal.');

  const existing = getShopPromoForEmail_(email);
  if (existing) return ui.alert('Shop code ' + existing + ' is already applied to ' + email + '. All of their invoices get ' + Math.round(SHOP_PROMO_DISCOUNT * 100) + '% off.');

  const res = ui.prompt('Apply Shop Promo Code', 'Shop code for ' + name + ' (e.g. PRECISION):', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const code = res.getResponseText().trim().toUpperCase();
  const v = validateReferralCode(code);
  if (!v.valid) return ui.alert('That code was not applied: ' + v.reason);

  const sessionId = String(sheet.getRange(row, 93).getValue() || '') || ('MANUAL-' + row + '-' + Date.now());
  const vehicle = [d[15], d[17], d[18]].filter(Boolean).join(' ');
  logReferralRedemptionIfValid(code, name, email, vehicle, sessionId, row);
  ui.alert('✅ ' + v.shopName + ' (' + code + ') applied. ' + Math.round(SHOP_PROMO_DISCOUNT * 100) + '% off will be taken on every invoice sent to ' + email + '.');
}

// Menu "Step 6" for Total Loss / 1st-party / Estate / Bank / IRS / Divorce:
// sends this row's invoice if none exists yet, then checks payments and delivers the report.
function sendFinalInvoiceAndDeliver() {
  const ui = SpreadsheetApp.getUi();
  const row = activeFileRow_();
  if (row > 1) { if (sendFinalInvoiceCore_(row, ui) === false) return; }
  checkStatusAndDeliver();
}

// Creates + sends the final invoice for non-insurer-DV types. Returns false if it should stop.
function invoiceKindForUse_(intendedUse) {
  const direct = isDirectDV_(intendedUse);
  return direct ? 'DV_DIRECT' : (isAppraisalClauseDV_(intendedUse) ? 'DV_APPRAISAL_CLAUSE' : (intendedUse.toLowerCase().includes('total loss') ? 'TOTAL_LOSS' : 'STANDARD'));
}
function sendFinalInvoiceCore_(row, ui, ov) {
  ov = ov || {};
  const sheet = getMainSheet();
  const d = sheet.getRange(row, 1, 1, 35).getValues()[0];
  const intendedUse = String(d[25] || '');
  if (isInsurerDV_(intendedUse)) { ui.alert('This is a Diminished Value claim - use Step 8 (Send Final Offer Signing Link & $299 Fee Invoice).'); return false; }
  if (!d[31]) {
    if (isDirectDV_(intendedUse) && !d[27]) { ui.alert('Run Step 4 (Create Client Folder & Master Docs) first - the report is delivered from that folder when the invoice is paid.'); return false; }
    const direct = isDirectDV_(intendedUse);
    const kind = direct ? 'DV_DIRECT' : (isAppraisalClauseDV_(intendedUse) ? 'DV_APPRAISAL_CLAUSE' : (intendedUse.toLowerCase().includes('total loss') ? 'TOTAL_LOSS' : 'STANDARD'));
    const r = createWaveInvoice(d[0], d[4], kind, Object.assign({ promoCode: direct ? '' : getShopPromoForEmail_(d[4]), vehicle: invVehicle_(sheet, row) }, ov));
    if (r.id) sheet.getRange(row, 32).setValue(r.id);
    if (r.ok) {
      sheet.getRange(row, 30).setValue('Invoice Sent, Awaiting Payment ⏳').setBackground('#fff3cd').setFontColor('#856404');
      ui.alert('Invoice for $' + r.price.toFixed(2) + ' sent to ' + d[4] + '.');
    } else {
      sheet.getRange(row, 30).setValue(r.id ? '⚠️ Invoice created but NOT sent - send it from Wave' : '⚠️ Invoice FAILED - see message').setBackground('#f8d7da').setFontColor('#721c24');
      ui.alert('⚠️ ' + r.error);
      return false;
    }
  }
  return true;
}

function checkStatusAndDeliver() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;   // another run (or a menu click) is in progress
  try {
    checkStatusAndDeliverInner_();
  } finally {
    lock.releaseLock();
  }
}

function checkStatusAndDeliverInner_() {
  syncFollowUpHighlightsAcrossTabs();

  const sheet = getMainSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  ensureMainWidth_(sheet);
  const data = sheet.getRange(1, 1, lastRow, MAIN_ROW_WIDTH).getValues();
  const ownerEmail = ADMIN_NOTIFICATION_EMAIL;

  for (let i = 1; i < data.length; i++) {
    const clientName = data[i][0];
    const clientEmail = data[i][4];
    const intendedUse = String(data[i][25] || '');
    const folderUrl = data[i][27];
    const status = String(data[i][29] || '');

    let authWaveInvId = data[i][31];
    let finalWaveInvId = data[i][34];

    const isDV = isInsurerDV_(intendedUse);

    // 🌐 PORTAL SUBMISSIONS AWAITING DOC GENERATION — deferred here
    // specifically so the customer's browser doesn't have to sit through
    // Drive doc creation + a Wave invoice round trip when they hit
    // Submit. Picked up on whatever the next 5-minute run is.
    if (status === "Portal Submission Received — Pending Doc Generation") {
      try {
        processPortalIntakeDocs(i + 1);
      } catch (portalErr) {
        console.error("processPortalIntakeDocs failed for row " + (i + 1) + ": " + portalErr);
        sheet.getRange(i + 1, 30).setValue("Portal Intake — Doc Generation Failed (see logs)");
      }
      continue;
    }

    // 💸 MANUAL INVOICING ONLY — previously this auto-sent an invoice the
    // moment Auth was signed, regardless of whether the actual appraisal
    // work was done yet. Now it just flags the file as ready and notifies
    // Kevin, who sends the invoice himself via Step 5/6 once the work is
    // genuinely complete.
    if (!isDV && !authWaveInvId && !finalWaveInvId && folderUrl && status.includes('Auth Signed') && !status.includes('Ready to Invoice')) {
      sheet.getRange(i + 1, 30).setValue("Auth Signed — Ready to Invoice When Complete").setBackground("#fff3cd").setFontColor("#856404");
      try {
        GmailApp.sendEmail(ownerEmail, `✍️ Auth Signed: ${clientName}`,
          `${clientName} (${clientEmail}) has signed their Intake/Auth form for: ${intendedUse}.\n\n` +
          `No invoice has been sent — invoicing is manual now. Once the appraisal work is actually complete, send it yourself via Step 5 (retainer) or Step 6/8 (final) for this row.\n\nFolder: ${folderUrl}`);
      } catch (mailErr) {}
    }

    // Payments -> delivery requests (nothing is emailed to a client until you approve it).
    if (isDV) {
      if (finalWaveInvId && !status.includes('Paid in Full') && checkWavePaymentStatus(finalWaveInvId)) {
        sheet.getRange(i + 1, 30).setValue('Paid in Full ✅').setBackground('#d1ecf1').setFontColor('#0c5460');
        try { GmailApp.sendEmail(ownerEmail, `💰 Final payment received: ${clientName}`, `${clientName} paid the final DV invoice.`); } catch (m) {}
        continue;
      }
      // Finished FULL appraisal PDF ready -> ask YOU to approve sending it to the client (no payment needed at this stage)
      if (folderUrl && /Auth Signed/.test(status) && !/Delivered|Client OK|Client Declined|Demand|Final Offer|Paid in Full/.test(status)) {
        const fp = findFolderPdf_(folderUrl);
        if (fp && /Full Appraisal\.pdf$/i.test(fp.getName())) { requestApprovalOnce_(sheet, i + 1, 'deliver'); continue; }
      }
    } else {
      const activeInvoiceId = finalWaveInvId || authWaveInvId;
      if (activeInvoiceId && !status.includes('Delivered') && folderUrl && findFolderPdf_(folderUrl)) {
        let paidNow = checkWavePaymentStatus(activeInvoiceId);
        if (!paidNow) {   // the invoice may have been replaced/renumbered in Wave: follow a PAID one created for this client after the stored one
          try {
            const alt = findReplacementPaidInvoice_(activeInvoiceId, clientName, clientEmail);
            if (alt) { sheet.getRange(i + 1, finalWaveInvId ? 35 : 32).setValue(alt.id); paidNow = true; try { GmailApp.sendEmail(ownerEmail, 'ℹ️ Invoice ID updated - ' + clientName, 'The invoice saved in the sheet was not paid, but Wave shows invoice #' + alt.number + ' for ' + clientEmail + ' PAID. The sheet now points to #' + alt.number + ' and the report is being delivered.'); } catch (e9) {} }
          } catch (e8) { console.error('replacement invoice lookup: ' + e8); }
        }
        if (paidNow) { requestApprovalOnce_(sheet, i + 1, 'deliver'); continue; }
      }
    }
    scanRowForApprovals_(sheet, i + 1, data[i], status, authWaveInvId, finalWaveInvId, folderUrl);
  }
  try { refreshActiveFiles(); } catch (e) { console.error('refreshActiveFiles: ' + e); }
  try { refreshClosedFiles_(); } catch (e) { console.error('refreshClosedFiles_: ' + e); }
}

// Shows exactly which invoice IDs the sheet holds for the selected client and what Wave reports for each.
function checkInvoiceNow() {
  const ui = SpreadsheetApp.getUi(); const row = activeFileRow_();
  if (row <= 1) return ui.alert('Select a client row first.');
  const d = getMainSheet().getRange(row, 1, 1, 35).getValues()[0];
  const lines = ['Client: ' + d[0] + '   Status: ' + d[29], ''];
  [['Column AF (retainer / first invoice)', d[31]], ['Column AI (final invoice)', d[34]]].forEach(function(x) {
    if (!x[1]) { lines.push(x[0] + ': (empty)'); return; }
    try {
      const j = waveGql_('query ($id: ID!) { node(id: $id) { ... on Invoice { invoiceNumber status total { value } amountDue { value } amountPaid { value } customer { name email } } } }', { id: String(x[1]) });
      const n = j.data && j.data.node;
      lines.push(x[0] + ':\n   ' + (n ? '#' + n.invoiceNumber + ' - ' + (n.customer && n.customer.name) + ' - status ' + n.status + ' - total ' + (n.total && n.total.value) + ', paid ' + (n.amountPaid && n.amountPaid.value) + ', due ' + (n.amountDue && n.amountDue.value) : 'Wave found no invoice with that ID (' + JSON.stringify(j.errors || '') + ')'));
    } catch (e) { lines.push(x[0] + ': error ' + e); }
  });
  lines.push('', 'The script delivers when the invoice it uses (final if present, else first) shows PAID or amount due 0.');
  ui.alert(lines.join('\n'));
}
// If the invoice saved in the sheet isn't paid, look for a PAID invoice for the same client created on/after it (e.g. you re-issued or renumbered it in Wave).
function findReplacementPaidInvoice_(oldId, clientName, clientEmail) {
  const bizId = waveBusinessId_();
  const o = waveGql_('query ($id: ID!) { node(id: $id) { ... on Invoice { createdAt customer { id } } } }', { id: String(oldId) });
  const on = o.data && o.data.node; if (!on || !on.createdAt) return null;
  const custId = (on.customer && on.customer.id) || getOrCreateWaveCustomer_(bizId, clientName, clientEmail);
  if (!custId) return null;
  const j = waveGql_('query ($b: ID!, $c: ID!) { business(id: $b) { invoices(page: 1, pageSize: 25, customerId: $c) { edges { node { id invoiceNumber status createdAt amountDue { value } } } } } }', { b: bizId, c: custId });
  const edges = (j.data && j.data.business && j.data.business.invoices && j.data.business.invoices.edges) || [];
  const since = new Date(on.createdAt).getTime() - 60000;
  const hits = edges.map(function(e) { return e.node; }).filter(function(n) { return n && n.id !== String(oldId) && new Date(n.createdAt).getTime() >= since && (n.status === 'PAID' || (n.amountDue && parseFloat(n.amountDue.value) === 0 && n.status !== 'DRAFT')); });
  return hits.length === 1 ? { id: hits[0].id, number: hits[0].invoiceNumber } : null;
}
function checkWavePaymentStatus(invoiceId) {
  const json = waveGql_(`query ($id: ID!) { node(id: $id) { ... on Invoice { status amountDue { value } } } }`, { id: invoiceId });
  const node = json.data && json.data.node;
  if (!node) return false;
  if (node.status === 'PAID') return true;
  const due = node.amountDue ? parseFloat(node.amountDue.value) : NaN;
  return !isNaN(due) && due === 0 && node.status !== 'DRAFT';
}

// Run from the Apps Script editor (Run > diagnoseWaveSetup, then View > Logs).
function diagnoseWaveSetup() {
  const out = [];
  const products = listWaveProducts_();
  out.push('Wave products found: ' + products.length);
  products.forEach(p => out.push('  • "' + p.name + '"  $' + p.unitPrice + '  - ' + (p.description || '(no description)')));
  Object.keys(WAVE_KINDS).forEach(k => {
    const m = resolveWaveProduct_(k, products);
    out.push(k + '  ->  ' + (m ? '"' + m.name + '" @ $' + m.unitPrice + ' (expected about $' + WAVE_KINDS[k].fallbackPrice + ')' : 'NO MATCH - a Wave product name/description must contain: ' + WAVE_KINDS[k].all.concat(WAVE_KINDS[k].any.length ? ['one of ' + WAVE_KINDS[k].any.join('/')] : []).join(' + ')));
  });
  const trig = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'checkStatusAndDeliver');
  out.push(trig.length ? 'OK: 5-minute payment check trigger is installed.' : 'MISSING: no 5-minute trigger - paid invoices will not auto-deliver reports. Run menu "Enable Automatic 5-Min Payment Check".');
  Logger.log(out.join('\n'));
  return out.join('\n');
}

// Builds the subject/body of the email that carries the final PDF.
// Action-needed wording: Total Loss, 1st-Party Appraisal Clause Dispute, and Diminished Value WITH an insurer (client decides whether to proceed with the insurer).
// Everything else (incl. direct/no-insurer Diminished Value): plain delivery wording.
// ============================================================================
//  DELIVERY EMAILS (with one-click "OK to proceed")  +  PROSPECT EMAILS  +  SAMPLE REPORT
// ============================================================================
const SAMPLE_REPORT_PROP = 'SAMPLE_REPORT_FILE_ID';
const OWNER_PHONE = '910-333-6001';

function escHtml_(t) { return String(t === null || t === undefined ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ---- one-click confirmation link (rides on the same sign.estimateconsultants.com page as the signing links) ----
function proceedToken_(row, purpose) {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('PROCEED_SECRET');
  if (!secret) { secret = Utilities.getUuid() + Utilities.getUuid(); props.setProperty('PROCEED_SECRET', secret); }
  const sig = Utilities.computeHmacSha256Signature((purpose || 'proceed') + ':' + row, secret);
  return Utilities.base64EncodeWebSafe(sig).replace(/=+$/, '').substring(0, 24);
}
function proceedLink_(row) { return WEBSITE_SIGNING_URL + '?row=' + row + '&type=proceed&t=' + proceedToken_(row); }
function actionLink_(row, type) { return WEBSITE_SIGNING_URL + '?row=' + row + '&type=' + type + '&t=' + proceedToken_(row, type); }

function proceedPageHtml_(title, bodyHtml) {
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><base target="_top"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>' +
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f4f6f9;margin:0;display:flex;justify-content:center;padding-top:40px}' +
    '.card{background:#fff;padding:32px 24px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,.06);max-width:92%;width:520px;color:#333}' +
    'h2{color:#1c4587;margin:0 0 10px;font-size:22px}p{line-height:1.5;font-size:15px}.box{display:flex;gap:10px;align-items:flex-start;background:#f0f5ff;border:1px solid #c7d7f5;border-radius:8px;padding:12px;margin:16px 0}' +
    '.box input{margin-top:3px;transform:scale(1.3)}button{background:#1c4587;color:#fff;border:0;border-radius:8px;padding:13px 18px;font-size:16px;font-weight:bold;width:100%;cursor:pointer}button:disabled{background:#9aa9c4;cursor:not-allowed}' +
    '.ok{color:#137333}.err{color:#c5221f}.big{font-size:52px;text-align:center}</style></head><body><div class="card">' + bodyHtml + '</div></body></html>'
  ).setTitle(title).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Called from doGet when ?type=proceed
function proceedProcessName_(use) { return /appraisal clause|total loss/i.test(String(use || '')) || deliveryVariant_(use) === 'acDV' || deliveryVariant_(use) === 'acTL' ? 'Appraisal Clause Process' : 'Diminished Value Process'; }
const PROCEED_ACK_ = 'I understand that this valuation is not likely to be the amount I will receive. This valuation is likely on the higher end, the insurer\'s valuation will likely be on the lower end, and we will work to reach a fair valuation somewhere in the middle.';
function proceedConfirmPage_(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r)) {
    return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2><p>This confirmation link is invalid or incomplete. Please reply to your appraisal email and we will take care of it.</p>');
  }
  const sheet = getMainSheet();
  const d = sheet.getRange(r, 1, 1, 35).getValues()[0];
  const veh = vehicleFromRow_(d);
  const st = String(d[29] || '');
  if (st.indexOf('Client OK to Proceed') === 0 || /Demand Emailed|Final Offer|Offer Signed|Award|Paid in Full/.test(st)) {
    return proceedPageHtml_('Already Confirmed', '<div class="big">✅</div><h2>Already confirmed</h2><p>We already have your go-ahead' + (veh ? ' for your ' + escHtml_(veh) : '') + ' and the process is underway. Questions? Call ' + OWNER_PHONE + '.</p>');
  }
  const proc = proceedProcessName_(d[25]);
  const was = st.indexOf('Client Declined') === 0 ? '<p style="background:#fff8e1;border:1px solid #ffe08a;border-radius:6px;padding:8px">You previously chose not to proceed. You can change your mind below.</p>' : '';
  const html = '<h2>Approve &amp; Proceed &mdash; ' + proc + '</h2>' + was + '<p>' + (veh ? 'Vehicle: <strong>' + escHtml_(veh) + '</strong><br>' : '') +
    'Please review your ASCAA Certified Appraisal and the letter that would be filed. Then check both boxes below to approve. A copy of your approval and your appraisal will be emailed to you.</p>' +
    '<label class="box"><input type="checkbox" id="c" onchange="chk()"><span>I have reviewed my appraisal and I authorize Estimate Consultants to proceed with the ' + proc + ' described in the email.</span></label>' +
    '<label class="box"><input type="checkbox" id="c2" onchange="chk()"><span>' + escHtml_(PROCEED_ACK_) + '</span></label>' +
    '<button id="b" disabled onclick="go(\'yes\')">Approve &amp; Proceed with the ' + proc + '</button>' +
    '<p style="text-align:center;margin:14px 0 0"><button id="n" style="background:none;color:#64748b;border:0;text-decoration:underline;font-size:14px;width:auto;padding:4px" onclick="go(\'no\')">I do not want to proceed</button></p><p id="m"></p>' +
    '<script>function chk(){document.getElementById("b").disabled=!(document.getElementById("c").checked&&document.getElementById("c2").checked)}function go(w){var b=document.getElementById("b"),n=document.getElementById("n");if(w==="no"&&!confirm("Are you sure you do not want us to proceed?"))return;b.disabled=true;n.disabled=true;(w==="yes"?b:n).textContent="Submitting...";' +
    'var ok=function(res){var card=document.querySelector(".card");if(res&&res.ok){card.innerHTML=w==="yes"?\'<div class="big">✅</div><h2>Thank you &mdash; we are proceeding</h2><p>Your confirmation was received. We will begin right away and keep you updated by email. A copy of your decision and your appraisal is on its way to your inbox.</p>\':\'<div class="big">📄</div><h2>Your decision was recorded</h2><p>We will not proceed. A copy of your decision and your appraisal is on its way to your inbox. If you change your mind, just reply to that email or call ' + OWNER_PHONE + '.</p>\'}' +
    'else{b.disabled=false;n.disabled=false;b.textContent="Approve & Proceed";n.textContent="No — Do Not Proceed";chk();document.getElementById("m").className="err";document.getElementById("m").textContent=(res&&res.error)||"Something went wrong."}};' +
    'var bad=function(e){b.disabled=false;n.disabled=false;document.getElementById("m").className="err";document.getElementById("m").textContent="Error: "+e.message};' +
    'var run=google.script.run.withSuccessHandler(ok).withFailureHandler(bad);if(w==="yes")run.confirmClientProceed(' + r + ',"' + token + '");else run.declineClientProceed(' + r + ',"' + token + '")}</script>';
  return proceedPageHtml_('Your Decision - Estimate Consultants', html);
}

// Emails the client a copy of their decision, with the appraisal they reviewed attached.
function emailClientDecisionCopy_(r, d, decision, stamp) {
  const to = String(d[4] || '').trim(); if (!to) return false;
  const first = String(d[0] || '').trim().split(/\s+/)[0] || 'there';
  const veh = vehicleFromRow_(d);
  const yes = decision === 'proceed';
  const subject = (yes ? 'Confirmed: we are proceeding' : 'Recorded: you chose not to proceed') + (veh ? ' - ' + veh : '');
  const text = 'Hello ' + first + ',\n\n' + (yes
    ? 'This confirms that on ' + stamp + ' you reviewed your ASCAA Certified Appraisal' + (veh ? ' for your ' + veh : '') + ' and authorized Estimate Consultants to proceed with the ' + proceedProcessName_(d[25]) + '. You acknowledged the following: "' + PROCEED_ACK_ + '"\n\nI will formally begin the process and keep you updated by email.'
    : 'This confirms that on ' + stamp + ' you reviewed your ASCAA Certified Appraisal' + (veh ? ' for your ' + veh : '') + ' and chose not to proceed at this time. Nothing will be filed or sent to the insurance company on your behalf. If you change your mind, just reply to this email or call ' + OWNER_PHONE + ' and we can pick up where we left off.') +
    '\n\nA copy of your appraisal is attached for your records.\n\nKevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
  const opt = { name: 'Estimate Consultants', replyTo: 'kevin@estimateconsultants.com' };
  try { const f = findFolderPdf_(d[27]); if (f && f.getSize() < 20 * 1024 * 1024) opt.attachments = [f.getBlob()]; } catch (e) {}
  GmailApp.sendEmail(to, subject, text, opt);
  return true;
}

function confirmClientProceed(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r)) return { ok: false, error: 'Invalid link.' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getMainSheet();
    const d = sheet.getRange(r, 1, 1, 35).getValues()[0];
    if (String(d[29] || '').indexOf('Client OK to Proceed') === 0) return { ok: true };
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM d, yyyy h:mm a z');
    sheet.getRange(r, 30).setValue('Client OK to Proceed ✅').setBackground('#d4edda').setFontColor('#155724');
    sheet.getRange(r, 30).setNote('Client approved on ' + stamp + ' and checked the acknowledgment: ' + PROCEED_ACK_);
    try { addProgressNoteToRow(r, 'Client approved to proceed (' + stamp + ') and acknowledged the valuation is not likely the final amount.'); } catch (e0) {}
    const veh = vehicleFromRow_(d);
    GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '✅ Client OK to Proceed: ' + d[0] + (veh ? ' - ' + veh : ''),
      d[0] + ' (' + d[4] + ') confirmed they want to proceed.\nType: ' + d[25] + '\nVehicle: ' + veh + '\nCarrier: ' + (d[7] || 'N/A') + '   Claim #: ' + (d[9] || 'N/A') + '\nConfirmed: ' + stamp + '\nSheet row: ' + r +
      '\n\nA copy of their decision + appraisal was emailed to them. A separate email with the demand letter preview and an Approve & Send button follows.');
    try { emailClientDecisionCopy_(r, d, 'proceed', stamp); } catch (e1) { GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, 'Could not email the client their confirmation copy: ' + d[0], String(e1)); }
    try { if (APPROVAL_REQUIRED.demand) requestDemandApproval_(r); else sendDemandForRow_(r); } catch (e2) { GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, 'Could not prepare demand approval: ' + d[0], String(e2)); }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally { lock.releaseLock(); }
}

function declineClientProceed(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r)) return { ok: false, error: 'Invalid link.' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = getMainSheet();
    const d = sheet.getRange(r, 1, 1, 35).getValues()[0];
    const st = String(d[29] || '');
    if (st.indexOf('Client Declined') === 0) return { ok: true };
    if (st.indexOf('Client OK to Proceed') === 0 || /Demand Emailed|Final Offer|Offer Signed|Award|Paid in Full/.test(st)) return { ok: false, error: 'We already began work on your case. Please call ' + OWNER_PHONE + '.' };
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM d, yyyy h:mm a z');
    sheet.getRange(r, 30).setValue('Client Declined to Proceed ❌').setBackground('#f8d7da').setFontColor('#721c24');
    sheet.getRange(r, 30).setNote('Client clicked "Do Not Proceed" on ' + stamp);
    try { addProgressNoteToRow(r, 'Client chose NOT to proceed (' + stamp + '). Nothing was sent to the insurer.'); } catch (e0) {}
    const veh = vehicleFromRow_(d);
    GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '❌ Client chose NOT to proceed: ' + d[0] + (veh ? ' - ' + veh : ''),
      d[0] + ' (' + d[4] + ') reviewed the appraisal and chose NOT to proceed.\nType: ' + d[25] + '\nVehicle: ' + veh + '\nDecided: ' + stamp + '\nSheet row: ' + r +
      '\n\nNothing was sent to the insurer. A copy of their decision + appraisal was emailed to them. You may want to follow up by phone (' + (d[1] || 'no phone on file') + ') or close the file.');
    try { emailClientDecisionCopy_(r, d, 'decline', stamp); } catch (e1) { GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, 'Could not email the client their decision copy: ' + d[0], String(e1)); }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally { lock.releaseLock(); }
}

// ---- delivery email variants ----
function deliveryVariant_(use) {
  use = String(use || '');
  const low = use.toLowerCase();
  if (isAppraisalClauseDV_(use)) return 'acDV';
  if (isInsurerDV_(use)) return 'insurerDV';
  if (low.includes('total loss') || use.includes('1st-Party Policy Appraisal Clause')) return 'acTL';
  return 'plain';
}

function deliverySections_(variant) {
  if (variant === 'insurerDV') return [
    ['Next Steps', [
      'I will not proceed until you give me the OK after reviewing the report. Once you click the button above, I will send the demand letter to the insurer and begin the Diminished Value process.',
      'We set our calendar to follow up with the insurer, answer any pushback they have, and do everything in our power to receive an offer that matches our appraised valuation. The remaining $299 is invoiced at the time of the insurer\'s offer.',
      'Our Guarantee: if the insurer\'s offer does not at least cover our fee, the fee will be refunded and you keep the Certified Appraisal for free to use in next steps (typically small claims) to recover the diminished value.']]
  ];
  if (variant === 'acTL' || variant === 'acDV') {
    const dv = variant === 'acDV';
    return [
      ['Next Steps', [
        'I will not proceed until you give me the OK after reviewing the report. Once you click the button above, I will begin the Appraisal Clause process with the insurer\'s appraiser and send the formal notice to the insurer.',
        'We each write our appraisals and work toward a fair valuation. More often than not mine is on the higher end and theirs on the lower end, and we meet somewhere in the middle through discussion. ' + (dv ? 'Your report shows the Inherent Diminished Value figure we enter the negotiation at; the payout is unlikely to be exactly that number and will more likely land between the insurer\'s appraiser\'s valuation and ours.' : 'Your report shows the value we enter the negotiation at; the final figure is more likely to land between the insurer\'s appraiser\'s valuation and ours.')]],
      ['If we cannot agree: the umpire', [
        'If our appraisals are in different ballparks, an umpire (a third appraiser) is hired. If any 2 of the 3 appraisers agree on a valuation, that is the binding valuation.',
        'The umpire\'s cost is split 50/50 between you and the insurer, typically roughly $300 extra on your side (roughly $600 total). It is not usually necessary, and sometimes small concessions on the valuation make more sense than hiring one. I will always make a well-informed decision in your best interest.']],
      ['Timeframes', [
        'Roughly 1-2 weeks once we begin, unless an umpire is needed, in which case I would anticipate 3-4 weeks total.',
        'Once an agreement is reached you will receive the "Award Letter", which is the binding value, and you can then move forward with the insurer for payment. I will keep you updated every step of the way.']]
    ];
  }
  return [];
}

function buildFinalPdfEmail_(info) {
  info = info || {};
  const use = String(info.intendedUse || '');
  const variant = deliveryVariant_(use);
  const actionNeeded = variant !== 'plain';
  const first = String(info.clientName || '').trim().split(/\s+/)[0] || 'there';
  const vehicle = String(info.vehicle || '').trim();
  const link = (actionNeeded && info.row) ? proceedLink_(info.row) : '';
  const procName = proceedProcessName_(use);

  const intro = ['Attached is a copy of your ASCAA Certified Appraisal.  All documentation and methodology can be found within the report.'];
  if (actionNeeded) intro.push('Please review it, and when you are ready, click the button below to give us the go-ahead and we will formally begin the process.');
  const outro = ['Please let us know if you have any questions.', 'Thank You!'];
  const sections = deliverySections_(variant);

  const subject = (actionNeeded ? 'Action Needed: ' : '') + 'Your ASCAA Certified Appraisal' + (vehicle ? ' - ' + vehicle : '');

  const sigText = 'Kevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
  let text = (actionNeeded ? 'ACTION NEEDED\n\n' : '') + 'Hello ' + first + ',\n\n' + intro.join('\n\n') + '\n\n';
  if (link) text += 'APPROVE & PROCEED WITH THE ' + procName.toUpperCase() + ' (no signature needed; a copy is emailed to you):\n' + link + '\n\n';
  sections.forEach(function(s) { text += s[0].toUpperCase() + '\n' + s[1].join('\n') + '\n\n'; });
  text += outro.join('\n\n') + '\n\n' + sigText;

  let html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.5;max-width:640px">' +
    (actionNeeded ? '<p style="font-size:16px;margin:0 0 12px"><strong>Action Needed</strong>' + (vehicle ? ' &mdash; ' + escHtml_(vehicle) + ' Appraisal' : '') + '</p>' : '') +
    '<p>Hello ' + escHtml_(first) + ',</p>' + intro.map(function(p) { return '<p>' + escHtml_(p) + '</p>'; }).join('');
  if (link) {
    html += '<p style="margin:18px 0"><a href="' + link + '" style="background:#1c4587;color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:6px;font-weight:bold;display:inline-block">&#9989; Approve &amp; Proceed with the ' + procName + '</a><br>' +
      '<span style="font-size:12px;color:#666">No signature needed. You\'ll confirm on a short page, and a copy is emailed to you.</span></p>';
  }
  sections.forEach(function(s) {
    html += '<p style="margin:16px 0 4px"><strong>' + escHtml_(s[0]) + '</strong></p>' + s[1].map(function(p) { return '<p style="margin:0 0 8px">' + escHtml_(p) + '</p>'; }).join('');
  });
  html += outro.map(function(p) { return '<p>' + escHtml_(p) + '</p>'; }).join('') +
    '<p>Kevin Murty<br>Estimate Consultants<br>' + OWNER_PHONE + '<br><a href="mailto:kevin@estimateconsultants.com">kevin@estimateconsultants.com</a></p></div>';
  return { subject: subject, text: text, html: html };
}

// ---- sample report storage ----
function showSampleReportUpload() {
  let current = 'None uploaded yet';
  try {
    const id = PropertiesService.getScriptProperties().getProperty(SAMPLE_REPORT_PROP);
    if (id) current = DriveApp.getFileById(id).getName();
  } catch (e) { current = 'None (previous file not found)'; }
  const html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,sans-serif;font-size:13px;margin:14px}button{padding:9px 14px;border:0;border-radius:4px;background:#1c4587;color:#fff;font-weight:bold;margin-top:12px;cursor:pointer}#m{margin-top:10px;font-weight:bold}</style></head><body>' +
    '<h3>📎 Sample Report for Prospect Emails</h3><p>Current: <strong>' + escHtml_(current) + '</strong></p>' +
    '<p>Choose a PDF (under about 20 MB). It replaces the current sample.</p><input type="file" id="f" accept="application/pdf"><br><button id="b" onclick="up()">Upload</button><div id="m"></div>' +
    '<script>function up(){var f=document.getElementById("f").files[0],m=document.getElementById("m");if(!f){m.textContent="Pick a file first.";return}' +
    'document.getElementById("b").disabled=true;m.textContent="Uploading...";var rd=new FileReader();rd.onload=function(){var b64=String(rd.result).split(",")[1];' +
    'google.script.run.withSuccessHandler(function(n){m.style.color="#137333";m.textContent="Saved: "+n}).withFailureHandler(function(e){document.getElementById("b").disabled=false;m.style.color="#c5221f";m.textContent=e.message}).saveSampleReport(f.name,f.type||"application/pdf",b64)};rd.readAsDataURL(f)}</script></body></html>'
  ).setWidth(420).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Sample Report');
}

function saveSampleReport(name, mime, b64) {
  const blob = Utilities.newBlob(Utilities.base64Decode(b64), mime || 'application/pdf', name);
  const props = PropertiesService.getScriptProperties();
  const old = props.getProperty(SAMPLE_REPORT_PROP);
  const file = DriveApp.createFile(blob);
  file.setName('SAMPLE REPORT - ' + name.replace(/^SAMPLE REPORT - /, ''));
  props.setProperty(SAMPLE_REPORT_PROP, file.getId());
  if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (e) {} }
  return file.getName();
}

// ---- prospect email tool ----
const PROSPECT_TYPES = [
  { key: 'dv',   label: 'Diminished Value - with insurer ($199 to start, $299 after the offer)', page: '/diminished-value.html' },
  { key: 'tl',   label: 'Total Loss - Policy Appraisal Clause ($299)', page: '/total-loss-appraisal.html' },
  { key: 'ncdv', label: 'North Carolina Diminished Value - Policy Appraisal Clause ($299)', page: '/diminished-value.html' },
  { key: 'dir',  label: 'Diminished Value - no insurer ($299, paid after I finish)', page: '/diminished-value.html' },
  { key: 'gen',  label: 'General follow-up (no pricing)', page: '' }
];

function prospectDescription_(key) {
  const ac = 'In that process my appraisal and the insurer\'s appraiser\'s appraisal are written independently, and we then try to meet at a fair valuation. More often than not mine is on the higher end and theirs on the lower end, and we meet somewhere in the middle through discussion. If we cannot agree, an umpire (a 3rd appraiser) is hired, and if any 2 of the 3 appraisers agree, that is the binding valuation. The umpire\'s cost is split 50/50 between you and the insurer and typically adds roughly $300 extra to your side (roughly $600 total). It is not usually necessary.';
  const acSteps = [
    'Next steps: let me know you would like to proceed and I will draft the intake agreement for you to e-sign, which allows me to be your hired appraiser and speak to the other party about your claim. Within 2-3 business days of the signed form you will receive a $299 invoice from our payment processor, Wave. Once it is paid, the appraisal is delivered within an hour. (That part is automated, so if you do not receive it within a couple of hours, just let me know and I will get it over to you right away.)',
    'I will not proceed with the other appraiser until you review the report and give me the OK. After that, the process typically takes roughly 1-2 weeks, or 3-4 weeks if an umpire is needed. Once an agreement is reached you will receive the "Award Letter", which is the binding value, and you can move forward with the insurer for payment.'];
  if (key === 'dv') return [
    'Our diminished value fee structure is $199 up front and $299 at the time of the insurer\'s offer. We draft the demand letter to the insurer, set our calendar to follow up with them, answer any pushback they have, and do everything in our power to receive an offer that matches our appraised valuation.',
    'Our Guarantee: if the insurer\'s offer does not at least cover our fee, the fee will be refunded and you will have the Certified Appraisal for free to use in next steps (typically small claims) to recover the diminished value.',
    'Our appraisals are completed and delivered within 2-3 business days, and once you give us the OK to proceed after reviewing the appraisal, we send the demand letter and begin the Diminished Value process.'];
  if (key === 'tl') return [
    'Since you and your insurer disagree on the value of the total loss, your policy\'s Appraisal Clause is the route I would recommend. ' + ac,
    'The fee is $299, with no additional charge unless an umpire is needed.'].concat(acSteps);
  if (key === 'ncdv') return [
    'The process is different in North Carolina than in most other states, which is why I want to lay it out. Your policy\'s Appraisal Clause can be used for diminished value. ' + ac,
    'For Appraisal Clause Diminished Value our fee is the normal appraisal price of $299 rather than the $498 diminished value fee. We cannot offer the money-back guarantee on Appraisal Clause DV like we do on normal DV, because the number agreed to with the other appraiser is binding and our compensation has to stay independent of the result.'].concat(acSteps);
  if (key === 'dir') return [
    'For a diminished value appraisal that does not involve an insurance company, I prepare a certified ASCAA appraisal of your vehicle\'s diminished value that you can use however you need.',
    'The fee is $299, and you pay only after I have finished the appraisal. The finished report is emailed to you as soon as the invoice is paid.'];
  return [];
}

function buildProspectEmail_(f) {
  const t = PROSPECT_TYPES.filter(function(x) { return x.key === f.type; })[0] || PROSPECT_TYPES[PROSPECT_TYPES.length - 1];
  const first = String(f.name || '').trim().split(/\s+/)[0] || '';
  const veh = String(f.vehicle || '').trim();
  const paras = [];
  paras.push('Thank you for speaking with me' + (veh ? ' about your ' + veh : '') + '. I appreciate the chance to help.');
  const notes = String(f.notes || '').trim();
  const desc = prospectDescription_(f.type);
  desc.forEach(function(p) { paras.push(p); });
  const link = t.page ? WEBSITE_BASE_URL + t.page : WEBSITE_BASE_URL;
  paras.push('You can get started, or read more, here: ' + link);
  if (f.includeSample) paras.push('I have attached a sample report so you can see exactly what you will receive.');
  paras.push('Please let me know if you have any questions. You can reach me by email or at ' + OWNER_PHONE + '.', 'Thank You!');
  const sig = 'Kevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
  const subject = 'Estimate Consultants - ' + (veh ? 'Your ' + veh + ' Appraisal' : 'Following up on our call');

  // notes go right after the opening line, in Kevin's own words
  const textParts = [first ? 'Hello ' + first + ',' : 'Hello,', paras[0]];
  if (notes) textParts.push(notes);
  textParts.push.apply(textParts, paras.slice(1));
  textParts.push(sig);
  const text = textParts.join('\n\n');

  let html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.5;max-width:640px"><p>' + (first ? 'Hello ' + escHtml_(first) + ',' : 'Hello,') + '</p><p>' + escHtml_(paras[0]) + '</p>';
  if (notes) html += '<p>' + escHtml_(notes).replace(/\n/g, '<br>') + '</p>';
  paras.slice(1).forEach(function(p) {
    html += '<p>' + escHtml_(p).replace(link.replace(/&/g, '&amp;'), '<a href="' + link + '">' + escHtml_(link) + '</a>') + '</p>';
  });
  html += '<p>Kevin Murty<br>Estimate Consultants<br>' + OWNER_PHONE + '<br><a href="mailto:kevin@estimateconsultants.com">kevin@estimateconsultants.com</a></p></div>';
  return { subject: subject, text: text, html: html };
}

function previewProspectEmail(f) { return buildProspectEmail_(f).html; }

function sendProspectEmail(f) {
  const email = String(f.email || '').trim();
  const phone = String(f.phone || '').trim();
  if (!email && !phone) return { ok: false, error: 'Enter at least an email or a phone number.' };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'That email address does not look valid.' };
  if (!email) { logProspect_(f, '', 'Logged only (no email)'); return { ok: true, logged: true }; }
  const mail = buildProspectEmail_(f);
  const opts = { htmlBody: mail.html, name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL };
  if (f.includeSample) {
    const id = PropertiesService.getScriptProperties().getProperty(SAMPLE_REPORT_PROP);
    if (!id) return { ok: false, error: 'No sample report uploaded yet. Use Setup & Help > Upload Sample Report first, or untick the box.' };
    try { opts.attachments = [DriveApp.getFileById(id).getBlob()]; } catch (e) { return { ok: false, error: 'Could not open the sample report file: ' + e }; }
  }
  GmailApp.sendEmail(email, mail.subject, mail.text, opts);
  logProspect_(f, email, f.includeSample ? 'Sent + sample' : 'Sent');
  return { ok: true };
}

function logProspect_(f, email, status) {
  try {
    const ss = getWorkingSpreadsheet();
    let log = ss.getSheetByName('Prospect Emails');
    if (!log) {
      log = ss.insertSheet('Prospect Emails');
      log.getRange(1, 1, 1, 10).setValues([['Date', 'Name', 'Email', 'Phone', 'Vehicle', 'Type', 'Status', 'Notes', 'Extra Info', 'Follow-Up Sent']]).setFontWeight('bold');
      log.setFrozenRows(1);
    }
    const t = PROSPECT_TYPES.filter(function(x) { return x.key === f.type; })[0];
    log.appendRow([new Date(), f.name || '', email || f.email || '', f.phone || '', f.vehicle || '', t ? t.label : f.type, status, f.notes || '', f.info || '']);
  } catch (e) { console.error('Prospect log failed: ' + e); }
}

function showProspectEmailForm() {
  const opts = PROSPECT_TYPES.map(function(t) { return '<option value="' + t.key + '">' + escHtml_(t.label) + '</option>'; }).join('');
  let sampleName = '';
  try { const id = PropertiesService.getScriptProperties().getProperty(SAMPLE_REPORT_PROP); if (id) sampleName = DriveApp.getFileById(id).getName(); } catch (e) {}
  const html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><base target="_top"><style>' +
    'body{font-family:Arial,sans-serif;font-size:13px;margin:14px;color:#222}h3{margin:0 0 8px}label{display:block;font-weight:bold;margin:9px 0 3px;font-size:12px}' +
    'input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;padding:7px;box-sizing:border-box;border:1px solid #bbb;border-radius:4px;font-size:13px;font-family:inherit}' +
    '.row{display:flex;gap:8px}.row>div{flex:1}button{padding:9px 14px;border:0;border-radius:4px;font-weight:bold;cursor:pointer;font-size:13px;margin-top:12px}' +
    '#send{background:#1c4587;color:#fff;width:100%}#prev{background:#e8eaed;width:100%}#msg{margin-top:10px;font-weight:bold}.ok{color:#137333}.err{color:#c5221f}.hint{font-size:11px;color:#666;font-weight:normal}' +
    '#pv{border:1px solid #ccc;border-radius:6px;padding:10px;margin-top:10px;background:#fafafa;display:none}.ck{display:flex;gap:8px;align-items:center;margin-top:12px;font-weight:bold}</style></head><body>' +
    '<h3>✉️ Email a Prospective Client</h3>' +
    '<div class="row"><div><label>Name <span class="hint">(optional)</span></label><input type="text" id="name"></div><div><label>Email <span class="hint">(email or phone required)</span></label><input type="email" id="email"></div></div>' +
    '<div class="row"><div><label>Phone</label><input type="tel" id="phone"></div><div><label>Vehicle <span class="hint">(year / make / model)</span></label><input type="text" id="vehicle"></div></div>' +
    '<label>Other info you have <span class="hint">(for your records, not emailed)</span></label><input type="text" id="info" placeholder="insurer, claim stage, referral source...">' +
    '<label>Type of appraisal</label><select id="type">' + opts + '</select>' +
    '<label>Notes from your conversation <span class="hint">(appears in the email in your words)</span></label><textarea id="notes" rows="5"></textarea>' +
    '<div class="ck"><input type="checkbox" id="sample"><span>Attach sample report' + (sampleName ? ' <span class="hint">(' + escHtml_(sampleName) + ')</span>' : ' <span class="hint err">(none uploaded yet &mdash; Setup &amp; Help &gt; Upload Sample Report)</span>') + '</span></div>' +
    '<button id="prev" onclick="pv()">Preview</button><div id="pv"></div><button id="send" onclick="sd()">Send Email</button><div id="msg"></div>' +
    '<script>function fp(v){v=String(v==null?"":v);var ex="",hasX=false,m=v.match(/(?:ext\\.?|extension|x|#)\\s*(\\d*)\\s*$/i);if(m){hasX=true;ex=m[1];v=v.slice(0,m.index)}var d=v.replace(/\\D/g,"");if(d.length>10&&d.charAt(0)=="1")d=d.slice(1);if(d.length>10){if(!hasX){ex=d.slice(10);hasX=true}d=d.slice(0,10)}var o=d.length>6?d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6):d.length>3?d.slice(0,3)+"-"+d.slice(3):d;return hasX&&d.length===10?(ex?o+" ext. "+ex:o+" x"):o}document.getElementById("phone").addEventListener("input",function(){this.value=fp(this.value)});' +
    'function F(){var g=function(i){return document.getElementById(i).value};return{name:g("name"),email:g("email"),phone:g("phone"),vehicle:g("vehicle"),info:g("info"),type:g("type"),notes:g("notes"),includeSample:document.getElementById("sample").checked}}' +
    'function pv(){google.script.run.withSuccessHandler(function(h){var p=document.getElementById("pv");p.innerHTML=h;p.style.display="block"}).previewProspectEmail(F())}' +
    'function sd(){var f=F(),m=document.getElementById("msg");if(!f.email&&!f.phone){m.className="err";m.textContent="Enter an email or a phone number.";return}if(!f.email){if(!confirm("No email entered - this will only be saved to the Prospect Emails tab. Continue?"))return}else if(!confirm("Send this email to "+f.email+"?"))return;' +
    'var b=document.getElementById("send");b.disabled=true;m.className="";m.textContent="Sending...";google.script.run.withSuccessHandler(function(r){if(r.ok){m.className="ok";m.textContent=r.logged?"Saved to the Prospect Emails tab (no email sent).":"Sent to "+f.email+" (logged on the Prospect Emails tab).";b.disabled=false}else{b.disabled=false;m.className="err";m.textContent=r.error}})' +
    '.withFailureHandler(function(e){b.disabled=false;m.className="err";m.textContent=e.message}).sendProspectEmail(f)}</script></body></html>'
  ).setWidth(560).setHeight(720);
  SpreadsheetApp.getUi().showModalDialog(html, 'Prospect Email');
}

function vehicleFromRow_(d) {   // d = row values (0-based): year 15, make 17, model 18
  return [d[15], d[17], d[18]].filter(function(x) { return x !== '' && x !== null && x !== undefined; }).join(' ');
}

function sendFinalPdfIfAvailable(folderUrl, clientEmail, info) {
  if (!folderUrl) return false;
  const folderIdMatch = folderUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!folderIdMatch) return false;

  const folderId = folderIdMatch[1];
  const completedFolders = DriveApp.getFolderById(folderId).getFoldersByName("Completed");

  if (completedFolders.hasNext()) {
    const finalPdfFolders = completedFolders.next().getFoldersByName("Final Appraisal PDF");
    if (finalPdfFolders.hasNext()) {
      const files = finalPdfFolders.next().getFiles();
      if (files.hasNext()) {
        const finalPdf = files.next();
        const mail = buildFinalPdfEmail_(info);
        const ed = getDeliveryEdits_(info && info.row);   // changes you made on the review box (subject / message / CC)
        const so = { htmlBody: mail.html, attachments: [finalPdf.getAs(MimeType.PDF)] };
        let subj = mail.subject, txt = mail.text;
        if (ed) {
          if (ed.subject) subj = ed.subject;
          if (ed.body && ed.body !== mail.text) { txt = ed.body; so.htmlBody = textToHtml_(ed.body); }
          if (ed.cc) so.cc = ed.cc;
        }
        GmailApp.sendEmail(clientEmail, subj, txt, so);
        clearDeliveryEdits_(info && info.row);
        return true;
      }
    }
  }
  return false;
}

function sendPhotoRequestEmail(clientName, clientEmail, year, make, model, claimType, sessionId) {
  if (!clientEmail) return false;

  try {
    const isDV = String(claimType || '').includes('Diminished Value') || String(claimType || '').includes('3rd-Party');
    const vehicleString = `${year || ''} ${make || ''} ${model || ''}`.trim();
    const subject = `Next Steps for Your ${vehicleString || 'Vehicle'} Appraisal — Photos Needed`;
    const followUpLink = `${WEBSITE_BASE_URL}/intake-form.html?sid=${encodeURIComponent(sessionId || '')}`;

    let body = `Hello ${clientName || 'there'},\n\n`;
    body += `Thank you for reaching out to Estimate Consultants about your ${vehicleString || 'vehicle'}. `;
    body += `To get your appraisal moving, please reply to this email with the photos listed in the attached Vehicle Photo Guide.\n\n`;
    body += `Please also fill in any remaining details on your vehicle/claim here — anything we already have is pre-filled, and only the fields relevant to your claim type are shown:\n`;
    body += `${followUpLink}\n\n`;

    if (isDV) {
      body += `Since this is a Diminished Value claim, please also include your FINAL REPAIR ESTIMATE along with the photos — this is required before we can complete your appraisal.\n\n`;
      body += `Once we have everything, we'll review it against our qualification criteria and follow up with your appraisal as soon as possible.\n\n`;
    } else {
      body += `Once we receive everything, we'll review it against our qualification criteria and follow up with next steps as soon as possible.\n\n`;
    }

    body += `If you have any questions in the meantime, just reply to this email or call us at 910-333-6001.\n\n`;
    body += `Thank you,\nKevin Murty\nEstimate Consultants`;

    const options = {};
    if (PHOTO_GUIDE_FILE_ID && PHOTO_GUIDE_FILE_ID !== 'PASTE_PHOTO_GUIDE_DRIVE_FILE_ID_HERE') {
      try {
        options.attachments = [DriveApp.getFileById(PHOTO_GUIDE_FILE_ID).getBlob()];
      } catch (attachErr) {
        console.error("Photo Guide attachment failed (sending without it): " + attachErr);
      }
    } else {
      console.warn("PHOTO_GUIDE_FILE_ID not configured — sending photo request email without the attachment.");
    }

    GmailApp.sendEmail(clientEmail, subject, body, options);
    return true;
  } catch (err) {
    console.error("sendPhotoRequestEmail failed: " + err);
    return false;
  }
}

function testReportDelivery() {
  const ui = SpreadsheetApp.getUi();
  const sheet = getMainSheet();
  const activeRow = activeFileRow_();

  if (activeRow <= 1) return ui.alert("Please select a client row first.");

  const rowData = sheet.getRange(activeRow, 1, 1, 35).getValues()[0];
  const clientName = rowData[0];
  const clientEmail = rowData[4];
  const folderUrl = rowData[27];

  if (!folderUrl) return ui.alert("Error: Folder URL is missing in Column AB.");

  ui.alert(`Testing delivery for ${clientName} (${clientEmail})...`);

  if (sendFinalPdfIfAvailable(folderUrl, clientEmail, { clientName: clientName, intendedUse: String(rowData[25] || ''), vehicle: vehicleFromRow_(rowData), row: activeRow })) {
    sheet.getRange(activeRow, 30).setValue("Paid & Final PDF Delivered ✅").setBackground("#d1ecf1").setFontColor("#0c5460");
    ui.alert(`🎉 Success! Report PDF was emailed to ${clientEmail} and status updated in Sheet.`);
  } else {
    ui.alert(`⚠️ Could not find a PDF in 'Completed/Final Appraisal PDF'. Please make sure a PDF is placed inside that Drive subfolder first.`);
  }
}

function showHowToGuide() {
  var ss = getWorkingSpreadsheet();
  var sheetName = "\ud83d\udcd6 How-To Guide";
  var existing = ss.getSheetByName(sheetName);
  if (existing) ss.deleteSheet(existing);
  var sheet = ss.insertSheet(sheetName);

  var NAVY = "#0f172a";
  var GOLD = "#d97706";
  var LIGHT = "#f8fafc";

  var rows = [
    { type: "title", text: "ESTIMATE CONSULTANTS \u2014 HOW-TO GUIDE" },
    { type: "note", text: "Almost everything now runs itself. Your job is to (1) do the appraisal work, (2) keep progress notes current, and (3) click Approve on the emails the system prepares for you. Nothing is sent to a client, adjuster or carrier until you approve it, except paid reports, which go out immediately." },
    { type: "blank", text: "" },
    { type: "section", text: "\u2600\ufe0f YOUR DAILY ROUTINE (5 minutes)" },
    { type: "step", text: "1. Read the \u2600\ufe0f Daily briefing email (about 7 AM). It lists what needs you: weekly client updates to approve, prospects to follow up with, progress notes that are out of date, follow-up dates that are due, and files waiting on an insurer." },
    { type: "step", text: "2. Open the \ud83d\udd25 Active Files tab. It lists every file you are working on, most urgent first. The \"What to do next\" column says exactly what is needed. Red \"Last Note\" means add a progress note." },
    { type: "step", text: "3. Click the Approve links in your email as they arrive. Each link opens a preview of exactly what will be sent. Check it, click Approve & Send, done." },
    { type: "step", text: "4. Do the appraisal work on whichever files say \"Do the appraisal\". Select the file and open \ud83d\udcc2 File Panel from the \ud83d\ude97 Appraisals menu." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\udd25 THE ACTIVE FILES TAB" },
    { type: "step", text: "One row per live file. White columns are editable: type there and it updates the main sheet, the File Panel, and every document and email. Grey columns are status and cannot be edited." },
    { type: "step", text: "\"Add a progress note\" box: type a quick update and press Enter. It is saved with today's date. The Last Note column turns green. Clients get this note in their weekly update." },
    { type: "step", text: "\"Close file\" checkbox: tick it when a file is truly finished. It moves to the 🗄 Closed Files tab (nothing is deleted) - tick Reopen there to bring it back if you closed the wrong one." },
    { type: "step", text: "\ud83d\udce5 Email attachments: every 10 minutes the sheet saves attachments from your clients, adjusters and carrier appraisers into each file's folder (Client Uploads / Insurer Documents). Emails from people who are NOT in the sheet yet show up on the \ud83d\udcec New Emails tab - tick Create client file, or pick an existing file to add that address to it. To pull older emails from any address, use the File Panel \u2192 Exhibits tab \u2192 Pull emails from an address." },
    { type: "step", text: "The tab refreshes itself every few minutes. \ud83d\ude97 Appraisals \u2192 \ud83d\udd25 Refresh Active Files does it right now." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\udcc2 THE FILE PANEL" },
    { type: "step", text: "\ud83d\ude97 Appraisals \u2192 \ud83d\udcc2 Open File Panel. A large window with every field for the selected file, organized in tabs. It follows whichever row you click (in Active Files or Sheet1)." },
    { type: "step", text: "It saves automatically after every change (watch for \"\u2713 Saved\" at the top right). If a save ever fails it tells you and retries on its own. The bottom bar shows the live diminished value and ACV." },
    { type: "step", text: "The Overview tab has buttons for the manual steps (re-run comps, get dealer offers, refresh the report, compile the final PDF) and the progress-note box." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\ude97 LIFE OF A FILE" },
    { type: "step", text: "[Auto] = happens by itself. [You] = your work. [Approve] = you get an email with a preview and one button." },
    { type: "step", text: "ALL TYPES, START: A new client arrives from the website, portal, or \ud83d\ude97 Appraisals \u2192 \u2795 New Client Entry. [Auto] For manual entries with a valid type, the folder and documents are built. [Approve] Send the intake / signing link (insurer DV also gets the $199 retainer). Client e-signs." },
    { type: "step", text: "INSURER DIMINISHED VALUE: [You] Do the appraisal and compile the final PDF. [Auto] Once the $199 retainer is paid, the report is emailed with an OK-to-Proceed button. Client clicks OK. [Approve] The demand letter goes to the adjuster, then you get a certified-mail reminder with a printable label. [Auto] Follow-up emails to the insurer are drafted for you every few business days. [You] When an offer arrives, type it in the Offer Amount column. [Approve] Final offer link and $299 invoice go out." },
    { type: "step", text: "APPRAISAL CLAUSE (TOTAL LOSS or NC DIMINISHED VALUE, $299): [You] Do the appraisal, compile the final PDF. [Approve] The $299 invoice. [Auto] When it is paid, the report is emailed with an OK-to-Proceed button. Client clicks OK. [Approve] The notice of appraisal clause invocation goes to the carrier, plus the certified-mail reminder. [You] When the carrier names an appraiser and you agree on a value, fill in the Carrier Appraiser name, email, company and the Agreed Award Value. [Approve] The award letter is sent to the carrier appraiser to e-sign. [Auto] The signed award is emailed to the appraiser, the client, and the adjuster." },
    { type: "step", text: "TOTAL LOSS / ESTATE / BANK / IRS / OTHER: [You] Do the appraisal, compile the final PDF. [Approve] The invoice. [Auto] The report is emailed the moment it is paid." },
    { type: "step", text: "NO-INSURER DIMINISHED VALUE ($299, no intake): [You] Do the appraisal, compile the final PDF. [Approve] The $299 invoice. [Auto] The report is emailed when it is paid." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\udcdd PROGRESS NOTES AND WEEKLY CLIENT UPDATES" },
    { type: "step", text: "Every active client gets a weekly update email with where things stand, the latest news, and next steps. You approve them all at once: the morning briefing contains a link to a page listing every update with a checkbox for each." },
    { type: "step", text: "The \"latest news\" in that email is your most recent progress note. If the note is more than 7 days old (or there is none), the email says there are no new developments, and the page and briefing flag that client with a warning so you can add a note first. The date of your last note is always shown (Active Files, File Panel)." },
    { type: "step", text: "Add notes in the File Panel, in the Active Files tab, or with \ud83d\ude97 Appraisals \u2192 \ud83d\udcdd Add Progress Note. Each is saved with today's date." },
    { type: "blank", text: "" },
    { type: "section", text: "\u2709\ufe0f EMAILING A PROSPECT" },
    { type: "step", text: "\ud83d\ude97 Appraisals \u2192 \u2709\ufe0f Email a Prospective Client. Enter an email or a phone number (everything else is optional), pick the appraisal type, type your notes from the conversation, tick \"Attach sample report\" if you want it, preview, and send. Every prospect is logged on the Prospect Emails tab. If they have not signed up after 3 days, a follow-up shows up in your daily briefing for approval." },
    { type: "step", text: "Upload the sample report once: \u2699\ufe0f Setup \u2192 Upload Sample Report." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\udcee CERTIFIED MAIL" },
    { type: "step", text: "After a demand or notice is emailed, you get an email with the printable envelope label, the demand letter, and the appraisal attached. Print, mail certified, then click the link in that email and enter the tracking number." },
    { type: "step", text: "Type the carrier's claims mailing address in the Carrier Mailing Address column (Active Files or File Panel \u2192 Claim & Carrier) and it appears on the label." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83d\udd10 APPROVALS: HOW THEY WORK" },
    { type: "step", text: "Each approval email has a link and a preview. Nothing happens until you click Approve & Send. Each step only asks once per file. If you ever need it asked again, clear that file's \"Approval Requested\" cell (the column after Carrier Mailing Address)." },
    { type: "step", text: "To make a step fully automatic later, change its value from true to false in APPROVAL_REQUIRED near the bottom of the script. Paid-report delivery is already set to automatic, because the client is promised the report within an hour of paying." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83e\uddf0 MANUAL STEPS" },
    { type: "step", text: "\ud83d\ude97 Appraisals \u2192 \ud83d\udee0\ufe0f Manual Steps holds every older step (build folder, re-run comps, send intake, send invoice, send demand, create award, and so on) in case you ever need to do one by hand. You should rarely need them." },
    { type: "blank", text: "" },
    { type: "section", text: "\u2699\ufe0f ONE-TIME SETUP CHECKLIST" },
    { type: "step", text: "1. \u2699\ufe0f Setup \u2192 \u26a1 Turn on ALL automations." },
    { type: "step", text: "2. \u2699\ufe0f Setup \u2192 Set up main sheet headers & dropdowns (adds the new columns and the claim-type dropdown)." },
    { type: "step", text: "3. Upload the NC DV Appraisal Clause documents (intake, report, notice, award) and the updated \"5. Appraisal Award Document\" to the Drive folder \"New Templates\", then run Install NC appraisal clause DV templates and Install new document templates." },
    { type: "step", text: "4. In Wave, make sure the invoice products exist ($199 DV retainer, $299 DV final, $299 direct DV, $299 appraisal clause DV, $299 total loss / standard)." },
    { type: "step", text: "5. Deploy a new version of the web app (Deploy \u2192 Manage deployments \u2192 Edit \u2192 New version) so the confirm, approve and e-sign links work." },
    { type: "step", text: "6. Upload your sample report." },
    { type: "blank", text: "" },
    { type: "section", text: "\ud83c\udd98 IF SOMETHING LOOKS WRONG" },
    { type: "step", text: "A paid report did not go out: select the file and run \u2699\ufe0f Setup \u2192 Test report delivery. It needs the invoice ID in column AF/AI, a finished PDF in Completed \u2192 Final Appraisal PDF, and the 5-minute automation on." },
    { type: "step", text: "An approval email never came: \ud83d\ude97 Appraisals \u2192 \u2705 Check for Pending Approvals Now, then look at the file's status and the \"What to do next\" column." },
    { type: "step", text: "Copy the exact error message when something fails. It almost always names the problem." }
  ];

  var data = [];
  for (var i = 0; i < rows.length; i++) {
    data.push([rows[i].text || ""]);
  }
  sheet.getRange(1, 1, data.length, 1).setValues(data);
  sheet.setColumnWidth(1, 1000);

  for (var i = 0; i < rows.length; i++) {
    var rowNum = i + 1;
    var range = sheet.getRange(rowNum, 1);
    var type = rows[i].type;
    if (type === "title") {
      range.setFontSize(16).setFontWeight("bold").setFontColor("#ffffff").setBackground(NAVY);
      sheet.setRowHeight(rowNum, 40);
    } else if (type === "section") {
      range.setFontSize(12).setFontWeight("bold").setFontColor("#ffffff").setBackground(NAVY);
      sheet.setRowHeight(rowNum, 32);
    } else if (type === "step") {
      range.setFontSize(10).setBackground("#ffffff").setWrap(true);
    } else if (type === "note") {
      range.setFontSize(10).setFontStyle("italic").setFontColor("#64748b").setBackground(LIGHT).setWrap(true);
    } else if (type === "wait") {
      range.setFontSize(10).setFontWeight("bold").setFontColor(GOLD).setBackground(LIGHT).setWrap(true);
    } else {
      sheet.setRowHeight(rowNum, 12);
    }
  }

  sheet.setFrozenRows(1);
  ss.setActiveSheet(sheet);
  SpreadsheetApp.getUi().alert("How-To Guide is ready. Reopen it any time from the 🚗 Appraisals menu.");
}

// ============================================================
// 🚗 APPRAISAL CUSTOMER PORTAL — everything below is new. Email-only
// auth (no SMS/texting anywhere — that service has been discontinued).
// Submissions flow into Sheet1 via handleWebSubmission(), the exact
// same pipeline the website wizard already uses, so a portal signup
// is indistinguishable from a website lead by the time Kevin sees it
// — same Intended Use value, same downstream 10-step checklist.
// ============================================================
const CUSTOMER_SHEET_NAME = "Customer Directory";
const PORTAL_UPLOAD_FOLDER_NAME = "Portal Uploads";
const PORTAL_PASSWORD_SALT = "EstimateConsultants_AppraisalPortal_SecureSalt_2026#";
const ADMIN_NOTIFICATION_EMAIL = "kevin@estimateconsultants.com";

// Maps the portal's plain-English appraisal-type dropdown values to the
// exact MASTER_DOC_MAP keys, so a portal submission gets the identical
// Intended Use value a website-wizard submission would.
const PORTAL_TYPE_TO_INTENDED_USE = {
  "Diminished Value": "3rd-Party Loss in Market Value (Diminished Value) Claim",
  "Total Loss": "Insurance Total Loss ACV Dispute",
  "Estate/Probate": "Estate / Probate / Tax / Divorce Fair Market Value (FMV)",
  "Divorce/Legal Settlement": "Estate / Probate / Tax / Divorce Fair Market Value (FMV)",
  "Bank & Collateral": "Bank & Collateral Loan Vehicle Appraisal",
  "IRS Donation": "IRS Vehicle Donation Appraisal"
};

function setupCustomerSheetHeaders() {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CUSTOMER_SHEET_NAME);

  var headers = ["Email", "Full Name", "Password Hash", "Vehicle (Y/M/M)", "State", "Appraisal Type", "Status", "Created At", "Mileage", "Vehicle Notes", "Session ID", "Last Reminder Sent", "Do Not Email (Yes/blank)"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");

  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(PORTAL_TYPE_TO_INTENDED_USE), true)
    .setAllowInvalid(true).build();
  sheet.getRange("F2:F1000").setDataValidation(typeRule);

  var doNotEmailRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Yes"], true)
    .setAllowInvalid(true).build();
  sheet.getRange("M2:M1000").setDataValidation(doNotEmailRule);

  SpreadsheetApp.getUi().alert("✅ 'Customer Directory' tab is set up and ready.");
}

function portalHashPassword(plainPassword) {
  if (!plainPassword || plainPassword.toString().trim() === "") return "";
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    plainPassword.toString().trim() + PORTAL_PASSWORD_SALT,
    Utilities.Charset.UTF_8
  );
  var txtHash = "";
  for (var i = 0; i < rawHash.length; i++) {
    var byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    var byteHex = byteVal.toString(16);
    if (byteHex.length == 1) byteHex = "0" + byteHex;
    txtHash += byteHex;
  }
  return txtHash;
}

function sanitizeEmail(str) {
  return (str || "").toString().trim().toLowerCase();
}

function findCustomerRowByEmail(sheet, email) {
  var cleanEmail = sanitizeEmail(email);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (sanitizeEmail(data[i][0]) === cleanEmail) return data[i];
  }
  return null;
}

function findCustomerRowIndexByEmail(sheet, email) {
  var cleanEmail = sanitizeEmail(email);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (sanitizeEmail(data[i][0]) === cleanEmail) return i + 1;
  }
  return 0;
}

// GET endpoint: does this email exist / does it have a password set yet?
function portalEmailLookup(params) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ error: "Configuration Error: 'Customer Directory' tab not found. Run 🌐 Appraisal Portal → Setup Customer Directory Headers first." })).setMimeType(ContentService.MimeType.JSON);

  var email = params.portalEmailCheck;
  var password = params.password;

  var row = findCustomerRowByEmail(sheet, email);

  if (!password) {
    if (row) {
      var hasPassword = row[2] && row[2].toString().trim() !== "";
      return ContentService.createTextOutput(JSON.stringify({
        exists: true, hasPassword: hasPassword, shopName: row[1], state: row[4], claimsVolume: row[5]
      })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ exists: false, estimatorLead: findEstimatorLeadForPrefill(email) })).setMimeType(ContentService.MimeType.JSON);
  }

  if (row) {
    var storedPass = row[2] ? row[2].toString().trim() : "";
    var isTempPin = storedPass.indexOf("TEMP_") === 0;
    var cleanStoredHash = isTempPin ? storedPass.replace("TEMP_", "") : storedPass;
    var inputHash = portalHashPassword(password);
    if (cleanStoredHash === inputHash) {
      return ContentService.createTextOutput(JSON.stringify({
        authenticated: true, requiresPasswordChange: isTempPin, claims: fetchPortalClaims(email), claimsVolume: row[5], vehicle: row[3], state: row[4], mileage: row[8]
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ authenticated: false })).setMimeType(ContentService.MimeType.JSON);
}

function handlePortalRegistration(data) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!sheet) return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Configuration Error: 'Customer Directory' tab not found. Run 🌐 Appraisal Portal → Setup Customer Directory Headers first." })).setMimeType(ContentService.MimeType.JSON);

  var email = sanitizeEmail(data.shopIdentifier);
  if (!email || email.indexOf("@") === -1) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "A valid email address is required." })).setMimeType(ContentService.MimeType.JSON);
  }

  // 🚫 SERVER-SIDE DV ELIGIBILITY CHECKS (defense in depth)
  if (data.newShopClaims === "Diminished Value") {
    var stateUpper = (data.newShopState || "").toString().trim().toUpperCase();
    if (stateUpper === "NE" || stateUpper === "MI") {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Diminished Value claims are not offered in Nebraska (NE) or Michigan (MI). Please call 910-333-6001 to discuss other appraisal options." })).setMimeType(ContentService.MimeType.JSON);
    }
    var vehicleYearMatch = (data.newShopContact || "").toString().match(/\b(19|20)\d{2}\b/);
    var vehicleYearNum = vehicleYearMatch ? parseInt(vehicleYearMatch[0]) : null;
    var vehicleAge = vehicleYearNum ? (new Date().getFullYear() - vehicleYearNum) : null;
    var mileageNum = parseInt(data.vehicleMileage);
    if (vehicleAge !== null && vehicleAge > 10) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Diminished Value claims require a vehicle 10 years old or newer. Please call 910-333-6001 to discuss other options." })).setMimeType(ContentService.MimeType.JSON);
    }
    if (!isNaN(mileageNum) && mileageNum >= 100000) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Diminished Value claims require a vehicle with under 100,000 miles. Please call 910-333-6001 to discuss other options." })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  var existingRowIndex = findCustomerRowIndexByEmail(sheet, email);
  var now = new Date();
  var hashedPass = portalHashPassword(data.newShopPassword);
  var isNewAccount = (existingRowIndex === 0);

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 2).setValue(data.newShopName);
    sheet.getRange(existingRowIndex, 3).setValue(hashedPass);
    sheet.getRange(existingRowIndex, 4).setValue(data.newShopContact);
    sheet.getRange(existingRowIndex, 5).setValue(data.newShopState);
    sheet.getRange(existingRowIndex, 6).setValue(data.newShopClaims);
    sheet.getRange(existingRowIndex, 9).setValue(data.vehicleMileage || "");
    sheet.getRange(existingRowIndex, 10).setValue(data.vehicleNotes || "");
  } else {
    sheet.appendRow([
      email, data.newShopName, hashedPass, data.newShopContact, data.newShopState,
      data.newShopClaims, "Registered", now, data.vehicleMileage || "", data.vehicleNotes || "", ""
    ]);
  }

  // 📧 NOTIFY ON NEW ACCOUNT CREATION — only for genuinely new accounts,
  // not every time an existing customer re-registers a temp PIN or edits
  // their details, which would otherwise fire this on every login hiccup.
  if (isNewAccount) {
    try {
      MailApp.sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: "🆕 New Appraisal Portal Account: " + (data.newShopName || email),
        body: "A new customer account was just created in the Appraisal Portal.\n\n" +
          "Name: " + (data.newShopName || "N/A") + "\n" +
          "Email: " + email + "\n" +
          "Vehicle: " + (data.newShopContact || "N/A") + "\n" +
          "State: " + (data.newShopState || "N/A") + "\n" +
          "Appraisal Type: " + (data.newShopClaims || "N/A") + "\n" +
          "Mileage: " + (data.vehicleMileage || "N/A")
      });
    } catch (mailErr) {
      console.error("New account notification email failed: " + mailErr);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}

function sendPortalOtpEmail(data) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var email = sanitizeEmail(data.shopIdentifier);
  var row = findCustomerRowByEmail(sheet, email);
  if (!row) return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Account not found." })).setMimeType(ContentService.MimeType.JSON);

  var token = Math.floor(100000 + Math.random() * 900000).toString();
  CacheService.getScriptCache().put("portal_otp_" + email, token, 600);

  MailApp.sendEmail(email, "Your Appraisal Portal Verification Code", "Your 6-digit secure login token is: " + token);
  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}

function verifyPortalOtp(data) {
  var email = sanitizeEmail(data.shopIdentifier);
  var saved = CacheService.getScriptCache().get("portal_otp_" + email);
  if (saved && saved === data.token) {
    CacheService.getScriptCache().remove("portal_otp_" + email);
    var ss = getWorkingSpreadsheet();
    var custRow = findCustomerRowByEmail(ss.getSheetByName(CUSTOMER_SHEET_NAME), email);
    return ContentService.createTextOutput(JSON.stringify({ authenticated: true, claims: fetchPortalClaims(email), claimsVolume: custRow ? custRow[5] : "", vehicle: custRow ? custRow[3] : "", state: custRow ? custRow[4] : "", mileage: custRow ? custRow[8] : "" })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ authenticated: false, error: "Invalid login token." })).setMimeType(ContentService.MimeType.JSON);
}

function sendPortalForgotEmail(data) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var email = sanitizeEmail(data.shopIdentifier);
  var rowIndex = findCustomerRowIndexByEmail(sheet, email);
  if (rowIndex === 0) return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Account not found for that email." })).setMimeType(ContentService.MimeType.JSON);

  var row = sheet.getRange(rowIndex, 1, 1, 11).getValues()[0];
  var firstName = row[1] ? row[1].toString().trim().split(" ")[0] : "there";
  var newTempPin = Math.floor(100000 + Math.random() * 900000).toString();
  sheet.getRange(rowIndex, 3).setValue("TEMP_" + portalHashPassword(newTempPin));

  try {
    MailApp.sendEmail(email, "Your Estimate Consultants Appraisal Portal Temporary PIN",
      "Hi " + firstName + ",\n\nYour appraisal portal PIN reset request was processed.\n\nYour temporary PIN is: " + newTempPin + "\n\nLog in using this PIN. You will be prompted to set your new permanent PIN immediately upon logging in.");
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (emailErr) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Email error: " + emailErr.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function changePortalPassword(data) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var email = sanitizeEmail(data.shopIdentifier);
  var oldHash = portalHashPassword(data.oldPassword);
  var newHash = portalHashPassword(data.newPassword);

  var allData = sheet.getDataRange().getValues();
  for (var r = 1; r < allData.length; r++) {
    var rawCellPass = allData[r][2] ? allData[r][2].toString().trim() : "";
    var cleanCellHash = rawCellPass.indexOf("TEMP_") === 0 ? rawCellPass.replace("TEMP_", "") : rawCellPass;
    if (sanitizeEmail(allData[r][0]) === email && cleanCellHash === oldHash) {
      sheet.getRange(r + 1, 3).setValue(newHash);
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
}

function fetchPortalClaimsResponse(data) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var email = sanitizeEmail(data.shopIdentifier);
  var row = findCustomerRowByEmail(sheet, email);
  if (!row) return ContentService.createTextOutput(JSON.stringify({ authenticated: false, error: "Account not found." })).setMimeType(ContentService.MimeType.JSON);

  var storedPass = row[2] ? row[2].toString().trim() : "";
  var cleanStoredHash = storedPass.indexOf("TEMP_") === 0 ? storedPass.replace("TEMP_", "") : storedPass;
  if (data.password) {
    if (cleanStoredHash !== portalHashPassword(data.password)) {
      return ContentService.createTextOutput(JSON.stringify({ authenticated: false, error: "Authentication failed." })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ authenticated: true, claims: fetchPortalClaims(email), claimsVolume: row[5], vehicle: row[3], state: row[4], mileage: row[8] })).setMimeType(ContentService.MimeType.JSON);
}

// Finds EVERY Sheet1 row belonging to this customer (matched by email,
// column 5) rather than a single stored Session ID — a customer can
// submit more than one vehicle over time, and each submission creates
// its own Sheet1 row/claim, so this returns all of them, most recent
// first. Status comes straight from Sheet1's System Status column, so
// it reflects Kevin's real 10-step progress automatically per vehicle.
function fetchPortalClaims(email) {
  var cleanEmail = sanitizeEmail(email);
  var mainSheet = getMainSheet();
  var lastRow = mainSheet.getLastRow();
  if (lastRow < 2) return [];

  var data = mainSheet.getRange(2, 1, lastRow - 1, 35).getValues();
  var claims = [];
  for (var i = 0; i < data.length; i++) {
    var rowEmail = sanitizeEmail(data[i][4]); // Col E: Email Address
    if (rowEmail === cleanEmail) {
      var r = data[i];
      claims.push({
        claimNumber: r[30] || "Pending",
        vehicle: [r[15], r[17], r[18]].filter(Boolean).join(" "), // Year Make Model
        date: r[90] instanceof Date ? Utilities.formatDate(r[90], Session.getScriptTimeZone(), "MM/dd/yyyy") : "",
        status: r[29] || "Received",
        notes: "",
        completedUrl: r[27] || "",
        invoiceUrl: ""
      });
    }
  }
  return claims.reverse(); // most recent submission first
}

// Handles the portal's final "Submit." Collects the FULL intake form
// (everything Kevin's manual process asks for — name, phone, address,
// insurance/adjuster info, VIN/trim/mileage, etc.), logs it into Sheet1
// via handleWebSubmission() exactly like the website wizard does, then
// immediately runs Step 4 (Create Client Folder & Master Docs) and
// emails the generated Intake Form document to the client automatically.
// For Diminished Value claims only, it also auto-generates and sends
// the $199 initial retainer Wave invoice — every other claim type's
// invoice still happens later in Kevin's normal process, unchanged.
function handlePortalInitSubmission(data) {
  var ss = getWorkingSpreadsheet();
  var custSheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var email = sanitizeEmail(data.shopIdentifier);
  var custRowIndex = findCustomerRowIndexByEmail(custSheet, email);
  if (custRowIndex === 0) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Account not found." })).setMimeType(ContentService.MimeType.JSON);
  }
  var custRow = custSheet.getRange(custRowIndex, 1, 1, 11).getValues()[0];

  var regVehicleInfo = custRow[3] || "";
  var appraisalType = custRow[5] || "";
  // A fresh Session ID every time — each submission is its own claim/
  // vehicle. Reusing the customer's stored session would silently
  // overwrite a previous vehicle's Sheet1 row instead of creating a new
  // one, which is exactly what breaks multi-vehicle customers.
  var sessionId = Utilities.getUuid();

  var vehicleParts = regVehicleInfo.toString().trim().split(/\s+/);
  var regYear = vehicleParts[0] || "";
  var regMake = vehicleParts[1] || "";
  var regModel = vehicleParts.slice(2).join(" ") || "";

  var claimType = PORTAL_TYPE_TO_INTENDED_USE[appraisalType] || "3rd-Party Loss in Market Value (Diminished Value) Claim";

  // 📂 Raw upload folder for the customer's photos + final estimate copy —
  // separate from Sheet1's own Drive folder (created later, in the
  // deferred phase below), so uploaded files are safely stored the
  // instant the customer submits.
  var rootFolder = getOrCreatePortalFolder(PORTAL_UPLOAD_FOLDER_NAME);
  var customerFolderName = (data.clientName || custRow[1] || "Portal Customer") + " - " + (data.vin || regVehicleInfo);
  customerFolderName = customerFolderName.replace(/[^a-zA-Z0-9 \-]/g, "");
  var customerFolder = getOrCreatePortalSubFolder(rootFolder, customerFolderName);
  var submissionLabel = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM-dd-yyyy_HH-mm");
  var uploadFolder = customerFolder.createFolder(submissionLabel);

  if (data.files && data.files.length > 0) {
    data.files.forEach(function(fileItem) {
      savePortalBase64File(uploadFolder, fileItem.base64, fileItem.filename, fileItem.mimeType);
    });
  }

  // 🔗 Log the FULL intake into Sheet1 via the exact same pipeline the
  // website wizard uses — same Appraisal ID format, same admin
  // notification, same downstream 10-step checklist eligibility.
  // Every field below maps directly to a Sheet1 column; anything not
  // supplied by the portal form just stays blank, same as always.
  handleWebSubmission({
    clientName: data.clientName || custRow[1] || "Portal Customer",
    email: email,
    phone: data.phone || "",
    address: data.address || "",
    mailingAddress: data.mailingAddress || "",
    dateOfLossOrPassing: data.dateOfLoss || "",
    vehicleRepairedDate: data.dateRepaired || "",
    insuranceCompany: data.insuranceCarrier || "",
    partyType: data.partyType || "3rd Party",
    claimNumber: data.claimNumber || "",
    adjusterName: data.adjusterName || "",
    adjusterPhone: data.adjusterPhone || "",
    adjusterEmail: data.adjusterEmail || "",
    state: data.state || custRow[4] || "",
    year: data.year || regYear,
    make: data.make || regMake,
    model: data.model || regModel,
    trim: data.trim || "",
    mileage: data.mileage || custRow[8] || "",
    vin: data.vin || "N/A",
    plate: data.plate || "",
    regState: data.regState || data.state || custRow[4] || "",
    color: data.color || "",
    titleStatus: data.titleStatus || "",
    claimType: claimType,
    submissionMethod: "Portal",
    sessionId: sessionId
  });

  // Save this sessionId back onto the Customer Directory row, so future
  // logins/claim lookups can find the same Sheet1 row.
  custSheet.getRange(custRowIndex, 11).setValue(sessionId);

  var mainSheet = getMainSheet();
  var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 50);

  // 🤝 Referral code (optional) — logged now, qualifies later once docs
  // actually generate (see processPortalIntakeDocs).
  if (data.promoCode) {
    try {
      var vehicleStrForReferral = [data.year || regYear, data.make || regMake, data.model || regModel].filter(Boolean).join(" ");
      logReferralRedemptionIfValid(data.promoCode, data.clientName || custRow[1] || "Portal Customer", email, vehicleStrForReferral, sessionId, mainRow);
    } catch (refErr) {
      console.error("logReferralRedemptionIfValid failed: " + refErr);
    }
  }

  // ⏰ EVERYTHING SLOW HAPPENS LATER, NOT HERE. Creating the client's Drive
  // folder, copying + filling the Intake Form doc, and (for DV) the
  // multi-step Wave invoice API calls can easily take 10-30+ seconds —
  // making the customer's browser sit on "Submitting..." through all of
  // that is a bad experience for something that doesn't need to be
  // instant. Marking this status is enough: processPortalIntakeDocs()
  // picks up any row in this state the next time the existing 5-minute
  // trigger (checkStatusAndDeliver) runs, generates the documents, and
  // emails the client a signing link — same sign.estimateconsultants.com
  // flow already used for Step 5, not a flat unsigned PDF attachment.
  if (mainRow) {
    mainSheet.getRange(mainRow, 30).setValue("Portal Submission Received — Pending Doc Generation");

    try {
      var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy");
      var noteEntry = dateStr + " — Portal submission: " + (data.files ? data.files.length : 0) + " file(s) uploaded. Files: " + uploadFolder.getUrl();
      var cell = mainSheet.getRange(mainRow, 94);
      var existing = String(cell.getValue() || "").trim();
      cell.setValue(existing ? noteEntry + "\n" + existing : noteEntry);
    } catch (noteErr) {
      console.error("Progress Log note failed: " + noteErr);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, folderId: uploadFolder.getId() })).setMimeType(ContentService.MimeType.JSON);
}

// Runs the slow part of a portal submission: creates the client's Drive
// folder + fills the Intake Form doc (same as Step 4 of the manual
// checklist), then emails the client a signing link for it — the same
// sign.estimateconsultants.com flow Step 5 already uses, not a flat PDF
// attachment. For Diminished Value only, also auto-generates and sends
// the initial retainer Wave invoice ($199, or $149 if a shop referral
// code qualifies here) — Wave emails that itself, same as
// sendAuthAndInvoice()'s existing behavior. Every other claim type's
// invoicing still happens later in Kevin's normal manual process.
function processPortalIntakeDocs(row) {
  var mainSheet = getMainSheet();
  var rowData = mainSheet.getRange(row, 1, 1, 35).getValues()[0];
  var clientName = rowData[0];
  var clientEmail = rowData[4];
  var intendedUse = String(rowData[25] || "");
  var isDvClaim = isInsurerDV_(intendedUse);
  var sessionId = String(mainSheet.getRange(row, 93).getValue() || "");

  var genResult = generateClientFileForRow(row);
  if (!genResult.success) {
    mainSheet.getRange(row, 30).setValue(("Portal Intake — Doc Generation Failed: " + genResult.message).substring(0, 300));
    try {
      MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, "⚠️ Portal Intake Doc Generation Failed: " + clientName,
        "Row " + row + " (" + clientName + ", " + clientEmail + ") failed to auto-generate its Intake Form.\n\n" +
        "Reason: " + genResult.message + "\n\nYou'll need to run Step 4 manually for this row.");
    } catch (mailErr) {}
    return;
  }

  // 🤝 Docs just generated successfully — this is "we write a DV appraisal
  // for them," the qualifying moment for any pending shop referral.
  var hasReferralDiscount = false;
  if (sessionId) {
    try { hasReferralDiscount = qualifyReferralForSessionId(sessionId); } catch (refErr) { console.error("qualifyReferralForSessionId failed: " + refErr); }
  }

  var signingLink = WEBSITE_SIGNING_URL + "?row=" + row + "&type=auth";
  var body = "Hello " + genResult.clientName + ",<br><br>" +
    "Thank you for submitting your appraisal request. Please review and sign your Intake Form here:<br><br>" +
    "<a href='" + signingLink + "'>" + signingLink + "</a><br><br>";
  if (isDvClaim) {
    body += "We'll follow up shortly with next steps, including your initial retainer invoice.<br><br>";
  } else {
    body += "We'll review everything you submitted and follow up with next steps.<br><br>";
  }
  body += "If you have any questions, just reply to this email or call us at 910-333-6001.<br><br>Thank you,<br>Kevin Murty<br>Estimate Consultants";

  GmailApp.sendEmail(clientEmail, "Action Required: Review & Sign Your Intake Form", body, { htmlBody: body });

  // 📧 ADMIN UPDATE — keeps Kevin in the loop on every automated step of
  // this file, not just the initial submission.
  try {
    MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, "📄 Intake Form Sent: " + genResult.clientName,
      "The Intake Form was auto-generated and a signing link was emailed to " + clientEmail + " for " + genResult.clientName + " (" + genResult.intendedUse + ").\n\n" +
      "Folder: " + genResult.clientFolder.getUrl() + "\nSheet1 row: " + row);
  } catch (mailErr) {}

  // 💸 MANUAL INVOICING ONLY — previously this auto-sent the $199 retainer
  // invoice immediately after doc generation. Now it just notifies Kevin
  // the file is ready, and he sends it himself via Step 5 once he's
  // actually ready to begin the work.
  if (isDvClaim) {
    var retainerAmount = hasReferralDiscount ? Math.round(199 * (1 - SHOP_PROMO_DISCOUNT) * 100) / 100 : 199.00;
    mainSheet.getRange(row, 30).setValue("Portal Intake Complete — Ready to Invoice ($" + retainerAmount.toFixed(2) + ")");
    try {
      MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, "🧾 Ready to Invoice ($" + retainerAmount.toFixed(2) + "): " + genResult.clientName,
        genResult.clientName + " (" + clientEmail + ") is ready for their $" + retainerAmount.toFixed(2) + " Diminished Value retainer invoice" + (hasReferralDiscount ? " (15% shop referral discount - Step 5 applies it automatically)" : "") + ".\n\n" +
        "No invoice has been sent — invoicing is manual now. Send it yourself via Step 5 for Sheet1 row " + row + " when you're ready to begin the work.");
    } catch (mailErr) {}
  }

  if (!isDvClaim) {
    mainSheet.getRange(row, 30).setValue("Portal Intake Complete — Signing Link Sent");
  }
}

function handlePortalUploadChunk(data) {
  var destinationDir = DriveApp.getFolderById(data.folderId);
  var strippedBase64Data = data.base64.indexOf(',') !== -1 ? data.base64.substr(data.base64.indexOf(',') + 1) : data.base64;
  var partitionLabel = data.filename + ".part_" + data.chunkIndex;
  destinationDir.createFile(partitionLabel, Utilities.base64Decode(strippedBase64Data), data.mimeType);

  if (data.chunkIndex === data.totalChunks - 1) {
    var collectiveBytePool = [];
    for (var idx = 0; idx < data.totalChunks; idx++) {
      var segmentFiles = destinationDir.getFilesByName(data.filename + ".part_" + idx);
      if (segmentFiles.hasNext()) {
        var operationalPart = segmentFiles.next();
        collectiveBytePool = collectiveBytePool.concat(operationalPart.getBlob().getBytes());
        destinationDir.removeFile(operationalPart);
      }
    }
    destinationDir.createFile(Utilities.newBlob(collectiveBytePool, data.mimeType, data.filename));
  }
  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}

function savePortalBase64File(folder, rawDataUri, filename, mimeType) {
  var base64Data = rawDataUri.indexOf(',') !== -1 ? rawDataUri.substr(rawDataUri.indexOf(',') + 1) : rawDataUri;
  folder.createFile(Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, filename));
}

function getOrCreatePortalFolder(folderName) {
  var existingFolders = DriveApp.getFoldersByName(folderName);
  if (existingFolders.hasNext()) return existingFolders.next();
  return DriveApp.createFolder(folderName);
}

function getOrCreatePortalSubFolder(parentFolder, subFolderName) {
  var folderIterator = parentFolder.getFoldersByName(subFolderName);
  if (folderIterator.hasNext()) return folderIterator.next();
  return parentFolder.createFolder(subFolderName);
}

// 📧 2-DAY UPLOAD REMINDER — emails any Customer Directory row that
// registered but hasn't submitted anything yet (no Session ID / no
// matching Sheet1 row), every 2 days, until they upload. Skips anyone
// who's already submitted, so this never nags someone unnecessarily.
function sendUploadReminderEmails() {
  var ss = getWorkingSpreadsheet();
  var custSheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!custSheet) return;

  var data = custSheet.getDataRange().getValues();
  var mainSheet = getMainSheet();
  var now = new Date();
  var sentCount = 0;

  for (var i = 1; i < data.length; i++) {
    var email = data[i][0];
    var name = data[i][1];
    var sessionId = data[i][10];
    var createdAt = data[i][7];

    if (!email) continue;

    // Manually flagged "Do Not Email" (col M) — Kevin is handling this
    // customer directly, skip all automated reminders.
    var doNotEmail = data[i][12];
    if (doNotEmail && doNotEmail.toString().trim().toUpperCase() === "YES") continue;

    // Already submitted (has a Session ID that matches a real Sheet1 row) — skip entirely.
    if (sessionId) {
      var mainRow = findRowBySessionId(mainSheet, 93, sessionId, 2000);
      if (mainRow) continue;
    }

    // Only remind if it's been at least 2 days since registration (or
    // since the last reminder — tracked via a note on this row).
    var lastReminderRaw = custSheet.getRange(i + 1, 12).getValue(); // Col L: Last Reminder Sent
    var lastTouch = lastReminderRaw instanceof Date ? lastReminderRaw : (createdAt instanceof Date ? createdAt : null);
    if (!lastTouch) continue;

    var daysSince = (now.getTime() - lastTouch.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 2) continue;

    var firstName = name ? name.toString().trim().split(" ")[0] : "there";
    try {
      MailApp.sendEmail(email, "Reminder: Upload Your Documents & Photos",
        "Hi " + firstName + ",\n\nJust a friendly reminder that we're still waiting on your documents and photos to get your appraisal moving. Please log in to the client portal to upload them whenever you get a chance:\n\n" +
        "https://appraisals.estimateconsultants.com\n\n" +
        "If you have any questions, just reply to this email or call us at 910-333-6001.\n\n" +
        "Thank you,\nKevin Murty\nEstimate Consultants");
      custSheet.getRange(i + 1, 12).setValue(now);
      sentCount++;
    } catch (mailErr) {
      console.error("Upload reminder email failed for " + email + ": " + mailErr);
    }
  }

  var ui;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  if (ui) ui.alert("✅ Sent " + sentCount + " upload reminder email(s).");
}

function setupUploadReminderTrigger() {
  var ui = SpreadsheetApp.getUi();
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'sendUploadReminderEmails') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('sendUploadReminderEmails').timeBased().everyDays(2).create();
  ui.alert("⏰ Automatic 2-day upload reminder emails enabled.");
}

// ============================================================
// 🤝 SHOP REFERRAL PROGRAM — body shops get an individual promo code.
// When a customer submits a DV claim with that code AND it reaches the
// point where we actually generate their appraisal ("qualified"), the
// referring shop earns a $50 tracked payout (paid manually, not
// automated), and the customer gets $50 off their final DV fee.
// ============================================================
const REFERRAL_CODES_SHEET_NAME = "Referral Codes";
const REFERRAL_REDEMPTIONS_SHEET_NAME = "Referral Redemptions";

function setupReferralCodesSheet() {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(REFERRAL_CODES_SHEET_NAME);

  var headers = ["Promo Code", "Shop Name", "Shop Email", "Created At", "Expiration Date (blank = never)"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
  sheet.setFrozenRows(1);

  var redemptions = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!redemptions) redemptions = ss.insertSheet(REFERRAL_REDEMPTIONS_SHEET_NAME);
  var rHeaders = ["Promo Code", "Shop Name", "Shop Email", "Customer Email", "Vehicle (Y/M/M)", "Session ID", "Date Submitted", "Qualified (Docs Generated) At", "$50 Shop Payout Status", "$50 Customer Discount Used At"];
  redemptions.getRange(1, 1, 1, rHeaders.length).setValues([rHeaders]);
  redemptions.getRange(1, 1, 1, rHeaders.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
  redemptions.setFrozenRows(1);
  var payoutStatusRule = SpreadsheetApp.newDataValidation().requireValueInList(["Owed", "Paid"], true).setAllowInvalid(true).build();
  redemptions.getRange("I2:I1000").setDataValidation(payoutStatusRule);

  var ui;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  if (ui) ui.alert("✅ '" + REFERRAL_CODES_SHEET_NAME + "' and '" + REFERRAL_REDEMPTIONS_SHEET_NAME + "' tabs are set up and ready.");
}

// Menu-driven: prompts for a shop's name/email and generates a unique code
// for them. Run this once per shop you want to give a referral code to.
function createReferralCode() {
  var ui = SpreadsheetApp.getUi();
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME);
  if (!sheet) { setupReferralCodesSheet(); sheet = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME); }

  var nameRes = ui.prompt("New Referral Code", "Shop Name:", ui.ButtonSet.OK_CANCEL);
  if (nameRes.getSelectedButton() !== ui.Button.OK) return;
  var shopName = nameRes.getResponseText().trim();
  if (!shopName) return ui.alert("Shop name is required.");

  var emailRes = ui.prompt("New Referral Code", "Shop Email (for reference only — the code goes to them however you send it):", ui.ButtonSet.OK_CANCEL);
  if (emailRes.getSelectedButton() !== ui.Button.OK) return;
  var shopEmail = emailRes.getResponseText().trim();

  var codeRes = ui.prompt("New Referral Code", "Choose the promo code for " + shopName + " (letters/numbers only, e.g. JOESAUTO):", ui.ButtonSet.OK_CANCEL);
  if (codeRes.getSelectedButton() !== ui.Button.OK) return;
  var code = codeRes.getResponseText().trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!code) return ui.alert("A promo code is required.");

  var existingData = sheet.getDataRange().getValues();
  for (var i = 1; i < existingData.length; i++) {
    if (String(existingData[i][0]).trim().toUpperCase() === code) {
      return ui.alert("⚠️ That code is already in use by " + existingData[i][1] + ". Please choose a different one.");
    }
  }

  var expRes = ui.prompt("New Referral Code", "Expiration date (MM/DD/YYYY) — leave blank for a code that never expires:", ui.ButtonSet.OK_CANCEL);
  if (expRes.getSelectedButton() !== ui.Button.OK) return;
  var expText = expRes.getResponseText().trim();
  var expDate = "";
  if (expText) {
    var parsedExp = new Date(expText);
    if (isNaN(parsedExp.getTime())) {
      return ui.alert("Couldn't understand that date — please use MM/DD/YYYY format, or leave it blank for no expiration.");
    }
    expDate = parsedExp;
  }

  sheet.appendRow([code, shopName, shopEmail, new Date(), expDate]);

  ui.alert("✅ Referral code created: " + code + (expDate ? (" (expires " + Utilities.formatDate(expDate, Session.getScriptTimeZone(), "MM/dd/yyyy") + ")") : " (no expiration)") + "\n\nSend this code to " + shopName + " to give to their customers at submission.");
}

// Called at portal submission time. If a valid code was entered, logs a
// new redemption row (unqualified yet — qualifies once docs generate).
// Silently ignores an invalid/blank code rather than blocking submission;
// Shared validator — checks whether a code exists and isn't expired.
// Used both for the live check as someone types it into the intake form,
// and for the authoritative check when the submission actually happens.
function validateReferralCode(promoCode) {
  if (!promoCode) return { valid: false, reason: "No code entered." };
  var ss = getWorkingSpreadsheet();
  var codesSheet = ss.getSheetByName(REFERRAL_CODES_SHEET_NAME);
  if (!codesSheet) return { valid: false, reason: "Code not recognized." };

  var cleanCode = promoCode.toString().trim().toUpperCase();
  var codesData = codesSheet.getDataRange().getValues();
  for (var i = 1; i < codesData.length; i++) {
    if (String(codesData[i][0]).trim().toUpperCase() === cleanCode) {
      var expDate = codesData[i][4];
      if (expDate instanceof Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var expDay = new Date(expDate);
        expDay.setHours(0, 0, 0, 0);
        if (expDay < today) {
          return { valid: false, reason: "This code has expired." };
        }
      }
      return { valid: true, shopName: codesData[i][1], shopEmail: codesData[i][2] };
    }
  }
  return { valid: false, reason: "Code not recognized." };
}

// Called at portal submission time. If a valid code was entered, logs a
// new redemption row (unqualified yet — qualifies once docs generate).
// Silently ignores an invalid/expired/blank code rather than blocking
// submission; notes an invalid attempt in the Progress Log for
// visibility instead.
function logReferralRedemptionIfValid(promoCode, clientName, clientEmail, vehicleStr, sessionId, mainRow) {
  if (!promoCode) return;
  var result = validateReferralCode(promoCode);

  if (!result.valid) {
    try {
      var mainSheet = getMainSheet();
      if (mainRow) {
        var noteEntry = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy") + " — Referral code entered but not applied (" + result.reason + "): " + promoCode;
        var cell = mainSheet.getRange(mainRow, 94);
        var existing = String(cell.getValue() || "").trim();
        cell.setValue(existing ? noteEntry + "\n" + existing : noteEntry);
      }
    } catch (noteErr) {}
    return;
  }

  var ss = getWorkingSpreadsheet();
  var redemptionsSheet = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!redemptionsSheet) { setupReferralCodesSheet(); redemptionsSheet = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME); }
  redemptionsSheet.appendRow([promoCode.toString().trim().toUpperCase(), result.shopName, result.shopEmail, clientEmail, vehicleStr, sessionId, new Date(), "", "", ""]);
}

// Called right after intake docs successfully generate — the "we write a
// DV appraisal for them" qualifying moment. If this session has a pending
// referral: marks it qualified, marks the $50 shop payout as owed, emails
// Kevin, marks the customer's $50 discount used, and returns true so the
// caller can apply that $50 off the FIRST ($199) invoice, right here in
// the same moment — a cheaper buy-in for the referred customer, since by
// the time the second/final invoice comes due they're already receiving
// money from the insurance offer.
// Used to stop the estimator follow-up sequence (including the $100
// discount pitch in Email 2) for anyone who's already used a shop
// referral/promo code, regardless of whether they've fully registered yet.
function emailHasUsedReferralCode(email) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!sheet) return false;

  var cleanEmail = sanitizeEmail(email);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  for (var i = 0; i < data.length; i++) {
    if (sanitizeEmail(data[i][3]) === cleanEmail) return true;
  }
  return false;
}

function qualifyReferralForSessionId(sessionId) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(REFERRAL_REDEMPTIONS_SHEET_NAME);
  if (!sheet || !sessionId) return false;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][5] === sessionId && !data[i][7]) {
      var row = i + 2;
      var now = new Date();
      sheet.getRange(row, 8).setValue(now);  // Qualified (Docs Generated) At
      sheet.getRange(row, 9).setValue("Owed"); // $50 Shop Payout Status
      sheet.getRange(row, 10).setValue(now); // $50 Customer Discount Used At
      try {
        MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, "🤝 Referral Qualified — $50 Owed to " + data[i][1],
          data[i][1] + " referred " + data[i][3] + " (" + data[i][4] + "), promo code " + data[i][0] + ".\n\n" +
          "This referral just qualified — a $50 payout is now owed to " + data[i][1] + ". Mark it 'Paid' in the '" + REFERRAL_REDEMPTIONS_SHEET_NAME + "' tab once you've sent it.\n\n" +
          "The customer gets 15% off every invoice (Steps 5, 6 and 8 apply it automatically).");
      } catch (mailErr) {}
      return true;
    }
  }
  return false;
}

// ============================================================
// 📧 ESTIMATOR LEAD FOLLOW-UP SEQUENCE
// Anyone who uses the DV calculator on the marketing site and gives their
// email (the estimator result is gated behind email) gets logged here.
// A staged sequence follows up until they register in the portal, or the
// sequence runs its course:
//   Email 1 — as close to immediate as the trigger interval allows
//   Email 2 — ~24 hours after first submission, if still not registered
//   (includes a one-time $100 discount off the back-end $299 fee)
//   Email 3 — ~3 days after first submission
//   Email 4 — ~7 days after first submission (final touch)
// ============================================================
const ESTIMATOR_FOLLOWUP_SHEET_NAME = "Estimator Lead Followups";

function setupEstimatorFollowupSheet() {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(ESTIMATOR_FOLLOWUP_SHEET_NAME);

  var headers = ["Email", "Name", "Vehicle (Y/M/M)", "VIN", "State", "Mileage", "Estimated Range", "Session ID", "First Submitted", "Email 1 Sent At", "Email 2 Sent At", "Email 3 Sent At", "Email 4 Sent At", "Converted (Registered) At", "$100 Discount Offered At", "Discount Used At", "Do Not Email (Yes/blank)"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
  sheet.setFrozenRows(1);

  var doNotEmailRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Yes"], true).setAllowInvalid(true).build();
  sheet.getRange("Q2:Q1000").setDataValidation(doNotEmailRule);

  var ui;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  if (ui) ui.alert("✅ '" + ESTIMATOR_FOLLOWUP_SHEET_NAME + "' tab is set up and ready.");
}

// Upserts by Session ID so a repeat estimator run in the same browser
// session updates the same row (fresher estimate, same follow-up clock)
// instead of restarting the sequence.
function logEstimatorFollowupLead(clientName, clientEmail, year, make, model, vin, state, mileage, estimatedDvRange, sessionId) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME);
  if (!sheet) { setupEstimatorFollowupSheet(); sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME); }

  var vehicleStr = [year, make, model].filter(Boolean).join(" ");
  var cleanVin = (vin && vin !== "N/A") ? vin : "";
  var existingRow = findRowBySessionId(sheet, 8, sessionId, 2000);

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, 7).setValues([[clientEmail, clientName, vehicleStr, cleanVin, state || "", mileage || "", estimatedDvRange || ""]]);
  } else {
    sheet.appendRow([clientEmail, clientName, vehicleStr, cleanVin, state || "", mileage || "", estimatedDvRange || "", sessionId, new Date(), "", "", "", "", "", "", ""]);
  }
}

// Used by the portal's login screen — when someone types in an email that
// isn't a registered customer yet, this looks up whether they ran the DV
// estimator, so the registration form can pre-fill their vehicle/state/
// mileage instead of asking them to type it all in again.
function findEstimatorLeadForPrefill(email) {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME);
  if (!sheet) return null;

  var cleanEmail = sanitizeEmail(email);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (var i = data.length - 1; i >= 0; i--) { // most recent match first
    if (sanitizeEmail(data[i][0]) === cleanEmail) {
      var leadName = data[i][1] || "";
      if (leadName === "Inquiry Lead") leadName = ""; // generic fallback from the estimator, not a real name
      return { name: leadName, vehicle: data[i][2] || "", vin: data[i][3] || "", state: data[i][4] || "", mileage: data[i][5] || "" };
    }
  }
  return null;
}

// Runs on a recurring trigger — checks every lead against Customer Directory
// (has this email registered in the portal since?) and sends whichever
// stage email is due, based on days elapsed since first submission.
function processEstimatorFollowups() {
  var ss = getWorkingSpreadsheet();
  var sheet = ss.getSheetByName(ESTIMATOR_FOLLOWUP_SHEET_NAME);
  if (!sheet) return;

  var custSheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var data = sheet.getRange(2, 1, lastRow - 1, 17).getValues();
  var now = new Date();

  for (var i = 0; i < data.length; i++) {
    var row = i + 2;
    var email = data[i][0];
    var name = data[i][1] || "there";
    var vehicle = data[i][2] || "your vehicle";
    // data[i][3] = VIN, data[i][4] = State, data[i][5] = Mileage — not needed for these emails
    var range = data[i][6] || "";
    var firstSubmitted = data[i][8];
    var email1At = data[i][9];
    var email2At = data[i][10];
    var email3At = data[i][11];
    var email4At = data[i][12];
    var convertedAt = data[i][13];
    var doNotEmail = data[i][16];

    if (!email || !(firstSubmitted instanceof Date) || convertedAt) continue;

    // Manually flagged "Do Not Email" (col Q) — Kevin is handling this
    // customer directly, skip the automated sequence entirely.
    if (doNotEmail && doNotEmail.toString().trim().toUpperCase() === "YES") continue;

    // Already registered in the portal? Mark converted, stop the sequence.
    if (custSheet) {
      var custRow = findCustomerRowByEmail(custSheet, email);
      if (custRow) {
        sheet.getRange(row, 14).setValue(now);
        continue;
      }
    }

    // Used a shop referral/promo code? Stop the sequence entirely — someone
    // coming in through a shop referral shouldn't also get the $100
    // estimator discount pitch (Email 2). This is a belt-and-suspenders
    // check alongside the registration check above: registering already
    // stops the sequence in most cases, but a promo code could be used
    // just under the wire before that registration check catches it.
    if (emailHasUsedReferralCode(email)) {
      sheet.getRange(row, 14).setValue(now);
      continue;
    }

    var daysSince = (now.getTime() - firstSubmitted.getTime()) / (1000 * 60 * 60 * 24);
    // "Inquiry Lead" is the generic fallback handleWebSubmission uses when no
    // real name was given — without this check, the greeting would say
    // "Hi Inquiry," which is exactly the kind of thing that looks like a
    // mail-merge mistake. Treat it the same as no name at all.
    var cleanName = (name.toString().trim() === "Inquiry Lead") ? "" : name.toString().trim();
    var firstName = cleanName.split(" ")[0] || "there";
    // Includes ?s=<email> — the portal already auto-detects this param on
    // page load and checks it immediately, so clicking this link skips
    // straight past re-typing the email at all.
    var portalLink = "https://appraisals.estimateconsultants.com/?s=" + encodeURIComponent(email);

    try {
      if (!email1At) {
        MailApp.sendEmail(email, "Your Diminished Value Estimate — " + vehicle,
          "Hi " + firstName + ",\n\nThanks for checking your Diminished Value estimate for your " + vehicle + (range ? (": " + range) : "") + ".\n\n" +
          "Ready to get started? You can register and submit your claim anytime, right from our client portal:\n" + portalLink + "\n\n" +
          "If you have any questions, just reply to this email, text, or call us at 910-333-6001.\n\nThank you,\nKevin Murty\nEstimate Consultants");
        sheet.getRange(row, 10).setValue(now);
      } else if (!email2At && daysSince >= 1) {
        // 💸 One-time $100 discount on the final $299 fee — tracked here and
        // consumed later, whenever Kevin actually sends the final invoice
        // (Step 8 / sendFinalPhase), however far in the future that is.
        MailApp.sendEmail(email, "A one-time $100 off, if you're ready",
          "Hi " + firstName + ",\n\nJust checking in about your Diminished Value estimate for your " + vehicle + (range ? (": " + range) : "") + ".\n\n" +
          "There's no cost to you if it doesn't work out — our Money-Back Guarantee means you're never out of pocket for a low outcome. Unlike guarantees that require you to sue for your refund, ours is simple: if the offer doesn't cover our fee, you get it back. Period.\n\n" +
          "And if you get started now, we'd like to offer you $100 off your final fee — bringing it down to $199 instead of $299. This is a one-time offer just for you. Whenever you're ready:\n" + portalLink + "\n\n" +
          "Questions? Just reply to this email, text, or call 910-333-6001.\n\nThank you,\nKevin Murty\nEstimate Consultants");
        sheet.getRange(row, 11).setValue(now);
        sheet.getRange(row, 15).setValue(now); // $100 Discount Offered At
      } else if (!email3At && daysSince >= 3) {
        MailApp.sendEmail(email, "A quick note on timing",
          "Hi " + firstName + ",\n\nOne thing worth knowing about Diminished Value claims: the longer you wait after the accident, the harder it can be to document damage and gather clean records. It doesn't close the door, but earlier is easier.\n\n" +
          "Your estimate for your " + vehicle + (range ? (" was: " + range) : "") + ". You can pick up right where you left off here:\n" + portalLink + "\n\n" +
          "Questions? Just reply to this email, text, or call 910-333-6001.\n\nThank you,\nKevin Murty\nEstimate Consultants");
        sheet.getRange(row, 12).setValue(now);
      } else if (!email4At && daysSince >= 7) {
        MailApp.sendEmail(email, "Last check-in about your Diminished Value estimate",
          "Hi " + firstName + ",\n\nThis is just our last note about the Diminished Value estimate we ran for your " + vehicle + (range ? (": " + range) : "") + ". If you'd still like to move forward, you can start anytime here:\n" + portalLink + "\n\n" +
          "If now isn't the right time, no worries at all — feel free to reach back out by email, text, or phone (910-333-6001) whenever it is.\n\n" +
          "Thank you,\nKevin Murty\nEstimate Consultants");
        sheet.getRange(row, 13).setValue(now);
      }
    } catch (mailErr) {
      console.error("Estimator follow-up email failed for " + email + ": " + mailErr);
    }
  }
}

function setupEstimatorFollowupTrigger() {
  var ui = SpreadsheetApp.getUi();
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'processEstimatorFollowups') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('processEstimatorFollowups').timeBased().everyMinutes(30).create();
  ui.alert("⏰ Automatic estimator lead follow-up sequence enabled — runs every 30 minutes.");
}

// ============================================================================
//  APPROVAL QUEUE  -  every outgoing step waits for your click.
//  Flip any of these to false later and that step will send automatically.
// ============================================================================
const APPROVAL_REQUIRED = { followup: true, intake: true, invoice: true, offer: true, award: true, deliver: false, demand: true, clientupdate: true };   // deliver=false: paid reports go out immediately (we promise delivery within the hour)
const MANUAL_ACTIONS_ = { intake: 1, invoice: 1, offer: 1, award: 1, deliver: 1, demand: 1 };   // done from the Actions tab
const COL_APPROVAL_REQ = 113;                  // "Approval Requested" marker (prevents duplicate requests; clear the cell to re-request)
const OWNER_MAIL_ADDRESS = 'Kevin Murty\nEstimate Consultants\n324 Allingham Rd\nPiedmont, SC 29673';   // return address on the certified-mail label

const APPROVAL_TITLES_ = {
  followup: 'Send follow-up to the insurer', clientupdate: 'Send update to the client', award: 'Send the Award Letter', intake: 'Send intake / signing link', invoice: 'Send invoice', offer: 'Send final offer link + $299 invoice', deliver: 'Deliver the finished report'
};

function approvalPreview_(row, action) {
  const full = getMainSheet().getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const needs = missingFor_(full).filter(function(m) { return m.level === 'need'; }).map(function(m) { return m.label; });
  return (needs.length ? '⚠ MISSING INFO: ' + needs.join(', ') + '\n\n' : '') + approvalPreviewBody_(row, action);
}

function approvalPreviewBody_(row, action) {
  const d = getMainSheet().getRange(row, 1, 1, 35).getValues()[0];
  const use = String(d[25] || '');
  const who = d[0] + ' <' + d[4] + '>';
  if (action === 'intake') return 'Emails ' + who + ' the link to e-sign the intake agreement' + (isInsurerDV_(use) ? ' and sends the $199 retainer invoice through Wave' : '') + '.\n\nType: ' + use;
  if (action === 'clientupdate') { const u = buildWeeklyUpdate_(row, getMainSheet().getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0]); return 'To: ' + (u.email || '(NO CLIENT EMAIL ON FILE)') + '\nSubject: ' + u.subject + '\n\n' + u.text; }
  if (action === 'followup') { const f = followupDraft_(row, getMainSheet().getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0]); return 'To: ' + f.to + '\nSubject: ' + f.subject + '\n\n' + f.body; }
  if (action === 'invoice') return 'Sends ' + who + ' the Wave invoice for: ' + use + '.\nThe finished PDF is found, so the work looks complete. As soon as Wave shows it paid, the finished appraisal is emailed to them automatically (the report is held until then).';
  if (action === 'offer') return 'Offer amount on file: ' + d[32] + '.\nUpdates the offer document, emails ' + who + ' the offer signing link, and sends the $299 final Wave invoice.';
  if (action === 'award') return 'Agreed value on file: ' + fmtMoney(d[COL_AWARD_ACV - 1]) + '.\nCreates the Award Document (' + (isAppraisalClauseDV_(use) ? 'diminished value' : 'actual cash value') + ' version) and emails the carrier\'s appraiser (' + d[COL_CARRIER_APPRAISER - 1] + ', ' + d[COL_CARRIER_APPRAISER_EMAIL - 1] + ') a link to e-sign it.\nOnce signed, the executed copy is emailed automatically to the appraiser, to ' + who + ', and to the adjuster, and you are notified.';
  if (action === 'deliver') {
    const m = buildFinalPdfEmail_({ clientName: d[0], intendedUse: use, vehicle: vehicleFromRow_(d), row: row });
    return (isDvApprovalType_(use) ? 'Payment is not checked for diminished value - this goes out when YOU approve. When you approve, this email goes to ' : 'Payment is in. This email goes to ') + who + ' with the final PDF attached (demand letter first, then the appraisal, exhibits, and the signed agreement last):\n\nSubject: ' + m.subject + '\n\n' + m.text;
  }
  return '';
}

function requestApprovalOnce_(sheet, row, action, uniq) {
  const marker = String(sheet.getRange(row, COL_APPROVAL_REQ).getValue() || '');
  const key = action + '@' + (uniq || '');
  if (marker.indexOf(key) >= 0) return false;
  const name = String(sheet.getRange(row, 1).getValue() || '');
  const use = String(sheet.getRange(row, 26).getValue() || '');
  // These steps are now done from the file panel (⚡ Actions tab), where you review everything before it sends - so no approval email.
  if (MANUAL_ACTIONS_[action] && (action !== 'deliver' || isDvApprovalType_(use))) {
    sheet.getRange(row, COL_APPROVAL_REQ).setValue((marker + ' ' + key + '|manual ' + new Date().toISOString().slice(0, 16)).trim());
    return true;
  }
  if (!APPROVAL_REQUIRED[action] && !(action === 'deliver' && isDvApprovalType_(use))) {   // DV reports are always sent only after YOU approve
    sheet.getRange(row, COL_APPROVAL_REQ).setValue(marker + ' ' + key + '|auto ' + new Date().toISOString().slice(0, 16));
    const res = performApprovalAction_(row, action);
    try { GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, (res.ok ? '✅ Sent automatically: ' : '⚠️ AUTO-SEND FAILED: ') + (APPROVAL_TITLES_[action] || action) + ' - ' + name, (res.msg || '') + '\n\nRow ' + row + '\n\nDocuments:\n' + docLinksText_(approvalDocs_(row, action, false))); } catch (e) {}
    return true;
  }
  const link = actionLink_(row, 'do_' + action);
  const body = ((action === 'deliver' && isDvApprovalType_(use)) ? 'Send the appraisal to the client (they get the Approve & Proceed button)' : (APPROVAL_TITLES_[action] || action)) + ' for ' + name + ' (' + use + ') is ready. NOTHING has been sent.\n\nAPPROVE & SEND:\n' + link + '\n\n----- WHAT WILL HAPPEN -----\n' + approvalPreview_(row, action) + '\n\n(To re-issue this request, clear cell ' + 'DI' + row + '.)';
  const docs = approvalDocs_(row, action, true);
  const opts = {}; const blobs = docBlobs_(docs); if (blobs.length) opts.attachments = blobs;
  GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '⏳ Approve: ' + ((action === 'deliver' && isDvApprovalType_(use)) ? 'Send the appraisal to the DV client' : (APPROVAL_TITLES_[action] || action)) + ' - ' + name, body + '\n\n----- DOCUMENTS THAT WILL BE SENT (PDF copies attached; links open the originals) -----\n' + docLinksText_(docs), opts);
  sheet.getRange(row, COL_APPROVAL_REQ).setValue((marker + ' ' + key + '|' + new Date().toISOString().slice(0, 16)).trim());
  return true;
}

// Looks at one row and requests approval for whatever step is due. Called from the 5-minute trigger.
function scanRowForApprovals_(sheet, row, d, status, authInv, finalInv, folderUrl) {
  const use = String(d[25] || '');
  const direct = isDirectDV_(use), isDV = isInsurerDV_(use);
  try {
    // 0. manual entry with a valid type and no folder yet -> build the folder + docs (internal only, nothing is sent)
    if (/^Manual Entry - New/.test(status) && !folderUrl && d[0] && d[4] && getDocIdArray_(use)) {
      const res = generateClientFileForRow(row);
      if (!res.success) console.error('Auto folder creation failed row ' + row + ': ' + res.message);
      return true;
    }
    // 1. folder + docs exist, intake not sent yet
    if (!direct && d[4] && /^Folders & Docs Created/.test(status) && !d[COL_AUTH_SIGN_STATUS - 1]) return requestApprovalOnce_(sheet, row, 'intake');
    // 2. work finished (final PDF compiled) -> invoice (non-insurer-DV types)
    if (!isDV && !authInv && !finalInv && d[4] && folderUrl && (direct || status.indexOf('Auth Signed') >= 0) && !/Delivered/.test(status) && findFolderPdf_(folderUrl)) return requestApprovalOnce_(sheet, row, 'invoice');
    // 2b. appraisers agreed (value typed in column CU) -> Award Letter
    if (!direct && !isDV && toNum(d[COL_AWARD_ACV - 1]) > 0 && String(d[COL_CARRIER_APPRAISER_EMAIL - 1]).indexOf('@') > 0 && !/Award/.test(status) && isAppraisalClauseAny_(use)) return requestApprovalOnce_(sheet, row, 'award');
    // 3. insurer DV: offer entered -> final phase
    const offer = parseFloat(String(d[32]).replace(/[^0-9.]/g, ''));
    if (isDV && offer > 0 && !finalInv && !/Final Offer|Paid in Full/.test(status)) return requestApprovalOnce_(sheet, row, 'offer');
  } catch (e) { console.error('scanRowForApprovals_ row ' + row + ': ' + e); }
  return false;
}

// Does the step (no UI). Returns { ok, msg }.
function performApprovalAction_(row, action) {
  const msgs = [];
  const shim = { alert: function(m) { msgs.push(String(m)); return m; } };
  const sheet = getMainSheet();
  try {
    if (action === 'intake') sendAuthAndInvoiceCore_(row, shim);
    else if (action === 'invoice') sendFinalInvoiceCore_(row, shim);
    else if (action === 'offer') sendFinalPhaseCore_(row, shim);
    else if (action === 'award') sendAwardLetter_(row, msgs);
    else if (action === 'clientupdate') {
      const du = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0]; const u = buildWeeklyUpdate_(row, du);
      if (!u.email) return { ok: false, msg: 'No client email on file.' };
      GmailApp.sendEmail(u.email, u.subject, u.text, { name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL });
      sheet.getRange(row, COL_LAST_WEEKLY).setValue(new Date()).setNumberFormat('MM/dd/yyyy');
      msgs.push('Update emailed to ' + u.email + '.');
    }
    else if (action === 'followup') {
      const dd = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0]; const f = followupDraft_(row, dd);
      if (!f.to) return { ok: false, msg: 'No adjuster email.' };
      GmailApp.sendEmail(f.to, f.subject, f.body, { name: 'Estimate Consultants', replyTo: 'customerservice@estimateconsultants.com' });
      sheet.getRange(row, COL_LAST_INSURER_FU).setValue(new Date()).setNumberFormat('MM/dd/yyyy');
      msgs.push('Follow-up emailed to ' + f.to + '.');
    }
    else if (action === 'deliver') {
      const d = sheet.getRange(row, 1, 1, 35).getValues()[0];
      const use = String(d[25] || '');
      if (!sendFinalPdfIfAvailable(d[27], d[4], { clientName: d[0], intendedUse: use, vehicle: vehicleFromRow_(d), row: row })) return { ok: false, msg: 'No final PDF found in Completed / Final Appraisal PDF - nothing was sent.' };
      if (isDvApprovalType_(use)) sheet.getRange(row, 30).setValue('Report Delivered - Awaiting Client OK ⏳').setBackground('#d1ecf1').setFontColor('#0c5460');
      else sheet.getRange(row, 30).setValue('Paid & Final PDF Delivered ✅').setBackground('#d1ecf1').setFontColor('#0c5460');
      msgs.push('Report emailed to ' + d[4] + '.');
    } else return { ok: false, msg: 'Unknown action.' };
    return { ok: true, msg: msgs.join('\n') || 'Done.' };
  } catch (e) { return { ok: false, msg: 'Error: ' + e }; }
}

// The award document already in the client's folder (never recreated, so your edits stay), or null.
function awardDocFile_(row) {
  const rowData = getMainSheet().getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const id = String(rowData[COL_AWARD_DOC_ID - 1] || '').trim();
  if (id) { try { const f = DriveApp.getFileById(id); if (!f.isTrashed()) return f; } catch (e) {} }
  return null;
}
function awardEmailDraft_(row, rowData) {
  const dv = isAppraisalClauseDV_(rowData[25]);
  const apprName = String(rowData[COL_CARRIER_APPRAISER - 1] || '').trim();
  const link = actionLink_(row, 'awardsign');
  return {
    to: String(rowData[COL_CARRIER_APPRAISER_EMAIL - 1] || '').trim(),
    subject: 'Please sign: Appraisal Award Document - ' + rowData[0] + ' (Claim #' + (rowData[9] || 'N/A') + ')',
    body: 'Hello' + (apprName ? ' ' + apprName : '') + ',\n\nThank you for working with me on this claim. We have agreed on a ' + (dv ? 'diminished value' : 'value') + ' of ' + fmtMoney(rowData[COL_AWARD_ACV - 1]) + '. Please review and e-sign the Appraisal Award Document here (it takes about a minute):\n\n' + link + '\n\nIf you would rather not e-sign, the Award Document is also attached as a PDF - you can print it, sign it, and email it back to me.\n\nOnce you sign, a copy of the executed document is emailed to you automatically.\n\nThank you,\nKevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com'
  };
}
// ed (optional, from the review screen): { to, cc, subject, body, attachPdf }
function sendAwardLetter_(row, msgs, ed) {
  ed = ed || {};
  const sheet = getMainSheet();
  let rowData = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const draft = awardEmailDraft_(row, rowData);
  const apprEmail = String(ed.to !== undefined && ed.to !== '' ? ed.to : draft.to).trim();
  if (apprEmail.indexOf('@') < 1) throw new Error("Enter the carrier appraiser's email first.");
  let doc = awardDocFile_(row);
  if (!doc) { doc = createAwardDocCore_(row, rowData); sheet.getRange(row, COL_AWARD_DOC_ID).setValue(doc.getId()); }
  const opts = { name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL };
  if (ed.cc && String(ed.cc).trim()) opts.cc = String(ed.cc).trim();
  if (ed.attachPdf === undefined || ed.attachPdf === true || ed.attachPdf === '1' || ed.attachPdf === 1) opts.attachments = [doc.getAs(MimeType.PDF).setName(doc.getName().replace(/\.pdf$/i, '') + '.pdf')];
  GmailApp.sendEmail(apprEmail, (ed.subject && String(ed.subject).trim()) || draft.subject, (ed.body && String(ed.body).trim()) ? String(ed.body) : draft.body, opts);
  msgs.push('Award letter emailed to the carrier appraiser (' + apprEmail + ')' + (opts.attachments ? ' with the PDF attached' : '') + '.');
  sheet.getRange(row, 30).setValue('Award Sent for Carrier Appraiser Signature ⏳').setBackground('#fff3cd').setFontColor('#856404');
}


// ============================================================================
//  AWARD LETTER: carrier's appraiser e-signs, then everyone gets the signed copy
// ============================================================================
function placeSignatureImage_(doc, tag, sigBlob) {
  docSections_(doc).forEach(section => {
    const found = section.findText(escapeRegex_(tag));
    if (!found) return;
    const el = found.getElement();
    const parent = el.getParent();
    let img = null;
    if (parent.getType() === DocumentApp.ElementType.PARAGRAPH) img = parent.asParagraph().appendInlineImage(sigBlob);
    else if (parent.getType() === DocumentApp.ElementType.TABLE_CELL) img = parent.asTableCell().appendParagraph('').appendInlineImage(sigBlob);
    if (img) {
      const w = img.getWidth(), h = img.getHeight();
      img.setWidth(190).setHeight(Math.max(30, Math.round(h * (190 / (w || 190)))));
      el.removeFromParent();
    }
  });
}

function awardSignPage_(row, token) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'awardsign')) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2><p>Please contact Estimate Consultants at ' + OWNER_PHONE + '.</p>');
  const d = getMainSheet().getRange(r, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  if (String(d[29] || '').indexOf('Award Signed') >= 0) return proceedPageHtml_('Already Signed', '<div class="big">✅</div><h2>Already signed</h2><p>This Award Document has been signed. A copy was emailed to you.</p>');
  const docId = String(d[COL_AWARD_DOC_ID - 1] || '');
  let preview = '';
  if (docId) { try { DriveApp.getFileById(docId).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); preview = 'https://docs.google.com/document/d/' + docId + '/preview?rm=minimal'; } catch (e) {} }
  const name = escHtml_(String(d[COL_CARRIER_APPRAISER - 1] || ''));
  const dv = isAppraisalClauseDV_(d[25]);
  const html = '<h2>Appraisal Award Document</h2><p>Claim #' + escHtml_(d[9] || 'N/A') + ' &middot; ' + escHtml_(d[7] || '') + '<br>Agreed ' + (dv ? 'diminished value' : 'value') + ': <strong>' + escHtml_(fmtMoney(d[COL_AWARD_ACV - 1])) + '</strong></p>' +
    (preview ? '<iframe src="' + preview + '" style="width:100%;height:420px;border:1px solid #ddd;border-radius:6px"></iframe>' : '') +
    '<label style="font-weight:bold;font-size:13px">Printed name</label><input id="n" value="' + name + '" style="width:100%;padding:10px;font-size:15px;box-sizing:border-box;margin:4px 0 12px">' +
    '<label style="font-weight:bold;font-size:13px">Sign below</label><canvas id="c" width="440" height="140" style="width:100%;border:1px dashed #888;border-radius:6px;touch-action:none;background:#fff"></canvas>' +
    '<p><a href="#" onclick="clr();return false">Clear</a></p>' +
    '<label class="box"><input type="checkbox" id="a" onchange="chk()"><span>I am the appraiser for the insurance carrier and I agree to the value stated in this Award Document.</span></label>' +
    '<button id="b" disabled onclick="go()">Sign &amp; Submit</button><p id="m"></p>' +
    '<script>var c=document.getElementById("c"),x=c.getContext("2d"),dr=false,ink=false;x.lineWidth=2.2;x.lineCap="round";' +
    'function p(e){var r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return[(t.clientX-r.left)*c.width/r.width,(t.clientY-r.top)*c.height/r.height]}' +
    'function st(e){dr=true;var q=p(e);x.beginPath();x.moveTo(q[0],q[1]);e.preventDefault()}function mv(e){if(!dr)return;var q=p(e);x.lineTo(q[0],q[1]);x.stroke();ink=true;chk();e.preventDefault()}function en(){dr=false}' +
    '["mousedown","touchstart"].forEach(function(v){c.addEventListener(v,st)});["mousemove","touchmove"].forEach(function(v){c.addEventListener(v,mv)});["mouseup","mouseleave","touchend"].forEach(function(v){c.addEventListener(v,en)});' +
    'function clr(){x.clearRect(0,0,c.width,c.height);ink=false;chk()}function chk(){document.getElementById("b").disabled=!(ink&&document.getElementById("a").checked)}' +
    'function go(){var b=document.getElementById("b");b.disabled=true;b.textContent="Submitting...";google.script.run.withSuccessHandler(function(res){if(res&&res.ok){document.querySelector(".card").innerHTML=\'<div class="big">✅</div><h2>Signed</h2><p>Thank you. A signed copy is being emailed to you.</p>\'}else{b.disabled=false;b.textContent="Sign & Submit";document.getElementById("m").className="err";document.getElementById("m").textContent=(res&&res.error)||"Something went wrong."}})' +
    '.withFailureHandler(function(e){b.disabled=false;b.textContent="Sign & Submit";document.getElementById("m").className="err";document.getElementById("m").textContent=e.message}).submitAwardSignature(' + r + ',"' + token + '",document.getElementById("n").value,c.toDataURL("image/png"))}</script>';
  return proceedPageHtml_('Sign Award Document', html);
}

function submitAwardSignature(row, token, name, sigDataUrl) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || token !== proceedToken_(r, 'awardsign')) return { ok: false, error: 'Invalid link.' };
  if (!String(name || '').trim()) return { ok: false, error: 'Please enter your printed name.' };
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getMainSheet();
    const d = sheet.getRange(r, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
    if (String(d[29] || '').indexOf('Award Signed') >= 0) return { ok: true };
    const docId = String(d[COL_AWARD_DOC_ID - 1] || '');
    if (!docId) return { ok: false, error: 'The award document could not be found. Please contact ' + OWNER_PHONE + '.' };
    const sigBlob = Utilities.newBlob(Utilities.base64Decode(String(sigDataUrl).split(',')[1]), 'image/png', 'signature.png');
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy');
    const doc = DocumentApp.openById(docId);
    fillTag(doc, '{{Carrier_Appraiser_Name}}', String(name).trim());
    fillTag(doc, '{{Carrier_Date_Signed}}', today);
    placeSignatureImage_(doc, '{{Carrier_Signature}}', sigBlob);
    cleanDollarSigns_(doc);
    doc.saveAndClose();
    Utilities.sleep(2000);
    const file = DriveApp.getFileById(docId);
    const pdf = file.getAs(MimeType.PDF).setName('Signed Appraisal Award Document - ' + d[0] + '.pdf');
    try { const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/); if (m) { const it = DriveApp.getFolderById(m[1]).getFoldersByName('Completed'); if (it.hasNext()) it.next().createFile(pdf); } } catch (e) {}
    const dv = isAppraisalClauseDV_(d[25]);
    const veh = vehicleFromRow_(d);
    const first = String(d[0] || '').trim().split(/\s+/)[0] || 'there';
    const sent = [];
    const to = function(addr, subj, body) { if (addr) { GmailApp.sendEmail(addr, subj, body, { attachments: [pdf], name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL }); sent.push(addr); } };
    const sigLine = '\n\nKevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
    to(String(d[COL_CARRIER_APPRAISER_EMAIL - 1] || '').trim(), 'Signed Appraisal Award Document - ' + d[0] + ' (Claim #' + (d[9] || 'N/A') + ')', 'Hello ' + String(name).trim() + ',\n\nThank you for signing. Attached is your copy of the executed Appraisal Award Document.' + sigLine);
    to(String(d[4] || '').trim(), 'Your Appraisal Award Letter' + (veh ? ' - ' + veh : ''), 'Hello ' + first + ',\n\nGreat news. The appraisers have reached an agreement' + (veh ? ' on your ' + veh : '') + ', and the Award Letter is now signed by both appraisers. Attached is the Award Letter, which is the binding ' + (dv ? 'diminished value' : 'value') + '. You can now move forward with the insurer for payment.\n\nPlease let me know if you have any questions.\n\nThank you!' + sigLine);
    to(String(d[12] || '').trim(), 'Executed Appraisal Award Document - ' + d[0] + ' (Claim #' + (d[9] || 'N/A') + ')', 'Hello ' + (String(d[10] || '').trim() || 'Adjuster') + ',\n\nAttached is the executed Appraisal Award Document signed by both appraisers. Please process payment accordingly and let me know once it has been issued.' + sigLine);
    to(ADMIN_NOTIFICATION_EMAIL, '✅ Award signed: ' + d[0], String(name).trim() + ' signed the Award Document for ' + d[0] + '. Copies sent to: ' + sent.join(', '));
    sheet.getRange(r, 30).setValue('Award Signed ✅ - Letter Delivered').setBackground('#d4edda').setFontColor('#155724');
    return { ok: true };
  } catch (e) { return { ok: false, error: String(e) }; } finally { lock.releaseLock(); }
}

function approvalPage_(row, token, action) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || !APPROVAL_TITLES_[action] || token !== proceedToken_(r, 'do_' + action)) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2>');
  const name = String(getMainSheet().getRange(r, 1).getValue() || '');
  const html = '<h2>' + escHtml_(APPROVAL_TITLES_[action]) + '</h2><p><strong>' + escHtml_(name) + '</strong></p><div style="white-space:pre-wrap;background:#f7f7f7;border:1px solid #ddd;border-radius:6px;padding:10px;font-size:13px;max-height:340px;overflow:auto">' + escHtml_(approvalPreview_(r, action)) + '</div>' + docLinksHtml_(approvalDocs_(r, action, false)) +
    '<p></p><button id="b" onclick="go()">Approve &amp; Send</button><p id="m"></p><script>function go(){var b=document.getElementById("b");b.disabled=true;b.textContent="Working...";google.script.run.withSuccessHandler(function(x){var m=document.getElementById("m");' +
    'if(x.ok){document.querySelector(".card").innerHTML=\'<div class="big">✅</div><h2>Done</h2><p style="white-space:pre-wrap">\'+x.msg.replace(/</g,"&lt;")+\'</p>\'}else{b.disabled=false;b.textContent="Approve & Send";m.className="err";m.textContent=x.msg}}).withFailureHandler(function(e){b.disabled=false;document.getElementById("m").className="err";document.getElementById("m").textContent=e.message}).approveAction(' + r + ',"' + token + '","' + action + '")}</script>';
  return proceedPageHtml_('Approve - Estimate Consultants', html);
}

function approveAction(row, token, action) {
  const r = parseInt(row, 10);
  if (!r || r <= 1 || !APPROVAL_TITLES_[action] || token !== proceedToken_(r, 'do_' + action)) return { ok: false, msg: 'Invalid link.' };
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return performApprovalAction_(r, action); } finally { lock.releaseLock(); }
}

function checkPendingApprovalsNow() {
  checkStatusAndDeliver();
  SpreadsheetApp.getUi().alert('Checked. Any steps that are ready have been emailed to you for approval.');
}

// ---- certified mail label ----
// Page 2 of the label file: two EIGHTH-PAGE labels (each 1/8 of the 4 x 6 page = 2 x 1.5 in) side by side, with thin cut guides:
//   left = SHIPPING address (TO), right = RETURN address (FROM). Cut them out and place them on the green Certified Mail form / Return Receipt.
const CERT_TAG_W_IN = 2, CERT_TAG_H_IN = 1.5;   // each eighth-page label
function buildCertifiedFormLabelsPdf_(pkg) {
  const toLines = [pkg.carrier];
  if (pkg.adjName && pkg.adjName !== 'Adjuster') toLines.push('Attn: ' + pkg.adjName);
  String(pkg.carrierAddress || '(ADD CARRIER ADDRESS IN THE SHEET)').split('\n').forEach(function(l) { if (String(l).trim()) toLines.push(String(l).trim()); });
  const fromLines = String(OWNER_MAIL_ADDRESS).split('\n').filter(function(l) { return String(l).trim(); });
  const doc = DocumentApp.create('tmp-smalllabels-' + new Date().getTime());
  try {
    const body = doc.getBody();
    body.setPageWidth(LABEL_W_IN * 72).setPageHeight(LABEL_H_IN * 72);
    body.setMarginTop(7).setMarginBottom(0).setMarginLeft(0).setMarginRight(0);
    body.clear();
    const t = body.appendTable([['', '']]);
    t.setColumnWidth(0, CERT_TAG_W_IN * 72).setColumnWidth(1, CERT_TAG_W_IN * 72);
    t.setBorderWidth(0.5).setBorderColor('#999999');
    t.getRow(0).setMinimumHeight(CERT_TAG_H_IN * 72);
    const fill = function(c, head, lines, big) {
      c.setPaddingTop(6).setPaddingBottom(2).setPaddingLeft(8).setPaddingRight(4); c.clear();
      const put = function(txt, size, bold) { const pp = c.appendParagraph(txt); pp.setSpacingAfter(1).setSpacingBefore(0).setLineSpacing(1); pp.editAsText().setFontFamily('Arial').setFontSize(size).setBold(!!bold); };
      put(head, 7, true);
      lines.forEach(function(l, i) { put(l, big && i === 0 ? 10 : 9, big && i === 0); });
      try { c.removeChild(c.getChild(0)); } catch (e) {}
    };
    fill(t.getRow(0).getCell(0), 'SHIP TO:', toLines, true);
    fill(t.getRow(0).getCell(1), 'RETURN ADDRESS:', fromLines, true);
    try { const last = body.getChild(body.getNumChildren() - 1); if (last.getType() === DocumentApp.ElementType.PARAGRAPH) { last.asParagraph().setSpacingAfter(0); last.asParagraph().editAsText().setFontSize(1); } } catch (e) {}
    doc.saveAndClose();
    return [DriveApp.getFileById(doc.getId()).getAs('application/pdf').setName('Label - Shipping + Return Address (eighth-page) - ' + pkg.clientName + '.pdf')];
  } finally { try { DriveApp.getFileById(doc.getId()).setTrashed(true); } catch (e) {} }
}

// Label size in inches (4 x 6 = standard thermal shipping label). Change these two numbers if your label printer uses another size.
const LABEL_W_IN = 4, LABEL_H_IN = 6;
function buildCertifiedLabelPdf_(pkg) {
  const toLines = [pkg.carrier];
  if (pkg.adjName && pkg.adjName !== 'Adjuster') toLines.push('Attn: ' + pkg.adjName);
  toLines.push('Claim #' + pkg.claimNum);
  String(pkg.carrierAddress || '(ADD CARRIER MAILING ADDRESS IN THE SHEET)').split('\n').forEach(function(l) { if (String(l).trim()) toLines.push(String(l).trim()); });
  const doc = DocumentApp.create('tmp-label-' + new Date().getTime());
  try {
    const body = doc.getBody();
    body.setPageWidth(LABEL_W_IN * 72).setPageHeight(LABEL_H_IN * 72);
    body.setMarginTop(14).setMarginBottom(10).setMarginLeft(16).setMarginRight(16);
    body.clear();
    const add = function(text, size, bold, space) {
      const p = body.appendParagraph(text); p.setSpacingAfter(space || 0).setSpacingBefore(0).setLineSpacing(1.05);
      p.editAsText().setFontFamily('Arial').setFontSize(size).setBold(!!bold); return p;
    };
    add('FROM:', 8, true, 1);
    String(OWNER_MAIL_ADDRESS).split('\n').forEach(function(l) { add(l, 9, false, 0); });
    add('', 6, false, 4);
    add('CERTIFIED MAIL', 16, true, 0).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    add('RETURN RECEIPT REQUESTED', 11, true, 8).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    add('TO:', 9, true, 2);
    toLines.forEach(function(l, i) { add(l, i === 0 ? 17 : 14, i === 0, 2).setIndentStart(14); });
    doc.saveAndClose();
    const pdf = DriveApp.getFileById(doc.getId()).getAs('application/pdf').setName('Certified Mail Label - ' + pkg.clientName + '.pdf');
    return pdf;
  } finally { try { DriveApp.getFileById(doc.getId()).setTrashed(true); } catch (e) {} }
}

// ============================================================================
//  AUTOMATIONS: weekly client updates, insurer follow-ups, prospect follow-ups, daily digest
//  (every outgoing email waits for your approval; weekly updates and prospect follow-ups are approved in one batch page)
// ============================================================================
const STALE_NOTE_DAYS = 7;          // a progress note older than this is flagged as outdated
const WEEKLY_UPDATE_EVERY_DAYS = 7;
const FOLLOWUP_FIRST_BUSINESS_DAYS = 10, FOLLOWUP_REPEAT_BUSINESS_DAYS = 5;
const PROSPECT_FOLLOWUP_DAYS = 3;

function today_() { return new Date(); }
function dateStr_(d) { return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function daysAgo_(d) { return Math.floor((new Date().getTime() - new Date(d).getTime()) / 86400000); }
function bizDaysSince_(d) {
  let n = 0; const cur = new Date(d); const end = new Date();
  cur.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
  while (cur < end) { cur.setDate(cur.getDate() + 1); const w = cur.getDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}
function asDate_(v) { if (v instanceof Date) return v; if (!v) return null; const t = new Date(v); return isNaN(t.getTime()) ? null : t; }

// Parses the newest entry of the progress log ("MM/dd/yyyy — note").
function lastNoteInfo_(log) {
  const first = String(log || '').split(/\r?\n/).filter(function(x) { return x.trim(); })[0] || '';
  const m = first.match(/^(\d{2})\/(\d{2})\/(\d{4})\s*[—\-–]\s*(.*)$/);
  if (!m) return { date: null, text: '', ageDays: null };
  const dt = new Date(parseInt(m[3], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10));
  return { date: dt, text: m[4].trim(), ageDays: daysAgo_(dt) };
}

// Plain-English stage + next steps for the client, from the row status and claim type.
function stageInfo_(d) {
  const use = String(d[25] || ''), st = String(d[29] || '');
  const v = deliveryVariant_(use), ac = (v === 'acTL' || v === 'acDV'), dv = (v === 'insurerDV'), direct = isDirectDV_(use);
  const lastFU = asDate_(d[COL_LAST_INSURER_FU - 1]);
  const sentOn = lastFU ? Utilities.formatDate(lastFU, Session.getScriptTimeZone(), 'MMMM d') : 'recently';
  const out = { eligible: false, terminal: false, stage: '', next: '' };
  if (/Closed/.test(st) || /Paid in Full|Award Signed/.test(st)) { out.terminal = true; return out; }
  if (/Paid & Final PDF Delivered/.test(st) && !ac && !dv) { out.terminal = true; return out; }
  if (/Auth Signed/.test(st)) { out.eligible = true; out.stage = 'Your signed agreement is on file and I am working on your appraisal.'; out.next = dv ? 'Your appraisal will be completed and delivered within 2-3 business days.' : 'You will receive an invoice by email when the appraisal is finished. Once it is paid, the appraisal is delivered within an hour.'; }
  else if (/Invoice Sent|Awaiting Payment/.test(st)) { out.eligible = true; out.stage = 'Your appraisal is complete and your invoice has been sent.'; out.next = 'Once the invoice is paid, the appraisal is emailed to you within an hour. If you do not receive it in a couple of hours, just let me know.'; }
  else if (/Delivered|Awaiting Client OK/.test(st)) { out.eligible = true; out.stage = 'Your appraisal has been delivered.'; out.next = 'Please review it and click the "OK to Proceed" button in that email (or simply reply) so I can begin the next phase. I will not proceed until I hear from you.'; }
  else if (/Client OK/.test(st)) { out.eligible = true; out.stage = 'Thank you for the go-ahead. I am preparing the formal notice to the insurance company.'; out.next = 'It goes out shortly and I will confirm once it has been sent.'; }
  else if (/Demand Emailed/.test(st)) {
    out.eligible = true;
    if (ac) { out.stage = 'The notice invoking the Appraisal Clause was sent to the insurance company on ' + sentOn + '. We are working with their side to get an appraiser identified.'; out.next = 'Once their appraiser is identified, we exchange appraisals and work toward an agreed value. This typically takes about 1-2 weeks, or 3-4 weeks if an umpire is needed (roughly $300 extra on your side). You will receive the Award Letter once a value is agreed.'; }
    else { out.stage = 'The demand was sent to the insurance company on ' + sentOn + ' and I am following up with them.'; out.next = 'When the insurer responds with an offer, I will review it against the appraisal and answer their points. The remaining $299 is invoiced at the time of the offer.'; }
  }
  else if (/Final Offer|Offer Signed/.test(st)) { out.eligible = true; out.stage = 'The insurer has made an offer and your final paperwork is in progress.'; out.next = 'Please complete the offer confirmation and final invoice sent to you so I can wrap things up.'; }
  else if (/Award Sent/.test(st)) { out.eligible = true; out.stage = 'The appraisers have agreed on a value, and the Award Letter is waiting on the insurer\'s appraiser to sign.'; out.next = 'As soon as it is signed, you will receive the Award Letter, which is the binding value.'; }
  if (direct && !out.eligible && /Invoice/.test(st)) out.eligible = true;
  return out;
}

function buildWeeklyUpdate_(row, d) {
  const si = stageInfo_(d);
  const note = lastNoteInfo_(d[93]);
  const fresh = note.date && note.ageDays <= STALE_NOTE_DAYS;
  const first = String(d[0] || '').trim().split(/\s+/)[0] || 'there';
  const veh = vehicleFromRow_(d);
  const latest = fresh ? note.text : 'No new developments since my last update, but I am staying on top of your file.';
  const subject = 'Weekly Update' + (veh ? ' - Your ' + veh + ' Appraisal' : ' - Your Appraisal');
  const text = 'Hello ' + first + ',\n\nHere is your weekly update' + (veh ? ' on your ' + veh : '') + '.\n\nWHERE THINGS STAND\n' + si.stage + '\n\n' + progressText_(progressInfo_(d)) + '\n\nLATEST\n' + latest + '\n\nNEXT STEPS\n' + si.next + '\n\nPlease reach out any time with questions at ' + OWNER_PHONE + ' or by replying to this email.\n\nThank you!\n\nKevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
  return { subject: subject, text: text, noteDate: note.date, noteAge: note.ageDays, fresh: !!fresh, name: d[0], email: String(d[4] || '').trim(), row: row, stage: si.stage };
}

function dueWeeklyRows_() {
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const last = sheet.getLastRow(); if (last < 2) return [];
  const data = sheet.getRange(2, 1, last - 1, MAIN_ROW_WIDTH).getValues();
  const out = [];
  data.forEach(function(d, i) {
    if (!d[0] || String(d[4] || '').indexOf('@') < 1) return;
    const si = stageInfo_(d);
    if (!si.eligible || si.terminal) return;
    const lastSent = asDate_(d[COL_LAST_WEEKLY - 1]);
    if (lastSent && daysAgo_(lastSent) < WEEKLY_UPDATE_EVERY_DAYS) return;
    out.push(buildWeeklyUpdate_(i + 2, d));
  });
  return out;
}

function batchPage_(title, intro, items, fnName, token) {
  const rowsHtml = items.map(function(it) {
    return '<label style="display:block;border:1px solid #ddd;border-radius:8px;padding:10px;margin:8px 0;background:#fff"><input type="checkbox" class="c" value="' + it.id + '" checked style="margin-right:8px">' +
      '<strong>' + escHtml_(it.title) + '</strong>' + (it.flag ? ' <span style="color:#b45309;font-weight:bold">' + escHtml_(it.flag) + '</span>' : '') +
      '<div style="white-space:pre-wrap;font-size:12px;color:#444;margin-top:6px;max-height:140px;overflow:auto">' + escHtml_(it.preview) + '</div></label>';
  }).join('');
  const html = '<h2>' + escHtml_(title) + '</h2><p>' + escHtml_(intro) + '</p>' + (rowsHtml || '<p>Nothing is due right now.</p>') +
    (items.length ? '<button id="b" onclick="go()">Approve &amp; Send Checked</button><p id="m"></p>' : '') +
    '<script>function go(){var ids=[].slice.call(document.querySelectorAll(".c:checked")).map(function(x){return x.value});if(!ids.length){document.getElementById("m").textContent="Nothing checked.";return}var b=document.getElementById("b");b.disabled=true;b.textContent="Sending...";google.script.run.withSuccessHandler(function(n){document.querySelector(".card").innerHTML=\'<div class="big">✅</div><h2>Sent \'+n+\'</h2>\'}).withFailureHandler(function(e){b.disabled=false;document.getElementById("m").className="err";document.getElementById("m").textContent=e.message})["' + fnName + '"]("' + token + '",ids)}</script>';
  return proceedPageHtml_(title, html);
}

function weeklyApprovalPage_(token) {
  if (token !== proceedToken_(1, 'weekly')) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2>');
  const items = dueWeeklyRows_().map(function(u) {
    return { id: u.row, title: u.name + ' <' + u.email + '>', flag: u.fresh ? '' : (u.noteDate ? '⚠ last note ' + u.noteAge + ' days ago - will say "no new developments"' : '⚠ no progress note - will say "no new developments"'), preview: u.subject + '\n\n' + u.text };
  });
  return batchPage_('Weekly client updates', 'Each client gets a quick update and next steps. Flagged ones have no fresh progress note, so they will say there are no new developments. Uncheck any you want to skip (go update that note first).', items, 'approveWeeklyBatch', token);
}

function approveWeeklyBatch(token, rows) {
  if (token !== proceedToken_(1, 'weekly')) throw new Error('Invalid link.');
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sheet = getMainSheet(); let n = 0;
    (rows || []).forEach(function(r) {
      const row = parseInt(r, 10); if (!row || row < 2) return;
      const d = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
      const lastSent = asDate_(d[COL_LAST_WEEKLY - 1]);
      if (lastSent && daysAgo_(lastSent) < WEEKLY_UPDATE_EVERY_DAYS) return;     // never double-send
      const u = buildWeeklyUpdate_(row, d);
      if (!u.email) return;
      GmailApp.sendEmail(u.email, u.subject, u.text, { name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL });
      sheet.getRange(row, COL_LAST_WEEKLY).setValue(new Date()).setNumberFormat('MM/dd/yyyy');
      n++;
    });
    return n + ' update' + (n === 1 ? '' : 's');
  } finally { lock.releaseLock(); }
}

// ---- insurer follow-up (one approval per file) ----
function followupDraft_(row, d) {
  const use = String(d[25] || ''), v = deliveryVariant_(use), ac = (v === 'acTL' || v === 'acDV');
  const adj = String(d[10] || '').trim() || 'Adjuster', claim = d[9] || 'N/A', client = d[0];
  const veh = vehicleFromRow_(d);
  const subject = 'Following up - ' + client + ' (Claim #' + claim + ')';
  const body = 'Hello ' + adj + ',\n\nI am following up on the ' + (ac ? 'Notice of Appraisal Clause Invocation' : 'demand') + ' sent for ' + client + (veh ? ' (' + veh + ')' : '') + ', Claim #' + claim + '. ' +
    (ac ? 'Please identify the carrier\'s appointed appraiser so the appraisal process can move forward.' : 'Please let me know the status of your review and when we can expect a response.') +
    '\n\nThank you,\nEstimate Consultants\nPhone: ' + OWNER_PHONE + ' | Email: customerservice@estimateconsultants.com';
  return { subject: subject, body: body, to: String(d[12] || '').trim() };
}

function scanFollowups_(sheet, data) {
  for (let i = 1; i < data.length; i++) {
    const d = data[i]; const st = String(d[29] || '');
    if (!/^Demand Emailed/.test(st) || !d[12]) continue;
    if (!isAppraisalClauseDV_(d[25]) && !isAppraisalClauseAny_(d[25]) && toNum(d[32]) > 0) continue;   // offer already in
    const last = asDate_(d[COL_LAST_INSURER_FU - 1]); if (!last) continue;
    const need = (String(sheet.getRange(i + 1, COL_APPROVAL_REQ).getValue() || '').indexOf('followup@') >= 0) ? FOLLOWUP_REPEAT_BUSINESS_DAYS : FOLLOWUP_FIRST_BUSINESS_DAYS;
    if (bizDaysSince_(last) >= need) requestApprovalOnce_(sheet, i + 1, 'followup', dateStr_(last));
  }
}

// ---- prospects ----
function dueProspects_() {
  const ss = getWorkingSpreadsheet(); const log = ss.getSheetByName('Prospect Emails'); if (!log || log.getLastRow() < 2) return [];
  const vals = log.getRange(2, 1, log.getLastRow() - 1, 10).getValues();
  const main = getMainSheet(); const emails = {};
  main.getRange(2, 5, Math.max(1, main.getLastRow() - 1), 1).getValues().forEach(function(r) { if (r[0]) emails[String(r[0]).toLowerCase().trim()] = true; });
  const out = [];
  vals.forEach(function(v, i) {
    const em = String(v[2] || '').trim(), dt = asDate_(v[0]);
    if (!em || !dt || !/^Sent/.test(String(v[6])) || v[9] || emails[em.toLowerCase()]) return;
    if (daysAgo_(dt) >= PROSPECT_FOLLOWUP_DAYS) out.push({ row: i + 2, name: v[1], email: em, vehicle: v[4], type: v[5], sentDays: daysAgo_(dt) });
  });
  return out;
}
function prospectFollowupEmail_(p) {
  const first = String(p.name || '').trim().split(/\s+/)[0];
  const veh = String(p.vehicle || '').trim();
  const text = (first ? 'Hello ' + first + ',' : 'Hello,') + '\n\nI wanted to follow up on our conversation' + (veh ? ' about your ' + veh : '') + '. I know this can be a lot to sort through, so if you have any questions at all I am happy to walk through them. If you would like to move forward, just reply and I will get the paperwork started.\n\nThank you!\n\nKevin Murty\nEstimate Consultants\n' + OWNER_PHONE + '\nkevin@estimateconsultants.com';
  return { subject: 'Following up' + (veh ? ' - ' + veh : '') + ' - Estimate Consultants', text: text };
}
function prospectApprovalPage_(token) {
  if (token !== proceedToken_(1, 'prospects')) return proceedPageHtml_('Invalid Link', '<h2>Link not valid</h2>');
  const items = dueProspects_().map(function(p) { const m = prospectFollowupEmail_(p); return { id: p.row, title: (p.name || p.email) + ' <' + p.email + '>', flag: 'emailed ' + p.sentDays + ' days ago', preview: m.subject + '\n\n' + m.text }; });
  return batchPage_('Prospect follow-ups', 'These prospects were emailed a few days ago and have not signed up. Uncheck anyone you do not want to follow up with.', items, 'approveProspectBatch', token);
}
function approveProspectBatch(token, rows) {
  if (token !== proceedToken_(1, 'prospects')) throw new Error('Invalid link.');
  const log = getWorkingSpreadsheet().getSheetByName('Prospect Emails'); let n = 0;
  const due = {}; dueProspects_().forEach(function(p) { due[p.row] = p; });
  (rows || []).forEach(function(r) {
    const p = due[parseInt(r, 10)]; if (!p) return;
    const m = prospectFollowupEmail_(p);
    GmailApp.sendEmail(p.email, m.subject, m.text, { name: 'Kevin Murty - Estimate Consultants', replyTo: ADMIN_NOTIFICATION_EMAIL });
    log.getRange(p.row, 10).setValue(new Date()).setNumberFormat('MM/dd/yyyy'); n++;
  });
  return n + ' follow-up' + (n === 1 ? '' : 's');
}

// ---- daily run + digest ----
function dailyAutomationRun() {
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const last = sheet.getLastRow(); if (last < 2) return;
  const data = sheet.getRange(1, 1, last, MAIN_ROW_WIDTH).getValues();
  try { scanFollowups_(sheet, data); } catch (e) { console.error('scanFollowups_: ' + e); }
  const weekly = dueWeeklyRows_(), prospects = dueProspects_();
  const missingList = [], needNote = [], waiting = [], today = new Date(); today.setHours(0, 0, 0, 0);
  const dueFollow = [], prog = [];
  for (let i = 1; i < data.length; i++) {
    const d = data[i]; if (!d[0]) continue;
    const si = stageInfo_(d); if (!si.eligible || si.terminal) continue;
    const pi = progressInfo_(d); prog.push(d[0] + '  [' + pi.bar + '] ' + pi.done + '/' + pi.total + (pi.now ? '  - now: ' + pi.now : '  - done'));
    const mm = missingFor_(d); if (mm.length) missingList.push(d[0] + ': ' + mm.map(function(m) { return m.label; }).join(', '));
    const n = lastNoteInfo_(d[93]);
    if (!n.date || n.ageDays > STALE_NOTE_DAYS) needNote.push(d[0] + ' (' + (n.date ? 'last note ' + n.ageDays + ' days ago' : 'no note yet') + ')');
    if (/Demand Emailed/.test(String(d[29]))) { const l = asDate_(d[COL_LAST_INSURER_FU - 1]); waiting.push(d[0] + ' - ' + (d[7] || 'carrier') + (l ? ', ' + bizDaysSince_(l) + ' business days since last contact' : '')); }
    const fu = asDate_(d[94]); if (fu && fu <= today) dueFollow.push(d[0] + ' (follow-up date ' + Utilities.formatDate(fu, Session.getScriptTimeZone(), 'MM/dd') + (String(d[COL_FU_REASON - 1] || '').trim() ? ' - ' + String(d[COL_FU_REASON - 1]).trim() : '') + ')');
  }
  const L = function(t, arr) { return arr.length ? '\n' + t + ' (' + arr.length + ')\n- ' + arr.join('\n- ') + '\n' : ''; };
  let body = 'Good morning. Here is what needs you today.\n';
  if (weekly.length) body += '\nWEEKLY CLIENT UPDATES DUE (' + weekly.length + ') - review and approve:\n' + actionLink_(1, 'weekly') + '\n';
  if (prospects.length) body += '\nPROSPECT FOLLOW-UPS DUE (' + prospects.length + ') - review and approve:\n' + actionLink_(1, 'prospects') + '\n';
  body += L('WHERE EVERY FILE STANDS', prog);
  try { body += L('ATTACHMENTS FILED FROM EMAIL (last 24 hours)', filedSince_(24)); } catch (e) {}
  try { body += L('NEW EMAILS FROM PEOPLE NOT IN THE SHEET - open the 📬 New Emails tab', newMailPending_()); } catch (e) {}
  body += L('FILES MISSING INFORMATION', missingList);
  body += L('PROGRESS NOTES TO UPDATE (these will say "no new developments" in the weekly email)', needNote);
  body += L('FOLLOW-UP DATES DUE', dueFollow);
  body += L('WAITING ON THE INSURER / CARRIER', waiting);
  if (!weekly.length && !prospects.length && !missingList.length && !needNote.length && !dueFollow.length && !waiting.length) body += '\nNothing is waiting on you. Nice.\n';
  body += '\nAnything else (invoices, deliveries, demands, awards) comes to you as its own approval email the moment it is ready.';
  GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '☀️ Daily briefing - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'EEE MMM d'), body);
}

function setupDailyAutomationTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) { if (t.getHandlerFunction() === 'dailyAutomationRun') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyAutomationRun').timeBased().everyDays(1).atHour(7).create();
  SpreadsheetApp.getUi().alert('✅ Daily briefing, weekly-update batch, and follow-up checks will run every morning around 7 AM.');
}

// ============================================================================
//  ACTIVE FILES TAB  -  everything you are working on, in one place.
//  Type in this tab and it updates Sheet1 (and so the file panel, documents, emails). Sheet1 edits show up here too.
// ============================================================================
const ACTIVE_SHEET_NAME = '🔥 Active Files';
// [header, Sheet1 column (1-based) or a special key, width, numeric?]
const ACTIVE_COLS = [
  ['Row', 'ROW', 45], ['Client', 1, 150], ['Summary', 'SUMMARY', 330, false, true], ['Type', 26, 190], ['Stage', 30, 190, false, true], ['Progress', 'PROGRESS', 120, false, true], ['What to do next', 'NEXT', 280, false, true],
  ['⚠ Missing info', 'MISSING', 230, false, true], ['Last Note', 'NOTEDATE', 90, false, true], ['Follow-up date', 95, 100], ['Follow up about', COL_FU_REASON, 180], ['Add a progress note ↵', 'NOTE', 240],
  ['Phone', 2, 110], ['Email', 5, 190], ['Year', 16, 55], ['Make', 18, 80], ['Model', 19, 100], ['VIN', 17, 150], ['Mileage', 21, 75, true],
  ['Carrier', 8, 120], ['Claim #', 10, 110], ['Adjuster', 11, 120], ['Adjuster Phone', 12, 110], ['Adjuster Email', 13, 180],
  ['Carrier Mailing Address', COL_CARRIER_ADDR, 220],
  ['Carrier Appraiser', COL_CARRIER_APPRAISER, 140], ['Appraiser Email', COL_CARRIER_APPRAISER_EMAIL, 180], ['Appraiser Company', COL_CARRIER_APPRAISER_CO, 140],
  ['Offer Amount', 33, 90, true], ['Agreed Award Value', COL_AWARD_ACV, 110, true],
  ['Close file ☐', 'CLOSE', 80]
];
const ACTIVE_STATUS_RE = /Manual Entry|Folders|Auth|Initial|Invoice|Delivered|Client OK|Client Declined|Demand|Offer|Award|Portal|Report|Paid/;

function nextActionText_(d) {
  const use = String(d[25] || ''), st = String(d[29] || '');
  const v = deliveryVariant_(use), ac = (v === 'acTL' || v === 'acDV');
  if (/^Manual Entry - New/.test(st)) return 'Pick a valid Type; the folder and docs build automatically';
  if (/Folders & Docs/.test(st)) return 'Send the intake / signing link (File Panel > ⚡ Actions)';
  if (/Initial Auth|Portal Intake Complete/.test(st)) return 'Waiting for the client to sign';
  if (/Auth Signed/.test(st)) return (v === 'insurerDV' || v === 'acDV') ? 'Do the appraisal, compile the final PDF, then send it to the client (File Panel > ⚡ Actions)' : 'Do the appraisal, compile the final PDF, then send the invoice (File Panel > ⚡ Actions)';
  if (/Invoice Sent/.test(st)) return 'Waiting for payment (report sends itself)';
  if (/Delivered|Awaiting Client OK/.test(st)) return 'Waiting for the client\'s OK to proceed';
  if (/Client Declined/.test(st)) return 'Client chose NOT to proceed - follow up by phone or close the file';
  if (/Awaiting Your Approval/.test(st)) return 'Send the demand to the adjuster (File Panel > ⚡ Actions)';
  if (/Client OK/.test(st)) return 'Send the demand to the adjuster (File Panel > ⚡ Actions)';
  if (v === 'insurerDV' && parseFloat(String(d[32]).replace(/[^0-9.]/g, '')) > 0 && !d[34] && !/Final Offer|Paid in Full|Offer Signed/.test(st)) return 'Send the final offer link + $299 invoice (File Panel > ⚡ Actions)';
  if (ac && parseFloat(String(d[COL_AWARD_ACV - 1]).replace(/[^0-9.]/g, '')) > 0 && String(d[COL_CARRIER_APPRAISER_EMAIL - 1]).indexOf('@') > 0 && !/Award/.test(st)) return 'Create & send the award letter (File Panel > ⚡ Actions)';
  if (/Demand Emailed/.test(st)) {
    const l = asDate_(d[COL_LAST_INSURER_FU - 1]); const waited = l ? ' (' + bizDaysSince_(l) + ' business days)' : '';
    return ac ? 'Waiting on carrier to name an appraiser' + waited + '. Then enter appraiser info + agreed value' : 'Waiting on insurer' + waited + '. Enter the offer amount when it arrives';
  }
  if (/Final Offer|Offer Signed/.test(st)) return 'Waiting on client to sign offer and pay';
  if (/Award Sent/.test(st)) return 'Waiting for the carrier appraiser to sign';
  return '';
}

function activeRowValues_(d, row) {
  const n = lastNoteInfo_(d[93]);
  return ACTIVE_COLS.map(function(c) {
    const k = c[1];
    if (k === 'ROW') return row;
    if (k === 'NEXT') return nextActionText_(d);
    if (k === 'SUMMARY') return fileSummary_(d);
    if (k === 'PROGRESS') { const pi = progressInfo_(d); return pi.bar + ' ' + pi.done + '/' + pi.total; }
    if (k === 'NOTEDATE') return n.date ? Utilities.formatDate(n.date, Session.getScriptTimeZone(), 'MM/dd/yy') : 'none';
    if (k === 'MISSING') return missingFor_(d).map(function(m) { return m.label; }).join(', ');
    if (k === 'NOTE') return '';
    if (k === 'CLOSE') return false;
    const v = d[k - 1];
    return v === null || v === undefined ? '' : v;
  });
}

function refreshActiveFiles() {
  const ss = getWorkingSpreadsheet();
  const main = getMainSheet(); ensureMainWidth_(main);
  const last = main.getLastRow();
  const rows = [];
  if (last >= 2) {
    main.getRange(2, 1, last - 1, MAIN_ROW_WIDTH).getValues().forEach(function(d, i) {
      if (!d[0]) return;
      const st = String(d[29] || '');
      if (/Closed/.test(st) || !ACTIVE_STATUS_RE.test(st)) return;
      if (stageInfo_(d).terminal) return;
      rows.push({ row: i + 2, d: d });
    });
  }
  const urgent = function(r) { return /Approve|Send the|Pick a valid|Do the appraisal|Enter/.test(nextActionText_(r.d)) ? 0 : 1; };
  rows.sort(function(a, b) { return urgent(a) - urgent(b) || a.row - b.row; });

  let sh = ss.getSheetByName(ACTIVE_SHEET_NAME);
  const fresh = !sh;
  if (!sh) { sh = ss.insertSheet(ACTIVE_SHEET_NAME, 0); }
  const nC = ACTIVE_COLS.length;
  if (fresh || sh.getRange(1, 1, 1, nC).getValues()[0].join('|') !== ACTIVE_COLS.map(function(c) { return c[0]; }).join('|')) {
    sh.clear();
    sh.getRange(1, 1, 1, nC).setValues([ACTIVE_COLS.map(function(c) { return c[0]; })]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
    ACTIVE_COLS.forEach(function(c, i) { sh.setColumnWidth(i + 1, c[2]); });
    sh.setFrozenRows(1); sh.setFrozenColumns(2); sh.setRowHeight(1, 42);
  }
  const body = rows.map(function(r) { return activeRowValues_(r.d, r.row); });
  const oldLast = sh.getLastRow();
  const oldIds = oldLast > 1 ? sh.getRange(2, 1, oldLast - 1, 1).getValues().map(function(x) { return x[0]; }).join(',') : '';
  const newIds = rows.map(function(r) { return r.row; }).join(',');
  if (oldLast > 1 && oldIds !== newIds) sh.getRange(2, 1, oldLast - 1, nC).clearContent().clearDataValidations();
  if (body.length) {
    if (oldIds === newIds) {      // same files: update only cells that actually changed (never disturbs what you are typing)
      const cur = sh.getRange(2, 1, body.length, nC).getValues();
      body.forEach(function(rowVals, i) {
        ACTIVE_COLS.forEach(function(c, j) {
          if (c[1] === 'NOTE' || c[1] === 'CLOSE') return;
          if (String(cur[i][j]) !== String(rowVals[j])) sh.getRange(i + 2, j + 1).setValue(rowVals[j]);
        });
      });
    } else {
      sh.getRange(2, 1, body.length, nC).setValues(body);
    }
    const closeCol = ACTIVE_COLS.length;
    sh.getRange(2, closeCol, body.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
    // look
    sh.getRange(2, 1, body.length, nC).setVerticalAlignment('middle').setWrap(true);
    ACTIVE_COLS.forEach(function(c, j) { if (c[4]) sh.getRange(2, j + 1, body.length, 1).setBackground('#f1f5f9').setFontColor('#334155'); else sh.getRange(2, j + 1, body.length, 1).setBackground('#ffffff').setFontColor('#000000'); });
    const noteCol = ACTIVE_COLS.findIndex(function(c) { return c[1] === 'NOTEDATE'; }) + 1;
    const missCol = ACTIVE_COLS.findIndex(function(c) { return c[1] === 'MISSING'; }) + 1;
    rows.forEach(function(r, i) {
      const miss = missingFor_(r.d);
      sh.getRange(i + 2, missCol).setFontColor(miss.some(function(m) { return m.level === 'need'; }) ? '#b91c1c' : '#b45309').setFontWeight('bold').setBackground(miss.length ? '#fef2f2' : '#f1f5f9');
      miss.forEach(function(m) { const j = ACTIVE_COLS.findIndex(function(c) { return c[1] === (MISS_COLS_[m.key] + 1); }); if (j >= 0) sh.getRange(i + 2, j + 1).setBackground(m.level === 'need' ? '#fecaca' : '#fde68a'); });
    });
    const fuCol = activeColIndex_(95), tdy = new Date(); tdy.setHours(0, 0, 0, 0);
    rows.forEach(function(r, i) { const fu = asDate_(r.d[94]); if (!fu) { sh.getRange(i + 2, fuCol).setBackground('#ffffff').setFontColor('#000000').setFontWeight('normal'); return; } const dd = Math.round((fu - tdy) / 864e5); sh.getRange(i + 2, fuCol).setBackground(dd <= 0 ? '#fecaca' : dd <= 3 ? '#fde68a' : '#ffffff').setFontColor(dd <= 0 ? '#991b1b' : '#000000').setFontWeight(dd <= 3 ? 'bold' : 'normal'); });
    rows.forEach(function(r, i) { const n = lastNoteInfo_(r.d[93]); const stale = !n.date || n.ageDays > STALE_NOTE_DAYS; sh.getRange(i + 2, noteCol).setBackground(stale ? '#fecaca' : '#bbf7d0').setFontColor(stale ? '#991b1b' : '#166534').setFontWeight('bold'); });
    try { const tCol = activeColIndex_(26); if (tCol && body.length) sh.getRange(2, tCol, body.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(MASTER_DOC_MAP), true).setAllowInvalid(true).build()); } catch (x) {}
    ACTIVE_COLS.forEach(function(c, j) { const kd = (typeof c[1] === 'number') ? fmtKind_(c[1]) : ''; if (kd && FMT_NUMBER_FORMATS_[kd]) sh.getRange(2, j + 1, body.length, 1).setNumberFormat(FMT_NUMBER_FORMATS_[kd]); else if (kd === 'phone') sh.getRange(2, j + 1, body.length, 1).setNumberFormat('@'); });
  }
  sh.getRange(1, nC + 2).setValue('Tip: type in the white columns and it updates the main sheet and the file panel. Grey columns are read-only status. Red "Last Note" = add a progress note.').setFontColor('#64748b').setFontStyle('italic');
  try { refreshNeedsAction_(rows); } catch (e) { console.error('refreshNeedsAction_: ' + e); }
  return rows.length;
}

// ---- ✅ Needs Action: only the files waiting on YOU right now ----
const NEEDS_SHEET_NAME = '✅ Needs Action';
function fileSummary_(d) {
  return (String(d[25] || 'Type not set')) + '  ·  ' + (vehicleFromRow_(d) || 'vehicle not entered') + '  ·  ' + (String(d[29] || 'New'));
}
function needsActionInfo_(d) {
  const next = nextActionText_(d);
  const fu = asDate_(d[94]); const t = new Date(); t.setHours(0, 0, 0, 0);
  const due = (fu && fu <= t) ? 'Follow-up due ' + Utilities.formatDate(fu, Session.getScriptTimeZone(), 'MM/dd') + (d[COL_FU_REASON - 1] ? ': ' + d[COL_FU_REASON - 1] : '') : '';
  if (next && !/^Waiting/.test(next)) return { yes: true, what: next, due: due };
  if (due) return { yes: true, what: 'Follow up with the client or insurer', due: due };
  return { yes: false };
}
function refreshNeedsAction_(rows) {
  const ss = getWorkingSpreadsheet();
  let sh = ss.getSheetByName(NEEDS_SHEET_NAME);
  const heads = ['Row', 'Client', 'Appraisal · Vehicle · Stage', 'What you need to do', 'Due / note'];
  if (!sh) { sh = ss.insertSheet(NEEDS_SHEET_NAME, 1); }
  if (sh.getRange(1, 1, 1, heads.length).getValues()[0].join('|') !== heads.join('|')) {
    sh.clear();
    sh.getRange(1, 1, 1, heads.length).setValues([heads]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold').setVerticalAlignment('middle');
    [45, 170, 420, 420, 220].forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
    sh.setFrozenRows(1); sh.setRowHeight(1, 34);
  }
  const body = [];
  (rows || []).forEach(function(r) { const n = needsActionInfo_(r.d); if (n.yes) body.push([r.row, r.d[0], fileSummary_(r.d), n.what, n.due]); });
  const old = sh.getLastRow();
  if (old > 1) sh.getRange(2, 1, old - 1, heads.length).clearContent().setBackground(null);
  if (body.length) {
    sh.getRange(2, 1, body.length, heads.length).setValues(body).setWrap(true).setVerticalAlignment('middle');
    sh.getRange(2, 4, body.length, 1).setFontWeight('bold').setBackground('#fff7ed');
    sh.getRange(2, 5, body.length, 1).setFontColor('#b45309');
  } else {
    sh.getRange(2, 2).setValue('🎉 Nothing needs you right now.').setFontColor('#166534');
  }
  sh.getRange(1, heads.length + 2).setValue('Click a client row, then open the File Panel (🚗 Appraisals menu) and use the ⚡ Actions tab. This list updates itself.').setFontColor('#64748b').setFontStyle('italic');
  return body.length;
}
function goToNeedsAction() {
  refreshActiveFiles();
  const sh = getWorkingSpreadsheet().getSheetByName(NEEDS_SHEET_NAME);
  if (sh) getWorkingSpreadsheet().setActiveSheet(sh);
}
function activeColIndex_(key) { return ACTIVE_COLS.findIndex(function(c) { return c[1] === key; }) + 1; }

// Simple trigger: runs on every edit.
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sh = e.range.getSheet(); const name = sh.getName();
    if (name === ACTIVE_SHEET_NAME) return activeEdit_(e, sh);
    if (name === CLOSED_SHEET_NAME) return closedEdit_(e, sh);
    if (name === NEWMAIL_SHEET_NAME) return newMailEdit_(e, sh);
    if (name === MAIN_SHEET_NAME) { normalizeMainRange_(e.range); return mainEditMirror_(e, sh); }
  } catch (err) { console.error('onEdit: ' + err); }
}

function activeEdit_(e, sh) {
  const r = e.range.getRow(), c = e.range.getColumn();
  if (r < 2 || e.range.getNumRows() > 1 || e.range.getNumColumns() > 1) return;
  const def = ACTIVE_COLS[c - 1]; if (!def) return;
  const main = getMainSheet();
  const mainRow = parseInt(sh.getRange(r, 1).getValue(), 10);
  if (!mainRow || mainRow < 2) return;
  const nameInMain = String(main.getRange(mainRow, 1).getValue() || '');
  const nameHere = String(sh.getRange(r, activeColIndex_(1)).getValue() || '');
  const key = def[1];
  if (key !== 1 && nameInMain !== nameHere) { SpreadsheetApp.getActive().toast('Rows moved - refreshing the list. Please re-enter that change.', 'Active Files', 6); refreshActiveFiles(); return; }
  const val = e.range.getValue();
  if (key === 'NOTE') {
    const txt = String(val || '').trim(); if (!txt) return;
    const cell = main.getRange(mainRow, 94); const existing = String(cell.getValue() || '').trim();
    const entry = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy') + ' — ' + txt;
    cell.setValue(existing ? entry + '\n' + existing : entry);
    e.range.clearContent();
    const nc = activeColIndex_('NOTEDATE');
    sh.getRange(r, nc).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yy')).setBackground('#bbf7d0').setFontColor('#166534');
    return;
  }
  if (key === 'CLOSE') {
    if (val === true) {
      closeFileRow_(main, mainRow);
      sh.deleteRow(r);
      try { refreshClosedFiles_(); } catch (x) {}
      SpreadsheetApp.getActive().toast('Closed. It is in the 🗄 Closed Files tab - tick Reopen there to undo.', 'Active Files', 6);
    }
    return;
  }
  if (typeof key !== 'number' || def[4]) return;
  const shown = writeMainCell_(main, mainRow, key, String(val).trim() === '' ? '' : val);
  e.range.setValue(shown);
  try { e.range.setNumberFormat(main.getRange(mainRow, key).getNumberFormat()); } catch (x) {}
}

// A change in Sheet1 shows up in Active Files straight away.
function mainEditMirror_(e, sh) {
  const r = e.range.getRow(), c = e.range.getColumn();
  if (r < 2 || e.range.getNumRows() > 1 || e.range.getNumColumns() > 1) return;
  const act = getWorkingSpreadsheet().getSheetByName(ACTIVE_SHEET_NAME); if (!act || act.getLastRow() < 2) return;
  const ids = act.getRange(2, 1, act.getLastRow() - 1, 1).getValues();
  let hit = -1; for (let i = 0; i < ids.length; i++) if (parseInt(ids[i][0], 10) === r) { hit = i; break; }
  if (hit < 0) return;
  const j = ACTIVE_COLS.findIndex(function(x) { return x[1] === c; });
  if (j >= 0) act.getRange(hit + 2, j + 1).setValue(e.range.getValue());
}

// ============================================================================
//  FILE PANEL  -  large, autosaving editor for the selected file (works from Sheet1 or Active Files)
// ============================================================================
function activeFileRow_() {
  const ss = getWorkingSpreadsheet();
  let act = null;
  try { act = ss.getActiveSheet(); } catch (e) {}
  if (act && (act.getName() === ACTIVE_SHEET_NAME || act.getName() === NEEDS_SHEET_NAME)) {
    const rg = act.getActiveRange(); if (!rg) return 0;
    const r = rg.getRow(); if (r < 2) return 0;
    return parseInt(act.getRange(r, 1).getValue(), 10) || 0;
  }
  const main = getMainSheet();
  const rg = (act && act.getName() === main.getName() ? act : main).getActiveRange();
  return rg ? rg.getRow() : 0;
}
function getActiveFileRowNumber() { return activeFileRow_(); }

function getPanelData() {
  const d = getActiveRowData();
  if (!d) return null;
  const raw = getMainSheet().getRange(d.row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const n = lastNoteInfo_(d.progressLog);
  d.nextAction = nextActionText_(raw);
  d.noteDate = n.date ? Utilities.formatDate(n.date, Session.getScriptTimeZone(), 'MM/dd/yyyy') : '';
  d.noteAge = n.ageDays;
  d.vehicleLabel = vehicleFromRow_(raw);
  d.missing = missingFor_(raw);
  d.progress = progressInfo_(raw);
  d.prefilled = getPrefillMarks_(d.row);
  return d;
}

function addProgressNoteToRow(row, text) {
  const r = parseInt(row, 10); const t = String(text || '').trim();
  if (!r || r < 2 || !t) throw new Error('Nothing to add.');
  const cell = getMainSheet().getRange(r, 94);
  const existing = String(cell.getValue() || '').trim();
  const entry = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy') + ' — ' + t;
  const v = existing ? entry + '\n' + existing : entry;
  cell.setValue(v);
  return v;
}

const PANEL_SCHEMA_ = [
  { id: 'overview', title: 'Overview', icon: '📋', groups: [
    { title: 'Progress', prog: true },
    { title: 'Next follow-up', fu: true },
    { title: 'Update', notes: true },
    { title: 'Client', fields: [['name', 'Client name'], ['phone', 'Phone', 'ph'], ['email', 'Email'], ['address', 'Address', 't', 'w2'], ['mailingAddress', 'Mailing address', 't', 'w2'], ['extraEmails', 'Other email addresses for this file (spouse, repair shop, etc. - their attachments are filed here too; separate with commas)', 'ta', 'w2']] },
    { title: 'Appraisal', fields: [['intendedUse', 'Type of appraisal', 'sel:USE', 'w2'], ['uspapType', 'Report type'], ['appraisalId', 'Appraisal ID']] } ] },
  { id: 'actions', title: 'Actions', icon: '⚡', groups: [ { title: 'Actions', actions: true } ] },
  { id: 'claim', title: 'Claim & Carrier', icon: '🛡️', for: 'claim', groups: [
    { title: 'Claim', fields: [['carrier', 'Insurance carrier'], ['partyType', 'Party type', 'sel:PARTY'], ['claim', 'Claim #'], ['dateOfLoss', 'Date of loss', 'dt'], ['dateRepaired', 'Date repaired', 'dt'], ['lossState', 'Loss state', 'sel:STATE'], ['atFaultDriver', 'At-fault driver']] },
    { title: 'Adjuster', for: 'claim', fields: [['adjName', 'Adjuster name'], ['adjPhone', 'Adjuster phone', 'ph'], ['adjEmail', 'Adjuster email'], ['carrierAddress', 'Carrier mailing address (certified mail)', 'ta', 'w2']] },
    { title: 'Offer', for: 'ins', fields: [['offerAmount', 'Insurer offer amount', 'm']] } ] },
  { id: 'vehicle', title: 'Vehicle', icon: '🚗', groups: [
    { title: 'Vehicle', fields: [['year', 'Year'], ['make', 'Make'], ['model', 'Model'], ['trim', 'Trim'], ['vin', 'VIN', 'vin', 'w2'], ['mileage', 'Mileage', 'i'], ['plate', 'Plate'], ['regState', 'Reg. state', 'sel:STATE'], ['color', 'Color'], ['titleBranding', 'Title branding', 'sel:TITLE'], ['titleBrandNotes', 'Title brand notes', 't', 'w2']] },
    { title: 'Condition & history', fields: [['naaaGrade', 'NAAA condition grade', 'sel:NAAA', 'w2'], ['conditionNotes', 'Condition notes', 'ta', 'w2'], ['historyNotes', 'History notes', 'ta', 'w2']] },
    { title: 'Repairs', for: 'dv', fields: [['finalRepairBill', 'Final repair bill', 'm'], ['repairCategories', 'Repair categories (check every one that applies - checks the box in the report)', 'chk:CATS', 'w3'], ['repairNotes', 'Repair notes', 'ta', 'w2']] },
    { title: 'Options on the appraised vehicle (+ adds / − deducts)', fields: [['subjectOpt', 'Add a line for each option or condition that adds to or deducts from the value', 'opt', 'w3']] },
    { title: 'Screenshots - VIN History Report & other (paste or add a PDF)', ex: ['carfax', 'other1', 'other2'] } ] },
  { id: 'values', title: 'Trade-In Values', icon: '💵', for: 'dv', groups: [
    { title: 'Guides', fields: [['nadaVal', 'NADA / J.D. Power value', 'm'], ['nadaDate', 'NADA date', 'dt'], ['nadaDef', 'NADA rating', 'sel:NADA'], ['nadaNotes', 'NADA notes', 'ta', 'w2'], ['kbbVal', 'KBB value', 'm'], ['kbbDate', 'KBB date', 'dt'], ['kbbDef', 'KBB rating', 'sel:KBB'], ['kbbNotes', 'KBB notes', 'ta', 'w2']] },
    { title: 'Screenshots - NADA / J.D. Power and KBB (paste or add a PDF; date sourced fills in automatically)', ex: ['nada', 'kbb'] },
    { title: 'Dealer trade-in offers (the name you type prints in the report)', fields: [['dealer1Name', 'Dealer 1 name'], ['carmaxOffer', 'Dealer 1 offer', 'm'], ['carmaxDate', 'Dealer 1 date', 'dt'], ['dealer2Name', 'Dealer 2 name'], ['carvanaOffer', 'Dealer 2 offer', 'm'], ['carvanaDate', 'Dealer 2 date', 'dt'], ['dealer3Name', 'Dealer 3 name'], ['dealer3Offer', 'Dealer 3 offer', 'm'], ['dealer3Date', 'Dealer 3 date', 'dt'], ['tradeInCompNotes', 'Trade-in comp notes', 'ta', 'w2'], ['tradeValNotes', 'Trade value notes', 'ta', 'w2']] },
    { title: 'Screenshots - dealer trade-in offers (paste or add a PDF; date sourced fills in automatically)', ex: ['d1', 'd2', 'd3'] } ] },
  { id: 'comps', title: 'Comparables', icon: '📊', groups: [
    { title: 'Settings', fields: [['ratePerMile', 'Rate per mile ($)', 'r']] },
    { title: 'Comp 1', fields: [['comp1Price', 'Price', 'm'], ['comp1Dealer', 'Dealer'], ['comp1Date', 'Date', 'dt'], ['comp1Miles', 'Miles', 'i'], ['comp1Fee', 'Dealer fee', 'm'], ['comp1Notes', 'Comp notes', 'ta', 'w2'], ['comp1Opt', 'Options adjustments - add a line for each (+ adds / − deducts)', 'opt', 'w3']] },
    { title: 'Comp 1 - listing screenshot & vehicle history report (paste or add a PDF)', ex: ['comp1', 'comp1h'] },
    { title: 'Comp 2', fields: [['comp2Price', 'Price', 'm'], ['comp2Dealer', 'Dealer'], ['comp2Date', 'Date', 'dt'], ['comp2Miles', 'Miles', 'i'], ['comp2Fee', 'Dealer fee', 'm'], ['comp2Notes', 'Comp notes', 'ta', 'w2'], ['comp2Opt', 'Options adjustments - add a line for each (+ adds / − deducts)', 'opt', 'w3']] },
    { title: 'Comp 2 - listing screenshot & vehicle history report (paste or add a PDF)', ex: ['comp2', 'comp2h'] },
    { title: 'Comp 3', fields: [['comp3Price', 'Price', 'm'], ['comp3Dealer', 'Dealer'], ['comp3Date', 'Date', 'dt'], ['comp3Miles', 'Miles', 'i'], ['comp3Fee', 'Dealer fee', 'm'], ['comp3Notes', 'Comp notes', 'ta', 'w2'], ['comp3Opt', 'Options adjustments - add a line for each (+ adds / − deducts)', 'opt', 'w3']] },
    { title: 'Comp 3 - listing screenshot & vehicle history report (paste or add a PDF)', ex: ['comp3', 'comp3h'] } ] },
  { id: 'calc', title: 'Valuation', icon: '🧮', groups: [
    { title: 'Market adjustments', fields: [['fmvCompNotes', 'FMV comp notes', 'ta', 'w2'], ['carGurusDate', 'Market trend date'], ['carGurusPct', 'Market trend %', 'p'], ['historicalNotes', 'Historical notes', 'ta', 'w2'], ['valuationNotes', 'Valuation notes', 'ta', 'w2']] },
    { title: 'Diminished value deduction', for: 'dv', fields: [['priorDamageDeduct', 'Prior damage deduction ($)', 'm']] },
    { title: 'Taxes & fees (actual cash value)', for: 'acv', fields: [['salesTaxPct', 'Sales tax %', 'p'], ['tagTitleFee', 'Tag & title fee ($)', 'm']] } ] },
  { id: 'exhibits', title: 'Exhibits & Full PDF', icon: '📎', groups: [ { title: 'Full PDF contents', plan: true }, { title: 'Additional', custom: true }, { title: 'Received', recv: true } ] },
  { id: 'award', title: 'Award Letter', icon: '📜', for: 'ac', groups: [
    { title: 'Carrier\'s appraiser (the award is e-signed by them)', fields: [['carrierAppraiserName', 'Appraiser name'], ['carrierAppraiserEmail', 'Appraiser email'], ['carrierAppraiserCompany', 'Appraiser company'], ['awardAcv', 'Agreed value ($) - ACV or diminished value', 'm']] } ] }
];

function panelSize_() {
  try { const v = JSON.parse(PropertiesService.getUserProperties().getProperty('PANEL_SIZE') || 'null'); if (v && v.w && v.h) return v; } catch (e) {}
  return { w: 1040, h: 800 };
}
// Called from the panel's Full screen button (the browser window decides the real maximum).
function resizeFilePanel(w, h) {
  w = Math.max(900, Math.min(3000, parseInt(w, 10) || 1040)); h = Math.max(600, Math.min(2000, parseInt(h, 10) || 800));
  PropertiesService.getUserProperties().setProperty('PANEL_SIZE', JSON.stringify({ w: w, h: h }));
  showFilePanel();
  return true;
}
function showFilePanel() {
  const schema = JSON.stringify(PANEL_SCHEMA_);
  const conditionRatings = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  const lists = JSON.stringify({ USE: Object.keys(MASTER_DOC_MAP), NAAA: ['#1 EXCELLENT', '#2 BETTER THAN AVERAGE', '#3 NORMAL WEAR AND TEAR', '#4 EXCESSIVE WEAR AND TEAR', '#5 SHOWS SIGNS OF SEVERE ABUSE'],
    PARTY: ['1st Party', '3rd Party'], TITLE: ['Clean', 'Salvage', 'Rebuilt', 'Reconstructed', 'Junk', 'Flood', 'Lemon / Buyback', 'Unknown'],
    STATE: ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'],
    CATS: ['Cat 1: Frame/Structural Damage (CPO Ineligible; highest stigma loss)', 'Cat 2: Body Repair with Filler', 'Cat 3: Paint Labor (Non-factory depth, clearcoat mismatch, or orange peel)', 'Cat 4: Used Parts Replacement (Requires reconditioning/filler)', 'Cat 5: Aftermarket Parts Replacement (Non-OEM quality/fitment)', 'Cat 6: New OEM Parts (Missing original factory VIN stamps)', 'Cat 7: Mechanical/Electrical System Repairs', 'Cat 8: Body Labor (Hand repair vs OEM robotic factory assembly)'],
    NADA: ['High Trade-In Value', 'Average Trade-In Value', 'Low Trade-In Value'].concat(conditionRatings), KBB: conditionRatings });
  const sz = panelSize_();
  const html = HtmlService.createHtmlOutput(filePanelHtml_().replace('__SCHEMA__', schema).replace('__LISTS__', lists).replace('__ACTIONSJS__', function() { return ACTIONS_JS_; })).setWidth(sz.w).setHeight(sz.h);
  SpreadsheetApp.getUi().showModelessDialog(html, '📂 File Panel');
}

function filePanelHtml_() {
  return '<!DOCTYPE html><html><head><base target="_top"><meta charset="utf-8"><style>' +
'*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f1f5f9;color:#0f172a;font-size:14px}' +
'.top{background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;padding:14px 22px;position:sticky;top:0;z-index:5;box-shadow:0 2px 10px rgba(0,0,0,.25)}' +
'.top h1{margin:0;font-size:20px;font-weight:700}.sub{opacity:.85;font-size:13px;margin-top:3px}' +
'.pills{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;align-items:center}.pill{background:rgba(255,255,255,.16);padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600}' +
'.pill.g{background:#16a34a}.pill.r{background:#dc2626}.pill.y{background:#d97706}#save{margin-left:auto;font-size:12px;font-weight:600}' +
'.tabs{display:flex;gap:4px;background:#fff;padding:8px 14px 0;border-bottom:1px solid #e2e8f0;position:sticky;top:118px;z-index:4;overflow-x:auto}' +
'.tab{padding:10px 15px;border-radius:10px 10px 0 0;cursor:pointer;font-weight:600;color:#475569;white-space:nowrap;border:0;background:transparent;font-size:13px}.tab.on{background:#f1f5f9;color:#1e3a8a;box-shadow:inset 0 -3px 0 #d97706}' +
'.wrap{padding:18px 22px 90px}.card{background:#fff;border-radius:14px;padding:16px 18px;margin-bottom:16px;box-shadow:0 1px 4px rgba(15,23,42,.08)}' +
'.card h3{margin:0 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.w2{grid-column:span 2}' +
'label{display:block;font-size:11px;font-weight:700;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}' +
'input,select,textarea{width:100%;padding:9px 11px;border:1.5px solid #cbd5e1;border-radius:9px;font-size:14px;font-family:inherit;background:#fff;color:#0f172a;transition:border .15s,box-shadow .15s}' +
'input:focus,select:focus,textarea:focus{outline:0;border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}textarea{min-height:62px;resize:vertical}input.dirty,textarea.dirty,select.dirty{border-color:#d97706}' +
'.actions{display:flex;gap:8px;flex-wrap:wrap}.btn{border:0;border-radius:9px;padding:9px 14px;font-weight:700;font-size:13px;cursor:pointer;background:#e2e8f0;color:#0f172a}.btn.p{background:#1e3a8a;color:#fff}.btn:hover{filter:brightness(.95)}' +
'.bar{position:fixed;bottom:0;left:0;right:0;background:#0f172a;color:#fff;padding:10px 22px;display:flex;gap:24px;font-size:13px}.bar b{color:#fbbf24;font-size:15px}' +
'.empty{padding:60px;text-align:center;color:#64748b;font-size:16px}.log{white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;padding:10px;max-height:300px;overflow:auto;font-size:13px}' +
'.miss{border-color:#dc2626!important;background:#fef2f2!important}.soon{border-color:#f59e0b!important;background:#fffbeb!important}.warn{background:#fff;border-left:5px solid #dc2626;border-radius:10px;padding:12px 16px;margin:14px 22px 0;box-shadow:0 1px 4px rgba(15,23,42,.08)}.warn.amber{border-left-color:#f59e0b}.warn b{display:block;margin-bottom:6px}.chip{display:inline-block;margin:2px 4px 2px 0;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;background:#fee2e2;color:#991b1b}.chip.soon{background:#fef3c7;color:#92400e}' +
'.panel{display:none}.panel.on{display:block}.exr{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #e5e7eb}.exn{flex:1;font-weight:600}.exs{font-size:13px;min-width:130px}.exs.ok{color:#15803d}.exs.no{color:#b91c1c}.exm{margin-top:8px;font-size:13px}.pbar{height:10px;border-radius:99px;background:#e2e8f0;overflow:hidden}.pfill{height:100%;background:linear-gradient(90deg,#2563eb,#16a34a);transition:width .4s}.psteps{display:flex;gap:6px;margin-top:14px}.ps{flex:1;text-align:center;font-size:12px;color:#64748b}.pc{width:30px;height:30px;border-radius:50%;background:#e2e8f0;color:#475569;display:flex;align-items:center;justify-content:center;font-weight:800;margin:0 auto 6px}.ps.d .pc{background:#16a34a;color:#fff}.ps.c .pc{background:#2563eb;color:#fff;box-shadow:0 0 0 4px rgba(37,99,235,.25)}.ps.d,.ps.c{color:#0f172a;font-weight:700}.pt{margin-top:12px;font-size:13px;color:#334155}.w3{grid-column:1/-1}.optrow{display:grid;grid-template-columns:1fr 130px 130px 40px;gap:8px;margin-bottom:8px}.opta{display:flex;align-items:center;gap:14px}.optt{font-weight:700;color:#1e3a8a}.chks{display:grid;grid-template-columns:1fr 1fr;gap:2px 18px}.ckr{display:flex!important;gap:8px;align-items:flex-start;text-transform:none!important;letter-spacing:0!important;font-size:13px!important;font-weight:500!important;color:#0f172a!important;margin:3px 0!important;cursor:pointer}.ckr input{width:auto;margin-top:2px}.fur{display:grid;grid-template-columns:1fr 2fr;gap:12px}#fus{margin-top:10px;font-weight:700;font-size:14px}.card.fu{border-left:5px solid #2563eb}.exh{margin:0 0 10px;color:#64748b;font-size:13px}.exla{flex:1;font-weight:600}.exadd{display:flex;gap:10px;margin-top:12px}.exi{font-size:13px;line-height:1.7;margin-bottom:10px}#exo{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99;display:flex;align-items:center;justify-content:center}.exb{background:#fff;border-radius:12px;padding:22px;width:min(560px,92vw)}#exz{border:3px dashed #2563eb;border-radius:10px;padding:34px;text-align:center;color:#2563eb;font-weight:600;outline:none}#exz:focus{background:#eff6ff}#exp{margin:10px 0;color:#b91c1c}@media(max-width:800px){.grid{grid-template-columns:1fr 1fr}.w2{grid-column:span 2}}' +
'.fsb{position:absolute;right:16px;top:10px;background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:8px;padding:6px 12px;font-weight:700;font-size:12px;cursor:pointer}.fsb:hover{background:rgba(255,255,255,.3)}' +
'</style></head><body><div class="top"><button class="fsb" id="fsb" onclick="bigSmall()">⛶ Full screen</button><h1 id="nm">Select a file…</h1><div class="sub" id="sb">Click a row in Active Files or Sheet1</div><div class="pills" id="pl"></div></div>' +
'<div id="warn"></div><div id="main"><div class="empty">Click a client row in <b>🔥 Active Files</b> (or Sheet1) and it loads here. Everything you type saves automatically.</div></div>' +
'<div class="bar" id="bar" style="display:none"><span>Appraised diminished value <b id="dv">-</b></span><span>Appraised ACV <b id="acv">-</b></span></div>' +
'<script>var SCHEMA=__SCHEMA__,LISTS=__LISTS__,row=0,pend={},saving=false,tm=null,errT=null,loading=false;' +
'function $(i){return document.getElementById(i)}function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}' +
'var MONEY={m:2,r:4};' +
'function digits(v){return String(v).replace(/\\D/g,"")}' +
'function mPhone(v){v=String(v==null?"":v);var ex="",m=v.match(/(?:ext\\.?|extension|x|#)\\s*(\\d*)\\s*$/i),hasX=false;if(m){hasX=true;ex=m[1];v=v.slice(0,m.index)}var d=digits(v);if(d.length>10&&d.charAt(0)==="1")d=d.slice(1);if(d.length>10){if(!hasX){ex=d.slice(10);hasX=true}d=d.slice(0,10)}var o=d.length>6?d.slice(0,3)+"-"+d.slice(3,6)+"-"+d.slice(6):d.length>3?d.slice(0,3)+"-"+d.slice(3):d;return hasX&&d.length===10?(ex?o+" ext. "+ex:o+" x"):o}' +
'function mMoney(v,dec,final){v=String(v);var neg=/^\\s*[-(]/.test(v);var s=v.replace(/[^0-9.]/g,"");if(!s)return neg?"-":"";var p=s.split(".");var i=p[0].replace(/^0+(?=\\d)/,"").replace(/\\B(?=(\\d{3})+(?!\\d))/g,",");var out="$"+(i||"0");if(p.length>1)out+="."+p.slice(1).join("").slice(0,dec);if(final){var q=out.split(".");var f=(q[1]||"");while(f.length<2)f+="0";out=q[0]+"."+f}return(neg?"-":"")+out}' +
'function mInt(v){var d=digits(v);return d.replace(/^0+(?=\\d)/,"").replace(/\\B(?=(\\d{3})+(?!\\d))/g,",")}' +
'function mPct(v,final){v=String(v);var neg=/^\\s*-/.test(v);var s=v.replace(/[^0-9.]/g,"");var p=s.split(".");s=p[0]+(p.length>1?"."+p.slice(1).join("").slice(0,2):"");if(!s)return neg?"-":"";return(neg?"-":"")+s+(final?"%":"")}' +
'function mDate(v){var d=digits(v).slice(0,8);if(d.length>4)return d.slice(0,2)+"/"+d.slice(2,4)+"/"+d.slice(4);if(d.length>2)return d.slice(0,2)+"/"+d.slice(2);return d}' +
'function mVin(v){return String(v).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,17)}' +
'function applyMask(el,final){var t=el.dataset.t;if(!t||t==="t"||t==="ta"||t==="d"||t.indexOf("sel")===0)return;var v=el.value,o=v;' +
'if(t==="ph")o=mPhone(v);else if(t==="m")o=mMoney(v,2,final);else if(t==="r")o=mMoney(v,4,false);else if(t==="i")o=mInt(v);else if(t==="p")o=mPct(v,final);else if(t==="dt")o=mDate(v);else if(t==="vin")o=mVin(v);' +
'if(o!==v)el.value=o}' +
'var EX=[],EXK=\'\',EXL=\'\',EXT=null;' +
'function exCard(g){return \'<div class="card"><h3>📸 \'+g.title+\'</h3><div class="exl" data-ex="\'+g.ex.join(\',\')+\'"></div></div>\'}' +
'function exCustomCard(){return \'<div class="card"><h3>📎 Additional screenshots &amp; PDFs</h3><p class="exh">Add anything else that belongs in the appraisal and label it. These print after the guide / dealer / comp screenshots, in this order.</p><div class="exc"></div><div class="exadd"><input id="exlab" placeholder="Label, e.g. Repair invoice"><button class="btn p" onclick="exAddNew()">Add screenshot or PDF</button></div></div><div class="card"><h3>📘 Full appraisal PDF</h3><p class="exh">Order: the appraisal, then every exhibit (labelled), then the client\\\'s signed authorization form. Saved as one file in the folder reports send from after payment.</p><div class="exi"></div><div class="actions"><button class="btn p" onclick="exFull()">Build full appraisal PDF</button></div><div class="exm"></div></div>\'}' +
'function exRow(e,k){return \'<div class="exr"><div class="exn">\'+esc(e.label)+\'</div><div class="exs \'+(e.has?\'ok\':\'no\')+\'">\'+(e.has?\'✓ \'+(e.type===\'pdf\'?\'PDF \':\'\')+esc(e.at||\'saved\'):\'nothing added yet\')+\'</div>\'+(e.has?\'<a class="btn" target="_blank" href="\'+e.url+\'">View</a>\':\'\')+\'<button class="btn p" onclick="exOpen(\\\'\'+k+\'\\\')">\'+(e.has?\'Replace\':\'Paste / add PDF\')+\'</button></div>\'}' +
'function exRefresh(){if(!row)return;google.script.run.withSuccessHandler(function(l){EX=l||[];document.querySelectorAll(\'.exl\').forEach(function(box){box.innerHTML=box.dataset.ex.split(\',\').map(function(k){var e=EX.filter(function(x){return x.key===k})[0];return e?exRow(e,k):\'\'}).join(\'\')});document.querySelectorAll(\'.exc\').forEach(function(box){var c=EX.filter(function(x){return x.custom});box.innerHTML=c.length?c.map(function(e){return \'<div class="exr"><input class="exla" value="\'+esc(e.label)+\'" onchange="exRen(\\\'\'+e.key+\'\\\',this.value)"><div class="exs ok">✓ \'+(e.type===\'pdf\'?\'PDF \':\'\')+esc(e.at)+\'</div><a class="btn" target="_blank" href="\'+e.url+\'">View</a><button class="btn" onclick="exMv(\\\'\'+e.key+\'\\\',-1)">↑</button><button class="btn" onclick="exMv(\\\'\'+e.key+\'\\\',1)">↓</button><button class="btn" onclick="exDel(\\\'\'+e.key+\'\\\')">✕</button></div>\'}).join(\'\'):\'<div class="exs no">None added yet.</div>\'});exInfo()}).getExhibitList(row)}' +
'function exInfo(){var b=document.querySelector(\'.exi\');if(!b)return;google.script.run.withSuccessHandler(function(i){if(!i)return;b.innerHTML=\'<div>\'+(i.base?\'✓ Appraisal report ready\':\'⚠ No appraisal PDF yet - use Compile final PDF first\')+\'</div><div>\'+i.count+\' exhibit(s) added</div><div>\'+(i.auth?\'✓ Signed authorization form found\':\'⚠ Signed authorization form not found yet (the client has not signed)\')+\'</div>\'+(i.full?\'<div><a target="_blank" href="\'+i.full+\'">Open the current full appraisal PDF</a></div>\':\'\')}).getFullBuildInfo(row)}' +
'function exRen(k,v){google.script.run.renameExhibit(row,k,v)}' +
'function exMv(k,d){google.script.run.withSuccessHandler(exRefresh).moveExhibit(row,k,d)}' +
'function exDel(k){if(confirm(\'Remove this exhibit?\'))google.script.run.withSuccessHandler(exRefresh).removeExhibit(row,k)}' +
'function exAddNew(){var l=$(\'exlab\').value.trim();if(!l){$(\'exlab\').focus();$(\'exlab\').style.borderColor=\'#dc2626\';return}exOpen(\'new\',l)}' +
'function exOpen(k,label){var e=EX.filter(function(x){return x.key===k})[0];EXK=k;EXL=label||\'\';var title=k===\'new\'?label:(e?e.label:\'\');exClose();var o=document.createElement(\'div\');o.id=\'exo\';o.innerHTML=\'<div class="exb"><h3>\'+esc(title)+\'</h3><p>1. Take your screenshot (Windows: Win+Shift+S &nbsp;·&nbsp; Mac: Cmd+Ctrl+Shift+4).<br>2. Click the box below and press Ctrl+V (Cmd+V on a Mac).<br>Or choose / drop a PDF or image file.</p><div id="exz" tabindex="0">Click here, then paste (Ctrl+V)<br>or drop a file here</div><div id="exp"></div><p><input type="file" id="exf" accept="image/*,application/pdf"> <button class="btn" onclick="exClose()">Cancel</button></p></div>\';document.body.appendChild(o);var z=$(\'exz\');z.focus();$(\'exf\').onchange=function(){if(this.files[0])exSend(this.files[0])};z.ondragover=function(ev){ev.preventDefault()};z.ondrop=function(ev){ev.preventDefault();if(ev.dataTransfer.files[0])exSend(ev.dataTransfer.files[0])};document.addEventListener(\'paste\',exPaste)}' +
'function exClose(){var o=$(\'exo\');if(o)o.remove();document.removeEventListener(\'paste\',exPaste)}' +
'function exPaste(ev){var it=(ev.clipboardData||{}).items||[];for(var i=0;i<it.length;i++){if(it[i].type.indexOf(\'image\')===0||it[i].type===\'application/pdf\'){ev.preventDefault();exSend(it[i].getAsFile());return}}$(\'exp\').textContent=\'No image on the clipboard - take the screenshot first, then paste.\'}' +
'function exDone(r){exClose();if($(\'exlab\'))$(\'exlab\').value=\'\';if(r&&r.dateKey){var el=document.querySelector(\'[data-k="\'+r.dateKey+\'"]\');if(el){loading=true;el.value=r.date;loading=false}}exRefresh()}' +
'function exPost(u){flushNow(function(){google.script.run.withSuccessHandler(exDone).withFailureHandler(function(e){$(\'exp\').textContent=\'⚠ \'+e.message}).saveExhibit(row,EXK,u,EXL)})}' +
'function exSend(f){$(\'exp\').textContent=\'Saving…\';var rd=new FileReader();if(f.type===\'application/pdf\'){if(f.size>28000000){$(\'exp\').textContent=\'That PDF is over 28 MB - too large.\';return}rd.onload=function(){exPost(rd.result)};rd.readAsDataURL(f);return}rd.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,1800/im.width),c=document.createElement(\'canvas\');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);var x=c.getContext(\'2d\');x.fillStyle=\'#fff\';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);exPost(c.toDataURL(\'image/jpeg\',0.9))};im.onerror=function(){$(\'exp\').textContent=\'That file is not an image or PDF.\'};im.src=rd.result};rd.readAsDataURL(f)}' +
'function exMsg(h){document.querySelectorAll(\'.exm\').forEach(function(m){m.innerHTML=h})}' +
'function exFull(){clearInterval(EXT);var tok=\'p\'+Date.now(),n=0;exMsg(\'Building the full appraisal PDF… this can take a minute.\');flushNow(function(){google.script.run.withFailureHandler(function(e){exMsg(\'⚠ \'+esc(e.message))}).assembleFullAppraisalJob(row,tok);EXT=setInterval(function(){n++;if(n>80){clearInterval(EXT);exMsg(\'Still working - check your email and the Final Appraisal PDF folder shortly.\');return}google.script.run.withSuccessHandler(function(s){if(!s)return;if(s.state===\'done\'){clearInterval(EXT);exMsg(\'✓ \'+esc(s.msg)+\'<br><b>\'+esc(s.name)+\'</b> - <a target="_blank" href="\'+s.url+\'">open it</a>\');exInfo()}else if(s.state===\'error\'){clearInterval(EXT);exMsg(\'⚠ \'+esc(s.msg))}}).getFullBuildStatus(tok)},3000)})}' +
'function fuCard(){return \'<div class="card fu"><h3>📅 Next follow-up - when should I look at this claim again?</h3><div class="fur"><div class="f"><label>Follow-up date</label><input type="date" data-k="followUpDate" onchange="fuStatus()"></div><div class="f"><label>What to check / why</label><input data-k="followUpWhy" placeholder="e.g. Call the adjuster about the offer"></div></div><div class="actions" style="margin-top:10px"><button class="btn" onclick="fuSet(1,0)">Tomorrow</button><button class="btn" onclick="fuSet(3,0)">+3 days</button><button class="btn" onclick="fuSet(7,0)">+1 week</button><button class="btn" onclick="fuSet(14,0)">+2 weeks</button><button class="btn" onclick="fuSet(0,1)">+1 month</button><button class="btn" onclick="fuSet(-1,0)">Clear</button></div><div id="fus"></div></div>\'}' +
'function bigSmall(){var big=window.innerWidth>1100;flushNow(function(){google.script.run.resizeFilePanel(big?1040:screen.availWidth,big?800:screen.availHeight)})}' +
'function fuSet(d,m){var el=document.querySelector(\'[data-k="followUpDate"]\');if(!el)return;if(d===-1){el.value=\'\'}else{var t=new Date();t.setHours(12);if(m)t.setMonth(t.getMonth()+m);else t.setDate(t.getDate()+d);el.value=t.getFullYear()+\'-\'+(\'0\'+(t.getMonth()+1)).slice(-2)+\'-\'+(\'0\'+t.getDate()).slice(-2)}pend.followUpDate=el.value;el.classList.add(\'dirty\');sched(50);fuStatus()}' +
'function fuStatus(){var el=document.querySelector(\'[data-k="followUpDate"]\'),s=$(\'fus\');if(!el||!s)return;var v=el.value,o=$(\'fup\');if(o)o.remove();if(!v){s.style.color=\'#b45309\';s.textContent=\'No follow-up date set - you will not be reminded about this claim.\';return}var days=Math.round((new Date(v+\'T12:00:00\')-new Date(new Date().toDateString()+\' 12:00:00\'))/864e5);var nice=new Date(v+\'T12:00:00\').toLocaleDateString(undefined,{weekday:\'short\',month:\'numeric\',day:\'numeric\',year:\'numeric\'});var txt=days<0?\'OVERDUE by \'+(-days)+\' day\'+(days===-1?\'\':\'s\'):days===0?\'Due TODAY\':\'In \'+days+\' day\'+(days===1?\'\':\'s\');var col=days<=0?\'#b91c1c\':days<=3?\'#b45309\':\'#15803d\';s.style.color=col;s.textContent=\'📅 \'+nice+\' - \'+txt+\'. You will be reminded in the 7 AM briefing email.\';var pl=$(\'pl\');if(pl){var sp=document.createElement(\'span\');sp.id=\'fup\';sp.className=\'pill \'+(days<=0?\'r\':days<=3?\'y\':\'g\');sp.textContent=\'Follow-up: \'+txt;pl.insertBefore(sp,$(\'save\'))}}' +
'function noteCard(){return \'<div class="card"><h3>📝 Update - a note for me and the client <span id="nd"></span></h3><textarea id="nn" placeholder="What is the latest on this file? Write it so the client can read it."></textarea><div class="actions" style="margin:8px 0"><button class="btn" onclick="addNote()">Save note (for me)</button><button class="btn p" onclick="addNoteSend()">Save &amp; email the client (you approve first)</button></div><div class="exh">Every note goes into the client\\\'s weekly update automatically. "Email the client" sends YOU an approval email right now with the exact message - nothing goes to the client until you approve it.</div><div class="log" id="lg"></div></div>\'}' +
'function addNoteSend(){var t=$(\'nn\').value.trim();if(!t)return;flushNow(function(){google.script.run.withSuccessHandler(function(r){$(\'nn\').value=\'\';$(\'lg\').textContent=r.log;load();setSt(\'✓ Approval email sent to you\',\'#86efac\')}).withFailureHandler(function(e){setSt(\'⚠ \'+e.message,\'#fca5a5\')}).addNoteAndRequestClientUpdate(row,t)})}' +
'function nv(x){return parseFloat(String(x||\'\').replace(/[^0-9.\\-]/g,\'\'))||0}' +
'function kv(k){var e=document.querySelector(\'[data-k="\'+k+\'"]\');return e?e.value:\'\'}' +
'function optHtml(k){return \'<div class="optl" data-o="\'+k+\'"><div class="optr"></div><div class="opta"><button class="btn" type="button" onclick="optAdd(\\\'\'+k+\'\\\')">+ Add another line</button><span class="optt"></span></div><input type="hidden" data-k="\'+k+\'Adj"><input type="hidden" data-k="\'+k+\'Notes"><input type="hidden" data-k="\'+k+\'Lines"></div>\'}' +
'function optRender(k,L){var box=document.querySelector(\'[data-o="\'+k+\'"]\');if(!box)return;box.querySelector(\'.optr\').innerHTML=L.map(function(l,i){return \'<div class="optrow"><input class="od" placeholder="Option / reason, e.g. Sunroof" value="\'+esc(l.d)+\'" oninput="optEdit(\\\'\'+k+\'\\\')"><select class="os" onchange="optEdit(\\\'\'+k+\'\\\')"><option value="1"\'+(l.s<0?\'\':\' selected\')+\'>Adds (+)</option><option value="-1"\'+(l.s<0?\' selected\':\'\')+\'>Deducts (−)</option></select><input class="oa" inputmode="decimal" placeholder="$0.00" value="\'+(l.a?mMoney(String(l.a),2,true):\'\')+\'" oninput="this.value=mMoney(this.value,2,false);optEdit(\\\'\'+k+\'\\\')" onblur="this.value=mMoney(this.value,2,true)"><button class="btn" type="button" title="Remove this line" onclick="optDel(\\\'\'+k+\'\\\',\'+i+\')">✕</button></div>\'}).join(\'\');optTotal(k,L)}' +
'function optRead(k){var box=document.querySelector(\'[data-o="\'+k+\'"]\'),L=[];if(!box)return L;box.querySelectorAll(\'.optrow\').forEach(function(r){L.push({d:r.querySelector(\'.od\').value,s:parseInt(r.querySelector(\'.os\').value,10)<0?-1:1,a:Math.abs(nv(r.querySelector(\'.oa\').value))})});return L}' +
'function optTotal(k,L){var t=0;L.forEach(function(l){t+=l.s*l.a});var s=document.querySelector(\'[data-o="\'+k+\'"] .optt\');if(s)s.textContent=L.length?\'Total adjustment: \'+(t<0?\'−\':\'+\')+\'$\'+Math.abs(t).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):\'No options adjustment\'}' +
'function optInit(k){var L=[];try{L=JSON.parse(kv(k+\'Lines\')||\'[]\');if(!Array.isArray(L))L=[]}catch(e){L=[]}if(!L.length){var adj=nv(kv(k+\'Adj\')),nt=kv(k+\'Notes\');if(adj||nt)L=[{d:nt,s:adj<0?-1:1,a:Math.abs(adj)}]}optRender(k,L)}' +
'function optSet(k,v){var e=document.querySelector(\'[data-k="\'+k+\'"]\');if(!e||e.value===v)return;e.value=v;e.dispatchEvent(new Event(\'input\',{bubbles:true}))}' +
'function optEdit(k){var L=optRead(k),t=0;L.forEach(function(l){t+=l.s*l.a});optTotal(k,L);var used=L.filter(function(l){return l.a||l.d});var notes=used.map(function(l){return (l.d||\'Option\')+\' (\'+(l.s<0?\'−\':\'+\')+\'$\'+l.a.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})+\')\'}).join(\'; \');optSet(k+\'Adj\',used.length?String(Math.round(t*100)/100):\'\');optSet(k+\'Notes\',notes);optSet(k+\'Lines\',used.length?JSON.stringify(used):\'\')}' +
'function optAdd(k){var L=optRead(k);L.push({d:\'\',s:1,a:0});optRender(k,L);var r=document.querySelectorAll(\'[data-o="\'+k+\'"] .od\');if(r.length)r[r.length-1].focus()}' +
'function optDel(k,i){var L=optRead(k);L.splice(i,1);optRender(k,L);optEdit(k)}' +
'function chkHtml(k,list){return \'<div class="chks" data-c="\'+k+\'">\'+LISTS[list].map(function(o){var code=o.split(\':\')[0];return \'<label class="ckr"><input type="checkbox" value="\'+esc(code)+\'" onchange="chkEdit(\\\'\'+k+\'\\\')"><span>\'+esc(o)+\'</span></label>\'}).join(\'\')+\'</div><input type="hidden" data-k="\'+k+\'">\'}' +
'function chkEdit(k){var v=[];document.querySelectorAll(\'[data-c="\'+k+\'"] input:checked\').forEach(function(c){v.push(c.value)});optSet(k,v.join(\', \'))}' +
'function chkSync(k){var v=kv(k).toLowerCase();document.querySelectorAll(\'[data-c="\'+k+\'"] input\').forEach(function(c){c.checked=new RegExp(\'\\\\b\'+c.value.toLowerCase()+\'\\\\b\').test(v)})}' +
'function optChkInit(){document.querySelectorAll(\'[data-o]\').forEach(function(b){optInit(b.dataset.o)});document.querySelectorAll(\'[data-c]\').forEach(function(b){chkSync(b.dataset.c)})}' +
'function progCard(){return \'<div class="card"><h3>🧭 Progress</h3><div id="progx"></div></div>\'}' +
'function progRender(p){var el=$(\'progx\');if(!el||!p)return;el.innerHTML=\'<div class="pbar"><div class="pfill" style="width:\'+p.pct+\'%"></div></div><div class="psteps">\'+p.steps.map(function(s,i){var c=i<p.done?\'d\':(i===p.done?\'c\':\'\');return \'<div class="ps \'+c+\'"><div class="pc">\'+(i<p.done?\'✓\':(i+1))+\'</div><div class="pl">\'+esc(s)+\'</div></div>\'}).join(\'\')+\'</div><div class="pt">\'+p.done+\' of \'+p.total+\' steps done\'+(p.done<p.total?\' - now: <b>\'+esc(p.steps[p.done])+\'</b>\':\' - all steps complete\')+\'</div>\'+progPick(p)}' +
'function progPick(p){var o=\'<option value="">Automatic (from status)</option>\'+p.steps.map(function(s,i){return \'<option value="\'+(i+1)+\'"\'+(p.manual===i+1?\' selected\':\'\')+\'>Done through step \'+(i+1)+\': \'+esc(s)+\'</option>\'}).join(\'\');return \'<div class="pt" style="margin-top:10px"><b>Already finished steps before the automation?</b> Set it here: <select id="progpick" onchange="setPM(this.value)" style="max-width:100%">\'+o+\'</select> <span id="progmsg" style="color:#166534"></span></div>\'}' +
'function setPM(v){var nm=(document.querySelector(\'[data-k=name]\')||{}).value||\'\';google.script.run.withFailureHandler(function(e){alert(\'Could not save progress: \'+(e&&e.message?e.message:e));}).withSuccessHandler(function(r){progRender(r.p);var m=$(\'progmsg\');if(m)m.textContent=r.ok?(\'Saved for \'+r.who+\' (row \'+r.row+\')\'):\'Did NOT save - cell holds \'+JSON.stringify(r.stored)}).setProgressManual(row,v,nm)}' +
'function recvCard(){return \'<div class="card"><h3>📥 Received by email (filed automatically)</h3><div class="exh">Attachments from the client, adjuster and carrier appraiser are saved to this file\\\'s folder every 10 minutes.</div><div class="rcv"></div><h3 style="margin-top:16px">Pull emails from an address</h3><div class="exh">Use this for a spouse, repair shop or anyone not set up yet. It files their attachments from as far back as you choose.</div><div class="exadd"><input id="pe" placeholder="name@example.com"><select id="pk"><option value="Client Uploads">as client files</option><option value="Insurer Documents">as insurer / other</option></select><select id="pd"><option value="30">last 30 days</option><option value="90">last 90 days</option><option value="365">last year</option></select><button class="btn p" onclick="recvPull()">File them now</button></div><div class="exm" id="pm"></div></div>\'}' +
'function recvPull(){var a=$(\'pe\').value.trim();if(!a)return;$(\'pm\').textContent=\'Searching your Gmail…\';flushNow(function(){google.script.run.withSuccessHandler(function(r){$(\'pm\').textContent=r.saved?\'✓ Filed \'+r.saved+\' file(s): \'+r.files.slice(0,4).join(\'; \'):\'No attachments found from that address in that time.\';recvRefresh();load()}).withFailureHandler(function(e){$(\'pm\').textContent=\'⚠ \'+e.message}).fileEmailsForRow(row,a,$(\'pd\').value,$(\'pk\').value,true)})}' +
'function recvRefresh(){var b=document.querySelector(\'.rcv\');if(!b||!row)return;google.script.run.withSuccessHandler(function(l){b.innerHTML=(l&&l.length)?l.map(function(f){return \'<div class="exr"><div class="exn"><a target="_blank" href="\'+f.url+\'">\'+esc(f.file)+\'</a></div><div class="exs ok">\'+esc(f.kind)+\' · \'+esc(f.when)+\'</div><div class="exs">\'+esc(f.from)+\'</div></div>\'}).join(\'\'):\'<div class="exs no">Nothing received yet.</div>\'}).getReceivedFiles(row)}' +
'function build(){var tabs="",panels="";SCHEMA.forEach(function(s,i){tabs+="<button class=\\"tab"+(i?"":" on")+"\\" data-t=\\""+s.id+"\\">"+s.icon+" "+s.title+"</button>";panels+="<div class=\\"panel"+(i?"":" on")+"\\" id=\\"p_"+s.id+"\\">"+s.groups.map(function(g0){var x=(function(g){if(g.prog)return progCard();if(g.actions)return actionsCard();if(g.plan)return planCard();if(g.recv)return recvCard();if(g.fu)return fuCard();if(g.notes)return noteCard();if(g.ex)return exCard(g);if(g.custom)return exCustomCard();return"<div class=\\"card\\"><h3>"+g.title+"</h3><div class=\\"grid\\">"+g.fields.map(fld).join("")+"</div></div>"})(g0);return g0.for?"<div data-for=\\""+g0.for+"\\">"+x+"</div>":x}).join("")+"</div>"});$("main").innerHTML="<div class=\\"tabs\\">"+tabs+"</div><div class=\\"wrap\\">"+panels+"</div>";' +
'document.querySelectorAll(".tab").forEach(function(b){b.onclick=function(){document.querySelectorAll(".tab").forEach(function(x){x.classList.remove("on")});document.querySelectorAll(".panel").forEach(function(x){x.classList.remove("on")});b.classList.add("on");$("p_"+b.dataset.t).classList.add("on");if(b.dataset.t==="actions")actsLoad();if(b.dataset.t==="exhibits"&&window.planLoad)planLoad()}});' +
'document.querySelectorAll("[data-k]").forEach(function(el){var ev=el.tagName==="SELECT"||el.type==="date"?"change":"input";el.addEventListener(ev,function(){if(loading)return;applyMask(el,false);pend[el.dataset.k]=el.value;if(el.dataset.k==="intendedUse"&&window.applyType)applyType(el.value);el.classList.add("dirty");sched(el.tagName==="SELECT"||el.type==="date"?50:700)});el.addEventListener("blur",function(){var b=el.value;applyMask(el,true);if(el.dataset.k&&b!==el.value&&!loading){pend[el.dataset.k]=el.value;sched(50)}else if(Object.keys(pend).length)sched(50)})})}' +
'function fld(f){var k=f[0],l=f[1],t=f[2]||"t",w=f[3]==="w2"?" w2":f[3]==="w3"?" w3":"";var h="<div class=\\"f"+w+"\\"><label>"+l+"</label>";if(t==="opt")h+=optHtml(k);else if(t.indexOf("chk:")===0)h+=chkHtml(k,t.slice(4));else if(t==="ta")h+="<textarea data-k=\\""+k+"\\"></textarea>";else if(t.indexOf("sel:")===0){h+="<select data-k=\\""+k+"\\"><option value=\\"\\"></option>"+LISTS[t.slice(4)].map(function(o){return"<option>"+esc(o)+"</option>"}).join("")+"</select>"}else if(t==="d")h+="<input type=\\"date\\" data-k=\\""+k+"\\">";else h+="<input data-k=\\""+k+"\\" data-t=\\""+t+"\\" autocomplete=\\"off\\""+("m r i p ph".indexOf(t)>=0&&t!=="vin"?" inputmode=\\"decimal\\"":"")+">";return h+"</div>"}' +
'function sched(ms){clearTimeout(tm);setSt("Saving…","#fbbf24");tm=setTimeout(flush,ms)}' +
'function setSt(t,c){var s=$("save");if(s){s.textContent=t;s.style.color=c||"#fff"}}' +
'var actT=null;function actSched(){clearTimeout(actT);actT=setTimeout(function(){google.script.run.refreshActiveFiles()},5000)}' +
'window.addEventListener("pagehide",function(){try{google.script.run.refreshActiveFiles()}catch(e){}});' +
'function flush(){if(saving||!row||!Object.keys(pend).length)return;var p=pend;pend={};saving=true;var pl=Object.assign({row:row},p);google.script.run.withSuccessHandler(function(r){saving=false;document.querySelectorAll(".dirty").forEach(function(e){if(!(e.dataset.k in pend))e.classList.remove("dirty")});setSt("✓ Saved "+r.savedAt,"#86efac");totals(r.finalDV,r.finalACV);actSched();google.script.run.withSuccessHandler(function(d){if(d&&d.row===row)showMiss(d.missing||[])}).getPanelData();if(Object.keys(p).some(function(k){return/ealer/.test(k)}))exRefresh();if(Object.keys(pend).length)flush()}).withFailureHandler(function(e){saving=false;Object.keys(p).forEach(function(k){if(!(k in pend))pend[k]=p[k]});setSt("⚠ Not saved - retrying…","#fca5a5");clearTimeout(errT);errT=setTimeout(flush,4000)}).saveSidebarData(pl)}' +
'function numOf(v){if(typeof v==="number")return isFinite(v)?v:0;var s=String(v==null?"":v),neg=/^\\s*[-(]/.test(s),n=parseFloat(s.replace(/[^0-9.]/g,""));return isNaN(n)?0:(neg?-n:n)}function totals(a,b){$("bar").style.display="flex";$("dv").textContent="$"+numOf(a).toLocaleString(undefined,{maximumFractionDigits:0});$("acv").textContent="$"+numOf(b).toLocaleString(undefined,{maximumFractionDigits:0})}' +
'function load(){google.script.run.withSuccessHandler(function(d){loading=true;if(!d){row=0;$("nm").textContent="Select a file…";$("sb").textContent="Click a row in Active Files or Sheet1";$("pl").innerHTML="";loading=false;return}' +
'if(!$("p_overview"))build();row=d.row;if(window.applyType)applyType(d.intendedUse);setTimeout(function(){if(window.actsLoad)actsLoad();if(window.planLoad)planLoad()},0);$("nm").textContent=d.name||"(no name)";$("sb").innerHTML=esc([d.vehicleLabel,d.vin?"VIN "+d.vin:"",d.mileage?d.mileage+" mi":""].filter(Boolean).join("  ·  "))+"<br>"+esc([d.address,d.carrier,d.claim?"Claim #"+d.claim:""].filter(Boolean).join("  ·  "));' +
'var na=d.noteDate?(d.noteAge>7?"r":"g"):"r";$("pl").innerHTML="<span class=\\"pill\\">"+esc(d.intendedUse)+"</span><span class=\\"pill y\\">"+esc(d.status||"New")+"</span><span class=\\"pill "+na+"\\">Last note: "+(d.noteDate||"none")+"</span><span class=\\"pill\\">Next: "+esc(d.nextAction||"-")+"</span><span id=\\"save\\">✓ Autosave on</span>";' +
'document.querySelectorAll("[data-k]").forEach(function(el){var v=d[el.dataset.k];if(el.tagName==="SELECT"&&v&&![].some.call(el.options,function(o){return o.value===String(v)}))el.add(new Option(v,v));el.value=v==null?"":v;applyMask(el,true);el.classList.remove("dirty")});$("lg").textContent=d.progressLog||"No notes yet.";showMiss(d.missing||[]);$("nd").textContent=d.noteDate?"(last: "+d.noteDate+")":"";totals(d.calcFinalDV,d.calcFinalACV);optChkInit();progRender(d.progress);loading=false;fuStatus();exRefresh();recvRefresh();if(window.markPf)markPf(d.prefilled)}).withFailureHandler(function(){}).getPanelData()}' +
'function showMiss(ms){' +
'  document.querySelectorAll(".miss,.soon").forEach(function(e){e.classList.remove("miss");e.classList.remove("soon")});' +
'  var w=$("warn"); if(!ms.length){w.innerHTML="";return}' +
'  var need=ms.filter(function(m){return m.level==="need"}), soon=ms.filter(function(m){return m.level!=="need"});' +
'  function chips(a,c){return a.map(function(m){return \'<span class="chip \'+c+\'" onclick="goTo(\\\'\'+m.key+\'\\\')">\'+esc(m.label)+\'</span>\'}).join("")}' +
'  var h="";' +
'  if(need.length)h+=\'<div class="warn"><b>⚠ Needed now - click to fill in</b>\'+chips(need,"")+\'</div>\';' +
'  if(soon.length)h+=\'<div class="warn amber"><b>Needed soon</b>\'+chips(soon,"soon")+\'</div>\';' +
'  w.innerHTML=h;' +
'  ms.forEach(function(m){var el=document.querySelector(\'[data-k="\'+m.key+\'"]\');if(el)el.classList.add(m.level==="need"?"miss":"soon")});' +
'}' +
'function goTo(k){' +
'  var el=document.querySelector(\'[data-k="\'+k+\'"]\'); if(!el)return;' +
'  var p=el.closest(".panel");' +
'  document.querySelectorAll(".tab").forEach(function(x){x.classList.toggle("on",x.dataset.t===p.id.slice(2))});' +
'  document.querySelectorAll(".panel").forEach(function(x){x.classList.toggle("on",x===p)});' +
'  el.scrollIntoView({block:"center"}); el.focus();' +
'}' +
'function addNote(){var t=$("nn").value.trim();if(!t)return;flushNow(function(){google.script.run.withSuccessHandler(function(v){$("nn").value="";$("lg").textContent=v;load()}).addProgressNoteToRow(row,t)})}' +
'function flushNow(cb){clearTimeout(tm);var w=setInterval(function(){if(!saving){clearInterval(w);if(Object.keys(pend).length){flush();var w2=setInterval(function(){if(!saving&&!Object.keys(pend).length){clearInterval(w2);cb()}},150)}else cb()}},100)}' +
'function act(fn){flushNow(function(){google.script.run[fn]()})}' +
'setInterval(function(){google.script.run.withSuccessHandler(function(n){if(n&&n!==row){flushNow(load)}}).getActiveFileRowNumber()},2000);$(\'fsb\').textContent=window.innerWidth>1100?\'⛶ Smaller\':\'⛶ Full screen\';load();window.addEventListener("beforeunload",function(){flush()});' +
'__ACTIONSJS__</script></body></html>';
}

// ============================================================================
//  MISSING-DATA CHECK: what the file still needs, by claim type and stage
//  level 'need' = required now (red), 'soon' = needed at the next stage (amber)
// ============================================================================
const MISS_COLS_ = { name: 0, phone: 1, email: 4, carrier: 7, claim: 9, adjName: 10, adjEmail: 12, year: 15, vin: 16, make: 17, model: 18, mileage: 20, intendedUse: 25,
  offerAmount: 32, comp1Price: 62, comp2Price: 68, comp3Price: 74, carrierAddress: COL_CARRIER_ADDR - 1, awardAcv: COL_AWARD_ACV - 1,
  carrierAppraiserName: COL_CARRIER_APPRAISER - 1, carrierAppraiserCompany: COL_CARRIER_APPRAISER_CO - 1, carrierAppraiserEmail: COL_CARRIER_APPRAISER_EMAIL - 1 };

function missingFor_(d) {
  const use = String(d[25] || ''), st = String(d[29] || '');
  const v = deliveryVariant_(use);
  const insurer = (v === 'insurerDV' || v === 'acTL' || v === 'acDV');
  const ac = (v === 'acTL' || v === 'acDV');
  const out = [];
  const empty = function(k) { const x = d[MISS_COLS_[k]]; return x === '' || x === null || x === undefined || String(x).trim() === '' || String(x).trim().toUpperCase() === 'N/A'; };
  const add = function(k, label, level) { if (empty(k)) out.push({ key: k, label: label, level: level }); };
  add('name', 'Client name', 'need'); add('email', 'Client email', 'need'); add('phone', 'Client phone', 'soon');
  add('intendedUse', 'Type of appraisal', 'need');
  add('year', 'Year', 'need'); add('make', 'Make', 'need'); add('model', 'Model', 'need'); add('vin', 'VIN', 'need'); add('mileage', 'Mileage', 'need');
  const working = /Auth Signed|Invoice|Folders|Manual Entry/.test(st);
  if (working && !isDirectDV_(use)) { add('comp1Price', 'Comp 1 price', 'soon'); add('comp2Price', 'Comp 2 price', 'soon'); add('comp3Price', 'Comp 3 price', 'soon'); }
  if (insurer) {
    add('carrier', 'Insurance carrier', 'need'); add('claim', 'Claim #', 'need');
    add('adjName', 'Adjuster name', 'soon'); add('adjEmail', 'Adjuster email', 'soon'); add('carrierAddress', 'Carrier mailing address', 'soon');
  }
  if (/Demand Emailed/.test(st)) {
    if (ac) { add('carrierAppraiserName', 'Carrier appraiser name', 'soon'); add('carrierAppraiserEmail', 'Carrier appraiser email', 'soon'); add('carrierAppraiserCompany', 'Carrier appraiser company', 'soon'); add('awardAcv', 'Agreed award value', 'soon'); }
    else add('offerAmount', 'Insurer offer amount', 'soon');
  }
  if (insurer && (/Client OK|Awaiting Your Approval/.test(st) || /Delivered|Awaiting Client OK/.test(st))) { add('adjEmail', 'Adjuster email', 'need'); add('carrierAddress', 'Carrier mailing address', 'need'); }
  const seen = {}; const res = [];
  out.forEach(function(m) { if (!seen[m.key]) { seen[m.key] = m; res.push(m); } else if (m.level === 'need') seen[m.key].level = 'need'; });
  return res;
}

// ============================================================================
//  AUTO-FORMATTING: phones, dollars, commas, dates, percents, VINs are formatted as you type / edit
// ============================================================================
const FMT_COLS_ = {
  phone: [2, 12],
  money: [33, 42, 45, 49, 54, 56, 59, 63, 67, 69, 73, 75, 79, 85, 88, COL_AWARD_ACV, COL_COMP1_OPT_ADJ, COL_COMP2_OPT_ADJ, COL_COMP3_OPT_ADJ, COL_SUBJ_OPT_ADJ],
  rate: [62], int: [21, 66, 72, 78], pct: [83, 87],
  date: [6, 7, 95, 46, 50, 55, 57, 60, 65, 71, 77], vin: [17]
};
function fmtKind_(col) {
  for (const k in FMT_COLS_) if (FMT_COLS_[k].indexOf(col) !== -1) return k;
  return '';
}
function formatPhone_(v) {
  let raw = String(v || '').trim(), ex = '', hasX = false;
  const m = raw.match(/(?:ext\.?|extension|x|#)\s*(\d*)\s*$/i);
  if (m) { hasX = true; ex = m[1]; raw = raw.slice(0, m.index); }
  let d = raw.replace(/\D/g, '');
  if (d.length > 10 && d[0] === '1') d = d.slice(1);
  if (d.length > 10) { if (!hasX) { ex = d.slice(10); hasX = true; } d = d.slice(0, 10); }
  if (d.length !== 10) return String(v || '').trim();
  return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6) + (hasX && ex ? ' ext. ' + ex : '');
}
function formatDateText_(v) {
  const d = String(v || '').replace(/\D/g, '');
  if (d.length === 8 && !/[\/\-]/.test(String(v))) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
  if (d.length === 6 && !/[\/\-]/.test(String(v))) return d.slice(0, 2) + '/' + d.slice(2, 4) + '/20' + d.slice(4);
  return v;
}
const FMT_NUMBER_FORMATS_ = { money: '$#,##0.00', rate: '$#,##0.00##', int: '#,##0', pct: '0.0#"%"' };

// Formats one cell in place (value + display format). Returns the cleaned value.
function normalizeCell_(cell, col) {
  const kind = fmtKind_(col); if (!kind) return;
  const raw = cell.getValue();
  if (raw === '' || raw === null) return;
  if (kind === 'phone') { const f = formatPhone_(raw); if (f !== raw) cell.setValue(f); cell.setNumberFormat('@'); return; }
  if (kind === 'vin') { const f = String(raw).toUpperCase().replace(/[^A-Z0-9]/g, ''); if (f !== raw) cell.setValue(f); return; }
  if (kind === 'date') { if (raw instanceof Date) { cell.setNumberFormat('MM/dd/yyyy'); } else { const f = formatDateText_(raw); if (f !== raw) cell.setValue(f); } return; }
  // numeric kinds
  const n = toNum(raw);
  if (raw !== n) cell.setValue(n);
  cell.setNumberFormat(FMT_NUMBER_FORMATS_[kind]);
}

function applyColumnFormats_(sheet, lastRow) {
  const n = Math.max(2, lastRow || 1000) - 1;
  ['money', 'rate', 'int', 'pct'].forEach(function(k) { FMT_COLS_[k].forEach(function(c) { sheet.getRange(2, c, n, 1).setNumberFormat(FMT_NUMBER_FORMATS_[k]); }); });
  FMT_COLS_.phone.forEach(function(c) { sheet.getRange(2, c, n, 1).setNumberFormat('@'); });
}

function normalizeMainRange_(range) {
  if (range.getNumRows() * range.getNumColumns() > 300) return;
  const r0 = range.getRow(), c0 = range.getColumn();
  for (let i = 0; i < range.getNumRows(); i++) for (let j = 0; j < range.getNumColumns(); j++) {
    if (r0 + i < 2) continue;
    normalizeCell_(range.getCell(i + 1, j + 1), c0 + j);
  }
}

// Writes a value typed on Active Files into Sheet1 with formatting; returns what Sheet1 now holds.
function writeMainCell_(main, mainRow, col, val) {
  const cell = main.getRange(mainRow, col);
  cell.setValue(val);
  normalizeCell_(cell, col);
  return cell.getValue();
}

// Removes doubled dollar signs ("$$1,000", "$ $1,000", "$-$500") so every amount has exactly one.
function cleanDollarSigns_(doc) {
  const fix = function(el) {
    if (!el) return;
    try { el.replaceText('\\$\\s*-\\s*\\$', '-$'); } catch (e) {}
    try { el.replaceText('\\$\\s*\\$+', '$'); } catch (e) {}
  };
  fix(doc.getBody());
  try { fix(doc.getHeader()); } catch (e) {}
  try { fix(doc.getFooter()); } catch (e) {}
}

// ============================================================================
//  EXHIBITS + FULL APPRAISAL PDF
//  Screenshots / PDFs pasted in the File Panel are saved to the client folder.
//  "Build full appraisal PDF" = appraisal -> all exhibits (labelled) -> signed
//  authorization form, saved to Completed/Final Appraisal PDF (the folder the
//  paid-report email sends from).
// ============================================================================
const COL_EXHIBITS = 118;   // DN - JSON {key:{id,at,type,label?,ord?}}
const EXH_BASE_NAME = 'Appraisal Report (base).pdf';
const PDFLIB_URLS_ = ['https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js', 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js'];
const EXHIBIT_DEFS_ = [
  { key: 'nada', kind: 'g', label: 'NADA / J.D. Power guide', dateKey: 'nadaDate', dateCol: 46 },
  { key: 'kbb', kind: 'g', label: 'KBB guide', dateKey: 'kbbDate', dateCol: 50 },
  { key: 'd1', kind: 't', n: 'Dealer 1', nameCol: COL_DEALER1_NAME, dateKey: 'carmaxDate', dateCol: 55 },
  { key: 'd2', kind: 't', n: 'Dealer 2', nameCol: COL_DEALER2_NAME, dateKey: 'carvanaDate', dateCol: 57 },
  { key: 'd3', kind: 't', n: 'Dealer 3', nameCol: 58, dateKey: 'dealer3Date', dateCol: 60 },
  { key: 'comp1', kind: 'c', n: 'Comp 1', nameCol: 64, dateKey: 'comp1Date', dateCol: 65 },
  { key: 'comp1h', kind: 'g', label: 'Comp 1 vehicle history report' },
  { key: 'comp2', kind: 'c', n: 'Comp 2', nameCol: 70, dateKey: 'comp2Date', dateCol: 71 },
  { key: 'comp2h', kind: 'g', label: 'Comp 2 vehicle history report' },
  { key: 'comp3', kind: 'c', n: 'Comp 3', nameCol: 76, dateKey: 'comp3Date', dateCol: 77 },
  { key: 'comp3h', kind: 'g', label: 'Comp 3 vehicle history report' },
  { key: 'carfax', kind: 'g', label: 'VIN History Report' },
  { key: 'other1', kind: 'g', label: 'Other exhibit 1' },
  { key: 'other2', kind: 'g', label: 'Other exhibit 2' }
];

function exhibitLabel_(def, r) {
  if (def.kind === 'g') return def.label;
  const nm = String(r[def.nameCol - 1] || '').trim();
  if (def.kind === 't') return (nm || def.n) + ' trade-in offer';
  return (nm || def.n) + ' listing (' + def.n + ')';
}
function exhibitStore_(r) { try { return JSON.parse(String(r[COL_EXHIBITS - 1] || '{}')) || {}; } catch (e) { return {}; } }
function exSub_(root, n) { const it = root.getFoldersByName(n); return it.hasNext() ? it.next() : root.createFolder(n); }
function exhibitFolders_(r) {
  const m = String(r[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
  if (!m) throw new Error('No client folder yet - build the folder & docs first.');
  const root = DriveApp.getFolderById(m[1]);
  const done = exSub_(root, 'Completed');
  return { root: root, ex: exSub_(root, 'Exhibits'), done: done, fin: exSub_(done, 'Final Appraisal PDF') };
}
function exFileUrl_(id) { return 'https://drive.google.com/file/d/' + id + '/view'; }

function getExhibitList(row) {
  row = parseInt(row, 10);
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const st = exhibitStore_(r);
  const out = EXHIBIT_DEFS_.map(function(d) {
    const s = st[d.key];
    return { key: d.key, label: exhibitLabel_(d, r), has: !!(s && s.id), at: s ? s.at : '', type: s ? s.type || 'img' : '', url: s && s.id ? exFileUrl_(s.id) : '', custom: false };
  });
  Object.keys(st).filter(function(k) { return k.indexOf('x_') === 0; })
    .sort(function(a, b) { return (st[a].ord || 0) - (st[b].ord || 0); })
    .forEach(function(k) { const s = st[k]; out.push({ key: k, label: s.label || 'Additional exhibit', has: true, at: s.at, type: s.type || 'img', url: exFileUrl_(s.id), custom: true }); });
  return out;
}

function saveExhibit(row, key, dataUrl, label) {
  row = parseInt(row, 10);
  if (!row || row < 2) throw new Error('Select a file first.');
  const mm = String(dataUrl || '').match(/^data:([^;]+);base64,(.*)$/);
  if (!mm) throw new Error('No file received.');
  const isPdf = mm[1] === 'application/pdf';
  if (mm[2].length > 40000000) throw new Error('That file is too large (limit about 28 MB).');
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const lock = LockService.getDocumentLock(); lock.waitLock(20000);
  try {
    const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
    const f = exhibitFolders_(r);
    const st = exhibitStore_(r);
    const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy');
    let def = null, lab, prefix;
    if (key === 'new') {
      lab = String(label || '').trim() || 'Additional exhibit';
      let mx = 0; Object.keys(st).forEach(function(k) { if (k.indexOf('x_') === 0) mx = Math.max(mx, st[k].ord || 0); });
      key = 'x_' + new Date().getTime();
      st[key] = { ord: mx + 1, label: lab };
      prefix = 'Additional';
    } else {
      def = EXHIBIT_DEFS_.filter(function(d) { return d.key === key; })[0];
      if (!def) throw new Error('Unknown exhibit.');
      lab = exhibitLabel_(def, r);
      prefix = (EXHIBIT_DEFS_.indexOf(def) < 9 ? '0' : '') + (EXHIBIT_DEFS_.indexOf(def) + 1);
    }
    const old = st[key] && st[key].id; if (old) { try { DriveApp.getFileById(old).setTrashed(true); } catch (e) {} }
    const nm = prefix + ' - ' + lab.replace(/[\\\/:*?"<>|]/g, '') + ' (' + today.replace(/\//g, '-') + ')' + (isPdf ? '.pdf' : '.jpg');
    const file = f.ex.createFile(Utilities.newBlob(Utilities.base64Decode(mm[2]), isPdf ? 'application/pdf' : 'image/jpeg', nm));
    st[key] = Object.assign(st[key] || {}, { id: file.getId(), at: today, type: isPdf ? 'pdf' : 'img' });
    sheet.getRange(row, COL_EXHIBITS).setValue(JSON.stringify(st));
    if (def && def.dateCol) sheet.getRange(row, def.dateCol).setNumberFormat('@').setValue(today);
    return { ok: true, dateKey: def && def.dateKey ? def.dateKey : '', date: today };
  } finally { lock.releaseLock(); }
}

function exMutate_(row, fn) {
  row = parseInt(row, 10);
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const lock = LockService.getDocumentLock(); lock.waitLock(20000);
  try {
    const r = sheet.getRange(row, COL_EXHIBITS, 1, 1).getValues()[0];
    let st = {}; try { st = JSON.parse(String(r[0] || '{}')) || {}; } catch (e) {}
    fn(st);
    sheet.getRange(row, COL_EXHIBITS).setValue(JSON.stringify(st));
  } finally { lock.releaseLock(); }
  return true;
}
function renameExhibit(row, key, label) { return exMutate_(row, function(st) { if (st[key]) st[key].label = String(label || '').trim() || 'Additional exhibit'; }); }
function removeExhibit(row, key) {
  return exMutate_(row, function(st) {
    if (st[key] && st[key].id) { try { DriveApp.getFileById(st[key].id).setTrashed(true); } catch (e) {} }
    delete st[key];
  });
}
function moveExhibit(row, key, dir) {
  return exMutate_(row, function(st) {
    const ks = Object.keys(st).filter(function(k) { return k.indexOf('x_') === 0; }).sort(function(a, b) { return (st[a].ord || 0) - (st[b].ord || 0); });
    const i = ks.indexOf(key), j = i + (dir < 0 ? -1 : 1);
    if (i < 0 || j < 0 || j >= ks.length) return;
    ks.splice(j, 0, ks.splice(i, 1)[0]);
    ks.forEach(function(k, n) { st[k].ord = n + 1; });
  });
}

function findSignedAuthPdf_(done) {
  const it = done.searchFiles("title contains 'Signed Authorization' and mimeType = 'application/pdf' and trashed = false");
  let best = null;
  while (it.hasNext()) { const f = it.next(); if (!best || f.getLastUpdated() > best.getLastUpdated()) best = f; }
  return best;
}
function findBasePdf_(f) {
  const it = f.done.getFilesByName(EXH_BASE_NAME);
  if (it.hasNext()) return it.next();
  const fi = f.fin.getFiles();
  while (fi.hasNext()) { const x = fi.next(); if (!/Full Appraisal\.pdf$/i.test(x.getName())) return x.makeCopy(EXH_BASE_NAME, f.done); }
  return null;
}

function getFullBuildInfo(row) {
  row = parseInt(row, 10);
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  let info = { base: false, auth: false, count: 0, full: '' };
  try {
    const f = exhibitFolders_(r);
    info.base = !!(f.done.getFilesByName(EXH_BASE_NAME).hasNext()) || f.fin.getFiles().hasNext();
    info.auth = !!findSignedAuthPdf_(f.done);
    const fi = f.fin.getFiles(); while (fi.hasNext()) { const x = fi.next(); if (/Full Appraisal\.pdf$/i.test(x.getName())) info.full = x.getUrl(); }
  } catch (e) { info.error = e.message; }
  info.count = getExhibitList(row).filter(function(e) { return e.has; }).length;
  return info;
}
function getFullBuildStatus(token) {
  try { const v = CacheService.getScriptCache().get('fab_' + token); return v ? JSON.parse(v) : { state: 'none' }; } catch (e) { return { state: 'none' }; }
}

function loadPdfLib_() {
  if (typeof PDFLib !== 'undefined' && PDFLib.PDFDocument) return;
  let lastErr = '';
  for (let i = 0; i < PDFLIB_URLS_.length; i++) {
    try {
      const src = UrlFetchApp.fetch(PDFLIB_URLS_[i]).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, 'Utilities.sleep($1);return t();');
      eval(src);
      if (typeof PDFLib !== 'undefined' && PDFLib.PDFDocument) return;
    } catch (e) { lastErr = e.message; }
  }
  throw new Error('Could not load the PDF library (' + lastErr + ')');
}

function vehicleForName_(r) { return String(vehicleFromRow_(r) || '').replace(/[\\\/:*?"<>|]/g, '').trim(); }

// Runs as one job (async because the PDF library is). The panel polls getFullBuildStatus(token).
async function assembleFullAppraisalJob(row, token) {
  token = String(token || 'auto'); row = parseInt(row, 10);
  const put = function(o) { try { CacheService.getScriptCache().put('fab_' + token, JSON.stringify(o), 1800); } catch (e) {} };
  put({ state: 'running' });
  let who = 'Client';
  try {
    const sheet = getMainSheet(); ensureMainWidth_(sheet);
    const r = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
    who = String(r[0] || 'Client').trim();
    const f = exhibitFolders_(r);
    // always rebuild the appraisal / demand-letter PDFs fresh from the current documents (never reuse an old merged copy)
    try {
      const fm = String(r[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
      const urls = String(r[28] || '').split(/\r?\n/).map(function(u) { return u.trim(); }).filter(function(u) { return u; });
      if (fm && urls.length) compileBaseParts_(who, DriveApp.getFolderById(fm[1]), urls);
    } catch (cbe) { console.error('rebuild base parts: ' + cbe); }
    const base = findBasePdf_(f);
    if (!base) throw new Error('No appraisal PDF yet - click "Compile final PDF" first.');
    const bytesOf = function(file) { return new Uint8Array(file.getBlob().getBytes()); };
    const parts = [];
    const more = []; const demands = []; const itx = f.done.getFiles();
    while (itx.hasNext()) { const x = itx.next(); const nm = x.getName(); if (x.getId() === base.getId()) continue; if (/^Appraisal Part \d+ \(base\)\.pdf$/i.test(nm)) more.push(x); else if (/^Demand Letter.*\(base\)\.pdf$/i.test(nm)) demands.push(x); }
    more.sort(function(a, b) { return a.getName() < b.getName() ? -1 : 1; }); demands.sort(function(a, b) { return a.getName() < b.getName() ? -1 : 1; });
    // order: demand letter(s) FIRST, then the appraisal, then exhibits, then the signed authorization (added below)
    const offSet = fullOff_(row);
    (offSet.demand ? [] : demands).concat([base], more).forEach(function(x) { parts.push({ kind: 'base', bytes: bytesOf(x) }); });
    const nBase = parts.length;
    const st = exhibitStore_(r);
    const list = getExhibitList(row).filter(function(e) { return e.has && !offSet[e.key]; });
    list.forEach(function(e, i) {
      const s = st[e.key]; if (!s || !s.id) return;
      const def = EXHIBIT_DEFS_.filter(function(d) { return d.key === e.key; })[0];
      const dt = def && def.dateCol && String(r[def.dateCol - 1] || '').trim() ? 'Date sourced: ' + String(r[def.dateCol - 1]).trim() : 'Date added: ' + s.at;
      try { parts.push({ kind: s.type === 'pdf' ? 'pdf' : 'img', bytes: bytesOf(DriveApp.getFileById(s.id)), label: 'Exhibit ' + (i + 1) + ': ' + e.label, sub: dt }); } catch (err) { console.error('exhibit skipped ' + e.key + ': ' + err); }
    });
    const auth = offSet.auth ? null : findSignedAuthPdf_(f.done);
    if (auth) parts.push({ kind: 'auth', bytes: bytesOf(auth) });
    loadPdfLib_();
    const out = await assembleFullPdf_(parts);
    const name = (who + ' ' + vehicleForName_(r) + ' Full Appraisal').replace(/\s+/g, ' ').trim() + '.pdf';
    const fin = f.fin.getFiles(); while (fin.hasNext()) fin.next().setTrashed(true);
    const file = f.fin.createFile(Utilities.newBlob(Array.from(out), 'application/pdf', name));
    const msg = 'Combined: ' + (demands.length ? 'demand letter, then appraisal' : 'appraisal') + ' + ' + (parts.length - nBase - (auth ? 1 : 0)) + ' exhibit(s)' + (auth ? ' + signed authorization (last pages)' : (offSet.auth ? ' (signed agreement left out by your choice)' : ' (no signed authorization form found yet)'));
    put({ state: 'done', url: file.getUrl(), name: name, msg: msg, noAuth: !auth });
    let dvReq = false, dvErr = '';
    try { const stNow = String(sheet.getRange(row, 30).getValue() || ''); if (isDvApprovalType_(String(r[25] || '')) && !/Delivered|Client OK|Client Declined/.test(stNow)) dvReq = requestApprovalOnce_(sheet, row, 'deliver', String(new Date().getTime())); } catch (e3) { console.error('dv approval request: ' + e3); dvErr = String(e3 && e3.message || e3); }
    let invReq = false;
    try { const rr = sheet.getRange(row, 1, 1, 35).getValues()[0]; if (!dvReq && !isDvApprovalType_(String(rr[25] || '')) && !rr[31] && !rr[34] && rr[4] && !/Delivered/.test(String(rr[29] || ''))) invReq = requestApprovalOnce_(sheet, row, 'invoice'); } catch (e5) { console.error('invoice approval request: ' + e5); }
    if (invReq) put({ state: 'done', url: file.getUrl(), name: name, msg: msg + ' - invoice approval email sent to you', noAuth: !auth });
    if (!dvReq && !invReq) try { const ao = {}; let dvLink = ''; try { if (isDvApprovalType_(String(r[25] || ''))) dvLink = '\n\nAPPROVE & SEND TO THE CLIENT (nothing has been sent):\n' + actionLink_(row, 'do_deliver') + '\n'; } catch (e4) {} try { if (file.getSize() < 18 * 1024 * 1024) ao.attachments = [file.getBlob()]; } catch (e2) {} GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, '📄 Review: Full appraisal PDF ready - ' + who, name + '\n' + msg + dvLink + '\n\nThis is EXACTLY what the client receives (attached' + (ao.attachments ? '' : ' - too large to attach, use the link') + ').\n' + file.getUrl() + '\n\nIt is in the Final Appraisal PDF folder, so it sends automatically once payment clears (to send the invoice now use Manual Steps > Send invoice and deliver report), with Proceed / Do Not Proceed buttons for the client. If anything is wrong, fix it and click Compile final PDF again before payment.' + (dvErr ? '\n\nNOTE: the approval request could not be created (' + dvErr + '). Use Manual Steps > Send appraisal to the client for approval.' : ''), ao); } catch (e) {}
  } catch (e) {
    put({ state: 'error', msg: String(e && e.message || e) });
    try { GmailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL, 'Full appraisal PDF FAILED - ' + who, 'Could not build the combined PDF: ' + (e && e.message || e) + '\n\nThe plain appraisal PDF is still in the Final Appraisal PDF folder, so delivery is not affected.'); } catch (e2) {}
  }
}

// Builds the combined PDF. parts: [{kind:'base'|'auth'|'pdf'|'img', bytes:Uint8Array, label, sub}]
async function assembleFullPdf_(parts) {
  const L = PDFLib;
  const out = await L.PDFDocument.create();
  const bold = await out.embedFont(L.StandardFonts.HelveticaBold);
  const reg = await out.embedFont(L.StandardFonts.Helvetica);
  const clean = function(t) { return String(t || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/[^\x20-\x7E\xA0-\xFF]/g, ''); };
  const fit = function(font, t, size, maxW) { t = clean(t); while (t.length > 4 && font.widthOfTextAtSize(t, size) > maxW) t = t.slice(0, -4) + '...'; return t; };
  const header = function(page, w, top, label, sub) {
    page.drawText(fit(bold, label, 13, w - 60), { x: 30, y: top - 22, size: 13, font: bold, color: L.rgb(0.06, 0.09, 0.16) });
    if (sub) page.drawText(fit(reg, sub, 9, w - 60), { x: 30, y: top - 36, size: 9, font: reg, color: L.rgb(0.35, 0.4, 0.47) });
    page.drawLine({ start: { x: 30, y: top - 42 }, end: { x: w - 30, y: top - 42 }, thickness: 0.7, color: L.rgb(0.7, 0.74, 0.8) });
  };
  for (let n = 0; n < parts.length; n++) {
    const p = parts[n];
    if (p.kind === 'base' || p.kind === 'auth') {
      const src = await L.PDFDocument.load(p.bytes, { ignoreEncryption: true });
      const pgs = await out.copyPages(src, src.getPageIndices());
      pgs.forEach(function(pg) { out.addPage(pg); });
    } else if (p.kind === 'pdf') {
      const src = await L.PDFDocument.load(p.bytes, { ignoreEncryption: true });
      const emb = await out.embedPdf(src, src.getPageIndices());
      const band = 50;
      for (let i = 0; i < emb.length; i++) {
        const e = emb[i];
        const page = out.addPage([e.width, e.height + band]);
        page.drawPage(e, { x: 0, y: 0 });
        header(page, e.width, e.height + band, p.label + (emb.length > 1 ? '  (page ' + (i + 1) + ' of ' + emb.length + ')' : ''), p.sub);
      }
    } else {
      let im;
      try { im = await out.embedJpg(p.bytes); } catch (e) { im = await out.embedPng(p.bytes); }
      const land = im.width > im.height * 1.25;
      const W = land ? 792 : 612, H = land ? 612 : 792;
      const page = out.addPage([W, H]);
      header(page, W, H - 10, p.label, p.sub);
      const maxW = W - 60, maxH = H - 10 - 42 - 20 - 30;
      const s = Math.min(maxW / im.width, maxH / im.height, 1.5);
      const iw = im.width * s, ih = im.height * s;
      page.drawImage(im, { x: (W - iw) / 2, y: H - 10 - 52 - ih, width: iw, height: ih });
    }
  }
  return await out.save();
}

// ============================================================================
//  CLOSED FILES: closing a file moves it here (not deleted) so a mistake is one click to undo
// ============================================================================
const CLOSED_SHEET_NAME = '🗄 Closed Files';
const CLOSED_COLS = [['Row', 'ROW', 45], ['Client', 'NAME', 160], ['Vehicle', 'VEH', 200], ['Type', 'USE', 190], ['Closed on', 'WHEN', 95], ['Was at stage', 'PREV', 230], ['Last progress note', 'NOTE', 320], ['Reopen ☐', 'REOPEN', 80]];

function closedInfo_(cell) {
  const p = String(cell || '').split('|');
  return { when: p[0] || '', prev: p.slice(1).join('|') || '' };
}

// Marks a file closed (remembers where it was). Returns false if it was already closed.
function closeFileRow_(main, mainRow) {
  ensureMainWidth_(main);
  const st = String(main.getRange(mainRow, 30).getValue() || '');
  if (/^Closed/.test(st)) return false;
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'MM/dd/yyyy');
  main.getRange(mainRow, COL_PREV_STATUS).setValue(today + '|' + st);
  main.getRange(mainRow, 30).setValue('Closed').setBackground('#e5e7eb');
  const cell = main.getRange(mainRow, 94); const ex = String(cell.getValue() || '').trim();
  const entry = today + ' — File closed (was: ' + (st || 'no status') + ')';
  cell.setValue(ex ? entry + '\n' + ex : entry);
  return true;
}
function reopenFileRow_(main, mainRow) {
  ensureMainWidth_(main);
  const info = closedInfo_(main.getRange(mainRow, COL_PREV_STATUS).getValue());
  const back = info.prev && !/^Closed/.test(info.prev) ? info.prev : 'Reopened - Review Status (Portal)';
  main.getRange(mainRow, 30).setValue(back).setBackground(null);
  main.getRange(mainRow, COL_PREV_STATUS).clearContent();
  const cell = main.getRange(mainRow, 94); const ex = String(cell.getValue() || '').trim();
  const entry = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy') + ' — File reopened (back to: ' + back + ')';
  cell.setValue(ex ? entry + '\n' + ex : entry);
  return back;
}

function refreshClosedFiles_() {
  const ss = getWorkingSpreadsheet();
  const main = getMainSheet(); ensureMainWidth_(main);
  const last = main.getLastRow();
  const rows = [];
  if (last >= 2) {
    main.getRange(2, 1, last - 1, MAIN_ROW_WIDTH).getValues().forEach(function(d, i) {
      if (!d[0] || !/^Closed/.test(String(d[29] || ''))) return;
      const ci = closedInfo_(d[COL_PREV_STATUS - 1]);
      const n = lastNoteInfo_(d[93]);
      rows.push([i + 2, d[0], vehicleFromRow_(d), d[25], ci.when, ci.prev || '(unknown)', String(d[93] || '').split('\n').slice(0, 2).join('  |  '), false]);
    });
  }
  let sh = ss.getSheetByName(CLOSED_SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(CLOSED_SHEET_NAME); }
  const nC = CLOSED_COLS.length;
  if (sh.getRange(1, 1).getValue() !== 'Row' || sh.getRange(1, nC).getValue() !== CLOSED_COLS[nC - 1][0]) {
    sh.clear();
    sh.getRange(1, 1, 1, nC).setValues([CLOSED_COLS.map(function(c) { return c[0]; })]).setBackground('#475569').setFontColor('#ffffff').setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
    CLOSED_COLS.forEach(function(c, i) { sh.setColumnWidth(i + 1, c[2]); });
    sh.setFrozenRows(1); sh.setRowHeight(1, 38); sh.setTabColor('#64748b');
  }
  const old = sh.getLastRow();
  if (old > 1) sh.getRange(2, 1, old - 1, nC).clearContent().clearDataValidations().setBackground(null);
  if (rows.length) {
    sh.getRange(2, 1, rows.length, nC).setValues(rows).setVerticalAlignment('middle').setWrap(true);
    sh.getRange(2, nC, rows.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
    sh.getRange(2, 1, rows.length, nC - 1).setBackground('#f1f5f9').setFontColor('#475569');
  }
  return rows.length;
}

function goToClosedFiles() {
  const n = refreshClosedFiles_();
  const sh = getWorkingSpreadsheet().getSheetByName(CLOSED_SHEET_NAME);
  if (sh) getWorkingSpreadsheet().setActiveSheet(sh);
  getWorkingSpreadsheet().toast(n + ' closed file' + (n === 1 ? '' : 's') + '. Tick "Reopen" to bring one back.', '🗄 Closed Files', 6);
}

// Menu / File Panel: close the selected file.
function closeActiveFile() {
  const row = activeFileRow_();
  if (row <= 1) return SpreadsheetApp.getUi().alert('Select a file first.');
  const main = getMainSheet();
  const nm = String(main.getRange(row, 1).getValue() || 'this file');
  const ui = SpreadsheetApp.getUi();
  if (ui.alert('Close ' + nm + '?', 'It moves to the 🗄 Closed Files tab - nothing is deleted, and you can reopen it any time.', ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return;
  closeFileRow_(main, row);
  try { refreshActiveFiles(); } catch (e) {}
  try { refreshClosedFiles_(); } catch (e) {}
  getWorkingSpreadsheet().toast(nm + ' moved to 🗄 Closed Files.', 'Closed', 5);
}

function closedEdit_(e, sh) {
  const r = e.range.getRow(), c = e.range.getColumn();
  if (r < 2 || c !== CLOSED_COLS.length || e.range.getValue() !== true) return;
  const mainRow = parseInt(sh.getRange(r, 1).getValue(), 10);
  const main = getMainSheet();
  if (!mainRow || mainRow < 2) return;
  if (String(main.getRange(mainRow, 1).getValue() || '') !== String(sh.getRange(r, 2).getValue() || '')) {
    getWorkingSpreadsheet().toast('Rows moved - refreshing. Tick it again.', 'Closed Files', 5); refreshClosedFiles_(); return;
  }
  const back = reopenFileRow_(main, mainRow);
  sh.deleteRow(r);
  try { refreshActiveFiles(); } catch (err) {}
  getWorkingSpreadsheet().toast('Reopened - back in 🔥 Active Files at: ' + back, 'Closed Files', 6);
}

// ============================================================================
//  DOCUMENTS TO REVIEW BEFORE APPROVING
//  Every approval email attaches the documents that will go out (PDF copies) and
//  links to the originals; the approve page lists the same links.
// ============================================================================
function docFileFromCell_(cell, idx) {
  const urls = String(cell || '').split(/\r?\n/).map(function(u) { return u.trim(); }).filter(Boolean);
  const m = (urls[idx] || '').match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!m) return null;
  try { return DriveApp.getFileById(m[1]); } catch (e) { return null; }
}
function findInCompleted_(row, re) {
  const d = getMainSheet().getRange(row, 28, 1, 1).getValue();
  const m = String(d || '').match(/folders\/([a-zA-Z0-9-_]+)/); if (!m) return null;
  try {
    const it = DriveApp.getFolderById(m[1]).getFoldersByName('Completed'); if (!it.hasNext()) return null;
    const fi = it.next().getFiles(); let best = null;
    while (fi.hasNext()) { const f = fi.next(); if (re.test(f.getName()) && !f.isTrashed() && (!best || f.getLastUpdated() > best.getLastUpdated())) best = f; }
    return best;
  } catch (e) { return null; }
}

// -> [{label, name, url, file}]  (file = DriveApp File, for the PDF copy)
function approvalDocs_(row, action, createPreview) {
  const r = getMainSheet().getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const out = [];
  const add = function(label, f) { if (f) out.push({ label: label, name: f.getName(), url: f.getUrl(), file: f }); };
  try {
    if (action === 'intake') {
      add('Intake / service agreement (the client e-signs this)', docFileFromCell_(r[28], 0));
    } else if (action === 'invoice' || action === 'deliver') {
      add('Final appraisal PDF', findFolderPdf_(r[27]));
    } else if (action === 'offer') {
      add('Insurance offer document (the offer amount is filled in when you approve)', findInCompleted_(row, /Offer|Doc 7/i));
    } else if (action === 'award') {
      let f = findInCompleted_(row, /^Appraisal Award Document/i);
      if (createPreview || !f) { try { if (createPreview) { const sh = getMainSheet(); const st0 = sh.getRange(row, 30).getValue(), lg0 = sh.getRange(row, 94).getValue(); f = createAwardDocCore_(row, r); sh.getRange(row, 30).setValue(st0); sh.getRange(row, 94).setValue(lg0); } } catch (e) { console.error('award preview: ' + e); } }
      add('Award document (the carrier appraiser e-signs this)', f);
    } else if (action === 'demand') {
      add('Final appraisal PDF', findFolderPdf_(r[27]));
      const ur = String(r[28] || '').split(/\r?\n/);
      for (let i = 0; i < ur.length; i++) { const mm = ur[i].match(/\/d\/([a-zA-Z0-9-_]+)/); if (!mm) continue; try { const f = DriveApp.getFileById(mm[1]); if (/demand|notice/i.test(f.getName())) { add('Demand / notice letter', f); break; } } catch (e) {} }
    }
  } catch (e) { console.error('approvalDocs_ ' + action + ': ' + e); }
  return out;
}
function docBlobs_(docs) {
  const blobs = []; let total = 0;
  docs.forEach(function(d) {
    try {
      const mt = d.file.getMimeType();
      const b = mt === 'application/pdf' ? d.file.getBlob() : d.file.getAs(MimeType.PDF).setName(d.name.replace(/\.pdf$/i, '') + '.pdf');
      const n = b.getBytes().length;
      if (total + n < 20 * 1024 * 1024) { blobs.push(b); total += n; }
    } catch (e) {}
  });
  return blobs;
}
function docLinksText_(docs) {
  return docs.length ? docs.map(function(d) { return '- ' + d.label + ': ' + d.name + '\n  ' + d.url; }).join('\n') : '(no documents are sent with this step - email only)';
}
function docLinksHtml_(docs) {
  if (!docs.length) return '<p style="font-size:13px;color:#555">No documents go out with this step (email only).</p>';
  return '<div style="background:#eef6ff;border:1px solid #bcd7f5;border-radius:6px;padding:10px;margin:10px 0;font-size:13px"><strong>📄 Documents that will be sent - click to review:</strong><br>' +
    docs.map(function(d) { return '• ' + escHtml_(d.label) + ': <a target="_blank" href="' + escHtml_(d.url) + '">' + escHtml_(d.name) + '</a>'; }).join('<br>') + '</div>';
}

// File Panel: save a progress note and ask for approval to email it to the client right now.
function addNoteAndRequestClientUpdate(row, text) {
  const r = parseInt(row, 10);
  const sheet = getMainSheet();
  if (!String(sheet.getRange(r, 5).getValue() || '').trim()) throw new Error('This client has no email address on file.');
  const log = addProgressNoteToRow(r, text);
  requestApprovalOnce_(sheet, r, 'clientupdate', String(new Date().getTime()));
  return { ok: true, log: log };
}

// ============================================================================
//  PROGRESS TRACKER: the same steps shown in the File Panel, Active Files, the
//  daily briefing and the client's weekly update
// ============================================================================
const PROGRESS_STEPS_ = {
  insurerDV: ['Agreement signed', 'Appraisal prepared', 'Report delivered', 'Demand sent to insurer', 'Insurer offer received', 'Complete'],
  acDV: ['Agreement signed', 'Appraisal prepared', 'Report delivered', 'Appraisal clause invoked', 'Appraisers agree on value', 'Award signed'],
  acTL: ['Agreement signed', 'Appraisal prepared', 'Report delivered', 'Appraisal clause invoked', 'Appraisers agree on value', 'Award signed'],
  plain: ['Agreement signed', 'Appraisal prepared', 'Invoice paid', 'Report delivered']
};
function setProgressManual(row, value, name) {
  row = parseInt(row, 10); if (!row || row < 2) throw new Error('No file selected.');
  const sh = getMainSheet(); ensureMainWidth_(sh);
  const who = String(sh.getRange(row, 1).getValue() || '');
  if (name && who && String(name).trim() !== who.trim()) throw new Error('The panel is showing "' + name + '" but row ' + row + ' is "' + who + '". Click the file in the sheet to reload the panel, then try again.');
  const v = String(value == null ? '' : value).trim();
  const cell = sh.getRange(row, COL_PROG_MANUAL);
  cell.setNumberFormat('0'); cell.setValue(v === '' ? '' : Math.max(0, parseInt(v, 10) || 0));
  SpreadsheetApp.flush();
  const back = String(sh.getRange(row, COL_PROG_MANUAL).getValue() == null ? '' : sh.getRange(row, COL_PROG_MANUAL).getValue()).trim();
  const p = progressInfo_(sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0]);
  return { p: p, who: who, row: row, stored: back, ok: back === (v === '' ? '' : String(Math.max(0, parseInt(v, 10) || 0))) };
}
function progressInfo_(d) {
  const use = String(d[25] || ''), st = String(d[29] || '');
  const v = deliveryVariant_(use);
  const steps = PROGRESS_STEPS_[v] || PROGRESS_STEPS_.plain;
  let done = 0;
  if (/Paid in Full|Award Signed/.test(st)) done = steps.length;
  else if (v === 'plain') {
    if (/Paid & Final PDF Delivered|Delivered/.test(st)) done = 4;
    else if (/Invoice Sent|Awaiting Payment/.test(st)) done = 2;
    else if (/Auth Signed/.test(st)) done = 1;
  } else {
    if (/Award Sent|Award Document Created/.test(st)) done = 5;
    else if (/Final Offer|Offer Signed/.test(st)) done = 5;
    else if (/Demand Emailed/.test(st)) done = 4;
    else if (/Client OK|Delivered|Awaiting Client OK/.test(st)) done = 3;
    else if (/Auth Signed/.test(st)) done = 1;
  }
  const total = steps.length;
  const man = String(d[COL_PROG_MANUAL - 1] == null ? '' : d[COL_PROG_MANUAL - 1]).trim();
  let manual = null;
  if (man !== '' && !isNaN(parseInt(man, 10))) { manual = Math.max(0, Math.min(total, parseInt(man, 10))); if (manual > done) done = manual; }
  const bar = new Array(total + 1).join('□').split('').map(function(c, i) { return i < done ? '■' : '□'; }).join('');
  return { steps: steps, done: done, total: total, pct: Math.round(done / total * 100), bar: bar, now: done < total ? steps[done] : '', manual: manual };
}
// Plain-text tracker for emails.
function progressText_(p) {
  const lines = p.steps.map(function(s, i) { return '  ' + (i < p.done ? '✔ ' : i === p.done ? '▶ ' : '○ ') + s + (i === p.done ? '   <- where we are now' : ''); });
  return 'YOUR PROGRESS - ' + p.done + ' of ' + p.total + ' steps complete\n[' + p.bar + '] ' + p.pct + '%\n' + lines.join('\n');
}

// ============================================================================
//  EMAIL ATTACHMENTS -> CLIENT FOLDER  (+ people not in the sheet yet)
//  Every 10 minutes:
//   1. new emails from a file's client / other addresses / adjuster / carrier appraiser -> attachments saved to that file's folder
//   2. emails from anyone else that mention a claim # or VIN on file -> filed to "Insurer Documents"
//   3. emails from people NOT in the sheet that look like appraisal business -> listed on the "📬 New Emails" tab
//      (one click: create a client file, add the address to an existing file, or ignore)
// ============================================================================
const FILED_SHEET_NAME = 'Filed Attachments';
const NEWMAIL_SHEET_NAME = '📬 New Emails';
const FILED_LABEL = 'Filed to client folder';
const COL_EXTRA_EMAILS = 125;
const FILER_DAYS = 3, FILER_NEW_ADDR_DAYS = 30, FILER_MIN_BYTES = 12 * 1024;
const NEWMAIL_JUNK_RE = /no-?reply|do-?not-?reply|mailer-daemon|postmaster|notification|newsletter|bounce|marketing|promo|@(.*\.)?(google|facebook|linkedin|paypal|wave|waveapps|stripe|intuit|amazon|apple|microsoft|github|zoom)\./i;
const NEWMAIL_KEYWORDS_RE = /apprais|diminished|total loss|claim|\bvin\b|vehicle|insurance|insurer|adjuster|collision|accident|repair|estimate|settlement|registration|odometer|dealer/i;

function filedSheet_() {
  const ss = getWorkingSpreadsheet();
  let sh = ss.getSheetByName(FILED_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(FILED_SHEET_NAME);
    sh.getRange(1, 1, 1, 9).setValues([['Filed on', 'Row', 'Client', 'From', 'Email subject', 'File', 'Link', 'Key', 'Folder']]).setFontWeight('bold').setBackground('#475569').setFontColor('#ffffff');
    sh.setFrozenRows(1); sh.setTabColor('#64748b');
    [150, 45, 160, 220, 280, 260, 300, 120, 130].forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
  }
  return sh;
}
function emailsIn_(cell) {
  return String(cell || '').toLowerCase().split(/[,;\s<>]+/).filter(function(x) { return x.indexOf('@') > 0; });
}
function senderOf_(msg) {
  const f = String(msg.getFrom() || ''); const m = f.match(/<([^>]+)>/);
  return (m ? m[1] : f).trim().toLowerCase();
}
function senderNameOf_(msg) {
  const f = String(msg.getFrom() || ''); const m = f.match(/^\s*"?([^"<]+?)"?\s*</);
  return m ? m[1].trim() : '';
}
function filerCtx_() {
  const fs = filedSheet_(); const keys = {}, rowsWithFiles = {}; const lr = fs.getLastRow();
  if (lr > 1) fs.getRange(2, 1, lr - 1, 9).getValues().forEach(function(r) { keys[String(r[7])] = true; rowsWithFiles[r[1] + '|' + r[2]] = true; });
  return { fs: fs, keys: keys, rowsWithFiles: rowsWithFiles, tz: Session.getScriptTimeZone(), result: { saved: 0, files: [] } };
}
function buildAddrMap_(data) {
  const addr = {}, ids = [];
  data.forEach(function(d, i) {
    if (!d[0] || !/folders\//.test(String(d[27] || '')) || /^Closed/.test(String(d[29] || ''))) return;
    const claim = String(d[9] || '').replace(/\s/g, ''), vin = String(d[16] || '').replace(/\s/g, '').toUpperCase();
    ids.push({ i: i, claim: claim.length >= 5 ? claim.toLowerCase() : '', vin: vin.length === 17 ? vin : '' });
    emailsIn_(d[4]).concat(emailsIn_(d[COL_EXTRA_EMAILS - 1])).forEach(function(e) { (addr[e] = addr[e] || []).push({ i: i, kind: 'Client Uploads' }); });
    emailsIn_(d[12]).concat(emailsIn_(d[COL_CARRIER_APPRAISER_EMAIL - 1])).forEach(function(e) { (addr[e] = addr[e] || []).push({ i: i, kind: 'Insurer Documents' }); });
  });
  return { addr: addr, ids: ids };
}
// Saves one email's attachments into the file's folder. Returns how many were saved.

// ---------------- Auto-fill blank fields from email text + PDF/image attachments ----------------
// Reads the email body and (OCR) the PDFs/images it brings in, and fills ONLY blank cells:
// claim #, insurer, adjuster name/phone/email, at-fault driver, date of loss, VIN, client phone.
// Never overwrites anything already typed. Each fill is written to the progress log so you can verify it.
const AUTOFILL_CARRIERS_ = ['State Farm', 'GEICO', 'Progressive', 'Allstate', 'USAA', 'Liberty Mutual', 'Nationwide', 'Farmers', 'Travelers', 'American Family', 'Erie Insurance', 'Auto-Owners', 'Country Financial', 'Mercury', 'Safeco', 'The Hartford', 'MetLife', 'Amica', 'Shelter', 'Kemper', 'Direct General', 'Bristol West', 'The General', 'Esurance', 'Farm Bureau', 'Sentry', 'Westfield', 'Cincinnati Insurance', 'Donegal', 'Plymouth Rock', 'Hanover', 'CSAA', 'AAA', 'Elephant', 'Dairyland', 'Infinity', 'Clearcover', 'Lemonade', 'Hagerty', 'Chubb', 'Root Insurance', 'National General', 'Assurant', 'Foremost', 'Grange', 'COUNTRY Financial', 'Penn National', 'Universal', 'Direct Auto', 'Acceptance', 'Pekin', 'Horace Mann', 'Auto Club'];
const AUTOFILL_MY_PHONE_ = '9103336001';
function cleanName_(n) { const out = []; const parts = String(n || '').trim().split(/\s+/); for (let i = 0; i < parts.length; i++) { out.push(parts[i]); if (/[a-z]{2,}\.$/i.test(parts[i])) { out[i] = parts[i].slice(0, -1); break; } } return out.join(' '); }
function extractClaimInfo_(text, kind, senderEmail) {
  const t = String(text || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ');
  const out = {};
  const nameRe = "([A-Z][A-Za-z.'\\-]+(?: [A-Z][A-Za-z.'\\-]+){1,3})";
  // claim number (must be labeled and contain a digit)
  let m, re = /claim\s*(?:number|no\.?|num\.?|#)\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-]{4,19})/gi;
  while ((m = re.exec(t))) { if (/\d/.test(m[1]) && !/^(number|numbers)$/i.test(m[1])) { out.claim = m[1].toUpperCase(); break; } }
  if (!out.claim) { m = t.match(/\bclaim\s*[:#]\s*([A-Z0-9][A-Z0-9\-]{4,19})/i); if (m && /\d/.test(m[1])) out.claim = m[1].toUpperCase(); }
  // insurer (first known carrier named)
  let best = null;
  AUTOFILL_CARRIERS_.forEach(function(c) { const i = t.search(new RegExp('\\b' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i')); if (i >= 0 && (best === null || i < best.i)) best = { i: i, c: c }; });
  if (best) out.carrier = best.c.replace(/^COUNTRY Financial$/, 'Country Financial');
  // at-fault driver / insured
  m = t.match(new RegExp('(?:at[- ]fault (?:party|driver|insured)|adverse (?:party|driver)|(?:our|your) insured|insured driver|insured|policyholder|responsible party)\\s*(?:name)?\\s*[:\\-]\\s*' + nameRe));
  if (m) out.atFault = cleanName_(m[1]);
  // date of loss
  m = t.match(/date of (?:loss|accident|incident|collision)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
  if (m) out.dol = m[1].replace(/-/g, '/');
  // VIN
  re = /\b([A-HJ-NPR-Z0-9]{17})\b/g;
  while ((m = re.exec(t.toUpperCase()))) { if (/\d/.test(m[1]) && /[A-Z]/.test(m[1])) { out.vin = m[1]; break; } }
  // adjuster name
  m = t.match(new RegExp('(?:adjuster|appraiser|estimator|claims? (?:representative|specialist|handler|examiner)|handler|examiner)\\s*(?:name)?\\s*[:\\-]\\s*' + nameRe, 'i'));
  if (m) out.adjName = cleanName_(m[1]);
  if (!out.adjName) { m = t.match(new RegExp('\\n' + nameRe + '\\s*\\n\\s*(?:Senior |Sr\\.? |Claims? |Auto |Physical Damage |Property |Total Loss )*(?:Adjuster|Appraiser|Estimator|Claims? Representative|Claims? Specialist|Claims? Handler|Examiner)')); if (m) out.adjName = cleanName_(m[1]); }
  if (out.adjName && /^(the|your|our|this|claim|auto|physical)\b/i.test(out.adjName)) delete out.adjName;
  if (kind === 'Insurer Documents') { m = t.match(/(?:offer(?:ed)?|settlement|total loss (?:value|valuation)|actual cash value|\bACV\b|diminished value)[^$\d]{0,40}\$\s?([\d,]{3,9}(?:\.\d{2})?)/i); if (m) out.offer = m[1].replace(/,/g, ''); }
  // mileage / odometer, plate, title brand
  m = t.match(/(?:odometer|mileage|miles)\s*(?:reading)?\s*[:\-]?\s*([\d,]{4,7})\b/i) || t.match(/\b(\d{1,3}(?:,\d{3})+)\s*(?:miles|mi)\b/i);
  if (m) { const mv = parseInt(String(m[1]).replace(/,/g, ''), 10); if (mv >= 100 && mv <= 500000) out.mileage = mv; }
  m = t.match(/(?:license plate|plate(?: number| no\.?| #)?|tag(?: number| no\.?)?)\s*[:#\-]\s*([A-Z0-9][A-Z0-9 \-]{1,8}[A-Z0-9])\b/i);
  if (m && /\d/.test(m[1]) && !/^(number|state)$/i.test(m[1])) out.plate = m[1].toUpperCase().trim();
  m = t.match(/title[^.\n]{0,40}\b(salvage|rebuilt|reconstructed|junk|flood|lemon)\b/i) || t.match(/\b(salvage|rebuilt|reconstructed|flood)\s+title\b/i);
  if (m) out.titleBrand = { salvage: 'Salvage', rebuilt: 'Rebuilt', reconstructed: 'Reconstructed', junk: 'Junk', flood: 'Flood', lemon: 'Lemon / Buyback' }[m[1].toLowerCase()];
  // phones
  const phones = []; re = /(?:\+?1[\s.\-]?)?\(?\b(\d{3})\)?[\s.\-]?(\d{3})[\s.\-]?(\d{4})\b(?:\s*(?:ext\.?|x|extension|#)\s*(\d{1,6}))?/gi;
  while ((m = re.exec(t))) {
    const d = m[1] + m[2] + m[3]; if (d === AUTOFILL_MY_PHONE_ || /^[01]/.test(d)) continue;
    const ctx = t.slice(Math.max(0, m.index - 24), m.index).toLowerCase(); if (/fax/.test(ctx)) continue;
    phones.push({ v: m[1] + '-' + m[2] + '-' + m[3] + (m[4] ? ' ext. ' + m[4] : ''), pref: /direct|phone|tel|office|cell|mobile|\bp:|\bm:|\bc:|\bd:/.test(ctx) ? 1 : 0 });
  }
  phones.sort(function(a, b) { return b.pref - a.pref; });
  if (phones.length) { if (kind === 'Insurer Documents') out.adjPhone = phones[0].v; else out.phone = phones[0].v; }
  if (kind === 'Insurer Documents' && senderEmail && !/@(gmail|yahoo|hotmail|outlook|aol|icloud|me|live|msn)\./i.test(senderEmail)) out.adjEmail = senderEmail;
  return out;
}
function ocrText_(blob) {
  if (typeof Drive === 'undefined') return '';
  let id = null;
  try {
    const name = 'tmp-ocr-' + Date.now();
    if (typeof Drive.Files.create === 'function') id = Drive.Files.create({ name: name, mimeType: MimeType.GOOGLE_DOCS }, blob, { ocrLanguage: 'en' }).id;
    else id = Drive.Files.insert({ title: name, mimeType: MimeType.GOOGLE_DOCS }, blob, { convert: true, ocr: true, ocrLanguage: 'en' }).id;
    return DocumentApp.openById(id).getBody().getText().slice(0, 12000);
  } catch (e) { console.error('ocr: ' + e); return ''; }
  finally { if (id) { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} } }
}
const AUTOFILL_FIELDS_ = [['claim', 10, 'Claim #'], ['carrier', 8, 'Insurer'], ['adjName', 11, 'Adjuster'], ['adjPhone', 12, 'Adjuster phone'], ['adjEmail', 13, 'Adjuster email'], ['atFault', 15, 'At-fault driver'], ['dol', 6, 'Date of loss'], ['vin', 17, 'VIN'], ['phone', 2, 'Client phone'], ['offer', 33, 'Insurer offer'], ['mileage', 21, 'Mileage'], ['plate', 22, 'Plate'], ['titleBrand', 25, 'Title branding']];
// Which fields were filled in automatically (and from what), so the panel can flag them for you to verify.
const PREFILL_KEYS_ = { claim: 'claim', carrier: 'carrier', adjName: 'adjName', adjPhone: 'adjPhone', adjEmail: 'adjEmail', atFault: 'atFaultDriver', dol: 'dateOfLoss', vin: 'vin', phone: 'phone', offer: 'offerAmount', mileage: 'mileage', plate: 'plate', titleBrand: 'titleBranding', year: 'year', make: 'make', model: 'model', trim: 'trim' };
function getPrefillMarks_(row) { try { const v = PropertiesService.getScriptProperties().getProperty('PF_' + row); return v ? JSON.parse(v) : {}; } catch (e) { return {}; } }
function setPrefillMark_(row, panelKey, text) {
  try { const m = getPrefillMarks_(row); m[panelKey] = text; PropertiesService.getScriptProperties().setProperty('PF_' + row, JSON.stringify(m)); } catch (e) {}
}
function clearPrefillMark(row, panelKey) { try { const m = getPrefillMarks_(parseInt(row, 10)); delete m[panelKey]; PropertiesService.getScriptProperties().setProperty('PF_' + parseInt(row, 10), JSON.stringify(m)); } catch (e) {} return true; }
// Year / make / model / trim from the VIN (free NHTSA lookup). Fills ONLY empty boxes.
function decodeVinFill_(row, force) {
  row = parseInt(row, 10);
  const sheet = getMainSheet(); const d = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const vin = String(d[16] || '').trim().toUpperCase();
  const empty = function(i) { return String(d[i] == null ? '' : d[i]).trim() === ''; };
  if (!validVin_(vin) || !(empty(15) || empty(17) || empty(18) || empty(19))) return [];
  const props = PropertiesService.getScriptProperties(), vk = 'VD_' + row + '_' + vin;
  if (!force && props.getProperty(vk)) return [];   // already looked this VIN up once
  props.setProperty(vk, '1');
  let r; try { r = JSON.parse(UrlFetchApp.fetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/' + vin + '?format=json', { muteHttpExceptions: true }).getContentText()).Results[0]; } catch (e) { return []; }
  if (!r) return [];
  const tc = function(x) { x = String(x || '').trim(); return x.length <= 3 ? x.toUpperCase() : x.toLowerCase().replace(/\b[a-z]/g, function(c) { return c.toUpperCase(); }); };
  const vals = [[15, 16, 'year', 'Year', String(r.ModelYear || '').trim()], [17, 18, 'make', 'Make', tc(r.Make)], [18, 19, 'model', 'Model', String(r.Model || '').trim()], [19, 20, 'trim', 'Trim', String(r.Trim || r.Series || '').trim()]];
  const done = [], today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy');
  vals.forEach(function(v) { if (!v[4] || !empty(v[0])) return; writeMainCell_(sheet, row, v[1], v[4]); setPrefillMark_(row, v[2], 'Pre-filled from the VIN lookup (NHTSA) on ' + today + ' - please verify'); done.push(v[3] + ' ' + v[4]); });
  if (done.length) { try { addProgressNoteToRow(row, 'Auto-filled from the VIN (please verify) - ' + done.join('; ')); } catch (e) {} }
  return done;
}
function applyAutofill_(sheet, rowNo, d, info, srcLabel) {
  const done = [];
  AUTOFILL_FIELDS_.forEach(function(f) {
    const v = info[f[0]]; if (!v) return;
    if (String(d[f[1] - 1] == null ? '' : d[f[1] - 1]).trim() !== '') return;     // never overwrite
    d[f[1] - 1] = writeMainCell_(sheet, rowNo, f[1], v);
    done.push(f[2] + ': ' + v);
    setPrefillMark_(rowNo, PREFILL_KEYS_[f[0]] || f[0], 'Pre-filled from ' + srcLabel + ' on ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy') + ' - please verify');
  });
  if (done.length) { try { addProgressNoteToRow(rowNo, 'Auto-filled from ' + srcLabel + ' (please verify) - ' + done.join('; ')); } catch (e) {} }
  try { const dv = decodeVinFill_(rowNo); dv.forEach(function(x) { done.push(x); }); } catch (e) {}
  return done;
}
// VIN check-digit test (rejects OCR misreads).
function validVin_(v) {
  v = String(v || '').toUpperCase(); if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false;
  const tr = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9 };
  const w = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2]; let sum = 0;
  for (let i = 0; i < 17; i++) { const c = v[i]; const n = /\d/.test(c) ? parseInt(c, 10) : tr[c]; sum += n * w[i]; }
  const chk = sum % 11; return v[8] === (chk === 10 ? 'X' : String(chk));
}
// Reads photos filed for this client (windshield VIN plate, door sticker, odometer, documents) and fills VIN / mileage ONLY if empty.
function prefillFromPhotos_(row, maxFiles) {
  row = parseInt(row, 10); maxFiles = maxFiles || 4;
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const d = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const fs = getWorkingSpreadsheet().getSheetByName(FILED_SHEET_NAME);
  const filled = [];
  if (fs && fs.getLastRow() >= 2) {
    const name = String(d[0] || '');
    const props = PropertiesService.getScriptProperties(); let done = {}; try { done = JSON.parse(props.getProperty('PFP_' + row) || '{}'); } catch (e) {}
    const anyEmpty = function() { return AUTOFILL_FIELDS_.some(function(f) { return String(d[f[1] - 1] == null ? '' : d[f[1] - 1]).trim() === ''; }); };
    const rows = fs.getRange(2, 1, fs.getLastRow() - 1, 9).getValues().filter(function(r) { return parseInt(r[1], 10) === row && String(r[2]) === name && /\.(jpe?g|png|gif|tiff?|pdf)$/i.test(String(r[5])); }).reverse();
    let n = 0;
    for (let i = 0; i < rows.length && n < maxFiles && anyEmpty(); i++) {
      const m = String(rows[i][6] || '').match(/\/d\/([a-zA-Z0-9-_]+)/); if (!m || done[m[1]]) continue;
      done[m[1]] = 1; n++;
      let text = ''; try { const f = DriveApp.getFileById(m[1]); if (f.getSize() < 15000 || f.getSize() > 8000000) continue; text = ocrText_(f.getBlob()); } catch (e) { continue; }
      if (!text) continue;
      const info = extractClaimInfo_(text, String(rows[i][8] || ''), '');
      // a VIN from a photo is only accepted if its check digit is valid (rejects OCR misreads)
      const up = text.toUpperCase().replace(/[\s-]/g, ''); delete info.vin;
      const re = /[A-HJ-NPR-Z0-9]{17}/g; let mm; while ((mm = re.exec(up))) { if (validVin_(mm[0])) { info.vin = mm[0]; break; } }
      applyAutofill_(sheet, row, d, info, 'photo/file "' + rows[i][5] + '"').forEach(function(x) { filled.push(x); });
    }
    props.setProperty('PFP_' + row, JSON.stringify(done));
  }
  try { decodeVinFill_(row, maxFiles >= 6).forEach(function(x) { filled.push(x); }); } catch (e) {}
  return filled;
}
function prefillFromPhotosNow(row) {
  row = parseInt(row, 10); const f = prefillFromPhotos_(row, 6);
  return { ok: true, msg: f.length ? 'Filled (only empty boxes): ' + f.join('; ') + '. They are marked in the panel so you can verify.' : 'Nothing new found in the photos and files received so far (boxes that already have a value are never changed).' };
}
function autofillFromMessage_(ctx, msg, d, rowNo, kind, newFiles) {
  try {
    let text = ''; try { text = msg.getSubject() + '\n' + msg.getPlainBody().slice(0, 8000); } catch (e) {}
    ctx.ocrLeft = ctx.ocrLeft == null ? 6 : ctx.ocrLeft;
    newFiles.slice(0, 3).forEach(function(nf) {
      if (ctx.ocrLeft <= 0 || nf.size < 15000 || nf.size > 8000000 || !/pdf|image\/(png|jpe?g|gif|tiff?)/i.test(nf.ct)) return;
      ctx.ocrLeft--; text += '\n' + ocrText_(nf.blob);
    });
    const info = extractClaimInfo_(text, kind, senderOf_(msg));
    const done = applyAutofill_(getMainSheet(), rowNo, d, info, 'email from ' + senderOf_(msg));
    if (done.length) { ctx.result.filled = ctx.result.filled || []; ctx.result.filled.push(d[0] + ' - ' + done.join('; ')); }
    try { const pf = prefillFromPhotos_(rowNo, 2); if (pf.length) { ctx.result.filled = ctx.result.filled || []; ctx.result.filled.push(d[0] + ' (photos) - ' + pf.join('; ')); } } catch (e2) { console.error('photo prefill: ' + e2); }
  } catch (e) { console.error('autofill: ' + e); }
}


// ---------------- Save a private copy of EVERY email (with or without attachments) ----------------
const EMAIL_FOLDER_NAME = 'Emails - Private';
function partiesOf_(msg) { let a = ''; try { a = [msg.getFrom(), msg.getTo(), msg.getCc()].join(' '); } catch (e) {} return emailsIn_(a); }
function partnerOf_(msg, addr, me) { const p = partiesOf_(msg); for (let i = 0; i < p.length; i++) if (p[i] !== me && addr[p[i]]) return p[i]; return ''; }
function saveEmailCopy_(ctx, msg, d, rowNo) {
  const key = msg.getId() + '|EMAIL|0'; if (ctx.keys[key]) return false;
  if (ctx.deadline && Date.now() > ctx.deadline) return false;   // out of time - picked up on the next run
  const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/); if (!m) return false;
  let root; try { root = DriveApp.getFolderById(m[1]); } catch (e) { return false; }
  const it = root.getFoldersByName(EMAIL_FOLDER_NAME); const dest = it.hasNext() ? it.next() : root.createFolder(EMAIL_FOLDER_NAME);
  let body = ''; try { body = msg.getPlainBody(); } catch (e) {}
  if (!body) { try { body = msg.getBody().replace(/<[^>]+>/g, ' '); } catch (e) {} }
  let atts = []; try { atts = msg.getAttachments({ includeInlineImages: false }).map(function(a) { return a.getName(); }); } catch (e) {}
  const stamp = Utilities.formatDate(msg.getDate(), ctx.tz, 'yyyy-MM-dd HHmm');
  const subj = String(msg.getSubject() || '(no subject)');
  const html = '<html><body style="font-family:Arial,sans-serif;font-size:11pt"><p style="color:#666;font-size:9pt">Private copy for Kevin Murty / Estimate Consultants - not part of any client deliverable.</p>' +
    '<table style="font-size:10pt"><tr><td><b>From:</b></td><td>' + escHtml_(msg.getFrom()) + '</td></tr><tr><td><b>To:</b></td><td>' + escHtml_(msg.getTo()) + '</td></tr>' +
    (msg.getCc() ? '<tr><td><b>Cc:</b></td><td>' + escHtml_(msg.getCc()) + '</td></tr>' : '') +
    '<tr><td><b>Date:</b></td><td>' + escHtml_(Utilities.formatDate(msg.getDate(), ctx.tz, 'MMM d, yyyy h:mm a')) + '</td></tr><tr><td><b>Subject:</b></td><td>' + escHtml_(subj) + '</td></tr>' +
    (atts.length ? '<tr><td><b>Attachments:</b></td><td>' + escHtml_(atts.join(', ')) + ' (saved separately)</td></tr>' : '') + '</table><hr>' +
    '<div style="white-space:pre-wrap">' + escHtml_(body.slice(0, 60000)) + '</div></body></html>';
  const who = (senderOf_(msg) === String(Session.getEffectiveUser().getEmail() || '').toLowerCase() ? 'To ' : 'From ') + senderNameOf_(msg).replace(/[\\\/:*?"<>|]/g, '').slice(0, 30);
  let base = stamp + ' - ' + who + ' - ' + subj.replace(/[\\\/:*?"<>|\r\n]/g, ' ').slice(0, 60);
  if (dest.getFilesByName(base + '.pdf').hasNext()) base += ' ' + msg.getId().slice(-4);
  let file;
  try { file = dest.createFile(Utilities.newBlob(html, 'text/html', base + '.html').getAs('application/pdf').setName(base + '.pdf')); }
  catch (e) { file = dest.createFile(base + '.txt', 'From: ' + msg.getFrom() + '\nTo: ' + msg.getTo() + '\nDate: ' + msg.getDate() + '\nSubject: ' + subj + '\n\n' + body, 'text/plain'); }
  ctx.fs.appendRow([new Date(), rowNo, d[0], senderOf_(msg), subj, file.getName(), file.getUrl(), key, 'Emails']);
  ctx.keys[key] = true; ctx.rowsWithFiles[rowNo + '|' + d[0]] = true; ctx.result.emails = (ctx.result.emails || 0) + 1;
  return true;
}
function processMsg_(ctx, msg, d, rowNo, kind, me) {
  const outgoing = senderOf_(msg) === me;
  const copy = saveEmailCopy_(ctx, msg, d, rowNo);
  const nf = []; let n = 0;
  if (!outgoing) n = saveMsgFiles_(ctx, msg, d, rowNo, kind, nf);
  if (!outgoing && (copy || n)) autofillFromMessage_(ctx, msg, d, rowNo, kind, nf);
  return !!(copy || n);
}

function saveMsgFiles_(ctx, msg, d, rowNo, kind, outNew) {
  const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/); if (!m) return 0;
  let root; try { root = DriveApp.getFolderById(m[1]); } catch (e) { return 0; }
  const it = root.getFoldersByName(kind); const dest = it.hasNext() ? it.next() : root.createFolder(kind);
  let n = 0; const newFiles = outNew || [];
  msg.getAttachments({ includeInlineImages: false }).forEach(function(a) {
    const name = a.getName() || 'attachment'; const size = a.getSize(); const ct = String(a.getContentType() || '');
    if (size < FILER_MIN_BYTES && !/pdf|word|excel|sheet/i.test(ct)) return;
    if (/^(image\d{3}|outlook-|logo|signature|~wrd)/i.test(name) && size < 60 * 1024) return;
    const key = msg.getId() + '|' + name + '|' + size;
    if (ctx.keys[key]) return;
    const stamp = Utilities.formatDate(msg.getDate(), ctx.tz, 'yyyy-MM-dd');
    const safe = name.replace(/[\\\/:*?"<>|]/g, '_');
    let fname = stamp + ' - ' + safe;
    if (dest.getFilesByName(fname).hasNext()) fname = stamp + ' - ' + msg.getId().slice(-4) + ' - ' + safe;
    const file = dest.createFile(a.copyBlob().setName(fname));
    newFiles.push({ blob: a.copyBlob(), ct: ct, size: size });
    ctx.fs.appendRow([new Date(), rowNo, d[0], senderOf_(msg), msg.getSubject(), fname, file.getUrl(), key, kind]);
    ctx.keys[key] = true; ctx.rowsWithFiles[rowNo + '|' + d[0]] = true; n++; ctx.result.files.push(d[0] + ': ' + fname);
  });
  return n;
}
function pickTarget_(list, data, txt) {   // several files share this address -> the one the email mentions, else the newest
  if (list.length === 1) return list[0];
  const low = txt.toLowerCase().replace(/\s/g, ''), up = txt.toUpperCase();
  for (let k = list.length - 1; k >= 0; k--) {
    const d = data[list[k].i]; const vin = String(d[16] || '').toUpperCase(); const claim = String(d[9] || '').toLowerCase().replace(/\s/g, '');
    if ((vin.length === 17 && up.indexOf(vin) >= 0) || (claim.length >= 5 && low.indexOf(claim) >= 0)) return list[k];
  }
  return list[list.length - 1];
}
function msgText_(msg) { let b = ''; try { b = msg.getPlainBody().slice(0, 4000); } catch (e) {} return msg.getSubject() + ' ' + b; }

function fileEmailAttachments() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { saved: 0, files: [] };
  const t0 = Date.now(); let ctx = null;
  try {
    const sheet = getMainSheet(); ensureMainWidth_(sheet);
    const last = sheet.getLastRow(); if (last < 2) return { saved: 0, files: [] };
    const data = sheet.getRange(2, 1, last - 1, MAIN_ROW_WIDTH).getValues();
    ctx = filerCtx_(); ctx.deadline = t0 + 270000;
    const label = GmailApp.getUserLabelByName(FILED_LABEL) || GmailApp.createLabel(FILED_LABEL);
    const me = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
    const am = buildAddrMap_(data), addr = am.addr;
    // addresses with no filed files yet get a 30-day look-back (so a new file picks up earlier emails)
    const known = [], fresh = [];
    Object.keys(addr).forEach(function(e) { (addr[e].some(function(t) { return ctx.rowsWithFiles[(t.i + 2) + '|' + data[t.i][0]]; }) ? known : fresh).push(e); });
    [[known, FILER_DAYS], [fresh, FILER_NEW_ADDR_DAYS]].forEach(function(g) {
      const list = g[0], days = g[1], cutoff = new Date(Date.now() - days * 86400000);
      for (let c = 0; c < list.length && Date.now() - t0 < 240000; c += 12) {
        const g12 = list.slice(c, c + 12).join(' OR ');
        GmailApp.search('(from:(' + g12 + ') OR to:(' + g12 + ') OR cc:(' + g12 + ')) newer_than:' + days + 'd', 0, 50).forEach(function(th) {
          let did = false;
          th.getMessages().forEach(function(msg) {
            if (msg.getDate() < cutoff) return;
            const t = addr[partnerOf_(msg, addr, me)]; if (!t) return;
            const tg = pickTarget_(t, data, msgText_(msg));
            if (processMsg_(ctx, msg, data[tg.i], tg.i + 2, tg.kind, me)) did = true;
          });
          if (did) th.addLabel(label);
        });
      }
    });
    // other senders whose email mentions a claim # or VIN on file
    const cutoff3 = new Date(Date.now() - FILER_DAYS * 86400000);
    if (am.ids.length && Date.now() - t0 < 240000) {
      GmailApp.search('newer_than:' + FILER_DAYS + 'd -from:me -category:promotions -category:social -category:forums', 0, 60).forEach(function(th) {
        let did = false;
        th.getMessages().forEach(function(msg) {
          if (msg.getDate() < cutoff3) return;
          const s = senderOf_(msg); if (s === me || addr[s]) return;
          const txt = msgText_(msg), low = txt.toLowerCase().replace(/\s/g, ''), up = txt.toUpperCase();
          for (let k = 0; k < am.ids.length; k++) {
            if ((am.ids[k].vin && up.indexOf(am.ids[k].vin) >= 0) || (am.ids[k].claim && low.indexOf(am.ids[k].claim) >= 0)) { if (processMsg_(ctx, msg, data[am.ids[k].i], am.ids[k].i + 2, 'Insurer Documents', me)) did = true; break; }
          }
        });
        if (did) th.addLabel(label);
      });
    }
    if (Date.now() - t0 < 255000) { try { const rr = scanReceipts(FILER_DAYS); if (rr.saved) ctx.result.receipts = rr.saved; } catch (e) { console.error('scanReceipts: ' + e); } }
    // people who are not in the sheet yet
    if (Date.now() - t0 < 250000) { try { scanNewSenders_(addr, me, data); } catch (e) { console.error('scanNewSenders_: ' + e); } }
    ctx.result.saved = ctx.result.files.length;
    return ctx.result;
  } catch (e) { console.error('fileEmailAttachments: ' + e); return { saved: ctx ? ctx.result.files.length : 0, files: ctx ? ctx.result.files : [], error: String(e) }; }
  finally { lock.releaseLock(); }
}

// =====================================================================
//  BUSINESS RECEIPTS  -  one Drive folder (Year > Month) + a "🧾 Receipts" tab for tax time
//  Gmail receipts / invoices / order confirmations are saved automatically (every 10 minutes with the email filer);
//  paper or phone-photo receipts are added with the menu item. Everything is yours only - never shared or sent.
// =====================================================================
const RECEIPTS_SHEET_NAME = '🧾 Receipts';
const RECEIPTS_ROOT_NAME = 'Estimate Consultants - Business Receipts';
const RECEIPT_CATS_ = ['Advertising & Marketing', 'Software & Subscriptions', 'Website & Domain', 'Vehicle / Fuel / Mileage', 'Office Supplies', 'Postage & Shipping', 'Licenses, Dues & Certifications', 'Insurance', 'Professional Services', 'Phone & Internet', 'Travel & Meals', 'Equipment & Tools', 'Data / Comps / Report Fees', 'Bank & Processing Fees', 'Education & Training', 'Other'];
const RECEIPT_VENDOR_CATS_ = [[/godaddy|namecheap|squarespace|cloudflare|domain|hostgator|github/i, 'Website & Domain'], [/google (workspace|one)|microsoft|adobe|canva|zoom|dropbox|wave|quickbooks|openai|anthropic|slack|notion|apple\.com|icloud/i, 'Software & Subscriptions'], [/usps|ups\b|fedex|stamps\.com|pirate ?ship|certified mail/i, 'Postage & Shipping'], [/shell|exxon|chevron|bp\b|speedway|wawa|sheetz|circle k|racetrac|murphy|fuel/i, 'Vehicle / Fuel / Mileage'], [/staples|office depot|officemax|amazon|walmart|target|best buy/i, 'Office Supplies'], [/facebook|meta|google ads|vistaprint|yelp|nextdoor|moo\.com|printful/i, 'Advertising & Marketing'], [/verizon|at&t|t-mobile|spectrum|comcast|xfinity|mint mobile/i, 'Phone & Internet'], [/ascaa|license|licence|dmv|department of insurance|board/i, 'Licenses, Dues & Certifications'], [/carfax|autocheck|nada|kbb|j\.?d\.? power|cargurus|carmax|manheim|vehicles\.dev|edmunds/i, 'Data / Comps / Report Fees'], [/stripe|paypal|square|bank|merchant/i, 'Bank & Processing Fees'], [/progressive|geico|state farm|hiscox|next insurance|liability/i, 'Insurance']];
function receiptCategory_(text) { for (let i = 0; i < RECEIPT_VENDOR_CATS_.length; i++) if (RECEIPT_VENDOR_CATS_[i][0].test(text)) return RECEIPT_VENDOR_CATS_[i][1]; return 'Other'; }
function receiptAmount_(text) {
  const t = String(text || '').replace(/\r/g, ' ');
  const re = /(?:grand total|total due|amount due|balance due|order total|(?<!sub[\s-]?)total|amount paid|amount charged|total charged|visa|mastercard|master card|amex|debit|credit card)\s*(?:usd)?\s*[:\-]?\s*\$?\s?([\d,]+\.\d{2})\b/gi;
  let m, best = null;
  while ((m = re.exec(t))) { const v = parseFloat(m[1].replace(/,/g, '')); if (best === null || v > best) best = v; }
  if (best !== null) return best;
  const all = []; const r2 = /\$\s?([\d,]+\.\d{2})/g; while ((m = r2.exec(t))) all.push(parseFloat(m[1].replace(/,/g, '')));
  return all.length ? Math.max.apply(null, all) : '';
}
function receiptDate_(text) {
  const t = String(text || ''); let m, y, mo, d;
  const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  if ((m = t.match(/\b(20\d\d)-(\d{2})-(\d{2})\b/))) { y = +m[1]; mo = +m[2]; d = +m[3]; }
  else if ((m = t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4}|\d{2})\b/))) { mo = +m[1]; d = +m[2]; y = +m[3]; if (y < 100) y += 2000; }
  else if ((m = t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d\d)\b/i))) { mo = MON[m[1].toLowerCase()]; d = +m[2]; y = +m[3]; }
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31 || y < 2000 || y > 2100) return '';
  return y + '-' + ('0' + mo).slice(-2) + '-' + ('0' + d).slice(-2);
}
function receiptVendor_(text) {
  const lines = String(text || '').split(/\n/).map(function(x) { return x.trim(); }).filter(function(x) { return x; });
  for (let i = 0; i < Math.min(lines.length, 8); i++) { const l = lines[i]; if (l.length >= 3 && l.length <= 40 && /[A-Za-z]{3,}/.test(l) && !/^(receipt|invoice|order|thank|welcome|tel|phone|www|http|store|date|cashier|\d)/i.test(l)) return l.replace(/\s+/g, ' '); }
  return '';
}
function receiptParse_(text) { const v = receiptVendor_(text); return { vendor: v, date: receiptDate_(text), amount: receiptAmount_(text), category: receiptCategory_(v + ' ' + text.slice(0, 400)) }; }
function receiptsRoot_() {
  const props = PropertiesService.getScriptProperties(); const id = props.getProperty('RECEIPTS_ROOT_ID');
  if (id) { try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) {} }
  const it = DriveApp.getFoldersByName(RECEIPTS_ROOT_NAME); const f = it.hasNext() ? it.next() : DriveApp.createFolder(RECEIPTS_ROOT_NAME);
  props.setProperty('RECEIPTS_ROOT_ID', f.getId()); return f;
}
function receiptMonthFolder_(date) {
  const tz = Session.getScriptTimeZone(); const root = receiptsRoot_();
  const sub = function(parent, name) { const it = parent.getFoldersByName(name); return it.hasNext() ? it.next() : parent.createFolder(name); };
  return sub(sub(root, Utilities.formatDate(date, tz, 'yyyy')), Utilities.formatDate(date, tz, 'yyyy-MM MMM'));
}
function receiptsSheet_() {
  const ss = getWorkingSpreadsheet(); let sh = ss.getSheetByName(RECEIPTS_SHEET_NAME);
  if (sh) {
    if (String(sh.getRange(1, 6).getValue()) === 'Notes') {      // older layout: add "Paid by" and "Reimburse?" after "Business?"
      sh.insertColumnsAfter(5, 2);
      sh.getRange(1, 6, 1, 2).setValues([['Paid by', 'Reimburse? ☑']]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
      sh.getRange(2, 7, 2000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
      sh.setColumnWidth(6, 110); sh.setColumnWidth(7, 90);
    }
    return sh;
  }
  sh = ss.insertSheet(RECEIPTS_SHEET_NAME);
  const hdr = ['Date', 'Vendor', 'Amount', 'Category ▾', 'Business? ☑', 'Paid by', 'Reimburse? ☑', 'Notes', 'Receipt file', 'Source', 'Key'];
  sh.getRange(1, 1, 1, hdr.length).setValues([hdr]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
  sh.setFrozenRows(1); sh.setRowHeight(1, 36); sh.setTabColor('#16a34a');
  [95, 200, 90, 210, 80, 110, 90, 240, 260, 260, 60].forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
  sh.hideColumns(11);
  sh.getRange(2, 1, 2000, 1).setNumberFormat('MM/dd/yyyy');
  sh.getRange(2, 3, 2000, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 4, 2000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(RECEIPT_CATS_, true).setAllowInvalid(true).build());
  sh.getRange(2, 5, 2000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  sh.getRange(2, 7, 2000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  // tax-time summary (business items only), by category, for the year in M1
  sh.getRange('M1').setValue(new Date().getFullYear()).setFontWeight('bold').setBackground('#dcfce7');
  sh.getRange('L1').setValue('Tax year ▸').setFontWeight('bold').setHorizontalAlignment('right');
  sh.getRange('L2:M2').setValues([['Category', 'Total (business only)']]).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
  const rows = RECEIPT_CATS_.map(function(c, i) { const r = i + 3; return [c, '=SUMIFS($C$2:$C$2001,$D$2:$D$2001,L' + r + ',$E$2:$E$2001,TRUE,$A$2:$A$2001,">="&DATE($M$1,1,1),$A$2:$A$2001,"<="&DATE($M$1,12,31))']; });
  sh.getRange(3, 12, rows.length, 2).setValues(rows);
  sh.getRange(3, 13, rows.length, 1).setNumberFormat('$#,##0.00');
  const tr = 3 + rows.length;
  sh.getRange(tr, 12, 1, 2).setValues([['TOTAL', '=SUM(M3:M' + (tr - 1) + ')']]).setFontWeight('bold').setBackground('#f1f5f9');
  sh.getRange(tr + 1, 12, 1, 2).setValues([['Owed back to employees (Reimburse ☑)', '=SUMIFS($C$2:$C$2001,$G$2:$G$2001,TRUE,$A$2:$A$2001,">="&DATE($M$1,1,1),$A$2:$A$2001,"<="&DATE($M$1,12,31))']]).setFontWeight('bold');
  sh.getRange(tr, 13, 2, 1).setNumberFormat('$#,##0.00');
  sh.setColumnWidth(12, 240); sh.setColumnWidth(13, 140);
  return sh;
}
function receiptsNextRow_(sh) {
  const vals = sh.getRange(2, 1, Math.max(1, sh.getMaxRows() - 1), 1).getValues(); let last = 1;
  for (let i = 0; i < vals.length; i++) if (vals[i][0] !== '' && vals[i][0] !== null) last = i + 2;
  return last + 1;
}
function addReceiptRow_(sh, date, vendor, amount, cat, notes, file, source, key, paidBy, reimburse) {
  const r = receiptsNextRow_(sh);
  if (r > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 200);
  sh.getRange(r, 1, 1, 11).setValues([[date, vendor, amount, cat, true, paidBy || 'Owner', !!reimburse, notes || '', file ? '=HYPERLINK("' + file.getUrl() + '","' + String(file.getName()).replace(/"/g, '') + '")' : '', source || '', key || '']]);
  sh.getRange(r, 1).setNumberFormat('MM/dd/yyyy'); sh.getRange(r, 3).setNumberFormat('$#,##0.00');
  sh.getRange(r, 4).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(RECEIPT_CATS_, true).setAllowInvalid(true).build());
  sh.getRange(r, 5).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  sh.getRange(r, 7).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  return r;
}
// Pulls any receipts that were stranded lower down (below the summary block) back up under the header.
function compactReceipts_(sh) {
  const mr = sh.getMaxRows(); if (mr < 3) return 0;
  const rng = sh.getRange(2, 1, mr - 1, 11); const v = rng.getValues(), f = rng.getFormulas();
  const keep = []; let firstBlank = -1, anyAfter = false;
  for (let i = 0; i < v.length; i++) {
    const has = v[i][0] !== '' || v[i][1] !== '';
    if (has) { keep.push(v[i].map(function(x, j) { return f[i][j] || x; })); if (firstBlank >= 0) anyAfter = true; }
    else if (firstBlank < 0) firstBlank = i;
  }
  if (!anyAfter || !keep.length) return 0;
  rng.clearContent();
  sh.getRange(2, 1, keep.length, 11).setValues(keep);
  sh.getRange(2, 1, keep.length, 1).setNumberFormat('MM/dd/yyyy'); sh.getRange(2, 3, keep.length, 1).setNumberFormat('$#,##0.00');
  sh.getRange(2, 4, keep.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(RECEIPT_CATS_, true).setAllowInvalid(true).build());
  sh.getRange(2, 5, keep.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  sh.getRange(2, 7, keep.length, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  return keep.length;
}
function goToReceipts() { const sh = receiptsSheet_(); try { compactReceipts_(sh); } catch (e) {} getWorkingSpreadsheet().setActiveSheet(sh); }
function openReceiptsFolder() {
  const f = receiptsRoot_();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<p style="font-family:Arial">Your receipts folder: <a target="_blank" href="' + f.getUrl() + '">' + f.getName() + '</a></p>').setWidth(420).setHeight(90), '🧾 Receipts folder');
}
const RECEIPT_QUERY_ = 'subject:(receipt OR "order confirmation" OR "your order" OR invoice OR "payment confirmation" OR "payment receipt" OR "thank you for your purchase" OR "billing statement" OR "subscription" OR "renewal" OR "your payment") -from:me -category:promotions -category:social -category:forums';
const RECEIPT_SKIP_RE_ = /payment (?:received|from)|you(?:'ve| have)? (?:been )?paid|invoice (?:was )?paid by|has paid your invoice|deposit/i;
function scanReceipts(days, silent) {
  days = days || 3;
  const sh = receiptsSheet_(); const tz = Session.getScriptTimeZone();
  try { compactReceipts_(sh); } catch (e) {}
  const keys = {}; const lr = sh.getLastRow(); if (lr > 1) sh.getRange(2, 11, lr - 1, 1).getValues().forEach(function(r) { keys[String(r[0])] = true; });
  const clientAddr = {};
  try { const data = getMainSheet().getRange(2, 1, Math.max(1, getMainSheet().getLastRow() - 1), MAIN_ROW_WIDTH).getValues(); data.forEach(function(d) { emailsIn_(d[4]).concat(emailsIn_(d[12]), emailsIn_(d[COL_EXTRA_EMAILS - 1]), emailsIn_(d[COL_CARRIER_APPRAISER_EMAIL - 1])).forEach(function(e) { clientAddr[e] = true; }); }); } catch (e) {}
  const me = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  const label = GmailApp.getUserLabelByName('Receipt filed') || GmailApp.createLabel('Receipt filed');
  let n = 0; const t0 = Date.now(); const added = [];
  GmailApp.search(RECEIPT_QUERY_ + ' newer_than:' + days + 'd -label:"Receipt filed"', 0, 60).forEach(function(th) {
    th.getMessages().forEach(function(msg) {
      if (Date.now() - t0 > 240000) return;
      const key = msg.getId(); if (keys[key]) return;
      const s = senderOf_(msg); if (!s || s === me || clientAddr[s]) return;
      const subj = String(msg.getSubject() || ''); let body = ''; try { body = msg.getPlainBody(); } catch (e) {}
      if (RECEIPT_SKIP_RE_.test(subj + ' ' + body.slice(0, 600))) return;
      const date = msg.getDate(); const folder = receiptMonthFolder_(date);
      const vendor = senderNameOf_(msg) || s; const amt = receiptAmount_(subj + ' ' + body);
      const stamp = Utilities.formatDate(date, tz, 'yyyy-MM-dd');
      const html = '<html><body style="font-family:Arial,sans-serif;font-size:11pt"><p style="color:#666;font-size:9pt">Receipt copy saved for Estimate Consultants business records.</p><table style="font-size:10pt"><tr><td><b>From:</b></td><td>' + escHtml_(msg.getFrom()) + '</td></tr><tr><td><b>Date:</b></td><td>' + escHtml_(Utilities.formatDate(date, tz, 'MMM d, yyyy h:mm a')) + '</td></tr><tr><td><b>Subject:</b></td><td>' + escHtml_(subj) + '</td></tr></table><hr><div style="white-space:pre-wrap">' + escHtml_(body.slice(0, 30000)) + '</div></body></html>';
      const base = (stamp + ' - ' + vendor.replace(/[\\\/:*?"<>|\r\n]/g, '').slice(0, 30) + ' - ' + subj.replace(/[\\\/:*?"<>|\r\n]/g, ' ').slice(0, 50)).trim();
      let file; try { file = folder.createFile(Utilities.newBlob(html, 'text/html', base + '.html').getAs('application/pdf').setName(base + '.pdf')); } catch (e) { file = folder.createFile(base + '.txt', body, 'text/plain'); }
      try { msg.getAttachments({ includeInlineImages: false }).forEach(function(a) { if (a.getSize() >= 8000 && /pdf|image\//i.test(a.getContentType())) folder.createFile(a.copyBlob().setName(stamp + ' - ' + vendor.replace(/[\\\/:*?"<>|]/g, '').slice(0, 20) + ' - ' + a.getName())); }); } catch (e) {}
      addReceiptRow_(sh, date, vendor, amt, receiptCategory_(vendor + ' ' + s + ' ' + subj), '', file, 'Email: ' + subj.slice(0, 80), key);
      keys[key] = true; n++; added.push(vendor + (amt !== '' ? ' $' + amt : ''));
      th.addLabel(label);
    });
  });
  return { saved: n, items: added };
}
function scanReceiptsNow() {
  const ui = SpreadsheetApp.getUi();
  const r = scanReceipts(60);
  ui.alert(r.saved ? 'Saved ' + r.saved + ' receipt(s) to your Receipts folder and tab:\n\n' + r.items.join('\n') + '\n\nOpen the 🧾 Receipts tab to set the category or untick "Business?" for any personal ones.' : 'No new receipts found in the last 60 days.');
}
function showAddReceiptForm() {
  const cats = RECEIPT_CATS_.map(function(c) { return '<option>' + c + '</option>'; }).join('');
  const html = HtmlService.createHtmlOutput('<!DOCTYPE html><html><head><base target="_top"><style>body{font-family:Arial,sans-serif;font-size:13px;margin:14px}label{display:block;font-weight:bold;margin:9px 0 3px;font-size:12px}input,select{width:100%;padding:7px;box-sizing:border-box;border:1px solid #bbb;border-radius:4px}button{margin-top:14px;padding:9px 16px;background:#16a34a;color:#fff;border:0;border-radius:4px;font-size:14px}#m{margin-top:10px}</style></head><body><h3>🧾 Add a receipt</h3>' +
    '<label>Photo or PDF of the receipt</label><input type="file" id="f" accept="image/*,application/pdf">' +
    '<label>Date</label><input type="date" id="d"><label>Vendor</label><input id="v"><label>Amount ($)</label><input id="a" inputmode="decimal"><label>Category</label><select id="c">' + cats + '</select><label>Notes (optional)</label><input id="n">' +
    '<button onclick="go()">Save receipt</button><div id="m"></div><script>document.getElementById("d").valueAsDate=new Date();var vc=' + JSON.stringify(RECEIPT_VENDOR_CATS_.map(function(x) { return [x[0].source, x[1]]; })) + ';document.getElementById("v").addEventListener("blur",function(){var t=this.value;for(var i=0;i<vc.length;i++){if(new RegExp(vc[i][0],"i").test(t)){document.getElementById("c").value=vc[i][1];break}}});' +
    'function go(){var f=document.getElementById("f").files[0];if(!f){document.getElementById("m").textContent="Choose the receipt photo or PDF first.";return}var r=new FileReader();r.onload=function(){document.getElementById("m").textContent="Saving…";google.script.run.withSuccessHandler(function(){document.getElementById("m").textContent="✓ Saved. Add another or close this window.";document.getElementById("f").value="";document.getElementById("v").value="";document.getElementById("a").value="";document.getElementById("n").value=""}).withFailureHandler(function(e){document.getElementById("m").textContent="Error: "+e.message}).saveReceiptManual({data:r.result,name:f.name,date:document.getElementById("d").value,vendor:document.getElementById("v").value,amount:document.getElementById("a").value,cat:document.getElementById("c").value,notes:document.getElementById("n").value})};r.readAsDataURL(f)}</script></body></html>').setWidth(420).setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html, '🧾 Add a receipt');
}
function saveReceiptManual(o) {
  const mm = String(o.data || '').match(/^data:([^;]+);base64,(.*)$/); if (!mm) throw new Error('No file received.');
  const p = String(o.date || '').split('-'); const date = p.length === 3 ? new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10)) : new Date();
  const tz = Session.getScriptTimeZone(); const vendor = String(o.vendor || '').trim() || 'Receipt';
  const folder = receiptMonthFolder_(date);
  const ext = mm[1] === 'application/pdf' ? '.pdf' : (/png/.test(mm[1]) ? '.png' : '.jpg');
  const fname = Utilities.formatDate(date, tz, 'yyyy-MM-dd') + ' - ' + vendor.replace(/[\\\/:*?"<>|]/g, '').slice(0, 30) + ext;
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(mm[2]), mm[1], fname));
  const amt = parseFloat(String(o.amount || '').replace(/[^0-9.]/g, ''));
  addReceiptRow_(receiptsSheet_(), date, vendor, isNaN(amt) ? '' : amt, o.cat || receiptCategory_(vendor), o.notes, file, 'Added by hand', '');
  return true;
}


// =====================================================================
//  EXPENSE APP  (phone web page: estimateconsultants.com/expenses.html)
//  Snap a receipt -> the photo is read automatically -> fix/add anything -> Submit -> it lands in the 🧾 Receipts tab.
//  Logins live in the "👥 App Logins" tab (owner + employees). Employees can only add receipts and see their own.
// =====================================================================
const LOGIN_SHEET_NAME = '👥 App Logins';
function expSecret_() { const p = PropertiesService.getScriptProperties(); let k = p.getProperty('PROCEED_SECRET'); if (!k) { k = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('PROCEED_SECRET', k); } return k; }
function expSig_(txt) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(txt, expSecret_())).replace(/=+$/, ''); }
function pinHash_(name, pin) { return expSig_('pin:' + String(name).trim().toLowerCase() + ':' + String(pin).trim()); }
function loginSheet_() {
  const ss = getWorkingSpreadsheet(); let sh = ss.getSheetByName(LOGIN_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(LOGIN_SHEET_NAME);
    sh.getRange(1, 1, 1, 6).setValues([['Name', 'PIN (scrambled)', 'Role', 'Active ☑', 'Added', 'Last login']]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
    sh.setFrozenRows(1); sh.setTabColor('#7c3aed');
    [160, 260, 100, 80, 110, 150].forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
    sh.getRange(2, 3, 200, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Owner', 'Employee'], true).build());
    sh.getRange(2, 4, 200, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  }
  return sh;
}
function addAppLogin() {
  const ui = SpreadsheetApp.getUi();
  const n = ui.prompt('Add or reset an app login', 'Person\'s name (exactly as they will type it on the login screen):', ui.ButtonSet.OK_CANCEL);
  if (n.getSelectedButton() !== ui.Button.OK || !n.getResponseText().trim()) return;
  const name = n.getResponseText().trim();
  const p = ui.prompt('PIN for ' + name, 'Choose a PIN of 4 to 8 digits. Tell it to them privately; it is stored scrambled and cannot be read back.', ui.ButtonSet.OK_CANCEL);
  if (p.getSelectedButton() !== ui.Button.OK) return;
  const pin = p.getResponseText().trim(); if (!/^\d{4,8}$/.test(pin)) return ui.alert('The PIN must be 4 to 8 digits.');
  const r = ui.alert('Role', 'Is ' + name + ' an EMPLOYEE?\n\nYes = employee (adds receipts, sees only their own)\nNo = owner (sees everything)', ui.ButtonSet.YES_NO);
  const role = r === ui.Button.YES ? 'Employee' : 'Owner';
  const sh = loginSheet_(); const lr = sh.getLastRow(); let row = 0;
  if (lr > 1) sh.getRange(2, 1, lr - 1, 1).getValues().forEach(function(x, i) { if (String(x[0]).trim().toLowerCase() === name.toLowerCase()) row = i + 2; });
  const vals = [name, pinHash_(name, pin), role, true, new Date(), ''];
  if (row) { sh.getRange(row, 1, 1, 4).setValues([vals.slice(0, 4)]); } else { sh.appendRow(vals); }
  ui.alert((row ? 'Updated ' : 'Added ') + name + ' as ' + role + '.\n\nThey sign in at your Expenses page with that name and PIN.\nTo turn someone off, untick Active in the 👥 App Logins tab.');
}
function goToAppLogins() { getWorkingSpreadsheet().setActiveSheet(loginSheet_()); }
function expLoginFind_(name) {
  const sh = loginSheet_(); const lr = sh.getLastRow(); if (lr < 2) return null;
  const rows = sh.getRange(2, 1, lr - 1, 4).getValues();
  for (let i = 0; i < rows.length; i++) if (String(rows[i][0]).trim().toLowerCase() === String(name).trim().toLowerCase()) return { row: i + 2, name: String(rows[i][0]).trim(), hash: String(rows[i][1]), role: String(rows[i][2]) || 'Employee', active: rows[i][3] === true };
  return null;
}
function expToken_(name, role) { const exp = Date.now() + 30 * 86400000; const pl = Utilities.base64EncodeWebSafe(name + '|' + role + '|' + exp); return pl + '.' + expSig_('tok:' + pl); }
function expVerify_(token) {
  const parts = String(token || '').split('.'); if (parts.length !== 2 || expSig_('tok:' + parts[0]) !== parts[1]) throw new Error('Please sign in again.');
  const pl = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString().split('|');
  if (Number(pl[2]) < Date.now()) throw new Error('Please sign in again.');
  const u = expLoginFind_(pl[0]); if (!u || !u.active) throw new Error('This login is turned off.');
  return { name: u.name, role: u.role };
}
function expNames_() {
  const sh = loginSheet_(); const lr = sh.getLastRow(); const names = [];
  if (lr > 1) sh.getRange(2, 1, lr - 1, 4).getValues().forEach(function(r) { if (String(r[0]).trim() && r[3] === true) names.push(String(r[0]).trim()); });
  return { names: names.sort() };
}
function expLogin_(d) {
  const cache = CacheService.getScriptCache(); const k = 'explog:' + String(d.name || '').trim().toLowerCase();
  const fails = parseInt(cache.get(k) || '0', 10); if (fails >= 6) throw new Error('Too many tries. Wait 15 minutes and try again.');
  const u = expLoginFind_(d.name);
  if (!u || !u.active || u.hash !== pinHash_(u.name, d.pin)) { cache.put(k, String(fails + 1), 900); throw new Error('Name or PIN not recognized.'); }
  cache.remove(k);
  try { loginSheet_().getRange(u.row, 6).setValue(new Date()); } catch (e) {}
  return { token: expToken_(u.name, u.role), name: u.name, role: u.role, cats: RECEIPT_CATS_ };
}
function expOcr_(d) {
  const who = expVerify_(d.token);
  const mm = String(d.image || '').match(/^data:([^;]+);base64,(.*)$/); if (!mm) throw new Error('No photo received.');
  if (mm[2].length > 12000000) throw new Error('That photo is too large - try again.');
  const text = ocrText_(Utilities.newBlob(Utilities.base64Decode(mm[2]), mm[1], 'receipt'));
  const p = receiptParse_(text); p.read = !!text; return p;
}
function expSubmit_(d) {
  const who = expVerify_(d.token);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const dp = String(d.date || '').split('-');
    const date = dp.length === 3 ? new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10)) : new Date();
    const vendor = String(d.vendor || '').trim().slice(0, 80) || 'Receipt';
    const amt = parseFloat(String(d.amount || '').replace(/[^0-9.]/g, ''));
    const sh = receiptsSheet_(); const key = 'app:' + String(d.id || Utilities.getUuid());
    const lr = sh.getLastRow(); if (lr > 1) { const ks = sh.getRange(2, 11, lr - 1, 1).getValues(); for (let i = 0; i < ks.length; i++) if (ks[i][0] === key) return { ok: true, dup: true }; }
    let file = null;
    const mm = String(d.image || '').match(/^data:([^;]+);base64,(.*)$/);
    if (mm) {
      const ext = mm[1] === 'application/pdf' ? '.pdf' : (/png/.test(mm[1]) ? '.png' : '.jpg');
      const fname = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd') + ' - ' + vendor.replace(/[\\\/:*?"<>|]/g, '').slice(0, 30) + ' - ' + who.name.replace(/[\\\/:*?"<>|]/g, '') + ext;
      file = receiptMonthFolder_(date).createFile(Utilities.newBlob(Utilities.base64Decode(mm[2]), mm[1], fname));
    }
    const cat = RECEIPT_CATS_.indexOf(d.category) >= 0 ? d.category : receiptCategory_(vendor);
    addReceiptRow_(sh, date, vendor, isNaN(amt) ? '' : amt, cat, String(d.notes || '').slice(0, 300), file, 'App - ' + who.name, key, who.name, !!d.reimburse);
    const rr = sh.getLastRow(); if (d.business === false) sh.getRange(rr, 5).setValue(false);
    return { ok: true };
  } finally { lock.releaseLock(); }
}
function expList_(d) {
  const who = expVerify_(d.token); const sh = receiptsSheet_(); const lr = sh.getLastRow(); const out = [];
  if (lr < 2) return { items: out };
  const tz = Session.getScriptTimeZone();
  sh.getRange(Math.max(2, lr - 59), 1, Math.min(60, lr - 1), 8).getValues().reverse().forEach(function(r) {
    if (who.role !== 'Owner' && String(r[5]) !== who.name) return;
    if (out.length >= 15) return;
    out.push({ date: r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'MM/dd/yyyy') : String(r[0]), vendor: r[1], amount: r[2], category: r[3], by: r[5], reimburse: r[6] === true });
  });
  return { items: out };
}
function expHandle_(data) {
  let res;
  try {
    if (data.action === 'exp_names') res = expNames_();
    else if (data.action === 'exp_login') res = expLogin_(data);
    else if (data.action === 'exp_ocr') res = expOcr_(data);
    else if (data.action === 'exp_submit') res = expSubmit_(data);
    else if (data.action === 'exp_list') res = expList_(data);
    else res = { error: 'Unknown request.' };
  } catch (err) { res = { error: String(err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function fileEmailAttachmentsNow() {
  const r = fileEmailAttachments();
  SpreadsheetApp.getUi().alert(r.error ? 'Problem: ' + r.error : (r.saved ? 'Filed ' + r.saved + ' attachment(s):\n\n' + r.files.join('\n') : 'No new attachments to file.') + (r.receipts ? '\n\nSaved ' + r.receipts + ' business receipt(s) to the 🧾 Receipts tab.' : '') + (r.emails ? '\n\nSaved ' + r.emails + ' email(s) to the clients\' "' + EMAIL_FOLDER_NAME + '" folders.' : '') + (r.filled && r.filled.length ? '\n\nAuto-filled (please verify):\n' + r.filled.join('\n') : '') + '\n\nAny emails from people who are not in the sheet yet are on the 📬 New Emails tab.');
}

// Panel: pull emails from a specific address into this file, back as far as you like.
function fileEmailsForRow(row, addrsText, days, kind, remember) {
  row = parseInt(row, 10);
  const addrs = emailsIn_(addrsText); if (!addrs.length) throw new Error('Enter an email address.');
  days = Math.max(1, Math.min(730, parseInt(days, 10) || 30));
  kind = kind === 'Insurer Documents' ? 'Insurer Documents' : 'Client Uploads';
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const d = sheet.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  if (!/folders\//.test(String(d[27] || ''))) throw new Error('This file has no folder yet - it is built automatically once the Type is chosen.');
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const ctx = filerCtx_(); ctx.deadline = Date.now() + 300000; const cutoff = new Date(Date.now() - days * 86400000);
    const label = GmailApp.getUserLabelByName(FILED_LABEL) || GmailApp.createLabel(FILED_LABEL);
    const ag = addrs.join(' OR ');
    GmailApp.search('(from:(' + ag + ') OR to:(' + ag + ') OR cc:(' + ag + ')) newer_than:' + days + 'd', 0, 100).forEach(function(th) {
      let did = false;
      const me2 = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
      th.getMessages().forEach(function(msg) { if (msg.getDate() < cutoff) return; if (!partiesOf_(msg).some(function(p) { return addrs.indexOf(p) >= 0; })) return; if (processMsg_(ctx, msg, d, row, kind, me2)) did = true; });
      if (did) th.addLabel(label);
    });
    if (remember && kind === 'Client Uploads') {
      const cur = emailsIn_(d[COL_EXTRA_EMAILS - 1]).concat(emailsIn_(d[4]));
      const add = addrs.filter(function(a) { return cur.indexOf(a) < 0; });
      if (add.length) sheet.getRange(row, COL_EXTRA_EMAILS).setValue(emailsIn_(d[COL_EXTRA_EMAILS - 1]).concat(add).join(', '));
    }
    return { saved: ctx.result.files.length, files: ctx.result.files };
  } finally { lock.releaseLock(); }
}

function getReceivedFiles(row) {
  row = parseInt(row, 10);
  const sh = getWorkingSpreadsheet().getSheetByName(FILED_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  const name = String(getMainSheet().getRange(row, 1).getValue() || '');
  const tz = Session.getScriptTimeZone();
  return sh.getRange(2, 1, sh.getLastRow() - 1, 9).getValues()
    .filter(function(r) { return parseInt(r[1], 10) === row && String(r[2]) === name && r[8] !== 'Emails'; })
    .slice(-20).reverse()
    .map(function(r) { return { when: Utilities.formatDate(new Date(r[0]), tz, 'MM/dd/yyyy'), file: r[5], url: r[6], from: r[3], kind: r[8] }; });
}
function filedSince_(hours) {
  const sh = getWorkingSpreadsheet().getSheetByName(FILED_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  const cut = Date.now() - hours * 3600000; const by = {};
  sh.getRange(2, 1, sh.getLastRow() - 1, 9).getValues().forEach(function(r) { if (r[8] !== 'Emails' && new Date(r[0]).getTime() >= cut) by[r[2]] = (by[r[2]] || 0) + 1; });
  return Object.keys(by).map(function(k) { return k + ': ' + by[k] + ' file' + (by[k] === 1 ? '' : 's'); });
}

// ---------------- People who are not in the sheet yet ----------------
const NEWMAIL_COLS = ['Received', 'From', 'Email', 'Subject', 'Files', 'Preview', 'Create client file ☐', 'OR add this address to an existing file ▾', 'Ignore ☐', 'Status', 'Key'];
function newMailSheet_() {
  const ss = getWorkingSpreadsheet();
  let sh = ss.getSheetByName(NEWMAIL_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(NEWMAIL_SHEET_NAME);
    sh.getRange(1, 1, 1, NEWMAIL_COLS.length).setValues([NEWMAIL_COLS]).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold').setWrap(true).setVerticalAlignment('middle');
    sh.setFrozenRows(1); sh.setRowHeight(1, 42); sh.setTabColor('#f59e0b');
    [105, 150, 190, 260, 50, 300, 110, 220, 70, 190, 60].forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
    sh.hideColumns(11);
  }
  return sh;
}
function scanNewSenders_(addr, me, data) {
  const sh = newMailSheet_(); const lr = sh.getLastRow();
  const keys = {}, ignored = {};
  if (lr > 1) sh.getRange(2, 1, lr - 1, 11).getValues().forEach(function(r) { keys[String(r[10])] = true; if (/^Ignored/.test(String(r[9]))) ignored[String(r[2]).toLowerCase()] = true; });
  const names = [];
  data.forEach(function(d, i) { if (d[0] && !/^Closed/.test(String(d[29] || ''))) names.push(String(d[0]).trim() + ' (row ' + (i + 2) + ')'); });
  const rule = names.length ? SpreadsheetApp.newDataValidation().requireValueInList(names, true).setAllowInvalid(false).build() : null;
  const cutoff = new Date(Date.now() - FILER_DAYS * 86400000); const tz = Session.getScriptTimeZone();
  let added = 0;
  GmailApp.search('in:inbox newer_than:' + FILER_DAYS + 'd -from:me -category:promotions -category:social -category:forums', 0, 60).forEach(function(th) {
    th.getMessages().forEach(function(msg) {
      if (added >= 15 || msg.getDate() < cutoff) return;
      const s = senderOf_(msg); const key = msg.getId();
      if (!s || s === me || addr[s] || ignored[s] || keys[key] || NEWMAIL_JUNK_RE.test(s)) return;
      const atts = msg.getAttachments({ includeInlineImages: false }).filter(function(a) { return a.getSize() >= FILER_MIN_BYTES; });
      const txt = msgText_(msg) + ' ' + atts.map(function(a) { return a.getName(); }).join(' ');
      if (!NEWMAIL_KEYWORDS_RE.test(txt)) return;
      let preview = ''; try { preview = msg.getPlainBody().replace(/\s+/g, ' ').slice(0, 220); } catch (e) {}
      sh.appendRow([Utilities.formatDate(msg.getDate(), tz, 'MM/dd/yyyy'), senderNameOf_(msg), s, msg.getSubject(), atts.length, preview, false, '', false, '', key]);
      const r = sh.getLastRow();
      sh.getRange(r, 7).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
      sh.getRange(r, 9).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
      if (rule) sh.getRange(r, 8).setDataValidation(rule);
      sh.getRange(r, 1, 1, 11).setVerticalAlignment('middle').setWrap(true);
      keys[key] = true; added++;
    });
  });
}
function newMailPending_() {
  const sh = getWorkingSpreadsheet().getSheetByName(NEWMAIL_SHEET_NAME);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 11).getValues().filter(function(r) { return !String(r[9]).trim(); })
    .map(function(r) { return (r[1] || r[2]) + ' <' + r[2] + '> - ' + r[3]; });
}
function goToNewEmails() {
  try { fileEmailAttachments(); } catch (e) {}
  const sh = newMailSheet_(); getWorkingSpreadsheet().setActiveSheet(sh);
  getWorkingSpreadsheet().toast(newMailPending_().length + ' email(s) waiting. Tick "Create client file" or pick an existing file.', '📬 New Emails', 6);
}
function createClientFromEmail_(email, display, subject) {
  const sheet = getMainSheet(); ensureMainWidth_(sheet);
  const row = sheet.getLastRow() + 1; const now = new Date();
  let name = String(display || '').replace(/["']/g, '').trim();
  if (!name) name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  sheet.getRange(row, 1).setValue(name);
  sheet.getRange(row, 5).setValue(email);
  sheet.getRange(row, 30).setValue('Manual Entry - New');
  sheet.getRange(row, 31).setValue('EC-' + Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy') + '-' + String(row).padStart(4, '0'));
  sheet.getRange(row, 90).setValue('Email');
  sheet.getRange(row, 91).setValue(now).setNumberFormat('MM/dd/yyyy h:mm:ss AM/PM');
  sheet.getRange(row, 93).setValue(Utilities.getUuid());
  sheet.getRange(row, 94).setValue(Utilities.formatDate(now, Session.getScriptTimeZone(), 'MM/dd/yyyy') + ' — File created from an email: "' + String(subject || '').slice(0, 80) + '"');
  return row;
}
// Edits on the New Emails tab (sheet-only work, so it is safe inside the simple onEdit trigger).
function newMailEdit_(e, sh) {
  const r = e.range.getRow(), c = e.range.getColumn();
  if (r < 2 || ![7, 8, 9].includes(c) || e.range.getNumRows() > 1) return;
  const v = sh.getRange(r, 1, 1, 11).getValues()[0];
  if (String(v[9]).trim()) return;
  const email = String(v[2]).toLowerCase(), grey = function(msg) { sh.getRange(r, 10).setValue(msg); sh.getRange(r, 1, 1, 11).setFontColor('#94a3b8'); };
  if (c === 7 && e.range.getValue() === true) {
    const row = createClientFromEmail_(email, v[1], v[3]);
    grey('Created file - row ' + row + ' (open it in Active Files and pick the Type)');
    getWorkingSpreadsheet().toast('Created a new file for ' + (v[1] || email) + '. Pick the Type in the File Panel; their emails are filed automatically.', '📬 New Emails', 8);
  } else if (c === 8 && String(e.range.getValue()).trim()) {
    const m = String(e.range.getValue()).match(/\(row (\d+)\)\s*$/); if (!m) return;
    const row = parseInt(m[1], 10), main = getMainSheet(); ensureMainWidth_(main);
    const cell = main.getRange(row, COL_EXTRA_EMAILS); const cur = emailsIn_(cell.getValue());
    if (cur.indexOf(email) < 0) cell.setValue(cur.concat(email).join(', '));
    grey('Added to row ' + row + ' - attachments are filed within 10 minutes');
    getWorkingSpreadsheet().toast(email + ' added to that file.', '📬 New Emails', 6);
  } else if (c === 9 && e.range.getValue() === true) {
    grey('Ignored');
  }
}

// =====================================================================
//  ⚡ ACTIONS TAB (file panel). One list of everything you can do on a file, each with a plain-English
//  explanation, and a REVIEW BOX (to / CC / subject / message / attachments / invoice) before anything is sent.
// =====================================================================
const STATUS_CHOICES_ = ['Manual Entry - New', 'Folders & Docs Created', 'Initial Auth Link Sent', 'Auth Signed ✅', 'Invoice Sent, Awaiting Payment ⏳', 'Paid in Full ✅', 'Paid & Final PDF Delivered ✅', 'Report Delivered - Awaiting Client OK ⏳', 'Client OK to Proceed ✅', 'Client Declined to Proceed ❌', 'Demand Emailed to Adjuster ✅ (certified mail pending)', 'Demand Emailed + Certified Mail Sent ✅', 'Award Sent for Carrier Appraiser Signature ⏳', 'Award Signed ✅ - Letter Delivered', 'Closed'];

function getDeliveryEdits_(row) { try { const v = PropertiesService.getScriptProperties().getProperty('DLV_' + row); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function setDeliveryEdits_(row, e) { try { PropertiesService.getScriptProperties().setProperty('DLV_' + row, JSON.stringify(e)); } catch (x) {} }
function clearDeliveryEdits_(row) { try { if (row) PropertiesService.getScriptProperties().deleteProperty('DLV_' + row); } catch (x) {} }
function textToHtml_(t) {
  return '<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.5;max-width:640px">' +
    escHtml_(String(t || '')).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>').replace(/\n/g, '<br>') + '</div>';
}
function waveRecentInvoiceNumber_() {
  try {
    const bizId = waveBusinessId_();
    const q = 'query ($b: ID!, $p: Int!) { business(id: $b) { invoices(page: $p, pageSize: 50) { pageInfo { totalPages } edges { node { invoiceNumber } } } } }';
    const j1 = waveGql_(q, { b: bizId, p: 1 }); const inv = j1.data.business.invoices;
    let nums = inv.edges.map(function(e) { return e.node.invoiceNumber; });
    const tp = inv.pageInfo.totalPages;
    if (tp > 1) { const j2 = waveGql_(q, { b: bizId, p: tp }); nums = nums.concat(j2.data.business.invoices.edges.map(function(e) { return e.node.invoiceNumber; })); }
    const n = nums.map(function(x) { return parseInt(String(x).replace(/\D/g, ''), 10); }).filter(function(x) { return x > 0; });
    return n.length ? Math.max.apply(null, n) : '';
  } catch (e) { return ''; }
}

// The demand / notice letter document (Google Doc) for a row, or null.
function demandLetterFile_(docUrlsCell) {
  const urls = String(docUrlsCell || '').split(/\r?\n/);
  for (let i = 0; i < urls.length; i++) {
    const m = urls[i].match(/\/d\/([a-zA-Z0-9-_]+)/); if (!m) continue;
    try { const f = DriveApp.getFileById(m[1]); if (/demand|notice/i.test(f.getName())) return f; } catch (e) {}
  }
  return null;
}
function getActionsForRow(row) {
  row = parseInt(row, 10); if (!row || row < 2) return { actions: [], statuses: STATUS_CHOICES_, current: '' };
  const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const use = String(d[25] || ''), status = String(d[29] || '');
  const direct = isDirectDV_(use), insDV = isInsurerDV_(use), dv = isDvApprovalType_(use), isAC = isAppraisalClauseAny_(use);
  const hasEmail = String(d[4] || '').indexOf('@') > 0;
  let hasPdf = false; try { hasPdf = !!(d[27] && findFolderPdf_(d[27])); } catch (e) {}
  const A = [];
  const add = function(key, group, label, desc, o) { A.push(Object.assign({ key: key, group: group, label: label, desc: desc, send: false, why: '' }, o || {})); };

  add('build', 'Set up', 'Create folder & documents', 'Creates this client\'s Google Drive folder and fills the document templates from this sheet. Nothing is sent to anyone.', { why: d[27] ? 'Already created - re-running will not overwrite filled documents.' : '' });
  if (!direct) add('intake', 'Set up', 'Send intake / signing link', 'Emails the client a link to e-sign the service agreement' + (insDV ? ' and sends the $199 retainer invoice through Wave' : '') + '. You review the email' + (insDV ? ' and the invoice' : '') + ' first.', { send: true, why: !hasEmail ? 'Needs the client\'s email.' : '' });
  if (!insDV) add('invoice', 'Finish the appraisal', 'Complete appraisal & send invoice', 'Sends the Wave invoice' + (direct || isAC ? ' ($299)' : '') + '. When the client pays, the finished report is emailed to them automatically. You review the invoice, the report email and the documents now, so nothing else needs your approval later.', { send: true, why: !hasEmail ? 'Needs the client\'s email.' : (!hasPdf ? 'Compile the final PDF first (Exhibits & Full PDF tab).' : (d[31] ? 'An invoice already exists for this file.' : '')) });
  if (insDV) add('offer', 'Finish the appraisal', 'Send final offer link + $299 invoice', 'Emails the client the insurer\'s offer to e-sign and sends the $299 final invoice through Wave.', { send: true, why: !(parseFloat(String(d[32]).replace(/[^0-9.]/g, '')) > 0) ? 'Enter the insurer offer amount (Claim & Carrier tab) first.' : '' });
  if (dv) add('deliver', 'Deliver', 'Send appraisal to the client', 'Emails the finished appraisal PDF with the Approve & Proceed button. Diminished value clients do not pay at this stage.', { send: true, why: !hasPdf ? 'Compile the final PDF first.' : '' });
  else add('markpaid', 'Deliver', 'Mark paid & send report', 'Use when the client paid outside Wave (check, Zelle, cash) or Wave has not caught up. Records the payment note and emails the finished report. Normally the report goes out by itself when Wave shows the invoice paid.', { send: true, why: !hasPdf ? 'Compile the final PDF first.' : '' });
  add('demand', 'Adjuster & mail', 'Send demand / notice to the adjuster', 'Emails the adjuster the demand or notice letter and the appraisal. You can edit the message and CC the vehicle owner. Then you get the certified-mail packet to mail.', { send: true, why: !String(d[12] || '').trim() ? 'Needs the adjuster\'s email (Claim & Carrier tab).' : (/Demand Emailed/.test(status) ? 'Already emailed to the adjuster.' : '') });
  if (!direct && !insDV && isAC) add('award', 'Adjuster & mail', 'Create & send award letter', 'Creates the award document with the agreed value. You open it to check or edit, then review the email (To, CC, subject, message) and choose whether to attach the PDF. The carrier\'s appraiser gets an e-sign link plus the PDF in case they would rather print and sign.', { send: true, why: !(parseFloat(String(d[COL_AWARD_ACV - 1]).replace(/[^0-9.]/g, '')) > 0) ? 'Enter the agreed value and appraiser email (Award Letter tab).' : '' });
  add('mailedletter', 'Adjuster & mail', 'Certified mail letter (edit / print)', 'Makes the MAILED version of the demand letter for the envelope. It has the same wording as the emailed demand, but instead of enclosing the appraisal it says the appraisal was emailed and to refer to that email. Only this letter goes in the mail. You can edit it before printing. Nothing is sent.', { why: !String(d[111] || '').trim() ? 'Tip: add the carrier mailing address first (Claim & Carrier tab).' : '' });
  add('printapp', 'Print', 'Print appraisal', 'Opens the finished appraisal PDF so you can print it. Nothing is sent.', { why: !hasPdf ? 'Compile the final PDF first.' : '' });
  add('printdemand', 'Print', 'Print demand letter', 'Opens the EMAILED demand / notice letter (the one sent with the appraisal) so you can edit it first, then makes a clean PDF to print. For the letter you mail, use "Certified mail letter". Nothing is sent.', { why: !demandLetterFile_(d[28]) ? 'Create the folder & documents first.' : '' });
  add('t_comps', 'Work tools', 'Re-run comps', 'Searches for comparable vehicles again for this vehicle. Check the Comparables tab afterwards. Nothing is sent.', { fn: 'rerunCompsForActiveRow' });
  if (dv) add('t_offers', 'Work tools', 'Get dealer / guide offers', 'Looks up guide values and dealer trade-in offers for this vehicle. Check the Trade-In Values tab afterwards. Nothing is sent.', { fn: 'triggerOffersForActiveRow' });
  else add('t_tax', 'Work tools', 'Fill sales tax & tag fees', 'Fills in the sales tax and tag/title fee for the client\'s state. Nothing is sent.', { fn: 'populateTaxAndFeesForActiveRow' });
  add('prefill', 'Work tools', 'Pre-fill from emails & photos', 'Reads the emails and photos already saved for this client and fills VIN, mileage and other empty boxes. Boxes that already have a value are never changed. Anything filled is marked so you can verify it.');
  add('t_refresh', 'Work tools', 'Refresh report from the data', 'Rebuilds the report document using what is typed in this panel. Nothing is sent.', { fn: 'regenerateDocsForRow' });
  add('t_shots', 'Work tools', 'Add screenshots to report', 'Adds the offer and comp screenshots to the report. Nothing is sent.', { fn: 'appendScreenshotsToReport' });
  add('t_compile', 'Work tools', 'Compile final appraisal PDF', 'Builds the finished appraisal PDF that is delivered to the client. Nothing is sent. (To choose which exhibits go in, use the Exhibits & Full PDF tab.)', { fn: 'compileAndFinalizeAppraisalPdf' });
  add('t_close', 'Work tools', 'Close this file', 'Moves the file to Closed Files (you can reopen it there). Nothing is sent.', { fn: 'closeActiveFile' });
  add('labels', 'Adjuster & mail', 'Print certified mail labels', 'Makes ONE PDF: a full-page envelope label, then a page with two eighth-page labels (shipping address and return address), saves it in the client\'s folder and gives you a link to print it. Nothing is sent.', { why: !String(d[111] || '').trim() ? 'Tip: add the carrier mailing address first (Claim & Carrier tab).' : '' });
  add('tracking', 'Adjuster & mail', 'Enter certified mail tracking number', 'Type the tracking number from your certified mail receipt after you mail the packet. It is saved on this file (note on the status cell) and the status changes to "Certified Mail Sent". Nothing is sent to anyone.', { why: certTracking_(row) ? 'Saved: ' + certTracking_(row) : '' });
  const ORDER = ['Set up', 'Finish the appraisal', 'Deliver', 'Adjuster & mail', 'Print', 'Work tools'];
  A.sort(function(x, y) { return ORDER.indexOf(x.group) - ORDER.indexOf(y.group); });
  return { actions: A, statuses: STATUS_CHOICES_, current: status };
}

function prepareAction(row, key) {
  row = parseInt(row, 10);
  const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const name = String(d[0] || ''), email = String(d[4] || ''), use = String(d[25] || '');
  const dv = isDvApprovalType_(use), insDV = isInsurerDV_(use), direct = isDirectDV_(use);
  const P = { key: key, row: row, title: '', intro: '', confirm: 'Confirm & send', fields: [], docs: [], warnings: [] };
  const F = function(id, label, type, value, hint) { P.fields.push({ id: id, label: label, type: type, value: value == null ? '' : String(value), hint: hint || '' }); };
  const docs = function(a) { try { return approvalDocs_(row, a, false).map(function(x) { return { label: x.label, name: x.name, url: x.url }; }); } catch (e) { return []; } };
  const invoiceFields = function(kind, opts, prefix) {
    const dr = waveInvoiceDraft_(kind, opts);
    if (dr.error) { P.warnings.push(dr.error); return; }
    const last = waveRecentInvoiceNumber_();
    F('h_inv', 'Invoice (Wave)', 'h');
    F('inv_to', 'Sent to', 'static', name + ' <' + email + '>');
    F('inv_number', 'Invoice number', 'text', '', last ? 'Leave blank and Wave assigns the next number. Highest recent number seen: ' + last + '.' : 'Leave blank and Wave assigns the next number automatically.');
    F('inv_desc', 'Line description', 'text', dr.desc);
    F('inv_amount', 'Amount ($)', 'text', dr.price.toFixed(2));
    F('inv_subject', 'Invoice email subject', 'text', dr.subject);
    F('inv_message', 'Message on the invoice email', 'area', dr.message);
    F('inv_ccme', 'Also email me (kevin) a copy of the invoice', 'check', '');
  };
  const deliveryFields = function(prefix, heading) {
    const mail = buildFinalPdfEmail_({ clientName: name, intendedUse: use, vehicle: vehicleFromRow_(d), row: row });
    const ed = getDeliveryEdits_(row) || {};
    F('h_dlv', heading, 'h');
    F('dlv_to', 'To', 'static', name + ' <' + email + '>');
    F('dlv_cc', 'CC (comma separated)', 'text', ed.cc || '');
    F('dlv_subject', 'Subject', 'text', ed.subject || mail.subject);
    F('dlv_body', 'Message (the Approve button / link stays in the email)', 'area', ed.body || mail.text);
    P.docs = docs('deliver');
    if (!P.docs.length) P.warnings.push('No final appraisal PDF found in the client folder.');
  };

  if (key === 'build') {
    P.title = 'Create folder & documents'; P.confirm = 'Create now';
    P.intro = 'Creates the client\'s Drive folder and fills in the document templates. Nothing is emailed.';
    if (d[27]) P.warnings.push('A folder already exists for this file. Running again will not overwrite documents that already exist.');
  } else if (key === 'intake') {
    P.title = 'Send intake / signing link'; P.confirm = 'Send link' + (insDV ? ' & invoice' : '');
    P.intro = 'This email goes to ' + name + ' first' + (insDV ? ', then the retainer invoice is created and emailed by Wave.' : '.');
    if (!email) P.warnings.push('No client email on file.');
    F('h_em', 'Email to the client', 'h');
    F('em_to', 'To', 'static', name + ' <' + email + '>');
    F('em_cc', 'CC (comma separated)', 'text', '');
    F('em_subject', 'Subject', 'text', 'Action Required: Service Authorization');
    F('em_body', 'Message', 'area', 'Welcome to Estimate Consultants! Please review and sign your agreement:\n\nSign here:\n' + WEBSITE_SIGNING_URL + '?row=' + row + '&type=auth');
    P.docs = docs('intake');
    if (insDV) { if (d[31]) P.warnings.push('A retainer invoice already exists (column AF) - no second invoice will be created.'); else invoiceFields('DV_RETAINER', { promoCode: getShopPromoForEmail_(email), vehicle: invVehicle_(sh, row) }); }
  } else if (key === 'invoice') {
    P.title = 'Complete appraisal & send invoice'; P.confirm = 'Send invoice';
    P.intro = 'Review the invoice, the report email and the documents. After you confirm, Wave emails the invoice now, and the report below goes out automatically when payment shows in Wave.';
    if (!email) P.warnings.push('No client email on file.');
    if (d[31]) P.warnings.push('An invoice already exists for this file (column AF). Sending will not create another.');
    invoiceFields(invoiceKindForUse_(use), { promoCode: direct ? '' : getShopPromoForEmail_(email), vehicle: invVehicle_(sh, row) });
    deliveryFields('dlv', 'Report email - sent automatically after payment');
  } else if (key === 'award') {
    P.title = 'Send award letter to the carrier appraiser'; P.confirm = 'Send award letter';
    const aw = toNum(d[COL_AWARD_ACV - 1]);
    P.intro = 'Emails the carrier\'s appraiser the Award Document with an e-sign link, plus the PDF attached in case they prefer to print and sign. When they e-sign, everyone gets the executed copy automatically.\n1) Open the Award Document below and check the agreed value (' + (aw > 0 ? fmtMoney(aw) : 'NOT ENTERED') + ') - edits save themselves.\n2) Review the email, then click Send.';
    if (!(aw > 0)) P.warnings.push('Enter the agreed value (Award Letter tab) first.');
    let af = null; try { af = awardDocFile_(row); if (!af) { af = createAwardDocCore_(row, d); sh.getRange(row, COL_AWARD_DOC_ID).setValue(af.getId()); } } catch (e) { P.warnings.push('Could not create the Award Document: ' + (e && e.message || e)); }
    if (af) P.docs = [{ label: 'Award Document - click to open and EDIT', name: af.getName(), url: af.getUrl() }];
    const dr = awardEmailDraft_(row, d);
    if (!dr.to) P.warnings.push("No carrier appraiser email (Award Letter tab).");
    F('h_aw', 'Email to the carrier appraiser', 'h');
    F('aw_to', 'To', 'text', dr.to);
    F('aw_cc', 'CC (optional)', 'text', '');
    F('aw_subject', 'Subject', 'text', dr.subject);
    F('aw_body', 'Message (keep the signing link)', 'area', dr.body);
    F('aw_pdf', 'Attach the Award Document as a PDF', 'check', '1');
  } else if (key === 'offer') {
    P.title = APPROVAL_TITLES_[key] || key; P.confirm = 'Confirm & send';
    P.intro = approvalPreview_(row, key); P.docs = docs(key);
    P.warnings.push('The wording of this email is fixed for now (editing it here is not available yet). Review the details above.');
  } else if (key === 'deliver' || key === 'markpaid') {
    P.title = key === 'markpaid' ? 'Mark paid & send report' : 'Send appraisal to the client'; P.confirm = key === 'markpaid' ? 'Mark paid & send' : 'Send to client';
    P.intro = key === 'markpaid' ? 'Confirms the payment arrived and emails the finished report now.' : 'Diminished value clients do not pay at this stage. This emails the finished appraisal now.';
    if (!email) P.warnings.push('No client email on file.');
    if (/Delivered/.test(String(d[29] || ''))) P.warnings.push('The status already says "' + d[29] + '" - the report may have been sent already. Sending again emails the client a second copy.');
    if (key === 'markpaid') F('paid_ok', 'I confirm the payment was received', 'check', '');
    if (key === 'markpaid') F('paid_note', 'Payment note (optional - method, date, check #)', 'text', '');
    deliveryFields('dlv', 'Email to the client');
  } else if (key === 'demand') {
    const pkg = buildDemandPackage_(row);
    P.title = 'Send demand / notice to the adjuster'; P.confirm = 'Send to adjuster';
    P.intro = 'Emails the adjuster. Afterwards you get a "Certified mail to send" email with the labels and packet.';
    if (!pkg.adjEmail) P.warnings.push('No adjuster email (Claim & Carrier tab).');
    if (!pkg.hasReport) P.warnings.push('No finished appraisal PDF found in the client folder.');
    if (!pkg.hasLetter) P.warnings.push('No demand/notice letter document found to attach.');
    F('h_em', 'Email to the adjuster', 'h');
    F('em_to', 'To', 'static', pkg.adjName + ' <' + pkg.adjEmail + '>');
    F('em_cc', 'CC (the vehicle owner is copied by default)', 'text', demandCc_(pkg, null));
    F('em_subject', 'Subject', 'text', pkg.subject);
    F('em_body', 'Message', 'area', pkg.body);
    P.docs = pkg.attachments.map(function(a) { return { label: 'Attachment', name: a.getName(), url: '' }; });
    docs('demand').forEach(function(x) { P.docs.push(x); });
  } else if (key === 'mailedletter') {
    P.title = 'Certified mail letter'; P.confirm = 'Make the PDF to print';
    P.intro = 'This is the letter you MAIL (the appraisal is not mailed - it was emailed, and the letter says to refer to that email).\n1) Click the letter below to open it and edit anything. It saves itself and is never overwritten.\n2) Come back and click "Make the PDF to print".';
    const lf = mailedLetterFile_(row, true);
    if (!lf) P.warnings.push('No client folder yet - create the folder & documents first.');
    else P.docs = [{ label: 'Certified mail letter - click to open and EDIT', name: lf.getName(), url: lf.getUrl() }];
    if (!String(d[111] || '').trim()) P.warnings.push('No carrier mailing address on file - add it, then delete the letter and reopen this to rebuild it.');
  } else if (key === 'tracking') {
    P.title = 'Certified mail tracking number'; P.confirm = 'Save tracking number';
    P.intro = 'Enter the tracking number from the receipt after you mail the packet. Saved on this file; the status becomes "Demand Emailed + Certified Mail Sent". Nothing is sent.';
    F('trk', 'Tracking number', 'text', certTracking_(row));
  } else if (key === 'prefill') {
    P.title = 'Pre-fill from emails & photos'; P.confirm = 'Read photos now';
    P.intro = 'Reads the photos and files already saved for this client and fills VIN and mileage ONLY where the box is empty. Anything it fills is marked in the panel. Nothing is sent.';
  } else if (key === 'printapp') {
    P.title = 'Print appraisal'; P.confirm = 'Open the PDF';
    P.intro = 'Opens the finished appraisal so you can print it (use the print button in the viewer).';
    P.docs = docs('deliver'); if (!P.docs.length) P.warnings.push('No final appraisal PDF found yet.');
  } else if (key === 'printdemand') {
    const f = demandLetterFile_(d[28]);
    P.title = 'Print demand letter'; P.confirm = 'Make the PDF to print';
    P.intro = '1) Click the document below to open it, change anything you want, and it saves itself.\n2) Come back here and click "Make the PDF to print" - it builds the PDF from your edited version.';
    if (!f) P.warnings.push('No demand / notice letter found. Run "Create folder & documents" first.');
    else P.docs = [{ label: 'Demand letter - click to open and EDIT', name: f.getName(), url: f.getUrl() }];
  } else if (key === 'labels') {
    P.title = 'Print certified mail labels'; P.confirm = 'Make labels';
    P.intro = 'Creates ONE PDF: page 1 is the envelope label, page 2 holds two eighth-page labels side by side (shipping address and return address) to cut out. Saved in the client\'s folder under "Certified Mail Labels", and shows a link to open and print it. Nothing is emailed.';
    if (!String(d[111] || '').trim()) P.warnings.push('No carrier mailing address on file - the labels will say "ADD CARRIER ADDRESS IN THE SHEET".');
  } else { P.title = 'Unknown action'; P.warnings.push('Unknown action: ' + key); }
  return P;
}

function runAction(row, key, v) {
  row = parseInt(row, 10); v = v || {};
  const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const name = String(d[0] || ''), email = String(d[4] || ''), use = String(d[25] || '');
  const msgs = []; const shim = { alert: function(m) { msgs.push(String(m)); return m; }, Button: { OK: 'OK', YES: 'YES', NO: 'NO' }, ButtonSet: { OK_CANCEL: 0, YES_NO: 1 } };
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const invOv = function() {
      const o = {};
      if (v.inv_number) o.invoiceNumber = String(v.inv_number).trim();
      const amt = parseFloat(String(v.inv_amount || '').replace(/[^0-9.]/g, '')); if (amt > 0) o.finalPrice = amt;
      if (v.inv_desc) o.descFull = String(v.inv_desc);
      if (v.inv_subject) o.waveSubject = String(v.inv_subject);
      if (v.inv_message) o.waveMessage = String(v.inv_message);
      if (v.inv_ccme === '1') o.ccMe = true;
      return o;
    };
    const saveDelivery = function() {
      if (v.dlv_subject === undefined && v.dlv_body === undefined) return;
      const mail = buildFinalPdfEmail_({ clientName: name, intendedUse: use, vehicle: vehicleFromRow_(d), row: row });
      const e = {};
      if (v.dlv_subject && v.dlv_subject !== mail.subject) e.subject = String(v.dlv_subject);
      if (v.dlv_body && v.dlv_body !== mail.text) e.body = String(v.dlv_body);
      if (v.dlv_cc && String(v.dlv_cc).trim()) e.cc = String(v.dlv_cc).trim();
      if (Object.keys(e).length) setDeliveryEdits_(row, e); else clearDeliveryEdits_(row);
    };
    if (key === 'build') {
      const r = generateClientFileForRow(row);
      return { ok: !!(r && r.success), msg: (r && r.message) || 'Done.' };
    }
    if (key === 'intake') {
      if (!email) return { ok: false, msg: 'No client email on file.' };
      const ov = { cc: String(v.em_cc || '').trim(), subject: v.em_subject, body: v.em_body, inv: invOv() };
      sendAuthAndInvoiceCore_(row, shim, ov);
      return { ok: true, msg: msgs.join('\n') || 'Sent.' };
    }
    if (key === 'invoice') {
      if (d[31]) return { ok: false, msg: 'An invoice already exists for this file (column AF), so a second one was NOT created. Check it in Wave, or clear column AF if it was voided.' };
      saveDelivery();
      const ok = sendFinalInvoiceCore_(row, shim, invOv());
      return { ok: ok !== false, msg: (msgs.join('\n') || (ok === false ? 'Not sent.' : 'Invoice sent.')) + (ok !== false ? '\nThe report will be emailed automatically once Wave shows the invoice paid.' : '') };
    }
    if (key === 'award') {
      if (!(toNum(d[COL_AWARD_ACV - 1]) > 0)) return { ok: false, msg: 'Enter the agreed value (Award Letter tab) first.' };
      const msgs = [];
      try { sendAwardLetter_(row, msgs, { to: v.aw_to, cc: v.aw_cc, subject: v.aw_subject, body: v.aw_body, attachPdf: v.aw_pdf === '1' }); }
      catch (e) { return { ok: false, msg: String(e && e.message || e) }; }
      return { ok: true, msg: msgs.join(' ') };
    }
    if (key === 'offer') { const r = performApprovalAction_(row, key); return { ok: r.ok, msg: r.msg }; }
    if (key === 'deliver' || key === 'markpaid') {
      if (key === 'markpaid' && v.paid_ok !== '1') return { ok: false, msg: 'Tick "I confirm the payment was received" first.' };
      saveDelivery();
      const r = performApprovalAction_(row, 'deliver');
      if (r.ok && key === 'markpaid') { try { addProgressNoteToRow(row, 'Marked paid manually' + (v.paid_note ? ' - ' + v.paid_note : '') + '; report emailed.'); } catch (e) {} }
      return { ok: r.ok, msg: r.msg };
    }
    if (key === 'demand') {
      const r = sendDemandForRow_(row, { cc: v.em_cc, subject: v.em_subject, body: v.em_body });
      return { ok: !!r.ok, msg: r.ok ? 'Demand emailed to ' + r.adjName + ' (' + r.adjEmail + '). A certified-mail reminder with the labels was emailed to you.' : r.error };
    }
    if (key === 'mailedletter') {
      const lf = mailedLetterFile_(row, true);
      if (!lf) return { ok: false, msg: 'No client folder yet.' };
      const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
      const parent = DriveApp.getFolderById(m[1]);
      const it = parent.getFoldersByName('Print Copies'); const dest = it.hasNext() ? it.next() : parent.createFolder('Print Copies');
      const nm = lf.getName() + ' - PRINT.pdf';
      const old = dest.getFilesByName(nm); while (old.hasNext()) old.next().setTrashed(true);
      const out = dest.createFile(lf.getAs(MimeType.PDF).setName(nm));
      return { ok: true, msg: 'Built from the letter as it is right now. Open it and print it for the envelope.', links: [{ label: nm, url: out.getUrl() }] };
    }
    if (key === 'tracking') {
      const t = String(v.trk || '').replace(/\s+/g, ' ').trim();
      if (!t) return { ok: false, msg: 'Enter the tracking number.' };
      saveCertTracking_(row, t);
      return { ok: true, msg: 'Saved tracking number ' + t + '.' };
    }
    if (key === 'prefill') return prefillFromPhotosNow(row);
    if (key === 'printapp') {
      const pdf = d[27] ? findFolderPdf_(d[27]) : null;
      if (!pdf) return { ok: false, msg: 'No final appraisal PDF found yet - compile it first.' };
      return { ok: true, msg: 'Open it and use the print button.', links: [{ label: pdf.getName(), url: pdf.getUrl() }] };
    }
    if (key === 'printdemand') {
      const f = demandLetterFile_(d[28]);
      if (!f) return { ok: false, msg: 'No demand / notice letter found.' };
      const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
      const parent = m ? DriveApp.getFolderById(m[1]) : DriveApp.getRootFolder();
      const it = parent.getFoldersByName('Print Copies'); const dest = it.hasNext() ? it.next() : parent.createFolder('Print Copies');
      const nm = f.getName().replace(/\.pdf$/i, '') + ' - PRINT.pdf';
      const old = dest.getFilesByName(nm); while (old.hasNext()) old.next().setTrashed(true);
      const out = dest.createFile(f.getAs(MimeType.PDF).setName(nm));
      return { ok: true, msg: 'Built from the document as it is right now. Open it and print.', links: [{ label: nm, url: out.getUrl() }] };
    }
    if (key === 'labels') {
      const pkg = buildDemandPackage_(row);
      const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
      if (!m) return { ok: false, msg: 'No client folder yet - create the folder first.' };
      const parent = DriveApp.getFolderById(m[1]);
      const it = parent.getFoldersByName('Certified Mail Labels'); const dest = it.hasNext() ? it.next() : parent.createFolder('Certified Mail Labels');
      const blobs = [buildCertifiedLabelPdf_(pkg).setName('Label - Envelope - ' + pkg.clientName + '.pdf')].concat(buildCertifiedFormLabelsPdf_(pkg));
      const links = blobs.map(function(b) { const old = dest.getFilesByName(b.getName()); while (old.hasNext()) old.next().setTrashed(true); const f = dest.createFile(b); return { label: b.getName(), url: f.getUrl() }; });
      return { ok: true, msg: 'Labels are ready. Click a link to open it, then print it (use Actual size / 100%).', links: links };
    }
    return { ok: false, msg: 'Unknown action.' };
  } catch (e) { return { ok: false, msg: 'Error: ' + (e && e.message || e) }; }
  finally { lock.releaseLock(); }
}

// All certified-mail labels in ONE PDF (each page is exactly its label's size). Async because the PDF library is; the panel polls getFullBuildStatus(token).
async function buildLabelsJob(row, token) {
  token = String(token || 'lbl'); row = parseInt(row, 10);
  const put = function(o) { try { CacheService.getScriptCache().put('fab_' + token, JSON.stringify(o), 1800); } catch (e) {} };
  put({ state: 'running' });
  try {
    const sh = getMainSheet(); const d = sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
    const m = String(d[27] || '').match(/folders\/([a-zA-Z0-9-_]+)/);
    if (!m) { put({ state: 'error', msg: 'No client folder yet - create the folder first.' }); return; }
    const pkg = buildDemandPackage_(row);
    const blobs = [buildCertifiedLabelPdf_(pkg)].concat(buildCertifiedFormLabelsPdf_(pkg));
    const parent = DriveApp.getFolderById(m[1]);
    const it = parent.getFoldersByName('Certified Mail Labels'); const dest = it.hasNext() ? it.next() : parent.createFolder('Certified Mail Labels');
    loadPdfLib_();
    const out = await PDFLib.PDFDocument.create();
    for (let i = 0; i < blobs.length; i++) {
      const src = await PDFLib.PDFDocument.load(new Uint8Array(blobs[i].getBytes()));
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach(function(pg) { out.addPage(pg); });
    }
    const bytes = await out.save();
    const nm = 'Certified Mail Labels - ' + pkg.clientName + '.pdf';
    const old = dest.getFilesByName(nm); while (old.hasNext()) old.next().setTrashed(true);
    const f = dest.createFile(Utilities.newBlob(Array.from(bytes), 'application/pdf', nm));
    put({ state: 'done', url: f.getUrl(), name: nm, msg: 'One PDF, 2 pages: (1) full-page envelope label, (2) two eighth-page labels side by side - shipping address (left) and return address (right) - cut along the thin borders. Print at Actual size.' });
  } catch (e) { put({ state: 'error', msg: 'Could not combine the labels: ' + (e && e.message || e) + ' - use "Print certified mail labels" again to get them as separate files.' }); }
}
// ---- what goes into the full appraisal PDF (checkboxes on the Exhibits & Full PDF tab) ----
function fullOff_(row) { try { const v = PropertiesService.getScriptProperties().getProperty('FPI_' + row); return v ? JSON.parse(v) : {}; } catch (e) { return {}; } }
function setFullPdfInclude(row, key, on) {
  row = parseInt(row, 10); const off = fullOff_(row);
  if (on) delete off[key]; else off[key] = 1;
  PropertiesService.getScriptProperties().setProperty('FPI_' + row, JSON.stringify(off));
  return true;
}
function getFullPdfPlan(row) {
  row = parseInt(row, 10); const off = fullOff_(row);
  const sh = getMainSheet(); ensureMainWidth_(sh); const r = sh.getRange(row, 1, 1, MAIN_ROW_WIDTH).getValues()[0];
  const items = [], docs = [];
  const urls = String(r[28] || '').split(/\r?\n/);
  let hasDemand = false;
  urls.forEach(function(u) { const m = u.match(/\/d\/([a-zA-Z0-9-_]+)/); if (!m) return; try { const f = DriveApp.getFileById(m[1]); docs.push({ name: f.getName(), url: f.getUrl() }); if (/demand|notice/i.test(f.getName())) hasDemand = true; } catch (e) {} });
  if (hasDemand) items.push({ key: 'demand', label: 'Demand / notice letter (goes first)', on: !off.demand });
  items.push({ key: 'report', label: 'Appraisal report', on: true, locked: true });
  try { getExhibitList(row).filter(function(e) { return e.has; }).forEach(function(e) { items.push({ key: e.key, label: e.label, on: !off[e.key], url: e.url }); }); } catch (e) {}
  let hasAuth = false; try { hasAuth = !!findSignedAuthPdf_(exhibitFolders_(r).done); } catch (e) {}
  items.push({ key: 'auth', label: 'Signed intake / service agreement (goes last)' + (hasAuth ? '' : ' - not signed yet'), on: !off.auth, missing: !hasAuth });
  return { items: items, docs: docs };
}
function setFileStatus(row, status, note) {
  row = parseInt(row, 10); status = String(status || '').trim();
  if (!row || row < 2 || !status) throw new Error('Choose a status.');
  const c = getMainSheet().getRange(row, 30);
  const ok = /✅|Paid|Delivered|Signed|Closed/.test(status), warn = /⏳|Awaiting|Sent/.test(status), bad = /❌|Declined/.test(status);
  c.setValue(status).setBackground(bad ? '#f8d7da' : ok ? '#d4edda' : warn ? '#fff3cd' : '#e2e3e5').setFontColor(bad ? '#721c24' : ok ? '#155724' : warn ? '#856404' : '#383d41');
  try { addProgressNoteToRow(row, 'Status set manually to: ' + status + (note ? ' - ' + note : '')); } catch (e) {}
  return true;
}

// Client-side code for the Actions tab and the review box (inserted into the file panel).
const ACTIONS_JS_ = `
(function(){var st=document.createElement('style');st.textContent='.arow{display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #e5e7eb}.arow:last-child{border-bottom:0}.abtn{min-width:230px;text-align:left}.adesc{flex:1;font-size:13px;color:#334155;line-height:1.45}.awhy{display:block;margin-top:4px;font-size:12px;color:#b45309;font-weight:600}.agrp{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;font-weight:700;margin:14px 0 2px}.sendtag{font-size:10px;background:#fde68a;color:#78350f;border-radius:6px;padding:1px 6px;margin-left:6px;font-weight:700}.btn.dis{opacity:.55}#rvback{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:50;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 12px}#rv{background:#fff;border-radius:14px;max-width:760px;width:100%;padding:20px 22px;box-shadow:0 10px 40px rgba(0,0,0,.35)}#rv h2{margin:0 0 4px;font-size:20px}#rv .intro{white-space:pre-wrap;color:#334155;font-size:13px;margin:6px 0 10px}#rv .fh{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#1e3a8a;font-weight:700;margin:16px 0 6px;border-top:1px solid #e2e8f0;padding-top:10px}#rv .fl{margin:8px 0 3px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase}#rv .fs{padding:8px 10px;background:#f1f5f9;border-radius:8px;font-size:13px}#rv .hint{font-size:12px;color:#64748b;margin-top:3px}#rv .wn{background:#fef2f2;border-left:5px solid #dc2626;border-radius:8px;padding:8px 12px;margin:8px 0;font-size:13px;color:#7f1d1d}#rv .dc{background:#eef6ff;border:1px solid #bcd7f5;border-radius:8px;padding:10px;margin:12px 0;font-size:13px}#rv .btns{display:flex;gap:10px;justify-content:flex-end;margin-top:16px}#rv textarea{min-height:170px}#rv .ck{display:flex;gap:8px;align-items:center;margin-top:8px;font-size:13px}#rv .ck input{width:auto}.pf{background:#eff6ff!important;border-color:#60a5fa!important}.pfnote{font-size:11px;color:#1d4ed8;margin-top:3px}';document.head.appendChild(st)})();
function actionsCard(){return '<div class="card"><h3>Actions</h3><p style="margin:0 0 6px;font-size:13px;color:#475569">Each button says what it does. Anything that sends an email or an invoice opens a review box first - nothing goes out until you click Confirm.</p><div id="actbody">Open this tab to load…</div></div><div class="card"><h3>Change status</h3><div id="actstatus"></div></div>'}
function planCard(){return '<div class="card"><h3>Full appraisal PDF - choose what goes in</h3><p style="margin:0 0 8px;font-size:13px;color:#475569">Untick anything you do not want included, then build the full PDF. Order: demand letter, appraisal, exhibits, signed agreement. The report and letter are rebuilt from the current documents each time, so edit them first if needed.</p><div id="planbody">Loading…</div><div id="plandocs" style="margin-top:12px"></div></div>'}
function planLoad(){var b=$('planbody');if(!b||!row)return;google.script.run.withSuccessHandler(function(p){var h='';(p.items||[]).forEach(function(i){h+='<label style="display:flex;gap:8px;align-items:center;margin:6px 0;font-size:14px;font-weight:400;text-transform:none;letter-spacing:0;color:#0f172a"><input type="checkbox" style="width:auto" '+(i.on?'checked ':'')+(i.locked?'disabled ':'')+'onchange="planSet(\\''+i.key+'\\',this.checked)"> <span>'+esc(i.label)+'</span>'+(i.url?' <a href="'+esc(i.url)+'" target="_blank" style="font-size:12px">open</a>':'')+'</label>'});b.innerHTML=h;var d='<div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:4px">Documents - click to open, review or edit</div>';(p.docs||[]).forEach(function(x){d+='<div><a href="'+esc(x.url)+'" target="_blank">'+esc(x.name)+'</a></div>'});$('plandocs').innerHTML=d}).getFullPdfPlan(row)}
function planSet(k,on){google.script.run.setFullPdfInclude(row,k,on)}
function markPf(m){document.querySelectorAll('.pfnote').forEach(function(x){x.remove()});document.querySelectorAll('.pf').forEach(function(e){e.classList.remove('pf')});Object.keys(m||{}).forEach(function(k){var el=document.querySelector('[data-k="'+k+'"]');if(!el)return;el.classList.add('pf');var n=document.createElement('div');n.className='pfnote';n.innerHTML='🔎 '+esc(m[k])+' <a href="#" onclick="pfOk(\\''+k+'\\');return false">Looks right</a>';el.parentNode.insertBefore(n,el.nextSibling)})}
function pfOk(k){google.script.run.withSuccessHandler(function(){load()}).clearPrefillMark(row,k)}
var SHOWALL=false;
function typeFlags(u){u=String(u||'').toLowerCase();var dv=u.indexOf('diminished value')>=0||u.indexOf('3rd-party')>=0,direct=u.indexOf('no insurer')>=0,ac=u.indexOf('appraisal clause')>=0||u.indexOf('acv dispute')>=0,tl=u.indexOf('total loss')>=0;return {dv:dv,acv:!dv,ins:dv&&!direct&&!ac,ac:ac,claim:(dv&&!direct)||tl}}
function applyType(use){var f=typeFlags(use);function ok(a){if(SHOWALL||!a)return true;return a.split(',').some(function(k){return f[k]})}
document.querySelectorAll('[data-for]').forEach(function(el){el.style.display=ok(el.getAttribute('data-for'))?'':'none'});
document.querySelectorAll('.tab').forEach(function(t){var def=SCHEMA.filter(function(s){return s.id===t.dataset.t})[0];var show=ok(def&&def.for);t.style.display=show?'':'none';if(!show&&t.classList.contains('on')){var o=document.querySelector('.tab[data-t=overview]');if(o)o.click()}});
var tb=document.querySelector('.tabs');if(tb&&!$('showall')){var b=document.createElement('button');b.id='showall';b.className='tab';b.style.marginLeft='auto';b.style.fontSize='12px';b.onclick=function(){SHOWALL=!SHOWALL;applyType(LASTUSE)};tb.appendChild(b)}
if($('showall'))$('showall').textContent=SHOWALL?'Show only what applies':'Show all sections';LASTUSE=use}
var LASTUSE='';
function actsLoad(){var p=$('p_actions');if(!p||!row||!p.classList.contains('on'))return;$('actbody').innerHTML='Loading…';google.script.run.withSuccessHandler(renderActs).withFailureHandler(function(e){$('actbody').innerHTML='<div class="warn">'+esc(e.message)+'</div>'}).getActionsForRow(row)}
function renderActs(res){var h='',g='';(res.actions||[]).forEach(function(a){if(a.group!==g){g=a.group;h+='<div class="agrp">'+esc(g)+'</div>'}var dis=!!a.why&&/^(Needs|Compile|Enter|An invoice|Already)/.test(a.why);h+='<div class="arow"><div><button class="btn '+(a.send?'p':'')+(dis?' dis':'')+' abtn" '+(dis?'disabled':'')+' onclick="'+(a.fn?"act(\\'"+a.fn+"\\')":"actOpen(\\'"+a.key+"\\')")+'">'+esc(a.label)+(a.send?'<span class="sendtag">REVIEW FIRST</span>':'')+'</button></div><div class="adesc">'+esc(a.desc)+(a.why?'<span class="awhy">'+esc(a.why)+'</span>':'')+'</div></div>'});$('actbody').innerHTML=h||'<div class="empty">Select a file.</div>';
var s='<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><select id="stsel" style="max-width:380px">';(res.statuses||[]).forEach(function(x){s+='<option'+(x===res.current?' selected':'')+'>'+esc(x)+'</option>'});if(res.current&&(res.statuses||[]).indexOf(res.current)<0)s='<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><select id="stsel" style="max-width:380px"><option selected>'+esc(res.current)+'</option>'+s.split('>').slice(2).join('>');s+='</select><input id="stnote" placeholder="Note (optional)" style="max-width:260px"><button class="btn" onclick="actStatus()">Set status</button></div><div style="font-size:12px;color:#64748b;margin-top:6px">Current status: <b>'+esc(res.current||'(none)')+'</b>. Changing it here only updates the sheet - it does not send anything.</div>';$('actstatus').innerHTML=s}
function actStatus(){var v=$('stsel').value,n=$('stnote').value;google.script.run.withSuccessHandler(function(){load();actsLoad()}).withFailureHandler(function(e){alert(e.message)}).setFileStatus(row,v,n)}
function actOpen(key){flushNow(function(){rvShow('<h2>Preparing…</h2><p>Gathering exactly what will be sent.</p>');google.script.run.withSuccessHandler(rvRender).withFailureHandler(function(e){rvShow('<h2>Could not prepare</h2><div class="wn">'+esc(e.message)+'</div><div class="btns"><button class="btn" onclick="rvClose()">Close</button></div>')}).prepareAction(row,key)})}
function rvShow(html){var b=$('rvback');if(!b){b=document.createElement('div');b.id='rvback';b.innerHTML='<div id="rv"></div>';document.body.appendChild(b)}$('rv').innerHTML=html}
function rvClose(){var b=$('rvback');if(b)b.remove()}
var RVP=null;
function rvRender(p){RVP=p;var h='<h2>'+esc(p.title)+'</h2>';if(p.intro)h+='<div class="intro">'+esc(p.intro)+'</div>';(p.warnings||[]).forEach(function(w){h+='<div class="wn">⚠️ '+esc(w)+'</div>'});
(p.fields||[]).forEach(function(f){if(f.type==='h'){h+='<div class="fh">'+esc(f.label)+'</div>';return}if(f.type==='check'){h+='<label class="ck"><input type="checkbox" id="rf_'+f.id+'"> '+esc(f.label)+'</label>';return}h+='<div class="fl">'+esc(f.label)+'</div>';if(f.type==='static')h+='<div class="fs">'+esc(f.value)+'</div>';else if(f.type==='area')h+='<textarea id="rf_'+f.id+'">'+esc(f.value)+'</textarea>';else h+='<input id="rf_'+f.id+'" value="'+esc(f.value)+'">';if(f.hint)h+='<div class="hint">'+esc(f.hint)+'</div>'});
if((p.docs||[]).length){h+='<div class="dc"><b>📄 Documents that will go out</b><br>';p.docs.forEach(function(d){h+=(d.url?'<a href="'+esc(d.url)+'" target="_blank">'+esc(d.name)+'</a>':esc(d.name))+' <span style="color:#64748b">- '+esc(d.label)+'</span><br>'});h+='</div>'}
h+='<div class="btns"><button class="btn" onclick="rvClose()">Cancel</button><button class="btn p" id="rvgo" onclick="rvConfirm()">'+esc(p.confirm)+'</button></div>';rvShow(h)}
function rvLabels(){var b=$('rvgo');b.disabled=true;b.textContent='Building…';var tok='l'+Date.now(),n=0;google.script.run.withFailureHandler(function(e){rvDone({ok:false,msg:e.message})}).buildLabelsJob(row,tok);var T=setInterval(function(){n++;if(n>60){clearInterval(T);rvDone({ok:false,msg:'Still working - check the Certified Mail Labels folder in the client folder shortly.'});return}google.script.run.withSuccessHandler(function(s){if(!s)return;if(s.state==='done'){clearInterval(T);rvDone({ok:true,msg:s.msg,links:[{label:s.name,url:s.url}]})}else if(s.state==='error'){clearInterval(T);rvDone({ok:false,msg:s.msg})}}).getFullBuildStatus(tok)},2000)}
function rvConfirm(){if(RVP.key==='labels')return rvLabels();var v={};(RVP.fields||[]).forEach(function(f){var el=$('rf_'+f.id);if(!el)return;v[f.id]=f.type==='check'?(el.checked?'1':''):el.value});var b=$('rvgo');b.disabled=true;b.textContent='Working…';google.script.run.withSuccessHandler(rvDone).withFailureHandler(function(e){rvDone({ok:false,msg:e.message})}).runAction(row,RVP.key,v)}
function rvDone(r){var h='<h2>'+(r.ok?'✅ Done':'⚠️ Not completed')+'</h2><div class="intro">'+esc(r.msg||'')+'</div>';(r.links||[]).forEach(function(l){h+='<div><a href="'+esc(l.url)+'" target="_blank">'+esc(l.label)+'</a></div>'});h+='<div class="btns"><button class="btn p" onclick="rvClose()">Close</button></div>';rvShow(h);load();actsLoad()}
`;
