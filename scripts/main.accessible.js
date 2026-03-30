document.addEventListener('DOMContentLoaded', function(){
  const openBtn = document.getElementById('openTrial');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelModal');
  const trialForm = document.getElementById('trialForm');

  function openModal(){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    const first = modal.querySelector('input, button, [tabindex]');
    if(first) first.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='auto';
    if(openBtn) openBtn.focus();
  }

  if(openBtn) openBtn.addEventListener('click', openModal);
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if(trialForm) trialForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const name = trialForm.name.value || 'Amigo';
    const payload = { name: trialForm.name.value, phone: trialForm.phone.value, time: trialForm.time.value };
    try{
      const res = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(res.ok){
        closeModal();
        trialForm.reset();
        alert(`${name}, obrigado! Entraremos em contato para confirmar sua aula experimental.`);
      } else {
        throw new Error('Erro no servidor');
      }
    }catch(err){
      console.warn('Fetch falhou, fallback para alert', err);
      alert(`${name}, obrigado! Entraremos em contato para confirmar sua aula experimental.`);
      closeModal();
      trialForm.reset();
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });

  if(modal) modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });

  // Smooth scroll for internal anchors (delegation)
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });

  const testimonials = document.querySelectorAll('.testimonial');
  let tIndex = 0;
  function showTestimonial(i){ testimonials.forEach((t,idx)=> t.classList.toggle('active', idx===i)); }
  if(testimonials.length>1){
    let tInterval = setInterval(()=>{ tIndex = (tIndex+1) % testimonials.length; showTestimonial(tIndex); },5000);
    testimonials.forEach(t=>{ t.addEventListener('mouseenter', ()=> clearInterval(tInterval)); t.addEventListener('mouseleave', ()=> tInterval = setInterval(()=>{ tIndex = (tIndex+1) % testimonials.length; showTestimonial(tIndex); },5000)); });
  }

  const nav = document.querySelector('.nav');
  const navToggle = document.createElement('button');
  navToggle.className = 'nav-toggle';
  navToggle.setAttribute('aria-expanded','false');
  navToggle.setAttribute('aria-label','Abrir menu');
  navToggle.setAttribute('aria-controls','main-nav');
  navToggle.innerHTML = '&#9776;';
  const headerInner = document.querySelector('.header-inner');
  if(headerInner) headerInner.insertBefore(navToggle, headerInner.firstChild);
  navToggle.addEventListener('click', function(){ const open = this.getAttribute('aria-expanded') === 'true'; this.setAttribute('aria-expanded', String(!open)); if(nav) nav.classList.toggle('open'); });
  if(nav) nav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{ nav.classList.remove('open'); if(navToggle) navToggle.setAttribute('aria-expanded','false'); }));

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', ()=>{ if(window.scrollY>40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); });
});
