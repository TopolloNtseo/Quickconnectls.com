async function include(selector, file) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load: ${file}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    el.innerHTML = "<!-- include failed -->";
  }
}

// Load shared layout
document.addEventListener("DOMContentLoaded", async () => {
  await include("#header", "/components/header.html");
  await include("#footer", "/components/footer.html");

  // Mobile nav toggle (works after header loads)
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isHidden = mobileNav.hasAttribute("hidden");
      if (isHidden) mobileNav.removeAttribute("hidden");
      else mobileNav.setAttribute("hidden", "");
    });
  }
});
