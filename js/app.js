// app.js - Friendly & Sales-Oriented Redesign

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Splash Screen Animation
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');
    
    // Prevent scrolling during splash
    document.body.style.overflow = 'hidden';
    
    // Simulate a brief loading time for the splash screen
    setTimeout(() => {
        const tlSplash = gsap.timeline({
            onComplete: () => {
                splashScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                document.body.style.overflow = '';
                initAppAnimations();
            }
        });
        
        tlSplash.to('.splash-loader', { opacity: 0, duration: 0.3 })
                .to(splashScreen, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
                
    }, 1200); // 1.2 seconds friendly delay

    // 2. Main App Logic
    function initAppAnimations() {
        
        // --- Smooth Scrolling (Lenis) ---
        const lenis = new Lenis({
            lerp: 0.1,
            wheelMultiplier: 1.2,
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // --- GSAP ScrollTrigger ---
        gsap.registerPlugin(ScrollTrigger);
        
        // Sync Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        ScrollTrigger.addEventListener('refresh', () => lenis.update());

        // Nav hide on scroll
        const nav = document.querySelector('.main-nav');
        let lastScroll = 0;
        lenis.on('scroll', (e) => {
            const current = e.animatedScroll;
            if (current > lastScroll && current > 100) {
                nav.classList.add('nav-hidden');
            } else {
                nav.classList.remove('nav-hidden');
            }
            lastScroll = current;
        });

        // Hero Animations
        const tlHero = gsap.timeline();
        tlHero.fromTo('.app-container', { opacity: 0 }, { opacity: 1, duration: 0.4 })
              .from('.badge-friendly', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' })
              .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, "-=0.4")
              .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, "-=0.6")
              .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
              .from('.trust-indicators', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
              .from('.image-showcase', { opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out' }, "-=1")
              .from('.floating-card', { opacity: 0, x: -30, duration: 0.8, ease: 'back.out(1.7)' }, "-=0.5");

        // Scroll Reveals for sections
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // --- Copy to Clipboard ---
        const copyBtn = document.getElementById('copy-btn');
        const aliasText = document.getElementById('alias-text');
        const toast = document.getElementById('toast');

        if (copyBtn && aliasText) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(aliasText.textContent);
                    toast.classList.add('show');
                    
                    const icon = copyBtn.querySelector('i');
                    const oldIcon = icon.getAttribute('data-lucide');
                    icon.setAttribute('data-lucide', 'check');
                    lucide.createIcons();
                    
                    setTimeout(() => {
                        toast.classList.remove('show');
                        icon.setAttribute('data-lucide', oldIcon);
                        lucide.createIcons();
                    }, 3000);
                } catch (err) {
                    console.error('Failed to copy', err);
                }
            });
        }
        
        // --- FAQ Accordion ---
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current
                item.classList.toggle('active');
                
                // Update ScrollTrigger after a short delay since height changed
                setTimeout(() => ScrollTrigger.refresh(), 350);
            });
        });

        ScrollTrigger.refresh();
    }
});
