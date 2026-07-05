const usernameInput = document.getElementById("username-input");
const messageSection = document.getElementById("message-section");
const messageInput = document.getElementById("message-input");
const messageButton = document.getElementById("message-button");
const lockButton = document.getElementById("lock-button");

async function getIP() {
  const response = await fetch("https://ipinfo.io/json");
  const data = await response.json();
  return data.ip;
}

const ip = await getIP();

let socket;
if (ip === "79.213.54.98") {
  socket = new WebSocket("wss://localhost:8080");
} else {
  socket = new WebSocket("wss://79.213.54.98:8080");
}

socket.addEventListener("open", (event) => {
  console.log("Successfully connected to WebSocket!");
  socket.send("username=" + usernameInput.value);
});

usernameInput.addEventListener("change", (_) => {
  socket.send("username=" + usernameInput.value);
});

socket.addEventListener("message", (event) => {
  const message = messageSection.appendChild(document.createElement("p"));
  message.innerText = event.data;
});

let text = "";

messageButton.addEventListener("click", (_) => {
  text = messageInput.value;
  if (!text) {
    alert("Invalid message!");
    return;
  }

  socket.send(text);
});

lockButton.addEventListener("click", (_) => {
  if (lockButton.style.backgroundColor !== "red") {
    lockButton.style.backgroundColor = "red";
  } else {
    lockButton.style.backgroundColor = "green";
  }
});

window.requestAnimationFrame(loop);

function loop() {
  if (lockButton.style.backgroundColor !== "red") {
    messageSection.scrollTop =
      messageSection.scrollHeight - messageSection.clientHeight;
  }

  window.requestAnimationFrame(loop);
}
