const box = document.getElementById("box");
const icon = document.getElementById("icon");
const icon_carrier = document.getElementById("SVGRepo_iconCarrier");
const blue_color = "#00b4d8";

const class_st0 = document.querySelectorAll(".st0");

// const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
// icon.prepend(defs);

// fetch("./static/soft-glow.svg")
//   .then(res => res.text())
//   .then(svgText => {
//     const defs = new DOMParser().parseFromString(svgText, "image/svg+xml").querySelector("filter");
//     icon.querySelector("defs").appendChild(defs);
//   });

let path1 = class_st0[0];
let path2 = class_st0[1];


icon.addEventListener("mouseenter", function(e) {
    for (let i = 0; i < class_st0.length; i++) {
        class_st0[i].classList.add("hovering")
    }
})

icon.addEventListener("mouseleave", function(e) {
    for (let i = 0; i < class_st0.length; i++) {
        class_st0[i].classList.remove("hovering")
    }
})
