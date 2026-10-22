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

  /* ---------- Hero: 3-step story ---------- */
  const scene = $("#scene");
  if (scene) {
    const steps = [
      { who: "Space owner", title: "Your spot sits empty while you're at work", desc: "That's 9 hours a day your driveway could be earning for you." },
      { who: "Driver", title: "A driver nearby books it on their phone", desc: "They pick the hours, pay up front and get a digital pass. No calls, no haggling." },
      { who: "Everyone wins", title: "They park stress-free. You earn \u20b9210.", desc: "7 hours \u00d7 \u20b930/hr, paid to your account for space you weren't using. (Example)" },
    ];
    const btns = $$("#storySeg button");
    let cur = 0;
    function show(i) {
      cur = i;
      scene.dataset.step = i;
      $("#storyWho").textContent = steps[i].who;
      $("#storyTitle").textContent = steps[i].title;
      $("#storyDesc").textContent = steps[i].desc;
      btns.forEach((b) => b.classList.toggle("active", +b.dataset.step === i));
    }
    const timer = setInterval(() => show((cur + 1) % steps.length), 4000);
    btns.forEach((b) => b.addEventListener("click", () => { clearInterval(timer); show(+b.dataset.step); }));
    show(0);
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

  /* ---------- FAQ ---------- */
  const faqBtns = $$(".faq-switch button");
  faqBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      faqBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on);
      });
      $$(".faq-panel").forEach((p) => p.classList.toggle("active", p.dataset.faqpanel === btn.dataset.faq));
    })
  );
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open);
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Partners ---------- */
  const icon = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

  const partners = [
    {
      id: "homes",
      name: "Homes",
      tag: "Your driveway or garage sits empty while you're at work.",
      icon: icon('<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
      free: "Weekdays 9 AM – 6 PM, and whenever you travel",
      ranges: [[9, 18]],
      who: ["Office commuters", "Metro riders", "Event-goers"],
      perks: [
        "Earn while you're at work or away on holiday",
        "Charge more on match and concert days if you're near a stadium",
        "Block your spot anytime you need it back",
      ],
    },
    {
      id: "apartments",
      name: "Apartments",
      tag: "Resident slots sit empty while people are at work.",
      icon: icon('<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>'),
      free: "Weekdays 9 AM – 6 PM",
      ranges: [[9, 18]],
      who: ["People working nearby", "Shoppers", "Visitors to the area"],
      perks: [
        "Residents earn from their own slot during the day",
        "Visitor slots add money to the society's maintenance fund",
        "Security checks a digital pass at the gate, so only booked drivers get in",
      ],
    },
    {
      id: "offices",
      name: "Offices / IT parks",
      tag: "Packed on weekdays, nearly empty at night and on weekends.",
      icon: icon('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>'),
      free: "Nights after 8 PM, weekends and work-from-home days",
      ranges: [[0, 8], [20, 24]],
      who: ["Nearby residents", "Cab & delivery fleets", "Weekend shoppers"],
      perks: [
        "Turn an empty lot into income every night",
        "Steady monthly income from resident and fleet passes",
        "Office hours stay reserved for your own staff",
      ],
    },
    {
      id: "malls",
      name: "Malls",
      tag: "Crowded on evenings and weekends, spare space on weekday mornings.",
      icon: icon('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>'),
      free: "Weekday mornings and after closing time",
      ranges: [[0, 11], [22, 24]],
      who: ["Office commuters", "Nearby residents"],
      perks: [
        "Monthly passes for people who work nearby",
        "Overnight parking for residents with no space at home",
        "Let the parking fee count toward shopping, so parkers become customers",
      ],
    },
    {
      id: "theatres",
      name: "Theatres",
      tag: "Full for big releases, mostly empty the rest of the time.",
      icon: icon('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16M2 9h5M2 15h5M17 9h5M17 15h5"/>'),
      free: "Weekday mornings, matinees and slow weeks",
      ranges: [[6, 14]],
      who: ["Office workers nearby", "Shoppers"],
      perks: [
        "Spare slots open up automatically when a show isn't sold out",
        "Offer a ticket discount to people who park with you",
        "Take the whole lot back in one tap for a blockbuster",
      ],
    },
    {
      id: "halls",
      name: "Marriage halls",
      tag: "Packed on event days, empty 20+ days a month.",
      icon: icon('<path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6h6v6"/>'),
      free: "Every day without an event",
      ranges: [[0, 24]],
      note: "Shown for a typical day with no event booked.",
      who: ["Local shopkeepers", "Tour buses", "Nearby offices"],
      perks: [
        "Bookings close automatically on your event dates",
        "Monthly passes for shopkeepers around you",
        "Overnight parking for tour buses",
      ],
    },
    {
      id: "schools",
      name: "Schools / colleges",
      tag: "Campus parking goes unused once classes end.",
      icon: icon('<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
      free: "Evenings, weekends and vacations",
      ranges: [[0, 7], [17, 24]],
      who: ["Hospital visitors", "Market shoppers", "Event-goers"],
      perks: [
        "Earn from evening and weekend parking",
        "Rent out the whole campus lot over summer vacation",
      ],
    },
    {
      id: "worship",
      name: "Places of worship",
      tag: "Busy around prayer times, quiet in between.",
      icon: icon('<path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10M3 21h18M10 21v-5a2 2 0 0 1 4 0v5"/>'),
      free: "Between prayer and service times",
      ranges: [[9, 12], [14, 17], [21, 24]],
      who: ["Shoppers", "People working nearby"],
      perks: [
        "A share of every booking goes to your trust",
        "Prayer times stay blocked for devotees automatically",
      ],
    },
  ];

  const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  const tabsEl = $("#partnerTabs");
  if (tabsEl) {
    const panel = $("#partnerPanel");

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
      const hours = p.ranges.reduce((sum, [a, b]) => sum + (b - a), 0);
      $("#pTitle").textContent = p.name;
      $("#pTag").textContent = p.tag;
      $("#pHours").textContent = hours + " hrs";
      $("#pFree").textContent = p.free;
      $("#pDaybar").innerHTML = p.ranges
        .map(([a, b]) => {
          const w = ((b - a) / 24) * 100;
          return `<span class="seg-free" style="left:${(a / 24) * 100}%;width:${w}%">${w >= 15 ? "FREE" : ""}</span>`;
        })
        .join("");
      const note = $("#pNote");
      note.hidden = !p.note;
      note.textContent = p.note || "";
      $("#pWho").innerHTML = p.who.map((w) => `<span>${w}</span>`).join("");
      $("#pPerks").innerHTML = p.perks.map((t) => `<li>${tick}${t}</li>`).join("");
      panel.classList.remove("swap");
      void panel.offsetWidth;
      panel.classList.add("swap");
    }
    select(partners[0].id);
  }

  /* ---------- Estimator ---------- */
  const slotsIn = $("#slots");
  if (slotsIn) {
    const hoursIn = $("#hours"), rateIn = $("#rate");
    const fill = (el) => {
      const p = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.setProperty("--p", p + "%");
    };
    function calc() {
      const s = +slotsIn.value, h = +hoursIn.value, r = +rateIn.value;
      [slotsIn, hoursIn, rateIn].forEach(fill);
      $("#slotsOut").textContent = s;
      $("#hoursOut").textContent = h + (h === 1 ? " hr" : " hrs");
      $("#rateOut").textContent = inr(r);
      const day = s * h * r;
      $("#estMonthly").textContent = inr(day * 30);
      $("#estDay").textContent = inr(day);
      $("#estHours").textContent = (s * h * 30).toLocaleString("en-IN");
      $("#estYear").textContent = inr(day * 365);
    }
    [slotsIn, hoursIn, rateIn].forEach((el) => el.addEventListener("input", calc));
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
    const params = new URLSearchParams(location.search);
    if (params.get("sent") === "1") {
      form.hidden = true;
      $("#formSuccess").hidden = false;
    }
    const role = params.get("role");
    if (role === "owner" || role === "driver") {
      $(role === "owner" ? "#rOwner" : "#rDriver").checked = true;
      $("#topic").value = role === "owner" ? "List my space" : "Early access";
    }
    // Submits as a normal POST to Zoho CRM's Web-to-Lead endpoint, which redirects back with ?sent=1.
    form.addEventListener("submit", (e) => {
      if (!form.reportValidity()) { e.preventDefault(); return; }
      const d = new FormData(form);
      $("#zDesignation").value = d.get("role");
      $("#zDescription").value =
        `Role: ${d.get("role")}\nTopic: ${d.get("topic")}\nSource: parkinspace.in contact form\n\n${d.get("message")}`;
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";
    });
  }
})();
