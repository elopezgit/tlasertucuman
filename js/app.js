// app.js

document.addEventListener('DOMContentLoaded', () => {
    // 0. Loader Animation
    const loader = document.getElementById('loader');
    if (loader) {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        const tlLoader = gsap.timeline({
            onComplete: () => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
                // Trigger hero animations after loader
                ScrollTrigger.refresh();
                playHeroAnimations();
            }
        });

        tlLoader.to('.laser-beam', { width: '100%', duration: 1.5, ease: 'power2.inOut', delay: 0.2 })
                .to('.laser-beam-container', { opacity: 0, duration: 0.3 })
                .fromTo('.loader-text .text-line', 
                    { opacity: 0, y: 15 }, 
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.4, ease: 'power2.out' }, 
                    "-=0.1"
                )
                .to('.loader-text .text-line', { opacity: 0, duration: 0.5, delay: 1.2 })
                .to(loader, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
    } else {
        playHeroAnimations();
    }

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        lerp: 0.18,
        wheelMultiplier: 1.4,
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger on lenis scroll and refresh
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', () => lenis.update());

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    
    // Only activate custom cursor on desktop
    if (window.matchMedia("(min-width: 1024px)").matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: "power2.out" });
            gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
        });

        // Add hover effect to links and buttons
        const interactables = document.querySelectorAll('a, button, .bento-item, .product-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }

    // 3. Navigation Scroll Effect
    const nav = document.querySelector('.nav-glass');
    let lastScrollY = window.scrollY;

    lenis.on('scroll', (e) => {
        const currentScrollY = e.animatedScroll;
        
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // 4. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Text Animation
    function playHeroAnimations() {
        const heroTitleLines = document.querySelectorAll('.hero-title span');
        
        gsap.from(heroTitleLines, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.2
        });

        gsap.from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.8
        });

        gsap.from('.hero-cta-group', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1
        });

        gsap.from('.badge-premium', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        });

        gsap.to('.hero-badge', {
            y: -10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            duration: 4,
            stagger: 0.18
        });
    }

    gsap.fromTo('.hero-display-card',
        { y: 30, opacity: 0.75 },
        {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        }
    );

    // Bento Grid Stagger Animation
    gsap.fromTo('.bento-item', 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.services',
                start: "top 85%",
                once: true
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        }
    );

    gsap.fromTo('.product-card',
        { y: 40, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.products-section',
                start: "top 90%",
                once: true
            },
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out"
        }
    );

    // Payment Section Animation
    gsap.fromTo('.payment-left > *', 
        { x: -50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.payment-section',
                start: "top 85%",
                once: true
            },
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        }
    );

    gsap.fromTo('.terminal-card', 
        { x: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.payment-section',
                start: "top 85%",
                once: true
            },
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out"
        }
    );

    // 5. Copy to Clipboard Functionality
    const copyBtn = document.getElementById('copy-alias');
    const aliasText = document.getElementById('alias-text');
    const toast = document.getElementById('toast');

    if (copyBtn && aliasText) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(aliasText.textContent);
                
                // Show Toast
                toast.classList.add('show');
                
                // Change Button Text Temporarily
                const originalContent = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i data-lucide="check"></i> Copiado';
                lucide.createIcons();
                
                setTimeout(() => {
                    toast.classList.remove('show');
                    copyBtn.innerHTML = originalContent;
                    lucide.createIcons();
                }, 3000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }

    // Refresh ScrollTrigger after images load to fix positioning
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
