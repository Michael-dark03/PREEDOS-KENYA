// Show active section and update navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Update active link in navigation
    document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}` || 
            link.getAttribute('href') === `index.html#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update URL hash
    window.history.pushState(null, null, `#${sectionId}`);
    
    // Close mobile menu if open
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        toggleMenu();
    }
}

// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuButton = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu) {
        // Toggle active class on nav-menu
        navMenu.classList.toggle('active');
        
        // Toggle body scroll
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        
        // Toggle menu icon between hamburger and close
        if (menuButton) {
            const icon = menuButton.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

// Close mobile menu when a nav link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        const menuButton = document.querySelector('.mobile-menu-toggle');
        
        if (window.innerWidth <= 992) { // Only for mobile
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            if (menuButton) {
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Handle quote form submission
function handleQuoteSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formObject);
    
    // Show success message
    alert('Thank you for your inquiry! We will get back to you soon.');
    
    // Reset form
    event.target.reset();
}

// Back to top button functionality
function setupBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '&uarr;';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    toggleBackToTop();
    
    // Add scroll event listener
    window.addEventListener('scroll', toggleBackToTop);
}

// Update active navigation based on scroll position
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` || 
                    link.getAttribute('href') === `index.html#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scroll for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only handle internal anchor links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 120; // Height of header + navigation
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    window.history.pushState(null, null, targetId);
                    
                    // Update active section
                    showSection(targetId.substring(1));
                }
            }
        });
    });
}

// Process Tabs Functionality
function initProcessTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.process-tab-content');
    let touchStartX = 0;
    let touchEndX = 0;

    // Function to handle touch events for swipe
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance (in pixels)
        const currentTab = document.querySelector('.tab-btn.active');
        let nextTab;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - go to next tab
            nextTab = currentTab.nextElementSibling || tabBtns[0];
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - go to previous tab
            nextTab = currentTab.previousElementSibling || tabBtns[tabBtns.length - 1];
        }

        if (nextTab) {
            const tabId = nextTab.getAttribute('data-tab');
            switchTab(tabId);
            // Smooth scroll to ensure the tab is visible on mobile
            nextTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    // Function to switch tabs
    function switchTab(tabId) {
        if (!tabId) return;
        
        // Update active tab button
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });
        
        // Show active tab content
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Refresh AOS for new content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Set up tab switching with keyboard navigation
    tabBtns.forEach((btn, index) => {
        // Click/tap event
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });

        // Keyboard navigation
        btn.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    const nextBtn = tabBtns[index + 1] || tabBtns[0];
                    nextBtn.focus();
                    switchTab(nextBtn.getAttribute('data-tab'));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevBtn = tabBtns[index - 1] || tabBtns[tabBtns.length - 1];
                    prevBtn.focus();
                    switchTab(prevBtn.getAttribute('data-tab'));
                    break;
                case 'Home':
                    e.preventDefault();
                    tabBtns[0].focus();
                    switchTab(tabBtns[0].getAttribute('data-tab'));
                    break;
                case 'End':
                    e.preventDefault();
                    const lastTab = tabBtns[tabBtns.length - 1];
                    lastTab.focus();
                    switchTab(lastTab.getAttribute('data-tab'));
                    break;
            }
        });
    });

    // Add touch event listeners for swipe navigation
    const processContent = document.querySelector('.process-content');
    if (processContent) {
        processContent.addEventListener('touchstart', handleTouchStart, { passive: true });
        processContent.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Initialize with first tab active if none is active
    const activeTabs = document.querySelector('.process-tab-content.active');
    if (!activeTabs && tabBtns.length > 0) {
        const firstTabId = tabBtns[0].getAttribute('data-tab');
        tabBtns[0].setAttribute('aria-selected', 'true');
        switchTab(firstTabId);
    }
}

// FAQ Accordion Functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length === 0) return;
    
    // Set initial state
    faqQuestions[0].setAttribute('aria-expanded', 'true');
    const firstAnswer = document.getElementById(faqQuestions[0].getAttribute('aria-controls'));
    if (firstAnswer) {
        firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        firstAnswer.style.paddingTop = '0.5rem';
    }
    
    // Add click event listeners
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other questions
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    const answer = document.getElementById(q.getAttribute('aria-controls'));
                    if (answer) {
                        answer.style.maxHeight = '0';
                        answer.style.paddingTop = '0';
                    }
                }
            });
            
            // Toggle current question
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                const answer = document.getElementById(question.getAttribute('aria-controls'));
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.paddingTop = '0.5rem';
                }
            } else {
                question.setAttribute('aria-expanded', 'false');
                const answer = document.getElementById(question.getAttribute('aria-controls'));
                if (answer) {
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0';
                }
            }
        });
    });
}

// Handle Quote Form Submission
function handleQuoteForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    // Basic form validation
    const requiredFields = ['name', 'email', 'phone', 'project-type', 'floors', 'capacity', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!formValues[field]) {
            isValid = false;
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                errorMessage.style.color = '#ef4444';
                errorMessage.style.fontSize = '0.8rem';
                errorMessage.style.marginTop = '0.25rem';
                
                // Only add error message if it doesn't exist
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            }
        } else {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.remove('error');
                const errorMessage = input.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            }
            
            // Email validation
            if (field === 'email' && !isValidEmail(formValues[field])) {
                isValid = false;
                const input = form.querySelector('[name="email"]');
                input.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.color = '#ef4444';
                errorMessage.style.fontSize = '0.8rem';
                errorMessage.style.marginTop = '0.25rem';
                
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            }
        }
    });
    
    if (!isValid) {
        // Scroll to the first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // If form is valid, show success message
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="background: #d1fae5; color: #065f46; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <i class="fas fa-check-circle"></i>
                <strong>Thank you for your request!</strong>
                <p>We've received your quote request and our team will get back to you within 24 hours.</p>
            </div>
        `;
        
        // Insert success message after the form
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Reset form
        form.reset();
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove success message after 10 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 10000);
    }, 1500);
}

// Helper function to validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// WhatsApp Widget Functionality
function initWhatsAppWidget() {
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    const whatsappToggle = document.querySelector('.whatsapp-float');
    const whatsappClose = document.querySelector('.whatsapp-close');
    const whatsappInput = document.querySelector('.whatsapp-input input');
    const whatsappSend = document.querySelector('.whatsapp-send');
    const whatsappBody = document.querySelector('.whatsapp-body');

    if (!whatsappWidget || !whatsappToggle) return;

    // Initial welcome message
    const welcomeMessage = {
        text: "Hello! 👋\nHow can we help you today?",
        time: getCurrentTime(),
        type: 'received'
    };
    
    // Add welcome message when page loads
    addMessageToChat(welcomeMessage);

    // Toggle chat widget
    whatsappToggle.addEventListener('click', function() {
        whatsappWidget.classList.toggle('active');
        // Toggle aria-expanded for accessibility
        const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Focus on input when chat is opened
        if (whatsappInput && !isExpanded) {
            setTimeout(() => {
                whatsappInput.focus();
            }, 300);
        }
    });

    // Close chat widget
    if (whatsappClose) {
        whatsappClose.addEventListener('click', function() {
            whatsappWidget.classList.remove('active');
            // Update the toggle button's aria-expanded
            const toggleBtn = document.querySelector('.whatsapp-float');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Send message when clicking send button
    if (whatsappSend && whatsappInput) {
        whatsappSend.addEventListener('click', sendMessage);
    }

    // Send message when pressing Enter key
    if (whatsappInput) {
        whatsappInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const messageText = whatsappInput.value.trim();
        if (messageText === '') return;

        // Add user message
        const userMessage = {
            text: messageText,
            time: getCurrentTime(),
            type: 'sent'
        };
        addMessageToChat(userMessage);
        whatsappInput.value = '';
        
        // Simulate reply after a short delay
        setTimeout(() => {
            const replies = [
                "Thanks for your message! We'll get back to you shortly.",
                "One of our team members will respond as soon as possible.",
                "We appreciate your message. Our team is currently busy but will respond soon.",
                "Thank you for reaching out! How can we assist you today?"
            ];
            
            const replyMessage = {
                text: replies[Math.floor(Math.random() * replies.length)],
                time: getCurrentTime(),
                type: 'received'
            };
            addMessageToChat(replyMessage);
        }, 1000);
    }

    function addMessageToChat(message) {
        if (!whatsappBody) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `whatsapp-message ${message.type}`;
        
        messageElement.innerHTML = `
            <div class="message-text">${message.text.replace(/\n/g, '<br>')}</div>
            <div class="whatsapp-message-time">${message.time}</div>
        `;
        
        whatsappBody.appendChild(messageElement);
        whatsappBody.scrollTop = whatsappBody.scrollHeight;
    }
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Initialize smooth scrolling
    setupSmoothScrolling();
    
    // Initialize FAQ accordion
    initFAQAccordion();
    
    // Initialize process tabs
    initProcessTabs();
    
    // Initialize WhatsApp widget
    initWhatsAppWidget();
    
    // Initialize mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMenu);
    }
    
    // Initialize quote form
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteForm);
        
        // Add input event listeners to remove error state when user types
        const inputs = quoteForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMessage = this.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.querySelector('.mobile-menu');
        const menuButton = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== menuButton && 
            !menuButton.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Initialize with home page if no hash in URL
    if (!window.location.hash) {
        window.location.hash = 'home';
        showSection('home');
    } else {
        showSection(window.location.hash.substring(1));
    }
    
    // Add scroll event for updating active navigation
    window.addEventListener('scroll', updateActiveNav);
    
    // Initialize active navigation on page load
    updateActiveNav();
    
    // Form submissions are now handled by handleQuoteForm
    // The quote form is initialized in the main DOMContentLoaded handler
    
    // Initialize additional features
    setupBackToTop();
    
    // Add animation classes when elements come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
});

// Handle page load with hash in URL
window.addEventListener('load', function() {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    }
});
