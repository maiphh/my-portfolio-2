// Simple animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Welcome animation
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const welcomeText = document.getElementById('welcome-text');
    const heroSection = document.getElementById('hero-section');
    
    // Array of greetings in different languages
    const greetings = [
        "Hello",            // English
        "Bonjour",          // French
        "Hola",             // Spanish
        "Ciao",             // Italian
        "こんにちは",        // Japanese
        "안녕하세요",         // Korean
        "你好",              // Chinese
        "Hallo",            // German
        "Olá",              // Portuguese
        "नमस्ते",            // Hindi
        "Привет"            // Russian
    ];
    
    let currentIndex = 0;
    
    // Function to show the next greeting
    function showNextGreeting() {
        welcomeText.style.animation = 'none';
        welcomeText.offsetHeight; // Trigger reflow
        welcomeText.style.animation = 'textFade 0.3s ease-in-out';
        welcomeText.textContent = greetings[currentIndex];
        currentIndex = (currentIndex + 1) % greetings.length;
    }
    
    // Show first greeting
    showNextGreeting();
    
    // Show a new greeting every 350ms (slightly slower for better readability)
    const intervalId = setInterval(showNextGreeting, 350);
    
    // After languages cycle, show the final greeting and scroll down
    setTimeout(() => {
        // Stop cycling through languages
        clearInterval(intervalId);
        
        // Show final greeting - personalized
        welcomeText.textContent = "Welcome";
        
        // Show scroll indicator
        const scrollIndicator = document.getElementById('scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
        
        // Add a click/touch event to the welcome overlay to initiate scrolling
        welcomeOverlay.style.cursor = 'pointer';
        welcomeOverlay.addEventListener('click', initiateScrollDown);
        
        // Auto-scroll after 1.5 more seconds if user doesn't click
        setTimeout(initiateScrollDown, 1500);
    }, 0);
    
    // Function to handle the scroll transition
    function initiateScrollDown() {
        // Remove event listener to prevent multiple triggers
        welcomeOverlay.removeEventListener('click', initiateScrollDown);
        
        // Reveal hero section first so it's ready when we scroll
        if (heroSection) {
            heroSection.classList.add('visible');
        }
        
        // Hide all reveal sections initially
        initializeScrollRevealElements();
        
        // Remove the auto-scroll behavior
        // As we fade out the overlay
        welcomeOverlay.style.opacity = '0';
        welcomeOverlay.style.pointerEvents = 'none';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            welcomeOverlay.remove();
        }, 1000);
    }

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('button[type="button"]');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            alert('Mobile menu would open here in a full implementation');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hero section hover effect
    const spotlight = document.getElementById('spotlight');
    
    if (heroSection && spotlight) {
        heroSection.addEventListener('mousemove', function(e) {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            spotlight.style.opacity = '1';
            spotlight.style.left = `${x}px`;
            spotlight.style.top = `${y}px`;
        });
        
        heroSection.addEventListener('mouseleave', function() {
            spotlight.style.opacity = '0';
        });
    }

    // Add fade-in class to sections as they come into view
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Enhanced scroll reveal functionality
    function initializeScrollRevealElements() {
        // Select all elements that should have reveal animations
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        // Hide all elements initially
        revealElements.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = getInitialTransform(el);
            el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        });
        
        // Set up the intersection observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reveal the element with a slight delay based on its position
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0) scale(1)";
                    }, delay);
                    
                    // Unobserve after animation
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px" // Trigger slightly before element enters viewport
        });
        
        // Observe all reveal elements
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
    
    // Helper to determine the initial transform based on element type or class
    function getInitialTransform(element) {
        // You can customize different reveal effects based on classes
        if (element.classList.contains('reveal-from-left')) {
            return "translateX(-50px) translateY(0)";
        } else if (element.classList.contains('reveal-from-right')) {
            return "translateX(50px) translateY(0)";
        } else if (element.classList.contains('reveal-scale')) {
            return "translateY(0) scale(0.95)";
        } else {
            // Default reveal from bottom
            return "translateY(30px)";
        }
    }
    
    // Apply the reveal classes to specific elements
    function setupRevealElements() {
        // Timeline items reveal from left
        document.querySelectorAll('.timeline-item').forEach((el, index) => {
            el.classList.add('reveal-on-scroll', 'reveal-from-left');
            el.dataset.revealDelay = index * 150; // Staggered animation
        });
        
        // Skills grid reveals from bottom with scaling
        document.querySelectorAll('.mt-20 .grid-cols-2 > div').forEach((el, index) => {
            el.classList.add('reveal-on-scroll', 'reveal-scale');
            el.dataset.revealDelay = index * 100; 
        });
        
        // Project cards reveal from bottom with staggered timing
        document.querySelectorAll('.project-card').forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            el.dataset.revealDelay = index * 200;
        });
        
        // Game cards reveal from right side
        document.querySelectorAll('.game-card').forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            el.dataset.revealDelay = index * 200;
        });
        
        // Section headers reveal with scale effect
        document.querySelectorAll('.lg\\:text-center').forEach(el => {
            el.classList.add('reveal-on-scroll');
        });

        // Contact 
        document.querySelectorAll('.contact-item').forEach((el, index) => {
            el.classList.add('reveal-on-scroll');
            el.dataset.revealDelay = index * 200; // Staggered animation
        });
    }
    
    // Initialize the reveal animations
    setupRevealElements();
    
    // If welcome animation is skipped, initialize reveal elements immediately
    if (!welcomeOverlay || welcomeOverlay.style.opacity === "0") {
        initializeScrollRevealElements();
    }
});

// Create and append the music button with new SVG wave line
const musicButton = document.createElement('div');
musicButton.id = 'music-button';
musicButton.classList.add('muted');
musicButton.title = 'Play background music';

// Create sound line with SVG for better wave animation
const soundLine = document.createElement('div');
soundLine.className = 'sound-line';

// Create SVG element with path for the wave
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute('viewBox', '0 0 20 14');

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute('d', 'M 0,7 Q 5,7 10,7 T 20,7');
svg.appendChild(path);
soundLine.appendChild(svg);

musicButton.appendChild(soundLine);
document.body.appendChild(musicButton);

// Create and configure the audio element
const audio = new Audio();
audio.src = './sound/midnight-daydreams-250159.mp3';
audio.loop = true;
audio.volume = 0.2;
audio.preload = 'auto';

// Flag to track if we're trying to play
let isAttemptingToPlay = false;

// Initialize audio - try to load it
audio.load();

// Event listeners for audio state
audio.addEventListener('canplaythrough', function() {
    if (isAttemptingToPlay) {
        playAudio();
    }
    musicButton.classList.remove('loading');
});

audio.addEventListener('play', updateMusicButtonState);
audio.addEventListener('pause', updateMusicButtonState);
audio.addEventListener('error', function(e) {
    console.error('Audio error:', e);
    musicButton.classList.remove('loading');
    musicButton.classList.add('muted');
    isAttemptingToPlay = false;
});

// Add more robust event listener with better debugging
musicButton.addEventListener('click', function() {

    
    try {
        if (audio.paused) {
            isAttemptingToPlay = true;
            musicButton.classList.add('loading');
            
            // Check if file exists first
            fetch(audio.src, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // File exists, try to play
                        playAudio();
                    } else {
                        // File not found
                        console.error(`Audio file not found at ${audio.src}`);
                        handleAudioError(new Error(`File not found (${response.status})`));
                    }
                })
                .catch(error => {
                    console.error('Error checking audio file:', error);
                    handleAudioError(error);
                });
        } else {
            // Pause the audio
            audio.pause();
            isAttemptingToPlay = false;
            console.log('Audio paused successfully');
            updateMusicButtonState();
        }
    } catch (error) {
        console.error('Error handling music button click:', error);
        musicButton.classList.remove('loading');
        handleAudioError(error);
    }
});

// Function to handle audio errors
function handleAudioError(error) {
    console.error('Audio error details:', error);
    
    // Provide visual feedback about the error
    musicButton.classList.remove('loading');
    musicButton.classList.add('muted', 'error');
    musicButton.title = 'Audio unavailable: ' + (error.message || 'Unknown error');
    
    // Reset state
    isAttemptingToPlay = false;
    
    // Log additional debugging info
    console.info('Audio element state:', {
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState,
        error: audio.error ? {
            code: audio.error.code,
            message: audio.error.message
        } : 'No error object'
    });
}

// Function to play audio with improved error handling
function playAudio() {
    // Reset error states
    musicButton.classList.remove('error');
    
    audio.play()
        .then(() => {
            console.log('Successfully started playback');
            isAttemptingToPlay = false;
            updateMusicButtonState();
        })
        .catch(err => {
            console.error('Error starting playback:', err);
            isAttemptingToPlay = false;
            musicButton.classList.remove('loading');
            handleAudioError(err);
        });
}

// Function to update the button state
function updateMusicButtonState() {
    console.log('Updating button state, audio paused:', audio.paused);
    
    musicButton.classList.remove('loading');
    
    if (audio.paused) {
        musicButton.classList.remove('playing');
        musicButton.classList.add('muted');
        // Flat line when paused
        const path = musicButton.querySelector('.sound-line svg path');
        if (path) {
            path.setAttribute('d', 'M 0,7 Q 5,7 10,7 T 20,7');
        }
        musicButton.title = 'Play background music';
    } else {
        musicButton.classList.remove('muted');
        musicButton.classList.add('playing');
        musicButton.title = 'Pause background music';
    }
}

// Hero section interactive hover effect
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('hero-section');
    const gridEffect = heroSection.querySelector('.grid-effect');
    
    if (heroSection && gridEffect) {
        heroSection.addEventListener('mousemove', function(e) {
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Update the radial gradient position with CSS variables
            gridEffect.style.setProperty('--x', `${x}%`);
            gridEffect.style.setProperty('--y', `${y}%`);
        });
        
        // Handle mouse enter/leave for additional effects
        heroSection.addEventListener('mouseenter', function() {
            gridEffect.style.opacity = '1';
        });
        
        heroSection.addEventListener('mouseleave', function() {
            gridEffect.style.opacity = '0';
            
            // Reset transforms when mouse leaves
            const columns = heroSection.querySelectorAll('.max-w-7xl > div');
            columns.forEach(col => {
                col.style.transform = 'translateX(0) translateY(0)';
            });
        });
    }
});

// Enhanced hero section interactive hover effect with parallax bending
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('hero-section');
    const gridEffect = heroSection.querySelector('.grid-effect');
    
    // Create parallax wrap element for bending effect if it doesn't exist
    if (!document.querySelector('.parallax-wrap')) {
        const parallaxWrap = document.createElement('div');
        parallaxWrap.className = 'parallax-wrap';
        heroSection.appendChild(parallaxWrap);
    }
    
    const parallaxWrap = heroSection.querySelector('.parallax-wrap');
    const heroGrid = heroSection.querySelector('.chessboard-bg::before');
    const contentSections = heroSection.querySelectorAll('.max-w-7xl > div');
    const heroImage = heroSection.querySelector('.max-w-7xl > div:first-child img');
    
    // Position history queue for snake-like trailing effect
    const positionHistory = [];
    const maxHistoryLength = 20; // How many positions to remember
    let animationFrameId = null;
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            // Calculate mouse position relative to the hero section
            const rect = heroSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Add current position to history queue
            positionHistory.unshift({ x, y });
            
            // Keep the queue at the desired length
            if (positionHistory.length > maxHistoryLength) {
                positionHistory.pop();
            }
            
            // Cancel previous animation frame if exists
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            // Use requestAnimationFrame for smoother rendering
            animationFrameId = requestAnimationFrame(() => updateParallaxEffects(x, y));
        });
        
        // Function to update all parallax effects with trail animation
        function updateParallaxEffects(currentX, currentY) {
            // Get positions for different delay points
            const gridPos = getPositionWithDelay(0.1); // Almost immediate
            const wrapperPos = getPositionWithDelay(0.2);
            const content1Pos = getPositionWithDelay(0.3);
            const content2Pos = getPositionWithDelay(0.4);
            const imagePos = getPositionWithDelay(0.25);
            
            // Update the radial gradient position (no delay - follows cursor directly)
            gridEffect.style.setProperty('--x', `${currentX}%`);
            gridEffect.style.setProperty('--y', `${currentY}%`);
            
            // Calculate offset values from current position
            const currentOffsetX = (currentX - 50) / 10; // -5 to 5 range
            const currentOffsetY = (currentY - 50) / 10; // -5 to 5 range
            
            // Apply parallax bending transform with slight delay
            const gridOffsetX = (gridPos.x - 50) / 10;
            const gridOffsetY = (gridPos.y - 50) / 10;
            heroSection.style.setProperty('--grid-x', `${gridOffsetX * 0.5}deg`);
            heroSection.style.setProperty('--grid-y', `${gridOffsetY * 0.5}deg`);
            
            // Apply warping effect with more delay
            if (parallaxWrap) {
                const wrapOffsetX = (wrapperPos.x - 50) / 10;
                const wrapOffsetY = (wrapperPos.y - 50) / 10;
                parallaxWrap.style.transform = `rotateX(${-wrapOffsetY * 0.5}deg) rotateY(${wrapOffsetX * 0.5}deg) translateZ(20px)`;
            }
            
            // Apply background position (base layer)
            heroSection.style.cssText = `--x: ${currentX}%; --y: ${currentY}%;`;
            heroSection.style.backgroundPosition = `calc(50% + ${currentOffsetX * 2}px) calc(50% + ${currentOffsetY * 2}px)`;
            
            // Transform content sections with different delays for snake effect
            if (contentSections[0]) {
                const content1OffsetX = (content1Pos.x - 50) / 10;
                const content1OffsetY = (content1Pos.y - 50) / 10;
                contentSections[0].style.transform = `translateX(${-content1OffsetX * 1.2}px) translateY(${-content1OffsetY * 1.2}px) translateZ(10px)`;
            }
            
            if (contentSections[1]) {
                const content2OffsetX = (content2Pos.x - 50) / 10;
                const content2OffsetY = (content2Pos.y - 50) / 10;
                contentSections[1].style.transform = `translateX(${content2OffsetX * 0.8}px) translateY(${content2OffsetY * 0.8}px) translateZ(5px)`;
            }
            
            // Add subtle tilt to the image with medium delay
            if (heroImage) {
                const imageOffsetX = (imagePos.x - 50) / 10;
                const imageOffsetY = (imagePos.y - 50) / 10;
                heroImage.style.transform = `perspective(1000px) rotateX(${imageOffsetY * 0.2}deg) rotateY(${-imageOffsetX * 0.2}deg)`;
            }
            
            // Add subtle transform to grid lines
            document.documentElement.style.setProperty('--grid-offset-x', `${currentOffsetX * 0.3}px`);
            document.documentElement.style.setProperty('--grid-offset-y', `${currentOffsetY * 0.3}px`);
            
            // Ensure grid effect is visible
            gridEffect.style.opacity = '1';
        }
        
        // Helper function to get position with delay (0-1 range, where 1 is max delay)
        function getPositionWithDelay(delayFactor) {
            // Calculate the index based on delay factor
            const index = Math.min(
                Math.floor(delayFactor * (positionHistory.length - 1)), 
                positionHistory.length - 1
            );
            
            // Return the delayed position or current position if history is empty
            return positionHistory[index] || { x: 50, y: 50 };
        }
        
        // Reset all transforms when mouse leaves
        heroSection.addEventListener('mouseleave', function() {
            gridEffect.style.opacity = '0';
            
            // Reset transforms
            if (parallaxWrap) {
                parallaxWrap.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
            }
            
            // Reset content transforms
            contentSections.forEach(col => {
                col.style.transform = 'translateX(0) translateY(0) translateZ(0)';
            });
            
            // Reset image transform
            if (heroImage) {
                heroImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            }
            
            // Reset grid position
            document.documentElement.style.setProperty('--grid-offset-x', '0px');
            document.documentElement.style.setProperty('--grid-offset-y', '0px');
            
            // Reset hero section background
            heroSection.style.backgroundPosition = '50% 50%';
        });
    }
});

// Navigation hide/show on scroll
(function() {
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;
    let scrollingTimeout;
    const scrollThreshold = 10; // Minimum scroll amount to trigger
    
    // Initialize scroll direction tracking
    let isScrollingDown = true;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        isScrollingDown = currentScrollY > lastScrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        // Clear the timeout on new scroll
        clearTimeout(scrollingTimeout);
        
        if (currentScrollY <= 10) {
            // Always show nav at the top of page
            nav.classList.remove('nav-hidden');
            nav.classList.remove('nav-scrolling-up');
        } else if (scrollDifference > scrollThreshold) {
            // Only trigger for significant scroll amounts
            if (isScrollingDown) {
                // Hide nav when scrolling down
                nav.classList.add('nav-hidden');
                nav.classList.remove('nav-scrolling-up');
            } else {
                // Show nav when scrolling up with animation
                nav.classList.remove('nav-hidden');
                nav.classList.add('nav-scrolling-up');
            }
        }
        
        // Set timeout to remove the scrolling-up animation after scrolling stops
        scrollingTimeout = setTimeout(function() {
            nav.classList.remove('nav-scrolling-up');
        }, 1000);
        
        // Update last scroll position
        lastScrollY = currentScrollY;
    });
})();

// Create an audio manager for handling UI sounds
const SoundManager = {
    // Web Audio API context
    audioContext: null,
    
    // Last played times to prevent spamming
    lastPlayed: {
        hover: 0,
        click: 0
    },
    
    // Minimum delay between sound plays (milliseconds)
    minDelay: 100,
    
    // Volume settings
    volume: {
        hover: 0.1,
        click: 0.2
    },
    
    // Initialize the sound manager
    init() {
        // Create audio context
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('Audio context created successfully');
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            return;
        }
        
        // Add hover sounds to interactive elements
        this.addHoverSounds();
        console.log('Hover sounds initialized');
    },
    
    // Create a simple synthetic sound (no file dependency)
    createSound(type) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Different sound configs for different interaction types
        if (type === 'hover') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // Higher pitch for hover
            gainNode.gain.setValueAtTime(this.volume.hover, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        } else if (type === 'click') {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(this.volume.click, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        }
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
        
        return { oscillator, gainNode };
    },
    
    // Play a sound with debouncing
    play(soundName) {
        const now = Date.now();
        if (now - this.lastPlayed[soundName] < this.minDelay) return;
        
        this.lastPlayed[soundName] = now;
        this.createSound(soundName);
        console.log(`Playing ${soundName} sound`);
    },
    
    // Add hover sounds to interactive elements
    addHoverSounds() {
        // Define selectors for interactive elements
        const interactiveElements = [
            'a', 
            'button', 
            '.nav-icon',
            '.project-link',
            '.game-card',
            '.see-all-link',
            '#music-button',
            '.lusion-project'
        ];
        
        // Add event listeners to each element
        interactiveElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            console.log(`Found ${elements.length} ${selector} elements`);
            
            elements.forEach(element => {
                // Only add once
                if (element.dataset.hasSoundHover) return;
                element.dataset.hasSoundHover = true;
                
                element.addEventListener('mouseenter', () => {
                    console.log(`Hover detected on ${selector}`);
                    this.play('hover');
                });
                
                element.addEventListener('click', () => {
                    this.play('click');
                });
            });
        });
    }
};

// Make sure context is created on user interaction to satisfy autoplay policy
document.addEventListener('click', function initAudio() {
    if (SoundManager.audioContext) {
        // Resume context if it was suspended
        if (SoundManager.audioContext.state === 'suspended') {
            SoundManager.audioContext.resume();
        }
    } else {
        // Initialize on first interaction
        SoundManager.init();
    }
    // Remove this listener after first click
    document.removeEventListener('click', initAudio);
}, { once: false });

// Initialize sound manager after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Other DOM content loaded handlers...
    
    // Initialize soundManager
    setTimeout(() => {
        SoundManager.init();
        refreshHoverSounds();
    }, 500); // Small delay to ensure all elements are ready
});

// For dynamically added elements, re-apply sound effects
const refreshHoverSounds = () => {
    if (SoundManager && SoundManager.audioContext) {
        SoundManager.addHoverSounds();
    }
};

// Re-apply hover sounds after any potential DOM updates
const observer = new MutationObserver(() => {
    refreshHoverSounds();
});

// Start observing DOM changes
observer.observe(document.body, { 
    childList: true,
    subtree: true
});
