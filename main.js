document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close when clicking nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
    }

    // 2. Navbar background transition on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. GSAP ScrollTrigger Configuration
    gsap.registerPlugin(ScrollTrigger);

    // Prevent mobile URL bar jump from breaking GSAP pin
    ScrollTrigger.config({ ignoreMobileResize: true });

    const video = document.getElementById("hero-video");
    const heroContainer = document.querySelector(".hero-container");

    let isInitialized = false;

    function onVideoReady() {
        if (isInitialized) return;
        isInitialized = true;
        const duration = video.duration && !isNaN(video.duration) ? video.duration : 10;
        initScrollScrub(duration);
    }

    if (video.readyState >= 1) {
        onVideoReady();
    } else {
        video.addEventListener("loadedmetadata", onVideoReady, { once: true });
        video.addEventListener("canplay", onVideoReady, { once: true });
        setTimeout(onVideoReady, 1000);
    }

    function initScrollScrub(validDuration) {
        // Prime the video decoder for seeking
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                video.pause();
                video.currentTime = 0;
            }).catch(() => {
                video.pause();
            });
        } else {
            video.pause();
        }

        // Responsive scroll distance: punchy on mobile, cinematic on desktop
        const isMobile = window.innerWidth <= 768;
        const scrollDistance = isMobile ? "+=220%" : "+=400%";

        // Smooth video seek controller
        let targetTime = 0;

        function applySeek() {
            if (!video || video.readyState < 2) return;
            if (video.seeking) return; // Prevent seek queuing jank
            if (Math.abs(video.currentTime - targetTime) > 0.03) {
                try {
                    if ('fastSeek' in video) {
                        video.fastSeek(targetTime);
                    } else {
                        video.currentTime = targetTime;
                    }
                } catch (e) {
                    video.currentTime = targetTime;
                }
            }
        }

        video.addEventListener("seeked", applySeek);
        gsap.ticker.add(applySeek);

        // GSAP Timeline tied to ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroContainer,
                start: "top top",
                end: scrollDistance,
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    targetTime = Math.min(validDuration - 0.04, Math.max(0, self.progress * validDuration));
                }
            }
        });

        // Hide scroll indicator immediately on scroll
        tl.to(".scroll-indicator", { 
            opacity: 0, 
            autoAlpha: 0, 
            duration: 0.03, 
            ease: "power1.out" 
        }, 0);

        // Synchronized Text Checkpoints corresponding to burger layers
        // Step 1: Fresh Buns (2% - 15%)
        tl.fromTo(".step-1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.02);
        tl.to(".step-1", { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.15);

        // Step 2: 100% Wagyu Beef (20% - 35%)
        tl.fromTo(".step-2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.20);
        tl.to(".step-2", { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.35);

        // Step 3: Aged Cheddar (40% - 55%)
        tl.fromTo(".step-3", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.40);
        tl.to(".step-3", { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.55);

        // Step 4: Crisp Veggies (60% - 75%)
        tl.fromTo(".step-4", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.60);
        tl.to(".step-4", { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.75);

        // Step 5: Signature Sauce (80% - 92%)
        tl.fromTo(".step-5", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.80);
        tl.to(".step-5", { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.92);

        // Step 6: Final Title & Complete Burger (94% - 100%)
        tl.fromTo(".step-6", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.06, ease: "back.out(1.2)" }, 0.94);
    }

    // Touch unlock for mobile browsers on first interaction
    const unlockVideo = () => {
        if (video.paused && video.currentTime === 0) {
            video.play().then(() => video.pause()).catch(() => {});
        }
    };
    window.addEventListener('touchstart', unlockVideo, { once: true, passive: true });
    window.addEventListener('scroll', unlockVideo, { once: true, passive: true });
});
