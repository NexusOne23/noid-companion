// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function showPage(pageName) {
    // Update nav
    navItems.forEach(item => {
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update pages
    pages.forEach(page => {
        if (page.id === pageName) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        showPage(item.dataset.page);
    });
});

// Feature Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const sliderDots = document.querySelector('.slider-dots');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    sliderDots.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateSlider() {
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto-advance slider
setInterval(nextSlide, 5000);

// Privacy Checker
const checkBtn = document.getElementById('checkBtn');
const scoreNumber = document.getElementById('scoreNumber');
const checkResults = document.getElementById('checkResults');
const resultList = document.getElementById('resultList');

checkBtn.addEventListener('click', runPrivacyCheck);

function runPrivacyCheck() {
    checkBtn.textContent = 'Checking...';
    checkBtn.disabled = true;

    // Simulate checking (in real app, would check actual settings)
    setTimeout(() => {
        const results = performChecks();
        displayResults(results);
        checkBtn.textContent = 'Run Privacy Check';
        checkBtn.disabled = false;
    }, 2000);
}

function performChecks() {
    // Simulated checks (in real app, would use Windows APIs)
    const checks = [
        {
            name: 'Telemetry Settings',
            status: 'warning',
            message: 'Telemetry is partially enabled',
            icon: '⚠️'
        },
        {
            name: 'Windows Defender',
            status: 'good',
            message: 'Real-time protection is active',
            icon: '✅'
        },
        {
            name: 'App Permissions',
            status: 'warning',
            message: '12 apps have camera access',
            icon: '⚠️'
        },
        {
            name: 'Network Privacy',
            status: 'bad',
            message: 'Network discovery is enabled',
            icon: '❌'
        },
        {
            name: 'Security Features',
            status: 'warning',
            message: 'Some features need attention',
            icon: '⚠️'
        }
    ];

    // Calculate score
    let score = 10;
    checks.forEach(check => {
        if (check.status === 'warning') score -= 1;
        if (check.status === 'bad') score -= 2;
    });

    return { score, checks };
}

function displayResults(results) {
    // Update score
    scoreNumber.textContent = results.score;
    
    // Color code score
    const scoreCircle = document.querySelector('.score-circle');
    if (results.score >= 8) {
        scoreCircle.style.borderColor = '#4caf50';
        scoreNumber.style.color = '#4caf50';
    } else if (results.score >= 5) {
        scoreCircle.style.borderColor = '#ff9800';
        scoreNumber.style.color = '#ff9800';
    } else {
        scoreCircle.style.borderColor = '#f44336';
        scoreNumber.style.color = '#f44336';
    }

    // Display results
    resultList.innerHTML = '';
    results.checks.forEach(check => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${check.status}`;
        resultItem.innerHTML = `
            <div>
                <span style="font-size: 1.5em; margin-right: 10px;">${check.icon}</span>
                <strong>${check.name}</strong>
                <div style="opacity: 0.8; margin-top: 5px;">${check.message}</div>
            </div>
        `;
        resultList.appendChild(resultItem);
    });

    checkResults.style.display = 'block';
}

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}

// Make showPage available globally
window.showPage = showPage;

// Interactive Feature Checklist
const featureCheckboxes = document.querySelectorAll('.feature-checklist input[type="checkbox"]');
const comparisonResult = document.getElementById('comparisonResult');
const selectedFeatures = document.getElementById('selectedFeatures');

featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateFeatureComparison);
});

function updateFeatureComparison() {
    const selected = Array.from(featureCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.nextElementSibling.textContent);
    
    if (selected.length > 0) {
        selectedFeatures.textContent = `You selected ${selected.length} out of 6 features. NoID Privacy will help you implement all of these!`;
        comparisonResult.style.display = 'block';
    } else {
        comparisonResult.style.display = 'none';
    }
}
