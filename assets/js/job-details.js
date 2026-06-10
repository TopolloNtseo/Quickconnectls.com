import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, getDoc } 
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

function getJobId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadJob() {
  const jobId = getJobId();
  const container = document.getElementById("jobDetails");

  if (!jobId) {
    container.innerHTML = "<p>No job ID found</p>";
    return;
  }

  try {
    const ref = doc(db, "jobs", jobId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      container.innerHTML = "<p>Job not found</p>";
      return;
    }

    const job = snap.data();

    container.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>${job.company}</strong></p>

      <p>Location: ${job.location}</p>
      <p>Type: ${job.type}</p>
      <p>Category: ${job.category}</p>

      <hr>

      <h3>Summary</h3>
      <p>${job.summary}</p>

      <h3>Requirements</h3>
      <p>${job.requirements}</p>

      <h3>How to Apply</h3>
      <p>${job.howToApply || "Contact employer directly."}</p>

      <p><strong>Contact:</strong> ${job.contact}</p>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error loading job</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadJob);