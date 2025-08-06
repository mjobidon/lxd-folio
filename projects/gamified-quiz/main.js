// Main JavaScript for Gamified Safety Assessment
class SafetyQuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.timeRemaining = 30;
        this.timer = null;
        this.difficulty = 'normal';
        this.gameStartTime = null;
        this.questionStartTime = null;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.totalTime = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.powerupsUsed = [];
        this.earnedBadges = [];
        this.questionTimes = [];
        this.gameData = window.gameData;
        this.currentQuestionData = null;
        this.gameState = 'welcome'; // welcome, playing, results
        
        this.initializeGame();
    }

    initializeGame() {
        this.updateDisplay();
        this.setupEventListeners();
        console.log('Safety Quiz Game initialized');
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                if (e.key >= '1' && e.key <= '4') {
                    const answerIndex = parseInt(e.key) - 1;
                    const answerButtons = document.querySelectorAll('.answer-btn');
                    if (answerButtons[answerIndex]) {
                        this.selectAnswer(answerButtons[answerIndex], answerIndex);
                    }
                }
            }
        });

        // Prevent accidental page refresh during game
        window.addEventListener('beforeunload', (e) => {
            if (this.gameState === 'playing') {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // Update difficulty button selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        
        // Update game settings based on difficulty
        const settings = this.gameData.difficultySettings[difficulty];
        this.timeRemaining = settings.timeLimit;
        this.lives = settings.livesCount;
        
        console.log(`Difficulty set to: ${difficulty}`);
    }

    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.powerupsUsed = [];
        this.earnedBadges = [];
        this.questionTimes = [];
        
        // Reset powerups
        this.resetPowerups();
        
        // Show game screen
        this.showScreen('gameScreen');
        
        // Load first question
        this.loadQuestion();
        
        console.log('Game started with difficulty:', this.difficulty);
    }

    resetPowerups() {
        this.gameData.powerups.forEach(powerup => {
            const btn = document.getElementById(powerup.id);
            if (btn) {
                btn.disabled = false;
                btn.querySelector('.powerup-count').textContent = powerup.uses;
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    loadQuestion() {
        if (this.currentQuestion >= this.gameData.questions.length) {
            this.endGame();
            return;
        }

        this.currentQuestionData = this.gameData.questions[this.currentQuestion];
        this.questionStartTime = Date.now();
        
        // Update question counter and progress
        this.updateProgress();
        
        // Update scenario badge
        document.getElementById('scenarioBadge').textContent = 
            `${this.currentQuestionData.category}`;
        
        // Update scenario image
        const scenarioImage = document.getElementById('scenarioImage');
        scenarioImage.innerHTML = `
            <div class="image-placeholder">
                <div class="scenario-icon">${this.currentQuestionData.icon}</div>
            </div>
        `;
        
        // Update question content
        document.getElementById('questionTitle').textContent = this.currentQuestionData.title;
        document.getElementById('questionDescription').textContent = this.currentQuestionData.description;
        
        // Load answers
        this.loadAnswers();
        
        // Start timer
        this.startTimer();
        
        console.log(`Loaded question ${this.currentQuestion + 1}:`, this.currentQuestionData.title);
    }

    loadAnswers() {
        const answerGrid = document.getElementById('answerGrid');
        answerGrid.innerHTML = '';
        
        this.currentQuestionData.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer.text;
            button.onclick = () => this.selectAnswer(button, index);
            answerGrid.appendChild(button);
        });
    }

    startTimer() {
        const settings = this.gameData.difficultySettings[this.difficulty];
        this.timeRemaining = settings.timeLimit;
        
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        document.getElementById('timerText').textContent = this.timeRemaining;
        document.getElementById('timeRemaining').textContent = `${this.timeRemaining}s`;
        
        // Update timer ring
        const circumference = 2 * Math.PI * 26;
        const settings = this.gameData.difficultySettings[this.difficulty];
        const progress = this.timeRemaining / settings.timeLimit;
        const offset = circumference * (1 - progress);
        
        const progressRing = document.querySelector('.timer-ring-progress');
        if (progressRing) {
            progressRing.style.strokeDasharray = circumference;
            progressRing.style.strokeDashoffset = offset;
            
            // Change color based on time remaining
            if (this.timeRemaining <= 5) {
                progressRing.style.stroke = '#f44336';
            } else if (this.timeRemaining <= 10) {
                progressRing.style.stroke = '#FF6B6B';
            } else {
                progressRing.style.stroke = '#4ECDC4';
            }
        }
    }

    selectAnswer(button, answerIndex) {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const answer = this.currentQuestionData.answers[answerIndex];
        const responseTime = Date.now() - this.questionStartTime;
        this.questionTimes.push(responseTime / 1000);
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // Show correct/incorrect styling
        button.classList.add('selected');
        
        setTimeout(() => {
            this.processAnswer(answer, responseTime, button);
        }, 500);
    }

    processAnswer(answer, responseTime, selectedButton) {
        const isCorrect = answer.correct;
        
        // Show correct answer
        document.querySelectorAll('.answer-btn').forEach((btn, index) => {
            const answerData = this.currentQuestionData.answers[index];
            if (answerData.correct) {
                btn.classList.add('correct');
            } else if (btn === selectedButton && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Calculate points
        let points = 0;
        if (isCorrect) {
            points = this.calculatePoints(responseTime);
            this.score += points;
            this.correctAnswers++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            this.playSound('correct');
        } else {
            this.incorrectAnswers++;
            this.lives--;
            this.streak = 0;
            points = this.gameData.scoringSystem.penaltyPoints.wrongAnswer;
            this.score = Math.max(0, this.score + points);
            this.playSound('incorrect');
        }
        
        // Show feedback modal
        this.showFeedback(isCorrect, answer, points);
        
        // Update display
        this.updateDisplay();
        
        // Check for achievements
        this.checkAchievements();
        
        // Check game over conditions
        if (this.lives <= 0) {
            setTimeout(() => this.endGame(), 2000);
        }
    }

    calculatePoints(responseTime) {
        const settings = this.gameData.difficultySettings[this.difficulty];
        const basePoints = this.gameData.scoringSystem.basePoints;
        let points = Math.round(basePoints * settings.pointsMultiplier);
        
        // Time bonus
        const timeInSeconds = responseTime / 1000;
        if (timeInSeconds < 10) {
            points += this.gameData.scoringSystem.timeBonus.excellent;
        } else if (timeInSeconds < 20) {
            points += this.gameData.scoringSystem.timeBonus.good;
        }
        
        // Streak bonus
        const streakBonus = this.gameData.scoringSystem.streakBonus[this.streak];
        if (streakBonus) {
            points += streakBonus;
            this.showAchievement(`${this.streak} in a row! Streak bonus: +${streakBonus}`);
        }
        
        return points;
    }

    showFeedback(isCorrect, answer, points) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const title = document.getElementById('feedbackTitle');
        const text = document.getElementById('feedbackText');
        const explanation = document.getElementById('feedbackExplanation');
        const pointsEarned = document.getElementById('pointsEarned');
        
        if (isCorrect) {
            icon.textContent = '✅';
            title.textContent = 'Correct!';
            title.style.color = '#4CAF50';
            text.textContent = this.getRandomMessage('correct');
        } else {
            icon.textContent = '❌';
            title.textContent = 'Incorrect';
            title.style.color = '#f44336';
            text.textContent = this.getRandomMessage('incorrect');
        }
        
        explanation.innerHTML = `<strong>Explanation:</strong> ${answer.explanation}`;
        pointsEarned.textContent = points > 0 ? `+${points}` : `${points}`;
        pointsEarned.style.color = points > 0 ? '#4CAF50' : '#f44336';
        
        modal.classList.add('active');
    }

    getRandomMessage(type) {
        const messages = this.gameData.achievements.motivationalMessages[type];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    nextQuestion() {
        // Hide feedback modal
        document.getElementById('feedbackModal').classList.remove('active');
        
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.gameData.questions.length || this.lives <= 0) {
            this.endGame();
        } else {
            this.loadQuestion();
        }
    }

    handleTimeOut() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.incorrectAnswers++;
        this.lives--;
        this.streak = 0;
        const penalty = this.gameData.scoringSystem.penaltyPoints.timeOut;
        this.score = Math.max(0, this.score + penalty);
        
        // Show timeout feedback
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const title = document.getElementById('feedbackTitle');
        const text = document.getElementById('feedbackText');
        const explanation = document.getElementById('feedbackExplanation');
        const pointsEarned = document.getElementById('pointsEarned');
        
        icon.textContent = '⏰';
        title.textContent = 'Time\'s Up!';
        title.style.color = '#FF6B6B';
        text.textContent = this.getRandomMessage('timeOut');
        
        // Show correct answer
        const correctAnswer = this.currentQuestionData.answers.find(a => a.correct);
        explanation.innerHTML = `<strong>Correct Answer:</strong> ${correctAnswer.text}<br><strong>Explanation:</strong> ${correctAnswer.explanation}`;
        pointsEarned.textContent = `${penalty}`;
        pointsEarned.style.color = '#f44336';
        
        modal.classList.add('active');
        
        this.updateDisplay();
        this.playSound('incorrect');
        
        if (this.lives <= 0) {
            setTimeout(() => this.endGame(), 2000);
        }
    }

    usePowerup(powerupId) {
        const powerupBtn = document.getElementById(powerupId);
        const countElement = powerupBtn.querySelector('.powerup-count');
        const currentCount = parseInt(countElement.textContent);
        
        if (currentCount <= 0) return;
        
        this.powerupsUsed.push(powerupId);
        
        switch (powerupId) {
            case 'fiftyFifty':
                this.applyFiftyFifty();
                break;
            case 'extraTime':
                this.applyExtraTime();
                break;
            case 'skipQuestion':
                this.applySkipQuestion();
                break;
        }
        
        // Update powerup count
        countElement.textContent = currentCount - 1;
        if (currentCount - 1 <= 0) {
            powerupBtn.disabled = true;
        }
        
        console.log(`Used powerup: ${powerupId}`);
    }

    applyFiftyFifty() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        const incorrectButtons = [];
        
        answerButtons.forEach((btn, index) => {
            if (!this.currentQuestionData.answers[index].correct) {
                incorrectButtons.push(btn);
            }
        });
        
        // Remove 2 incorrect answers
        for (let i = 0; i < 2 && i < incorrectButtons.length; i++) {
            const randomIndex = Math.floor(Math.random() * incorrectButtons.length);
            const buttonToRemove = incorrectButtons.splice(randomIndex, 1)[0];
            buttonToRemove.style.opacity = '0.3';
            buttonToRemove.disabled = true;
        }
        
        this.showAchievement('50/50 used! Two wrong answers removed.');
    }

    applyExtraTime() {
        this.timeRemaining += 15;
        this.showAchievement('Extra time! +15 seconds added.');
    }

    applySkipQuestion() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Award partial points for skipping
        const skipPoints = Math.round(this.gameData.scoringSystem.basePoints * 0.5);
        this.score += skipPoints;
        
        this.showAchievement(`Question skipped! +${skipPoints} points awarded.`);
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }

    checkAchievements() {
        this.gameData.badges.forEach(badge => {
            if (this.earnedBadges.includes(badge.id)) return;
            
            let earned = false;
            
            switch (badge.requirement) {
                case 'fast_answers':
                    const fastAnswers = this.questionTimes.filter(time => time < 15).length;
                    earned = fastAnswers >= badge.threshold;
                    break;
                    
                case 'perfect_accuracy':
                    earned = this.incorrectAnswers === 0 && this.currentQuestion === this.gameData.questions.length - 1;
                    break;
                    
                case 'category_mastery':
                    // Check if all questions in category were answered correctly
                    const categoryQuestions = this.gameData.questions.filter(q => q.category === badge.category);
                    const answeredCategoryQuestions = categoryQuestions.slice(0, this.currentQuestion + 1);
                    earned = answeredCategoryQuestions.length > 0 && 
                            answeredCategoryQuestions.every((q, index) => 
                                this.questionTimes[this.gameData.questions.indexOf(q)] !== undefined);
                    break;
                    
                case 'high_score':
                    earned = this.score >= badge.threshold;
                    break;
                    
                case 'powerup_usage':
                    earned = this.powerupsUsed.length >= badge.threshold;
                    break;
            }
            
            if (earned) {
                this.earnedBadges.push(badge.id);
                this.showAchievement(`Badge Earned: ${badge.name}!`);
                this.playSound('achievement');
            }
        });
    }

    showAchievement(message) {
        const toast = document.getElementById('achievementToast');
        const description = document.getElementById('achievementDescription');
        
        description.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.gameData.questions.length) * 100;
        document.getElementById('gameProgress').style.width = `${progress}%`;
        document.getElementById('questionCounter').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.gameData.questions.length}`;
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('currentLives').textContent = this.lives;
    }

    endGame() {
        this.gameState = 'results';
        this.totalTime = (Date.now() - this.gameStartTime) / 1000;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Final achievement checks
        this.checkFinalAchievements();
        
        // Show results screen
        this.showResults();
        
        console.log('Game ended. Final score:', this.score);
    }

    checkFinalAchievements() {
        // Check time-based achievements
        if (this.totalTime < 300) { // 5 minutes
            const badge = this.gameData.badges.find(b => b.id === 'quick_learner');
            if (badge && !this.earnedBadges.includes(badge.id)) {
                this.earnedBadges.push(badge.id);
            }
        }
        
        // Check perfect score
        if (this.incorrectAnswers === 0) {
            const badge = this.gameData.badges.find(b => b.id === 'perfect_score');
            if (badge && !this.earnedBadges.includes(badge.id)) {
                this.earnedBadges.push(badge.id);
            }
        }
    }

    showResults() {
        this.showScreen('resultsScreen');
        
        // Update results display
        const accuracy = Math.round((this.correctAnswers / (this.correctAnswers + this.incorrectAnswers)) * 100) || 0;
        const averageTime = this.questionTimes.length > 0 ? 
            Math.round(this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length) : 0;
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('incorrectAnswers').textContent = this.incorrectAnswers;
        document.getElementById('averageTime').textContent = `${averageTime}s`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        // Show appropriate results icon and title
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        
        if (accuracy >= 80) {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Excellent Work!';
        } else if (accuracy >= 60) {
            resultsIcon.textContent = '🎯';
            resultsTitle.textContent = 'Good Job!';
        } else {
            resultsIcon.textContent = '📚';
            resultsTitle.textContent = 'Keep Learning!';
        }
        
        // Show earned badges
        this.displayBadges();
        
        // Update leaderboard
        this.updateLeaderboard();
    }

    displayBadges() {
        const badgesGrid = document.getElementById('badgesGrid');
        badgesGrid.innerHTML = '';
        
        if (this.earnedBadges.length === 0) {
            badgesGrid.innerHTML = '<p style="color: #6c757d;">No badges earned this time. Try again!</p>';
            return;
        }
        
        this.earnedBadges.forEach(badgeId => {
            const badge = this.gameData.badges.find(b => b.id === badgeId);
            if (badge) {
                const badgeElement = document.createElement('div');
                badgeElement.className = 'badge-item';
                badgeElement.innerHTML = `
                    <div class="badge-icon">${badge.icon}</div>
                    <div class="badge-name">${badge.name}</div>
                `;
                badgesGrid.appendChild(badgeElement);
            }
        });
    }

    updateLeaderboard() {
        // Add current score to leaderboard
        const newEntry = { name: 'You', score: this.score, rank: 0 };
        const leaderboard = [...this.gameData.leaderboard, newEntry];
        leaderboard.sort((a, b) => b.score - a.score);
        
        // Update ranks
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });
        
        const playerEntry = leaderboard.find(entry => entry.name === 'You');
        
        // Update player rank display
        document.getElementById('playerRank').textContent = `#${playerEntry.rank}`;
        document.getElementById('leaderboardScore').textContent = `${playerEntry.score} points`;
        
        // Update rank badge
        const rankBadge = document.getElementById('rankBadge');
        if (playerEntry.rank === 1) {
            rankBadge.textContent = '🥇';
        } else if (playerEntry.rank === 2) {
            rankBadge.textContent = '🥈';
        } else if (playerEntry.rank === 3) {
            rankBadge.textContent = '🥉';
        } else {
            rankBadge.textContent = '🏅';
        }
        
        // Show top 3 scores
        const topScores = document.getElementById('topScores');
        topScores.innerHTML = '';
        
        leaderboard.slice(0, 3).forEach(entry => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <div class="score-rank">#${entry.rank}</div>
                <div class="score-name">${entry.name}</div>
                <div class="score-points">${entry.score}</div>
            `;
            topScores.appendChild(scoreItem);
        });
    }

    playAgain() {
        // Reset game state
        this.currentQuestion = 0;
        this.score = 0;
        this.lives = this.gameData.difficultySettings[this.difficulty].livesCount;
        this.level = 1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.powerupsUsed = [];
        this.earnedBadges = [];
        this.questionTimes = [];
        
        // Show welcome screen
        this.gameState = 'welcome';
        this.showScreen('welcomeScreen');
        
        // Update display
        this.updateDisplay();
    }

    shareResults() {
        const shareText = `I just scored ${this.score} points on the Safety Quest quiz! ` +
                         `Got ${this.correctAnswers} out of ${this.correctAnswers + this.incorrectAnswers} questions right. ` +
                         `Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Safety Quest Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    viewCertificate() {
        const accuracy = Math.round((this.correctAnswers / (this.correctAnswers + this.incorrectAnswers)) * 100) || 0;
        
        if (accuracy >= 80) {
            alert('🏆 Congratulations! You\'ve earned a Safety Excellence Certificate!\n\n' +
                  'In a real implementation, this would generate a downloadable PDF certificate ' +
                  'with your name, score, completion date, and official safety training credentials.');
        } else {
            alert('📚 Certificate requires 80% or higher score.\n\n' +
                  'Keep practicing and try again to earn your Safety Excellence Certificate!');
        }
    }

    playSound(type) {
        const audio = document.getElementById(`${type}Sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                // Ignore audio play errors (browser restrictions)
                console.log('Audio play prevented by browser');
            });
        }
    }
}

// Global functions for HTML onclick handlers
function selectDifficulty(difficulty) {
    if (window.safetyGame) {
        window.safetyGame.selectDifficulty(difficulty);
    }
}

function startGame() {
    if (window.safetyGame) {
        window.safetyGame.startGame();
    }
}

function usePowerup(powerupId) {
    if (window.safetyGame) {
        window.safetyGame.usePowerup(powerupId);
    }
}

function nextQuestion() {
    if (window.safetyGame) {
        window.safetyGame.nextQuestion();
    }
}

function playAgain() {
    if (window.safetyGame) {
        window.safetyGame.playAgain();
    }
}

function shareResults() {
    if (window.safetyGame) {
        window.safetyGame.shareResults();
    }
}

function viewCertificate() {
    if (window.safetyGame) {
        window.safetyGame.viewCertificate();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.safetyGame = new SafetyQuizGame();
    console.log('Safety Quiz Game loaded successfully');
});