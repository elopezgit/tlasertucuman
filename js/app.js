// app.js - Refactored for Radical Premium Redesign

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Boot Sequence Animation (Login / Welcome)
    const bootSequence = document.getElementById('boot-sequence');
    const mainApp = document.getElementById('main-app');
    const enterBtn = document.getElementById('enter-btn');
    
    // Prevent scrolling during boot
    document.body.style.overflow = 'hidden';
    
    // GSAP Timeline for Boot
    const tlBoot = gsap.timeline();
    
    tlBoot.to('.boot-progress-bar', { width: '100%', duration: 2, ease: 'power2.inOut' })
          .to('.boot-log span', { 
              opacity: 1, y: 0, 
              duration: 0.3, 
              stagger: 0.4, 
              ease: 'power2.out' 
          }, "-=1.5")
          .call(() => {
              enterBtn.classList.add('visible');
          });

    // Enter Button Click Event
    enterBtn.addEventListener('click', () => {
        const tlEnter = gsap.timeline({
            onComplete: () => {
                bootSequence.style.display = 'none';
                mainApp.classList.remove('hidden');
                document.body.style.overflow = '';
                initAppAnimations();
            }
        });
        
        tlEnter.to(bootSequence, {
            opacity: 0,
            scale: 1.1,
            duration: 0.8,
            ease: 'power3.inOut'
        });
    });

    // 2. Main App Logic (Initializes after Boot)
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

        // --- Custom Cursor ---
        const cursor = document.getElementById('cursor');
        const follower = document.getElementById('cursor-follower');
        
        if (window.matchMedia("(min-width: 1024px)").matches) {
            document.addEventListener('mousemove', (e) => {
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
                gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
            });

            const hoverTargets = document.querySelectorAll('a, button, .bento-item, .tech-card, .btn-magnetic');
            hoverTargets.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        } else {
            cursor.style.display = 'none';
            follower.style.display = 'none';
        }

        // --- Magnetic Buttons ---
        const magneticElements = document.querySelectorAll('.btn-magnetic');
        magneticElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(elem, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            elem.addEventListener('mouseleave', () => {
                gsap.to(elem, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });

        // --- GSAP ScrollTrigger ---
        gsap.registerPlugin(ScrollTrigger);
        
        // Sync Lenis with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        ScrollTrigger.addEventListener('refresh', () => lenis.update());

        // Nav hide on scroll
        const nav = document.querySelector('.glass-nav');
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
        tlHero.fromTo('.app-container', { opacity: 0 }, { opacity: 1, duration: 0.5 })
              .from('.hero-title .word', { 
                  y: '100%', opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' 
              })
              .from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, "-=0.6")
              .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
              .from('.tech-card', { opacity: 0, scale: 0.8, rotationY: -15, duration: 1.5, ease: 'power3.out' }, "-=1");

        // 3D Tilt effect on Tech Card
        const techCard = document.querySelector('.tech-card-inner');
        if (techCard && window.matchMedia("(min-width: 1024px)").matches) {
            document.querySelector('.tech-card').addEventListener('mousemove', (e) => {
                const rect = techCard.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(techCard, {
                    rotationY: x * 0.05,
                    rotationX: -y * 0.05,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            document.querySelector('.tech-card').addEventListener('mouseleave', () => {
                gsap.to(techCard, { rotationY: 0, rotationX: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
            });
        }

        // Scroll Reveals for sections
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
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
        
        ScrollTrigger.refresh();
    }
});
