(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  root.classList.add('motion-ready');

  if (reducedMotion) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealElements.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      root.style.setProperty('--hero-parallax', Math.min(scrollY * 0.035, 38) + 'px');
    };
    addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(updateParallax);
    }, { passive: true });
    updateParallax();
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const homeHero = document.querySelector('.hero-home');
  if (homeHero && matchMedia('(min-width: 761px)').matches) {
    const video = document.createElement('video');
    video.className = 'hero-media';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = './assets/hero-home.jpg';
    video.setAttribute('aria-hidden', 'true');
    const source = document.createElement('source');
    source.src = './assets/hero-home.mp4';
    source.type = 'video/mp4';
    video.append(source);
    homeHero.prepend(video);
    video.play().catch(() => {});
  }

  const menuVideo = document.querySelector('.menu-bottom');
  if (menuVideo) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !menuVideo.querySelector('source')) {
        const source = document.createElement('source');
        source.src = '../assets/menu-bottom.mp4';
        source.type = 'video/mp4';
        menuVideo.append(source);
        menuVideo.load();
        menuVideo.play().catch(() => {});
        observer.disconnect();
      } else if (!entry.isIntersecting) {
        menuVideo.pause();
      }
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    observer.observe(menuVideo);
  }
})();
