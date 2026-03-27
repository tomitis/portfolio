/* ========================================
   ANSH — Portfolio JS  |  Premium
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // ================================================================
    // 1. THEME TOGGLE (light / dark)
    // ================================================================
    const themeBtn = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('ansh-theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('ansh-theme', next);
        });
    }

    // ================================================================
    // 2. MOBILE NAV
    // ================================================================
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // ================================================================
    // 3. NAVBAR: scrolled state + active link highlight
    // ================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar style
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Active link
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        });

        // Scroll progress bar
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        const bar = document.getElementById('scroll-progress');
        if (bar) bar.style.width = progress + '%';

        // Back to top
        const btn = document.getElementById('back-to-top');
        if (btn) btn.classList.toggle('visible', scrollY > 600);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Back to top click
    const btt = document.getElementById('back-to-top');
    if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ================================================================
    // 4. SCROLL REVEAL (IntersectionObserver)
    // ================================================================
    const revealEls = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .about-grid, .contact-form, .stat-card, .section-title'
    );
    revealEls.forEach(el => el.classList.add('reveal'));

    const staggerEls = document.querySelectorAll('.skills-grid, .projects-grid, .stats-grid');
    staggerEls.forEach(el => el.classList.add('stagger-children'));

    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }),
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => observer.observe(el));

    // ================================================================
    // 5. TYPING EFFECT
    // ================================================================
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'SDET | 4+ Years Experience',
            'Cypress & Selenium Expert',
            'CI/CD & DevOps Enthusiast',
            'Shift-Left Testing Advocate',
            'API Testing with REST Assured',
            'Quality is not an act, it\'s a habit',
        ];
        let phraseIdx = 0, charIdx = 0, isDeleting = false;

        function typeLoop() {
            const current = phrases[phraseIdx];

            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typedEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 35 : 65;

            if (!isDeleting && charIdx === current.length) {
                speed = 2000; // pause at full word
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                speed = 400;
            }

            setTimeout(typeLoop, speed);
        }
        setTimeout(typeLoop, 1200);
    }

    // ================================================================
    // 6. ANIMATED STAT COUNTERS
    // ================================================================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        }),
        { threshold: 0.5 }
    );
    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ================================================================
    // 7. CUSTOM CURSOR (desktop only)
    // ================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');

        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Enlarge on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .tag, .project-card, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    } else {
        // Hide cursor elements on touch devices
        document.querySelectorAll('.cursor-dot, .cursor-ring').forEach(el => el.style.display = 'none');
    }

    // ================================================================
    // 8. PARTICLE CANVAS (Hero background)
    // ================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 60;

        function resizeCanvas() {
            const hero = document.getElementById('hero');
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            };
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(124, 106, 239, ${p.opacity})`;
                ctx.fill();
            });

            // Draw lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(124, 106, 239, ${0.08 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ================================================================
    // 9. TILT EFFECT on project cards (desktop only)
    // ================================================================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ================================================================
    // 10. MAGNETIC BUTTONS (desktop only)
    // ================================================================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ================================================================
    // 11. CONTACT FORM (Web3Forms — sends real email)
    // ================================================================
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const span = btn.querySelector('span');

            // Validate access key is set
            const accessKey = form.querySelector('input[name="access_key"]').value;
            if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
                span.textContent = '⚠ Setup required';
                btn.style.background = '#e6a040';
                setTimeout(() => {
                    span.textContent = 'Send Message';
                    btn.style.background = '';
                }, 3000);
                return;
            }

            // Show sending state
            span.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(form);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();

                if (result.success) {
                    span.textContent = '✓ Message Sent!';
                    btn.style.background = '#36d6b0';
                    form.reset();
                    // Re-set the access key after reset
                    form.querySelector('input[name="access_key"]').value = accessKey;
                } else {
                    span.textContent = '✗ Failed to send';
                    btn.style.background = '#e05555';
                }
            } catch {
                span.textContent = '✗ Network error';
                btn.style.background = '#e05555';
            }

            setTimeout(() => {
                span.textContent = 'Send Message';
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        });
    }
});
