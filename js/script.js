/* global bootstrap */

// scroll behavior for navbar
{
    document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add 'fixed-top' and show shadow
        if (scrollTop > 500) {
            navbar.classList.add('fixed-top');
        } else {
            navbar.classList.remove('fixed-top');
        }

        // Hide on scroll down, show on scroll up
        if (scrollTop > lastScrollTop) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
}
// Debounce function to limit scroll event frequency
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

// Check if Bootstrap is loaded
if (typeof bootstrap === 'undefined') {
    console.error('Bootstrap JavaScript is not loaded. Ensure Bootstrap JS and Popper.js are included in index.html.');
}

// Initialize Bootstrap Tooltips
document.addEventListener('DOMContentLoaded', function () {
    try {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        if (tooltipTriggerList.length === 0) {
            console.warn('No elements with [data-bs-toggle="tooltip"] found.');
        }
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            if (bootstrap && bootstrap.Tooltip) {
                new bootstrap.Tooltip(tooltipTriggerEl);
            } else {
                console.error('Bootstrap Tooltip is not available.');
            }
        });
    } catch (error) {
        console.error('Error initializing tooltips:', error);
    }
});

// Search Bar Toggle with Animation
const searchToggle = document.getElementById('searchToggle');
if (searchToggle) {
    searchToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const searchBar = document.querySelector('.search-bar');
        if (!searchBar) {
            console.error('Search bar element not found. Check for .search-bar class in HTML.');
            return;
        }
        searchBar.classList.toggle('d-none');
        searchBar.classList.toggle('active');
        if (!searchBar.classList.contains('d-none')) {
            const searchInput = searchBar.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            } else {
                console.error('Search input element not found. Check for .search-input class in HTML.');
            }
        }
    });
} else {
    console.error('Search toggle element not found. Check for #searchToggle ID in HTML.');
}

// Navbar Scroll Behavior
const navbar = document.getElementById('mainNavbar');
if (navbar) {
    let lastScrollTop = 0;
    let navbarHeight = navbar.offsetHeight;
    let isHidden = false;
    let lastVisibleScroll = 0;

    window.addEventListener('scroll', debounce(function () {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        if (scrollY === 0) {
            // At top of page: Revert to relative position
            navbar.classList.remove('fixed-top', 'hidden');
            isHidden = false;
            lastVisibleScroll = 0;
        } else {
            // Determine scroll direction
            if (scrollY > lastScrollTop) {
                // Scroll Down
                if (scrollY > navbarHeight && !isHidden) {
                    // Hide navbar when fully out of view
                    navbar.classList.add('hidden');
                    navbar.classList.remove('fixed-top');
                    isHidden = true;
                    lastVisibleScroll = scrollY;
                }
            } else {
                // Scroll Up
                if (isHidden && (lastVisibleScroll - scrollY) >= 10) {
                    // Show navbar after scrolling up 10px
                    navbar.classList.remove('hidden');
                    navbar.classList.add('fixed-top');
                    isHidden = false;
                }
            }
        }

        lastScrollTop = scrollY <= 0 ? 0 : scrollY; // Prevent negative scroll
    }, 10));
} else {
    console.error('Navbar element not found. Check for #mainNavbar ID in HTML.');
}

// Highlight Active Menu Item
const navLinks = document.querySelectorAll('.nav-link[data-section]');
if (navLinks.length === 0) {
    console.warn('No navigation links with [data-section] found. Check nav-link elements in HTML.');
}
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const offcanvas = document.querySelector('.offcanvas');
        if (offcanvas && offcanvas.classList.contains('show')) {
            if (bootstrap && bootstrap.Offcanvas) {
                bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
            } else {
                console.error('Bootstrap Offcanvas is not available.');
            }
        }
    });
});

// Highlight Active Section on Scroll
const highlightSection = debounce(function () {
    const sections = document.querySelectorAll('.section');
    if (sections.length === 0) {
        console.warn('No sections found. Check for .section class in HTML.');
        return;
    }
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 60 && window.scrollY < sectionTop + sectionHeight - 60) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', highlightSection);

// Placeholder for Dynamic Cart Count
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) {
        console.error('Cart count element not found. Check for .cart-count class in HTML.');
        return;
    }
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.setAttribute('data-bs-original-title', `View your cart (${count} items)`);
    } else {
        console.error('Cart icon element not found. Check for #cartIcon ID in HTML.');
    }
}

// Initialize cart count
try {
    updateCartCount(0);
} catch (error) {
    console.error('Error updating cart count:', error);
}