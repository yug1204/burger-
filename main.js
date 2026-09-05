document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar background transition on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. GSAP ScrollTrigger Registration
    gsap.registerPlugin(ScrollTrigger);

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
        // Fallback in case browser delays media event
        setTimeout(onVideoReady, 1200);
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
                end: "+=400%", // 400vh scroll scrub
                scrub: 0.6,    // Smooth scrub interpolation
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    targetTime = Math.min(validDuration - 0.05, Math.max(0, self.progress * validDuration));
                }
            }
        });

        // Hide scroll indicator as soon as user starts scrolling
        tl.to(".scroll-indicator", { opacity: 0, duration: 0.04, ease: "power1.out" }, 0);

        // Synchronized Text Checkpoints corresponding to burger layers
        // Step 1: Fresh Buns (2% - 15%)
        tl.fromTo(".step-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.02);
        tl.to(".step-1", { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.15);

        // Step 2: 100% Wagyu Beef (20% - 35%)
        tl.fromTo(".step-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.20);
        tl.to(".step-2", { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.35);

        // Step 3: Aged Cheddar (40% - 55%)
        tl.fromTo(".step-3", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.40);
        tl.to(".step-3", { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.55);

        // Step 4: Crisp Veggies (60% - 75%)
        tl.fromTo(".step-4", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.60);
        tl.to(".step-4", { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.75);

        // Step 5: Signature Sauce (80% - 92%)
        tl.fromTo(".step-5", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" }, 0.80);
        tl.to(".step-5", { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.92);

        // Step 6: Final Title & Complete Burger (94% - 100%)
        tl.fromTo(".step-6", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.06, ease: "back.out(1.2)" }, 0.94);
    }

    // Touch unlock for mobile browsers
    window.addEventListener('touchstart', function() {
        if (video.paused && video.currentTime === 0) {
            video.play().then(() => video.pause()).catch(() => {});
        }
    }, { once: true, passive: true });
});
