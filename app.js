
(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem("nexora-theme");
  root.dataset.theme = saved || "dark";

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        root.dataset.theme = next;
        localStorage.setItem("nexora-theme", next);
      });
    });

    const menu = document.querySelector("[data-menu]");
    const nav = document.querySelector("[data-nav]");
    if (menu && nav) menu.addEventListener("click", () => nav.classList.toggle("open"));

    document.querySelectorAll("[data-tabs]").forEach(tabWrap => {
      const tabs = tabWrap.querySelectorAll("[data-tab]");
      const panels = document.querySelectorAll("[data-panel]");
      tabs.forEach(tab => tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.querySelector(`[data-panel="${tab.dataset.tab}"]`)?.classList.add("active");
      }));
    });

    document.querySelectorAll(".faq-item button").forEach(button => {
      button.addEventListener("click", () => {
        const item = button.parentElement;
        document.querySelectorAll(".faq-item").forEach(other => {
          if (other !== item) other.classList.remove("open");
        });
        item.classList.toggle("open");
      });
    });

    const slider = document.querySelector("[data-slider]");
    const seats = document.querySelector("[data-seats]");
    const seatLabel = document.querySelector("[data-seats-label]");
    const total = document.querySelector("[data-total]");
    const savings = document.querySelector("[data-savings]");
    let billing = "monthly";
    function updatePrice() {
      if (!slider || !total) return;
      const count = Number(slider.value);
      const perSeat = count >= 20 ? 17 : 19;
      const monthly = count * perSeat;
      const display = billing === "yearly" ? Math.round(monthly * .8) : monthly;
      seats.textContent = count;
      seatLabel.textContent = `${count} ${count === 1 ? "seat" : "seats"}`;
      total.textContent = display;
      const small = document.querySelector(".calc-result strong small");
      if (small) small.textContent = billing === "yearly" ? "/month, billed yearly" : "/month";
      const annualSave = Math.round(monthly * 12 * .2);
      savings.textContent = billing === "yearly"
        ? `You save about $${annualSave}/year with annual billing.`
        : `Annual billing saves you about $${annualSave}/year.`;
    }
    slider?.addEventListener("input", updatePrice);
    document.querySelectorAll("[data-billing]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-billing]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active"); billing = btn.dataset.billing; updatePrice();
    }));
    updatePrice();

    document.querySelectorAll("[data-copy]").forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          const old = btn.textContent; btn.textContent = "Copied";
          setTimeout(() => btn.textContent = old, 1200);
        } catch {}
      });
    });
  });
})();
