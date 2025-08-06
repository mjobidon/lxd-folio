// Main JavaScript for Mobile Microlearning Series
let currentLesson = 1;
let totalLessons = 3;
let lessonStartTime = Date.now();
let seriesStartTime = Date.now();
let interactions = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let lessonProgress = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateOverallProgress();
    updateLessonCounter();
    updateFloatingProgress();
    
    // Start tracking the first lesson
    if (window.xapiWrapper) {
        xapiWrapper.startedLesson(1, "Digital Communication Basics");
    }
    
    // Initialize lesson progress tracking
    lessonProgress = {
        1: { started: true, completed: false, timeSpent: 0, interactions: 0 },
        2: { started: false, completed: false, timeSpent: 0, interactions: 0 },
        3: { started: false, completed: false, timeSpent: 0, interactions: 0 }
    };
});

// Navigation functions
function nextLesson() {
    if (currentLesson < totalLessons) {
        // Hide current lesson
        document.getElementById(`lesson${currentLesson}`).classList.remove('active');
        
        currentLesson++;
        lessonStartTime = Date.now();
        
        // Show next lesson
        document.getElementById(`lesson${currentLesson}`).classList.add('active');
        
        // Update progress indicators
        updateOverallProgress();
        updateLessonCounter();
        updateFloatingProgress();
        
        // Track lesson start
        if (window.xapiWrapper) {
            const lessonTitles = {
                2: "Virtual Meeting Excellence",
                3: "Digital Collaboration Tools"
            };
            xapiWrapper.startedLesson(currentLesson, lessonTitles[currentLesson]);
        }
        
        // Update lesson progress
        lessonProgress[currentLesson].started = true;
    }
}

function previousLesson() {
    if (currentLesson > 1) {
        // Hide current lesson
        document.getElementById(`lesson${currentLesson}`).classList.remove('active');
        
        currentLesson--;
        lessonStartTime = Date.now();
        
        // Show previous lesson
        document.getElementById(`lesson${currentLesson}`).classList.add('active');
        
        // Update progress indicators
        updateOverallProgress();
        updateLessonCounter();
        updateFloatingProgress();
    }
}

function completeLesson(lessonNumber) {
    const timeSpent = Math.round((Date.now() - lessonStartTime) / 1000);
    
    // Update lesson progress
    lessonProgress[lessonNumber].completed = true;
    lessonProgress[lessonNumber].timeSpent = timeSpent;
    lessonProgress[lessonNumber].interactions = interactions;
    
    // Track lesson completion
    if (window.xapiWrapper) {
        const lessonTitles = {
            1: "Digital Communication Basics",
            2: "Virtual Meeting Excellence", 
            3: "Digital Collaboration Tools"
        };
        xapiWrapper.completedLesson(lessonNumber, lessonTitles[lessonNumber], timeSpent, interactions);
    }
    
    if (lessonNumber < totalLessons) {
        nextLesson();
    } else {
        // Show completion screen
        showCompletionScreen();
    }
    
    // Reset interaction counter for next lesson
    interactions = 0;
}

function showCompletionScreen() {
    // Hide current lesson
    document.getElementById(`lesson${currentLesson}`).classList.remove('active');
    
    // Show completion screen
    document.getElementById('completion').classList.add('active');
    
    // Calculate final statistics
    const totalTime = Math.round((Date.now() - seriesStartTime) / 1000 / 60); // minutes
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 100;
    const totalInteractions = Object.values(lessonProgress).reduce((sum, lesson) => sum + lesson.interactions, 0);
    
    // Update completion stats
    document.getElementById('totalTime').textContent = totalTime;
    document.getElementById('accuracyScore').textContent = accuracy;
    
    // Track series completion
    if (window.xapiWrapper) {
        xapiWrapper.completedSeries(totalTime * 60, totalInteractions, accuracy / 100);
    }
    
    // Update progress to 100%
    updateOverallProgress(100);
    updateFloatingProgress(100);
}

// Progress tracking functions
function updateOverallProgress(customProgress = null) {
    const progress = customProgress !== null ? customProgress : Math.round((currentLesson / totalLessons) * 100);
    const progressFill = document.getElementById('overallProgress');
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}

function updateLessonCounter() {
    const counter = document.getElementById('lessonCounter');
    if (counter) {
        counter.textContent = `Lesson ${currentLesson} of ${totalLessons}`;
    }
}

function updateFloatingProgress(customProgress = null) {
    const progress = customProgress !== null ? customProgress : Math.round((currentLesson / totalLessons) * 100);
    const progressRing = document.querySelector('.progress-ring-fill');
    const progressText = document.getElementById('progressPercentage');
    
    if (progressRing) {
        const circumference = 2 * Math.PI * 26; // radius = 26
        const offset = circumference - (progress / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
    }
    
    if (progressText) {
        progressText.textContent = `${progress}%`;
    }
}

// Interactive element functions
function flipCard(card) {
    card.classList.toggle('flipped');
    trackInteraction('flip-card', 'card-flip', { flipped: card.classList.contains('flipped') });
}

function expandTimelineItem(item) {
    item.classList.toggle('expanded');
    trackInteraction('timeline', 'timeline-expand', { 
        expanded: item.classList.contains('expanded'),
        item: item.querySelector('h4').textContent
    });
}

function expandTool(card) {
    card.classList.toggle('expanded');
    trackInteraction('tool-card', 'tool-expand', { 
        expanded: card.classList.contains('expanded'),
        tool: card.querySelector('h4').textContent
    });
}

function toggleAccordion(item) {
    item.classList.toggle('active');
    trackInteraction('accordion', 'accordion-toggle', { 
        active: item.classList.contains('active'),
        item: item.querySelector('h4').textContent
    });
}

// Scenario handling
function handleScenario(button, quality) {
    // Mark button as selected
    const buttons = button.parentElement.querySelectorAll('.scenario-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    
    // Show feedback
    const feedback = button.parentElement.parentElement.querySelector('.scenario-feedback');
    const result = feedback.querySelector('.scenario-result');
    
    if (quality === 'good') {
        result.textContent = "Excellent choice! Communicating technical issues professionally shows respect for your colleagues and maintains meeting productivity.";
        result.style.color = '#4CAF50';
    } else {
        result.textContent = "Consider a more professional approach. Clear communication about technical issues helps maintain meeting effectiveness.";
        result.style.color = '#FF6B6B';
    }
    
    feedback.style.display = 'block';
    
    trackInteraction('scenario', 'scenario-response', { 
        quality: quality,
        response: button.textContent
    });
}

// Knowledge check functions
function selectAnswer(button, isCorrect) {
    // Mark button as selected and show result
    const buttons = button.parentElement.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        if (btn === button) {
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
    });
    
    // Show feedback
    const questionCard = button.closest('.question-card');
    const feedback = questionCard.querySelector('.feedback');
    const feedbackText = feedback.querySelector('.feedback-text');
    
    if (isCorrect) {
        feedbackText.textContent = "Correct! You've demonstrated good understanding of the concept.";
        feedbackText.style.color = '#4CAF50';
        correctAnswers++;
    } else {
        feedbackText.textContent = "Not quite right. Review the lesson content for the correct approach.";
        feedbackText.style.color = '#FF6B6B';
    }
    
    feedback.style.display = 'block';
    totalQuestions++;
    
    // Track answer
    if (window.xapiWrapper) {
        xapiWrapper.answeredQuestion(
            `lesson${currentLesson}-question`,
            button.textContent,
            isCorrect,
            currentLesson
        );
    }
    
    trackInteraction('knowledge-check', 'answer-selected', { 
        correct: isCorrect,
        answer: button.textContent
    });
}

// Completion actions
function downloadCertificate() {
    // In a real implementation, this would generate a PDF certificate
    alert('Certificate download would be implemented here. In a real system, this would generate a personalized PDF certificate with completion details.');
    
    trackInteraction('completion', 'certificate-download', {
        timestamp: Date.now(),
        totalTime: Math.round((Date.now() - seriesStartTime) / 1000 / 60)
    });
}

function restartSeries() {
    if (confirm('Are you sure you want to restart the entire series? Your progress will be lost.')) {
        // Reset all variables
        currentLesson = 1;
        lessonStartTime = Date.now();
        seriesStartTime = Date.now();
        interactions = 0;
        correctAnswers = 0;
        totalQuestions = 0;
        
        // Reset lesson progress
        lessonProgress = {
            1: { started: true, completed: false, timeSpent: 0, interactions: 0 },
            2: { started: false, completed: false, timeSpent: 0, interactions: 0 },
            3: { started: false, completed: false, timeSpent: 0, interactions: 0 }
        };
        
        // Hide completion screen
        document.getElementById('completion').classList.remove('active');
        
        // Show first lesson
        document.getElementById('lesson1').classList.add('active');
        
        // Reset all interactive elements
        resetInteractiveElements();
        
        // Update progress indicators
        updateOverallProgress();
        updateLessonCounter();
        updateFloatingProgress();
        
        // Track restart
        if (window.xapiWrapper) {
            xapiWrapper.startedLesson(1, "Digital Communication Basics");
        }
    }
}

function resetInteractiveElements() {
    // Reset flip cards
    document.querySelectorAll('.flip-card').forEach(card => {
        card.classList.remove('flipped');
    });
    
    // Reset timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('expanded');
    });
    
    // Reset tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.classList.remove('expanded');
    });
    
    // Reset accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Reset answer buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
    });
    
    // Reset scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Hide all feedback
    document.querySelectorAll('.feedback, .scenario-feedback').forEach(feedback => {
        feedback.style.display = 'none';
    });
}

// Interaction tracking
function trackInteraction(type, action, details = {}) {
    interactions++;
    
    if (window.xapiWrapper) {
        xapiWrapper.interactedWithElement(type, action, currentLesson, details);
    }
    
    console.log('Interaction tracked:', { type, action, details, lesson: currentLesson });
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        if (currentLesson < totalLessons) {
            nextLesson();
        }
    } else if (event.key === 'ArrowLeft') {
        if (currentLesson > 1) {
            previousLesson();
        }
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentLesson > 1) {
            // Swipe right - previous lesson
            previousLesson();
        } else if (swipeDistance < 0 && currentLesson < totalLessons) {
            // Swipe left - next lesson
            nextLesson();
        }
    }
}

// Accessibility improvements
function addAccessibilityFeatures() {
    // Add ARIA labels
    document.querySelectorAll('.lesson').forEach((lesson, index) => {
        lesson.setAttribute('role', 'tabpanel');
        lesson.setAttribute('aria-label', `Lesson ${index + 1} content`);
    });
    
    // Add focus management for interactive elements
    document.querySelectorAll('button, .flip-card, .timeline-item, .tool-card, .accordion-item').forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                element.click();
            }
        });
    });
    
    // Add screen reader announcements for progress changes
    const progressAnnouncer = document.createElement('div');
    progressAnnouncer.setAttribute('aria-live', 'polite');
    progressAnnouncer.setAttribute('aria-atomic', 'true');
    progressAnnouncer.style.position = 'absolute';
    progressAnnouncer.style.left = '-10000px';
    progressAnnouncer.style.width = '1px';
    progressAnnouncer.style.height = '1px';
    progressAnnouncer.style.overflow = 'hidden';
    document.body.appendChild(progressAnnouncer);
    
    // Update announcer when lesson changes
    const originalNextLesson = nextLesson;
    nextLesson = function() {
        originalNextLesson();
        progressAnnouncer.textContent = `Now on lesson ${currentLesson} of ${totalLessons}`;
    };
}

// Offline support
function handleOfflineMode() {
    window.addEventListener('online', function() {
        console.log('Back online - sending queued xAPI statements');
        if (window.xapiWrapper) {
            xapiWrapper.sendQueuedStatements();
        }
    });
    
    window.addEventListener('offline', function() {
        console.log('Gone offline - statements will be queued');
    });
}

// Performance monitoring
function trackPerformance() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        if (window.xapiWrapper) {
            xapiWrapper.interactedWithElement('performance', 'page-load', {
                loadTime: Math.round(loadTime),
                timestamp: Date.now()
            });
        }
    });
    
    // Track lesson engagement time
    let engagementStart = Date.now();
    let isEngaged = true;
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (isEngaged) {
                const engagementTime = Date.now() - engagementStart;
                console.log(`Engagement time: ${Math.round(engagementTime / 1000)}s`);
                isEngaged = false;
            }
        } else {
            engagementStart = Date.now();
            isEngaged = true;
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    addAccessibilityFeatures();
    handleOfflineMode();
    trackPerformance();
});

// Auto-save progress
setInterval(function() {
    if (window.xapiWrapper) {
        const progressPercent = Math.round((currentLesson / totalLessons) * 100);
        xapiWrapper.trackProgress(currentLesson, progressPercent);
    }
}, 30000); // Every 30 seconds