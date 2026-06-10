// QC: minimal JS for MVP (Phase 1)

(function () {
  // Mobile menu
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isHidden = mobileNav.hasAttribute("hidden");
      if (isHidden) mobileNav.removeAttribute("hidden");
      else mobileNav.setAttribute("hidden", "");
    });
  }

  // Hero search: for MVP redirect to jobs page (Phase 2 will implement real filtering)
  const form = document.getElementById("heroSearchForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (document.getElementById("q")?.value || "").trim();
      const location = document.getElementById("location")?.value || "all";
      const type = document.getElementById("type")?.value || "all";

      // pass params to jobs.html so you can read them later in Phase 2
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (location !== "all") params.set("location", location);
      if (type !== "all") params.set("type", type);

      window.location.href = `jobs.html?${params.toString()}`;
    });
  }
})();
