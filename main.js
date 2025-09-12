
// Mobile Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animation on scroll
        const animateElements = document.querySelectorAll('.animate');

        const animateOnScroll = () => {
            animateElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementPosition < windowHeight - 100) {
                    element.style.animationPlayState = 'running';
                    element.style.opacity = 1;
                }
            });
        };

        // Initialize particles
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random size between 2px and 5px
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Random animation duration and delay
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.1;

            particlesContainer.appendChild(particle);
        }

        // Initialize animations on load
        window.addEventListener('load', () => {
            animateOnScroll();
        });

        // Animate on scroll
        window.addEventListener('scroll', animateOnScroll);

