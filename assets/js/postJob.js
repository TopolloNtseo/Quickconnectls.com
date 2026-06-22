import { auth, db } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postJobForm");
  const msg = document.getElementById("postJobMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/auth.html";
      return;
    }

    const data = {
      title: document.getElementById("title").value,
      location: document.getElementById("location").value,
      startTime: document.getElementById("startTime").value,
      duration: document.getElementById("duration").value,
      payment: document.getElementById("payment").value,
      workersNeeded: document.getElementById("workersNeeded").value || 1,
      description: document.getElementById("description").value || "",
      terms: document.getElementById("terms").value || "",
      employerId: user.uid,
      status: "OPEN",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "jobs"), data);

      msg.hidden = false;
      msg.textContent = "Job posted successfully!";
      msg.style.color = "green";

      form.reset();
    } catch (err) {
      console.error(err);

      msg.hidden = false;
      msg.textContent = "Failed to post job. Try again.";
      msg.style.color = "red";
    }
  });
});