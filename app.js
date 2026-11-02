/**
 * ICMITE 2027 - International Conference on Multidisciplinary Innovations
 * Master Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Interactive Canvas Neural / Circuit Particle Animation
  initHeroCanvas();

  // 3. Countdown Timer (Target: Jan 29, 2027, 09:00:00 IST)
  initCountdownTimer();

  // 4. Sticky Header & Scroll Spy Navigation
  initHeaderAndScrollSpy();

  // 5. Mobile Drawer Navigation
  initMobileNav();

  // 6. Committee Tabs Filter & Live Search
  initCommitteeSearchAndFilter();

  // 7. Back-to-top floating button
  initBackToTop();
});

/* ==========================================================================
   Interactive Hero Canvas Background
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 12000), 80);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 600;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2.2 + 1;
      this.isGold = Math.random() > 0.82;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactivity
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const fx = (dx / dist) * force * 1.5;
          const fy = (dy / dist) * force * 1.5;
          this.x -= fx;
          this.y -= fy;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold ? 'rgba(251, 191, 36, 0.75)' : 'rgba(147, 197, 253, 0.65)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].isGold || particles[j].isGold
            ? `rgba(245, 158, 11, ${alpha * 0.35})`
            : `rgba(59, 130, 246, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Countdown Timer Logic
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const targetDate = new Date('January 29, 2027 09:00:00 GMT+0530').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minsEl.textContent = mins.toString().padStart(2, '0');
    secsEl.textContent = secs.toString().padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   Header Scroll & Active Section Highlighting
   ========================================================================== */
function initHeaderAndScrollSpy() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for scroll spy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer) return;

  function toggleMenu() {
    hamburgerBtn.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   Committee Tab Filtering & Live Search
   ========================================================================== */
function initCommitteeSearchAndFilter() {
  const tabButtons = document.querySelectorAll('.committee-tab-btn');
  const tierGroups = document.querySelectorAll('.committee-tier-group');
  const searchInput = document.getElementById('committee-search-box');
  const allItems = document.querySelectorAll('.committee-item');

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    tierGroups.forEach((group) => {
      const groupCategory = group.getAttribute('data-category');
      const matchesCategory = currentCategory === 'all' || currentCategory === groupCategory;

      let groupHasVisibleItems = false;
      const itemsInGroup = group.querySelectorAll('.committee-item');

      itemsInGroup.forEach((item) => {
        const textContent = (item.getAttribute('data-text') || item.innerText).toLowerCase();
        const matchesSearch = !currentSearch || textContent.includes(currentSearch);

        if (matchesCategory && matchesSearch) {
          item.style.display = 'flex';
          groupHasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });

      if (matchesCategory && groupHasVisibleItems) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ==========================================================================
   Copy to Clipboard Action
   ========================================================================== */
function copyToClipboard(text, fieldName) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast(`Copied ${fieldName} to clipboard!`);
    })
    .catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(`Copied ${fieldName}!`);
    });
}

function showToast(message) {
  const toast = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// Make copyToClipboard available globally for inline onclick
window.copyToClipboard = copyToClipboard;

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
