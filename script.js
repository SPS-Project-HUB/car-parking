import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const timers = {};

function startLiveTimer(slotId, startTime) {
  if (timers[slotId]) return;

  const timeParts = startTime.split(":");
  let start = new Date();
  start.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));

  timers[slotId] = setInterval(() => {
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    document.getElementById(slotId).querySelector(".timer").innerText = `Time: ${timeStr}`;
  }, 1000);
}

function stopLiveTimer(slotId) {
  if (timers[slotId]) {
    clearInterval(timers[slotId]);
    delete timers[slotId];
  }
  document.getElementById(slotId).querySelector(".timer").innerText = "Time: 00:00:00";
}

function updateSlotUI(slotId, data) {
  const slotEl = document.getElementById(slotId);
  const status = data.status;
  const startTime = data.startTime || "N/A";

  let statusText = "";
  let color = "";

  if (status === "free") {
    statusText = "Available";
    color = "#4CAF50";
  } else if (status === "booked") {
    statusText = "Booked";
    color = "#FF9800";
  } else if (status === "occupied") {
    statusText = "Occupied";
    color = "#F44336";
  }

  slotEl.querySelector(".status").innerText = `Status: ${statusText}`;
  slotEl.querySelector(".status").style.color = color;

  if (status === "occupied") {
    startLiveTimer(slotId, startTime);
  } else {
    stopLiveTimer(slotId);
  }
}

const slots = ["slot1", "slot2", "slot3", "slot4", "slot5"];
slots.forEach(slot => {
  const slotRef = ref(db, "/" + slot);
  onValue(slotRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      updateSlotUI(slot, data);
    }
  });
});
