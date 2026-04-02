// Music Vault - Interactive JavaScript Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initAnimations();
    initButtonEffects();
    initFormEnhancements();
    initTableInteractions();
    initAudioPlayerEnhancements();
    initDashboardAnimations();
});

// Page Load Animations
function initAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add slide-up animation to table rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
        row.classList.add('slide-up');
        row.style.animationDelay = `${index * 0.05}s`;
    });

    // Animate dashboard stats
    const statCards = document.querySelectorAll('.card.bg-primary, .card.bg-success, .card.bg-warning, .card.bg-info');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Enhanced Button Interactions
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Add loading state for form submissions
        if (button.type === 'submit') {
            button.addEventListener('click', function() {
                const form = this.closest('form');
                if (form && form.checkValidity()) {
                    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
                    this.disabled = true;
                }
            });
        }
    });
}

// Form Enhancements
function initFormEnhancements() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Add floating label effect
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Real-time validation feedback
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });

        // Form submission feedback
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
                submitBtn.disabled = true;
            }
        });
    });
}

// Table Interactions
function initTableInteractions() {
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        // Add hover effects
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.zIndex = '10';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });

        // Add click effects for action buttons
        const actionButtons = row.querySelectorAll('.btn');
        actionButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
}

// Audio Player Enhancements
function initAudioPlayerEnhancements() {
    const audioPlayers = document.querySelectorAll('audio');

    audioPlayers.forEach(player => {
        // Add custom controls styling
        player.addEventListener('play', function() {
            this.parentElement.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
        });

        player.addEventListener('pause', function() {
            this.parentElement.style.boxShadow = '';
        });

        // Add progress bar enhancement
        player.addEventListener('timeupdate', function() {
            const progress = (this.currentTime / this.duration) * 100;
            this.style.background = `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${progress}%, #E5E7EB ${progress}%, #E5E7EB 100%)`;
        });
    });
}

// Dashboard Animations
function initDashboardAnimations() {
    // Animate chart loading
    const charts = document.querySelectorAll('canvas');
    charts.forEach(chart => {
        chart.style.opacity = '0';
        setTimeout(() => {
            chart.style.transition = 'opacity 1s ease';
            chart.style.opacity = '1';
        }, 500);
    });

    // Animate stat numbers
    const statNumbers = document.querySelectorAll('.card h2');
    statNumbers.forEach(number => {
        const target = parseInt(number.textContent.replace(/,/g, ''));
        if (!isNaN(target)) {
            animateNumber(number, 0, target, 1000);
        }
    });
}

// Number Animation Function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Search Functionality Enhancement
function initSearchEnhancements() {
    const searchInputs = document.querySelectorAll('input[name="search"]');

    searchInputs.forEach(input => {
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Add loading state to search
                const searchBtn = this.parentElement.querySelector('button[type="submit"]');
                if (searchBtn) {
                    searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Searching...';
                    searchBtn.disabled = true;

                    setTimeout(() => {
                        searchBtn.innerHTML = 'Search';
                        searchBtn.disabled = false;
                    }, 500);
                }
            }, 300);
        });
    });
}

// Modal Enhancements
function initModalEnhancements() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            // Add entrance animation
            this.querySelector('.modal-dialog').style.animation = 'modalSlideIn 0.3s ease-out';
        });

        modal.addEventListener('hide.bs.modal', function() {
            // Add exit animation
            this.querySelector('.modal-dialog').style.animation = 'modalSlideOut 0.3s ease-in';
        });
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Add CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }

    .focused .form-label {
        color: #8B5CF6;
        font-weight: 600;
    }

    .is-valid {
        border-color: #10B981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }

    .is-invalid {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Initialize search enhancements
initSearchEnhancements();

// Initialize modal enhancements
initModalEnhancements();

// Add floating action button for quick actions (if needed)
function addFloatingActionButton() {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '+';
    fab.title = 'Quick Upload';
    fab.onclick = () => {
        window.location.href = '/music/create';
    };
    document.body.appendChild(fab);
}

// Add FAB to pages that need it
if (window.location.pathname === '/music' || window.location.pathname === '/dashboard') {
    addFloatingActionButton();
}

// Performance optimization: Debounce scroll events
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

// Add scroll-based animations
window.addEventListener('scroll', debounce(() => {
    const elements = document.querySelectorAll('.card, .table, .alert');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('fade-in');
        }
    });
}, 16));

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showToast('An error occurred. Please try again.', 'danger');
});

// Success feedback for actions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-success, .btn-primary')) {
        // Add subtle feedback
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }
});