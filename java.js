// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// State
let isMenuOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupScrollEffects();
    setupIntersectionObserver();
    initializeLucideIcons();
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking links
    const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Modal close button
    const modalCloseBtn = document.querySelector('[onclick="closeModal()"]');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close modal on background click
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal && !successModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
    
    updateMobileMenuIcon();
}

function closeMobileMenu() {
    isMenuOpen = false;
    
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
    
    updateMobileMenuIcon();
}

function updateMobileMenuIcon() {
    if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (isMenuOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        }
    }
}

// Scroll Effects
function setupScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        updateActiveNavigation();
    });
}

function handleHeaderScroll() {
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

function updateActiveNavigation() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        // Set initial state
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(section);
    });

    // Observe cards
    const cards = document.querySelectorAll('.card, .news-item, .contact-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(card);
    });
}

function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

// Contact Form Handler
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    if (!validateContactForm(data)) {
        return;
    }
    
    // Simulate form submission
    submitContactForm(data);
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nama harus diisi minimal 2 karakter');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Email tidak valid');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Subjek harus diisi minimal 3 karakter');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Pesan harus diisi minimal 10 karakter');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormErrors(errors) {
    // Create error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    errorNotification.innerHTML = `
        <div class="flex items-start">
            <i data-lucide="alert-circle" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"></i>
            <div>
                <h4 class="font-semibold mb-1">Error</h4>
                <ul class="text-sm">
                    ${errors.map(error => `<li>• ${error}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorNotification);
    lucide.createIcons();
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        errorNotification.remove();
    }, 5000);
}

async function submitContactForm(data) {
    try {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (in real app, send to server)
        console.log('Contact form submitted:', data);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showFormErrors(['Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.']);
    } finally {
        // Reset button state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Kirim Pesan';
        submitBtn.disabled = false;
    }
}

function showSuccessModal() {
    if (successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('show');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (successModal) {
        successModal.classList.remove('show');
        successModal.classList.add('hidden');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Navigation Functions
function handleAnchorClick(e) {
    const href = e.target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// WhatsApp Functions
function openWhatsApp() {
    const phoneNumber = '6282189608134';
    const message = 'Halo, saya ingin bertanya mengenai kegiatan gereja.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Track WhatsApp click (in real app, send to analytics)
    console.log('WhatsApp clicked');
}


// Live Stream Functions
function openLiveStream() {
    const liveStreamUrl = 'https://youtube.com/live/Lj2nLATiYb4?feature=share';
    window.open(liveStreamUrl, 'GPIB Pasar Minggu');
    
    // Track live stream click (in real app, send to analytics)
    console.log('Live stream clicked');
}

// Content Functions
function readMore(articleId) {
    // In real app, navigate to full article
    console.log('Reading article:', articleId);
    
    // Show temporary notification
    showNotification('Artikel lengkap akan segera tersedia!', 'info');
}

function playVideo() {
    const videoUrl = 'https://youtube.com/watch?v=example';
    window.open(videoUrl, '_blank');
    
    console.log('Video player opened');
}

function playAudio() {
    const audioUrl = 'https://example.com/audio.mp3';
    window.open(audioUrl, '_blank');
    
    console.log('Audio player opened');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                    type === 'error' ? 'bg-red-500' : 
                    type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    
    notification.className = `fixed top-20 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in-right`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-5 h-5 mr-2"></i>
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slide-out-right 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Social Media Functions
function openSocialMedia(platform) {
    const urls = {
        facebook: 'https://facebook.com/gpibsejahtera',
        instagram: 'https://instagram.com/gpibsejahtera',
        youtube: 'https://youtube.com/@gpibpasarminggu1519',
        twitter: 'https://twitter.com/gpibsejahtera'
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
        console.log(`${platform} opened`);
    }
}

// Gallery Functions
function openGallery(imageIndex) {
    // In real app, open lightbox or modal with full-size image
    console.log('Galery', imageIndex);
    showNotification('Galeri foto akan segera tersedia!', 'info');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Analytics Functions (in real app)
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    
    // In real app, send to analytics service
    // gtag('event', eventName, properties);
}

function trackPageView(pageName) {
    console.log('Page view tracked:', pageName);
    
    // In real app, send to analytics service
    // gtag('config', 'GA_MEASUREMENT_ID', { page_path: pageName });
}

// Performance Monitoring
function measurePageLoad() {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log('Page load time:', loadTime.toFixed(2), 'ms');
        
        // Track performance (in real app)
        trackEvent('page_load_complete', { load_time: loadTime });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Track errors (in real app)
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

// Initialize performance monitoring
measurePageLoad();

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Re-initialize icons when dynamic content is loaded
function reinitializeIcons() {
    setTimeout(() => {
        initializeLucideIcons();
    }, 100);
}

// Export functions for global access
window.openWhatsApp = openWhatsApp;
window.openLiveStream = openLiveStream;
window.readMore = readMore;
window.playVideo = playVideo;
window.playAudio = playAudio;
window.closeModal = closeModal;
window.openSocialMedia = openSocialMedia;
window.openGallery = openGallery;

// Add slide-out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-out-right {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);