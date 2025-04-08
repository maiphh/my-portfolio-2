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
        welcomeText.textContent = "Welcome to my portfolio";
        
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
    }, 2100);
    
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
