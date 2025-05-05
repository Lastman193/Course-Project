class BannerSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            {
                image: 'media/SpringProm.png',
                alt: 'Весенние акции'
            },
            {
                image: 'media/StirkaProm.png',
                alt: 'Реклама Стиралки'
            },
            {
                image: 'media/CreditProm.png',
                alt: 'Реклама кредита'
            },
            {
                image: 'media/TefalProm.png',
                alt: 'Реклама Tefal'
            },
            {
                image: 'media/LgBanner.png',
                alt: 'Реклама ЛГ'

            }
        ];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.container = document.querySelector('.banner-image');
        this.prevBtn = document.querySelector('.banner-nav.prev');
        this.nextBtn = document.querySelector('.banner-nav.next');
        this.indicators = document.querySelector('.slide-indicators');

        this.images = this.slides.map((slide, index) => {
            const img = document.createElement('img');
            img.src = slide.image;
            img.alt = slide.alt;
            img.className = index === 0 ? 'active' : 'next';
            this.container.appendChild(img);
            return img;
        });

        this.createIndicators();
        this.setupEventListeners();
        this.updateSlidePositions();
    }

    createIndicators() {
        this.indicators.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slide-indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.indicators.appendChild(dot);
        });
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
    }

    updateIndicators() {
        const dots = this.indicators.children;
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === this.currentSlide);
        }
    }

    updateSlidePositions() {
        this.images.forEach((img, index) => {
            if (index === this.currentSlide) {
                img.className = 'active';
            } else {
                img.className = 'hidden';
            }
        });

        // Only show next and prev slides when not animating
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        
        if (!this.isAnimating) {
            this.images[nextIndex].className = 'next';
            this.images[prevIndex].className = 'prev';
        }
    }

    async slide(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const nextIndex = direction === 'next'
            ? (this.currentSlide + 1) % this.slides.length
            : (this.currentSlide - 1 + this.slides.length) % this.slides.length;

        // Reset all slides first
        this.images.forEach(img => {
            img.className = 'hidden';
        });

        const currentSlide = this.images[this.currentSlide];
        const nextSlide = this.images[nextIndex];

        // Set initial positions
        currentSlide.className = 'active';
        nextSlide.className = direction === 'next' ? 'next' : 'prev';

        // Force browser reflow
        void nextSlide.offsetWidth;

        // Trigger animation
        requestAnimationFrame(() => {
            currentSlide.className = direction === 'next' ? 'slide-left' : 'slide-right';
            nextSlide.className = 'active';

            setTimeout(() => {
                this.currentSlide = nextIndex;
                this.updateIndicators();
                this.updateSlidePositions();
                this.isAnimating = false;
            }, 600);
        });
    }

    async goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        const direction = index > this.currentSlide ? 'next' : 'prev';
        await this.slide(direction);
    }

    prev() {
        this.slide('prev');
    }

    next() {
        this.slide('next');
    }
}

// Инициализация слайдера
document.addEventListener('DOMContentLoaded', () => {
    new BannerSlider();
}); 