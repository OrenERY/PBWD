document.addEventListener("DOMContentLoaded", function() {

    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.getElementById("navLinks");

    menuIcon.addEventListener("click", function() {
        navLinks.classList.toggle("active");
    });
    
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        formMessage.textContent = "";
        formMessage.className = "form-message";
        if (name.trim() === "" || email.trim() === "") {
            formMessage.textContent = "Nama dan Email wajib diisi!";
            formMessage.classList.add("error");
        } else {
            formMessage.textContent = "Terima kasih! Pesan Anda telah terkirim.";
            formMessage.classList.add("success");
            contactForm.reset();
        }
    });

    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselTrack && slides.length){
        let current = 0;
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const btn = document.createElement('button');
                btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) btn.classList.add('active');
                btn.addEventListener('click', () => { goToSlide(i); resetTimer(); });
                dotsContainer.appendChild(btn);
            });
        }

        function updateDots(){
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((d,i) => d.classList.toggle('active', i === current));
        }

        function goToSlide(idx){
            current = (idx + slides.length) % slides.length;
            let slideWidth = null;
            if (carouselContainer) slideWidth = carouselContainer.clientWidth;
            if (!slideWidth) slideWidth = Math.round(carouselTrack.clientWidth / slides.length) || 0;
            const offsetPx = -current * slideWidth;
            carouselTrack.style.transform = `translateX(${offsetPx}px)`;
            updateDots();
            fitCarouselHeight();
        }

        function move(n){ goToSlide(current + n); }

        window.moveSlide = function(n){ move(n); resetTimer(); };

        if (prevBtn) prevBtn.addEventListener('click', () => { move(-1); resetTimer(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { move(1); resetTimer(); });

        let timer = setInterval(() => { move(1); }, 4000);
        function resetTimer(){ clearInterval(timer); timer = setInterval(() => move(1), 4000); }

        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(timer));
            carouselContainer.addEventListener('mouseleave', () => { resetTimer(); });
            carouselContainer.style.transition = carouselContainer.style.transition || 'height 300ms ease';
        }

        function fitCarouselHeight(){
            if (!carouselContainer) return;
            const slide = slides[current];
            if (!slide) return;
            const img = slide.querySelector('img');
            if (img && img.naturalWidth && img.naturalHeight) {
                const containerWidth = carouselContainer.clientWidth;
                const calculatedHeight = Math.round(containerWidth * (img.naturalHeight / img.naturalWidth));
                carouselContainer.style.height = calculatedHeight + 'px';
            } else if (img) {
                img.addEventListener('load', function onLoad(){
                    img.removeEventListener('load', onLoad);
                    fitCarouselHeight();
                });
            } else {
                carouselContainer.style.height = 'auto';
            }
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => fitCarouselHeight(), 120);
        });

        if (window.ResizeObserver && carouselContainer) {
            const ro = new ResizeObserver(() => fitCarouselHeight());
            ro.observe(carouselContainer);
        }

        (function addTouchSupport(){
            if (!carouselContainer) return;
            let startX = 0;
            let dist = 0;
            const threshold = 40;
            carouselContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dist = 0; clearInterval(timer); });
            carouselContainer.addEventListener('touchmove', (e) => { dist = e.touches[0].clientX - startX; });
            carouselContainer.addEventListener('touchend', () => {
                if (Math.abs(dist) > threshold) {
                    if (dist < 0) move(1); else move(-1);
                    resetTimer();
                } else {
                    resetTimer();
                }
            });
        })();

        slides.forEach(s => {
            const img = s.querySelector('img');
            if (img) {
                if (img.complete) {
                } else {
                    img.addEventListener('load', () => {
                        if ([...slides].indexOf(s) === current) fitCarouselHeight();
                    });
                }
            }
        });

        goToSlide(0);
        setTimeout(fitCarouselHeight, 50);
    }

    (function initSOTD(){
        const songs = [
            {
                title: 'Lounge People',
                artist: '',
                src: 'lagu/Lounge%20People.m4a',
                link: 'lagu/Lounge%20People.m4a'
            },
            {
                title: 'Dracula (Tame Impala)',
                artist: 'Tame Impala',
                src: 'lagu/Tame%20Impala%20-%20Dracula%20(Official%20Video).m4a',
                link: 'lagu/Tame%20Impala%20-%20Dracula%20(Official%20Video).m4a'
            },
            {
                title: 'You Are My Music',
                artist: '',
                src: 'lagu/You%20Are%20My%20Music.m4a',
                link: 'lagu/You%20Are%20My%20Music.m4a'
            }
        ];

        const titleEl = document.getElementById('sotd-title');
        const artistEl = document.getElementById('sotd-artist');
        const audioEl = document.getElementById('sotd-audio');
        const prevBtn = document.getElementById('sotd-prev');
        const nextBtn = document.getElementById('sotd-next');
        const linkEl = document.getElementById('sotd-link');

        if (!audioEl || !titleEl || !artistEl || !prevBtn || !nextBtn || !linkEl) return;

        const days = Math.floor(Date.now() / 86400000);
        let index = songs.length ? days % songs.length : 0;

        function loadIndex(i){
            index = (i + songs.length) % songs.length;
            const s = songs[index];
            titleEl.textContent = s.title;
            artistEl.textContent = s.artist;
            audioEl.src = s.src;
            linkEl.href = s.link;
        }

        prevBtn.addEventListener('click', () => { loadIndex(index - 1); audioEl.pause(); audioEl.currentTime = 0; });
        nextBtn.addEventListener('click', () => { loadIndex(index + 1); audioEl.pause(); audioEl.currentTime = 0; });

        if (songs.length) loadIndex(index);
    })();

    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const show = window.scrollY > 300;
                    backBtn.classList.toggle('visible', show);
                    ticking = false;
                });
                ticking = true;
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            backBtn.blur();
        });
    }
});