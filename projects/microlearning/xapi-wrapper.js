// xAPI Wrapper for Microlearning Series
class XAPIWrapper {
    constructor() {
        this.endpoint = null;
        this.auth = null;
        this.actor = {
            name: "Microlearning User",
            mbox: "mailto:user@example.com"
        };
        this.activityId = "http://example.com/microlearning-series";
        this.statements = [];
        this.initializeMockLRS();
    }

    initializeMockLRS() {
        // Mock LRS for demonstration
        console.log('xAPI: Initializing mock Learning Record Store');
        this.endpoint = "http://example.com/xapi/";
        this.auth = "mock-auth-token";
    }

    // Core xAPI statement creation
    createStatement(verb, object, result = null, context = null) {
        const statement = {
            id: this.generateUUID(),
            timestamp: new Date().toISOString(),
            actor: this.actor,
            verb: {
                id: `http://adlnet.gov/expapi/verbs/${verb}`,
                display: { "en-US": verb }
            },
            object: {
                id: this.activityId,
                definition: {
                    name: { "en-US": object.name || "Microlearning Activity" },
                    description: { "en-US": object.description || "Digital Communication Microlearning Series" },
                    type: object.type || "http://adlnet.gov/expapi/activities/course"
                }
            }
        };

        if (result) {
            statement.result = result;
        }

        if (context) {
            statement.context = context;
        }

        return statement;
    }

    // Send statement to LRS
    sendStatement(statement) {
        this.statements.push(statement);
        console.log('xAPI Statement Sent:', statement);
        
        // Simulate sending to actual LRS
        if (window.parent && window.parent.postMessage) {
            window.parent.postMessage({
                type: 'xapi-statement',
                statement: statement
            }, '*');
        }

        return true;
    }

    // Convenience methods for common verbs
    experienced(object, result = null, context = null) {
        const statement = this.createStatement('experienced', object, result, context);
        return this.sendStatement(statement);
    }

    completed(object, result = null, context = null) {
        const statement = this.createStatement('completed', object, result, context);
        return this.sendStatement(statement);
    }

    passed(object, result = null, context = null) {
        const statement = this.createStatement('passed', object, result, context);
        return this.sendStatement(statement);
    }

    failed(object, result = null, context = null) {
        const statement = this.createStatement('failed', object, result, context);
        return this.sendStatement(statement);
    }

    answered(object, result = null, context = null) {
        const statement = this.createStatement('answered', object, result, context);
        return this.sendStatement(statement);
    }

    interacted(object, result = null, context = null) {
        const statement = this.createStatement('interacted', object, result, context);
        return this.sendStatement(statement);
    }

    // Specific methods for microlearning activities
    startedLesson(lessonNumber, lessonTitle) {
        return this.experienced({
            name: `Lesson ${lessonNumber}: ${lessonTitle}`,
            description: `Started lesson ${lessonNumber} of the Digital Communication series`,
            type: "http://adlnet.gov/expapi/activities/lesson"
        }, null, {
            instructor: {
                name: "Digital Communication Instructor",
                mbox: "mailto:instructor@example.com"
            },
            contextActivities: {
                parent: [{
                    id: this.activityId,
                    definition: {
                        name: { "en-US": "Digital Communication Microlearning Series" }
                    }
                }]
            }
        });
    }

    completedLesson(lessonNumber, lessonTitle, timeSpent, interactions = 0) {
        return this.completed({
            name: `Lesson ${lessonNumber}: ${lessonTitle}`,
            description: `Completed lesson ${lessonNumber} of the Digital Communication series`,
            type: "http://adlnet.gov/expapi/activities/lesson"
        }, {
            completion: true,
            duration: this.convertSecondsToISO8601(timeSpent),
            extensions: {
                "http://example.com/xapi/extensions/interactions": interactions
            }
        });
    }

    answeredQuestion(questionId, response, correct, lessonNumber) {
        return this.answered({
            name: `Question ${questionId}`,
            description: `Knowledge check question in lesson ${lessonNumber}`,
            type: "http://adlnet.gov/expapi/activities/cmi.interaction",
            interactionType: "choice"
        }, {
            response: response,
            success: correct,
            score: {
                scaled: correct ? 1.0 : 0.0
            }
        }, {
            contextActivities: {
                parent: [{
                    id: `${this.activityId}/lesson${lessonNumber}`,
                    definition: {
                        name: { "en-US": `Lesson ${lessonNumber}` }
                    }
                }]
            }
        });
    }

    interactedWithElement(elementType, elementId, lessonNumber, details = {}) {
        return this.interacted({
            name: `${elementType}: ${elementId}`,
            description: `Interacted with ${elementType} in lesson ${lessonNumber}`,
            type: "http://adlnet.gov/expapi/activities/interaction"
        }, {
            extensions: {
                "http://example.com/xapi/extensions/element-type": elementType,
                "http://example.com/xapi/extensions/details": details
            }
        }, {
            contextActivities: {
                parent: [{
                    id: `${this.activityId}/lesson${lessonNumber}`,
                    definition: {
                        name: { "en-US": `Lesson ${lessonNumber}` }
                    }
                }]
            }
        });
    }

    completedSeries(totalTime, totalInteractions, averageScore) {
        return this.completed({
            name: "Digital Communication Microlearning Series",
            description: "Completed the entire microlearning series",
            type: "http://adlnet.gov/expapi/activities/course"
        }, {
            completion: true,
            success: averageScore >= 0.8,
            score: {
                scaled: averageScore,
                raw: Math.round(averageScore * 100),
                min: 0,
                max: 100
            },
            duration: this.convertSecondsToISO8601(totalTime),
            extensions: {
                "http://example.com/xapi/extensions/total-interactions": totalInteractions,
                "http://example.com/xapi/extensions/lessons-completed": 3
            }
        });
    }

    // Utility methods
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    convertSecondsToISO8601(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `PT${hours}H${minutes}M${secs}S`;
    }

    // Analytics and reporting
    getStatements() {
        return this.statements;
    }

    getStatementsByVerb(verb) {
        return this.statements.filter(statement => 
            statement.verb.id.includes(verb)
        );
    }

    getCompletionData() {
        const completedStatements = this.getStatementsByVerb('completed');
        const experiencedStatements = this.getStatementsByVerb('experienced');
        
        return {
            totalActivities: experiencedStatements.length,
            completedActivities: completedStatements.length,
            completionRate: completedStatements.length / experiencedStatements.length,
            statements: this.statements
        };
    }

    // Progress tracking
    trackProgress(lessonNumber, progressPercentage) {
        return this.experienced({
            name: `Lesson ${lessonNumber} Progress`,
            description: `Progress update for lesson ${lessonNumber}`,
            type: "http://adlnet.gov/expapi/activities/lesson"
        }, {
            extensions: {
                "http://example.com/xapi/extensions/progress": progressPercentage,
                "http://example.com/xapi/extensions/timestamp": Date.now()
            }
        });
    }

    // Offline support
    queueStatement(statement) {
        const queuedStatements = JSON.parse(localStorage.getItem('xapi-queue') || '[]');
        queuedStatements.push(statement);
        localStorage.setItem('xapi-queue', JSON.stringify(queuedStatements));
    }

    sendQueuedStatements() {
        const queuedStatements = JSON.parse(localStorage.getItem('xapi-queue') || '[]');
        
        queuedStatements.forEach(statement => {
            this.sendStatement(statement);
        });
        
        localStorage.removeItem('xapi-queue');
        console.log(`xAPI: Sent ${queuedStatements.length} queued statements`);
    }

    // Session management
    startSession() {
        this.sessionStart = Date.now();
        return this.experienced({
            name: "Microlearning Session",
            description: "Started a new microlearning session",
            type: "http://adlnet.gov/expapi/activities/session"
        });
    }

    endSession() {
        const sessionDuration = Date.now() - this.sessionStart;
        return this.completed({
            name: "Microlearning Session",
            description: "Ended microlearning session",
            type: "http://adlnet.gov/expapi/activities/session"
        }, {
            completion: true,
            duration: this.convertSecondsToISO8601(Math.round(sessionDuration / 1000))
        });
    }
}

// Global xAPI wrapper instance
let xapiWrapper = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    xapiWrapper = new XAPIWrapper();
    xapiWrapper.startSession();
    
    // Send queued statements if any
    xapiWrapper.sendQueuedStatements();
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (xapiWrapper) {
        xapiWrapper.endSession();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XAPIWrapper;
} else {
    window.XAPIWrapper = XAPIWrapper;
}