import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      window.location.href = "/auth.html";
      return;
    }

    const userRef = await getDoc(doc(db, "users", user.uid));

    if (!userRef.exists()) {
      window.location.href = "/auth.html";
      return;
    }

    const userData = userRef.data();

    // ======================
    // COMPANY NAME
    // ======================
    const companyName = document.getElementById("companyName");

    if (companyName) {
      companyName.textContent =
        userData.company || userData.firstName || "My Account";
    }

    // ======================
    // LOGOUT
    // ======================
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "/auth.html";
      });
    }

    // ======================
    // LOAD JOBS
    // ======================
    const q = query(
      collection(db, "jobs"),
      where("employerId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // ======================
    // STATS
    // ======================
    const activeJobs = jobs.filter(job => job.status === "OPEN").length;

    const activeJobsEl = document.getElementById("activeJobs");
    const totalJobsEl = document.getElementById("totalJobs");

    if (activeJobsEl) activeJobsEl.textContent = activeJobs;
    if (totalJobsEl) totalJobsEl.textContent = jobs.length;

    // ======================
    // TABLE
    // ======================
    const table = document.getElementById("jobsTableBody");

    if (table) {
      if (jobs.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="5">No jobs posted yet.</td>
          </tr>
        `;
      } else {
        table.innerHTML = jobs.map(job => `
          <tr>
            <td>
              <strong>${job.title || "Untitled Job"}</strong><br/>
              <small>${job.payment || "No payment set"}</small>
            </td>

            <td>${job.location || "N/A"}</td>

            <td>
              ${job.duration || "N/A"}
            </td>

            <td>
              <span class="tag ${
                job.status === "OPEN" ? "tag-green" : "tag-gray"
              }">
                ${job.status || "OPEN"}
              </span>
            </td>

            <td>
              <a class="link" href="/job-details.html?id=${job.id}">
                View
              </a>
            </td>
          </tr>
        `).join("");
      }
    }

  } catch (error) {
    console.error("Employer dashboard error:", error);
  }
});