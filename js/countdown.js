// ===== COUNTDOWN TIMER FUNCTIONALITY =====

class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate);
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.countdownContainer = document.getElementById('countdown');
        
        this.init();
    }
    
    init() {
        if (!this.daysElement || !this.hoursElement || !this.minutesElement || !this.secondsElement) {
            console.warn('Countdown elements not found');
            return;
        }
        
        // Start the countdown
        this.updateCountdown();
        this.startTimer();
        
        // Add animation classes
        this.addAnimationClasses();
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        if (distance < 0) {
            // Countdown has ended
            this.handleCountdownEnd();
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements with animation
        this.updateElement(this.daysElement, days);
        this.updateElement(this.hoursElement, hours);
        this.updateElement(this.minutesElement, minutes);
        this.updateElement(this.secondsElement, seconds);
    }
    
    updateElement(element, value) {
        const currentValue = parseInt(element.textContent);
        const newValue = value.toString().padStart(2, '0');
        
        if (currentValue !== value) {
            // Add flip animation
            element.style.transform = 'rotateX(90deg)';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'rotateX(0deg)';
            }, 150);
        }
    }
    
    startTimer() {
        // Update every second
        this.timer = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    handleCountdownEnd() {
        // Clear the timer
        clearInterval(this.timer);
        
        // Update display to show countdown has ended
        this.daysElement.textContent = '00';
        this.hoursElement.textContent = '00';
        this.minutesElement.textContent = '00';
        this.secondsElement.textContent = '00';
        
        // Add ended class for styling
        this.countdownContainer.classList.add('countdown-ended');
        
        // Show celebration message
        this.showCelebrationMessage();
        
        // Trigger any end-of-countdown actions
        this.onCountdownEnd();
    }
    
    showCelebrationMessage() {
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownTitle) {
            countdownTitle.textContent = 'الموعد قد حان! 🎉';
            countdownTitle.style.color = '#28a745';
            countdownTitle.style.fontWeight = 'bold';
        }
        
        // Add celebration animation
        this.countdownContainer.style.animation = 'celebrate 1s ease-in-out';
    }
    
    onCountdownEnd() {
        // You can add custom actions here when countdown ends
        console.log('Countdown has ended!');
        
        // Example: Show a modal or redirect
        // this.showEventModal();
    }
    
    addAnimationClasses() {
        // Add staggered animation to countdown items
        const countdownItems = document.querySelectorAll('.countdown-item');
        countdownItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('countdown-item-animate');
        });
    }
    
    // Method to update target date (useful for admin functionality)
    updateTargetDate(newDate) {
        this.targetDate = new Date(newDate);
        this.updateCountdown();
    }
    
    // Method to get remaining time in milliseconds
    getRemainingTime() {
        const now = new Date().getTime();
        return this.targetDate.getTime() - now;
    }
    
    // Method to check if countdown has ended
    hasEnded() {
        return this.getRemainingTime() <= 0;
    }
    
    // Method to format remaining time as object
    getFormattedTime() {
        const distance = this.getRemainingTime();
        
        if (distance < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }
}

// ===== COUNTDOWN INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Set target date to September 13, 2025 at 5 PM
    const targetDate = new Date('2025-09-13T17:00:00');
    
    // Initialize countdown
    const countdown = new CountdownTimer(targetDate);
    
    // Make countdown globally accessible for potential admin functionality
    window.countdownTimer = countdown;
});

// ===== COUNTDOWN UTILITY FUNCTIONS =====

// Function to create a countdown for any element
function createCustomCountdown(element, targetDate, options = {}) {
    const defaultOptions = {
        format: 'DD:HH:MM:SS',
        onTick: null,
        onComplete: null,
        showLabels: true
    };
    
    const config = { ...defaultOptions, ...options };
    
    class CustomCountdown {
        constructor(element, targetDate, config) {
            this.element = element;
            this.targetDate = new Date(targetDate);
            this.config = config;
            this.init();
        }
        
        init() {
            this.updateDisplay();
            this.timer = setInterval(() => {
                this.updateDisplay();
            }, 1000);
        }
        
        updateDisplay() {
            const distance = this.targetDate.getTime() - new Date().getTime();
            
            if (distance < 0) {
                this.element.innerHTML = this.config.onComplete ? this.config.onComplete() : 'انتهى الوقت';
                clearInterval(this.timer);
                return;
            }
            
            const time = this.formatTime(distance);
            this.element.innerHTML = time;
            
            if (this.config.onTick) {
                this.config.onTick(distance);
            }
        }
        
        formatTime(distance) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            let result = this.config.format;
            
            if (this.config.showLabels) {
                result = result
                    .replace('DD', `${days.toString().padStart(2, '0')} يوم`)
                    .replace('HH', `${hours.toString().padStart(2, '0')} ساعة`)
                    .replace('MM', `${minutes.toString().padStart(2, '0')} دقيقة`)
                    .replace('SS', `${seconds.toString().padStart(2, '0')} ثانية`);
            } else {
                result = result
                    .replace('DD', days.toString().padStart(2, '0'))
                    .replace('HH', hours.toString().padStart(2, '0'))
                    .replace('MM', minutes.toString().padStart(2, '0'))
                    .replace('SS', seconds.toString().padStart(2, '0'));
            }
            
            return result;
        }
        
        destroy() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    }
    
    return new CustomCountdown(element, targetDate, config);
}

// ===== COUNTDOWN ANIMATIONS =====

// Add CSS animations for countdown
const countdownStyles = `
    @keyframes countdownFlip {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
    }
    
    @keyframes celebrate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .countdown-item-animate {
        animation: fadeInUp 0.6s ease-out both;
    }
    
    .countdown-number {
        transition: transform 0.3s ease;
    }
    
    .countdown-ended .countdown-item {
        opacity: 0.7;
        filter: grayscale(50%);
    }
    
    .countdown-ended .countdown-number {
        color: #6c757d !important;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = countdownStyles;
document.head.appendChild(styleSheet);

// ===== COUNTDOWN ADMIN FUNCTIONS =====

// Function to easily update countdown date (for admin use)
function updateCountdownDate(newDate) {
    if (window.countdownTimer) {
        window.countdownTimer.updateTargetDate(newDate);
    }
}

// Function to get current countdown status
function getCountdownStatus() {
    if (window.countdownTimer) {
        return {
            hasEnded: window.countdownTimer.hasEnded(),
            remainingTime: window.countdownTimer.getFormattedTime(),
            targetDate: window.countdownTimer.targetDate
        };
    }
    return null;
}

// Example usage for admin panel:
// updateCountdownDate('2024-02-15 19:00:00');
// console.log(getCountdownStatus()); 