// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('mainNav');
hamburger?.addEventListener('click', () => nav.classList.toggle('is-open'));

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
    e.preventDefault();
    exit(href);
  });
})();
