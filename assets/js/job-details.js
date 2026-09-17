import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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
const auth = getAuth(app);

function getJobId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let currentUser = null;
let currentJob = null;

async function checkIfApplied(jobId, userId) {
  const q = query(
    collection(db, "applications"),
    where("jobId", "==", jobId),
    where("freelancerId", "==", userId)
  );

  const snap = await getDocs(q);
  return !snap.empty;
}

async function createApplication(job, user) {
  await addDoc(collection(db, "applications"), {
    jobId: getJobId(),
    jobTitle: job.title,
    employerId: job.employerId,

    freelancerId: user.uid,
    freelancerName: user.displayName || "Freelancer",
    freelancerEmail: user.email || "",

    status: "pending",
    appliedAt: serverTimestamp()
  });
}

function renderApplyButton(isApplied) {
  const container = document.getElementById("applySection");

  if (!container) return;

  if (isApplied) {
    container.innerHTML = `
      <button class="btn btn-outline" disabled>
        Pending Application
      </button>
    `;
  } else {
    container.innerHTML = `
      <button id="applyBtn" class="btn btn-primary">
        Apply Now
      </button>
    `;

    document.getElementById("applyBtn").addEventListener("click", async () => {
      try {
        await createApplication(currentJob, currentUser);

        renderApplyButton(true);
      } catch (err) {
        console.error(err);
        alert("Failed to apply. Try again.");
      }
    });
  }
}

async function loadJob(user) {
  const jobId = getJobId();

  const container = document.getElementById("jobDetails");
  const loadingCard = document.getElementById("loadingCard");

  if (!jobId) {
    container.innerHTML = `<p class="muted">No job ID found.</p>`;
    return;
  }

  try {
    const ref = doc(db, "jobs", jobId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      container.innerHTML = `<p class="muted">Job not found.</p>`;
      return;
    }

    const job = snap.data();
    currentJob = job;

    loadingCard.style.display = "none";

    const applied = await checkIfApplied(jobId, user.uid);

    container.innerHTML = `
      <div class="dash-head">
        <div>
          <h2 class="dash-title">${job.title || "Untitled Job"}</h2>
          <p class="muted">${job.location || "Location not specified"}</p>
        </div>

        <span class="pill">
          ${job.payment || "Payment not specified"}
        </span>
      </div>

      <hr>

      <div class="grid-2-form">
        <div class="field">
          <label>Start Time</label>
          <p>${job.startTime || "Not specified"}</p>
        </div>

        <div class="field">
          <label>Duration</label>
          <p>${job.duration || "Not specified"}</p>
        </div>
      </div>

      <div class="grid-2-form">
        <div class="field">
          <label>Workers Needed</label>
          <p>${job.workersNeeded || "Not specified"}</p>
        </div>

        <div class="field">
          <label>Status</label>
          <p>${job.status || "OPEN"}</p>
        </div>
      </div>

      <hr>

      <h3>Job Description</h3>
      <p>${job.description || "No description provided."}</p>

      <h3 style="margin-top:20px;">Terms & Conditions</h3>
      <p>${job.terms || "No terms provided."}</p>

      <hr>

      <div id="applySection"></div>
    `;

    renderApplyButton(applied);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="muted">Error loading job.</p>`;
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/auth.html";
    return;
  }

  currentUser = user;
  loadJob(user);
});