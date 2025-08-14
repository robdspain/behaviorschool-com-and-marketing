/**
 * ClassroomPilot Landing Page JavaScript
 * Handles form submission, animations, and interactive features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Form handling
    initFormHandling();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Add interactive hover effects
    initInteractiveEffects();
    
    // Initialize accessibility features
    initAccessibility();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
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
                const headerHeight = document.querySelector('.header').offsetHeight;
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

/**
 * Handle form submission
 */
function initFormHandling() {
    const form = document.querySelector('form[name="waitlist"]');
    
    if (form) {
        // Add loading state styles
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
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 4px solid rgba(37, 99, 235, 0.2);
                border-top-color: #2563eb;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .form-success {
                background: #10b981;
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                text-align: center;
                animation: slideIn 0.3s ease-out;
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
        
        form.addEventListener('submit', async function(e) {
            // Note: For Netlify Forms, we'll let the default submission happen
            // but add some UX improvements
            
            // Add loading state
            form.classList.add('form-loading');
            
            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            // For local testing without Netlify, prevent default and show success
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                e.preventDefault();
                
                // Simulate submission delay
                setTimeout(() => {
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.innerHTML = `
                        <h3>Thank you for joining the waitlist!</h3>
                        <p>We'll be in touch soon with updates about ClassroomPilot.</p>
                    `;
                    
                    form.parentElement.replaceChild(successMsg, form);
                    
                    // Store in localStorage for demo purposes
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
                    waitlist.push({...data, timestamp: new Date().toISOString()});
                    localStorage.setItem('waitlist', JSON.stringify(waitlist));
                    
                    console.log('Form submitted (local):', data);
                }, 1000);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    }
}

/**
 * Validate individual input
 */
function validateInput(input) {
    const isValid = input.checkValidity();
    
    if (!isValid) {
        input.classList.add('error');
        
        // Add or update error message
        let errorMsg = input.nextElementSibling;
        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
        }
        
        if (input.type === 'email') {
            errorMsg.textContent = 'Please enter a valid email address';
        } else if (input.value.trim() === '') {
            errorMsg.textContent = 'This field is required';
        }
        
        input.style.borderColor = '#ef4444';
    } else {
        input.classList.remove('error');
        input.style.borderColor = '';
        
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }
    
    return isValid;
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const elements = document.querySelectorAll('.card, .section > h2');
    elements.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        
        observer.observe(el);
    });
}

/**
 * Add interactive effects
 */
function initInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
            `;
            
            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            
            if (!document.querySelector('style[data-ripple]')) {
                style.setAttribute('data-ripple', 'true');
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #2563eb;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 8px 0;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main has id
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Announce form submission status to screen readers
    const form = document.querySelector('form[name="waitlist"]');
    if (form) {
        const statusDiv = document.createElement('div');
        statusDiv.setAttribute('role', 'status');
        statusDiv.setAttribute('aria-live', 'polite');
        statusDiv.setAttribute('aria-atomic', 'true');
        statusDiv.className = 'sr-only';
        statusDiv.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        form.appendChild(statusDiv);
    }
}

/**
 * Performance monitoring
 */
if ('performance' in window && 'PerformanceObserver' in window) {
    // Log performance metrics
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(`Performance: ${entry.name} - ${entry.startTime.toFixed(2)}ms`);
        }
    });
    
    perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
}

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, app will still work online
        });
    });
}