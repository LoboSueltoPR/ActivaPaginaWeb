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
  if(window.innerWidth > 820){
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
  const prev = root.querySelector('.carousel-btn.prev');
  const next = root.querySelector('.carousel-btn.next');
  const dots = document.getElementById(dotsId);
  let index = 0;

  // build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.addEventListener('click', () => go(i));
    dots.appendChild(b);
  });

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s,i)=> s.classList.toggle('is-active', i===index));
    Array.from(dots.children).forEach((d,i) => d.classList.toggle('is-active', i===index));
  }
  function go(i){
    index = (i + slides.length) % slides.length;
    update();
  }
  prev?.addEventListener('click', ()=> go(index-1));
  next?.addEventListener('click', ()=> go(index+1));

  // Auto-play
  setInterval(()=> go(index+1), 7000);
  update();
}

makeCarousel('heroCarousel','heroDots');
makeCarousel('clipsCarousel','clipsDots');

// year
document.getElementById('year').textContent = new Date().getFullYear();


// --- Simple page fade transition ---
(function(){
  const body = document.body;
  function enter(){
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
