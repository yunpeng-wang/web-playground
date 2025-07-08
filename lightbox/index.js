/* -------------------
Variables
------------------- */ 
const galleryBox = document.querySelector(".gallery-box");
const lightBox = document.querySelector(".light-box");
const lightBoxClose = document.getElementById("lightbox-close")
const lightBoxPrev = document.getElementById("lightbox-prev")
const lightBoxNext = document.getElementById("lightbox-next")

const pageSize = 9;
const zoomAnimeTime = 0.3;
const slideAnimeTime = 0.2;
const slideAnimeDelayTime = 0;

let animeEventHandle = 0; // 0:close, 1:prev, 2:next

let currentIdx;
let prevIdx;
let nextIdx;

let galleryImg;
let imgArr;

let currentImg;
let isAnimation = false;

/* -------------------
Functions
------------------- */ 
function buttonManage () {
    if (prevIdx < 0) {
        lightBoxPrev.style.display = "none";
    }
    else {
        lightBoxPrev.style.display = "inline";
    }

    if (nextIdx >= pageSize) {
        lightBoxNext.style.display = "none";
    }
    else {
        lightBoxNext.style.display = "inline";
    }
}

function indexUpdate (currentValue) {
    currentIdx = currentValue;
    prevIdx = currentIdx - 1;
    nextIdx = currentIdx + 1;
}

function addImg2Lightbox (currentValue) {
    currentImg = imgArr[currentValue].cloneNode(true);
    currentImg.classList.add("lightbox-img");
    currentImg.classList.remove("gallery-img");
    if (animeEventHandle === 0) {
        currentImg.style.animation = `zoom-in ${zoomAnimeTime}s ease-out`;
    }
    else if (animeEventHandle === 1) {
        currentImg.style.animation = `trans-left-in ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
    }
    else if (animeEventHandle === 2) {
        currentImg.style.animation = `trans-right-in ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
    }

    lightBox.appendChild(currentImg);
    isAnimation = false;
}

function lightBoxMain (currentValue) {
    if (isAnimation) {
        return;
    }
    isAnimation = true;

    let tmpImg = lightBox.querySelector('.lightbox-img')
    
    if (tmpImg) {
        if (animeEventHandle === 1) {
            tmpImg.style.animation = `trans-right-out ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
        }
        else if (animeEventHandle === 2) {
            tmpImg.style.animation = `trans-left-out ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
        }

        tmpImg.addEventListener("animationend", function handler(e) {          
            if ((e.animationName === "trans-right-out") || (e.animationName === "trans-left-out")) {
                tmpImg.remove();
                tmpImg.removeEventListener("animationend", handler);
                
                indexUpdate(currentValue);
                buttonManage();
                addImg2Lightbox(currentIdx);
            }
        })
    }
    else {
        indexUpdate(currentValue);
        buttonManage();
        addImg2Lightbox(currentIdx);
    }
}

function closeLightBox () {
    currentImg.addEventListener("animationend", function handler(e) {
        if (e.animationName === "zoom-out") {
            currentImg.remove();
            currentImg.removeEventListener('animationend', handler);
            lightBox.style.display = "none";
        }
    })
    currentImg.style.animation = `zoom-out ${zoomAnimeTime}s ease-out`;

    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

/* -------------------
Main code
------------------- */ 
for (let i=0;i<pageSize;i++) {
    let childImg = document.createElement("img");

    let imgPath = "./static/";
    let imgName = String(i+1) + ".webp";

    childImg.src = imgPath+imgName;
    childImg.alt = "img";
    childImg.className = "gallery-img";
    childImg.dataset.index = i;

    galleryBox.appendChild(childImg);
}

galleryImg = galleryBox.querySelectorAll(".gallery-img");
imgArr = Array.from(galleryImg);

galleryBox.addEventListener("click", function(e) {
    if (e.target.tagName.toLowerCase() === 'img'){
        lightBox.style.display = 'flex';
        // 先清空旧动画（防止第二次无效）
        //lightBox.style.animation = 'none';
        //void lightBox.offsetWidth;  // 强制 reflow，让动画重新生效

        document.body.style.overflow = "hidden";
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        animeEventHandle = 0;
        lightBoxMain(Number(e.target.dataset.index))
    }
})

lightBox.addEventListener("click", function(e) {
    if (e.target.tagName.toLowerCase() === 'img'){
        currentImg.classList.toggle("zoomed");
    }
    if (e.target === e.currentTarget){
        closeLightBox();
    }
})

lightBoxClose.addEventListener("click", function(e) {
    closeLightBox();
})

lightBoxPrev.addEventListener("click", function(e) {    
    animeEventHandle = 1;
    lightBoxMain(prevIdx);
}) 

lightBoxNext.addEventListener("click", function(e) {
    animeEventHandle = 2;
    lightBoxMain(nextIdx);
})

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {  
        if (getComputedStyle(lightBox).display !== "none") {  
            closeLightBox();
        }
    }
    else if (e.key === "ArrowLeft"){
        if (getComputedStyle(lightBoxPrev).display !== "none") { 
            animeEventHandle = 1;
            lightBoxMain(prevIdx);
        }
    }
    else if(e.key === "ArrowRight"){
        if (getComputedStyle(lightBoxNext).display !== "none") { 
            animeEventHandle = 2;
            lightBoxMain(nextIdx);
        }
    }    
})

//Drag img
