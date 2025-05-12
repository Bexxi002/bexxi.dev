document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.right');
    const overlay = document.querySelector('.menu-overlay');

    if (menuBtn && nav && overlay) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            overlay.classList.toggle('active');
            const expanded = menuBtn.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', expanded);
            document.body.style.overflow = expanded ? 'hidden' : '';
        });

        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        overlay.addEventListener('click', closeMenu);

        function closeMenu() {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
            overlay.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        }

        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.setAttribute('aria-controls', 'mobile-nav');
        nav.setAttribute('id', 'mobile-nav');
    }
});