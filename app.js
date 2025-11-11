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
    
    // Keyboard support (Enter and Space)
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showPage(item.dataset.page);
        }
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
    dot.setAttribute('role', 'tab');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToSlide(index);
        }
    });
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
            dot.setAttribute('aria-selected', 'true');
        } else {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
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

// Privacy Check
const checkBtn = document.getElementById('checkBtn');
const checkResults = document.getElementById('checkResults');
const scoreNumber = document.getElementById('scoreNumber');
const resultList = document.getElementById('resultList');

checkBtn.addEventListener('click', runPrivacyCheck);

async function runPrivacyCheck() {
    // Show loading state
    checkBtn.disabled = true;
    checkBtn.textContent = 'Running Checks...';
    checkBtn.style.opacity = '0.7';
    checkBtn.style.cursor = 'wait';
    scoreNumber.textContent = '...';
    
    try {
        // Run REAL checks (from checker-real.js)
        const results = await runRealPrivacyCheck();
        displayResults(results);
    } catch (error) {
        console.error('Privacy check failed:', error);
        // Fallback to basic message
        scoreNumber.textContent = '?';
        checkResults.innerHTML = '<p style="color: red;">Error running checks. Please try again.</p>';
        checkResults.style.display = 'block';
    } finally {
        // Reset button state (always runs)
        checkBtn.disabled = false;
        checkBtn.textContent = 'Run Privacy Check';
        checkBtn.style.opacity = '1';
        checkBtn.style.cursor = 'pointer';
    }
}

function displayResults(results) {
    // Update score (e.g., "12/15")
    scoreNumber.textContent = `${results.score}/${results.maxScore}`;
    
    // Color code score
    const scoreCircle = document.querySelector('.score-circle');
    const percentage = (results.score / results.maxScore) * 100;
    
    if (percentage >= 80) {
        scoreCircle.style.borderColor = '#4caf50';
        scoreNumber.style.color = '#4caf50';
    } else if (percentage >= 50) {
        scoreCircle.style.borderColor = '#ff9800';
        scoreNumber.style.color = '#ff9800';
    } else {
        scoreCircle.style.borderColor = '#f44336';
        scoreNumber.style.color = '#f44336';
    }

    // Display results
    resultList.innerHTML = '';
    
    results.checks.forEach((check, index) => {
        // Main container
        const resultItem = document.createElement('div');
        resultItem.setAttribute('role', 'listitem');
        resultItem.setAttribute('aria-label', `${check.name}: ${check.passed ? 'Passed' : 'Warning or Failed'}`);
        resultItem.style.cssText = `
            margin-bottom: 25px;
            padding: 24px;
            background: rgba(255,255,255,0.04);
            border-radius: 12px;
            border-left: 5px solid ${check.passed ? '#4caf50' : (check.severity === 'critical' ? '#f44336' : '#ff9800')};
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        
        // Header row (icon + name + severity badge)
        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        `;
        
        const iconSpan = document.createElement('span');
        iconSpan.style.cssText = `
            font-size: 3em;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        `;
        iconSpan.textContent = check.icon;
        
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'flex: 1;';
        
        const nameStrong = document.createElement('strong');
        nameStrong.style.cssText = 'font-size: 1.25em; display: block; margin-bottom: 6px; color: #ffffff;';
        nameStrong.textContent = check.name;
        
        const severitySpan = document.createElement('span');
        severitySpan.style.cssText = `
            font-size: 0.7em;
            padding: 5px 12px;
            border-radius: 8px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: ${
                check.severity === 'critical' ? 'rgba(244, 67, 54, 0.7)' :
                check.severity === 'high' ? 'rgba(255, 152, 0, 0.7)' :
                check.severity === 'medium' ? 'rgba(33, 150, 243, 0.7)' :
                'rgba(76, 175, 80, 0.7)'
            };
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        `;
        severitySpan.textContent = check.severity;
        
        titleDiv.appendChild(nameStrong);
        titleDiv.appendChild(severitySpan);
        
        headerDiv.appendChild(iconSpan);
        headerDiv.appendChild(titleDiv);
        
        // Message
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 15px;
            font-size: 1.05em;
            line-height: 1.6;
            color: #e0e7ff;
            font-weight: 500;
        `;
        messageDiv.textContent = check.message;
        
        // Recommendation
        const recommendationDiv = document.createElement('div');
        if (check.recommendation) {
            recommendationDiv.style.cssText = `
                margin-bottom: 15px;
                padding: 14px;
                background: rgba(255, 193, 7, 0.06);
                border-left: 3px solid rgba(255, 193, 7, 0.4);
                border-radius: 8px;
                font-style: italic;
                line-height: 1.6;
            `;
            recommendationDiv.innerHTML = `<span style="font-weight: 600; color: #ffd54f;">💡 Recommendation:</span> <span style="color: #e0e7ff;">${check.recommendation}</span>`;
        }
        
        // Learn More Link
        const learnMoreDiv = document.createElement('div');
        if (check.learnMore) {
            learnMoreDiv.style.cssText = 'margin-top: 15px; margin-bottom: 0;';
            const link = document.createElement('a');
            link.href = '#';
            link.style.cssText = `
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.75), rgba(102, 126, 234, 0.75));
                border: 2px solid rgba(167, 139, 250, 0.6);
                color: #ffffff;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 700;
                font-size: 1em;
                letter-spacing: 0.3px;
                transition: all 0.25s ease;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(139, 92, 246, 0.25);
            `;
            link.textContent = 'Learn More →';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showPage('download');
            });
            link.addEventListener('mouseenter', () => {
                link.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.85), rgba(139, 92, 246, 0.85))';
                link.style.borderColor = 'rgba(199, 210, 254, 0.8)';
                link.style.transform = 'translateY(-2px)';
                link.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.75), rgba(102, 126, 234, 0.75))';
                link.style.borderColor = 'rgba(167, 139, 250, 0.6)';
                link.style.transform = 'translateY(0)';
                link.style.boxShadow = '0 2px 10px rgba(139, 92, 246, 0.25)';
            });
            learnMoreDiv.appendChild(link);
        }
        
        // Why This Matters (collapsible)
        const detailsElement = document.createElement('details');
        detailsElement.style.cssText = `
            margin-top: 15px;
            margin-bottom: 15px;
            padding: 15px;
            background: rgba(102, 126, 234, 0.12);
            border-radius: 10px;
            border-left: 4px solid rgba(167, 139, 250, 0.5);
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
        `;
        
        const summary = document.createElement('summary');
        summary.style.cssText = `
            cursor: pointer;
            font-weight: 700;
            font-size: 1.05em;
            user-select: none;
            color: #c7d2fe;
            transition: color 0.2s;
        `;
        summary.textContent = '▶ Why This Matters?';
        
        const detailsContent = document.createElement('div');
        detailsContent.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 8px;
            font-size: 0.98em;
            line-height: 1.7;
            color: #e0e7ff;
        `;
        detailsContent.textContent = check.whyMatters || 'This check helps protect your privacy and security online.';
        
        detailsElement.addEventListener('toggle', () => {
            if (detailsElement.open) {
                summary.textContent = '▼ Why This Matters?';
            } else {
                summary.textContent = '▶ Why This Matters?';
            }
        });
        
        detailsElement.appendChild(summary);
        detailsElement.appendChild(detailsContent);
        
        // Assemble everything
        resultItem.appendChild(headerDiv);
        resultItem.appendChild(messageDiv);
        if (check.recommendation) {
            resultItem.appendChild(recommendationDiv);
        }
        resultItem.appendChild(detailsElement);
        if (check.learnMore) {
            resultItem.appendChild(learnMoreDiv);
        }
        
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
