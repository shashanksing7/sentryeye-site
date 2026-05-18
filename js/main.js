document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('app-viewport');
  const navLinks = document.querySelectorAll('.nav-item');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- Core Routing Engine ---
  async function router() {
    let hash = window.location.hash.replace('#', '') || 'home';
    
    // 1. ADDED 'deleteaccount' TO THE VALID ROUTE WHITELIST
    const validPages = ['home', 'about', 'blog', 'contact', 'privacy', 'deleteaccount'];
    if (!validPages.includes(hash)) hash = 'home';

    try {
      // Fetches templates dynamically from the pages/ subdirectory
      const response = await fetch(`pages/${hash}.html`);
      if (!response.ok) throw new Error('Network error loading component view.');
      
      viewport.innerHTML = await response.text();
      window.scrollTo({ top: 0, behavior: 'instant' });
      updateActiveLinks(hash);
      
      // Initialize contextual page scripts
      if (hash === 'home') initHomeMockup();
      if (hash === 'contact') initContactForm();
    } catch (err) {
      viewport.innerHTML = `<section class="container"><p class="mono text-center" style="padding: 4rem 0; color: var(--red);">[Error 404]: Failed to compile edge view block.</p></section>`;
    }
  }

  function updateActiveLinks(activeHash) {
    navLinks.forEach(link => {
      if (link.getAttribute('data-target') === activeHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Mobile Navigation Handlers ---
  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  // --- Feature Initializers ---
  function initHomeMockup() {
    document.querySelectorAll('.app-nav-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.app-nav-item').forEach(n => n.classList.remove('selected'));
        item.classList.add('selected');
        
        const heading = document.querySelector('.app-hero-heading');
        const sub = document.querySelector('.app-hero-sub');
        const label = document.querySelector('.app-hero-label');
        if (!heading || !sub || !label) return;

        if (index === 0) {
          label.textContent = '// DEVICE STATUS';
          heading.innerHTML = 'Your phone is<br><span class="status-word">protected</span>';
          sub.innerHTML = 'Intruder detection active.<br>Any unauthorized access will be captured.';
        } else if (index === 1) {
          label.textContent = '// ALERT HISTORY';
          heading.innerHTML = '<span style="font-size:1rem;line-height:1.4;display:block;">2 events<br><span style="color:var(--red);font-size:0.9rem;">logged today</span></span>';
          sub.innerHTML = 'Failed PIN ×3 at 09:14 AM.<br>Front camera capture saved locally.';
        } else {
          label.textContent = '// PROFILE';
          heading.innerHTML = '<span style="font-size:1rem;line-height:1.5;display:block;">user@<br><span style="color:var(--violet)">sentryeye.dev</span></span>';
          sub.innerHTML = 'Premium · Google Drive sync enabled.<br>Local encryption active.';
        }
      });
    });
  }

  function initContactForm() {
    const formBtn = document.querySelector('#contact-form .btn');
    if (!formBtn) return;

    formBtn.addEventListener('click', () => {
      const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--red)';
          setTimeout(() => input.style.borderColor = '', 1800);
        }
      });

      if (!isValid) return;

      formBtn.style.display = 'none';
      document.getElementById('form-success').classList.add('show');
      inputs.forEach(i => { i.value = ''; i.disabled = true; });

      setTimeout(() => {
        document.getElementById('form-success').classList.remove('show');
        formBtn.style.display = '';
        inputs.forEach(i => { i.disabled = false; });
      }, 5000);
    });
  }

  // --- Event Bindings ---
  document.querySelectorAll('[data-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const target = trigger.getAttribute('data-target');
      window.location.hash = target;
      closeMenu();
      e.preventDefault();
    });
  });

  hamburger.addEventListener('click', toggleMenu);
  window.addEventListener('hashchange', router);
  router(); // Boot router load
});