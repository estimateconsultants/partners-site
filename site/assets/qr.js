/* Minimal QR Code encoder (byte mode, error correction M, versions 1-10). Self-contained, no dependencies.
   Usage: var m = EC_QR.encode("https://example.com");  // m = array of rows of booleans
          var svg = EC_QR.svg("https://example.com", {dark:"#000", light:"#fff", margin:2}); */
(function (root) {
  "use strict";
  var ECC_PER_BLOCK = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26];   // ver 1..10, level M
  var NUM_BLOCKS = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5];

  function rawModules(v) {
    var r = (16 * v + 128) * v + 64;
    if (v >= 2) { var n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  }
  function gfMul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; }
  function rsDivisor(d) {
    var r = []; for (var i = 0; i < d - 1; i++) r.push(0); r.push(1);
    var root = 1;
    for (i = 0; i < d; i++) { for (var j = 0; j < d; j++) { r[j] = gfMul(r[j], root); if (j + 1 < d) r[j] ^= r[j + 1]; } root = gfMul(root, 2); }
    return r;
  }
  function rsRemainder(data, div) {
    var r = div.map(function () { return 0; });
    data.forEach(function (b) { var f = b ^ r.shift(); r.push(0); div.forEach(function (c, i) { r[i] ^= gfMul(c, f); }); });
    return r;
  }
  function utf8(str) { return Array.prototype.slice.call(unescape(encodeURIComponent(str))).map(function (c) { return c.charCodeAt(0); }); }

  function encode(text) {
    var bytes = utf8(String(text)), ver, cap;
    for (ver = 1; ver <= 10; ver++) {
      cap = Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ver - 1] * NUM_BLOCKS[ver - 1];
      var headBits = 4 + (ver < 10 ? 8 : 16);
      if (headBits + bytes.length * 8 <= cap * 8) break;
    }
    if (ver > 10) throw new Error("Text too long for QR");
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, cap * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    for (var pad = 0xEC; bits.length < cap * 8; pad ^= 0xEC ^ 0x11) put(pad, 8);
    var data = []; for (var i = 0; i < bits.length; i += 8) { var b = 0; for (var k = 0; k < 8; k++) b = (b << 1) | bits[i + k]; data.push(b); }

    // split into blocks, add ECC, interleave
    var nb = NUM_BLOCKS[ver - 1], eccLen = ECC_PER_BLOCK[ver - 1], raw = Math.floor(rawModules(ver) / 8);
    var shortCount = nb - raw % nb, shortLen = Math.floor(raw / nb), blocks = [], div = rsDivisor(eccLen);
    for (i = 0, k = 0; i < nb; i++) {
      var dat = data.slice(k, k + shortLen - eccLen + (i < shortCount ? 0 : 1)); k += dat.length;
      var ecc = rsRemainder(dat, div);
      if (i < shortCount) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    var all = [];
    for (i = 0; i < blocks[0].length; i++) blocks.forEach(function (blk, j) { if (i !== shortLen - eccLen || j >= shortCount) all.push(blk[i]); });

    // matrix
    var size = ver * 4 + 17, M = [], F = [];
    for (i = 0; i < size; i++) { M.push(new Array(size).fill(false)); F.push(new Array(size).fill(false)); }
    function setF(x, y, dark) { M[y][x] = dark; F[y][x] = true; }
    for (i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    function finder(cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy; if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d !== 2 && d !== 4); } }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    if (ver > 1) {
      var na = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2, pos = [6];
      for (var p = size - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
      pos.forEach(function (ax, ia) { pos.forEach(function (ay, ib) {
        if ((ia === 0 && ib === 0) || (ia === 0 && ib === na - 1) || (ia === na - 1 && ib === 0)) return;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) setF(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }); });
    }
    function formatBits(mask) {
      var d = mask, rem = d; for (var q = 0; q < 10; q++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var fb = ((d << 10) | rem) ^ 0x5412, bit = function (n) { return ((fb >>> n) & 1) !== 0; };
      for (var a = 0; a <= 5; a++) setF(8, a, bit(a));
      setF(8, 7, bit(6)); setF(8, 8, bit(7)); setF(7, 8, bit(8));
      for (a = 9; a < 15; a++) setF(14 - a, 8, bit(a));
      for (a = 0; a < 8; a++) setF(size - 1 - a, 8, bit(a));
      for (a = 8; a < 15; a++) setF(8, size - 15 + a, bit(a));
      setF(8, size - 8, true);
    }
    formatBits(0);
    if (ver >= 7) {
      var rem = ver; for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vb = (ver << 12) | rem;
      for (i = 0; i < 18; i++) { var bt = ((vb >>> i) & 1) !== 0, a2 = size - 11 + i % 3, b2 = Math.floor(i / 3); setF(a2, b2, bt); setF(b2, a2, bt); }
    }
    // place codewords
    var n = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var j = 0; j < 2; j++) {
        var x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!F[y][x] && n < all.length * 8) { M[y][x] = ((all[n >>> 3] >>> (7 - (n & 7))) & 1) !== 0; n++; }
      }
    }
    function mask(m) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++) {
        var inv; switch (m) {
          case 0: inv = (x + y) % 2 === 0; break; case 1: inv = y % 2 === 0; break; case 2: inv = x % 3 === 0; break; case 3: inv = (x + y) % 3 === 0; break;
          case 4: inv = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break; case 5: inv = x * y % 2 + x * y % 3 === 0; break;
          case 6: inv = (x * y % 2 + x * y % 3) % 2 === 0; break; default: inv = ((x + y) % 2 + x * y % 3) % 2 === 0;
        }
        if (!F[y][x] && inv) M[y][x] = !M[y][x];
      }
    }
    function penalty() {
      var s = 0, y, x, run, dark = 0;
      for (y = 0; y < size; y++) { run = 1; for (x = 1; x < size; x++) { if (M[y][x] === M[y][x - 1]) { run++; if (run === 5) s += 3; else if (run > 5) s++; } else run = 1; } }
      for (x = 0; x < size; x++) { run = 1; for (y = 1; y < size; y++) { if (M[y][x] === M[y - 1][x]) { run++; if (run === 5) s += 3; else if (run > 5) s++; } else run = 1; } }
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) if (M[y][x] === M[y][x + 1] && M[y][x] === M[y + 1][x] && M[y][x] === M[y + 1][x + 1]) s += 3;
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (M[y][x]) dark++;
      s += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
      return s;
    }
    var best = 0, bestP = Infinity;
    for (var m = 0; m < 8; m++) { mask(m); formatBits(m); var pn = penalty(); if (pn < bestP) { bestP = pn; best = m; } mask(m); }
    mask(best); formatBits(best);
    return M;
  }
  function svg(text, o) {
    o = o || {}; var m = encode(text), n = m.length, q = o.margin == null ? 2 : o.margin, d = "";
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (m[y][x]) d += "M" + (x + q) + " " + (y + q) + "h1v1h-1z";
    var t = n + q * 2;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + t + " " + t + '" shape-rendering="crispEdges" role="img" aria-label="' + (o.label || "QR code") + '"><rect width="' + t + '" height="' + t + '" fill="' + (o.light || "#fff") + '"/><path d="' + d + '" fill="' + (o.dark || "#000") + '"/></svg>';
  }
  root.EC_QR = { encode: encode, svg: svg };
})(typeof window !== "undefined" ? window : this);
