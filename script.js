/**
 * Meghana Palagani — Portfolio Interactive Logic
 * Vanilla JavaScript (ES6+) for high performance and zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Mobile Menu Toggle & Navigation Accessibility
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (menuToggle && primaryNav) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !primaryNav.classList.contains('open');
      primaryNav.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (primaryNav.classList.contains('open') && !primaryNav.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        toggleMenu(false);
        menuToggle.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Active Section Highlighting on Scroll
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // -------------------------------------------------------------------------
  // 3. Scroll Reveal Animations
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.section-kicker, .hero-copy, .hero-visual, .about-grid, .edu-card, .skill-category-card, .project-card, .exp-item, .cert-card, .contact-card'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // -------------------------------------------------------------------------
  // 4. One-Click Copy Email to Clipboard & Toast
  // -------------------------------------------------------------------------
  const copyHeroBtn = document.getElementById('copyEmailHeroBtn');
  const copyContactBtn = document.getElementById('copyEmailContactBtn');
  const toast = document.getElementById('toast');
  const EMAIL_ADDRESS = 'meghanapalagani02@gmail.com';

  let toastTimeout;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  };

  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(EMAIL_ADDRESS);
      } else {
        // Fallback for environments where navigator.clipboard is unavailable
        const tempInput = document.createElement('input');
        tempInput.value = EMAIL_ADDRESS;
        tempInput.setAttribute('readonly', '');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      showToast(`✓ Copied ${EMAIL_ADDRESS} to clipboard`);
    } catch (err) {
      showToast(`Email: ${EMAIL_ADDRESS}`);
    }
  };

  if (copyHeroBtn) copyHeroBtn.addEventListener('click', copyEmail);
  if (copyContactBtn) copyContactBtn.addEventListener('click', copyEmail);

  // -------------------------------------------------------------------------
  // 5. Skills Domain Filter Bar (Protected against rapid-click race conditions)
  // -------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        if (card._filterTimeout) {
          clearTimeout(card._filterTimeout);
          card._filterTimeout = null;
        }

        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card._filterTimeout = setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card._filterTimeout = null;
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          card._filterTimeout = setTimeout(() => {
            card.style.display = 'none';
            card._filterTimeout = null;
          }, 200);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. Project Architecture Deep-Dive Modals (Accessible Focus Management)
  // -------------------------------------------------------------------------
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalBadge = document.getElementById('modalBadge');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const detailsButtons = document.querySelectorAll('.details-btn');
  let lastFocusedElement = null;

  // Detailed technical modal data
  const projectDetails = {
    'llm-optimizer': {
      badge: 'GENAI SYSTEM ARCHITECTURE · SIMULATION',
      title: 'LLM / GPU Cost Optimizer — Technical Details',
      content: `
        <p><strong>Problem Statement:</strong> Deploying cutting-edge frontier LLMs for all application requests incurs unsustainable inference latency and API expenditure. A significant percentage of enterprise requests do not require multi-step reasoning.</p>
        
        <div class="modal-diagram-box">
User Prompt ──► [ Complexity Classifier ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Low Complexity ]          [ High Complexity ]
        │                           │
  Llama 3 8B / SLM             Frontier LLM
        │                           │
        └─────────────┬─────────────┘
                      ▼
        [ KV Prompt-Cache Lookup ] ──► (Hit: 0 GPU compute / Miss: Generate)
                      ▼
               Output Response
        </div>

        <h4>Architectural Pillars</h4>
        <ul>
          <li><strong>Dynamic Classification Router:</strong> Analyzes token length, perplexity hints, and syntactic complexity to dispatch tasks to appropriate model tiers.</li>
          <li><strong>KV Prompt-Cache Hit Simulation:</strong> Simulates key-value prefix caching on repetitive instructions, measuring virtual cost savings of up to 40-60%.</li>
          <li><strong>Telemetry & Cost Dashboard:</strong> Evaluates simulated throughput (tokens/sec) versus dollar cost per million tokens.</li>
        </ul>
        <p><em>Prototype Status: Algorithmic simulation and routing architecture concept. Production benchmarks to follow.</em></p>
      `
    },
    'quantum-mfg': {
      badge: 'INDUSTRY 4.0 · QUANTUM COMPUTING PROTOTYPE',
      title: 'Quantum Demand Forecasting & QAOA Optimization (UC-062)',
      content: `
        <p><strong>Theme:</strong> Manufacturing & Industry 4.0 (UC-062). Addressing production planning under demand uncertainty and operational bottleneck constraints.</p>
        
        <div class="modal-diagram-box">
Historical Demand Data
         │
    [ Preprocessing & Feature Engineering ]
         │
    [ Classical ML (RF/XGBoost) vs. Quantum ML (Qiskit VQR) ]
         │
    Predicted 6-Week Demand
         │
    [ Manufacturing Constraints: Capacity, Inventory, Penalties ]
         │
    [ QUBO Formulation: Minimize (Production Cost + Stockout Risk) ]
         │
    [ QAOA Heuristic Optimization via Qiskit / Classical Sim ]
         │
    Optimal Production & Procurement Schedule (Streamlit Dashboard)
        </div>

        <h4>Key Methodological Steps</h4>
        <ul>
          <li><strong>Time-Series Demand Modeling:</strong> Compared Linear Regression, Random Forest, and Qiskit Variational Quantum Regressor (VQR) on MAE, RMSE, and R².</li>
          <li><strong>Constraint Matrix Formulation:</strong> Formulated machine capacity, labor limits, and stockout penalty constraints into a Quadratic Unconstrained Binary Optimization (QUBO) mathematical model.</li>
          <li><strong>QAOA Optimization:</strong> Tested Quantum Approximate Optimization Algorithm heuristics against classical integer programming benchmarks.</li>
          <li><strong>Streamlit Dashboard:</strong> Interactive visual interface for factory operators to inspect schedules, capacity utilization, and cost breakdowns.</li>
        </ul>
        <p><em>Integrity Note: Quantum section uses classical simulation for fast prototyping without claiming unverified physical quantum advantage.</em></p>
      `
    },
    'followthru': {
      badge: 'NLP & WORKFLOW AUTOMATION · SYSTEM PROTOTYPE',
      title: 'FollowThru: Meeting Accountability Engine',
      content: `
        <p><strong>Problem Statement:</strong> Crucial tasks assigned during recurring meetings often disappear because minutes are stored across disconnected notes without unified action tracking.</p>

        <div class="modal-diagram-box">
Meeting Transcripts / Notes (Series)
               │
    [ Entity & Action Item Extraction ]
               │
    [ Fuzzy Deduplication Across Meetings ]
         (Recognizes rephrased recurring tasks)
               │
    [ Status Evaluation: Done / Pending / Overdue ]
               │
    [ Chronic Slippage Detector ] ──► (Flagged if postponed > 1x)
               │
    ┌──────────┴──────────┐
    ▼                     ▼
[ Manager View ]    [ Job Holder View ]
(Team Workload)     (Tasks + Reliability Score)
        </div>

        <h4>Core Innovations</h4>
        <ul>
          <li><strong>Cross-Meeting Deduplication:</strong> Semantic similarity clustering prevents duplicate task creation when updates are worded differently in consecutive sessions.</li>
          <li><strong>Chronic Slippage Detection:</strong> Automatically flags tasks whose deadlines have been pushed back multiple times without completion.</li>
          <li><strong>Reliability Score Metric:</strong> Objective mathematical score based on on-time completion rates, helping managers balance workload distribution.</li>
        </ul>
        <p><em>Prototype Status: Functional specification and core NLP pipeline prototype.</em></p>
      `
    },
    'resqai': {
      badge: 'SMART INDIA HACKATHON 2026 · IDEA SUBMISSION',
      title: 'ResQAI: Multi-Hazard Disaster Intelligence & Response',
      content: `
        <p><strong>Theme:</strong> Disaster Management | SIH 2026 Submission representing Dr. RVR NRI Institute of Technology Deemed to be University.</p>

        <div class="modal-diagram-box">
Multi-Source Feeds: Weather API + IoT Sensors + Satellite / Drone Feeds
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[ ML Hazard Risk Scoring ]         [ CV Damage Assessment ]
(Flood, Cyclone, Quake)            (Structural damage from photos)
       │                                       │
       └───────────────────┬───────────────────┘
                           ▼
          [ Decision-Support AI Response Agent ]
                           │
          [ Dynamic Route & Resource Optimization ]
                           │
          [ Unified Command & Control Dashboard ]
        </div>

        <h4>Proposed Capabilities</h4>
        <ul>
          <li><strong>Multi-Hazard Predictive Analytics:</strong> Aggregates historical incident logs and live meteorological parameters to calculate zone-by-zone vulnerability scores.</li>
          <li><strong>Computer Vision Damage Screening:</strong> Identifies visible damage on key infrastructure (bridges, roads, shelters) from reconnaissance imagery.</li>
          <li><strong>Safer Evacuation & Resource Routing:</strong> Recommends logistical delivery paths avoiding active inundation zones.</li>
        </ul>
        <p><em>Submission Status: Comprehensive concept paper and architectural specification prepared for SIH 2026.</em></p>
      `
    }
  };

  const openModal = (key, triggerBtn) => {
    const data = projectDetails[key];
    if (!data || !modal || !modalBody || !modalBadge) return;

    lastFocusedElement = triggerBtn || document.activeElement;
    modalBadge.textContent = data.badge;
    modalBody.innerHTML = `<h3>${data.title}</h3>${data.content}`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Restore focus to original trigger element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  detailsButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      openModal(modalKey, btn);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Keyboard navigation & Esc to close modal
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    // Trap focus inside modal
    if (e.key === 'Tab') {
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });
});
