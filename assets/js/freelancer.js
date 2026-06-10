// Phase 6: Job seeker demo logic (stats, applications, follow-up template, profile save)

(function () {
  const APPS = [
    { id: 1, job: "Software Developer", company: "TechHub Lesotho", status: "Viewed", date: "2026-02-05" },
    { id: 2, job: "Administrative Assistant", company: "Government Office", status: "Submitted", date: "2026-02-07" },
    { id: 3, job: "Registered Nurse", company: "QMMH", status: "Shortlisted", date: "2026-02-08" },
    { id: 4, job: "Accountant", company: "Standard Lesotho Bank", status: "Submitted", date: "2026-02-10" },
  ];
import { protectPage } from "./guard.js";

protectPage("seeker"); 


  function statusTag(status) {
    const s = String(status).toLowerCase();
    if (s === "shortlisted") return `<span class="tag tag-yellow">Shortlisted</span>`;
    if (s === "viewed") return `<span class="tag tag-green">Viewed</span>`;
    return `<span class="tag tag-gray">${status}</span>`;
  }

  // Dashboard stats
  const statApps = document.getElementById("statApplications");
  const statShort = document.getElementById("statShortlisted");
  const statViewed = document.getElementById("statViewed");
  const statScore = document.getElementById("statScore");

  if (statApps || statShort || statViewed || statScore) {
    const total = APPS.length;
    const shortlisted = APPS.filter(a => a.status === "Shortlisted").length;
    const viewed = APPS.filter(a => a.status === "Viewed").length;

    if (statApps) statApps.textContent = String(total);
    if (statShort) statShort.textContent = String(shortlisted);
    if (statViewed) statViewed.textContent = String(viewed);

    // Demo profile score (Phase 7 will compute from real profile fields)
    const score = 70;
    if (statScore) statScore.textContent = `${score}%`;
  }

  // Recent apps (dashboard)
  const recentBody = document.getElementById("recentAppsBody");
  if (recentBody) {
    const recent = APPS.slice(0, 4);
    recentBody.innerHTML = recent.map(a => `
      <tr>
        <td>${a.job}</td>
        <td>${a.company}</td>
        <td>${statusTag(a.status)}</td>
        <td>${a.date}</td>
        <td><a class="link" href="/freelancer/applications.html">View</a></td>
      </tr>
    `).join("");
  }

  // Applications page
  const appsBody = document.getElementById("appsBody");
  if (appsBody) {
    appsBody.innerHTML = APPS.map(a => `
      <tr>
        <td>${a.job}</td>
        <td>${a.company}</td>
        <td>${statusTag(a.status)}</td>
        <td>${a.date}</td>
        <td><a class="btn btn-outline btn-sm" href="/job-details.html?id=${a.id}">Job Details</a></td>
      </tr>
    `).join("");
  }

  // Follow up template copy
  const copyBtn = document.getElementById("copyFollowUpBtn");
  const copyMsg = document.getElementById("copyMsg");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const template =
`Subject: Follow-up on my application

Hello [Hiring Manager Name],

I hope you are well. I’m following up on my application for the [Job Title] position at [Company]. 
I’m still very interested and would appreciate any update on the next steps.

Thank you for your time.

Kind regards,
[Your Name]
[Phone Number]`;

      try {
        await navigator.clipboard.writeText(template);
        if (copyMsg) {
          copyMsg.hidden = false;
          setTimeout(() => (copyMsg.hidden = true), 1200);
        }
      } catch (e) {
        alert("Copy failed. You can manually copy the template.");
      }
    });
  }

  // Profile save (demo)
  const profileForm = document.getElementById("profileForm");
  const profileMsg = document.getElementById("profileMsg");

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (profileMsg) {
        profileMsg.hidden = false;
        profileMsg.textContent = "Profile saved successfully (demo).";
        profileMsg.style.borderColor = "rgba(37,99,235,.35)";
        profileMsg.style.background = "#eff6ff";
      }
    });
  }
})();
