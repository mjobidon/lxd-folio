// Main JavaScript for eLearning Portfolio
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();

  // Load user configuration
  const config = window.userConfig || {
    name: "Senior eLearning Developer",
    title: "LMS Administrator & Course Developer", 
    email: "contact@example.com"
  };

  // Populate user information
  populateUserInfo(config);
  
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Initialize scroll animations
  initializeScrollAnimations();
  
  // Initialize demo interactions
  initializeDemoInteractions();
  
  // Initialize contact form
  initializeContactForm();
});

function populateUserInfo(config) {
  // Update navigation
  const navName = document.getElementById('nav-name');
  if (navName) navName.textContent = config.name;
  
  // Update hero section
  const heroName = document.getElementById('hero-name');
  const heroTitle = document.getElementById('hero-title');
  if (heroName) heroName.textContent = config.name;
  if (heroTitle) heroTitle.textContent = config.title;
  
  // Contact button already has href="#contact" for scrolling to contact section
  
  // Update footer
  const footerName = document.getElementById('footer-name');
  const footerEmail = document.getElementById('footer-email');
  if (footerName) footerName.textContent = config.name;
  if (footerEmail && config.email) {
    footerEmail.href = `mailto:${config.email}`;
  }
}

function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      if (mobileMenu) {
        mobileMenu.classList.toggle('active');
      }
    });
  }
}

function initializeScrollAnimations() {
  // Animate skill bars when they come into view
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBars = entry.target.querySelectorAll('.skill-item .bg-blue-600, .skill-item .bg-green-600, .skill-item .bg-purple-600, .skill-item .bg-orange-600');
        
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            const width = bar.style.width || bar.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '0%';
            bar.style.width = width;
          }, index * 200);
        });
      }
    });
  }, observerOptions);

  // Observe skills section
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Animate metrics
  const metricsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const metrics = entry.target.querySelectorAll('.metric-item');
        metrics.forEach((metric, index) => {
          setTimeout(() => {
            metric.style.opacity = '1';
          }, index * 200);
        });
      }
    });
  }, observerOptions);

  const lmsSection = document.getElementById('lms-admin');
  if (lmsSection) {
    metricsObserver.observe(lmsSection);
  }
}

function initializeDemoInteractions() {
  const demoCards = document.querySelectorAll('.demo-card');
  
  demoCards.forEach((card, index) => {
    const button = card.querySelector('button');
    const demoContainer = card.querySelector('.demo-container');
    
    if (button) {
      button.addEventListener('click', function() {
        // In a real implementation, this would open the actual demo
        // For now, we'll show a modal or redirect to demo URL
        showDemoModal(index);
      });
    }
    
    if (demoContainer) {
      demoContainer.addEventListener('click', function() {
        showDemoModal(index);
      });
    }
  });
}

function showDemoModal(demoIndex) {
  const demoTitles = [
    'Interactive Compliance Training',
    'Mobile-First Microlearning',
    'Gamified Safety Assessment'
  ];
  
  const demoDescriptions = [
    'This interactive training module features branching scenarios, multimedia content, and comprehensive assessments. Built with Articulate Storyline 360 and optimized for SCORM 1.2 delivery.',
    'A responsive microlearning series designed for mobile-first consumption. Features offline capability, progress tracking, and bite-sized content modules.',
    'An engaging quiz game with leaderboards, achievement badges, and real-time scoring. Built with H5P and custom JavaScript interactions.'
  ];
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-xl max-w-2xl w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold text-gray-900">${demoTitles[demoIndex]}</h3>
        <button class="close-modal text-gray-500 hover:text-gray-700">
          <i data-lucide="x" class="h-6 w-6"></i>
        </button>
      </div>
      <p class="text-gray-600 mb-6">${demoDescriptions[demoIndex]}</p>
      <div class="bg-gray-100 rounded-lg p-8 text-center mb-6">
        <i data-lucide="play-circle" class="h-16 w-16 text-blue-600 mx-auto mb-4"></i>
        <p class="text-gray-600">Demo would launch here in full implementation</p>
        <p class="text-sm text-gray-500 mt-2">Requires actual demo files to be hosted</p>
      </div>
      <div class="flex justify-end gap-4">
        <button class="close-modal px-4 py-2 text-gray-600 hover:text-gray-800">
          Close
        </button>
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Request Full Demo
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  lucide.createIcons();
  
  // Close modal functionality
  const closeButtons = modal.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  });
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function initializeContactForm() {
  const contactForm = document.querySelector('#contact form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Show success message (in real implementation, this would submit to a server)
      showSuccessMessage();
    });
  }
}

function showSuccessMessage() {
  const successModal = document.createElement('div');
  successModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  successModal.innerHTML = `
    <div class="bg-white rounded-xl max-w-md w-full p-6 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i data-lucide="check" class="h-8 w-8 text-green-600"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
      <p class="text-gray-600 mb-4">Thank you for your interest. I'll get back to you within 24 hours.</p>
      <button class="close-success px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Close
      </button>
    </div>
  `;
  
  document.body.appendChild(successModal);
  lucide.createIcons();
  
  const closeButton = successModal.querySelector('.close-success');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(successModal);
  });
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    if (document.body.contains(successModal)) {
      document.body.removeChild(successModal);
    }
  }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});