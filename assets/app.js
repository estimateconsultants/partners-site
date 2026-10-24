/* Estimate Consultants — Preferred Partners portal (no framework, no dependencies). */
(function () {
  "use strict";

  /* ===== settings ===== */
  // Same Apps Script web app the main site already uses (Referral Codes / Redemptions live in that Google Sheet).
  var API = "https://script.google.com/macros/s/AKfycbyVaMTnlWK4MFOLaBpPoAbIe7Jy4dQr3cCPSPeOGllFTQzkhUiVAKOyc2usnWcTRMRj/exec";
  var MAIN_SITE = "https://estimateconsultants.com";
  var PHONE = "910-333-6001", EMAIL = "kevin@estimateconsultants.com";
  var PRICES = { dvRetainer: 199, dvAfter: 299, tl: 299, off: 0.15 };

  /* ===== helpers ===== */
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  var state = { token: store("ecp_token") || "", me: null, joined: null, email: "" };

  function api(payload) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .catch(function () { throw new Error("We couldn't reach the server. Please check your connection and try again."); })
      .then(function (res) {
        if (res && res.ok === false) {
          var e = new Error(res.error || "Something went wrong."); e.api = true;
          if (/session has ended/i.test(e.message)) { signOutLocal(); location.hash = "#/signin"; }
          throw e;
        }
        return res;
      });
  }
  function toast(msg, bad) {
    var t = document.createElement("div"); t.className = "toast" + (bad ? " bad" : ""); t.textContent = msg; $("toasts").appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 320); }, 3200);
  }
  function busy(btn, on, label) {
    if (!btn) return; if (on) { btn.dataset.l = btn.textContent; btn.disabled = true; if (label) btn.textContent = label; } else { btn.disabled = false; if (btn.dataset.l) btn.textContent = btn.dataset.l; }
  }
  function normCode(s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 24); }
  var ICONS = {
    paypal: '<svg viewBox="0 0 24 24"><path d="M7 21l2-14h6a4 4 0 0 1 0 8h-4"/><path d="M5 21l1.2-8"/></svg>',
    venmo: '<svg viewBox="0 0 24 24"><path d="M5 6l3 13 7-9c1-1.6 1.5-3 1.5-4.3C16.5 4.8 15.6 4 14 4"/></svg>',
    check: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 14h6M15 10h2"/></svg>',
    charity: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/></svg>'
  };
  var METHOD_NAME = { paypal: "PayPal", venmo: "Venmo", check: "Check", charity: "Charity donation" };

  /* ===== router ===== */
  var VIEWS = ["home", "join", "signin", "dashboard"];
  function route() {
    var h = (location.hash || "#/").replace(/^#\/?/, "").split("?")[0] || "home";
    if (VIEWS.indexOf(h) < 0) h = "home";
    if (h === "dashboard" && !state.token) { location.replace("#/signin"); return; }
    if (h === "signin" && state.token) { location.replace("#/dashboard"); return; }
    show(h);
  }
  function show(name) {
    $$(".view").forEach(function (v) { var on = v.dataset.view === name; v.classList.remove("on"); if (on) { void v.offsetWidth; v.classList.add("on"); } });
    document.title = (name === "home" ? "Preferred Partners" : name === "join" ? "Create your code" : name === "signin" ? "Sign in" : "Dashboard") + " — Estimate Consultants";
    window.scrollTo(0, 0);
    renderNav(name);
    if (name === "join") joinReset();
    if (name === "signin") signinReset();
    if (name === "dashboard") loadDashboard();
    if (name === "home") observeReveal();
    var m = $("main"); try { m.focus({ preventScroll: true }); } catch (e) {}
  }
  function renderNav(name) {
    var n = $("navActions");
    if (state.token) {
      n.innerHTML = (state.me ? '<span class="who">' + esc(state.me.profile.firm) + "</span>" : "") +
        (name === "dashboard" ? "" : '<a class="btn btn-gold" href="#/dashboard">Dashboard</a>') +
        '<button class="btn btn-ghost" type="button" id="navOut">Sign out</button>';
      $("navOut").onclick = signOut;
    } else {
      n.innerHTML = name === "signin" ? "" : '<a class="btn btn-ghost" href="#/signin">Sign in</a>';
      if (name === "home" || name === "signin") n.innerHTML += name === "signin" ? '<a class="btn btn-gold" href="#/join">Create your code</a>' : "";
    }
  }
  function observeReveal() {
    var els = $$(".view[data-view=home] .steps li, .view[data-view=home] .panel, .view[data-view=home] .closing, .view[data-view=home] .section-head");
    els.forEach(function (e) { e.classList.add("reveal"); });
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ===== JOIN ===== */
  var codeTimer = 0, codeSeq = 0, codeOk = false;
  function joinReset() {
    state.joined = null;
    ["joinForm1", "joinForm2", "joinDone"].forEach(function (id, i) { $(id).hidden = i !== 0; });
    setProgress(1); $("jErr1").textContent = $("jErr2").textContent = "";
  }
  function setProgress(n) { $$("#joinProgress i").forEach(function (i, k) { i.classList.toggle("on", k < n); }); }
  function swap(hideId, showId) { $(hideId).hidden = true; var s = $(showId); s.hidden = false; s.style.animation = "none"; void s.offsetWidth; s.style.animation = ""; }
  function suggestCodes(firm) {
    var words = String(firm || "").toUpperCase().replace(/&/g, " ").replace(/[^A-Z0-9 ]/g, " ").split(/\s+/).filter(function (w) { return w && !/^(THE|AND|OF|LLC|LLP|PLLC|PC|PA|INC|LAW|FIRM|OFFICE|OFFICES|GROUP|ATTORNEYS|ATTORNEY|AT|ASSOCIATES)$/.test(w); });
    var out = [];
    if (words.length) { out.push(words.join("").slice(0, 14)); out.push(words[0].slice(0, 12) + "LAW"); if (words.length > 1) out.push(words.map(function (w) { return w[0]; }).join("") + "LAW"); out.push(words[0].slice(0, 10) + "PARTNER"); }
    var seen = {}; return out.map(normCode).filter(function (c) { if (c.length < 3 || seen[c]) return false; seen[c] = 1; return true; }).slice(0, 4);
  }
  function setStatus(kind, msg) {
    var s = $("jCodeStatus"), f = $("jCode").parentNode; s.className = "status " + (kind || ""); f.classList.toggle("bad", kind === "no");
    s.innerHTML = kind === "ok" ? '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg>' : kind === "no" ? '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>' : "";
    $("jErr2").style.color = kind === "ok" ? "var(--ok)" : ""; $("jErr2").textContent = msg || "";
  }
  function checkCode() {
    var code = normCode($("jCode").value); $("jTicket").textContent = code || "YOURCODE"; codeOk = false;
    clearTimeout(codeTimer);
    if (!code) { setStatus(""); return; }
    if (code.length < 3) { setStatus("no", "Codes need at least 3 letters or numbers."); return; }
    setStatus("wait"); $("jCodeStatus").className = "status wait";
    var seq = ++codeSeq;
    codeTimer = setTimeout(function () {
      api({ action: "partner_check_code", code: code }).then(function (r) {
        if (seq !== codeSeq) return;
        codeOk = !!r.available; setStatus(r.available ? "ok" : "no", r.available ? "Available — this one is yours." : r.reason);
      }).catch(function (e) { if (seq === codeSeq) setStatus("no", e.message); });
    }, 380);
  }
  $("joinForm1").addEventListener("submit", function (e) {
    e.preventDefault();
    var firm = $("jFirm").value.trim(), contact = $("jContact").value.trim(), email = $("jEmail").value.trim();
    if (!firm) return fail("jErr1", "Please enter your firm name.", "jFirm");
    if (!contact) return fail("jErr1", "Please enter your name.", "jContact");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return fail("jErr1", "Please enter a valid email address.", "jEmail");
    $("jErr1").textContent = ""; swap("joinForm1", "joinForm2"); setProgress(2);
    var sg = suggestCodes(firm); $("jSuggest").innerHTML = sg.map(function (c) { return '<button type="button" data-c="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
    if (!$("jCode").value && sg[0]) { $("jCode").value = sg[0]; }
    checkCode(); setTimeout(function () { $("jCode").focus(); }, 60);
  });
  function fail(errId, msg, focusId) { $(errId).textContent = msg; if (focusId) $(focusId).focus(); }
  $("jSuggest").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $("jCode").value = b.dataset.c; checkCode(); });
  $("jCode").addEventListener("input", function () { var p = this.selectionStart, v = normCode(this.value); if (this.value !== v) { this.value = v; try { this.setSelectionRange(p, p); } catch (e) {} } checkCode(); });
  $("jBack").onclick = function () { swap("joinForm2", "joinForm1"); setProgress(1); };
  $("joinForm2").addEventListener("submit", function (e) {
    e.preventDefault();
    var code = normCode($("jCode").value);
    if (!code) return fail("jErr2", "Please choose a code.", "jCode");
    var btn = $("jCreate"); busy(btn, true, "Creating…");
    api({ action: "partner_signup", firm: $("jFirm").value, contact: $("jContact").value, phone: $("jPhone").value, email: $("jEmail").value, code: code })
      .then(function (r) {
        state.joined = { firm: r.firm || $("jFirm").value.trim(), code: r.code, email: $("jEmail").value.trim().toLowerCase() };
        $("doneCode").textContent = r.code; $("doneFirm").textContent = state.joined.firm;
        swap("joinForm2", "joinDone"); setProgress(3);
      })
      .catch(function (err) { setStatus("", ""); $("jErr2").style.color = ""; $("jErr2").textContent = err.message; })
      .then(function () { busy(btn, false); });
  });
  $("doneFlyer").onclick = function () { if (state.joined) openFlyer(state.joined.firm, state.joined.code); };
  $("doneAccount").onclick = function () { state.email = state.joined ? state.joined.email : ""; location.hash = "#/signin"; };

  /* ===== SIGN IN ===== */
  function signinReset() {
    $("siForm1").hidden = false; $("siForm2").hidden = true; $("siErr1").textContent = $("siErr2").textContent = "";
    if (state.email) { $("siEmail").value = state.email; }
    if (state.email && state.autoSend) { state.autoSend = false; sendCode(); }
  }
  function sendCode() {
    var email = $("siEmail").value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return fail("siErr1", "Please enter a valid email address.", "siEmail");
    var btn = $("siSend"); busy(btn, true, "Sending…");
    api({ action: "partner_login_request", email: email }).then(function () {
      state.email = email; $("siSent").textContent = "If " + email + " is registered, a 6-digit code is on its way. It expires in 10 minutes.";
      $("siErr1").textContent = ""; swap("siForm1", "siForm2"); otpClear(); $$("#otp input")[0].focus();
    }).catch(function (e) {
      if (/just sent/i.test(e.message) && state.email === email) { swap("siForm1", "siForm2"); otpClear(); $$("#otp input")[0].focus(); toast("Your code is on its way."); }
      else $("siErr1").textContent = e.message;
    }).then(function () { busy(btn, false); });
  }
  $("siForm1").addEventListener("submit", function (e) { e.preventDefault(); sendCode(); });
  $("siChange").onclick = function () { swap("siForm2", "siForm1"); $("siEmail").focus(); };
  $("siResend").onclick = function () {
    api({ action: "partner_login_request", email: state.email }).then(function () { toast("A new code is on its way."); otpClear(); $$("#otp input")[0].focus(); })
      .catch(function (e) { toast(e.message, true); });
  };
  var otpIn = $$("#otp input");
  function otpClear() { otpIn.forEach(function (i) { i.value = ""; }); $("siErr2").textContent = ""; }
  function otpValue() { return otpIn.map(function (i) { return i.value; }).join(""); }
  otpIn.forEach(function (inp, i) {
    inp.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(-1);
      if (this.value && otpIn[i + 1]) otpIn[i + 1].focus();
      if (otpValue().length === 6) $("siForm2").requestSubmit();
    });
    inp.addEventListener("keydown", function (e) { if (e.key === "Backspace" && !this.value && otpIn[i - 1]) { otpIn[i - 1].focus(); otpIn[i - 1].value = ""; } if (e.key === "ArrowLeft" && otpIn[i - 1]) otpIn[i - 1].focus(); if (e.key === "ArrowRight" && otpIn[i + 1]) otpIn[i + 1].focus(); });
    inp.addEventListener("paste", function (e) {
      var t = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6); if (!t) return; e.preventDefault();
      t.split("").forEach(function (c, k) { if (otpIn[k]) otpIn[k].value = c; }); (otpIn[Math.min(t.length, 5)]).focus(); if (t.length === 6) $("siForm2").requestSubmit();
    });
  });
  $("siForm2").addEventListener("submit", function (e) {
    e.preventDefault(); var code = otpValue();
    if (code.length !== 6) return fail("siErr2", "Please enter all 6 digits.");
    var btn = $("siVerify"); busy(btn, true, "Checking…");
    api({ action: "partner_login_verify", email: state.email, otp: code }).then(function (r) {
      state.token = r.token; store("ecp_token", r.token); state.me = r; location.hash = "#/dashboard";
    }).catch(function (err) {
      $("siErr2").textContent = err.message; var o = $("otp"); o.classList.remove("shake"); void o.offsetWidth; o.classList.add("shake");
    }).then(function () { busy(btn, false); });
  });
  function signOutLocal() { state.token = ""; state.me = null; store("ecp_token", null); }
  function signOut() { var t = state.token; signOutLocal(); api({ action: "partner_logout", token: t }).catch(function () {}); location.hash = "#/"; renderNav("home"); toast("You're signed out."); }

  /* ===== DASHBOARD ===== */
  function loadDashboard() {
    if (state.me && state.me.profile) renderDash(state.me);
    else $("refs").innerHTML = '<div class="sk"></div><div class="sk"></div><div class="sk"></div>';
    api({ action: "partner_me", token: state.token }).then(function (r) { state.me = r; renderDash(r); renderNav("dashboard"); }).catch(function (e) { if (!e.api || !/session/i.test(e.message)) toast(e.message, true); });
  }
  function countUp(el, to, fmt) {
    var from = parseFloat(el.dataset.v || "0"), start = null, dur = 700; el.dataset.v = to;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || from === to) { el.textContent = fmt(to); return; }
    function tick(t) { if (!start) start = t; var p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(from + (to - from) * e); if (p < 1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }
  function renderDash(r) {
    var p = r.profile, s = r.stats;
    $("dashTitle").textContent = p.firm; $("dashCode").textContent = p.code; $("dashSince").textContent = "Preferred Partner" + (p.since ? " since " + p.since : "");
    countUp($("stSubmitted"), s.submitted, function (v) { return Math.round(v); });
    countUp($("stAppraisals"), s.appraisals, function (v) { return Math.round(v); });
    countUp($("stOwed"), s.owedAmount, function (v) { return money(v); });
    countUp($("stPaid"), s.paidAmount, function (v) { return money(v); });
    $("stOwedN").textContent = s.owed ? s.owed + " referral" + (s.owed > 1 ? "s" : "") + " · $" + s.amount + " each" : "";
    $("stPaidN").textContent = s.paid ? s.paid + " payment" + (s.paid > 1 ? "s" : "") + " sent" : "";
    var vb = $("verifyBanner"); vb.hidden = true;
    $("profile").innerHTML = [["Firm", p.firm], ["Contact", p.contact], ["Email", p.email], ["Phone", p.phone || "—"]].map(function (x) { return "<div><dt>" + x[0] + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("");
    $("cardsNote").textContent = p.cardsAt ? "Last requested " + p.cardsAt + ". Need more? We'll ship them to your office." : "Running low? Request more and we'll ship them to your office.";
    renderRefs(r); renderPayees(r);
  }
  function renderRefs(r) {
    var box = $("refs"), list = r.referrals;
    if (!list.length) { box.innerHTML = '<div class="empty"><b>Your first referral will appear here.</b>Share your flyer or your code <strong>' + esc(r.profile.code) + "</strong> with clients. You'll see each one the moment they use it.</div>"; return; }
    var byId = {}; r.payees.forEach(function (x) { byId[x.id] = x; });
    var html = '<div class="rtable"><div class="rrow head"><span>Date</span><span>Client</span><span>Status</span><span>Pay to</span></div>';
    list.forEach(function (x) {
      var pill = x.state === "paid" ? '<span class="pill paid">Paid</span>' : x.state === "owed" ? '<span class="pill owed">$' + r.stats.amount + " on the way</span>" : '<span class="pill submitted">Code used</span>';
      var pay;
      if (x.state === "paid") pay = '<span class="meta">' + esc(x.payeeLabel || "—") + "<br>" + (x.paidOn ? "Paid " + esc(x.paidOn) : "") + (x.reference ? " · " + esc(x.reference) : "") + "</span>";
      else if (!r.payees.length) pay = '<span class="meta">Add a destination to choose</span>';
      else pay = '<select class="sel" data-ref="' + x.id + '" aria-label="Who should be paid for this referral">' + r.payees.map(function (y) { return '<option value="' + esc(y.id) + '"' + (y.id === x.payeeId ? " selected" : "") + ">" + esc(y.label) + " · " + METHOD_NAME[y.method] + "</option>"; }).join("") + "</select>";
      html += '<div class="rrow"><span class="date">' + esc(x.submitted) + '</span><div class="client"><b>' + esc(x.vehicle || "Vehicle pending") + "</b><span>" + esc(x.client) + "</span></div><div>" + pill + '</div><div class="payto">' + pay + "</div></div>";
    });
    box.innerHTML = html + "</div>";
  }
  $("refs").addEventListener("change", function (e) {
    var s = e.target.closest("select[data-ref]"); if (!s) return; s.disabled = true;
    api({ action: "partner_assign_payee", token: state.token, referralId: s.dataset.ref, payeeId: s.value }).then(function (r) { state.me = r; renderDash(r); toast("Saved."); })
      .catch(function (err) { toast(err.message, true); loadDashboard(); });
  });
  function renderPayees(r) {
    var box = $("payees");
    if (!r.payees.length) { box.innerHTML = '<div class="empty" style="padding:14px 4px 18px"><b style="font-size:22px">Choose where the $50 goes</b>PayPal, Venmo, check, or a charity of your choice.</div>'; return; }
    box.innerHTML = r.payees.map(function (x) {
      var def = x.id === r.defaultId, det = x.method === "charity" ? x.detail + (x.extra ? "\n" + x.extra : "") : x.detail;
      return '<div class="payee' + (def ? " def" : "") + '"><div class="mico">' + ICONS[x.method] + '</div><div><b>' + esc(x.label) + '</b><small>' + METHOD_NAME[x.method] + "</small><small>" + esc(det) + "</small>" + (def ? '<span class="tag">Default</span>' : "") + '</div><div class="mini">' +
        (def ? "" : '<button type="button" data-act="def" data-id="' + esc(x.id) + '">Make default</button>') + '<button type="button" data-act="edit" data-id="' + esc(x.id) + '">Edit</button><button type="button" data-act="del" data-id="' + esc(x.id) + '">Remove</button></div></div>';
    }).join("");
  }
  function savePayees(list, def, okMsg) {
    return api({ action: "partner_save_payees", token: state.token, payees: list, defaultId: def }).then(function (r) { state.me = r; renderDash(r); toast(okMsg || "Saved."); return r; });
  }
  $("payees").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b || !state.me) return;
    var id = b.dataset.id, list = state.me.payees.slice(), act = b.dataset.act;
    if (act === "edit") return openPayee(list.filter(function (x) { return x.id === id; })[0]);
    if (act === "def") return savePayees(list, id, "Default updated.").catch(function (er) { toast(er.message, true); });
    if (act === "del") {
      if (!confirm("Remove this payout destination? Referrals assigned to it will use your default.")) return;
      list = list.filter(function (x) { return x.id !== id; }); savePayees(list, state.me.defaultId === id ? "" : state.me.defaultId, "Removed.").catch(function (er) { toast(er.message, true); });
    }
  });
  $("copyCode").onclick = function () {
    var c = $("dashCode").textContent, b = this;
    (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).catch(function () { var t = document.createElement("textarea"); t.value = c; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) {} t.remove(); })
      .then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); });
  };
  $("dashFlyer").onclick = function () { if (state.me) openFlyer(state.me.profile.firm, state.me.profile.code); };

  /* ===== modals ===== */
  var lastFocus = null;
  function openModal(id) { lastFocus = document.activeElement; var m = $(id); m.hidden = false; document.body.style.overflow = "hidden"; var f = m.querySelector("input:not([type=radio]):not([type=checkbox]),button.btn"); if (f) setTimeout(function () { try { f.focus(); } catch (e) {} }, 60); }
  function closeModals() { $$(".overlay").forEach(function (m) { m.hidden = true; }); document.body.style.overflow = ""; if (lastFocus) try { lastFocus.focus(); } catch (e) {} }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-close]") || (e.target.classList && e.target.classList.contains("overlay"))) closeModals(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModals(); });

  /* payee form */
  var editingId = null;
  var METHOD_UI = {
    paypal: { label: "PayPal email", type: "email", hint: "We'll send the $50 to this PayPal account.", area: false },
    venmo: { label: "Venmo username (e.g. @maria-lopez)", type: "text", hint: "We'll send the $50 to this Venmo account.", area: false },
    check: { label: "Name and mailing address for the check", type: "text", hint: "We'll mail a check to this name and address.", area: true },
    charity: { label: "Charity name", type: "text", hint: "We'll donate the $50 and email you proof of receipt.", area: false, extra: "Website or city (helps us find the right charity)" }
  };
  function applyMethod(m) {
    var u = METHOD_UI[m], inp = $("pDetail"), ta = $("pDetailArea");
    $("pDetailLabel").textContent = u.label; $("pHint").textContent = u.hint;
    inp.hidden = u.area; ta.hidden = !u.area; $("pDetailLabel").setAttribute("for", u.area ? "pDetailArea" : "pDetail");
    if (!u.area) inp.type = u.type;
    $("pExtraWrap").hidden = !u.extra; if (u.extra) $("pExtraLabel").textContent = u.extra;
  }
  $("pMethod").addEventListener("change", function (e) { if (e.target.name === "pm") applyMethod(e.target.value); });
  function openPayee(p) {
    editingId = p ? p.id : null; $("payeeTitle").textContent = p ? "Edit destination" : "Add a destination"; $("pErr").textContent = "";
    $("pLabel").value = p ? p.label : ""; var m = p ? p.method : "paypal"; $$("input[name=pm]").forEach(function (r) { r.checked = r.value === m; });
    applyMethod(m); $("pDetail").value = $("pDetailArea").value = p ? p.detail : ""; $("pExtra").value = p ? p.extra || "" : "";
    openModal("payeeModal");
  }
  $("addPayee").onclick = function () { openPayee(null); };
  $("payeeForm").addEventListener("submit", function (e) {
    e.preventDefault(); if (!state.me) return;
    var m = ($$("input[name=pm]").filter(function (r) { return r.checked; })[0] || {}).value || "paypal";
    var entry = { id: editingId || "", label: $("pLabel").value.trim(), method: m, detail: (METHOD_UI[m].area ? $("pDetailArea").value : $("pDetail").value).trim(), extra: METHOD_UI[m].extra ? $("pExtra").value.trim() : "" };
    if (!entry.label) { $("pErr").textContent = "Please say who this is for."; return; }
    if (!entry.detail) { $("pErr").textContent = "Please fill in the payment details."; return; }
    var list = state.me.payees.slice(); var idx = list.findIndex(function (x) { return x.id === editingId; });
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    var btn = $("pSave"); busy(btn, true, "Saving…");
    savePayees(list, state.me.defaultId, "Destination saved.").then(closeModals).catch(function (er) { $("pErr").textContent = er.message; }).then(function () { busy(btn, false); });
  });

  /* business card request */
  $("reqCards").onclick = function () { if (!state.me) return; $("cShip").value = state.me.profile.ship || ""; $("cNote").value = ""; $("cErr").textContent = ""; openModal("cardsModal"); };
  $("cardsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if ($("cShip").value.replace(/\s/g, "").length < 10) { $("cErr").textContent = "Please enter the name and full mailing address to ship to."; return; }
    var btn = $("cSend"); busy(btn, true, "Sending…");
    api({ action: "partner_request_cards", token: state.token, ship: $("cShip").value, note: $("cNote").value })
      .then(function (r) { state.me = r; renderDash(r); closeModals(); toast("Request sent. We'll ship your cards soon."); })
      .catch(function (er) { $("cErr").textContent = er.message; }).then(function () { busy(btn, false); });
  });

  /* profile form */
  $("editProfile").onclick = function () { if (!state.me) return; var p = state.me.profile; $("eFirm").value = p.firm; $("eContact").value = p.contact; $("ePhone").value = p.phone; $("eErr").textContent = ""; openModal("profileModal"); };
  $("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();
    api({ action: "partner_update_profile", token: state.token, firm: $("eFirm").value, contact: $("eContact").value, phone: $("ePhone").value })
      .then(function (r) { state.me = r; renderDash(r); renderNav("dashboard"); closeModals(); toast("Details updated."); }).catch(function (er) { $("eErr").textContent = er.message; });
  });

  /* ===== FLYER ===== */
  var flyerCtx = null;
  function fit(el, maxPx, minPx, availW) { var s = maxPx; el.style.fontSize = s + "px"; while (el.scrollWidth > availW && s > minPx) { s -= 1; el.style.fontSize = s + "px"; } }
  function flyerHtml(firm, code, withQr) {
    var off = PRICES.off, r = function (n) { return Math.round(n * (1 - off)); };
    var logo = '<img src="assets/logo.png" alt="" onerror="this.remove()">';
    var qr = withQr ? '<div class="fl-qr">' + window.EC_QR.svg(MAIN_SITE, { dark: "#17181B", light: "#FFFFFF", margin: 1, label: "QR code to estimateconsultants.com" }) + "<span>SCAN TO START</span></div>" : "";
    return '<div class="flyer">' +
      '<div class="fl-top"><div class="fl-brandrow"><div class="fl-brand">' + logo + '<div class="fl-word"><b>ESTIMATE</b> CONSULTANTS</div></div><div class="fl-tag">INDEPENDENT VEHICLE APPRAISERS<br>ASCAA-CERTIFIED · LICENSED</div></div><div class="fl-rule"></div>' +
      '<div class="fl-by">RECOMMENDED BY</div><div class="fl-firm" data-fit="40,22,720">' + esc(firm) + "</div>" +
      '<div class="fl-head">Make sure your vehicle\'s<br><em>full value</em> is counted.</div>' +
      '<div class="fl-sub">After a collision, your vehicle can be worth far less than the insurance company\'s first number. <strong>' + esc(firm) + "</strong> works with Estimate Consultants to document what your vehicle is truly worth, so your property damage claim reflects it.</div></div>" +
      '<div class="fl-body">' +
      '<div class="fl-code"><div><div class="fl-codelbl">YOUR PARTNER CODE · 15% OFF EVERYTHING</div><div class="fl-codeval" data-fit="64,30,440">' + esc(code) + '</div><div class="fl-codehow">Enter this code in the <b>Partner section at the top of estimateconsultants.com</b> before you submit your vehicle details. The 15% comes off every invoice.</div></div>' + qr + "</div>" +
      '<div class="fl-cards">' +
      '<div class="fl-card"><div class="k">VEHICLE REPAIRED · NOT AT FAULT</div><h3>Diminished Value</h3><p>An accident history lowers resale value, even after quality repairs. We pursue the claim from the at-fault insurer.</p><div class="fl-price"><div class="fl-prow h"><span></span><span>STANDARD</span><span class="w">WITH CODE</span></div><div class="fl-prow"><span class="l">Retainer</span><span class="s">$' + PRICES.dvRetainer + '</span><span class="n">$' + r(PRICES.dvRetainer) + '</span></div><div class="fl-prow"><span class="l">Paid after offer</span><span class="s">$' + PRICES.dvAfter + '</span><span class="n">$' + r(PRICES.dvAfter) + '</span></div><div class="fl-note"><span><b>Money-back guarantee.</b> If the insurer\'s offer doesn\'t cover our fee, we refund it.</span></div></div></div>' +
      '<div class="fl-card"><div class="k">TOTAL LOSS · YOUR OWN INSURER</div><h3>Appraisal Clause</h3><p>If your own insurer totals the vehicle with a low offer, we invoke the appraisal clause in your policy and act as your appraiser.</p><div class="fl-price"><div class="fl-prow h"><span></span><span>STANDARD</span><span class="w">WITH CODE</span></div><div class="fl-prow"><span class="l">Flat fee</span><span class="s">$' + PRICES.tl + '</span><span class="n">$' + r(PRICES.tl) + "</span></div></div></div>" +
      "</div>" +
      '<div class="fl-steps"><div class="fl-step"><i>1</i><b>Enter your code</b><span>At estimateconsultants.com, in the Partner section.</span></div><div class="fl-step"><i>2</i><b>Tell us about your vehicle</b><span>Year, make, model, mileage and your claim details.</span></div><div class="fl-step"><i>3</i><b>We take it from there</b><span>We document the value and deal with the insurer for you.</span></div></div>' +
      "</div>" +
      '<div class="fl-foot"><span>' + PHONE + "</span><span>" + EMAIL + "</span><span>estimateconsultants.com</span></div></div>";
  }
  function fitFlyer(root) { $$("[data-fit]", root).forEach(function (el) { var a = el.dataset.fit.split(",").map(Number); fit(el, a[0], a[1], a[2]); }); }
  function renderFlyerPreview() {
    if (!flyerCtx) return;
    var scale = $("flyerScale"), stage = $("flyerStage");
    var availW = Math.max(240, stage.clientWidth - 36), availH = Math.max(320, window.innerHeight * 0.58);
    var k = Math.min(1, availW / 816, availH / 1056);
    scale.innerHTML = '<div class="flyer-inner" style="transform:scale(' + k + ')">' + flyerHtml(flyerCtx.firm, flyerCtx.code, $("optQr").checked) + "</div>";
    scale.style.width = Math.round(816 * k) + "px"; scale.style.height = Math.round(1056 * k) + "px"; stage.style.height = "";
    var run = function () { fitFlyer(scale); }; run(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  }
  function openFlyer(firm, code) { flyerCtx = { firm: firm, code: code }; openModal("flyerModal"); renderFlyerPreview(); setTimeout(renderFlyerPreview, 80); }
  $("optQr").addEventListener("change", renderFlyerPreview);
  window.addEventListener("resize", function () { if (!$("flyerModal").hidden) renderFlyerPreview(); });
  $("printBtn").onclick = function () {
    if (!flyerCtx) return; var b = this; b.classList.add("busy"); b.querySelector("span").textContent = "Preparing";
    var root = $("printRoot"); root.innerHTML = flyerHtml(flyerCtx.firm, flyerCtx.code, $("optQr").checked); root.style.display = "block";
    var go = function () {
      fitFlyer(root); document.body.classList.add("printing");
      var done = function () { document.body.classList.remove("printing"); root.style.display = ""; root.innerHTML = ""; b.classList.remove("busy"); b.querySelector("span").textContent = "Print flyer"; window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      setTimeout(function () { window.print(); if (!("onafterprint" in window)) done(); }, 250);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { return Promise.all($$("img", root).map(function (i) { return i.complete ? 0 : new Promise(function (r) { i.onload = i.onerror = r; }); })); }).then(go);
  };

  /* ===== boot ===== */
  $("yr").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  // "Finish setting up my account" from the join screen should send the code straight away
  $("doneAccount").addEventListener("click", function () { state.autoSend = true; });
  route();
})();
