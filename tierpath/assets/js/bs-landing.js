// TierPath Landing Page JavaScript
// Handles form submissions, smooth scrolling, and interactive elements

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all modules
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    initNavHighlight();
    initAccessibility();
    
  });

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Calculate offset for sticky header
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
          
          // Set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  // Form handling with validation and feedback
  function initFormHandling() {
    const form = document.querySelector('form[name="waitlist"]');
    
    if (!form) return;
    
    // Add loading state styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      .form-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.6;
      }
      
      .form-loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        margin: -15px 0 0 -15px;
        border: 3px solid var(--primary);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .form-success,
      .form-error {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-md);
        text-align: center;
        animation: slideIn 0.3s ease-out;
      }
      
      .form-success {
        background-color: #10B98120;
        color: #059669;
        border: 1px solid #10B981;
      }
      
      .form-error {
        background-color: #EF444420;
        color: #DC2626;
        border: 1px solid #EF4444;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Enhanced form validation
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Remove any existing messages
      const existingMessage = form.querySelector('.form-success, .form-error');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      // Validate form
      const email = form.querySelector('input[type="email"]').value;
      const name = form.querySelector('input[name="name"]').value;
      
      if (!validateEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
      }
      
      if (name.length < 2) {
        showFormMessage(form, 'Please enter your full name.', 'error');
        return;
      }
      
      // Add loading state
      form.classList.add('form-loading');
      
      // Simulate form submission (in production, this would be an actual API call)
      // For Netlify forms, we'll use the actual form submission
      const formData = new FormData(form);
      
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(response => {
        form.classList.remove('form-loading');
        
        if (response.ok) {
          showFormMessage(form, '🎉 Success! You\'re on the waitlist. We\'ll be in touch soon!', 'success');
          form.reset();
          
          // Track conversion if analytics is available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
              'event_category': 'engagement',
              'event_label': 'waitlist_signup',
              'value': 1
            });
          }
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(error => {
        form.classList.remove('form-loading');
        showFormMessage(form, 'Something went wrong. Please try again or email us directly.', 'error');
        console.error('Form submission error:', error);
      });
    });
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(this);
      });
      
      input.addEventListener('input', function() {
        // Remove error state when user starts typing
        this.classList.remove('input-error');
      });
    });
  }
  
  // Email validation helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Input validation helper
  function validateInput(input) {
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('input-error');
      return false;
    }
    
    if (input.type === 'email' && !validateEmail(input.value)) {
      input.classList.add('input-error');
      return false;
    }
    
    input.classList.remove('input-error');
    return true;
  }
  
  // Show form message helper
  function showFormMessage(form, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    form.appendChild(messageDiv);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      messageDiv.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
  }

  // Intersection Observer for scroll animations
  function initAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll('.card, .badge, .section h2');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      observer.observe(element);
    });
  }

  // Active navigation highlighting based on scroll position
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function highlightNav() {
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    // Throttle scroll event for performance
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(highlightNav);
        ticking = true;
        setTimeout(() => ticking = false, 100);
      }
    }
    
    window.addEventListener('scroll', requestTick);
  }

  // Accessibility improvements
  function initAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          // If card has a link, click it
          const link = this.querySelector('a');
          if (link) {
            link.click();
          }
        }
      });
    });
    
    // Escape key closes any open modals or resets focus
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Remove any form messages
        const messages = document.querySelectorAll('.form-success, .form-error');
        messages.forEach(msg => msg.remove());
        
        // Reset focus to body
        document.body.focus();
      }
    });
    
    // Announce page changes for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);
    
    // Update announcer on navigation
    window.addEventListener('hashchange', function() {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const section = document.getElementById(hash);
        if (section) {
          const heading = section.querySelector('h1, h2, h3');
          if (heading) {
            announcer.textContent = `Navigated to ${heading.textContent}`;
          }
        }
      }
    });
  }

  // Performance monitoring (optional)
  if ('performance' in window && 'PerformanceObserver' in window) {
    // Log performance metrics
    try {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Log to console in development
          if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Performance:', entry.name, entry.startTime.toFixed(2) + 'ms');
          }
        }
      });
      
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // Silently fail if Performance Observer is not supported
    }
  }

  // Add some interactive Easter eggs
  let clickCount = 0;
  const logo = document.querySelector('.brand-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
      clickCount++;
      if (clickCount === 5) {
        this.style.animation = 'spin 1s ease-in-out';
        setTimeout(() => {
          this.style.animation = '';
          clickCount = 0;
        }, 1000);
      }
    });
  }

})();