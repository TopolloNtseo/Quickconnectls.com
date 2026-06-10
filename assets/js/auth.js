import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const messageBox = document.getElementById("authMessage");

  const roleButtons = Array.from(document.querySelectorAll("[data-role]"));
  const companyField = document.getElementById("companyField");

  let currentRole = "seeker";

  function showMessage(text, type = "info") {
    if (!messageBox) return;

    messageBox.hidden = false;
    messageBox.textContent = text;

    messageBox.style.borderColor =
      type === "error"
        ? "rgba(185,28,28,.35)"
        : "rgba(37,99,235,.35)";

    messageBox.style.background =
      type === "error"
        ? "#fef2f2"
        : "#eff6ff";
  }

  function clearMessage() {
    if (!messageBox) return;
    messageBox.hidden = true;
    messageBox.textContent = "";
  }

  function redirectByRole(role) {
    if (role === "employer") {
      window.location.href = "employer/dashboard.html";
    } else {
      window.location.href = "freelancer/dashboard.html";
    }
  }

  // TAB SWITCHING
  function setTab(which) {
    clearMessage();

    const isLogin = which === "login";

    tabLogin?.classList.toggle("is-active", isLogin);
    tabRegister?.classList.toggle("is-active", !isLogin);

    tabLogin?.setAttribute("aria-selected", String(isLogin));
    tabRegister?.setAttribute("aria-selected", String(!isLogin));

    loginForm.style.display = isLogin ? "block" : "none";
    registerForm.style.display = isLogin ? "none" : "block";
  }

  tabLogin?.addEventListener("click", () => setTab("login"));
  tabRegister?.addEventListener("click", () => setTab("register"));

  // ROLE SWITCHING
  function setRole(role) {
    currentRole = role;

    roleButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.role === role);
    });

    if (companyField) {
      companyField.style.display = role === "employer" ? "block" : "none";
    }

    clearMessage();
  }

  roleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setRole(btn.dataset.role);
    });
  });

  // LOGIN
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        showMessage("User data not found.", "error");
        return;
      }

      const userData = userDoc.data();

      showMessage("Login successful. Redirecting...");

      setTimeout(() => {
        redirectByRole(userData.role);
      }, 800);

    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  // REGISTER
  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value;
    const confirmPassword = document.getElementById("registerPassword2")?.value;

    const firstName = document.getElementById("firstName")?.value;
    const lastName = document.getElementById("lastName")?.value;
    const company = document.getElementById("companyName")?.value;

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        role: currentRole,
        company: currentRole === "employer" ? company : null,
        createdAt: new Date()
      });

      showMessage("Account created. Redirecting...");

      setTimeout(() => {
        redirectByRole(currentRole);
      }, 800);

    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  // INIT
  setTab("login");
  setRole("seeker");
});