import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// GLOBAL JOBS ARRAY
let JOBS = [];

// FETCH FROM FIREBASE
async function fetchJobs() {
  const snapshot = await getDocs(collection(db, "jobs"));

  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title || "Untitled Job",
      location: data.location?.toLowerCase() || "",
      duration: data.duration || "",
      payment: data.payment || "",
      posted: data.posted || "Recently"
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
    location: p.get("location") || "all"
  };
}

function setInputsFromParams(params) {
  const q = document.getElementById("filterQ");
  const loc = document.getElementById("filterLocation");

  if (q) q.value = params.q;
  if (loc) loc.value = params.location;
}

function renderJobs(list) {
  const container = document.getElementById("jobsResults");
  const count = document.getElementById("resultsCount");

  if (!container) return;

  if (count) {
    count.textContent = `${list.length} job${list.length === 1 ? "" : "s"} found`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No jobs match your filters</h3>
        <p>Try changing your search or location.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(job => `
    <article class="card job-card">

      <div class="job-top">
        <div>
          <h3 class="job-title">${job.title}</h3>
        </div>

        <span class="pill">
          ${job.payment || "Payment not specified"}
        </span>
      </div>

      <ul class="job-meta">
        <li>
          <i class='bx bx-map'></i>
          ${labelLocation(job.location)}
        </li>

        <li>
          <i class='bx bx-time-five'></i>
          ${job.duration || "Duration not specified"}
        </li>

        <li>
          <i class='bx bx-info-circle'></i>
          Posted ${job.posted}
        </li>
      </ul>

      <a class="btn btn-primary" href="/job-details.html?id=${job.id}">
        View / Apply
      </a>

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

  return map[loc] || loc || "N/A";
}

function applyFilters() {
  const q = normalize(document.getElementById("filterQ")?.value);
  const location = document.getElementById("filterLocation")?.value || "all";

  const filtered = JOBS.filter(j => {
    const matchesQ =
      !q || normalize(j.title).includes(q);

    const matchesLocation =
      location === "all" || j.location === location;

    return matchesQ && matchesLocation;
  });

  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (location !== "all") params.set("location", location);

  history.replaceState(
    {},
    "",
    `${window.location.pathname}?${params.toString()}`
  );

  renderJobs(filtered);
}

function resetFilters() {
  document.getElementById("filterQ").value = "";
  document.getElementById("filterLocation").value = "all";

  history.replaceState({}, "", window.location.pathname);

  renderJobs(JOBS);
}

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  const params = getParams();
  setInputsFromParams(params);

  JOBS = await fetchJobs();

  applyFilters();

  document.getElementById("applyFiltersBtn")?.addEventListener("click", applyFilters);
  document.getElementById("resetFiltersBtn")?.addEventListener("click", resetFilters);

  document.getElementById("filterQ")?.addEventListener("input", applyFilters);
  document.getElementById("filterLocation")?.addEventListener("change", applyFilters);
});