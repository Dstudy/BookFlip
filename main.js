// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const papers = [];
const totalPapers = 10;

for (let i = 1; i <= totalPapers; i++) {
    const paper = document.querySelector(`#p${i}`);
    if (paper) {
        papers.push(paper);
    }
}

papers.forEach((paper, index) => {
    paper.style.zIndex = papers.length - index;
  });

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// Business Logic
let currentLocation = 1;
let maxLocation = totalPapers + 1;

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-300px)";
    nextBtn.style.transform = "translateX(300px)";
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
        nextBtn.style.transform = "translateX(-550px)";
    }

    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) openBook();

        const paper = papers[currentLocation - 1];
        if (paper) {
            paper.classList.add("flipped");
            paper.style.zIndex = currentLocation;
        }

        if (currentLocation === totalPapers) closeBook(false);

        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        if (currentLocation === 2) closeBook(true);

        const paper = papers[currentLocation - 2];
        if (paper) {
            paper.classList.remove("flipped");
            paper.style.zIndex = totalPapers - currentLocation + 2;
        }

        if (currentLocation === totalPapers + 1) openBook();

        currentLocation--;
    }
}