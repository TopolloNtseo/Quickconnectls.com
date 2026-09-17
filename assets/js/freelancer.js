import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/* =======================
   ELEMENTS
======================= */

const usernameEl = document.getElementById("username");

const usernameInput = document.getElementById("usernameInput");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const phoneInput = document.getElementById("phoneInput");
const emailInput = document.getElementById("emailInput");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

const logoutBtn = document.getElementById("logoutBtn");

const statApplications = document.getElementById("statApplications");
const statShortlisted = document.getElementById("statShortlisted");
const statRejected = document.getElementById("statRejected");

const applicationsTable = document.getElementById("applicationsTable");

let currentUser = null;
let currentUserData = null;

/* =======================
   AUTH
======================= */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/auth/login.html";
    return;
  }

  currentUser = user;

  await loadUserProfile(user.uid, user.email);
  await loadApplications(user.uid);
});

/* =======================
   LOAD PROFILE
======================= */

async function loadUserProfile(uid, email) {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    const data = snap.exists() ? snap.data() : {};

    currentUserData = data;

    const displayName =
      data.username || `${data.firstName || ""} ${data.lastName || ""}`.trim();

    usernameEl.textContent = displayName || "User";

    usernameInput.value = data.username || "";
    firstNameInput.value = data.firstName || "";
    lastNameInput.value = data.lastName || "";
    phoneInput.value = data.phone || "";
    emailInput.value = email;

  } catch (error) {
    console.error(error);
    usernameEl.textContent = "User";
  }
}

/* =======================
   SAVE PROFILE
======================= */

saveProfileBtn.addEventListener("click", async () => {
  try {
    const ref = doc(db, "users", currentUser.uid);

    await updateDoc(ref, {
      username: usernameInput.value,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      phone: phoneInput.value
    });

    usernameEl.textContent =
      usernameInput.value ||
      `${firstNameInput.value} ${lastNameInput.value}`;

    alert("Profile updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
});

/* =======================
   DELETE ACCOUNT
======================= */

deleteAccountBtn.addEventListener("click", async () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete your account? This cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "users", currentUser.uid));
    await deleteUser(currentUser);

    alert("Account deleted");
    window.location.href = "/index.html";
  } catch (err) {
    console.error(err);
    alert("Failed to delete account. You may need to re-login first.");
  }
});

/* =======================
   APPLICATIONS
======================= */

async function loadApplications(uid) {
  try {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", uid)
    );

    const snap = await getDocs(q);

    let total = 0;
    let shortlisted = 0;
    let rejected = 0;

    applicationsTable.innerHTML = "";

    snap.forEach((docSnap) => {
      const a = docSnap.data();

      total++;

      if (a.status === "shortlisted") shortlisted++;
      if (a.status === "rejected") rejected++;

      applicationsTable.innerHTML += `
        <tr>
          <td>${a.jobTitle || "Untitled Job"}</td>
          <td>${formatStatus(a.status)}</td>
          <td>${a.date || "-"}</td>
        </tr>
      `;
    });

    statApplications.textContent = total;
    statShortlisted.textContent = shortlisted;
    statRejected.textContent = rejected;

  } catch (error) {
    console.error(error);
  }
}

/* =======================
   STATUS
======================= */

function formatStatus(status) {
  if (!status) return "Pending";

  switch (status) {
    case "shortlisted":
      return "Shortlisted";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
}

/* =======================
   LOGOUT
======================= */

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "/index.html";
});