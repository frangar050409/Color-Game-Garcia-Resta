let numSquares = 6;
let colors;
let pickedColor;
let juegoTerminado = false;
let racha = 0;
let mejorRacha = 0;
let intentos = 0;

let squares = document.querySelectorAll(".square");
let colorDisplay = document.querySelector("#colorDisplay");
let messageDisplay = document.querySelector("#message");
let h1 = document.querySelector("h1");
let resetButton = document.querySelector("#reset");
let modeButtons = document.querySelectorAll(".mode");
let bodyColor = getComputedStyle(document.body).backgroundColor;

init();

function init() {
  setupModeButtons();
  setupSquares();
  reset();
}

function setupModeButtons() {
  for (let i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function () {
      modeButtons[0].classList.remove("selected");
      modeButtons[1].classList.remove("selected");
      this.classList.add("selected");
      numSquares = this.textContent === "Easy" ? 3 : 6;
      reset();
    });
  }
}

function setupSquares() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function () {
      if (juegoTerminado || this.classList.contains("fuera")) {
        return;
      }
      let clickedColor = this.style.backgroundColor;
      intentos++;
      if (clickedColor === pickedColor) {
        messageDisplay.textContent = "¡Correcto!";
        resetButton.textContent = "Play Again?";
        changeColors(clickedColor);
        h1.style.backgroundColor = clickedColor;
        juegoTerminado = true;
        racha = intentos === 1 ? racha + 1 : 0;
        festejar(this);
      } else {
        this.style.backgroundColor = bodyColor;
        this.classList.add("fuera");
        messageDisplay.textContent = "Intentalo Nuevamente";
        racha = 0;
      }
      actualizarMarcador();
    });
  }
}

function reset() {
  colors = generateRandomColors(numSquares);
  pickedColor = pickColor();
  colorDisplay.textContent = pickedColor;
  resetButton.textContent = "Nuevos Colores";
  messageDisplay.textContent = "";
  h1.style.backgroundColor = "";
  juegoTerminado = false;
  intentos = 0;
  for (let i = 0; i < squares.length; i++) {
    squares[i].classList.remove("fuera", "ganador");
    if (colors[i]) {
      squares[i].style.display = "block";
      squares[i].style.backgroundColor = colors[i];
      squares[i].style.animationDelay = `${i * 60}ms`;
      squares[i].classList.remove("entrar");
      void squares[i].offsetWidth;
      squares[i].classList.add("entrar");
    } else {
      squares[i].style.display = "none";
    }
  }
  actualizarMarcador();
}

resetButton.addEventListener("click", function () {
  reset();
});

function changeColors(color) {
  for (let i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = color;
    squares[i].classList.remove("fuera");
  }
}

function pickColor() {
  let random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateRandomColors(num) {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(randomColor());
  }
  return arr;
}

function randomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function actualizarMarcador() {
  mejorRacha = Math.max(mejorRacha, racha);
  try {
    const guardada = Number(localStorage.getItem("colorGameMejorRacha")) || 0;
    mejorRacha = Math.max(mejorRacha, guardada);
    localStorage.setItem("colorGameMejorRacha", mejorRacha);
  } catch (error) {}
  document.querySelector("#racha").textContent = racha;
  document.querySelector("#mejor").textContent = mejorRacha;
  document.querySelector("#intentos").textContent = intentos;
}

function festejar(cuadrado) {
  cuadrado.classList.add("ganador");
  const chispas = document.querySelector("#chispas");
  const caja = cuadrado.getBoundingClientRect();
  for (let i = 0; i < 36; i++) {
    const chispa = document.createElement("span");
    const angulo = (i / 36) * Math.PI * 2;
    const distancia = 120 + Math.random() * 160;
    chispa.style.left = `${caja.left + caja.width / 2}px`;
    chispa.style.top = `${caja.top + caja.height / 2}px`;
    chispa.style.background = i % 3 === 0 ? "#ffffff" : pickedColor;
    chispa.style.setProperty("--dx", `${Math.cos(angulo) * distancia}px`);
    chispa.style.setProperty("--dy", `${Math.sin(angulo) * distancia}px`);
    chispas.appendChild(chispa);
    setTimeout(() => chispa.remove(), 900);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    e.preventDefault();
    reset();
    return;
  }
  const numero = Number(e.key);
  if (numero >= 1 && numero <= numSquares) {
    squares[numero - 1].click();
  }
});
