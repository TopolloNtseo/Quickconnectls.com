import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } 
from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBU6v_oMn0pzt3wqreDYY00pxNxO2OhmFs",
  authDomain: "quickconnectls.firebaseapp.com",
  projectId: "quickconnectls",
  storageBucket: "quickconnectls.appspot.com",
  messagingSenderId: "364590501994",
  appId: "1:364590501994:web:064ec018f40b8041b2ba13"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// GLOBAL JOBS ARRAY (IMPORTANT)
let JOBS = [];

// FETCH FROM FIREBASE
async function fetchJobs() {
  const snapshot = await getDocs(collection(db, "jobs"));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      company: data.company,
      location: data.location?.toLowerCase(),
      type: data.type?.toLowerCase(),
      category: data.category?.toLowerCase(),
      posted: "Recently"
    };
  });
}

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") || "",
    location: p.get("location") || "all",
    type: p.get("type") || "all",
    category: p.get("category") || "all",
  };
}

function setInputsFromParams(params) {
  const q = document.getElementById("filterQ");
  const loc = document.getElementById("filterLocation");
  const type = document.getElementById("filterType");
  const cat = document.getElementById("filterCategory");

  if (q) q.value = params.q;
  if (loc) loc.value = params.location;
  if (type) type.value = params.type;
  if (cat) cat.value = params.category;
}

function renderJobs(list) {
  const container = document.getElementById("jobsResults");
  const count = document.getElementById("resultsCount");
  if (!container) return;

  if (count) count.textContent = `${list.length} job${list.length === 1 ? "" : "s"} found`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No jobs match your filters</h3>
        <p>Try changing keyword, location or job type.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(job => `
    <article class="card job-card">
      <div class="job-top">
        <div>
          <h3 class="job-title">${job.title}</h3>
          <p class="job-company">${job.company}</p>
        </div>
        <span class="pill">${labelCategory(job.category)}</span>
      </div>

      <ul class="job-meta">
        <li>📍 ${labelLocation(job.location)}</li>
        <li>💼 ${labelType(job.type)}</li>
        <li>⏱️ Posted ${job.posted}</li>
      </ul>

      <a class="btn btn-primary" href="/job-details.html?id=${job.id}">View / Apply</a>
    </article>
  `).join("");
}

function labelLocation(loc) {
  const map = {
    "maseru": "Maseru",
    "leribe": "Leribe",
    "thaba-tseka": "Thaba-Tseka",
    "mafeteng": "Mafeteng",
    "mohales-hoek": "Mohale's Hoek",
    "quthing": "Quthing",
    "butha-buthe": "Butha-Buthe",
    "mokhotlong": "Mokhotlong",
    "qacha-nek": "Qacha's Nek",
    "berea": "Berea"
  };
  return map[loc] || loc;
}

function labelType(t) {
  const map = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    "contract": "Contract",
    "internship": "Internship",
    "temporary": "Temporary"
  };
  return map[t] || t;
}

function labelCategory(c) {
  const map = {
    "it-tech": "IT & Tech",
    "admin": "Admin",
    "construction": "Construction",
    "health": "Health",
    "education": "Education",
    "retail": "Retail",
    "marketing": "Marketing",
    "finance": "Finance"
  };
  return map[c] || c;
}

function applyFilters() {
  const q = normalize(document.getElementById("filterQ")?.value);
  const location = document.getElementById("filterLocation")?.value || "all";
  const type = document.getElementById("filterType")?.value || "all";
  const category = document.getElementById("filterCategory")?.value || "all";

  const filtered = JOBS.filter(j => {
    const matchesQ =
      !q ||
      normalize(j.title).includes(q) ||
      normalize(j.company).includes(q);

    const matchesLocation = location === "all" || j.location === location;
    const matchesType = type === "all" || j.type === type;
    const matchesCategory = category === "all" || j.category === category;

    return matchesQ && matchesLocation && matchesType && matchesCategory;
  });

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (location !== "all") params.set("location", location);
  if (type !== "all") params.set("type", type);
  if (category !== "all") params.set("category", category);
  history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

  renderJobs(filtered);
}

function resetFilters() {
  document.getElementById("filterQ").value = "";
  document.getElementById("filterLocation").value = "all";
  document.getElementById("filterType").value = "all";
  document.getElementById("filterCategory").value = "all";
  history.replaceState({}, "", window.location.pathname);
  renderJobs(JOBS);
}

// 🔥 FINAL FIX (IMPORTANT PART)
document.addEventListener("DOMContentLoaded", async () => {
  const params = getParams();
  setInputsFromParams(params);

  JOBS = await fetchJobs(); // ✅ wait for Firebase

  applyFilters(); // ✅ now render real jobs

  document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
  document.getElementById("resetFiltersBtn")?.addEventListener("click", resetFilters);

  document.getElementById("filterQ")?.addEventListener("input", applyFilters);
  document.getElementById("filterLocation")?.addEventListener("change", applyFilters);
  document.getElementById("filterType")?.addEventListener("change", applyFilters);
  document.getElementById("filterCategory")?.addEventListener("change", applyFilters);
});