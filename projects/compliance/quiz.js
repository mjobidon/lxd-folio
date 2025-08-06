// Quiz Logic for Compliance Training
class ComplianceQuiz {
    constructor() {
        this.questions = [
            {
                id: 1,
                question: "What should you do if a colleague asks you to share confidential project information?",
                options: [
                    { value: "a", text: "Share it if they seem trustworthy", correct: false },
                    { value: "b", text: "Politely decline and refer to company policy", correct: true },
                    { value: "c", text: "Share only non-sensitive details", correct: false },
                    { value: "d", text: "Ask your manager first", correct: false }
                ],
                explanation: "Always protect confidential information by declining and referring to company policy."
            },
            {
                id: 2,
                question: "If you witness workplace harassment, what is the most appropriate immediate action?",
                options: [
                    { value: "a", text: "Ignore it to avoid conflict", correct: false },
                    { value: "b", text: "Intervene safely and document the incident", correct: true },
                    { value: "c", text: "Tell the victim to handle it themselves", correct: false },
                    { value: "d", text: "Gossip about it with other colleagues", correct: false }
                ],
                explanation: "Safe intervention and proper documentation are crucial for addressing harassment."
            },
            {
                id: 3,
                question: "Which of the following is considered a conflict of interest?",
                options: [
                    { value: "a", text: "Having lunch with a competitor", correct: false },
                    { value: "b", text: "Owning stock in a company you negotiate contracts with", correct: true },
                    { value: "c", text: "Attending industry conferences", correct: false },
                    { value: "d", text: "Reading competitor websites", correct: false }
                ],
                explanation: "Financial interests in companies you do business with create conflicts of interest."
            },
            {
                id: 4,
                question: "What is the best way to handle a gift from a vendor?",
                options: [
                    { value: "a", text: "Accept it if it's under $50", correct: false },
                    { value: "b", text: "Check company policy and report if required", correct: true },
                    { value: "c", text: "Accept it but don't tell anyone", correct: false },
                    { value: "d", text: "Return it immediately without explanation", correct: false }
                ],
                explanation: "Always check company policy regarding gifts and report when required."
            },
            {
                id: 5,
                question: "If you make a mistake that could impact the company, you should:",
                options: [
                    { value: "a", text: "Try to fix it quietly without telling anyone", correct: false },
                    { value: "b", text: "Report it immediately to your supervisor", correct: true },
                    { value: "c", text: "Wait to see if anyone notices", correct: false },
                    { value: "d", text: "Blame it on a system error", correct: false }
                ],
                explanation: "Transparency and immediate reporting help minimize damage and show integrity."
            }
        ];
        
        this.currentQuestion = 0;
        this.answers = {};
        this.score = 0;
        this.startTime = Date.now();
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    recordAnswer(questionId, answer) {
        this.answers[questionId] = answer;
        
        // Send xAPI statement
        this.sendXAPIStatement('answered', {
            questionId: questionId,
            answer: answer,
            correct: this.questions[questionId - 1].options.find(opt => opt.value === answer)?.correct || false
        });
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            const userAnswer = this.answers[question.id];
            const correctOption = question.options.find(opt => opt.correct);
            if (userAnswer === correctOption.value) {
                this.score++;
            }
        });
        return Math.round((this.score / this.questions.length) * 100);
    }

    isPassed() {
        return this.calculateScore() >= 80;
    }

    getTimeSpent() {
        return Math.round((Date.now() - this.startTime) / 1000 / 60); // minutes
    }

    sendXAPIStatement(verb, object) {
        // Simulate xAPI statement
        const statement = {
            actor: {
                name: "Learner",
                mbox: "mailto:learner@example.com"
            },
            verb: {
                id: `http://adlnet.gov/expapi/verbs/${verb}`,
                display: { "en-US": verb }
            },
            object: {
                id: "http://example.com/compliance-training",
                definition: {
                    name: { "en-US": "Compliance Training Quiz" },
                    description: { "en-US": "Interactive compliance training assessment" }
                }
            },
            result: object,
            timestamp: new Date().toISOString()
        };

        console.log('xAPI Statement:', statement);
        
        // In a real implementation, this would send to an LRS
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({
                type: 'xapi-statement',
                statement: statement
            }, '*');
        }
    }

    generateDetailedResults() {
        const results = {
            totalQuestions: this.questions.length,
            correctAnswers: this.score,
            percentage: this.calculateScore(),
            passed: this.isPassed(),
            timeSpent: this.getTimeSpent(),
            breakdown: []
        };

        this.questions.forEach((question, index) => {
            const userAnswer = this.answers[question.id];
            const correctOption = question.options.find(opt => opt.correct);
            const userOption = question.options.find(opt => opt.value === userAnswer);
            
            results.breakdown.push({
                question: question.question,
                userAnswer: userOption ? userOption.text : 'Not answered',
                correctAnswer: correctOption.text,
                isCorrect: userAnswer === correctOption.value,
                explanation: question.explanation
            });
        });

        return results;
    }
}

// Global quiz instance
let complianceQuiz = null;

// Quiz initialization
function initializeQuiz() {
    complianceQuiz = new ComplianceQuiz();
    console.log('Compliance Quiz initialized');
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComplianceQuiz;
} else {
    window.ComplianceQuiz = ComplianceQuiz;
}