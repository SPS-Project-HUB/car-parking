import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const slots = ["slot1", "slot2", "slot3", "slot4", "slot5"];
const slotContainer = document.getElementById("slotContainer");

function renderSlots(data) {
  slotContainer.innerHTML = "";
  slots.forEach(slot => {
    const status = data[slot]?.status || "free";
    const vehicle = data[slot]?.vehicle || "-";
    const time = data[slot]?.time || "00:00:00";

    const div = document.createElement("div");
    div.className = `slot ${status}`;
    div.innerHTML = `
      <div>${slot.toUpperCase()}</div>
      <div>Status: ${status}</div>
      <div>Vehicle: ${vehicle}</div>
      <div>Time: ${time}</div>
    `;
    slotContainer.appendChild(div);
  });
}

function listenToSlots() {
  const slotRef = ref(db, "slots/");
  onValue(slotRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      renderSlots(data);
    }
  });
}

window.bookSlot = function() {
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const selectedSlot = document.getElementById("slotSelect").value;

  if (!vehicleNumber) {
    alert("Please enter your vehicle number!");
    return;
  }

  const slotRef = ref(db, `slots/${selectedSlot}`);
  set(slotRef, {
    status: "booked",
    vehicle: vehicleNumber,
    time: "00:00:00"
  });
}

listenToSlots();
