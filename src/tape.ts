import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
const canvas = document.getElementById("tape") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth - 60;

let head = 500;
let animateTimeout: number | null = null;
const tapeSpeed = 5;
const tapeLength = 1000;
const tapeNodeLength = 100;
const tape: number[] = new Array(tapeLength);
let bufferFull = false;
const buffer: Array<"L" | "R"> = [];
for (let i = 0; i < tapeLength; i++) {
    tape[i] = i;
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 60;
    while (buffer.length) buffer.pop();
    if (animateTimeout) {
        clearTimeout(animateTimeout);
    }
    drawTape();
});

function checkBuffer() {
    if (buffer.length && !animateTimeout) {
        const dir = buffer[0];
        if (dir === "L") {
            animateMovement(10, 0);
        } else {
            animateMovement(10, 1);
        }
    }
    return;
}

function drawHeadPointer() {
    ctx.beginPath();
    ctx.moveTo(60, canvas.height / 2 + 30);
    ctx.lineTo(80, canvas.height / 2 + 70);
    ctx.lineTo(40, canvas.height / 2 + 70);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function animateMovement(i: number, direction: number) {
    if (
        (i > tapeNodeLength + 20 && direction == 0) ||
        (i < 10 - tapeNodeLength && direction == 1)
    ) {
        direction == 0 ? head-- : head++;
        animateTimeout = null;
        buffer.shift();
        if (buffer.length == 0) bufferFull = false;
        checkBuffer();
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHeadPointer();
    let x = i;
    for (let i = 0; i < tapeLength; i++) {
        drawTapeNode(i, x - head * (tapeNodeLength + 10));
        x += tapeNodeLength + 10;
    }
    animateTimeout = setTimeout(() => {
        requestAnimationFrame(() =>
            animateMovement(
                i + (direction === 1 ? -tapeSpeed : tapeSpeed),
                direction
            )
        );
    }, 10);
}

function moveHeadRight() {
    if (head === tape.length - 1) return;
    if (buffer.length > 2) {
        Toastify({
            text: "Please slow down",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
        }).showToast();
        bufferFull = true;
        return;
    }
    buffer.push("R");
    console.log(buffer);
    checkBuffer();
}

function moveHeadLeft() {
    if (head === 0) return;
    if (buffer.length > 2) {
        Toastify({
            text: "Please slow down",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
        }).showToast();
        bufferFull = true;
        return;
    }
    buffer.push("L");
    checkBuffer();
}

function drawTape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHeadPointer();
    let x = 10;
    for (let i = 0; i < tapeLength; i++) {
        drawTapeNode(i, x - head * (tapeNodeLength + 10));
        x += tapeNodeLength + 10;
    }
}

function drawTapeNode(i: number, x: number) {
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, canvas.height / 2 - 50, 100, 100);
    ctx.font = "30px Arial";
    ctx.fillText(tape[i].toString(), x + 25, canvas.height / 2 + 10);
}

function init() {
    drawTape();
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        moveHeadRight();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        moveHeadLeft();
    }
});

export { init };
