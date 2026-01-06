const API = "http://127.0.0.1:5000";
const bar = document.getElementById("bar");

async function fetchInfo() {
    const url = document.getElementById("url").value;

    const res = await fetch(API + "/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
    });

    const data = await res.json();

    document.getElementById("video").classList.remove("hidden");
    document.getElementById("title").innerText = data.title;
    document.getElementById("thumb").src = data.thumbnail;

    const q = document.getElementById("quality");
    q.innerHTML = "";

    data.qualities.forEach(i => {
        q.innerHTML += `<option value="${i.quality}">
      ${i.quality}p (${i.size} MB)
    </option>`;
    });
}

function downloadFile(type) {
    const url = document.getElementById("url").value;
    const quality = document.getElementById("quality").value;

    bar.style.width = "0%";

    const a = document.createElement("a");
    a.href = `${API}/download?url=${url}&quality=${quality}&type=${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const es = new EventSource(API + "/progress");
    es.onmessage = e => {
        bar.style.width = e.data + "%";
        if (e.data == 100) es.close();
    };
}
/* MATRIX BACKGROUND */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffcc";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

setInterval(drawMatrix, 35);
/* TERMINAL TYPING */
const text = "⚡ YouTube Hacker Downloader ⚡";
let index = 0;

function typeEffect() {
    if (index < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeEffect, 80);
    }
}

typeEffect();


/* THEME TOGGLE */
function toggleTheme() {
    document.body.classList.toggle("light");
}
