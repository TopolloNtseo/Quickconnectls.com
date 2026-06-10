import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export function protectPage(requiredRole = null) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/auth.html";
      return;
    }

    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (!userSnap.exists()) {
      window.location.href = "/auth.html";
      return;
    }

    const userData = userSnap.data();

    // If role restriction is set
    if (requiredRole && userData.role !== requiredRole) {
      window.location.href = "/index.html";
    }
  });
}