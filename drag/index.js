const box = document.querySelector(".box");
const svgContainer = document.getElementById("ball-svg");
const ball = document.getElementById("ball");

let flag = false;
let posX = 0;
let reposX = 0;
let posY = 0;
let reposY = 0;

box.addEventListener("mousedown", function (e) {
  if (e.target.id === "ball") {
    flag = true;
    posX = e.clientX;
    posY = e.clientY;

    ball.classList.add("dragging");
  }
});

box.addEventListener("mousemove", function (e) {
  if (flag) {
    svgContainer.style.top = `${e.clientY - posY + reposY}px`;
    svgContainer.style.left = `${e.clientX - posX + reposX}px`;
  }
});

document.addEventListener("mouseup", function (e) {
  if (flag) {
    flag = false;
    reposX = svgContainer.style.left ? parseInt(svgContainer.style.left) : 0;
    reposY = svgContainer.style.top ? parseInt(svgContainer.style.top) : 0;
    ball.classList.remove("dragging");
  }
});
