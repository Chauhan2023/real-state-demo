// --- 1. LENIS SMOOTH SCROLL INIT ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Synchronize GSAP ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// --- 2. PAGE PRELOADER & HERO ENTRANCE ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('loader-fill');
    const counter = document.getElementById('loader-counter');

    let progress = { val: 0 };
    gsap.timeline()
        .to('.loader-logo', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .to(progress, {
            val: 100,
            duration: 1.2,
            ease: 'power1.inOut',
            onUpdate: () => {
                fill.style.width = progress.val + '%';
                counter.textContent = Math.round(progress.val) + '%';
            }
        })
        .to(preloader, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut'
        })
        .from('#hero-bg', {
            scale: 1.25,
            duration: 1.8,
            ease: 'power2.out'
        }, "-=0.4")
        .from('.hero-badge', {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, "-=1.2")
        .from('#hero-title', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, "-=0.9")
        .from('#hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: 'power2.out'
        }, "-=0.6")
        .from('#hero-booking-bar', {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power3.out'
        }, "-=0.5");
});


// --- 3. SCROLL PROGRESS BAR & NAV BAR ANIMATIONS ---
const progressBar = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
const backToTopBtn = document.getElementById('back-to-top');

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    // Scroll Progress
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';

    // Navbar hide on scroll down, show on scroll up
    const currentScrollY = window.scrollY;
    if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
    } else {
        navbar.classList.remove('nav-hidden');
    }
    lastScrollY = currentScrollY;

    // Back to top button
    if (currentScrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

function scrollToTop() {
    lenis.scrollTo(0);
}


// --- 4. HERO PARALLAX ---
gsap.to('#hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 120,
    scale: 1.05
});


// --- 5. PINNED HORIZONTAL SCROLL SHOWCASE (GSAP + LENIS) ---
const track = document.querySelector('.horizontal-track');
if (track) {
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.15);

    gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
            trigger: '.horizontal-section-wrapper',
            pin: true,
            scrub: 1.2,
            end: () => '+=' + (track.scrollWidth - window.innerWidth + 400),
            invalidateOnRefresh: true
        }
    });

    // Inner image zoom/parallax as user scrolls through horizontal track
    gsap.utils.toArray('.showcase-card img').forEach(img => {
        gsap.to(img, {
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
                trigger: img.closest('.showcase-card'),
                start: 'left right',
                end: 'right left',
                scrub: true
            }
        });
    });
}


// --- 6. SECTION ANIMATIONS WITH GSAP SCROLLTRIGGER ---

// Trust Badges Staggered Entrance
gsap.from('.trust-card', {
    scrollTrigger: {
        trigger: '.trust-grid',
        start: 'top 85%'
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power3.out'
});

// Overview Section Reveal
gsap.from('.overview-text', {
    scrollTrigger: {
        trigger: '#overview',
        start: 'top 80%'
    },
    opacity: 0,
    x: -40,
    duration: 0.9,
    ease: 'power3.out'
});

gsap.from('.overview-img-box', {
    scrollTrigger: {
        trigger: '#overview',
        start: 'top 80%'
    },
    opacity: 0,
    x: 40,
    scale: 0.95,
    duration: 0.9,
    ease: 'power3.out'
});

// 3D Gallery Grid Staggered Reveal
gsap.from('.gallery-card', {
    scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 85%'
    },
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
});

// Amenities Cards Flip Reveal
gsap.from('.amenity-card', {
    scrollTrigger: {
        trigger: '.amenities-wrapper',
        start: 'top 85%'
    },
    opacity: 0,
    y: 40,
    rotateX: 10,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Calendar Days Cascade
gsap.from('.cal-day', {
    scrollTrigger: {
        trigger: '.calendar-box',
        start: 'top 80%'
    },
    opacity: 0,
    scale: 0.7,
    duration: 0.4,
    stagger: 0.02,
    ease: 'back.out(1.5)'
});


// --- 7. 3D TILT EFFECT ON CARDS ---
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});


// --- 8. FAQ ACCORDION ANIMATION ---
function toggleFaq(el) {
    const isActive = el.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        el.classList.add('active');
    }
}


// --- 9. LIGHTBOX FUNCTIONALITY ---
const lightbox = document.getElementById('lightbox');
const lightboxTarget = document.getElementById('lightbox-target');
const lightboxText = document.getElementById('lightbox-text');

function openLightbox(src, caption) {
    lightboxTarget.src = src;
    lightboxText.textContent = caption;
    lightbox.classList.add('active');
    lenis.stop(); // Pause scrolling while lightbox is open
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lenis.start(); // Resume scrolling
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});


// --- 10. MAGNETIC BUTTON HOVER EFFECT ---
const magneticBtns = document.querySelectorAll('.btn-gold');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.25,
            y: y * 0.25,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)'
        });
    });
});