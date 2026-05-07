document.addEventListener('DOMContentLoaded', () => {
    /* ===== NAVBAR SCROLL ===== */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ===== MOBILE MENU ===== */
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        mobileNav.classList.toggle('open');
        burger.classList.toggle('open');
    };

    burger.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            burger.classList.remove('open');
        });
    });

    /* ===== HERO SLIDER ===== */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    };

    const startSlider = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlider();
        });
    });

    startSlider();

    /* ===== FAQ ACCORDION ===== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-q');
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(i => i.classList.remove('open'));
            // Open clicked if it wasn't open
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    /* ===== GALLERY LIGHTBOX ===== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lb-close');
    const lbPrev = lightbox.querySelector('.lb-prev');
    const lbNext = lightbox.querySelector('.lb-next');
    
    let currentLightboxIndex = 0;
    const galleryImages = Array.from(galleryItems).map(item => item.getAttribute('data-img'));

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentLightboxIndex = index;
            lbImg.src = galleryImages[currentLightboxIndex];
            lightbox.classList.add('open');
        });
    });

    lbClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
        }
    });

    lbPrev.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lbImg.src = galleryImages[currentLightboxIndex];
    });

    lbNext.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lbImg.src = galleryImages[currentLightboxIndex];
    });

    /* ===== ANIMATION ON SCROLL (AOS) ===== */
    const aosElements = document.querySelectorAll('.aos');
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(el => aosObserver.observe(el));

    // Fallback: reveal all .aos elements if observer never fires (e.g. hidden tab, bot)
    setTimeout(() => {
        document.querySelectorAll('.aos:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 3000);

    /* ===== AUTOMATIC YEAR ===== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ===== VIDEO MODAL ===== */
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        const vmIframe = document.getElementById('vm-iframe');
        const vmClose = document.querySelector('.vm-close');
        const videoThumbs = document.querySelectorAll('.video-thumb');

        videoThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const ytId = thumb.getAttribute('data-yt');
                // Added rel=0, enablejsapi=1, and a valid origin fallback to prevent Error 153
                const originStr = (window.location.origin && window.location.origin !== 'null' && window.location.origin !== 'file://') ? window.location.origin : 'https://www.youtube.com';
                vmIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(originStr)}`;
                videoModal.classList.add('open');
            });
        });

        const closeVideo = () => {
            videoModal.classList.remove('open');
            vmIframe.src = '';
        };

        vmClose.addEventListener('click', closeVideo);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideo();
        });
    }

    /* ===== PWA SERVICE WORKER ===== */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('SW registered');
        }).catch(err => {
            console.log('SW registration failed: ', err);
        });
    }

    /* ===== INTERIOR SLIDESHOW ===== */
    const interiorSlideshow = document.getElementById('interiorSlideshow');
    if (interiorSlideshow) {
        const intSlides = interiorSlideshow.querySelectorAll('.interior-slide');
        const intDots = interiorSlideshow.querySelectorAll('.interior-dot');
        const intPrev = document.getElementById('interiorPrev');
        const intNext = document.getElementById('interiorNext');
        let intCurrent = 0;
        let intTimer;

        const showInteriorSlide = (index) => {
            intSlides.forEach(s => s.classList.remove('active'));
            intDots.forEach(d => d.classList.remove('active'));
            intCurrent = (index + intSlides.length) % intSlides.length;
            intSlides[intCurrent].classList.add('active');
            intDots[intCurrent].classList.add('active');
        };

        const startInteriorAuto = () => {
            clearInterval(intTimer);
            intTimer = setInterval(() => showInteriorSlide(intCurrent + 1), 2000);
        };

        intPrev.addEventListener('click', () => { showInteriorSlide(intCurrent - 1); startInteriorAuto(); });
        intNext.addEventListener('click', () => { showInteriorSlide(intCurrent + 1); startInteriorAuto(); });
        intDots.forEach((dot, i) => dot.addEventListener('click', () => { showInteriorSlide(i); startInteriorAuto(); }));

        startInteriorAuto();
    }
});
