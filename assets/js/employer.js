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
      userData.company || userData.firstName || "My Company";
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
  const activeJobs = jobs.filter(j => j.status === "OPEN").length;

  document.getElementById("activeJobs").textContent = activeJobs;
  document.getElementById("totalJobs").textContent = jobs.length;

  // ======================
  // TABLE
  // ======================
  const table = document.getElementById("jobsTableBody");

  if (table) {
    table.innerHTML = jobs.map(job => `
      <tr>
        <td>${job.title}</td>
        <td>${job.location}</td>
        <td>
          <span class="tag ${
            job.status === "OPEN" ? "tag-green" : "tag-gray"
          }">
            ${job.status}
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
});