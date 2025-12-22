// GSAP Core
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// EmailJS Configuration (ACTIVE WITH USER KEYS)
if (typeof emailjs !== 'undefined') {
    emailjs.init("Zo9pYt96J3B4lwEoD");
}

// Mobile Detection
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 1. Custom Magical Cursor with Leading Momentum
const cursor = document.getElementById('magic-cursor');
const follower = document.getElementById('cursor-follower');

if (isMobile) {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
} else {
    let mouse = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let ratio = 0.15;

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
        pos.x += (mouse.x - pos.x) * ratio;
        pos.y += (mouse.y - pos.y) * ratio;

        gsap.set(cursor, { x: mouse.x, y: mouse.y });
        gsap.set(follower, { x: pos.x, y: pos.y });
    });

    // Cursor Interactions
    document.querySelectorAll('a, button, .glass-card, select, input, .gallery-item, #gift-box').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 2,
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderColor: 'transparent',
                duration: 0.3
            });
            gsap.to(cursor, { scale: 0.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: 'var(--accent)',
                duration: 0.3
            });
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

// 2. High-End Text Animations using SplitType
const initAnimations = () => {
    // Reveal Text (H1, H2)
    document.querySelectorAll('.reveal-text').forEach(el => {
        const text = new SplitType(el, { types: 'words,chars' });
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.02,
            ease: 'expo.out'
        });
    });

    // Reveal Item (Sequential)
    document.querySelectorAll('.reveal-item').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%'
            },
            y: 50,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            delay: el.dataset.delay || 0
        });
    });

    // Glass Card Entrance
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%'
            },
            y: 100,
            opacity: 0,
            duration: 1.8,
            ease: 'expo.out'
        });
    });

    // Gallery Entrance
    gsap.from('.gallery-item', {
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%'
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out'
    });
};

// 3. Snowfall Engine (Cinematic Depth)
// 3. Snowfall Engine (Cinematic Depth & Physics)
const createSnow = () => {
    const container = document.getElementById('snow-container');
    if (!container) return;
    container.innerHTML = ''; // Clear existing
    // OPTIMIZATION: Reduced snow count to improve performance
    const snowCount = isMobile ? 25 : 70;
    const flakeChars = ['❄', '❅', '❆', '•']; // Added actual character variants

    for (let i = 0; i < snowCount; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';

        // Randomly decide if it's a detailed crystal or a soft bokeh dot
        const isCrystal = Math.random() > 0.4; // 60% chance of being a crystal

        // Physics properties: Depth 0 (far) to 1 (near)
        const depth = Math.random();

        let size;
        if (isCrystal) {
            snow.classList.add('crystal');
            snow.innerHTML = flakeChars[Math.floor(Math.random() * 3)];
            size = (Math.random() * 15 + 10) + (depth * 20); // 10px to 45px for crystals
            snow.style.fontSize = `${size}px`;
            snow.style.background = 'none'; // Ensure no background
        } else {
            size = (Math.random() * 3 + 2) + (depth * 5); // 2px to 7px for dots
            snow.style.width = `${size}px`;
            snow.style.height = `${size}px`;
            snow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 70%)';
            snow.style.borderRadius = '50%';
        }

        snow.style.position = 'absolute';

        // Depth effects
        snow.style.opacity = isCrystal ? 0.3 + (depth * 0.7) : 0.2 + (depth * 0.6);
        // OPTIMIZATION: Simplify filter to reduce composite layer cost
        // Only apply blur to very distant objects if absolutely necessary, or remove completely for performance
        if (!isMobile && depth < 0.3) {
            snow.style.filter = `blur(1px)`;
        }

        snow.style.zIndex = depth > 0.8 ? 100 : 50;

        container.appendChild(snow);
        animateSnow(snow, depth, isCrystal);
    }
};

const animateSnow = (el, depth, isCrystal) => {
    // Speed: Nearer objects appear to fall faster (Parallax)
    const duration = 10 + (1 - depth) * 15 + Math.random() * 5;

    // Wind influence
    const windForce = 150; // Pixels to drift right

    // 1. Fall Motion (Looping)
    gsap.fromTo(el, {
        y: -100
    }, {
        y: window.innerHeight + 100,
        duration: duration,
        ease: "none",
        repeat: -1,
        // Random negative delay to have them pre-scattered on screen
        delay: -Math.random() * duration
    });

    // 2. Lateral Drift (Wind)
    const startX = Math.random() * window.innerWidth;
    gsap.fromTo(el, {
        x: startX - 100
    }, {
        x: startX + windForce + (Math.random() * 50),
        duration: duration,
        ease: "none",
        repeat: -1,
        force3D: true, // Hardware acceleration
        delay: -Math.random() * duration
    });

    // Skip heavy animations on mobile
    if (isMobile) return;

    // 3. Natural Sway (Oscillation)
    gsap.to(el, {
        x: `+=${20 + Math.random() * 30}`,
        duration: 3 + Math.random() * 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // 4. Rotation for Crystals
    if (isCrystal) {
        gsap.to(el, {
            rotation: 360,
            duration: duration * (Math.random() * 0.5 + 0.5),
            repeat: -1,
            ease: "none"
        });
    }
};

// 4. Parallax Background
gsap.to('.hero-img-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 200,
    scale: 1.2
});

// 5. Countdown Logic
const initCountdown = () => {
    const targetDate = new Date('December 25, 2025 00:00:00').getTime();

    const update = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (document.getElementById('days')) document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        if (document.getElementById('hours')) document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        if (document.getElementById('minutes')) document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        if (document.getElementById('seconds')) document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    };

    setInterval(update, 1000);
    update();
};

// 6. Interactive Gift Box
const initGiftBox = () => {
    const box = document.getElementById('gift-box');
    const lid = box.querySelector('.gift-lid');
    const modal = document.getElementById('gift-modal');
    const closeBtn = document.querySelector('.close-gift');
    const actionBtn = document.querySelector('.close-gift-action');
    const giftTitle = document.getElementById('gift-title');
    const giftDesc = document.getElementById('gift-description');
    const giftImgContainer = document.getElementById('gift-image-container');

    // Gift Collection
    const gifts = [
        {
            title: "Tấm Vé Vàng",
            desc: "Ưu tiên đặt lịch gặp ông già Noel. Bạn hiện là người đầu tiên trong danh sách.",
            img: "assets/images/1a.png"
        },
        {
            title: "Chìa Khóa Thần Kỳ Của Santa",
            desc: "Chiếc chìa khóa huyền thoại mở cửa trái tim đón nhận tinh thần Giáng Sinh.",
            img: "assets/images/2a.png"
        },
        {
            title: "Quả Cầu Tuyết Bắc Cực",
            desc: "Một thế giới kỳ diệu thu nhỏ. Hãy lắc nhẹ để thấy tuyết rơi phép thuật.",
            img: "assets/images/3a.png"
        },
        {
            title: "Chiếc Chuông Của Niềm Tin",
            desc: "Nó chỉ ngân vang cho những ai thực sự tin tưởng. Bạn có nghe thấy không?",
            img: "assets/images/4a.png"
        },
        {
            title: "Cuộn Giấy Danh Sách Ngoan",
            desc: "Xác nhận chính thức từ chính Ông Già Noel. Bạn đã có tên trong danh sách!",
            img: "assets/images/5a.png"
        },
        {
            title: "Cacao Của Bà Claus",
            desc: "Một lọ hỗn hợp sô cô la hảo hạng, được sưởi ấm bằng tình yêu vô điều kiện.",
            img: "assets/images/6a.png"
        },
        {
            title: "Tàu Tốc Hành Lúc Nửa Đêm",
            desc: "Kỷ vật cổ điển nhắc nhở bạn rằng hành trình chính là đích đến.",
            img: "assets/images/7a.png"
        },
        {
            title: "Túi Nhung Đỏ",
            desc: "Được dệt bằng những giấc mơ và sẵn sàng để đong đầy niềm vui.",
            img: "assets/images/8a.png"
        },
        {
            title: "Búa Của Yêu Tinh",
            desc: "Công cụ sáng tạo từ xưởng chế tác đồ chơi bậc thầy.",
            img: "assets/images/9a.png"
        },
        {
            title: "Ngôi Sao Pha Lê",
            desc: "Ánh sáng dẫn đường đặt trên đỉnh cây thông, tỏa sáng niềm hy vọng.",
            img: "assets/images/10a.png"
        },
        {
            title: "Cà Rốt Thần Kỳ",
            desc: "Món ăn phép thuật tiếp thêm sức mạnh bay lượn cho những chú tuần lộc.",
            img: "assets/images/11a.png"
        }
    ];

    const openGift = () => {
        // Weighted random selection
        // Increase probability for 11a.png (index 10)
        let selectedGift;
        const rand = Math.random();

        if (rand < 0.5) {
            // 50% chance for Cà Rốt Thần Kỳ (11a.png)
            selectedGift = gifts[10];
        } else {
            // 50% chance for any other gift (including 11a.png again potentially)
            selectedGift = gifts[Math.floor(Math.random() * gifts.length)];
        }

        // Populate Modal
        giftTitle.innerText = selectedGift.title;
        giftDesc.innerText = selectedGift.desc;
        giftImgContainer.innerHTML = `<img src="${selectedGift.img}" alt="${selectedGift.title}">`;

        // Open Modal
        modal.classList.add('active');

        // Create burst effect inside modal too
        setTimeout(() => {
            createBurst(document.querySelector('.gift-reveal-card'));
        }, 500);
    };

    const closeGiftModal = () => {
        modal.classList.remove('active');
    };

    box.addEventListener('click', () => {
        // Animation for box opening
        gsap.to(box, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                createBurst(box);
                setTimeout(openGift, 500);
            }
        });
    });

    closeBtn.addEventListener('click', closeGiftModal);
    actionBtn.addEventListener('click', closeGiftModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGiftModal();
    });
};

const createBurst = (parent) => {
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '5px';
        p.style.height = '5px';
        p.style.backgroundColor = Math.random() > 0.5 ? 'var(--accent)' : 'white';
        p.style.borderRadius = '50%';
        p.style.pointerEvents = 'none';
        parent.appendChild(p);

        gsap.to(p, {
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400 - 100,
            opacity: 0,
            scale: 0,
            duration: 1 + Math.random(),
            ease: 'power2.out',
            onComplete: () => p.remove()
        });
    }
};

// 7. Music Toggle (Audio & Visual)
const initMusic = () => {
    const toggle = document.getElementById('music-toggle');
    // Using a reliable direct MP3 from Incompetech
    const bgm = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Jingle%20Bells.mp3');
    bgm.loop = true;
    bgm.volume = 0.5;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('playing');
        if (toggle.classList.contains('playing')) {
            console.log("Attempting to play music...");
            bgm.play().then(() => {
                console.log("Music playing successfully");
            }).catch(e => {
                console.error("Audio playback failed:", e);
                alert("Không thể phát nhạc. Vui lòng kiểm tra quyền trình duyệt của bạn.");
            });
            gsap.to(toggle, { color: 'var(--primary)', scale: 1.2, duration: 0.3 });
        } else {
            bgm.pause();
            gsap.to(toggle, { color: 'var(--accent)', scale: 1, duration: 0.3 });
        }
    });
};

// 8. Magic Cursor Trail
const initMagicCursor = () => {
    if (isMobile) return; // Completely disable on mobile for performance

    const cursor = document.getElementById('magic-cursor');
    const follower = document.getElementById('cursor-follower');

    // Create pool of particles
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'cursor-particle';
        document.body.appendChild(p);
        particles.push({
            el: p,
            x: 0,
            y: 0,
            active: false
        });
        gsap.set(p, { opacity: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;
    let currentParticle = 0;
    let lastSpawnTime = 0; // Throttling variable

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
        gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.5 });

        // OPTIMIZATION: Throttle particle spawning
        const now = Date.now();
        if (now - lastSpawnTime > 40) { // Limit to ~25fps spawn rate
            const p = particles[currentParticle];
            p.active = true;
            gsap.set(p.el, {
                x: mouseX,
                y: mouseY,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5
            });

            gsap.to(p.el, {
                y: mouseY + 50,
                x: mouseX + (Math.random() * 40 - 20),
                opacity: 0,
                scale: 0,
                duration: 1 + Math.random(),
                ease: "power2.out"
            });

            currentParticle = (currentParticle + 1) % particleCount;
            lastSpawnTime = now;
        }
    });
};

// 9. 3D Tilt Effect for Glass Cards
const initCardTilt = () => {
    if (isMobile) return; // Disable tilt on mobile
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });
    });
};

// 10. Wish Sender Logic
const initWishSender = () => {
    const fab = document.getElementById('wish-fab');
    const modal = document.getElementById('wish-modal');
    const close = document.querySelector('.close-wish');
    const btn = document.getElementById('send-wish-btn');
    const input = document.getElementById('wish-input');
    const card = document.querySelector('.wish-card');
    const success = document.getElementById('wish-success-msg');

    const openModal = () => modal.classList.add('active');
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            card.style.display = 'block';
            card.style.opacity = '1';
            success.classList.remove('active');
            input.value = '';
            btn.innerHTML = 'GỬI ĐẾN BẮC CỰC';
        }, 500);
    };

    fab.addEventListener('click', openModal);
    close.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    btn.addEventListener('click', () => {
        if (!input.value.trim()) return;

        btn.innerHTML = 'Đang gửi... ❄️';

        // Simulate sending
        gsap.to(card, {
            scale: 0.1,
            opacity: 0,
            y: -200,
            duration: 0.8,
            ease: 'back.in(1.7)',
            onComplete: () => {
                card.style.display = 'none';
                success.classList.add('active');

                // Fire particles
                createBurst(success);

                setTimeout(closeModal, 3000);
            }
        });
    });
};

// 13. UI Toggle (Immersive Mode)
const initNavToggle = () => {
    const nav = document.getElementById('navbar');
    const logo = document.querySelector('.logo');

    if (!nav || !logo) return;

    // Add a tooltip hint via title attribute
    logo.title = "Nhấn để bật chế độ Chìm đắm";

    logo.addEventListener('click', (e) => {
        e.preventDefault();
        nav.classList.toggle('ui-hidden');

        // Optional: Play a subtle sound or effect
        if (nav.classList.contains('ui-hidden')) {
            gsap.to(logo, { scale: 0.9, duration: 0.2, yoyo: true, repeat: 1 });
        }
    });
};

// ... (Preloader logic remains) ...

// 12. Custom Datepicker Initialization
const initDatepicker = () => {
    flatpickr("#booking-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disableMobile: "true", // Force custom picker on mobile too
        animate: true,
        locale: "vn", // Vietnamese locale
        bg: "#000" // Just a placeholder, styling is done in CSS
    });
};

// 11. Flying Santa Logic with Magic Trail
const initFlyingSanta = () => {
    const container = document.getElementById('flying-santa-container');
    const santa = document.getElementById('flying-santa');

    // Check if elements exist
    if (!container || !santa) return;

    // Particle Trail Engine
    let trailInterval;
    const createTrail = () => {
        // PERF: No dust on mobile
        if (isMobile) return;

        const rect = santa.getBoundingClientRect();

        // Spawn fewer particles for performance
        for (let i = 0; i < 1; i++) {
            const dust = document.createElement('div');
            dust.className = 'magic-dust';

            // Random offset near the back of the sleigh (approximate based on direction)
            // Assuming Santa flies left to right
            const offsetX = Math.random() * 50;
            const offsetY = Math.random() * 40 - 20;

            dust.style.left = (rect.left + offsetX) + 'px';
            dust.style.top = (rect.top + 60 + offsetY) + 'px'; // +60 to align with sleigh runner height approx

            // Randomize color slightly (Gold to White)
            dust.style.background = Math.random() > 0.5 ? 'var(--accent)' : '#fff';

            document.body.appendChild(dust);

            // Animate dust fading out and falling slightly
            gsap.to(dust, {
                x: -100 - Math.random() * 50, // Drift back
                y: 20 + Math.random() * 30, // Drift down like heavy gold dust
                opacity: 0,
                scale: 0,
                duration: 1 + Math.random(),
                ease: 'power1.out',
                onComplete: () => dust.remove()
            });
        }
    };

    const fly = () => {
        // Random start delay between 15s and 40s (more frequent for testing?) 
        // Let's keep it somewhat rare to be magical
        const delay = Math.random() * 30000 + 10000;

        setTimeout(() => {
            // Make visible
            container.style.visibility = 'visible';

            // Randomize path
            const startY = Math.random() * (window.innerHeight * 0.5);
            const endY = Math.random() * (window.innerHeight * 0.5);

            // Set initial position
            gsap.set(santa, {
                x: -300, // Start off screen left
                y: startY,
                rotation: 0,
                scale: 0.6 // Start small (far away)
            });

            // Start Dust Trail - Reduced frequency
            trailInterval = setInterval(createTrail, 100);

            // Calculate angle
            const angle = Math.atan2(endY - startY, window.innerWidth) * (180 / Math.PI);

            // Timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    clearInterval(trailInterval);
                    container.style.visibility = 'hidden';
                    fly(); // Schedule next
                }
            });

            const duration = 15 + Math.random() * 10;

            // Composite Animation: Move + Scale (Perspective)
            tl.to(santa, {
                x: window.innerWidth + 300,
                y: endY,
                duration: duration,
                ease: 'none',
                rotation: angle * 0.3
            }, 0);

            // Perspective Effect: Get closer then go away
            tl.to(santa, {
                scale: 1.2,
                duration: duration / 2,
                ease: "power1.out"
            }, 0);
            tl.to(santa, {
                scale: 0.6,
                duration: duration / 2,
                ease: "power1.in"
            }, duration / 2);

            // Bobbing
            gsap.to(santa, {
                y: "+=20",
                duration: 1.5,
                yoyo: true,
                repeat: Math.floor(duration / 1.5),
                ease: "sine.inOut"
            });

        }, delay);
    };

    // Start
    fly();
};

// 14. FAQ Accordion Logic
const initFaq = () => {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            items.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
};

// 15. Naughty or Nice Detector
const initDetector = () => {
    const inputPhase = document.getElementById('detector-input-phase');
    const scanningPhase = document.getElementById('detector-scanning-phase');
    const resultPhase = document.getElementById('detector-result-phase');
    const nameInput = document.getElementById('detector-name');
    const scanBtn = document.getElementById('btn-scan');
    const statusText = document.getElementById('scan-status');
    const resultName = document.getElementById('result-name');
    const resetBtn = document.getElementById('btn-reset-scan');
    const stamp = document.getElementById('result-stamp');

    if (!inputPhase) return;

    scanBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) {
            alert("Vui lòng nhập tên của bé!");
            return;
        }

        // Switch to scanning
        gsap.to(inputPhase, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: () => {
                inputPhase.style.display = 'none';
                scanningPhase.style.display = 'block';
                gsap.fromTo(scanningPhase, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });

                // Simulate scanning steps
                const steps = [
                    "Đang kết nối vệ tinh tuần lộc...",
                    "Đang phân tích hành vi...",
                    "Đang kiểm tra tần suất dọn phòng...",
                    "Đang tải dữ liệu từ Bắc Cực..."
                ];

                let step = 0;
                const interval = setInterval(() => {
                    statusText.innerText = steps[step];
                    step++;
                    if (step >= steps.length) {
                        clearInterval(interval);
                        finishScan(name);
                    }
                }, 1500);
            }
        });
    });

    const finishScan = (name) => {
        gsap.to(scanningPhase, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            onComplete: () => {
                scanningPhase.style.display = 'none';
                resultPhase.style.display = 'block';
                resultName.innerText = name;

                gsap.fromTo(resultPhase, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });

                // Stamp effect
                setTimeout(() => {
                    stamp.classList.add('stamp-active');
                    createBurst(resultPhase);
                }, 500);
            }
        });
    };

    resetBtn.addEventListener('click', () => {
        nameInput.value = '';
        stamp.classList.remove('stamp-active');

        gsap.to(resultPhase, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => {
                resultPhase.style.display = 'none';
                inputPhase.style.display = 'block';
                gsap.fromTo(inputPhase, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
            }
        });
    });
};

// 16. North Pole Live Status Updates
const initNorthPoleStatus = () => {
    const locations = ["Xưởng Đồ Chơi", "Chuồng Tuần Lộc", "Văn Phòng Santa", "Cảng Băng Bắc Cực", "Nhà Bếp Của Bà Claus"];
    const actions = ["Kiểm tra danh sách 📜", "Cho tuần lộc ăn 🥕", "Gói quà thần tốc 🎁", "Pha cacao nóng ☕", "Đọc thư em bé ✉️"];

    const locEl = document.querySelector('#santa-loc span');
    const actEl = document.querySelector('#santa-action span');
    const tempEl = document.querySelector('#santa-temp span');

    if (!locEl || !actEl || !tempEl) return;

    const update = () => {
        // Change location and action randomly
        locEl.innerText = locations[Math.floor(Math.random() * locations.length)];
        actEl.innerText = actions[Math.floor(Math.random() * actions.length)];

        // Slight temperature fluctuation
        const temp = -20 - Math.floor(Math.random() * 15);
        tempEl.innerText = `${temp}°C`;

        // Animate the update
        gsap.from([locEl, actEl, tempEl], {
            opacity: 0,
            y: 5,
            duration: 0.5,
            stagger: 0.1
        });
    };

    // Update every 10 seconds
    setInterval(update, 10000);
    update(); // Initial call

    // Toggle Minimize/Expand by clicking the box
    const container = document.getElementById('north-pole-status');
    const toggleIcon = document.getElementById('status-toggle-icon');
    if (container) {
        container.addEventListener('click', () => {
            const isMinimized = container.classList.toggle('minimized');
            if (toggleIcon) {
                toggleIcon.innerText = isMinimized ? '▼' : '▲';
            }
        });
    }
};

// 17. Gallery Lightbox Logic
const initGalleryLightbox = () => {
    const modal = document.getElementById('gallery-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-gallery');
    const items = document.querySelectorAll('.gallery-item');

    if (!modal) return;

    items.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img').src;
            const text = item.querySelector('.gallery-overlay p')?.innerText || "Khoảnh khắc nhiệm màu";

            img.src = src;
            caption.innerText = text;
            modal.classList.add('active');
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};

// 18. Postcard Studio Logic
const initPostcardStudio = () => {
    const inputTo = document.getElementById('card-to');
    const inputMsg = document.getElementById('card-message');
    const inputEmail = document.getElementById('card-email');
    const previewTo = document.getElementById('preview-to');
    const previewMsg = document.getElementById('preview-message');
    const mintBtn = document.getElementById('mint-card-btn');
    const previewCard = document.getElementById('postcard-preview');
    const sealStamp = document.getElementById('postcard-seal-stamp');
    const successOverlay = document.getElementById('postcard-success-overlay');

    if (!inputTo || !previewCard) return;

    inputTo.addEventListener('input', (e) => {
        previewTo.innerText = e.target.value || "Người Đặc Biệt";
    });

    inputMsg.addEventListener('input', (e) => {
        previewMsg.innerText = e.target.value || "Hãy để phép màu của đêm Giáng Sinh soi sáng trái tim bạn...";
    });

    mintBtn.addEventListener('click', async () => {
        const to = inputTo.value;
        const email = inputEmail.value;
        const msg = inputMsg.value;

        if (!to || !email || !msg) {
            alert("Vui lòng điền đầy đủ thông tin để gửi thiệp phép thuật!");
            return;
        }

        const originalText = mintBtn.innerText;
        mintBtn.innerText = "ĐANG NIÊM PHONG... ✨";
        mintBtn.disabled = true;

        // EmailJS Logic
        if (typeof emailjs !== 'undefined') {
            const params = {
                name: to,
                title: msg,
                to_email: email, // Biến phổ biến nhất
                email: email,    // Biến dự phòng 1
                recipient: email, // Biến dự phòng 2
                from_name: "Santa Magic"
            };
            console.log("Sending Email with params:", params);

            emailjs.send("service_e3ftyx7", "template_5xvzs95", params, "Zo9pYt96J3B4lwEoD")
                .then((res) => {
                    console.log("Email sent successfully! Status:", res.status, res.text);
                }).catch((err) => {
                    console.error("EmailJS Error details:", err);
                    if (err.status === 400) {
                        console.error("Lỗi 400 (Bad Request): Hãy kiểm tra Service ID, Template ID hoặc Whitelisted Domains trong EmailJS Dashboard!");
                    }
                });
        }

        const tl = gsap.timeline();

        // 1. Shake the card
        tl.to(previewCard, {
            x: 5, y: 5, rotate: 1, duration: 0.1, repeat: 5, yoyo: true
        })
            // 2. Drop the seal stamp
            .to(sealStamp, {
                opacity: 1, y: "-50%", scale: 1, duration: 0.6, ease: "back.out(1.7)",
                onStart: () => {
                    gsap.set(sealStamp, { y: -500, scale: 3, opacity: 0 });
                    gsap.to(sealStamp, { opacity: 1, duration: 0.2 });
                }
            })
            // 3. Card impact effect
            .to(previewCard, {
                scale: 0.98, duration: 0.1, yoyo: true, repeat: 1
            }, "-=0.2")
            // 4. Success Reveal
            .add(() => {
                createBurst(mintBtn);
                successOverlay.classList.add('active');
                mintBtn.innerText = "HOÀN TẤT NIÊM PHONG ✔";
            }, "+=0.3");

        setTimeout(() => {
            setTimeout(() => {
                mintBtn.innerText = originalText;
                mintBtn.disabled = false;
                setTimeout(() => {
                    successOverlay.classList.remove('active');
                    gsap.to(sealStamp, { opacity: 0, duration: 0.5 });
                    // Clear inputs after success
                    inputTo.value = '';
                    inputEmail.value = '';
                    inputMsg.value = '';
                }, 3000);
            }, 2000);
        }, 1500);
    });
};

// Navigation Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Preloader Removal - Robust Method
const removePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader || preloader.style.display === 'none') return;

    // Wait for all images to be loaded
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = images.length;

    const onImageLoaded = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
            fadeOutPreloader();
        }
    };

    const fadeOutPreloader = () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                preloader.style.display = 'none';

                // Initialize all components
                initNavToggle();
                initAnimations();
                initCountdown();
                initGiftBox();
                initMusic();
                createSnow();
                initMagicCursor();
                initCardTilt();
                initWishSender();
                initFlyingSanta();
                initDatepicker();
                initFaq();
                initDetector();
                initNorthPoleStatus();
                initGalleryLightbox();
                initPostcardStudio();

                // CRITICAL: Refresh ScrollTrigger after all initializations and layout shifts
                setTimeout(() => {
                    ScrollTrigger.refresh();
                    console.log("ScrollTrigger Refreshed");
                }, 100);
            }
        });
    };

    if (totalImages === 0) {
        fadeOutPreloader();
    } else {
        images.forEach(img => {
            if (img.complete) {
                onImageLoaded();
            } else {
                img.addEventListener('load', onImageLoaded);
                img.addEventListener('error', onImageLoaded); // Count errors too to avoid blocking
            }
        });
    }
};

// Handle load events safely
if (document.readyState === 'complete') {
    removePreloader();
} else {
    window.addEventListener('load', removePreloader);
}

// Fallback safety timeout (Increased to 10s for slow assets)
setTimeout(() => {
    removePreloader();
}, 10000);
