document.addEventListener('DOMContentLoaded', function(){
  document.addEventListener('DOMContentLoaded', function () {
    const openButton = document.getElementById('openTrial');
    const modalElement = document.getElementById('modal');
    const closeButton = document.getElementById('closeModal');
    const cancelButton = document.getElementById('cancelModal');
    const trialForm = document.getElementById('trialForm');
    const mainContent = document.getElementById('main-content');

    const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"])';
    let previousFocus = null;
    let trapListener = null;

    function getFocusableElements(container) {
      return Array.from(container.querySelectorAll(focusableSelectors)).filter(node => node.offsetParent !== null);
    }

    function openModal() {
      previousFocus = document.activeElement;
      modalElement.setAttribute('aria-hidden', 'false');
      if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'hidden';

      const focusableElements = getFocusableElements(modalElement);
      const firstFocusable = focusableElements[0] || modalElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] || modalElement;

      if (firstFocusable) firstFocusable.focus();

      trapListener = function (event) {
        if (event.key !== 'Tab') return;
        const currentFocusable = getFocusableElements(modalElement);
        const firstNow = currentFocusable[0];
        const lastNow = currentFocusable[currentFocusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === firstNow || document.activeElement === modalElement) {
            event.preventDefault();
            lastNow.focus();
          }
        } else {
          if (document.activeElement === lastNow) {
            event.preventDefault();
            firstNow.focus();
          }
        }
      };

      modalElement.addEventListener('keydown', trapListener);
    }

    function closeModal() {
      modalElement.setAttribute('aria-hidden', 'true');
      if (mainContent) mainContent.removeAttribute('aria-hidden');
      document.body.style.overflow = 'auto';
      if (trapListener) modalElement.removeEventListener('keydown', trapListener);
      trapListener = null;
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }

    if (openButton) openButton.addEventListener('click', openModal);
    if (closeButton) closeButton.addEventListener('click', closeModal);
    if (cancelButton) cancelButton.addEventListener('click', closeModal);

    if (trialForm) trialForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const userName = trialForm.name.value || 'Amigo';
      const payload = { name: trialForm.name.value, phone: trialForm.phone.value, time: trialForm.time.value };
      try {
        const response = await fetch('/api/trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          closeModal();
          trialForm.reset();
          alert(`${userName}, obrigado! Entraremos em contato para confirmar sua aula experimental.`);
        } else {
          throw new Error('Erro no servidor');
        }
      } catch (err) {
        console.warn('Fetch falhou, fallback para alert', err);
        alert(`${userName}, obrigado! Entraremos em contato para confirmar sua aula experimental.`);
        closeModal();
        trialForm.reset();
      }
    });

    document.addEventListener('keydown', function (event) {
      // Close modal on Escape
      if (event.key === 'Escape' && modalElement.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
      // Close mobile nav on Escape
      const navElement = document.querySelector('.nav');
      const toggleButton = document.querySelector('.nav-toggle');
      if (event.key === 'Escape' && navElement && navElement.classList.contains('open')) {
        navElement.classList.remove('open');
        if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
        if (toggleButton) toggleButton.focus();
      }
    });

    if (modalElement) modalElement.addEventListener('click', function (event) { if (event.target === modalElement) closeModal(); });

    // Smooth scroll for internal anchors (delegation)
    document.addEventListener('click', function (event) {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href.length > 1) {
        event.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    const testimonials = document.querySelectorAll('.testimonial');
    let testimonialIndex = 0;
    function showTestimonial(index) { testimonials.forEach((testimonial, idx) => testimonial.classList.toggle('active', idx === index)); }
    if (testimonials.length > 1) {
      let testimonialInterval = setInterval(() => { testimonialIndex = (testimonialIndex + 1) % testimonials.length; showTestimonial(testimonialIndex); }, 5000);
      testimonials.forEach(testimonial => { testimonial.addEventListener('mouseenter', () => clearInterval(testimonialInterval)); testimonial.addEventListener('mouseleave', () => testimonialInterval = setInterval(() => { testimonialIndex = (testimonialIndex + 1) % testimonials.length; showTestimonial(testimonialIndex); }, 5000)); });
    }

    const navElement = document.querySelector('.nav');
    const existingToggle = document.querySelector('.nav-toggle');
    let navigationToggle = existingToggle;
    if (!navigationToggle) {
      navigationToggle = document.createElement('button');
      navigationToggle.className = 'nav-toggle';
      navigationToggle.setAttribute('aria-expanded', 'false');
      navigationToggle.setAttribute('aria-label', 'Abrir menu');
      navigationToggle.setAttribute('aria-controls', 'main-nav');
      navigationToggle.innerHTML = '&#9776;';
      const headerInner = document.querySelector('.header-inner');
      if (headerInner) headerInner.insertBefore(navigationToggle, headerInner.firstChild);
    }

    navigationToggle.addEventListener('click', function () { const isOpen = this.getAttribute('aria-expanded') === 'true'; this.setAttribute('aria-expanded', String(!isOpen)); if (navElement) navElement.classList.toggle('open'); if (!isOpen && navElement) { const firstLink = navElement.querySelector('a'); if (firstLink) firstLink.focus(); } });
    if (navElement) navElement.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { navElement.classList.remove('open'); if (navigationToggle) navigationToggle.setAttribute('aria-expanded', 'false'); }));

    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => { if (window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); });
  });
