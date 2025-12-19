// GSAP Core
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1. Custom Magical Cursor with Leading Momentum
const cursor = document.getElementById('magic-cursor');
const follower = document.getElementById('cursor-follower');

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
    container.innerHTML = ''; // Clear existing
    const snowCount = 150;

    for (let i = 0; i < snowCount; i++) {
        const snow = document.createElement('div');
        snow.className = 'snowflake';

        // Physics properties: Depth 0 (far) to 1 (near)
        const depth = Math.random();
        const size = (Math.random() * 3 + 2) + (depth * 5); // 2px to 7px

        // Style: Soft Bokeh Circles (Premium feel)
        snow.style.width = `${size}px`;
        snow.style.height = `${size}px`;
        snow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0) 70%)';
        snow.style.borderRadius = '50%';
        snow.style.position = 'absolute';

        // Depth effects
        snow.style.opacity = 0.2 + (depth * 0.6); // Nearer = brighter
        snow.style.filter = `blur(${(1 - depth) * 3}px)`; // Farther = blurrier
        snow.style.zIndex = depth > 0.8 ? 100 : 50;

        container.appendChild(snow);
        animateSnow(snow, depth);
    }
};

const animateSnow = (el, depth) => {
    // Speed: Nearer objects appear to fall faster (Parallax)
    const duration = 10 + (1 - depth) * 15 + Math.random() * 5;

    // Wind influence
    const windForce = 150; // Pixels to drift right

    // 1. Fall Motion (Looping)
    gsap.fromTo(el, {
        y: -50
    }, {
        y: window.innerHeight + 50,
        duration: duration,
        ease: "none",
        repeat: -1,
        delay: -Math.random() * duration // Start random mid-air
    });

    // 2. Lateral Drift (Wind)
    const startX = Math.random() * window.innerWidth;
    gsap.fromTo(el, {
        x: startX - 50 // Start slightly left to account for wind
    }, {
        x: startX + windForce + (Math.random() * 50),
        duration: duration,
        ease: "none",
        repeat: -1,
        delay: -Math.random() * duration
    });

    // 3. Natural Sway (Oscillation)
    gsap.to(el, {
        x: `+=${20 + Math.random() * 30}`,
        duration: 3 + Math.random() * 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
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
    let opened = false;

    box.addEventListener('click', () => {
        if (!opened) {
            gsap.to(lid, {
                y: -100,
                x: 50,
                rotation: 45,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
            gsap.to(box, {
                scale: 1.1,
                yoyo: true,
                repeat: 3,
                duration: 0.1
            });

            // Magical Particle Burst
            createBurst(box);
            opened = true;
        }
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

// 7. Music Toggle (Visual Only)
const initMusic = () => {
    const toggle = document.getElementById('music-toggle');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('playing');
        if (toggle.classList.contains('playing')) {
            gsap.to(toggle, { color: 'var(--primary)', scale: 1.2, duration: 0.3 });
        } else {
            gsap.to(toggle, { color: 'var(--accent)', scale: 1, duration: 0.3 });
        }
    });
};

// 8. Magic Cursor Trail
const initMagicCursor = () => {
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

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
        gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.5 });

        // Spawn particle
        if (Math.random() > 0.5) {
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
        }
    });
};

// 9. 3D Tilt Effect for Glass Cards
const initCardTilt = () => {
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
            btn.innerHTML = 'SEND TO NORTH POLE';
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

        btn.innerHTML = 'Sending... ❄️';

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

// Preloader Removal
window.addEventListener('load', () => {
    gsap.to('#preloader', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            document.getElementById('preloader').style.display = 'none';
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
        }
    });
});

// 12. Custom Datepicker Initialization
const initDatepicker = () => {
    flatpickr("#booking-date", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disableMobile: "true", // Force custom picker on mobile too
        animate: true,
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
        // Get Santa's current position relative to the container
        const rect = santa.getBoundingClientRect();

        // Spawn multiple particles for a richer trail
        for (let i = 0; i < 3; i++) {
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

            // Start Dust Trail
            trailInterval = setInterval(createTrail, 50);

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

// Navigation Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});
