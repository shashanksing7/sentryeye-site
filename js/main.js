document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('app-viewport');
  const navLinks = document.querySelectorAll('.nav-item');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- Core Routing Engine ---
  async function router() {
    // Gracefully clean hash strings and default to home view context
    let hash = window.location.hash.replace('#', '') || 'home';
    
    // Explicitly handle inner-anchor routing adjustments (e.g., matching sections inside privacy)
    if (hash.includes('pp-')) {
      hash = 'privacy';
    }

    const validPages = ['home', 'about', 'blog', 'contact', 'privacy'];
    if (!validPages.includes(hash)) hash = 'home';

    try {
      // Force a purely relative call context to protect subdirectory hosting allocations
      const response = await fetch(`pages/${hash}.html`);
      if (!response.ok) throw new Error(`[HTTP ${response.status}]: Failed to fetch view chunk.`);
      
      const content = await response.text();
      viewport.innerHTML = content;
      
      // Reset view context container to top elevation
      window.scrollTo({ top: 0, behavior: 'instant' });
      updateActiveLinks(hash);
      
      // Safe context initializations
      if (hash === 'home') initHomeMockup();
      if (hash === 'contact') initContactForm();
    } catch (err) {
      console.error("Routing Engine Fault:", err);
      viewport.innerHTML = `
        <section class="container">
          <p class="mono text-center" style="padding: 6rem 0; color: var(--red);">
            [Error 404]: Failed to compile edge view block.<br>
            <span style="color: var(--muted); font-size: 0.8rem;">Target segment: pages/${hash}.html</span>
          </p>
        </section>
      `;
    }
  }

  function updateActiveLinks(activeHash) {
    // Synchronize both standard layout links and responsive drawer menu contexts
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const target = link.getAttribute('data-target') || link.getAttribute('href')?.replace('#', '');
      if (target === activeHash) {
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
    const navItems = document.querySelectorAll('.app-nav-item');
    if (!navItems.length) return;

    navItems.forEach((item, index) => {
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

    formBtn.addEventListener('click', (e) => {
      e.preventDefault();
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
      const successBanner = document.getElementById('form-success');
      if (successBanner) successBanner.classList.add('show');
      
      inputs.forEach(i => { i.value = ''; i.disabled = true; });

      setTimeout(() => {
        if (successBanner) successBanner.classList.remove('show');
        formBtn.style.display = '';
        inputs.forEach(i => { i.disabled = false; });
      }, 5000);
    });
  }

  // --- Unified Action Bindings ---
  // Intercept nav links cleanly while guaranteeing hash mutation completes smoothly
  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('.nav-links a, .mobile-menu a, .nav-logo');
    if (!targetLink) return;

    const targetView = targetLink.getAttribute('data-target') || targetLink.getAttribute('href')?.replace('#', '');
    if (targetView && !targetView.startsWith('http') && !targetView.includes('pp-')) {
      e.preventDefault();
      closeMenu();
      
      // Only mutate if state change is novel to prevent redundant history stack loops
      if (window.location.hash !== `#${targetView}`) {
        window.location.hash = targetView;
      } else {
        router(); // Explicit force reload if clicking active tab context
      }
    }
  });

  hamburger.addEventListener('click', toggleMenu);
  window.addEventListener('hashchange', router);
  
  // Execution Core Initialization
  router();
});