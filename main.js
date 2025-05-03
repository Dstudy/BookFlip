// References to DOM Elements
const book = document.querySelector("#book");
const rotateWarning = document.querySelector("#rotate-warning");
const continueAnywayBtn = document.querySelector("#continue-anyway");

const papers = [];
const totalPapers = 12;


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
            console.log("Paper next" + currentLocation);
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
            console.log("Paper prev" + currentLocation);
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

//Image Floating

// Configuration
const config = {
    numImages: 10,
    minSpeed: 0.5, // Smaller value for slower movement
    maxSpeed: 2,   // Smaller max value
    minSizePercent: 35,  // Size as percentage of viewport width
    maxSizePercent: 40, // Size as percentage of viewport width
    minHorizontalSpace: 0.3 // minimum horizontal space between images (as a ratio of window width)
};

// Image objects array to track all properties
const floatingImages = [];

// Image URLs
const imageUrls = [
    'background-float/image1.png',
    'background-float/image2.png',
    'background-float/image3.png',
    'background-float/image4.png',
    'background-float/image5.png',
    'background-float/image6.png',
    'background-float/image7.png',
    'background-float/image8.png',
    'background-float/image9.png',
    'background-float/image10.png',
];

// Calculate size based on screen dimensions
function calculateSize(sizePercent) {
    // Use the smaller dimension (width or height) to determine size
    const baseDimension = Math.min(window.innerWidth, window.innerHeight);
    return (baseDimension * sizePercent) / 100;
}

// Find a non-overlapping horizontal position
function findNonOverlappingPosition(imageSize) {
    const minDistance = window.innerWidth * config.minHorizontalSpace;
    let x, isOverlapping;
    
    // Try to find a non-overlapping position (max 15 attempts)
    let attempts = 0;
    do {
        attempts++;
        isOverlapping = false;
        x = Math.random() * (window.innerWidth - imageSize);
        
        // Check if this position overlaps with existing images
        for (const img of floatingImages) {
            if (img.element && Math.abs(x - img.x) < minDistance) {
                isOverlapping = true;
                break;
            }
        }
    } while (isOverlapping && attempts < 15);
    
    return x;
}

// Initialize floating images
function initializeFloatingImages() {
    for (let i = 0; i < config.numImages; i++) {
        // Create image element
        const imgElement = document.createElement('img');
        imgElement.className = 'floating-image';
        
        // Select an image (each image gets a different one)
        imgElement.src = imageUrls[i % imageUrls.length];
        
        // Random size as percentage of viewport
        const sizePercent = Math.random() * (config.maxSizePercent - config.minSizePercent) + config.minSizePercent;
        const size = calculateSize(sizePercent);
        imgElement.style.width = `${size}px`;
        
        // Find position
        const x = findNonOverlappingPosition(size);
        
        // Random vertical start position (staggered)
        const y = window.innerHeight + (Math.random() * window.innerHeight);
        
        // Speed scaled to viewport height (slower on larger screens)
        const baseSpeed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
        const speed = baseSpeed * (window.innerHeight / 1000); // Normalize for screen height
        
        // Higher opacity for better visibility (0.6 to 0.9)
        const opacity = 1;
        
        // Store image data with size percentage instead of absolute size
        const imageData = {
            element: imgElement,
            x: x,
            y: y,
            sizePercent: sizePercent,
            size: size,
            speed: speed,
            opacity: opacity
        };
        
        // Add to array
        floatingImages.push(imageData);
        
        // Set initial position and opacity
        imgElement.style.left = `${x}px`;
        imgElement.style.top = `${y}px`;
        imgElement.style.opacity = opacity;
        
        // Add to DOM
        document.body.appendChild(imgElement);
    }
}

// Animation loop
function animateImages() {
    for (const img of floatingImages) {
        // Move upward
        img.y -= img.speed;
        
        // If image is completely off screen, reset to bottom with new properties
        if (img.y + img.size < 0) {
            // Reset position to below screen
            img.y = window.innerHeight + (Math.random() * 50);
            
            // New random size percentage
            img.sizePercent = Math.random() * (config.maxSizePercent - config.minSizePercent) + config.minSizePercent;
            img.size = calculateSize(img.sizePercent);
            
            // Find new horizontal position
            img.x = findNonOverlappingPosition(img.size);
            
            // New random speed
            const baseSpeed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
            img.speed = baseSpeed * (window.innerHeight / 1000);
            
            // New random opacity (higher range for better visibility)
            img.opacity = 1;
            
            // Update image size
            img.element.style.width = `${img.size}px`;
            
            // Reset opacity at bottom
            img.element.style.opacity = img.opacity;
        } else if (img.y < 100) {
            // Only fade out in the top 100px of screen
            const fadeRatio = Math.max(0, img.y / 100);
            img.element.style.opacity = fadeRatio * img.opacity;
        }
        
        // Update position
        img.element.style.left = `${img.x}px`;
        img.element.style.top = `${img.y}px`;
    }
    
    requestAnimationFrame(animateImages);
}

// Update all image sizes when window resizes
function updateImagesForResize() {
    for (const img of floatingImages) {
        // Recalculate size based on new screen dimensions
        img.size = calculateSize(img.sizePercent);
        img.element.style.width = `${img.size}px`;
        
        // Update speed based on new screen height
        const baseSpeed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
        img.speed = baseSpeed * (window.innerHeight / 1000);
        
        // Make sure images are still within screen bounds
        if (img.x + img.size > window.innerWidth) {
            img.x = window.innerWidth - img.size;
        }
    }
}

// Initialize and start animation on page load
window.addEventListener('load', () => {
    initializeFloatingImages();
    requestAnimationFrame(animateImages);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Option 1: Update existing images for new screen size
    updateImagesForResize();
    
    // Option 2: Complete reset (uncomment below if you prefer this approach)
    /*
    // Remove all existing images
    for (const img of floatingImages) {
        if (img.element && img.element.parentNode) {
            img.element.remove();
        }
    }
    
    // Clear the array
    floatingImages.length = 0;
    
    // Reinitialize
    initializeFloatingImages();
    */
});
  
