// Main JavaScript for Interactive Compliance Training
let currentSlide = 1;
let totalSlides = 12; // Adjust based on actual number of slides
let userDecisions = {};
let quizAnswers = {};
let currentQuizQuestion = 1;
let totalQuizQuestions = 5;
let startTime = Date.now();

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    updateProgress();
    
    // Load any saved progress from SCORM
    if (window.scormWrapper) {
        const progress = scormWrapper.getProgress();
        if (progress.currentSlide) {
            currentSlide = progress.currentSlide;
            showSlide(currentSlide);
        }
    }
});

// Navigation functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
        updateProgress();
        
        // Save progress to SCORM
        if (window.scormWrapper) {
            scormWrapper.saveProgress(currentSlide, {
                decisions: userDecisions,
                quizAnswers: quizAnswers
            });
        }
    }
}

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show target slide
    const targetSlide = document.getElementById(`slide${slideNumber}`) || 
                       document.getElementById(`quiz${slideNumber - 6}`) ||
                       document.getElementById('quizResults') ||
                       document.getElementById('completion');
    
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
    
    // Special handling for quiz slides
    if (slideNumber >= 7 && slideNumber <= 11) {
        const quizNumber = slideNumber - 6;
        showQuizQuestion(quizNumber);
    }
}

function updateProgress() {
    const progressPercent = Math.round((currentSlide / totalSlides) * 100);
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${progressPercent}% Complete`;
    }
}

// Decision handling for scenarios
function makeDecision(scenario, decision) {
    userDecisions[scenario] = decision;
    
    // Record interaction in SCORM
    if (window.scormWrapper) {
        scormWrapper.recordInteraction(
            scenario,
            'choice',
            decision,
            'correct', // We'll determine this based on the decision
            `Decision made in ${scenario}`
        );
    }
    
    // Provide feedback based on decision
    setTimeout(() => {
        showDecisionFeedback(scenario, decision);
        nextSlide();
    }, 500);
}

function showDecisionFeedback(scenario, decision) {
    let feedbackData = getFeedbackData(scenario, decision);
    
    // Update feedback slide content
    const feedbackIcon = document.getElementById('feedbackIcon') || document.getElementById('feedbackIcon2');
    const feedbackTitle = document.getElementById('feedbackTitle') || document.getElementById('feedbackTitle2');
    const feedbackContent = document.getElementById('feedbackContent') || document.getElementById('feedbackContent2');
    const learningPoints = document.getElementById('learningPoints') || document.getElementById('learningPoints2');
    
    if (feedbackIcon) {
        feedbackIcon.textContent = feedbackData.correct ? '✓' : '⚠';
        feedbackIcon.className = `feedback-icon ${feedbackData.correct ? 'correct' : 'incorrect'}`;
    }
    
    if (feedbackTitle) {
        feedbackTitle.textContent = feedbackData.title;
        feedbackTitle.className = feedbackData.correct ? 'correct' : 'incorrect';
    }
    
    if (feedbackContent) {
        feedbackContent.innerHTML = `<p>${feedbackData.content}</p>`;
    }
    
    if (learningPoints) {
        learningPoints.innerHTML = '';
        feedbackData.points.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            learningPoints.appendChild(li);
        });
    }
}

function getFeedbackData(scenario, decision) {
    const feedbackMap = {
        scenario1: {
            share: {
                correct: false,
                title: 'Think Again',
                content: 'Sharing confidential information, even with colleagues, violates company policy and could harm the business.',
                points: [
                    'Never share confidential information without authorization',
                    'Trust is not a substitute for proper procedures',
                    'Consider the potential consequences of information leaks'
                ]
            },
            decline: {
                correct: true,
                title: 'Excellent Choice!',
                content: 'You correctly protected confidential information while maintaining a professional relationship.',
                points: [
                    'Always protect confidential company information',
                    'Politely but firmly decline inappropriate requests',
                    'When in doubt, refer to company policies'
                ]
            },
            redirect: {
                correct: true,
                title: 'Good Response!',
                content: 'Redirecting to the appropriate person shows good judgment and protects confidential information.',
                points: [
                    'Know who has authority to share information',
                    'Redirect rather than refuse when appropriate',
                    'Maintain professional relationships while following policy'
                ]
            }
        },
        scenario2: {
            ignore: {
                correct: false,
                title: 'Not the Best Choice',
                content: 'Ignoring harassment allows it to continue and may make you complicit in creating a hostile work environment.',
                points: [
                    'Bystander intervention is everyone\'s responsibility',
                    'Silence can be interpreted as acceptance',
                    'Consider the impact on the victim and workplace culture'
                ]
            },
            intervene: {
                correct: true,
                title: 'Excellent Response!',
                content: 'Taking immediate, safe action helps protect the victim and demonstrates your commitment to a respectful workplace.',
                points: [
                    'Bystander intervention is everyone\'s responsibility',
                    'Document incidents for proper reporting',
                    'Support colleagues in uncomfortable situations'
                ]
            },
            report: {
                correct: true,
                title: 'Good Choice!',
                content: 'Documenting and reporting ensures proper investigation and helps prevent future incidents.',
                points: [
                    'Documentation is crucial for investigations',
                    'HR needs to know about harassment incidents',
                    'Reporting protects both victims and the organization'
                ]
            }
        }
    };
    
    return feedbackMap[scenario][decision];
}

// Quiz functions
function startQuiz() {
    currentSlide = 7; // First quiz slide
    showSlide(currentSlide);
    updateProgress();
    
    if (window.complianceQuiz) {
        complianceQuiz.sendXAPIStatement('attempted', {
            description: 'Started compliance training quiz'
        });
    }
}

function showQuizQuestion(questionNumber) {
    // This function handles the display of quiz questions
    // Questions are already in the HTML, so we just need to track progress
    console.log(`Showing quiz question ${questionNumber}`);
}

function nextQuizQuestion(questionNumber) {
    // Get the selected answer
    const selectedAnswer = document.querySelector(`input[name="q${questionNumber}"]:checked`);
    
    if (!selectedAnswer) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    // Record the answer
    quizAnswers[`q${questionNumber}`] = selectedAnswer.value;
    
    if (window.complianceQuiz) {
        complianceQuiz.recordAnswer(questionNumber, selectedAnswer.value);
    }
    
    // Move to next question or results
    if (questionNumber < totalQuizQuestions) {
        currentSlide++;
        showSlide(currentSlide);
        updateProgress();
    } else {
        // Show results
        showQuizResults();
    }
}

function showQuizResults() {
    currentSlide = 12; // Results slide
    showSlide(currentSlide);
    updateProgress();
    
    // Calculate score
    let score = calculateQuizScore();
    let passed = score >= 80;
    
    // Update results display
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreStatus = document.getElementById('scoreStatus');
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsBreakdown = document.getElementById('resultsBreakdown');
    
    if (scoreNumber) scoreNumber.textContent = score;
    if (scoreStatus) {
        scoreStatus.textContent = passed ? 'Passed!' : 'Failed';
        scoreStatus.className = `score-status ${passed ? 'passed' : 'failed'}`;
    }
    if (resultsIcon) resultsIcon.textContent = passed ? '🏆' : '📚';
    if (resultsTitle) resultsTitle.textContent = passed ? 'Congratulations!' : 'Keep Learning!';
    if (resultsBreakdown) {
        const correctAnswers = Math.round(score / 20); // Convert percentage to number of correct answers
        resultsBreakdown.innerHTML = `
            <p>You answered <strong>${correctAnswers} out of ${totalQuizQuestions}</strong> questions correctly.</p>
            <p>${passed ? 'You have successfully completed the Compliance Training.' : 'Please review the material and retake the assessment.'}</p>
        `;
    }
    
    // Record results in SCORM
    if (window.scormWrapper) {
        if (passed) {
            scormWrapper.markPassed(score);
        } else {
            scormWrapper.markFailed(score);
        }
    }
    
    // Send xAPI completion statement
    if (window.complianceQuiz) {
        complianceQuiz.sendXAPIStatement('completed', {
            score: score,
            passed: passed,
            timeSpent: Math.round((Date.now() - startTime) / 1000 / 60)
        });
    }
}

function calculateQuizScore() {
    // Correct answers for the quiz
    const correctAnswers = {
        q1: 'b', // Politely decline and refer to company policy
        q2: 'b', // Intervene safely and document the incident
        q3: 'b', // Owning stock in a company you negotiate contracts with
        q4: 'b', // Check company policy and report if required
        q5: 'b'  // Report it immediately to your supervisor
    };
    
    let correct = 0;
    for (let i = 1; i <= totalQuizQuestions; i++) {
        if (quizAnswers[`q${i}`] === correctAnswers[`q${i}`]) {
            correct++;
        }
    }
    
    return Math.round((correct / totalQuizQuestions) * 100);
}

function generateCertificate() {
    // In a real implementation, this would generate a PDF certificate
    alert('Certificate generation would be implemented here. In a real system, this would create a downloadable PDF certificate with the learner\'s name, completion date, and score.');
    
    // Simulate certificate generation
    const certificateData = {
        learnerName: 'Learner Name',
        courseName: 'Interactive Compliance Training',
        completionDate: new Date().toLocaleDateString(),
        score: document.getElementById('scoreNumber').textContent + '%',
        instructor: 'Sarah Johnson, Compliance Officer'
    };
    
    console.log('Certificate Data:', certificateData);
}

function completeCourse() {
    currentSlide = 13; // Completion slide
    showSlide(currentSlide);
    updateProgress();
    
    // Update completion stats
    const timeSpent = document.getElementById('timeSpent');
    const finalScore = document.getElementById('finalScore');
    
    if (timeSpent) {
        const minutes = Math.round((Date.now() - startTime) / 1000 / 60);
        timeSpent.textContent = `${minutes} minutes`;
    }
    
    if (finalScore) {
        finalScore.textContent = document.getElementById('scoreNumber').textContent + '%';
    }
    
    // Mark as complete in SCORM
    if (window.scormWrapper) {
        scormWrapper.markComplete();
    }
}

function restartCourse() {
    // Reset all variables
    currentSlide = 1;
    userDecisions = {};
    quizAnswers = {};
    currentQuizQuestion = 1;
    startTime = Date.now();
    
    // Reset quiz
    if (window.complianceQuiz) {
        initializeQuiz();
    }
    
    // Reset form inputs
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => input.checked = false);
    
    // Show first slide
    showSlide(1);
    updateProgress();
}

function exitCourse() {
    // In a real implementation, this would close the window or redirect
    if (confirm('Are you sure you want to exit the course?')) {
        if (window.scormWrapper) {
            scormWrapper.finish();
        }
        
        // Try to close the window or redirect to parent
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'course-exit' }, '*');
        } else {
            window.close();
        }
    }
}

// Character animation functions
function animateCharacter(characterId, animation) {
    const character = document.getElementById(characterId);
    if (character) {
        character.classList.add(animation);
        setTimeout(() => {
            character.classList.remove(animation);
        }, 2000);
    }
}

// Auto-animate characters when slides become active
function observeSlideChanges() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const slide = mutation.target;
                if (slide.classList.contains('active')) {
                    // Animate characters in the active slide
                    const characters = slide.querySelectorAll('.character');
                    characters.forEach((character, index) => {
                        setTimeout(() => {
                            character.classList.add('speaking');
                            setTimeout(() => {
                                character.classList.remove('speaking');
                            }, 2000);
                        }, index * 1000);
                    });
                }
            }
        });
    });
    
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        observer.observe(slide, { attributes: true });
    });
}

// Initialize character animations
document.addEventListener('DOMContentLoaded', function() {
    observeSlideChanges();
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === 'Space') {
        // Next slide (only if not in quiz)
        if (currentSlide < 6 || currentSlide > 11) {
            nextSlide();
        }
    } else if (event.key === 'ArrowLeft') {
        // Previous slide (only if not in quiz and not first slide)
        if (currentSlide > 1 && (currentSlide < 6 || currentSlide > 11)) {
            currentSlide--;
            showSlide(currentSlide);
            updateProgress();
        }
    }
});

// Accessibility improvements
function addAccessibilityFeatures() {
    // Add ARIA labels and roles
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
    });
    
    // Add focus management
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = '3px solid #007bff';
        });
        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', addAccessibilityFeatures);