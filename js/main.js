// ========================
// Nav scroll effect
// ========================
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 20);
  lastScroll = scrollY;
}, { passive: true });

// ========================
// Mobile menu toggle
// ========================
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ========================
// Scroll reveal animations
// ========================
const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-left');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.05,
    rootMargin: '0px 0px 0px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));

requestAnimationFrame(() => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
});

// ========================
// FAQ accordion
// ========================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('open');
    question.setAttribute('aria-expanded', !isOpen);
  });
});

// ========================
// Smooth anchor scroll
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================
// Scroll-driven video scrub
// Tied to the showcase-scroll-area container height.
// Forward only — plays from start to end as user scrolls.
// Uses requestAnimationFrame for smooth mobile performance.
// ========================
const heroVideo = document.querySelector('.hero-product-video');

if (heroVideo) {
  const initScrub = () => {
    heroVideo.currentTime = 0;

    const showcase = document.querySelector('.showcase-scroll-area');
    const scrollHint = document.querySelector('.scroll-hint');
    let ticking = false;

    const scrubVideo = () => {
      const containerTop = showcase.offsetTop;
      const containerHeight = showcase.offsetHeight;
      const totalDistance = containerHeight - window.innerHeight;

      const scrolled = window.scrollY - containerTop;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, totalDistance)));

      heroVideo.currentTime = progress * heroVideo.duration;

      // Fade out scroll hint as user scrolls
      if (scrollHint) {
        scrollHint.style.opacity = Math.max(0, 1 - progress * 5);
      }

      // Fade out the entire sticky hero video container as scroll finishes
      // so the usage video below transitions in perfectly
      const videoInner = document.querySelector('.showcase-video-inner');
      if (videoInner) {
        // Start fading at 80% scroll progress, fully gone at 100%
        const fadeProgress = Math.max(0, (progress - 0.8) / 0.2);
        videoInner.style.opacity = 1 - fadeProgress;
        videoInner.style.pointerEvents = progress >= 1 ? 'none' : '';
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(scrubVideo);
        ticking = true;
      }
    }, { passive: true });
    scrubVideo();
  };

  // Handle both: already loaded (cached) and not yet loaded
  if (heroVideo.readyState >= 1) {
    initScrub();
  } else {
    heroVideo.addEventListener('loadedmetadata', initScrub);
  }

  // Force load on mobile — some browsers delay loading until interaction
  if (heroVideo.readyState === 0) {
    heroVideo.load();
  }
}

// ========================
// Lazy-play feature videos (pause when off-screen on mobile to save battery)
// ========================
const featureVideos = document.querySelectorAll('.feature-image video[autoplay]');
if (featureVideos.length > 0) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  featureVideos.forEach(v => videoObserver.observe(v));
}

// ========================
// Usage video — autoplay on scroll, click to toggle play/pause
// ========================
const usageVideo = document.querySelector('.usage-video');
if (usageVideo) {
  const usageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  usageObserver.observe(usageVideo);

  usageVideo.addEventListener('click', () => {
    if (usageVideo.paused) {
      usageVideo.play().catch(() => {});
    } else {
      usageVideo.pause();
    }
  });
}

// ========================
// Active nav link on scroll
// ========================
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-primary)';
          }
        });
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '-72px 0px -50% 0px'
  }
);

sections.forEach(section => navObserver.observe(section));
