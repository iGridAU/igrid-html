document.addEventListener('DOMContentLoaded', function() {

    // --- Hero Text Rotation ---
    const rotatingTextElement = document.getElementById('rotating-text');
    if (rotatingTextElement) {
        const rotatingTexts = [
            "Energy Storage Experts.",
            "Sustainability Consultants.",
            "IoT Provider.",
            "Asset Management Team.",
            "24/7 Support Team."
        ];
        let currentIndex = 0;
        setInterval(() => {
            // Use CSS transitions for smoother fade if desired
            rotatingTextElement.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % rotatingTexts.length;
                rotatingTextElement.textContent = rotatingTexts[currentIndex];
                rotatingTextElement.style.opacity = 1; // Fade back in
            }, 300); // Duration of the fade-out transition
        }, 4000); // Change text every 4 seconds
    }

    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    // --- Smooth Scroll for Contact Link (Added logic to close mobile menu) ---
    // Get all nav links that point to internal sections, including the contact link
    const internalLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Only prevent default and scroll if it's a valid internal link
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Scroll to the target element
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // If mobile menu is open, close it
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    }
    ); // Added closing parenthesis here

    // --- Customer Carousel ---
    const carouselTrack = document.querySelector('.carousel-track');
    // Check if carousel elements exist before proceeding
    if (carouselTrack) {
        const slides = Array.from(carouselTrack.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let slideWidth; // Will be calculated
        let currentSlide = 0;
        let visibleSlides = 3; // Default for desktop
        const totalSlides = slides.length;


        // Define moveToSlide using function declaration for proper hoisting
        function moveToSlide(targetSlideIndex) {
            if (!carouselTrack || !slides.length) return;

            // Adjust target index for loop (basic loop)
            if (targetSlideIndex < 0) {
                 targetSlideIndex = totalSlides - visibleSlides;
            } else if (targetSlideIndex > totalSlides - visibleSlides) {
                 targetSlideIndex = 0;
            }

            const offset = -slideWidth * targetSlideIndex;
            carouselTrack.style.transform = 'translateX(' + offset + 'px)';
            currentSlide = targetSlideIndex;
            updateDots();
        }

        function updateVisibleSlides() {
             // Corrected logic for screen sizes
             if (window.innerWidth <= 768) { // Mobile
                visibleSlides = 1;
             } else if (window.innerWidth <= 992) { // Tablet/Medium
                 visibleSlides = 2;
             } else { // Desktop
                 visibleSlides = 3;
             }

             // Recalculate slideWidth based on new number of visible slides and container width
             const containerWidth = carouselTrack.parentElement.getBoundingClientRect().width;
             if (visibleSlides > 0 && slides.length > 0) { // Avoid division by zero or empty slides
                slideWidth = containerWidth / visibleSlides;
                slides.forEach(slide => slide.style.minWidth = `${slideWidth}px`);
             } else {
                 slideWidth = 0; // Handle case with no slides
             }


             // Re-position carousel after resize
             // Ensure currentSlide doesn't go out of bounds for the new visibleSlides setting
             const maxSlideIndex = Math.max(0, totalSlides - visibleSlides);
             if (currentSlide > maxSlideIndex) {
                 currentSlide = maxSlideIndex; // Go to the last possible slide
             }
             // Re-create dots if the number of possible views changes? No, let's keep dot logic simpler, only create once on load based on max potential dots.
             // Adjust dot visibility or update logic if visibleSlides changes.
             // Simple approach: dots represent the initial pages (0, 1, 2...) based on desktop view.
             // A more complex carousel would regenerate dots or have logic that adapts to the current visible slides.
             // For this simple carousel, the dots will just reflect the index of the first visible slide,
             // regardless of how many are visible.
             updateDots(); // Update dots based on new position
             moveToSlide(currentSlide); // Move to the adjusted or current slide position

         }


        const updateDots = () => {
            if (!dotsNav) return;
            const dots = Array.from(dotsNav.children);
            dots.forEach(dot => dot.classList.remove('active'));
            // Highlight the dot corresponding to the currently visible first slide index
             if (dots[currentSlide]) {
                  dots[currentSlide].classList.add('active');
             }
        };

        // Create dots only if dotsNav exists and there are slides
        if (dotsNav && totalSlides > 0) {
             // Create dots - one for each possible starting slide index.
             // Max index is totalSlides - visibleSlides (for desktop, which is 3).
             // So the number of distinct starting positions is totalSlides - 3 + 1.
             // However, this number changes based on visibleSlides.
             // Let's generate dots based on the maximum number of pages possible (desktop view)
             // or simply one dot per slide if looping is desired.
             // Let's generate one dot per slide for simplicity with the looping logic implemented.
             dotsNav.innerHTML = ''; // Clear existing dots
             slides.forEach((slide, index) => { // Create one dot per original slide
                 const dot = document.createElement('button');
                 dot.classList.add('carousel-dot');
                 // The dot should represent reaching the start of that slide's position.
                 // This can get tricky with multiple visible slides.
                 // Let's make dots represent the *viewable pages* instead, based on the maximum visible slides (3) initially.
                 // If we show 3 slides, dot 0 is slides 0-2, dot 1 is 1-3, etc.
                 // The number of pages is totalSlides - visibleSlides + 1.
                 // Let's regenerate dots in updateVisibleSlides to match current view.

                 // Simplified dot generation: Create a dot for each potential starting index (page).
                 // This requires recalculating the number of dots whenever visibleSlides changes.
                 // Moving dot generation into updateVisibleSlides:

             });
             // Initial dot generation will happen in updateVisibleSlides
        }

        // Define dot generation and update logic within updateVisibleSlides or a helper function
        // Moved dot generation logic here to be called by updateVisibleSlides
        function generateDots() {
             if (!dotsNav || totalSlides === 0) return;
             dotsNav.innerHTML = ''; // Clear existing dots
             // Number of "pages" is totalSlides - visibleSlides + 1. Need at least 1 page.
             const numPages = Math.max(1, totalSlides - visibleSlides + 1);

             for (let i = 0; i < numPages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                // A dot represents reaching the i-th page/start position
                // With multiple visible slides, dot i corresponds to currentSlide = i
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    moveToSlide(i); // Move to the i-th starting position
                });
                dotsNav.appendChild(dot);
             }
             updateDots(); // Ensure correct dot is active after regeneration
        }


        // Next button
        nextButton.addEventListener('click', e => {
            let nextSlideIndex = currentSlide + 1;
            // Basic loop: if you hit the end, go back to the start
             const maxSlideIndex = Math.max(0, totalSlides - visibleSlides); // Ensure non-negative
             if (nextSlideIndex > maxSlideIndex) {
                  nextSlideIndex = 0;
             }
            moveToSlide(nextSlideIndex);
        });

        // Prev button
        prevButton.addEventListener('click', e => {
            let prevSlideIndex = currentSlide - 1;
            // Basic loop: if you hit the start, go to the end
             const maxSlideIndex = Math.max(0, totalSlides - visibleSlides); // Ensure non-negative
             if (prevSlideIndex < 0) {
                  prevSlideIndex = maxSlideIndex;
             }
            moveToSlide(prevSlideIndex);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // When resizing, we need to recalculate visible slides, slide width,
            // potentially regenerate dots, and reposition the carousel.
            updateVisibleSlides();
            generateDots(); // Regenerate dots based on new visibleSlides count
        });

        // Initial setup: Calculate dimensions and position correctly on load
        updateVisibleSlides(); // This calculates visibleSlides, slideWidth, adjusts currentSlide, calls updateDots and moveToSlide
        generateDots(); // Generate dots based on the initial visibleSlides
    }

    // --- Contact Form (basic, no actual submission) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission
            // In a real scenario, you would send this data via AJAX or
            // allow the form to submit to a server-side script.

            // Basic validation check (though 'required' attribute handles this mostly)
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
			
			const formData = new FormData(contactForm);
			const object = Object.fromEntries(formData);
			const json = JSON.stringify(object);

            if (!name || !email || !message) {
                // 'required' attribute should prevent this, but good as a fallback
                alert('Please fill in all fields.');
                return;
            }

			fetch('https://api.web3forms.com/submit', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Accept': 'application/json'
						},
						body: json
					})
					.then(async (response) => {
						let json = await response.json();
						if (response.status == 200) {
							//result.innerHTML = json.message;
							console.log('Form submitted (demo):', { name, email, message });
							// Simulate submission success
							alert('Thank you for your message! We will get back to you shortly.');
							contactForm.reset(); // Clear the form
						} else {
							console.log(response);
							//result.innerHTML = json.message;
						}
					})
					.catch(error => {
						console.log(error);
						alert('Something went wrong! Please try again.');
						//result.innerHTML = "Something went wrong!";
					})
            
        });
    }
});