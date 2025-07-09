/* -------------------
Variables
------------------- */
const galleryBox = document.querySelector(".gallery-box");
const lightBox = document.querySelector(".light-box");
const lightBoxClose = document.getElementById("lightbox-close");
const lightBoxPrev = document.getElementById("lightbox-prev");
const lightBoxNext = document.getElementById("lightbox-next");

const paginationGroup = document.querySelector(".gallery-pagination");
const paginationPrev = document.querySelector(".pagination-prev");
const paginationNext = document.querySelector(".pagination-next");
const paginationPages = document.querySelector(".pagination-pages");
paginationPrev.classList.add("page-index");
paginationNext.classList.add("page-index");

const pageSize = 2;
const zoomAnimeTime = 0.3;
const slideAnimeTime = 0.2;
const slideAnimeDelayTime = 0;

let imgElementArry;
let currentPage = 1;
let totalPage = 1;

let animeEventHandle = 0; // 0:close, 1:prev, 2:next

let currentIdx;
let prevIdx;
let nextIdx;

let imgArr;

let currentImg;
let isAnimation = false;

/* -------------------
Functions
------------------- */
function buttonManage() {
  if (prevIdx < 0) {
    lightBoxPrev.style.display = "none";
  } else {
    lightBoxPrev.style.display = "inline";
  }

  if (nextIdx >= pageSize) {
    lightBoxNext.style.display = "none";
  } else {
    lightBoxNext.style.display = "inline";
  }
}

function indexUpdate(currentValue) {
  currentIdx = currentValue;
  prevIdx = currentIdx - 1;
  nextIdx = currentIdx + 1;
}

function addImg2Lightbox(currentValue) {
  currentImg = imgArr[currentValue].cloneNode(true);
  currentImg.classList.add("lightbox-img");
  currentImg.classList.remove("gallery-img");
  if (animeEventHandle === 0) {
    currentImg.style.animation = `zoom-in ${zoomAnimeTime}s ease-out`;
  } else if (animeEventHandle === 1) {
    currentImg.style.animation = `trans-left-in ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
  } else if (animeEventHandle === 2) {
    currentImg.style.animation = `trans-right-in ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
  }

  lightBox.appendChild(currentImg);
  isAnimation = false;
}

function lightBoxMain(currentValue) {
  if (isAnimation) {
    return;
  }
  isAnimation = true;

  let tmpImg = lightBox.querySelector(".lightbox-img");

  if (tmpImg) {
    if (animeEventHandle === 1) {
      tmpImg.style.animation = `trans-right-out ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
    } else if (animeEventHandle === 2) {
      tmpImg.style.animation = `trans-left-out ${slideAnimeTime}s ease ${slideAnimeDelayTime}s forwards`;
    }

    tmpImg.addEventListener("animationend", function handler(e) {
      if (
        e.animationName === "trans-right-out" ||
        e.animationName === "trans-left-out"
      ) {
        tmpImg.remove();
        tmpImg.removeEventListener("animationend", handler);

        indexUpdate(currentValue);
        buttonManage();
        addImg2Lightbox(currentIdx);
      }
    });
  } else {
    indexUpdate(currentValue);
    buttonManage();
    addImg2Lightbox(currentIdx);
  }
}

function closeLightBox() {
  currentImg.addEventListener("animationend", function handler(e) {
    if (e.animationName === "zoom-out") {
      currentImg.remove();
      currentImg.removeEventListener("animationend", handler);
      lightBox.style.display = "none";
    }
  });
  currentImg.style.animation = `zoom-out ${zoomAnimeTime}s ease-out`;

  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

async function loadGallery(json_file) {
  try {
    const res = await fetch(json_file);
    const data = await res.json();

    let imgArry = data.map((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "img";
      img.className = "gallery-img";
      return img;
    });

    return imgArry;
  } catch (err) {
    console.error("Error loading gallery:", err);
  }
}

function insertImgElements() {
  clearElements(galleryBox, ".gallery-img");
  indexStart = pageSize * (currentPage - 1);
  indexEnd = indexStart + pageSize - 1;

  let datasetIndex = 0;
  for (let i = indexStart; i <= indexEnd; i++) {
    if (i < imgElementArry.length) {
      let childImg = imgElementArry[i];
      childImg.dataset.index = datasetIndex;
      galleryBox.appendChild(childImg);
      datasetIndex++;
    }
  }
  imgArr = Array.from(galleryBox.querySelectorAll(".gallery-img"));
}

function clearElements(container, class_name) {
  let getImgElements = container.querySelectorAll(class_name);
  
  if (getImgElements) {
    for (let i = 0; i < getImgElements.length; i++) {
      getImgElements[i].remove();
    }
  }
}

function addPageElements(container, innter_html, hasClass = true) {
  let tmpElement;
  tmpElement = document.createElement("span");
  tmpElement.className = "page-child";
  if (hasClass) {
    tmpElement.classList.add("page-index");
  }
  tmpElement.innerHTML = innter_html;
  container.appendChild(tmpElement);
}

function setPageElementsClass() {
  if (currentPage < 2) {
    paginationPrev.classList.add("page-index-disable");
  } else {
    if (paginationPrev.classList.contains("page-index-disable")) {
      paginationPrev.classList.remove("page-index-disable");
    }
  }
  if (currentPage >= totalPage) {
    paginationNext.classList.add("page-index-disable");
  } else {
    if (paginationNext.classList.contains("page-index-disable")) {
      paginationNext.classList.remove("page-index-disable");
    }
  }

  paginationPages.querySelectorAll(".page-index").forEach((e) => {
    if (e.innerHTML === String(currentPage)) {
      e.classList.add("page-hightlight");
    }
  });
}

function createPaginationElements() {
  clearElements(paginationPages, ".page-child");

  // first page
  addPageElements(paginationPages, "1");

  // prev page
  let prevPage = currentPage - 1;
  if (prevPage > 2) {
    addPageElements(paginationPages, "···", false);
    addPageElements(paginationPages, String(prevPage));
  } else if (prevPage > 1) {
    addPageElements(paginationPages, String(prevPage));
  }

  // current page
  if (currentPage > 1 && currentPage < totalPage) {
    addPageElements(paginationPages, String(currentPage));
  }
  // next page
  let nextPage = currentPage + 1;
  if (nextPage < totalPage - 1) {
    addPageElements(paginationPages, String(nextPage));
    addPageElements(paginationPages, "···", false);
  } else if (nextPage < totalPage) {
    addPageElements(paginationPages, String(nextPage));
  }

  // last page
  addPageElements(paginationPages, String(totalPage));

  setPageElementsClass();
}

/* -------------------
Main code function
------------------- */
async function mainStep() {
  // get all image in json file
  imgElementArry = await loadGallery("./gallery_list.json");
  totalPage = Math.ceil(imgElementArry.length / pageSize);

  // create gallery for current page (initial page 1)
  insertImgElements();

  // create pagination
  createPaginationElements();

  // open lightbox
  galleryBox.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "img") {
      lightBox.style.display = "flex";
      // 先清空旧动画（防止第二次无效）
      //lightBox.style.animation = 'none';
      //void lightBox.offsetWidth;  // 强制 reflow，让动画重新生效

      document.body.style.overflow = "hidden";
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;

      animeEventHandle = 0;
      lightBoxMain(Number(e.target.dataset.index));
    }
  });

  // zoom image or close lightbox when get click event during lightbox mode
  lightBox.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "img") {
      currentImg.classList.toggle("zoomed");
    }
    if (e.target === e.currentTarget) {
      closeLightBox();
    }
  });

  // button action during lightbox mode
  lightBoxClose.addEventListener("click", function (e) {
    closeLightBox();
  });

  lightBoxPrev.addEventListener("click", function (e) {
    animeEventHandle = 1;
    lightBoxMain(prevIdx);
  });

  lightBoxNext.addEventListener("click", function (e) {
    animeEventHandle = 2;
    lightBoxMain(nextIdx);
  });

  // control lightbox using keyboard
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (getComputedStyle(lightBox).display !== "none") {
        closeLightBox();
      }
    } else if (e.key === "ArrowLeft") {
      if (getComputedStyle(lightBoxPrev).display !== "none") {
        animeEventHandle = 1;
        lightBoxMain(prevIdx);
      }
    } else if (e.key === "ArrowRight") {
      if (getComputedStyle(lightBoxNext).display !== "none") {
        animeEventHandle = 2;
        lightBoxMain(nextIdx);
      }
    }
  });

  // pagination operation
  paginationGroup.addEventListener("click", function (e) {
    let tmpElement = e.target;
    // prev action
    if (
      tmpElement.classList.contains("pagination-prev") &&
      !tmpElement.classList.contains("page-index-disable")
    ) {
      currentPage--;
      insertImgElements();
      createPaginationElements();
    }
    // next action
    else if (
      tmpElement.classList.contains("pagination-next") &&
      !tmpElement.classList.contains("page-index-disable")
    ) {
      currentPage++;
      insertImgElements();
      createPaginationElements();
    }
    // page number action
    else if (
      tmpElement.classList.contains("page-index") &&
      tmpElement.classList.contains("page-child") &&
      !tmpElement.classList.contains("page-hightlight")
    ) { 
      currentPage = parseInt(tmpElement.innerHTML);
      insertImgElements();
      createPaginationElements();
    }
  });
  //Drag img
}

mainStep();
