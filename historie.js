/* Historien i toppen af siden: ensfarvede scener, der skifter, når man scroller.
   Alt styres af scroll. Kun lamper og lyn blinker af sig selv. jvGaaTil(4.5) hopper til et sted, til afprøvning. */
(function () {
  "use strict";
  var ROED = "#d4080f", HUD = "#f0d0b4", HUD2 = "#dcb697", NAVY = "#25324a", SKJORTE = "#31486b", VEST = "#e9e23f", VEST2 = "#c9c42a", GRAA = "#c7ccd1";
  var KORT = window.JV_KORT;
  var auto = window.JV_AUTO || null;
  var slut = 15.6;

  var stage = document.getElementById("historie");
  var boks = stage.querySelector(".h-scene");
  var host = document.getElementById("hSvg");

  function klem(v) { return Math.max(0, Math.min(1, v)); }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function glat(u) { u = klem(u); return u * u * (3 - 2 * u); }
  function del(u, a, b) { return glat((u - a) / (b - a)); }
  function $(id) { return document.getElementById(id); }
  function pos(el, x, y, r, s) { el.setAttribute("transform", "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" + (r ? " rotate(" + r.toFixed(2) + ")" : "") + (s !== undefined && s !== 1 ? " scale(" + s.toFixed(3) + ")" : "")); }

  /* ---------- Tegninger ---------- */
  function n42(id) {
    return '<g id="' + id + '"><ellipse cx="0" cy="3" rx="66" ry="8" fill="url(#skygge)"/><rect x="-48" y="-14" width="96" height="15" rx="3" fill="#232427"/><rect x="-30" y="-23" width="60" height="10" rx="2" fill="#303236"/>' +
      '<rect x="-3" y="-188" width="6" height="20" fill="#9a9da1"/><rect x="-29" y="-173" width="58" height="152" rx="6" fill="#c5c7c9"/><rect x="-26" y="-170" width="52" height="146" rx="4" fill="url(#n42s)"/></g>';
  }
  function skilt(id, type) {
    var s = '<g id="' + id + '"><ellipse cx="0" cy="2" rx="44" ry="7" fill="url(#skygge)"/><rect x="-36" y="-9" width="72" height="10" rx="3" fill="#1e1f22"/><rect x="-3" y="-150" width="6" height="142" fill="#8d9298"/>';
    if (type === "A31" || type === "A72") {
      s += '<path d="M0 -226 L50 -142 Q53 -136 46 -136 L-46 -136 Q-53 -136 -50 -142 Z" fill="' + ROED + '"/><path d="M0 -206 L33 -150 L-33 -150 Z" fill="#fff"/>';
      if (type === "A31") s += '<circle cx="-2" cy="-185" r="4.5" fill="#151515"/><path d="M-3 -179 L-7 -165 L-15 -153 M-7 -165 L1 -153 M-2 -175 L10 -168 L15 -153" stroke="#151515" stroke-width="4" fill="none" stroke-linecap="round"/><circle class="glod" cx="0" cy="-240" r="34" fill="url(#glod)" opacity="0"/><circle class="lmp" cx="0" cy="-238" r="8" fill="#8f7a35"/>';
      else s += '<rect x="-7" y="-193" width="14" height="38" rx="2" fill="#151515"/><circle cx="0" cy="-186" r="3.6" fill="#e3131b"/><circle cx="0" cy="-174" r="3.6" fill="#e8b20f"/><circle cx="0" cy="-162" r="3.6" fill="#2f9a4a"/>';
    } else {
      s += '<circle cx="0" cy="-185" r="46" fill="' + ROED + '"/><circle cx="0" cy="-185" r="33" fill="#fff"/>';
      if (type === "C55") s += '<text x="0" y="-172" text-anchor="middle" font-size="36" font-weight="700" fill="#151515">50</text>';
      else s += '<rect x="-24" y="-192" width="20" height="17" rx="3" fill="' + ROED + '"/><rect x="-20" y="-200" width="12" height="9" rx="2" fill="' + ROED + '"/><rect x="4" y="-192" width="20" height="17" rx="3" fill="#151515"/><rect x="8" y="-200" width="12" height="9" rx="2" fill="#151515"/>';
    }
    return s + "</g>";
  }
  function bom(id) {
    return '<g id="' + id + '"><ellipse cx="0" cy="2" rx="100" ry="8" fill="url(#skygge)"/><rect x="-92" y="-8" width="36" height="9" rx="3" fill="#1e1f22"/><rect x="56" y="-8" width="36" height="9" rx="3" fill="#1e1f22"/><rect x="-77" y="-92" width="5" height="86" fill="#8d9298"/><rect x="72" y="-92" width="5" height="86" fill="#8d9298"/>' +
      '<rect x="-96" y="-104" width="192" height="24" rx="2" fill="url(#bomS)"/><rect x="-96" y="-104" width="192" height="24" rx="2" fill="url(#plade)"/>' +
      '<circle class="glod" cx="-74" cy="-116" r="30" fill="url(#glod)" opacity="0"/><circle class="glod" cx="74" cy="-116" r="30" fill="url(#glod)" opacity="0"/><circle class="lmp" cx="-74" cy="-116" r="8" fill="#8f7a35"/><circle class="lmp" cx="74" cy="-116" r="8" fill="#8f7a35"/></g>';
  }
  function signal(id) {
    return '<g id="' + id + '"><ellipse cx="0" cy="2" rx="60" ry="8" fill="url(#skygge)"/><rect x="-34" y="-46" width="68" height="46" rx="4" fill="url(#kasse)"/><rect x="-5" y="-210" width="10" height="168" fill="#8d9298"/><rect x="-22" y="-290" width="44" height="100" rx="8" fill="#1c1d20"/>' +
      '<circle class="r" cx="0" cy="-268" r="11" fill="#4a1414"/><circle class="y" cx="0" cy="-240" r="11" fill="#4a3c14"/><circle class="g" cx="0" cy="-212" r="11" fill="#14401f"/></g>';
  }
  function vito(id) {
    var s = '<g id="' + id + '"><ellipse cx="0" cy="4" rx="285" ry="16" fill="url(#skygge)"/>' +
      '<path d="M-255 -34 L-197 -34 A42 42 0 0 1 -113 -34 L113 -34 A42 42 0 0 1 197 -34 L250 -34 Q262 -38 262 -56 L258 -86 Q250 -104 220 -110 L172 -124 L108 -188 Q98 -194 80 -194 L-230 -194 Q-252 -194 -255 -172 Z" fill="url(#lak)"/>' +
      '<path d="M18 -130 L158 -130 L102 -184 L18 -184 Z" fill="url(#rude)"/>' +
      '<path d="M-255 -88 H261 L259 -78 H-255 Z" fill="' + ROED + '"/>' +
      '<path d="M-255 -54 H-204 A42 42 0 0 0 -207 -34 H-255 Z M-106 -54 H106 A42 42 0 0 0 103 -34 H-103 A42 42 0 0 0 -106 -54 Z M204 -54 H262 Q262 -38 250 -34 H207 A42 42 0 0 0 204 -54 Z" fill="#26282c"/>' +
      '<path d="M10 -60 V-188 M108 -60 V-126" stroke="#000" stroke-opacity=".22" stroke-width="2"/>' +
      '<rect x="222" y="-104" width="30" height="13" rx="4" fill="#fff6d6"/><rect x="-255" y="-138" width="6" height="34" rx="2" fill="#a51217"/><rect x="150" y="-132" width="14" height="12" rx="3" fill="#1b1c1f"/>' +
      '<image href="billeder/logo.svg" x="-218" y="-176" width="196" height="54"/>' +
      '<rect x="-40" y="-204" width="110" height="10" rx="3" fill="#1b1c1f"/>' +
      '<circle class="bk1" cx="-28" cy="-212" r="46" fill="url(#glod)" opacity="0"/><circle class="bk2" cx="58" cy="-212" r="46" fill="url(#glod)" opacity="0"/><rect x="-37" y="-218" width="18" height="14" rx="4" fill="#ffc21f"/><rect x="49" y="-218" width="18" height="14" rx="4" fill="#ffc21f"/>';
    [-155, 155].forEach(function (x) { s += '<circle cx="' + x + '" cy="-34" r="35" fill="#17181a"/><circle cx="' + x + '" cy="-34" r="18" fill="#b9bdc2"/><circle cx="' + x + '" cy="-34" r="6" fill="#5e6267"/>'; });
    return s + "</g>";
  }
  function person(id) {
    return '<g id="' + id + '"><ellipse cx="0" cy="6" rx="150" ry="20" fill="url(#skygge)"/>' +
      '<path d="M-50 -226 H-8 L-12 -10 H-46 Z M8 -226 H50 L46 -10 H12 Z" fill="url(#bukser)"/><path d="M-52 -14 H-10 V2 H-62 Q-62 -10 -52 -14 Z M10 -14 H52 Q62 -10 62 2 H10 Z" fill="#141518"/>' +
      '<path d="M-74 -386 Q-74 -400 -56 -402 H56 Q74 -400 74 -386 L66 -210 H-66 Z" fill="' + SKJORTE + '"/>' +
      '<path d="M-74 -386 Q-74 -400 -56 -402 H-16 L-6 -210 H-66 Z M74 -386 Q74 -400 56 -402 H16 L6 -210 H66 Z" fill="url(#vest)"/>' +
      '<path d="M-71 -300 L-9 -300 L-8 -282 L-70 -282 Z M71 -300 L9 -300 L8 -282 L70 -282 Z M-69 -256 L-7 -256 L-6 -238 L-68 -238 Z M69 -256 L7 -256 L6 -238 L68 -238 Z" fill="' + GRAA + '"/>' +
      '<path d="M-10 -402 H10 L5 -320 L0 -306 L-5 -320 Z" fill="' + ROED + '"/>' +
      '<rect x="-20" y="-426" width="40" height="30" fill="' + HUD2 + '"/>' +
      '<circle cx="0" cy="-452" r="50" fill="url(#hud)"/><circle cx="-50" cy="-448" r="9" fill="' + HUD2 + '"/><circle cx="50" cy="-448" r="9" fill="' + HUD2 + '"/>' +
      '<g id="' + id + 'Presset"><path d="M-30 -466 L-12 -458 M30 -466 L12 -458" stroke="#2a211b" stroke-width="5" stroke-linecap="round"/><path d="M-30 -448 L-14 -444 M30 -448 L14 -444" stroke="#2a211b" stroke-width="5" stroke-linecap="round"/><path d="M-16 -422 Q-8 -432 0 -424 T16 -422" fill="none" stroke="#2a211b" stroke-width="4.5" stroke-linecap="round"/></g>' +
      '<g id="' + id + 'Glad" opacity="0"><path d="M-30 -466 Q-21 -473 -12 -466 M30 -466 Q21 -473 12 -466" fill="none" stroke="#2a211b" stroke-width="5" stroke-linecap="round"/><circle cx="-20" cy="-448" r="5" fill="#2a211b"/><circle cx="20" cy="-448" r="5" fill="#2a211b"/><path d="M-22 -428 Q0 -404 22 -428 Z" fill="#fff"/></g>' +
      '<path d="M-50 -476 A50 50 0 0 1 50 -476 Z" fill="url(#hjelm)"/><rect x="-8" y="-526" width="16" height="50" fill="' + ROED + '"/><rect x="-62" y="-480" width="124" height="11" rx="5.5" fill="#f2f2ef"/>' +
      '<path id="' + id + 'AV" fill="none" stroke="' + SKJORTE + '" stroke-width="40" stroke-linecap="round"/><circle id="' + id + 'HV" r="20" fill="' + HUD + '"/>' +
      '<path id="' + id + 'AH" fill="none" stroke="' + SKJORTE + '" stroke-width="40" stroke-linecap="round"/><circle id="' + id + 'HH" r="20" fill="' + HUD + '"/>' +
      '<path id="' + id + 'T" stroke="' + HUD + '" stroke-width="13" stroke-linecap="round" opacity="0"/></g>';
  }
  function arbejder(x, y, ret, vest) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + ret * 0.36 + ' .36)"><ellipse cx="0" cy="6" rx="110" ry="16" fill="url(#skygge)"/><path d="M-46 -226 H-8 L-12 -8 H-42 Z M8 -226 H46 L42 -8 H12 Z" fill="#25324a"/><path d="M-66 -388 Q-66 -402 -48 -402 H48 Q66 -402 66 -388 L58 -210 H-58 Z" fill="' + vest + '"/><path d="M-62 -300 H62 V-282 H-62 Z M-60 -256 H60 V-238 H-60 Z" fill="' + GRAA + '"/><circle cx="20" cy="-452" r="50" fill="' + HUD + '"/><path d="M-30 -470 A50 50 0 0 1 70 -470 Z" fill="#f4f4f1"/>' +
      '<g class="hugge"><path d="M60 -380 Q130 -320 120 -240" fill="none" stroke="' + vest + '" stroke-width="36" stroke-linecap="round"/><circle cx="120" cy="-232" r="20" fill="' + HUD + '"/><path d="M150 -360 L100 -30" stroke="#6d5a42" stroke-width="10"/><path d="M84 -38 L118 -32 L108 12 L82 6 Z" fill="#4a4d52"/></g></g>';
  }
  function haand(id) {
    return '<g id="' + id + '" opacity="0"><path d="M0 -10 V900" stroke="url(#aermel)" stroke-width="124" stroke-linecap="butt"/><rect x="-62" y="46" width="124" height="26" fill="' + GRAA + '"/>' +
      '<rect x="-66" y="-112" width="132" height="120" rx="46" fill="' + HUD + '"/><path d="M-32 -92 V-240" stroke="' + HUD + '" stroke-width="36" stroke-linecap="round"/><path d="M-32 -180 V-240" stroke="#f6dcc4" stroke-width="20" stroke-linecap="round" opacity=".6"/>' +
      '<rect x="-10" y="-136" width="30" height="60" rx="15" fill="' + HUD2 + '"/><rect x="24" y="-128" width="28" height="56" rx="14" fill="' + HUD2 + '"/><path d="M-66 -44 L-96 -96" stroke="' + HUD + '" stroke-width="30" stroke-linecap="round"/></g>';
  }
  function papir(id, indhold) {
    return '<g id="' + id + '"><g class="prik"><rect x="-96" y="-112" width="200" height="236" rx="4" fill="#000" opacity=".16" transform="translate(4 10)"/><rect x="-100" y="-120" width="200" height="236" rx="4" fill="#fbfaf6"/>' + indhold + "</g></g>";
  }
  var kalInd = '<rect x="-100" y="-120" width="200" height="42" fill="' + ROED + '"/><text x="-84" y="-92" font-size="22" font-weight="600" fill="#fff">Kalender</text>';
  for (var kr = 0; kr < 5; kr++) for (var ko = 0; ko < 6; ko++) {
    var kx = -86 + ko * 29, ky = -66 + kr * 35, kf = (kr * 7 + ko * 3) % 5 === 1;
    kalInd += '<rect x="' + kx + '" y="' + ky + '" width="24" height="29" rx="2" fill="' + (kf ? "#f9d7d8" : "#edece8") + '"/>' + (kf ? '<path d="M' + (kx + 6) + " " + (ky + 8) + "l12 13m0 -13l-12 13" + '" stroke="' + ROED + '" stroke-width="3.5" stroke-linecap="round"/>' : "");
  }
  var vagInd = '<text x="-84" y="-86" font-size="24" font-weight="600" fill="#17181a">Vagtplan</text><rect x="-84" y="-72" width="168" height="2" fill="#17181a"/>';
  [[0, 74, 0], [40, 90, 1], [8, 60, 0], [56, 70, 1], [20, 104, 0], [0, 50, 1]].forEach(function (r, i) {
    var y = -56 + i * 28;
    vagInd += '<rect x="-84" y="' + y + '" width="36" height="16" rx="2" fill="#d6d5d0"/><rect x="' + (-40 + r[0]) + '" y="' + y + '" width="' + r[1] + '" height="16" rx="2" fill="' + (r[2] ? ROED : "#26282c") + '"/>';
  });
  var parInd = '<text x="0" y="-22" text-anchor="middle" font-size="96" font-weight="600" fill="' + ROED + '">§</text>';
  for (var pl = 0; pl < 6; pl++) parInd += '<rect x="-76" y="' + (8 + pl * 18) + '" width="' + (pl % 3 === 2 ? 92 : 152) + '" height="6" fill="#b1b0ab"/>';
  var regInd = '<text x="-84" y="-86" font-size="24" font-weight="600" fill="#17181a">Regler</text><rect x="-84" y="-72" width="168" height="2" fill="#17181a"/>';
  for (var rl = 0; rl < 6; rl++) {
    var ry = -46 + rl * 28, rx = rl % 2;
    regInd += '<path d="' + (rx ? "M-84 " + (ry - 8) + "l14 14m0 -14l-14 14" : "M-84 " + ry + "l5 6l10 -14") + '" fill="none" stroke="' + (rx ? ROED : "#17181a") + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="-58" y="' + (ry - 5) + '" width="' + (rl % 3 === 1 ? 100 : 136) + '" height="6" fill="#b1b0ab"/>';
  }
  function lyn(x, y, r) { return '<path transform="translate(' + x + " " + y + ") rotate(" + r + ')" d="M6 -34 L-14 2 H-2 L-10 34 L16 -8 H3 L13 -34 Z" fill="#fff"/>'; }

  function scene(id, farve, lys, floor, indhold) {
    return '<g id="' + id + '" clip-path="url(#' + id + 'K)" style="display:none"><rect x="-1200" y="-800" width="4000" height="2600" fill="' + farve + '"/>' +
      '<rect x="-1200" y="-800" width="4000" height="2600" fill="url(#' + lys + ')"/><rect x="-1200" y="720" width="4000" height="1100" fill="' + floor + '"/>' + indhold + "</g>";
  }
  function spot(id, farve) { return '<radialGradient id="' + id + '" gradientUnits="userSpaceOnUse" cx="800" cy="420" r="820"><stop offset="0" stop-color="' + farve + '" stop-opacity=".62"/><stop offset="1" stop-color="' + farve + '" stop-opacity="0"/></radialGradient>'; }
  function klip(id) { return '<clipPath id="' + id + 'K"><rect id="' + id + 'R" x="-1200" y="-800" width="4000" height="2600"/></clipPath>'; }

  var defs = '<defs>' +
    '<pattern id="n42s" width="52" height="70" patternUnits="userSpaceOnUse" patternTransform="translate(-26 -170)"><rect width="52" height="70" fill="#fbfaf6"/><path d="M0 35 L52 -9 V26 L0 70 Z M0 105 L52 61 V96 L0 140 Z" fill="' + ROED + '"/></pattern>' +
    '<pattern id="bomS" width="48" height="24" patternUnits="userSpaceOnUse" patternTransform="translate(-96 -104)"><rect width="48" height="24" fill="#fbfaf6"/><path d="M0 24 L12 0 H36 L24 24 Z" fill="' + ROED + '"/></pattern>' +
    '<linearGradient id="plade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".4" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>' +
    '<radialGradient id="skygge"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="glod"><stop offset="0" stop-color="#ffe9a0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc94a" stop-opacity=".45"/><stop offset="1" stop-color="#ffc94a" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="lak" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".62" stop-color="#eef0f1"/><stop offset="1" stop-color="#c3c8cc"/></linearGradient>' +
    '<linearGradient id="rude" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#47586a"/><stop offset="1" stop-color="#1b2229"/></linearGradient>' +
    '<linearGradient id="kasse" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#eec23a"/><stop offset="1" stop-color="#c2951a"/></linearGradient>' +
    '<linearGradient id="bukser" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2f3e58"/><stop offset="1" stop-color="' + NAVY + '"/></linearGradient>' +
    '<linearGradient id="vest" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + VEST + '"/><stop offset="1" stop-color="' + VEST2 + '"/></linearGradient>' +
    '<radialGradient id="hud" cx=".42" cy=".36" r=".8"><stop offset="0" stop-color="#f7dcc4"/><stop offset="1" stop-color="' + HUD2 + '"/></radialGradient>' +
    '<linearGradient id="hjelm" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcdcd8"/></linearGradient>' +
    '<linearGradient id="aermel" gradientUnits="userSpaceOnUse" x1="-62" x2="62" y1="0" y2="0"><stop offset="0" stop-color="' + VEST2 + '"/><stop offset=".5" stop-color="' + VEST + '"/><stop offset="1" stop-color="' + VEST2 + '"/></linearGradient>' +
    '<linearGradient id="grav" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f0c02f"/><stop offset="1" stop-color="#cb9a14"/></linearGradient>' +
    spot("lRoed", "#ff6a55") + spot("lOkker", "#f7dc8e") + spot("lTeal", "#8fe0c9") + spot("lLilla", "#d9a9ee") + spot("lBlaa", "#2fb2ee") + spot("lRust", "#f6a06e") + spot("lGroen", "#5fb99a") +
    klip("s0") + klip("s1") + klip("s2") + klip("s3") + klip("s5") + klip("s6") +
    '<clipPath id="s4K"><circle id="s4R" cx="800" cy="600" r="0"/></clipPath>' +
    '<clipPath id="kJyl"><path d="' + KORT.jylland + '"/></clipPath><clipPath id="kAfd"><circle id="kOmr" cx="270.6" cy="372.5" r="0"/></clipPath>' +
    "</defs>";

  /* Scene 1 og 2: bygherren */
  var bygherre = papir("pKal", kalInd) + papir("pVag", vagInd) + papir("pPar", parInd) + papir("pReg", regInd);
  var s1 = scene("s1", "#b67c1f", "lOkker", "#94600f", "");
  var s2 = scene("s2", "#2b6f68", "lTeal", "#1e5550", "");

  /* Vejen: scene 3 (lilla) og 4 (blå) deler de samme ting */
  function vejbund(a, kant) {
    var s = '<rect x="-1200" y="660" width="4000" height="180" fill="' + a + '"/><rect x="-1200" y="660" width="4000" height="5" fill="' + kant + '"/><rect x="-1200" y="835" width="4000" height="5" fill="' + kant + '"/>';
    for (var x = -1200; x < 2800; x += 150) if (x < 340 || x > 1240) s += '<rect x="' + x + '" y="746" width="82" height="7" fill="#f2f2ee"/>';
    return s;
  }
  var s3 = scene("s3", "#5a3f8b", "lLilla", "#47306f", vejbund("#3f3a4d", "#7a7088"));
  var s4 = scene("s4", "#0e56a0", "lBlaa", "#0a4380", vejbund("#2f3a4b", "#6e8299"));

  var vejTing = '<g id="baggrund"><ellipse cx="800" cy="672" rx="310" ry="26" fill="#000" opacity=".2"/><path d="M930 672 Q1010 590 1100 672 Z" fill="#6d5a45"/><path d="M960 672 Q1020 618 1072 672 Z" fill="#83705a"/>' +
    '<g id="grav"><ellipse cx="620" cy="672" rx="120" ry="12" fill="url(#skygge)"/><rect x="520" y="646" width="170" height="26" rx="13" fill="#1d1e21"/><rect x="540" y="580" width="130" height="66" rx="6" fill="url(#grav)"/><path d="M580 580 V510 H652 L664 580 Z" fill="#2f3a44"/><path d="M574 510 H660 V500 H574 Z" fill="url(#grav)"/>' +
    '<path id="gArm" fill="none" stroke="#dcae22" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path id="gSkovl" fill="#2b2d31"/></g>' +
    arbejder(760, 676, 1, "#d9e23a") + arbejder(860, 672, -1, "#d9e23a") + arbejder(1010, 676, 1, "#d9e23a") + "</g>";
  var n42er = "", antalN = 8;
  for (var ni = 0; ni < antalN; ni++) n42er += n42("n" + ni);
  var skiltDef = [["A31", 90], ["C55", 196], ["C51", 1404], ["A72", 1510]], skiltene = "";
  skiltDef.forEach(function (d, i) { skiltene += skilt("sk" + i, d[0]); });
  var vejForrest = skiltene + signal("sigA") + signal("sigB") + vejTing + bom("bm0") + bom("bm1") + n42er;

  /* Scene 5: dokumentation */
  var fotoRk = ""; for (var fi = 0; fi < 6; fi++) fotoRk += '<g transform="translate(' + (-190 + fi * 76) + ' 86) scale(.82)"><rect x="-15" y="-132" width="30" height="124" fill="url(#n42s)"/><rect x="-28" y="-9" width="56" height="10" rx="3" fill="#1e1f22"/><circle cx="0" cy="-143" r="8" fill="#ffc94a"/></g>';
  var s5Ind = '<g id="rapport"><rect x="-150" y="-205" width="300" height="410" rx="5" fill="#000" opacity=".2" transform="translate(6 14)"/><rect x="-150" y="-205" width="300" height="410" rx="5" fill="#fbfaf6"/><text x="-124" y="-162" font-size="28" font-weight="600" fill="#17181a">Rapport</text><rect x="-124" y="-146" width="248" height="2" fill="#17181a"/><rect x="-124" y="-128" width="118" height="84" fill="#d7dad3"/><rect x="6" y="-128" width="118" height="84" fill="#c8cec4"/><rect x="-124" y="-28" width="248" height="7" fill="#b1b0ab"/><rect x="-124" y="-6" width="248" height="7" fill="#b1b0ab"/><rect x="-124" y="16" width="170" height="7" fill="#b1b0ab"/><circle cx="92" cy="134" r="36" fill="' + ROED + '"/><path d="M74 134 l13 14 l24 -28" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<g id="tablet"><rect x="-292" y="-192" width="584" height="396" rx="24" fill="#000" opacity=".22" transform="translate(6 14)"/><rect x="-292" y="-192" width="584" height="396" rx="24" fill="#17181b"/><rect x="-268" y="-168" width="536" height="348" rx="4" fill="#cfd8dc"/><rect x="-268" y="42" width="536" height="138" fill="#8a8f88"/><rect x="-268" y="-168" width="536" height="170" fill="#e6edee"/>' + fotoRk +
    '<rect x="-256" y="130" width="330" height="40" rx="3" fill="#000" opacity=".72"/><text x="-242" y="157" font-size="21" font-weight="600" fill="#fff">Tid og GPS gemt</text><path d="M214 -146 q-22 0 -22 22 q0 16 22 42 q22 -26 22 -42 q0 -22 -22 -22 Z" fill="' + ROED + '"/><circle cx="214" cy="-124" r="8" fill="#fff"/><rect id="blitz" x="-268" y="-168" width="536" height="348" fill="#fff" opacity="0"/></g>';
  var s5 = scene("s5", "#a8432a", "lRust", "#843220", s5Ind);

  /* Scene 6: Danmarkskort */
  var s6Ind = '<g id="kortet" transform="translate(760 -10) scale(1.2)"><path d="' + KORT.oe + '" fill="#2f6e60"/><path d="' + KORT.born + '" fill="#2f6e60"/><rect x="455" y="24" width="120" height="96" rx="6" fill="none" stroke="#2f6e60" stroke-width="2"/><path d="' + KORT.jylland + '" fill="#2f6e60"/>' +
    '<g clip-path="url(#kAfd)"><path d="' + KORT.jylland + '" fill="#ffe27a"/></g><g clip-path="url(#kJyl)"><circle id="kR1" cx="270.6" cy="372.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><circle id="kR2" cx="270.6" cy="372.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/></g>' +
    '<g id="kPin"><path d="M270.6 372 q-30 -36 -30 -58 a30 30 0 0 1 60 0 q0 22 -30 58 Z" fill="' + ROED + '"/><circle cx="270.6" cy="314" r="11" fill="#fff"/></g><text id="kNavn" x="312" y="330" font-size="30" font-weight="700" fill="#17181a">Aarhus</text></g>';
  var s6 = scene("s6", "#1c4c42", "lGroen", "none", "");
  s6 = s6.replace("</g>", s6Ind + "</g>");

  /* Scene 0: forsiden */
  var s0 = scene("s0", "#d4080f", "lRoed", "#ae060c", "");

  var svgKode = '<svg xmlns="http://www.w3.org/2000/svg" id="hTegning" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" font-family="Inter, Segoe UI, system-ui, Arial, sans-serif">' + defs + s0 + s1 + s2 + s3 + s4 + s5 + s6 +
    '<g id="ovenpaa"><g id="vej" style="display:none">' + vejForrest + "</g>" +
    '<g id="byg" style="display:none"><g id="lyn">' + lyn(232, -520, -28) + lyn(0, -575, 6) + lyn(-226, -520, 30) + '</g>' + person("bh") + "</g>" + vito("bil") +
    '<g id="pap" style="display:none">' + bygherre + "</g>" +
    '<g id="fb" opacity="0"><circle r="46" fill="' + ROED + '"/><path d="M-22 1 L-6 18 L24 -16" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    haand("fing") + "</g></svg>";
  host.innerHTML = svgKode;

  // Scene 0 indhold lægges ind efter, så det ligger i scenen
  var s0el = $("s0");
  s0el.insertAdjacentHTML("beforeend",
    '<g id="skiltet"><path id="snor" stroke="#fff" stroke-width="3"/><g id="hPlade"><rect x="-238" y="-74" width="476" height="150" rx="6" fill="#000" opacity=".2" transform="translate(5 12)"/><rect x="-238" y="-74" width="476" height="150" rx="6" fill="#fff"/><image href="billeder/logo.svg" x="-200" y="-55" width="400" height="110"/></g></g>');

  /* ---------- Fælles styring ---------- */
  var lodret = false;
  var scener = [
    { id: "s0", ind: -1, til: 0, type: "op", farve: "" },
    { id: "s1", ind: 1.2, til: 1.75, type: "op" },
    { id: "s2", ind: 3.9, til: 4.4, type: "hoejre" },
    { id: "s3", ind: 6.7, til: 7.2, type: "venstre" },
    { id: "s4", ind: 10, til: 10.7, type: "cirkel" },
    { id: "s5", ind: 11.5, til: 12, type: "op" },
    { id: "s6", ind: 13.4, til: 13.9, type: "venstre" },
  ];
  var tekster = stage.querySelectorAll(".h-tekst");
  var nulstil = {};

  /* Finger skubber scenen ind */
  function saetKlip(s, q) {
    var r = $(s.id + "R");
    if (s.type === "cirkel") { r.setAttribute("r", (q * 1500).toFixed(1)); return; }
    var X = -1200, Y = -800, B = 4000, H = 2600;
    if (s.type === "op") { r.setAttribute("x", X); r.setAttribute("y", Y + H * (1 - q)); r.setAttribute("width", B); r.setAttribute("height", H * q + 1); }
    else if (s.type === "hoejre") { r.setAttribute("x", X); r.setAttribute("y", Y); r.setAttribute("width", B * q + 1); r.setAttribute("height", H); }
    else { r.setAttribute("x", X + B * (1 - q)); r.setAttribute("y", Y); r.setAttribute("width", B * q + 1); r.setAttribute("height", H); }
  }
  // Fingerens plads ved kanten: kanterne går over det synlige område, ikke hele tegningen
  function kant(s, q) {
    if (s.type === "op") return Y_SK(q);
    return s.type === "hoejre" ? X_SK(q) : X_SK(1 - q);
  }
  function X_SK(q) { return -1200 + 4000 * q; }
  function Y_SK(q) { return -800 + 2600 * (1 - q); }

  function arm(id, s, e, h) { $(id).setAttribute("d", "M" + s[0] + " " + s[1] + " Q" + e[0].toFixed(1) + " " + e[1].toFixed(1) + " " + h[0].toFixed(1) + " " + h[1].toFixed(1)); }
  function mix(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
  function rejsLmp(gr, taend, blink) {
    gr.querySelectorAll(".lmp").forEach(function (l) { l.setAttribute("fill", taend > 0 ? "#ffd65e" : "#8f7a35"); });
    gr.querySelectorAll(".glod").forEach(function (l) { l.setAttribute("opacity", (taend * blink).toFixed(2)); });
  }

  var n42Faldt = [], i;
  for (i = 0; i < antalN; i++) {
    var hv = Math.sin(i * 127.1 + 3) * 43758.5; hv -= Math.floor(hv);
    var hv2 = Math.sin(i * 311.7 + 9) * 43758.5; hv2 -= Math.floor(hv2);
    n42Faldt.push({ x: 450 + i * 100, a: (hv < 0.5 ? -1 : 1) * (hv2 < 0.62 ? 88 : 26), dx: (hv2 - 0.5) * 34 });
  }
  function u2x(u) { return lerp(-420, 2020, (u - 7.5) / 2.4); }
  var VANFRA = 7.5, VANTIL = 9.9;

  function tegn(u, tid) {
    var vis, s, q, j;
    // Baggrunde
    for (j = 0; j < scener.length; j++) {
      s = scener[j];
      q = j === 0 ? 1 : del(u, s.ind, s.til);
      var naeste = scener[j + 1];
      vis = q > 0 && !(naeste && u > naeste.til);
      $(s.id).style.display = vis ? "" : "none";
      if (vis && j) saetKlip(s, q);
    }

    // Scene 0: skiltet hænger i en snor fra fingeren
    var lft = del(u, 0, 1.2);
    pos($("hPlade"), 800, 380 - lft * 40, Math.sin(u * 3) * 1.6);
    $("snor").setAttribute("d", "M800 -400 L800 " + (306 - lft * 40)); $("snor").style.display = lodret ? "none" : "";

    // Bygherren
    var bVis = u > 1.2 && u < 7.3;
    $("byg").style.display = bVis ? "" : "none";
    $("pap").style.display = bVis ? "" : "none";
    if (bVis) {
      var BX = 1040, BY = 760, SK = 1.04;
      pos($("byg"), BX + del(u, 2.2, 2.9) * Math.sin(u * 40) * 1.5 * (1 - del(u, 5.2, 5.9)), BY, 0, SK);
      var pres = del(u, 1.8, 2.5) * (1 - del(u, 5.3, 6));
      var glad = del(u, 5.5, 6);
      arm("bhAV", [-72, -385], mix([-96, -300], [-158, -402], pres), mix([-92, -216], [-48, -476], pres));
      var hO = mix([96, -300], [158, -402], pres), hH = mix([92, -216], [48, -476], pres);
      var tp = del(u, 5.9, 6.3);
      hO = mix(hO, [132, -300], tp); hH = mix(hH, [172, -398], tp);
      arm("bhAH", [72, -385], hO, hH);
      var hv2p = mix([-92, -216], [-48, -476], pres);
      $("bhHV").setAttribute("cx", hv2p[0]); $("bhHV").setAttribute("cy", hv2p[1]);
      $("bhHH").setAttribute("cx", hH[0]); $("bhHH").setAttribute("cy", hH[1]);
      $("bhT").setAttribute("d", "M" + hH[0] + " " + (hH[1] - 12) + " V" + (hH[1] - 38));
      $("bhT").setAttribute("opacity", tp > 0.9 ? 1 : 0);
      $("bhPresset").setAttribute("opacity", 1 - glad); $("bhGlad").setAttribute("opacity", glad);
      // Lyn og puls omkring hovedet
      var ln = $("lyn"), lnO = del(u, 2.3, 2.7) * (1 - del(u, 5.2, 5.7));
      ln.setAttribute("opacity", (lnO * (0.72 + 0.28 * Math.sin(tid * 6))).toFixed(2));
      // Papirerne falder ned og flyver ind i bilen bagefter
      var pap = [
        { id: "pKal", x: 745, y: 265, r: -7, a: 1.8, f: 4.9 },
        { id: "pVag", x: 1380, y: 240, r: 6, a: 2.2, f: 5.1 },
        { id: "pPar", x: 700, y: 545, r: 5, a: 2.6, f: 5.3 },
        { id: "pReg", x: 1420, y: 530, r: -6, a: 3.0, f: 5.5 },
      ];
      var DX = 300, DY = 680;
      pap.forEach(function (p, ix) {
        var ind = del(u, p.a, p.a + 0.45), ud = del(u, p.f, p.f + 0.5);
        var el = $(p.id);
        if (ind <= 0 || ud >= 1) { el.style.display = "none"; return; }
        el.style.display = "";
        var svaev = Math.sin(tid * 1.2 + ix * 1.7) * 5 * (1 - ud);
        var px = lodret ? 1040 + (p.x - 1040) * 0.66 : p.x; pos(el, lerp(px, DX, ud), lerp((lodret ? p.y + 90 : p.y) - 500 * (1 - ind), DY, ud) + svaev, lerp(p.r + (1 - ind) * 28, 0, ud), lerp(lodret ? 0.82 : 1, 0.12, ud));
      });
    }

    // Bilen
    var bilEl = $("bil"), bilVis = true, bx = 0, by = 810, sk = 1;
    if (u > 4.2 && u < 7.3) { bx = lerp(-520, 300, 1 - Math.pow(1 - klem((u - 4.2) / 0.8), 3)); by = 780; sk = 1.05; }
    else if (u >= VANFRA && u <= VANTIL) { bx = u2x(u); by = 815; sk = 0.92; }
    else bilVis = false;
    bilEl.style.display = bilVis ? "" : "none";
    if (bilVis) {
      pos(bilEl, bx, by, 0, sk);
      var bl = (tid * 3) % 1;
      bilEl.querySelector(".bk1").setAttribute("opacity", bl < 0.5 ? 1 : 0.1);
      bilEl.querySelector(".bk2").setAttribute("opacity", bl < 0.5 ? 0.1 : 1);
    }
    var fbO = del(u, 5.9, 6.2);
    $("fb").setAttribute("opacity", u < 7 ? fbO : 0);
    pos($("fb"), 300, 480, 0, lerp(0.4, 1, fbO));

    // Vejen
    var vVis = u > 6.7 && u < 12;
    $("vej").style.display = vVis ? "" : "none";
    if (vVis) {
      var vanX = u2x(u), efter = u > VANTIL - 0.1;
      var blink = 0.75 + 0.25 * Math.sin(tid * 7);
      // Skilte
      var fald = { sk0: 84, sk3: -86 };
      skiltDef.forEach(function (d, ix) {
        var e = $("sk" + ix), rejst = del(vanX, d[1] - 90, d[1] + 70), f = fald["sk" + ix] || 0;
        pos(e, d[1], ix < 2 ? 700 : 700, f * (1 - rejst));
        if (ix === 0) rejsLmp(e, rejst, blink);
      });
      // Signal
      var gA = vanX > -60 && vanX < 700;
      [["sigA", 330, gA], ["sigB", 1270, !gA && vanX > 700]].forEach(function (d) {
        var e = $(d[0]); pos(e, d[1], 704);
        e.querySelector(".r").setAttribute("fill", d[2] ? "#4a1414" : "#ff2b2b");
        e.querySelector(".g").setAttribute("fill", d[2] ? "#35e36a" : "#14401f");
      });
      // N42 og bomme
      for (i = 0; i < antalN; i++) {
        var nf = n42Faldt[i], rn = del(vanX, nf.x - 60, nf.x + 40), en = $("n" + i);
        pos(en, nf.x + nf.dx * (1 - rn), 712, nf.a * (1 - rn));
        var chase = efter ? (Math.sin(tid * 5 - i * 0.7) > 0 ? 1 : 0.15) : 0.8;
        rejsLmp(en, rn >= 1 ? 1 : 0, chase);
      }
      [["bm0", 372, -70], ["bm1", 1228, 72]].forEach(function (d) {
        var e = $(d[0]), rb = del(vanX, d[1] - 60, d[1] + 40);
        pos(e, d[1], 716, d[2] * (1 - rb));
        rejsLmp(e, rb >= 1 ? 1 : 0, efter ? blink : 0.8);
      });
      // Gravemaskine og folk
      var g = Math.sin(tid * 1.7);
      var a1 = [664, 600], a2 = [780 + g * 10, 520 + g * 16], a3 = [850 + g * 16, 610 + g * 22];
      $("gArm").setAttribute("d", "M" + a1[0] + " " + a1[1] + " L" + a2[0].toFixed(1) + " " + a2[1].toFixed(1) + " L" + a3[0].toFixed(1) + " " + a3[1].toFixed(1));
      $("gSkovl").setAttribute("d", "M" + (a3[0] - 10).toFixed(1) + " " + (a3[1] - 6).toFixed(1) + " h34 q6 26 -18 34 h-16 z");
      document.querySelectorAll(".hugge").forEach(function (h, ix) { h.setAttribute("transform", "rotate(" + (Math.sin(tid * 3 + ix * 2) * 9).toFixed(2) + " 60 -380)"); });
    }

    // Scene 5: dokumentation
    if (u > 11.5 && u < 13.9) {
      var tab = del(u, 11.8, 12.3), rap = del(u, 12.7, 13.2);
      pos($("tablet"), 1010 - rap * 150, lerp(1100, 410, tab), -3 + rap * -3);
      pos($("rapport"), lerp(1010, 1290, rap), 410, 4 * rap);
      var bz = (u - 12.42) / 0.14;
      $("blitz").setAttribute("opacity", bz > 0 && bz < 1 ? (1 - bz).toFixed(2) : 0);
    }
    // Scene 6: kortet
    if (u > 13.4) {
      var omr = del(u, 13.9, 15.1);
      $("kOmr").setAttribute("r", (omr * 460).toFixed(1));
      $("kR1").setAttribute("r", (20 + omr * 200).toFixed(1)); $("kR2").setAttribute("r", (20 + omr * 340).toFixed(1));
      $("kR1").setAttribute("stroke-opacity", (omr * 0.6).toFixed(2)); $("kR2").setAttribute("stroke-opacity", (omr * 0.4).toFixed(2));
      var pn = del(u, 13.75, 14.05);
      $("kPin").setAttribute("transform", "translate(0 " + ((1 - pn) * -500).toFixed(1) + ")");
      $("kNavn").setAttribute("opacity", del(u, 14.05, 14.3));
    }

    // Finger, der skubber skiftene
    var fing = $("fing"), fvis = false;
    [["op", 1.2, 1.75, 1000], ["hoejre", 3.9, 4.4, 470], ["venstre", 6.7, 7.2, 400], ["op", 11.5, 12, 620], ["venstre", 13.4, 13.9, 500]].forEach(function (f) {
      var fq = del(u, f[1], f[2]);
      if (fq <= 0 || fq >= 1) return;
      fvis = true;
      var vb = lodret ? { x: VB[0], y: VB[1], b: VB[2], h: VB[3] } : { x: 0, y: 0, b: 1600, h: 900 };
      if (f[0] === "op") { var yk = Y_SK(fq); pos(fing, lodret ? vb.x + vb.b * 0.62 : f[3], yk + 240, 0, 1); }
      else if (f[0] === "hoejre") { pos(fing, X_SK(fq) - 240, f[3], 90, 1); }
      else { pos(fing, X_SK(1 - fq) + 240, f[3], -90, 1); }
    });
    fing.setAttribute("opacity", fvis ? 1 : 0);

    // Tekster
    tekster.forEach(function (t) {
      var a = +t.dataset.a, b = +t.dataset.b;
      var o = a < 0 ? 1 - del(u, b - 0.25, b) : del(u, a, a + 0.25) * (1 - del(u, b - 0.25, b));
      t.style.opacity = o.toFixed(3);
      t.style.transform = "translateY(" + ((1 - o) * 18).toFixed(1) + "px)";
      t.style.visibility = o > 0.01 ? "visible" : "hidden";
      t.style.pointerEvents = o > 0.6 ? "auto" : "none";
    });
    var fl = $("hBar"); if (fl) fl.style.transform = "scaleX(" + (u / slut).toFixed(4) + ")";

    // Udsnit på smalle skærme: følg det vigtige
    if (lodret) {
      var cx = 800;
      if (u >= 1.2 && u < 4.2) cx = 1040; else if (u >= 4.2 && u < 6.9) cx = lerp(1040, 700, del(u, 4.4, 5.2));
      else if (u >= 6.9 && u < 11.5) { cx = u < VANFRA ? 800 : u < VANTIL ? Math.max(460, Math.min(1140, u2x(u))) : lerp(1140, 800, del(u, VANTIL, 10.5)); }
      else if (u >= 11.5 && u < 13.4) cx = 1005;
      else if (u >= 13.4) cx = 1090;
      VB[0] = cx - VB[2] / 2;
      $("hTegning").setAttribute("viewBox", VB.join(" "));
    }
  }

  /* ---------- Scroll ---------- */
  var VB = [0, 0, 1600, 900];
  function tilpas() {
    var b = boks.clientWidth, h = boks.clientHeight;
    lodret = b / h < (auto && auto.smal ? 1.5 : 1.05);
    var svg = $("hTegning");
    if (lodret) { VB = [350, -120, 900, 1140]; svg.setAttribute("preserveAspectRatio", "xMidYMax meet"); }
    else { VB = [0, 0, 1600, 900]; svg.setAttribute("viewBox", "0 0 1600 900"); svg.setAttribute("preserveAspectRatio", "xMidYMid meet"); }
  }
  var maal = 0, nu = 0, synlig = true;
  var fast = auto ? (location.hash.match(/u=([\d.]+)/) || [null, null])[1] : null;
  fast = fast === null ? null : parseFloat(fast);
  var stille = !!(auto && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  function laes() {
    var r = stage.getBoundingClientRect(), laengde = r.height - boks.clientHeight;
    maal = klem(-r.top / laengde) * slut;
  }
  function loop(ms) {
    if (synlig) {
      if (auto) {
        // Version 2: animationen kører af sig selv i ring
        var x = (ms / 1000) % auto.sek;
        nu = fast !== null ? fast : stille ? auto.til - 0.05 : lerp(auto.fra, auto.til, klem(x / (auto.sek - 1.4)));
        if (fast === null && !stille) boks.style.opacity = (klem(x / 0.4) * klem((auto.sek - x) / 0.4)).toFixed(3);
      } else {
        nu += (maal - nu) * 0.14;
        if (Math.abs(maal - nu) < 0.001) nu = maal;
      }
      tegn(nu, ms / 1000);
    }
    requestAnimationFrame(loop);
  }
  window.addEventListener("scroll", laes, { passive: true });
  window.addEventListener("resize", function () { tilpas(); laes(); });
  new IntersectionObserver(function (p) { synlig = p[0].isIntersecting; }).observe(stage);
  window.jvGaaTil = function (u) {
    var r = stage.getBoundingClientRect(), laengde = r.height - boks.clientHeight;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, window.scrollY + r.top + u / slut * laengde);
    laes(); nu = maal; tegn(nu, performance.now() / 1000);
  };
  tilpas(); if (!auto) laes(); nu = auto ? auto.fra : maal; tegn(nu, 0); requestAnimationFrame(loop);
})();
