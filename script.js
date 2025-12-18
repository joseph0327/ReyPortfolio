// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all cards and timeline items
document.querySelectorAll('.skill-card, .stat-card, .achievement-card, .timeline-item, .background-card-modern, .background-summary').forEach(el => {
    observer.observe(el);
});

// Staggered animation for About Me section
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate about text
            const aboutText = entry.target.querySelector('.about-text');
            if (aboutText) {
                setTimeout(() => {
                    aboutText.classList.add('animate-in');
                }, 100);
            }
            
            // Animate stat cards with stagger
            const statCards = entry.target.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 200 + (index * 150));
            });
            
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

// Observe About section
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// Staggered animation for Professional Background section
const backgroundObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate background cards in the row with stagger
            const backgroundCards = entry.target.querySelectorAll('.background-card-modern');
            backgroundCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 100 + (index * 200));
            });
            
            // Animate background summary after cards
            const backgroundSummary = entry.target.querySelector('.background-summary');
            if (backgroundSummary) {
                setTimeout(() => {
                    backgroundSummary.classList.add('animate-in');
                }, 100 + (backgroundCards.length * 200) + 150);
            }
            
            backgroundObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

// Observe Professional Background section
const backgroundSection = document.querySelector('.background');
if (backgroundSection) {
    backgroundObserver.observe(backgroundSection);
}

// Staggered animation for Contact section (Let's Connect)
const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate contact subtitle
            const contactSubtitle = entry.target.querySelector('.contact-subtitle');
            if (contactSubtitle) {
                setTimeout(() => {
                    contactSubtitle.classList.add('animate-in');
                }, 100);
            }
            
            // Animate contact items with stagger
            const contactItems = entry.target.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, 200 + (index * 100));
            });
            
            contactObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

// Observe Contact section
const contactSection = document.querySelector('.contact');
if (contactSection) {
    contactObserver.observe(contactSection);
}

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(this);
    
    // Show success message (you can customize this)
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    this.reset();
    
    // In a real application, you would send this data to a server
    // Example: fetch('/api/contact', { method: 'POST', body: formData })
});

// Add navbar background and effects on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Parallax effect for sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSections = document.querySelectorAll('[data-parallax]');
    
    parallaxSections.forEach(section => {
        const offset = section.offsetTop;
        const speed = 0.5;
        
        if (scrolled > offset - window.innerHeight && scrolled < offset + section.offsetHeight) {
            const yPos = -(scrolled - offset) * speed;
            section.style.backgroundPositionY = `${yPos}px`;
        }
    });
});

// Counter animation for stats with easing
const animateCounter = (element, target) => {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (target - start) * easedProgress);

        element.textContent = current + (element.dataset.suffix || '');

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    };

    requestAnimationFrame(animate);
};

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const h3 = entry.target.querySelector('h3');
            const text = h3.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (!isNaN(number)) {
                // Store suffix (like +)
                const suffix = text.replace(/[0-9]/g, '');
                h3.dataset.suffix = suffix;
                h3.textContent = '0' + suffix;
                
                // Delay counter to sync with card animation
                setTimeout(() => {
                    animateCounter(h3, number);
                }, 300);
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});
