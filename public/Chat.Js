const ws = new WebSocket(`wss://${location.host}`);

const messages = document.getElementById("messages");
const input = document.getElementById("input");
const username = document.getElementById("username");
const send = document.getElementById("send");

function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

let myColor = randomColor();

send.onclick = () => {
    if (!username.value || !input.value) return;

    const payload = {
        name: username.value,
        text: input.value,
        color: myColor
    };

    ws.send(JSON.stringify(payload));
    input.value = "";
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const div = document.createElement("div");
    div.className = "message";
    div.style.color = data.color;

    div.innerHTML = `<strong>${data.name}:</strong> ${data.text}`;
    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
};
