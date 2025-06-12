// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // -------- MENU TOGGLE FUNCTIONALITY --------
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const sideMenuClose = document.querySelector('.side-menu-close');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.appendChild(overlay);
    
    menuToggle.addEventListener('click', function() {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    sideMenuClose.addEventListener('click', function() {
        closeSideMenu();
    });
    
    overlay.addEventListener('click', function() {
        closeSideMenu();
    });
    
    // Close side menu when clicking on a link
    const sideMenuLinks = document.querySelectorAll('.side-menu-links a');
    sideMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeSideMenu();
        });
    });
    
    function closeSideMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    }
    
    // -------- CAROUSEL FUNCTIONALITY --------
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselControls = document.querySelector('.carousel-controls');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carouselVideo = document.getElementById('carousel-intro-video');
    let currentSlide = 0;
    const slideCount = carouselSlides.length;
    let controlsTimeout;
    let slideInterval;
    
    // ---- CAROUSEL CONTROLS VISIBILITY ----
    if (carouselControls && carouselContainer) {
        // Initially hide controls
        carouselControls.style.opacity = '0';
        
        // Function to show controls
        function showControls() {
            carouselControls.style.opacity = '1';
            
            // Clear any existing timeout
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
            
            // Set new timeout to hide controls after 1 second of no movement
            controlsTimeout = setTimeout(function() {
                carouselControls.style.opacity = '0';
            }, 1000);
        }
        
        // Add mousemove event listener to the carousel container
        carouselContainer.addEventListener('mousemove', showControls);
        
        // Also show controls when entering the container
        carouselContainer.addEventListener('mouseenter', function() {
            showControls();
            clearInterval(slideInterval); // Pause auto-advance when hovering
        });
        
        // Hide controls when leaving the container
        carouselContainer.addEventListener('mouseleave', function() {
            carouselControls.style.opacity = '0';
            if (controlsTimeout) {
                clearTimeout(controlsTimeout);
            }
            slideInterval = setInterval(nextSlide, 5000); // Resume auto-advance
        });
    }
    
    // ---- CAROUSEL NAVIGATION ----
    // Initialize carousel
    function showSlide(index) {
        // Hide all slides
        carouselSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        carouselDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and activate its dot
        carouselSlides[index].classList.add('active');
        carouselDots[index].classList.add('active');
        
        currentSlide = index;
        
        // If we have a video and we're not on the video slide, pause it
        if (carouselVideo && index !== 0) {
            carouselVideo.pause();
        }
    }
    
    // Next slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slideCount) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slideCount - 1;
        }
        showSlide(prevIndex);
    }
    
    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
    }
    
    // Event listeners for dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSlide(index);
        });
    });
    
    // Auto-advance slides every 5 seconds
    slideInterval = setInterval(nextSlide, 5000);
    
    // ---- VIDEO AUTOPLAY HANDLING ----
    if (carouselVideo) {
        // Try to play the video
        const playPromise = carouselVideo.play();
        
        // Handle play promise (modern browsers return a promise from play())
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started successfully
                console.log('Video playing automatically');
            }).catch(error => {
                // Auto-play was prevented, add a click handler to play manually
                console.log('Autoplay prevented:', error);
                
                // Add click event to the slide to play video
                carouselVideo.parentElement.addEventListener('click', function(e) {
                    // Don't play video if clicking on controls
                    if (!e.target.closest('.carousel-controls')) {
                        carouselVideo.play();
                    }
                });
            });
        }
        
        // Play video when returning to first slide
        carouselDots[0].addEventListener('click', function() {
            setTimeout(() => {
                if (carouselVideo && !carouselVideo.paused) {
                    carouselVideo.play();
                }
            }, 100);
        });
    }
    
    /* Note: Carousel functionality is now handled in the main section above */
    
    // Typing Animation
    const typingElement = document.querySelector('.typing-text');
    const words = ['Creative Excellence', 'Bold Innovation', 'Strategic Thinking'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isEnd = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        
        typingElement.textContent = currentChar;
        
        if (!isDeleting && charIndex < currentWord.length) {
            // Typing
            charIndex++;
            setTimeout(typeEffect, 100);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(typeEffect, 50);
        } else if (charIndex === 0 && isDeleting) {
            // After deleting, switch to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
        } else {
            // Pause at the end of typing a word
            isDeleting = true;
            setTimeout(typeEffect, 1500);
        }
    }
    
    // Start the typing animation
    if (typingElement) {
        setTimeout(typeEffect, 1000);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.classList.add('scroll-top-btn');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll animation to elements
    const animateElements = document.querySelectorAll('.portfolio-item, .service-item, .team-member, .testimonial-card, .client-logo');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.innerHTML = `
        .portfolio-item, .service-item, .team-member, .testimonial-card, .client-logo {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .portfolio-item.animate, .service-item.animate, .team-member.animate, .testimonial-card.animate, .client-logo.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #1e88e5;
            color: #fff;
            border: none;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .scroll-top-btn.show {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-top-btn:hover {
            background-color: #1565c0;
            transform: translateY(-5px);
        }
    `;
    document.head.appendChild(style);
    
    // Check for animations on load and scroll
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
    
    // IMPORTANT: NO FORM SUBMISSION CODE HERE
    // We are not handling form submission via JavaScript at all
    // The form is submitted directly to FormSubmit.co
});
