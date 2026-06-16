document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Preloader Handler
       ========================================================================== */
    const preloader = document.getElementById('loader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Fallback: hide preloader after 3 seconds in case window load event doesn't fire
    setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 3000);

    /* ==========================================================================
       2. Scroll Progress & Sticky Navbar & Back to Top
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollBar = document.getElementById('scrollBar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Navbar styling
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar percentage
        if (docHeight > 0) {
            const scrollPercentage = (scrollY / docHeight) * 100;
            scrollBar.style.width = scrollPercentage + '%';
        }

        // Back to Top button visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Back to top scroll execution
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       3. Theme Toggle (Dark & Light Mode Support)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check saved theme or system preferences
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-theme');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('portfolio-theme', currentTheme);
        });
    }

    /* ==========================================================================
       4. Mobile Nav Menu Toggle & Dynamic Collapse
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navbarElement = document.getElementById('navbar');

    let minRequiredWidth = 1150; // Fallback maximum collapse threshold

    function calculateMinRequiredWidth() {
        if (!navLinksList) return 1150;
        
        // Temporarily force horizontal row rendering to measure natural widths
        const originalStyle = navLinksList.style.cssText;
        navLinksList.style.cssText = 'display: flex !important; flex-direction: row !important; position: absolute !important; visibility: hidden !important; width: auto !important;';

        const brand = document.querySelector('.nav-brand');
        const themeToggle = document.getElementById('theme-toggle');
        
        const brandWidth = brand ? brand.offsetWidth : 100;
        const actionsWidth = themeToggle ? themeToggle.offsetWidth : 40;
        
        let linksWidth = 0;
        const items = navLinksList.querySelectorAll('li');
        items.forEach(item => {
            linksWidth += item.getBoundingClientRect().width;
        });
        
        if (items.length > 0) {
            linksWidth += (items.length - 1) * 8; // 0.5rem gap = 8px
        }
        
        // Restore original style
        navLinksList.style.cssText = originalStyle;
        
        // Total required width = brand + links + actions + container padding (2rem on desktop = 64px) + safety buffer (40px)
        return brandWidth + linksWidth + actionsWidth + 64 + 40;
    }

    function checkNavbarCollapse() {
        if (!navbarElement) return;
        const currentWidth = window.innerWidth;
        const threshold = Math.min(1150, minRequiredWidth);
        
        if (currentWidth < threshold) {
            navbarElement.classList.add('navbar-collapsed');
        } else {
            navbarElement.classList.remove('navbar-collapsed');
            // Ensure mobile menu classes are cleared if expanding back to desktop
            if (menuToggle && navLinksList) {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        }
    }

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
            
            // Toggle accessibility attribute
            const expanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });

        // Close mobile menu when nav links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksList.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            });
        });

        // Set up dynamic collapse measurement and event listeners
        // Slight delay to ensure font/style metrics are fully computed by browser
        setTimeout(() => {
            minRequiredWidth = calculateMinRequiredWidth();
            checkNavbarCollapse();
        }, 150);

        window.addEventListener('resize', checkNavbarCollapse);
    }

    /* ==========================================================================
       5. Animated Typing Effect
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Aspiring Data Analyst",
        "Software Developer",
        "MERN Stack Developer",
        "Power BI Developer",
        "Machine Learning Enthusiast"
    ];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (typedTextSpan) {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }
    }

    function erase() {
        if (typedTextSpan) {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 500);
            }
        }
    }

    // Start typing cycle
    if (typedTextSpan && textArray.length > 0) {
        setTimeout(type, newTextDelay - 1000);
    }

    /* ==========================================================================
       6. Stats Numerical Counters
       ========================================================================== */
    const statCards = document.querySelectorAll('.stat-card');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000; // Animation duration in milliseconds
            const startTimestamp = performance.now();

            function step(now) {
                const elapsed = now - startTimestamp;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out quadratic calculation
                const easeValue = progress * (2 - progress);
                const currentValue = Math.floor(easeValue * target);

                if (target >= 100) {
                    counter.textContent = currentValue + "+";
                } else {
                    counter.textContent = currentValue;
                }

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    counter.textContent = target >= 100 ? target + "+" : target;
                }
            }

            window.requestAnimationFrame(step);
        });
    }

    /* ==========================================================================
       7. Scroll Reveal & Scroll Spy Active State
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Specifically trigger statistics animation when stat cards are revealed
                if (entry.target.classList.contains('stats-section') || entry.target.closest('#statistics')) {
                    startCounters();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    revealElements.forEach(element => {
        scrollRevealObserver.observe(element);
    });

    // Observe statistics section explicitly
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        scrollRevealObserver.observe(statsSection);
    }

    // Scroll Spy: Update navigation links according to current visible section
    const spyOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger activation before center of page
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    /* ==========================================================================
       8. Toast Notification System & Helpers
       ========================================================================== */
    function showToast(message, type = 'info') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-check-circle';
        if (type === 'error') iconClass = 'fa-exclamation-circle';
        
        toast.innerHTML = `
            <i class="fas ${iconClass} toast-icon"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger style reflow
        toast.offsetHeight;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }

    /* ==========================================================================
       9. Copy Email to Clipboard
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'tusharagrahari10@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                showToast('Email copied to clipboard.', 'success');
            }).catch(err => {
                showToast('Failed to copy email to clipboard.', 'error');
            });
        });
    }

    /* ==========================================================================
       10. Contact Form Integration with EmailJS
       ========================================================================== */
    // EmailJS keys from Tushar's dashboard
    const EMAILJS_PUBLIC_KEY = 'GZ7xaDR8uadCyQvNj';
    const EMAILJS_SERVICE_ID = 'service_tushar_portfolio';
    const EMAILJS_TEMPLATE_ID = 'template_grp8ba7';

    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form_name').value.trim();
            const email = document.getElementById('form_email').value.trim();
            const subject = document.getElementById('form_subject').value.trim();
            const message = document.getElementById('form_message').value.trim();
            
            if (!name || !email || !subject || !message) {
                showToast('Please fill out all fields before submitting.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Message';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }

            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    from_name: name,
                    reply_to: email,
                    subject: subject,
                    message: message,
                    to_email: 'tusharagrahari10@gmail.com'
                };

                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then(() => {
                        showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                        contactForm.reset();
                    })
                    .catch((err) => {
                        console.error('EmailJS Error:', err);
                        showToast('Failed to send message. Please try again later.', 'error');
                    })
                    .finally(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnHTML;
                        }
                    });
            } else {
                console.warn('EmailJS SDK not found. Running mock submission...');
                setTimeout(() => {
                    showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                    contactForm.reset();
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHTML;
                    }
                }, 1200);
            }
        });
    }
});
