import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ✅ Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyCSNW4PZkfse5G-s4j9HxtJqkYxuTUFQAo",
  authDomain: "carparkingsystem-e96a9.firebaseapp.com",
  databaseURL: "https://carparkingsystem-e96a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "carparkingsystem-e96a9",
  storageBucket: "carparkingsystem-e96a9.appspot.com",
  messagingSenderId: "1074868104297",
  appId: "1:1074868104297:web:a00c054483ff39f36506f8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// List of slot names in Firebase
const slots = ["slot1", "slot2", "slot3", "slot4"];

slots.forEach((slotName) => {
  const statusEl = document.querySelector(`#${slotName} .status`);
  const timerEl = document.querySelector(`#${slotName} .timer`);
  let startTime = null;
  let timerInterval = null;

  const slotRef = ref(db, `slots/${slotName}/status`);

  onValue(slotRef, (snapshot) => {
    const status = snapshot.val();
    statusEl.textContent = status === 1 ? "Occupied" : "Free";
    statusEl.style.color = status === 1 ? "red" : "green";

    // Start/Stop timer
    if (status === 1 && !startTime) {
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const diff = Date.now() - startTime;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const secs = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        timerEl.textContent = `${hours}:${mins}:${secs}`;
      }, 1000);
    } else if (status === 0 && startTime) {
      clearInterval(timerInterval);
      timerInterval = null;
      startTime = null;
      timerEl.textContent = "00:00:00";
    }
  });
});
