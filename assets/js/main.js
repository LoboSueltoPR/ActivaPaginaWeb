const RETURN_HASH_KEY = 'activa-return-hash';

// Restore saved section when returning without hash
(function(){
  try {
    const saved = sessionStorage.getItem(RETURN_HASH_KEY);
    if(!saved || window.location.hash) return;
    const target = document.querySelector(saved);
    if(!target) {
      sessionStorage.removeItem(RETURN_HASH_KEY);
      return;
    }
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({block:'start'});
    root.style.scrollBehavior = previousBehavior || '';
    history.replaceState(null, '', saved);
    sessionStorage.removeItem(RETURN_HASH_KEY);
  } catch (err) {
    console.error(err);
  }
})();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');
const navBackdrop = document.getElementById('navBackdrop');

function setMenuState(open){
  if(!nav) return;
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if(hamburger){
    hamburger.classList.toggle('is-active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.textContent = open ? '×' : '☰';
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  navBackdrop?.classList.toggle('is-active', open);
}

hamburger?.addEventListener('click', () => {
  const willOpen = !nav?.classList.contains('is-open');
  setMenuState(Boolean(willOpen));
});

navBackdrop?.addEventListener('click', () => setMenuState(false));

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuState(false));
});

window.addEventListener('resize', () => {
  if(window.innerWidth > 860){
    setMenuState(false);
  }
});

document.addEventListener('keydown', (event) => {
  if(event.key === 'Escape'){
    setMenuState(false);
  }
});

// Simple Carousel factory
function makeCarousel(rootId, dotsId){
  const root = document.getElementById(rootId);
  if(!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  if(!track || slides.length === 0) return;
  const prev = root.querySelector('.carousel-btn.prev');
  const next = root.querySelector('.carousel-btn.next');
  const dots = dotsId ? document.getElementById(dotsId) : null;
  const autoplayDelay = Number(root.dataset.autoplay || 7000);
  const isPeeking = root.classList.contains('carousel--peek');
  let index = 0;
  let step = 0;
  let autoplayTimer = null;

  if(dots){
    dots.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.addEventListener('click', () => go(i));
      dots.appendChild(b);
    });
  }

  function measure(){
    if(!isPeeking){
      return;
    }
    const slideRect = slides[0].getBoundingClientRect();
    const trackStyle = window.getComputedStyle(track);
    const gapValue = parseFloat(trackStyle.columnGap || trackStyle.gap || trackStyle.rowGap) || 0;
    step = slideRect.width + gapValue;
  }

  function applyTransform(){
    if(isPeeking && step){
      const maxTranslate = Math.max(0, (slides.length - 1) * step);
      const translate = Math.min(index * step, maxTranslate);
      track.style.transform = `translateX(-${translate}px)`;
    } else {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  function update(){
    applyTransform();
    slides.forEach((s,i)=> s.classList.toggle('is-active', i===index));
    if(dots){
      Array.from(dots.children).forEach((d,i) => d.classList.toggle('is-active', i===index));
    }
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  prev?.addEventListener('click', ()=> go(index-1));
  next?.addEventListener('click', ()=> go(index+1));

  const handleResize = () => {
    measure();
    update();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('load', handleResize, { once: true });

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  function stopAutoplay(){
    if(autoplayTimer){
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay(){
    if(slides.length <= 1 || autoplayDelay <= 0) return;
    if(prefersReducedMotion?.matches) return;
    stopAutoplay();
    autoplayTimer = setInterval(()=> go(index+1), autoplayDelay);
  }

  const handleMotionChange = (event) => {
    if(event.matches){
      stopAutoplay();
    } else {
      startAutoplay();
    }
  };

  if(prefersReducedMotion?.addEventListener){
    prefersReducedMotion.addEventListener('change', handleMotionChange);
  } else if(prefersReducedMotion?.addListener){
    prefersReducedMotion.addListener(handleMotionChange);
  }

  measure();
  update();
  startAutoplay();
}

makeCarousel('heroCarousel','heroDots');
makeCarousel('clipsCarousel','clipsDots');
makeCarousel('coverageCarousel','coverageDots');
makeCarousel('coverageCarousel2','coverageDots2');
makeCarousel('coverageCarousel3','coverageDots3');

// year
document.getElementById('year').textContent = new Date().getFullYear();


// --- Simple page fade transition ---
(function(){
  const body = document.body;
  function clearExitState(){
    body.classList.remove('page-fade-exit', 'page-fade-exit-active');
  }

  function enter(){
    clearExitState();
    body.classList.remove('page-fade-enter-active');
    body.classList.add('page-fade-enter');
    requestAnimationFrame(()=>{
      body.classList.add('page-fade-enter-active');
      body.classList.remove('page-fade-enter');
    });
  }
  function exit(href){
    body.classList.add('page-fade-exit');
    // force reflow
    void body.offsetWidth;
    body.classList.add('page-fade-exit-active');
    setTimeout(()=>{ window.location.href = href; }, 220);
  }
  enter();
  window.addEventListener('pageshow', (event) => {
    if(event.persisted || window.performance?.getEntriesByType('navigation')?.[0]?.type === 'back_forward'){
      enter();
    } else {
      clearExitState();
    }
  });
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[data-transition]');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || a.target === '_blank') return;
    const returnHash = a.dataset.returnHash;
    if(returnHash){
      try { sessionStorage.setItem(RETURN_HASH_KEY, returnHash); } catch(err){ console.error(err); }
    } else {
      try { sessionStorage.removeItem(RETURN_HASH_KEY); } catch(err){ console.error(err); }
    }
    e.preventDefault();
    exit(href);
  });
})();
