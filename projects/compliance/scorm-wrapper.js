// SCORM 1.2 API Wrapper for Compliance Training
class SCORMWrapper {
    constructor() {
        this.initialized = false;
        this.API = null;
        this.findAPI();
        this.data = {
            'cmi.core.lesson_location': '',
            'cmi.core.lesson_status': 'not attempted',
            'cmi.core.score.raw': '',
            'cmi.core.score.max': '100',
            'cmi.core.score.min': '0',
            'cmi.core.session_time': '00:00:00',
            'cmi.core.exit': '',
            'cmi.suspend_data': '',
            'cmi.interactions._count': '0'
        };
        this.startTime = new Date();
    }

    findAPI() {
        // Look for SCORM API in parent windows
        let win = window;
        let attempts = 0;
        const maxAttempts = 500;

        while (win && attempts < maxAttempts) {
            if (win.API) {
                this.API = win.API;
                break;
            }
            if (win.parent && win.parent !== win) {
                win = win.parent;
            } else {
                break;
            }
            attempts++;
        }

        // If no API found, create a mock one for testing
        if (!this.API) {
            console.log('No SCORM API found, creating mock API for testing');
            this.createMockAPI();
        }
    }

    createMockAPI() {
        this.API = {
            LMSInitialize: () => {
                console.log('SCORM: LMSInitialize called');
                return 'true';
            },
            LMSFinish: () => {
                console.log('SCORM: LMSFinish called');
                return 'true';
            },
            LMSGetValue: (element) => {
                console.log(`SCORM: LMSGetValue(${element}) = ${this.data[element] || ''}`);
                return this.data[element] || '';
            },
            LMSSetValue: (element, value) => {
                console.log(`SCORM: LMSSetValue(${element}, ${value})`);
                this.data[element] = value;
                return 'true';
            },
            LMSCommit: () => {
                console.log('SCORM: LMSCommit called', this.data);
                return 'true';
            },
            LMSGetLastError: () => '0',
            LMSGetErrorString: () => 'No error',
            LMSGetDiagnostic: () => 'No diagnostic'
        };
    }

    initialize() {
        if (this.API && !this.initialized) {
            const result = this.API.LMSInitialize('');
            if (result === 'true') {
                this.initialized = true;
                this.setValue('cmi.core.lesson_status', 'incomplete');
                this.commit();
                console.log('SCORM initialized successfully');
                return true;
            }
        }
        return false;
    }

    getValue(element) {
        if (this.API && this.initialized) {
            return this.API.LMSGetValue(element);
        }
        return '';
    }

    setValue(element, value) {
        if (this.API && this.initialized) {
            return this.API.LMSSetValue(element, value) === 'true';
        }
        return false;
    }

    commit() {
        if (this.API && this.initialized) {
            return this.API.LMSCommit('') === 'true';
        }
        return false;
    }

    finish() {
        if (this.API && this.initialized) {
            this.calculateSessionTime();
            this.commit();
            const result = this.API.LMSFinish('');
            this.initialized = false;
            console.log('SCORM session finished');
            return result === 'true';
        }
        return false;
    }

    setScore(score) {
        this.setValue('cmi.core.score.raw', score.toString());
        this.commit();
    }

    setStatus(status) {
        // Status can be: passed, completed, failed, incomplete, browsed, not attempted
        this.setValue('cmi.core.lesson_status', status);
        this.commit();
    }

    setLocation(location) {
        this.setValue('cmi.core.lesson_location', location);
        this.commit();
    }

    setSuspendData(data) {
        this.setValue('cmi.suspend_data', JSON.stringify(data));
        this.commit();
    }

    getSuspendData() {
        const data = this.getValue('cmi.suspend_data');
        try {
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    }

    recordInteraction(id, type, response, result, description = '') {
        const count = parseInt(this.getValue('cmi.interactions._count')) || 0;
        const index = count;

        this.setValue('cmi.interactions._count', (count + 1).toString());
        this.setValue(`cmi.interactions.${index}.id`, id);
        this.setValue(`cmi.interactions.${index}.type`, type);
        this.setValue(`cmi.interactions.${index}.student_response`, response);
        this.setValue(`cmi.interactions.${index}.result`, result);
        this.setValue(`cmi.interactions.${index}.description`, description);
        this.setValue(`cmi.interactions.${index}.time`, this.getCurrentTime());

        this.commit();
    }

    calculateSessionTime() {
        const now = new Date();
        const diff = now - this.startTime;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        const sessionTime = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');

        this.setValue('cmi.core.session_time', sessionTime);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toISOString();
    }

    // Utility methods for common SCORM operations
    markComplete() {
        this.setStatus('completed');
    }

    markPassed(score) {
        this.setScore(score);
        this.setStatus('passed');
    }

    markFailed(score) {
        this.setScore(score);
        this.setStatus('failed');
    }

    saveProgress(slideNumber, data = {}) {
        this.setLocation(`slide_${slideNumber}`);
        this.setSuspendData({
            currentSlide: slideNumber,
            progress: data,
            timestamp: Date.now()
        });
    }

    getProgress() {
        return this.getSuspendData();
    }
}

// Global SCORM wrapper instance
let scormWrapper = null;

// Initialize SCORM when page loads
document.addEventListener('DOMContentLoaded', function() {
    scormWrapper = new SCORMWrapper();
    scormWrapper.initialize();
    
    // Save initial progress
    scormWrapper.saveProgress(1, { started: true });
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    if (scormWrapper) {
        scormWrapper.finish();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SCORMWrapper;
} else {
    window.SCORMWrapper = SCORMWrapper;
}