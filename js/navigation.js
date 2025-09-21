// Toggle mobile menu
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileEmergency = document.querySelector('.mobile-emergency');
    
    navMenu.classList.toggle('active');
    mobileEmergency.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navContainer.contains(event.target)) {
        navMenu.classList.remove('active');
        document.querySelector('.mobile-emergency').classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a, .mobile-emergency a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.mobile-emergency').classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Highlight active section in navigation
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust for fixed header
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Close menu when resizing to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
        document.querySelector('.mobile-emergency').classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});
