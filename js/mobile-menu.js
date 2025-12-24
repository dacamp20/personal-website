window.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            // Change button text when menu is open
            if (navMenu.classList.contains('show')) {
                this.textContent = '✕ Close';
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.textContent = '☰ Menu';
                this.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking outside (optional)
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('show');
                menuToggle.textContent = '☰ Menu';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});