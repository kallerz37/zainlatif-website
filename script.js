/* ============================================================
   ZAIN LATIF — Frontier Capital  ·  multi-page engine
   ============================================================ */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ----------------------------------------------------------
     1 · PRELOADER  (home only; sub-pages load instantly)
  ---------------------------------------------------------- */
  function runPreloader() {
    const preloader = $("#preloader");
    if (!preloader) {
      document.body.classList.add("loaded");
      revealVisible();
      heroRevealRelease();
      return;
    }
    const bar = $("#preloaderBar");
    const pct = $("#preloaderPct");
    let p = 0;
    const tick = () => {
      p += Math.random() * 16 + 6;
      if (p >= 100) p = 100;
      bar.style.width = p + "%";
      pct.textContent = Math.floor(p);
      if (p < 100) {
        setTimeout(tick, 120 + Math.random() * 130);
      } else {
        setTimeout(() => {
          preloader.classList.add("done");
          document.body.classList.add("loaded");
          revealVisible();
          heroRevealRelease();
        }, 480);
      }
    };
    tick();
  }
  function heroRevealRelease() {
    const title = $(".hero__title");
    if (title) setTimeout(() => title.classList.add("revealed"), 1400);
  }

  /* ----------------------------------------------------------
     2 · CONSTELLATION  (subtle warm network for ivory theme)
  ---------------------------------------------------------- */
  function constellation() {
    if (prefersReduced) return;
    const canvas = $("#constellation");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      const area = innerWidth * innerHeight;
      const count = Math.min(72, Math.max(26, Math.floor(area / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.5 + 0.6,
      }));
    }

    const LINK = 155;
    function frame() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > innerWidth)  n.vx *= -1;
        if (n.y < 0 || n.y > innerHeight) n.vy *= -1;
        const dxm = mouse.x - n.x, dym = mouse.y - n.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180) { n.x += dxm * 0.0014; n.y += dym * 0.0014; }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(117,89,31,0.34)";
        ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            const o = (1 - d / LINK) * 0.16;
            ctx.strokeStyle = `rgba(117,89,31,${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const a = nodes[i];
        const dc = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dc < 200) {
          const o = (1 - dc / 200) * 0.4;
          ctx.strokeStyle = `rgba(154,122,46,${o})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    }

    addEventListener("resize", resize, { passive: true });
    addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    });
    resize();
    frame();
  }

  /* ----------------------------------------------------------
     3 · CURSOR · MAGNETIC · TILT
  ---------------------------------------------------------- */
  function cursor() {
    if (isTouch || prefersReduced) return;
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    if (!dot || !ring) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hot = "a, button, [data-magnetic], [data-tilt], .deal, .social, .about__chips li";
    $$(hot).forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  function magnetic() {
    if (isTouch || prefersReduced) return;
    $$("[data-magnetic]").forEach((el) => {
      const strength = 22;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  function tilt() {
    if (isTouch || prefersReduced) return;
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
        el.style.transform = `translateY(-6px) perspective(800px) rotateX(${(py - .5) * -6}deg) rotateY(${(px - .5) * 6}deg)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ----------------------------------------------------------
     4 · REVEALS
  ---------------------------------------------------------- */
  let revealObserver;
  function reveals() {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach((el) => revealObserver.observe(el));
  }
  function revealVisible() {
    $$(".reveal").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.95) el.classList.add("in");
    });
  }

  /* ----------------------------------------------------------
     5 · COUNTERS
  ---------------------------------------------------------- */
  function counters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; obs.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "", prefix = el.dataset.prefix || "";
        const dur = 1800, start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        (function step(now) {
          const t = Math.min((now - start) / dur, 1);
          const val = target * ease(t);
          const shown = target % 1 === 0 ? Math.floor(val) : val.toFixed(1);
          el.textContent = prefix + shown + suffix;
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target + suffix;
        })(start);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => obs.observe(el));
  }

  /* ----------------------------------------------------------
     6 · NAV  (shrink · burger · progress · active · smooth)
  ---------------------------------------------------------- */
  function nav() {
    const navEl = $("#nav");
    const burger = $("#burger");
    const progress = $("#scrollProgress");
    if (!navEl) return;

    const onScroll = () => {
      const y = window.scrollY;
      navEl.classList.toggle("shrink", y > 40);
      if (progress) {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (burger) {
      burger.addEventListener("click", () => navEl.classList.toggle("open"));
      $$(".nav__links a").forEach((a) => a.addEventListener("click", () => navEl.classList.remove("open")));
    }

    // active link based on current file
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === file) a.classList.add("is-active");
    });

    // same-page anchor smooth scroll (rare here, but safe)
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const t = $(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ----------------------------------------------------------
     7 · PAGE TRANSITIONS  (veil wipe between sub-pages)
  ---------------------------------------------------------- */
  function pageTransitions() {
    if (prefersReduced) return;
    $$('a[href$=".html"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = a.getAttribute("href");
        if (!href) return;
        e.preventDefault();
        document.body.classList.add("leaving");
        setTimeout(() => { window.location.href = href; }, 460);
      });
    });
  }

  /* ----------------------------------------------------------
     8 · HERO PARALLAX
  ---------------------------------------------------------- */
  function heroParallax() {
    if (prefersReduced) return;
    const title = $(".hero__title");
    if (!title) return;
    const lede = $(".hero__lede");
    addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < innerHeight) {
        title.style.transform = `translateY(${y * 0.16}px)`;
        title.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.85)));
        if (lede) lede.style.transform = `translateY(${y * 0.07}px)`;
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     9 · CONTACT FORM
  ---------------------------------------------------------- */
  function contactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#cfStatus");
    const btn = form.querySelector(".cform__submit");
    const btnText = $("#cfBtnText");
    const fields = $$(".field input[required], .field textarea[required]", form);
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (input) => {
      const wrap = input.closest(".field");
      let ok = input.value.trim().length > 0;
      if (ok && input.type === "email") ok = emailRe.test(input.value.trim());
      wrap.classList.toggle("invalid", !ok);
      return ok;
    };
    fields.forEach((input) => {
      input.addEventListener("blur", () => { if (input.value) validateField(input); });
      input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validateField(input); });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const allOk = fields.map(validateField).every(Boolean);
      if (!allOk) { status.textContent = "Please complete the highlighted fields."; status.className = "cform__status err"; return; }
      if (form.querySelector('[name="_gotcha"]').value) return;

      const endpoint = form.getAttribute("action");
      const configured = endpoint && !endpoint.includes("your-form-id");
      btn.setAttribute("disabled", "true");
      btnText.textContent = "Sending…";
      status.textContent = ""; status.className = "cform__status";

      if (!configured) {
        const d = new FormData(form);
        const body = `From: ${d.get("name")} <${d.get("email")}>%0D%0A%0D%0A${encodeURIComponent(d.get("message"))}`;
        const subject = encodeURIComponent(d.get("subject") || "Website enquiry");
        window.location.href = `mailto:hello@zainlatif.com?subject=${subject}&body=${body}`;
        btn.removeAttribute("disabled"); btnText.textContent = "Send message";
        status.textContent = "Opening your email app… (connect Formspree for in-page sending — see README).";
        status.className = "cform__status ok";
        return;
      }
      try {
        const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (res.ok) form.classList.add("sent");
        else throw new Error("bad");
      } catch (err) {
        btn.removeAttribute("disabled"); btnText.textContent = "Send message";
        status.textContent = "Something went wrong. Please email hello@zainlatif.com directly.";
        status.className = "cform__status err";
      }
    });
  }

  /* ----------------------------------------------------------
     INIT
  ---------------------------------------------------------- */
  function init() {
    const yr = $("#year");
    if (yr) yr.textContent = new Date().getFullYear();
    constellation();
    cursor();
    magnetic();
    tilt();
    reveals();
    counters();
    nav();
    pageTransitions();
    heroParallax();
    contactForm();
    runPreloader();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
