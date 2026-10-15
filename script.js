(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("pis-theme", next);
    });
  }

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
    $$("a", navLinks).forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));
  }

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Animated counter ---------- */
  function animateNumber(el, to, format) {
    const from = Number(el.dataset.value || 0);
    el.dataset.value = to;
    const start = performance.now();
    const dur = 600;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Hero: neighbourhood through the day ---------- */
  const hood = $("#hood");
  if (hood) {
    const PER = 12; // equal slots per space type, so no type looks primary
    // Idle slots per type at [9 AM, 2 PM, 7 PM, 11 PM]
    const spaces = [
      { name: "Homes",      free: [9, 10, 3, 1] },
      { name: "Apartments", free: [10, 11, 4, 1] },
      { name: "Offices",    free: [2, 1, 7, 11] },
      { name: "Theatres",   free: [8, 4, 1, 6] },
      { name: "Malls",      free: [8, 3, 1, 10] },
    ];
    const captions = [
      "Residents leave for work, offices fill up",
      "Homes and apartments sit empty mid-day",
      "Offices empty out as evening crowds arrive",
      "Offices and malls are closed overnight",
    ];
    const TOTAL = PER * spaces.length;

    const rows = spaces.map((sp) => {
      const row = document.createElement("div");
      row.className = "hood-row";
      row.innerHTML = `<span class="hood-name">${sp.name}</span><div class="hood-slots"></div><span class="hood-count">0/${PER}</span>`;
      const strip = $(".hood-slots", row);
      const slots = [];
      for (let i = 0; i < PER; i++) {
        const s = document.createElement("span");
        strip.appendChild(s);
        slots.push(s);
      }
      hood.appendChild(row);
      return { slots, count: $(".hood-count", row) };
    });

    function setMode(t) {
      let total = 0, top = spaces[0];
      spaces.forEach((sp, i) => {
        const n = sp.free[t];
        total += n;
        if (n > top.free[t]) top = sp;
        rows[i].slots.forEach((s, j) => setTimeout(() => s.classList.toggle("free", j < n), j * 25 + i * 40));
        rows[i].count.textContent = `${n}/${PER}`;
      });
      $("#lotCaption").textContent = captions[t];
      animateNumber($("#statFree"), total, (v) => Math.round(v));
      animateNumber($("#statUtil"), Math.round((total / TOTAL) * 100), (v) => Math.round(v) + "%");
      $("#statTop").textContent = top.name;
      $$("#lotSeg button").forEach((b) => b.classList.toggle("active", +b.dataset.mode === t));
    }

    $$("#lotSeg button").forEach((b) => b.addEventListener("click", () => { stopAuto(); setMode(+b.dataset.mode); }));

    // Auto-cycle until the user interacts
    let ti = 0;
    let timer = setInterval(() => { ti = (ti + 1) % captions.length; setMode(ti); }, 3800);
    function stopAuto() { clearInterval(timer); timer = null; }
    setMode(0);
  }

  /* ---------- Roles ---------- */
  const roleBtns = $$(".roles-switch button");
  roleBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      roleBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on);
      });
      $$(".role-panel").forEach((p) => p.classList.toggle("active", p.dataset.panel === btn.dataset.role));
    })
  );

  /* ---------- Partners ---------- */
  const icon = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

  const partners = [
    {
      id: "theatres",
      name: "Theatres",
      tag: "Large lots that fill up only during big releases.",
      icon: icon('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5"/>'),
      free: "Weekday mornings, matinees, and weeks with weak releases",
      ranges: [[6, 14]],
      offers: [
        "Open slots automatically based on ticket sales for each show",
        "Daytime parking for office workers nearby",
        "Park and get a ticket discount",
        "One tap reserves the whole lot for a blockbuster",
      ],
    },
    {
      id: "apartments",
      name: "Apartments",
      tag: "Resident slots sit empty while people are at work.",
      icon: icon('<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>'),
      free: "9am – 6pm, when residents are at work",
      ranges: [[9, 18]],
      offers: [
        "Residents rent out their own slot during the day",
        "The residents' association rents visitor slots and the money goes to the maintenance fund",
        "Night parking for buildings next door with no parking",
        "A time-limited pass that security checks at the gate",
      ],
    },
    {
      id: "offices",
      name: "Offices / IT parks",
      tag: "Full on weekdays, almost empty after hours.",
      icon: icon('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>'),
      free: "Nights, weekends, and days when staff work from home",
      ranges: [[0, 8], [20, 24]],
      offers: [
        "Night parking for local residents",
        "Weekend parking for malls and events",
        "Fleet parking for cabs and delivery bikes",
      ],
    },
    {
      id: "halls",
      name: "Marriage halls",
      tag: "Busy on event days, idle the rest of the month.",
      icon: icon('<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>'),
      free: "About 20+ days a month with no event",
      ranges: [[0, 24]],
      note: "Shown for a typical non-event day.",
      offers: [
        "Close slots only on booked event days",
        "Monthly passes for shopkeepers",
        "Night parking for tour buses",
      ],
    },
    {
      id: "schools",
      name: "Schools / colleges",
      tag: "Campus parking unused outside class hours.",
      icon: icon('<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
      free: "Evenings, weekends, and vacations",
      ranges: [[0, 7], [17, 24]],
      offers: [
        "Parking for nearby markets and hospitals",
        "Rentals for the whole summer vacation",
      ],
    },
    {
      id: "worship",
      name: "Places of worship",
      tag: "Peaks around prayer times, quiet in between.",
      icon: icon('<path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 0 1 4 0v5"/>'),
      free: "Between prayer times",
      ranges: [[9, 12], [14, 17], [21, 24]],
      offers: [
        "Weekday parking for shoppers, with a share of revenue going to the trust",
      ],
    },
    {
      id: "malls",
      name: "Malls",
      tag: "Crowded evenings and weekends, spare capacity otherwise.",
      icon: icon('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>'),
      free: "Weekday mornings and after closing",
      ranges: [[0, 11], [22, 24]],
      offers: [
        "Passes for office commuters",
        "Night parking for residents",
        "Parking fee that can be spent in the stores",
      ],
    },
    {
      id: "homes",
      name: "Homes",
      tag: "Driveways and garages empty during work hours.",
      icon: icon('<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
      free: "Work hours and while travelling",
      ranges: [[9, 18]],
      offers: [
        "Parking for commuters near metro stations",
        "Earn while on vacation",
        "Higher prices near stadiums on event days",
      ],
    },
  ];

  const tabsEl = $("#partnerTabs");
  if (tabsEl) {
    const panel = $("#partnerPanel");
    const timeline = $("#pTimeline");
    const cells = [];
    for (let h = 0; h < 24; h++) {
      const c = document.createElement("span");
      c.title = String(h).padStart(2, "0") + ":00";
      timeline.appendChild(c);
      cells.push(c);
    }

    partners.forEach((p, i) => {
      const b = document.createElement("button");
      b.className = "tab";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0);
      b.dataset.id = p.id;
      b.innerHTML = p.icon + "<span>" + p.name + "</span>";
      b.addEventListener("click", () => select(p.id));
      tabsEl.appendChild(b);
    });

    function select(id) {
      const p = partners.find((x) => x.id === id);
      $$(".tab", tabsEl).forEach((t) => t.setAttribute("aria-selected", t.dataset.id === id));
      $("#pTitle").textContent = p.name;
      $("#pTag").textContent = p.tag;
      $("#pFree").textContent = p.free;
      $("#pOffers").innerHTML = p.offers
        .map((o, i) => `<li><b>${String(i + 1).padStart(2, "0")}</b><span>${o}</span></li>`)
        .join("");
      cells.forEach((c, h) => {
        const free = p.ranges.some(([a, b]) => h >= a && h < b);
        setTimeout(() => c.classList.toggle("free", free), h * 18);
      });
      $(".timeline-note", panel).textContent =
        p.note || "Highlighted hours show when the space is typically idle.";
      panel.classList.remove("swap");
      void panel.offsetWidth;
      panel.classList.add("swap");
    }
    select(partners[0].id);
  }

  /* ---------- Estimator ---------- */
  const slotsIn = $("#slots");
  if (slotsIn) {
    const hoursIn = $("#hours"), rateIn = $("#rate"), occIn = $("#occ");
    const fill = (el) => {
      const p = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.setProperty("--p", p + "%");
    };
    function calc() {
      const s = +slotsIn.value, h = +hoursIn.value, r = +rateIn.value, o = +occIn.value / 100;
      [slotsIn, hoursIn, rateIn, occIn].forEach(fill);
      $("#slotsOut").textContent = s;
      $("#hoursOut").textContent = h + (h === 1 ? " hr" : " hrs");
      $("#rateOut").textContent = inr(r);
      $("#occOut").textContent = Math.round(o * 100) + "%";
      const day = s * h * r * o;
      $("#estMonthly").textContent = inr(day * 30);
      $("#estDay").textContent = inr(day);
      $("#estHours").textContent = Math.round(s * h * o * 30).toLocaleString("en-IN");
      $("#estYear").textContent = inr(day * 365);
    }
    [slotsIn, hoursIn, rateIn, occIn].forEach((el) => el.addEventListener("input", calc));
    calc();
  }

  /* ---------- Contact ---------- */
  const toast = $("#toast");
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  };

  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("support@parkinspace.in");
        showToast("Email address copied");
      } catch {
        showToast("support@parkinspace.in");
      }
    });
  }

  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const subject = `[${d.get("role")}] ${d.get("topic")} — ${d.get("name")}`;
      const body =
        `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nPhone: ${d.get("phone") || "-"}\n` +
        `Role: ${d.get("role")}\nTopic: ${d.get("topic")}\n\n${d.get("message")}`;
      window.location.href =
        "mailto:support@parkinspace.in?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      showToast("Opening your email app…");
    });
  }
})();
