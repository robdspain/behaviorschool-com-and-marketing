// BehaviorPilot Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form submission handling (for demo purposes when not using Netlify)
    const form = document.querySelector('form[name="waitlist"]');
    if (form) {
        // Check if we're in a Netlify environment
        const isNetlify = window.location.hostname.includes('netlify');
        
        if (!isNetlify) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    if (key !== 'bot-field' && key !== 'form-name') {
                        data[key] = value;
                    }
                });
                
                // Simulate form submission
                console.log('Form submitted with data:', data);
                
                // Show success message
                showFormSuccess();
                
                // Reset form
                form.reset();
            });
        }
    }
    
    // Show success message after form submission
    function showFormSuccess() {
        const formSection = document.getElementById('waitlist');
        if (formSection) {
            // Create success message
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
                <div style="background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;">
                    <strong>Thank you for joining the waitlist!</strong>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">We'll be in touch soon with updates about BehaviorPilot.</p>
                </div>
            `;
            
            // Insert after form
            form.parentNode.insertBefore(successDiv, form.nextSibling);
            
            // Hide form
            form.style.display = 'none';
            
            // Remove success message after 5 seconds and show form again
            setTimeout(() => {
                successDiv.remove();
                form.style.display = 'flex';
            }, 5000);
        }
    }
    
    // Add scroll-based header styling
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 10) {
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Hide/show header on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Add header transition
    if (header) {
        header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    }
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const animatedElements = document.querySelectorAll('.card, .section > h2');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Form field validation
    const inputs = document.querySelectorAll('.input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else if (this.type === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '#10b981';
                }
            } else if (this.value) {
                this.style.borderColor = '#10b981';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
        });
    });
    
    // Add loading state to buttons
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn && !window.location.hostname.includes('netlify')) {
        const originalText = submitBtn.textContent;
        
        form.addEventListener('submit', function() {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }, 2000);
        });
    }
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Press '/' to focus on first navigation link
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const firstNavLink = document.querySelector('.nav a');
            if (firstNavLink && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                firstNavLink.focus();
            }
        }
        
        // Press 'Escape' to unfocus current element
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    });
    
    // Performance: Lazy load images if any exist
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Add print functionality
    const printButton = document.createElement('button');
    printButton.innerHTML = '🖨️';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: white;
        border: 2px solid #e5e7eb;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // Show print button when scrolled down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            printButton.style.display = 'flex';
        } else {
            printButton.style.display = 'none';
        }
    });
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
    
    document.body.appendChild(printButton);
    
    // Console easter egg
    console.log('%c🚀 Welcome to BehaviorPilot!', 'font-size: 20px; color: #2563eb; font-weight: bold;');
    console.log('%cBuilding the future of behavior analysis in schools.', 'font-size: 14px; color: #6b7280;');
    
});