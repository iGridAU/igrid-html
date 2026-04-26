document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const internalLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    // --- Header Scroll Effect ---
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // --- Hero Text Rotation ---
    const rotatingTextElement = document.getElementById('rotating-text');
    if (rotatingTextElement) {
        const rotatingTexts = [
            "Energy Storage Experts.",
            "24/7 Support Team.",
            "Sustainability Consultants.",
            "IoT Provider.",
            "Asset Management Team."
        ];
        let currentIndex = 0;
        setInterval(() => {
            rotatingTextElement.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % rotatingTexts.length;
                rotatingTextElement.textContent = rotatingTexts[currentIndex];
                rotatingTextElement.style.opacity = 1;
            }, 400);
        }, 4000);
    }

    // --- Mobile Menu Toggle ---
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }

    // --- Smooth Scroll + Mobile Menu Close ---
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = target <= 5 ? 800 : 2000;
                const start = performance.now();
                
                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(ease * target);
                    el.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target + suffix;
                    }
                }
                
                requestAnimationFrame(update);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => countObserver.observe(el));

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPos >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            if (!name || !email || !message) {
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
                    alert('Thank you for your message! We will get back to you shortly.');
                    contactForm.reset();
                } else {
                    console.log(response);
                    alert('Something went wrong! Please try again.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Something went wrong! Please try again.');
            });
        });
    }

    // --- Dynamic Copyright Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
