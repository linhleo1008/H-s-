/* 언어 전환 · Before/After 데모 · 스크롤 등장 효과 (수정할 필요 거의 없음) */
(function () {
  "use strict";

  var I18N = window.I18N || {};
  var CFG = window.SITE_CONFIG || {};
  var SUPPORTED = ["ko", "en", "vi"];
  var current = "ko";

  function t(key) {
    var dict = I18N[current] || {};
    if (dict[key] != null) return dict[key];
    if (I18N.ko && I18N.ko[key] != null) return I18N.ko[key];
    return "";
  }

  // "{gradDate}" → config 값, 비어 있으면 [졸업년월] 같은 자리 표시
  function fill(str) {
    return String(str).replace(/\{(\w+)\}/g, function (_, k) {
      return CFG[k] ? CFG[k] : t("ph." + k);
    });
  }

  function clean(v) { return (v == null ? "" : String(v)).trim(); }

  var CONTACT = {
    email: function (v) { return { href: "mailto:" + v, text: v }; },
    phone: function (v) { return { href: "tel:" + v.replace(/[^\d+]/g, ""), text: v }; },
    linkedin: function (v) {
      return { href: v, text: v.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), external: true };
    },
    instagram: function (v) {
      var id = v.replace(/^@/, "");
      return { href: "https://www.instagram.com/" + id + "/", text: "@" + id, external: true };
    }
  };

  function renderContacts() {
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      var key = el.getAttribute("data-contact");
      var val = clean(CFG[key]);
      var isLink = el.tagName === "A";
      if (val && CONTACT[key]) {
        var c = CONTACT[key](val);
        el.textContent = c.text;
        el.classList.remove("is-placeholder");
        if (isLink) {
          el.setAttribute("href", c.href);
          if (c.external) { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
        }
      } else {
        el.textContent = t("ph." + key);
        el.classList.add("is-placeholder");
        if (isLink) el.removeAttribute("href");
      }
    });

    document.querySelectorAll("[data-config-link]").forEach(function (el) {
      var key = el.getAttribute("data-config-link");
      var val = clean(CFG[key]);
      if (val) {
        el.setAttribute("href", val);
        el.setAttribute("download", "");
        el.removeAttribute("aria-disabled");
        el.removeAttribute("title");
        el.classList.remove("is-placeholder");
      } else {
        el.setAttribute("href", "#");
        el.setAttribute("aria-disabled", "true");
        el.setAttribute("title", t("ph." + key));
        el.classList.add("is-placeholder");
      }
    });
  }

  function applyLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "ko";
    current = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = fill(t(el.getAttribute("data-i18n")));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), fill(t(p[1].trim())));
      });
    });

    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    renderContacts();
    updateDemoLive(false);

    try { localStorage.setItem("lang", lang); } catch (e) { /* 저장 불가 환경 무시 */ }
    try {
      var url = new URL(window.location.href);
      if (lang === "ko") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.toString());
    } catch (e) { /* file:// 등에서 실패해도 무시 */ }
  }

  function initialLang() {
    var q = null;
    try { q = new URLSearchParams(window.location.search).get("lang"); } catch (e) {}
    if (q && SUPPORTED.indexOf(q) > -1) return q;
    try {
      var s = localStorage.getItem("lang");
      if (s && SUPPORTED.indexOf(s) > -1) return s;
    } catch (e) {}
    return "ko";
  }

  /* ---------- Before / After 데모 ---------- */
  var demo = document.getElementById("demo-root");
  var live = document.getElementById("demo-live");

  function updateDemoLive(announce) {
    if (!demo || !live) return;
    var state = demo.getAttribute("data-state");
    if (announce) live.textContent = t(state === "after" ? "demo.liveAfter" : "demo.liveBefore");
  }

  if (demo) {
    demo.querySelectorAll("[data-demo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var state = btn.getAttribute("data-demo");
        demo.setAttribute("data-state", state);
        demo.querySelectorAll("[data-demo]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        updateDemoLive(true);
      });
    });
  }

  /* ---------- 언어 버튼 ---------- */
  document.querySelectorAll("[data-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
  });

  // 자리 표시 상태의 이력서 버튼은 클릭해도 이동하지 않음
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[aria-disabled="true"]');
    if (a) e.preventDefault();
  });

  applyLang(initialLang());

  /* ---------- 은은한 스크롤 등장 효과 ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    // 인쇄 전에는 모두 보이게
    window.addEventListener("beforeprint", function () {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    });
  }
})();
