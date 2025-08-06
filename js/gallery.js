// ===== GALLERY FUNCTIONALITY =====

class GalleryManager {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.lightbox = null;
        
        this.init();
    }
    
    init() {
        this.initFiltering();
        this.initLightbox();
        this.initLazyLoading();
        this.initHoverEffects();
    }
    
    // ===== FILTERING FUNCTIONALITY =====
    initFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterGallery(button.getAttribute('data-filter'));
            });
        });
    }
    
    filterGallery(filter) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.currentFilter = filter;
        
        // Filter items with animation
        this.galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            // Add delay for staggered animation
            setTimeout(() => {
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            }, index * 50);
        });
    }
    
    // ===== LIGHTBOX FUNCTIONALITY =====
    initLightbox() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(item);
            });
        });
        
        // Close lightbox on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox) {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || '';
        const description = item.querySelector('p')?.textContent || '';
        
        this.createLightbox(img.src, title, description);
    }
    
    createLightbox(imageSrc, title, description) {
        // Remove existing lightbox
        if (this.lightbox) {
            this.lightbox.remove();
        }
        
        // Create lightbox element
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-image">
                    <img src="${imageSrc}" alt="${title}">
                </div>
                <div class="lightbox-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        // Add lightbox styles
        this.addLightboxStyles();
        
        // Add to page
        document.body.appendChild(this.lightbox);
        
        // Add event listeners
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });
        
        this.lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
            this.closeLightbox();
        });
        
        // Animate in
        setTimeout(() => {
            this.lightbox.classList.add('active');
        }, 10);
    }
    
    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.classList.remove('active');
            setTimeout(() => {
                this.lightbox.remove();
                this.lightbox = null;
            }, 300);
        }
    }
    
    addLightboxStyles() {
        if (document.getElementById('lightbox-styles')) return;
        
        const styles = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .lightbox.active {
                opacity: 1;
            }
            
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                cursor: pointer;
            }
            
            .lightbox-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                transition: transform 0.3s ease;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox.active .lightbox-content {
                transform: translate(-50%, -50%) scale(1);
            }
            
            .lightbox-image {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .lightbox-image img {
                max-width: 100%;
                max-height: 70vh;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            
            .lightbox-info {
                text-align: center;
                color: white;
            }
            
            .lightbox-info h3 {
                color: white;
                margin-bottom: 10px;
            }
            
            .lightbox-info p {
                color: rgba(255,255,255,0.8);
            }
            
            .lightbox-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.3s ease;
            }
            
            .lightbox-close:hover {
                color: var(--accent);
            }
            
            @media (max-width: 768px) {
                .lightbox-content {
                    width: 95%;
                }
                
                .lightbox-image img {
                    max-height: 50vh;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // ===== LAZY LOADING =====
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        this.galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    // ===== HOVER EFFECTS =====
    initHoverEffects() {
        this.galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addHoverEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeHoverEffect(item);
            });
        });
    }
    
    addHoverEffect(item) {
        const overlay = item.querySelector('.gallery-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
        
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1)';
        }
    }
    
    removeHoverEffect(item) {
        const overlay = item.querySelector('.gallery-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
        
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
        }
    }
    
    // ===== UTILITY METHODS =====
    
    // Method to add new gallery items dynamically
    addGalleryItem(imageSrc, title, description, category) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.setAttribute('data-category', category);
        newItem.innerHTML = `
            <img src="${imageSrc}" alt="${title}" loading="lazy">
            <div class="gallery-overlay">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
        
        galleryGrid.appendChild(newItem);
        
        // Reinitialize for new item
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.initHoverEffects();
        this.initLightbox();
    }
    
    // Method to get current filter
    getCurrentFilter() {
        return this.currentFilter;
    }
    
    // Method to get visible items count
    getVisibleItemsCount() {
        return Array.from(this.galleryItems).filter(item => 
            item.style.display !== 'none'
        ).length;
    }
    
    // Method to refresh gallery
    refresh() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.init();
    }
}

// ===== GALLERY INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery manager
    const galleryManager = new GalleryManager();
    
    // Make gallery manager globally accessible
    window.galleryManager = galleryManager;
});

// ===== GALLERY UTILITY FUNCTIONS =====

// Function to add gallery item programmatically
function addGalleryItem(imageSrc, title, description, category) {
    if (window.galleryManager) {
        window.galleryManager.addGalleryItem(imageSrc, title, description, category);
    }
}

// Function to filter gallery programmatically
function filterGallery(filter) {
    if (window.galleryManager) {
        window.galleryManager.filterGallery(filter);
    }
}

// Function to get gallery statistics
function getGalleryStats() {
    if (window.galleryManager) {
        return {
            totalItems: window.galleryManager.galleryItems.length,
            visibleItems: window.galleryManager.getVisibleItemsCount(),
            currentFilter: window.galleryManager.getCurrentFilter()
        };
    }
    return null;
}

// ===== GALLERY ANIMATIONS =====

// Add gallery-specific animations
const galleryAnimations = `
    @keyframes galleryFadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .gallery-item {
        animation: galleryFadeIn 0.6s ease-out;
    }
    
    .gallery-item:nth-child(1) { animation-delay: 0.1s; }
    .gallery-item:nth-child(2) { animation-delay: 0.2s; }
    .gallery-item:nth-child(3) { animation-delay: 0.3s; }
    .gallery-item:nth-child(4) { animation-delay: 0.4s; }
    .gallery-item:nth-child(5) { animation-delay: 0.5s; }
    .gallery-item:nth-child(6) { animation-delay: 0.6s; }
`;

// Inject gallery animations
const galleryStyleSheet = document.createElement('style');
galleryStyleSheet.textContent = galleryAnimations;
document.head.appendChild(galleryStyleSheet);

// ===== GALLERY PERFORMANCE OPTIMIZATIONS =====

// Debounced resize handler for responsive gallery
const debouncedResize = debounce(() => {
    if (window.galleryManager) {
        window.galleryManager.refresh();
    }
}, 250);

window.addEventListener('resize', debouncedResize);

// Debounce function (if not already defined)
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