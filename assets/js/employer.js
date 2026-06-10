import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { protectPage } from "./guard.js";

protectPage("employer"); 


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

(function () {
  // ---------- Post Job (REAL Firebase) ----------
  const postForm = document.getElementById("postJobForm");
  const msg = document.getElementById("postJobMsg");

  if (postForm) {
    postForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const jobData = {
          title: document.getElementById("title").value,
          company: document.getElementById("company").value,
          location: document.getElementById("location").value,
          type: document.getElementById("type").value,
          category: document.getElementById("category").value,
          deadline: document.getElementById("deadline").value,
          salary: document.getElementById("salary").value,
          contact: document.getElementById("contact").value,
          summary: document.getElementById("summary").value,
          requirements: document.getElementById("requirements").value,
          howToApply: document.getElementById("howToApply").value,

          status: "OPEN",
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "jobs"), jobData);

        if (msg) {
          msg.hidden = false;
          msg.textContent = "Job posted successfully!";
          msg.style.borderColor = "rgba(16,185,129,.35)";
          msg.style.background = "#ecfdf5";
        }

        postForm.reset();

        setTimeout(() => {
          window.location.href = "/employer/dashboard.html";
        }, 900);

      } catch (error) {
        console.log("Firebase error:", error);

        if (msg) {
          msg.hidden = false;
          msg.textContent = "Failed to post job";
          msg.style.borderColor = "rgba(239,68,68,.35)";
          msg.style.background = "#fef2f2";
        }
      }
    });
  }

  // ---------- Applicants (unchanged demo) ----------
  const applicants = [
    { id: 1, name: "Mpho Nkosi", email: "mpho@example.com", phone: "+266 58 123 456", job: "Administrative Assistant", location: "Maseru", status: "New", note: "2 years office experience. Available immediately." },
    { id: 2, name: "Thabo Mokoena", email: "thabo@example.com", phone: "+266 59 987 654", job: "Accountant", location: "Maseru", status: "Shortlisted", note: "BCom Accounting. Worked at a bank internship." },
    { id: 3, name: "Lerato Phiri", email: "lerato@example.com", phone: "+266 57 222 111", job: "Store Manager", location: "Mafeteng", status: "New", note: "Retail management experience. Strong references." },
    { id: 4, name: "Neo Rantso", email: "neo@example.com", phone: "+266 63 555 888", job: "Marketing Intern", location: "Maseru", status: "Reviewed", note: "Final-year student, social media + content skills." },
  ];

  const body = document.getElementById("applicantsBody");

  if (body) {
    body.innerHTML = applicants.map(a => `
      <tr>
        <td>${a.name}</td>
        <td>${a.job}</td>
        <td>${a.location}</td>
        <td>${renderStatus(a.status)}</td>
        <td><button class="btn btn-outline btn-sm" data-view-applicant="${a.id}">View</button></td>
      </tr>
    `).join("");
  }

  function renderStatus(status) {
    const s = String(status).toLowerCase();
    if (s === "new") return `<span class="tag tag-green">New</span>`;
    if (s === "shortlisted") return `<span class="tag tag-yellow">Shortlisted</span>`;
    return `<span class="tag tag-gray">${status}</span>`;
  }

  const modal = document.getElementById("applicantModal");
  const modalContent = document.getElementById("modalContent");
  const emailBtn = document.getElementById("emailBtn");
  const callBtn = document.getElementById("callBtn");

  function openModal(applicant) {
    if (!modal || !modalContent) return;
    modal.hidden = false;

    modalContent.innerHTML = `
      <div class="modal-grid">
        <div>
          <p class="muted small">Name</p>
          <p><strong>${applicant.name}</strong></p>
        </div>
        <div>
          <p class="muted small">Applied For</p>
          <p><strong>${applicant.job}</strong></p>
        </div>
        <div>
          <p class="muted small">Location</p>
          <p>${applicant.location}</p>
        </div>
        <div>
          <p class="muted small">Status</p>
          <p>${applicant.status}</p>
        </div>
      </div>

      <div class="card" style="margin-top:12px;">
        <p class="muted small">Notes</p>
        <p>${applicant.note}</p>
      </div>
    `;

    if (emailBtn) {
      emailBtn.href = `mailto:${applicant.email}`;
    }

    if (callBtn) {
      callBtn.href = `tel:${applicant.phone.replace(/\s+/g, "")}`;
    }
  }

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  document.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view-applicant]");
    if (viewBtn) {
      const id = Number(viewBtn.dataset.viewApplicant);
      const applicant = applicants.find(a => a.id === id);
      if (applicant) openModal(applicant);
    }

    if (e.target.closest("[data-close-modal]")) {
      closeModal();
    }
  });

})();