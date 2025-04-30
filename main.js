// References to DOM Elements
const book = document.querySelector("#book");
const rotateWarning = document.querySelector("#rotate-warning");
const continueAnywayBtn = document.querySelector("#continue-anyway");

const papers = [];
const totalPapers = 10;


// Initialize papers array and set proper z-index
for (let i = 1; i <= totalPapers; i++) {
    const paper = document.querySelector(`#p${i}`);
    if (paper) {
        papers.push(paper);
    }
}

// Set z-index for proper stacking
function updateZIndex() {
    papers.forEach((paper, index) => {
        paper.style.zIndex = papers.length - index;
    });
}
updateZIndex();

// Add touch swipe functionality
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50;

book.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

book.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchStartX - touchEndX > minSwipeDistance) {
        // Swipe left - go to next page
        goNextPage();
    } else if (touchEndX - touchStartX > minSwipeDistance) {
        // Swipe right - go to previous page
        goPrevPage();
    }
}


// Book click functionality
book.addEventListener('click', (e) => {
    // Use the book container for click detection instead of individual papers
    const clickX = e.clientX;
    const bookMiddle = window.innerWidth / 2; // ✅ true visual middle of screen
    
    // If click is on the right side, go to next page
    if (clickX > bookMiddle) {
        goNextPage();
    } 
    // If click is on the left side, go to previous page
    else {
        goPrevPage();
    }
});

// Event Listeners
continueAnywayBtn.addEventListener("click", dismissWarning);

// Business Logic
let currentLocation = 1;
let maxLocation = totalPapers + 1;
let userDismissedWarning = false;

function openBook() {
    // Adjust for screen size
    if (window.innerWidth <= 768) {
        book.style.transform = "translateX(50%)";
    } else {
        book.style.transform = "translateX(50%)";
    }
    book.classList.add("book-open"); 
}

function closeBook(isAtBeginning) {
    if (isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
    book.classList.remove("book-open");
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

// Check and handle device orientation
function checkOrientation() {
    if (!userDismissedWarning && window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
        // Portrait mode on mobile - show warning
        rotateWarning.style.display = 'flex';
    } else {
        // Landscape mode or desktop - hide warning
        rotateWarning.style.display = 'none';
    }
    
    // Update book position based on current state
    if (currentLocation === 1) {
        closeBook(true);
    } else if (currentLocation === totalPapers + 1) {
        closeBook(false);
    } else {
        openBook();
    }
    
}

function dismissWarning() {
    userDismissedWarning = true;
    rotateWarning.style.display = 'none';
}

// Handle resizing and orientation changes
function handleResize() {
    checkOrientation();
    updateZIndex();
}

// Initialize event listeners
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);
window.addEventListener('load', handleResize);

// Initial check on page load
checkOrientation();