// Game Data for Safety Assessment Quiz
const gameData = {
    questions: [
        {
            id: 1,
            category: "Fire Safety",
            scenario: "Office Fire Emergency",
            icon: "🔥",
            title: "Fire Alarm Activation",
            description: "You hear the fire alarm while working at your desk. What should be your immediate response?",
            answers: [
                {
                    text: "Finish your current task quickly, then evacuate",
                    correct: false,
                    explanation: "Never delay evacuation for any reason. Every second counts in a fire emergency."
                },
                {
                    text: "Immediately stop work and evacuate via the nearest exit",
                    correct: true,
                    explanation: "Correct! Immediate evacuation is the top priority when a fire alarm sounds."
                },
                {
                    text: "Check if it's a real fire before leaving",
                    correct: false,
                    explanation: "Don't waste time investigating. Always treat fire alarms as real emergencies."
                },
                {
                    text: "Wait for instructions from your supervisor",
                    correct: false,
                    explanation: "Don't wait for instructions. Fire alarms require immediate evacuation."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 2,
            category: "Electrical Safety",
            scenario: "Equipment Malfunction",
            icon: "⚡",
            title: "Sparking Equipment",
            description: "You notice sparks coming from a computer monitor. What's the safest action?",
            answers: [
                {
                    text: "Unplug the device immediately and report it",
                    correct: true,
                    explanation: "Correct! Disconnect power immediately and report electrical hazards to prevent fires or electrocution."
                },
                {
                    text: "Continue using it but keep an eye on it",
                    correct: false,
                    explanation: "Never continue using sparking electrical equipment. This could cause fire or electrocution."
                },
                {
                    text: "Pour water on it to stop the sparks",
                    correct: false,
                    explanation: "Never use water on electrical equipment. This could cause electrocution."
                },
                {
                    text: "Move it to a different location",
                    correct: false,
                    explanation: "Don't move sparking equipment. Disconnect power and report it immediately."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 3,
            category: "Ergonomics",
            scenario: "Workstation Setup",
            icon: "💺",
            title: "Proper Lifting Technique",
            description: "You need to lift a heavy box from the floor. What's the correct technique?",
            answers: [
                {
                    text: "Bend at the waist and lift with your back",
                    correct: false,
                    explanation: "This technique puts dangerous strain on your back and can cause injury."
                },
                {
                    text: "Squat down, keep your back straight, and lift with your legs",
                    correct: true,
                    explanation: "Correct! This technique protects your back by using your stronger leg muscles."
                },
                {
                    text: "Lift quickly to get it over with",
                    correct: false,
                    explanation: "Quick, jerky movements increase the risk of injury. Always lift slowly and smoothly."
                },
                {
                    text: "Twist your body while lifting to place it elsewhere",
                    correct: false,
                    explanation: "Twisting while lifting is a common cause of back injuries. Turn with your feet instead."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 4,
            category: "Chemical Safety",
            scenario: "Spill Response",
            icon: "🧪",
            title: "Chemical Spill",
            description: "A cleaning chemical has spilled on the floor. What should you do first?",
            answers: [
                {
                    text: "Clean it up immediately with paper towels",
                    correct: false,
                    explanation: "Don't clean unknown chemicals without proper protection and procedures."
                },
                {
                    text: "Secure the area and check the Safety Data Sheet (SDS)",
                    correct: true,
                    explanation: "Correct! Always secure the area first and consult the SDS for proper cleanup procedures."
                },
                {
                    text: "Ignore it if it's a small spill",
                    correct: false,
                    explanation: "Never ignore chemical spills, regardless of size. They can pose serious health risks."
                },
                {
                    text: "Wash it down the drain with water",
                    correct: false,
                    explanation: "Many chemicals shouldn't go down drains. Always follow proper disposal procedures."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 5,
            category: "Personal Protective Equipment",
            scenario: "PPE Requirements",
            icon: "🦺",
            title: "Safety Equipment",
            description: "You're entering a construction area. Which PPE is most critical?",
            answers: [
                {
                    text: "Safety glasses only",
                    correct: false,
                    explanation: "Safety glasses are important but not sufficient for construction areas."
                },
                {
                    text: "Hard hat, safety glasses, and steel-toed boots",
                    correct: true,
                    explanation: "Correct! These three items protect against the most common construction hazards."
                },
                {
                    text: "Just steel-toed boots",
                    correct: false,
                    explanation: "Boots alone don't protect against falling objects or eye hazards."
                },
                {
                    text: "No PPE needed for short visits",
                    correct: false,
                    explanation: "PPE requirements don't change based on visit duration. Safety first, always."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 6,
            category: "Emergency Procedures",
            scenario: "Medical Emergency",
            icon: "🚑",
            title: "Workplace Injury",
            description: "A coworker has fallen and appears to be unconscious. What's your first action?",
            answers: [
                {
                    text: "Move them to a more comfortable position",
                    correct: false,
                    explanation: "Never move an unconscious person unless they're in immediate danger. You could worsen injuries."
                },
                {
                    text: "Call emergency services (911) immediately",
                    correct: true,
                    explanation: "Correct! Call for professional medical help immediately in serious injury situations."
                },
                {
                    text: "Give them water to help them wake up",
                    correct: false,
                    explanation: "Never give food or water to an unconscious person. They could choke."
                },
                {
                    text: "Wait to see if they wake up on their own",
                    correct: false,
                    explanation: "Don't wait with unconscious victims. Get professional help immediately."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 7,
            category: "Hazard Communication",
            scenario: "Warning Signs",
            icon: "⚠️",
            title: "Safety Signage",
            description: "You see a yellow diamond-shaped sign with a flame symbol. This indicates:",
            answers: [
                {
                    text: "Flammable materials present",
                    correct: true,
                    explanation: "Correct! The flame symbol on hazard signs indicates flammable or combustible materials."
                },
                {
                    text: "Hot surface warning",
                    correct: false,
                    explanation: "Hot surfaces typically use different symbols, not the flame in a diamond."
                },
                {
                    text: "Electrical hazard",
                    correct: false,
                    explanation: "Electrical hazards use lightning bolt symbols, not flames."
                },
                {
                    text: "Radiation warning",
                    correct: false,
                    explanation: "Radiation warnings use the trefoil symbol, not flames."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 8,
            category: "Machine Safety",
            scenario: "Equipment Operation",
            icon: "⚙️",
            title: "Machine Guarding",
            description: "Before operating machinery, you should always:",
            answers: [
                {
                    text: "Check that all safety guards are in place",
                    correct: true,
                    explanation: "Correct! Safety guards protect operators from moving parts and should never be removed or bypassed."
                },
                {
                    text: "Remove guards for better visibility",
                    correct: false,
                    explanation: "Never remove safety guards. They're designed to protect you from injury."
                },
                {
                    text: "Operate at maximum speed for efficiency",
                    correct: false,
                    explanation: "Always operate machinery at recommended speeds, not maximum speeds."
                },
                {
                    text: "Skip the pre-operation inspection to save time",
                    correct: false,
                    explanation: "Pre-operation inspections are critical for safe operation. Never skip them."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 9,
            category: "Slip, Trip, Fall Prevention",
            scenario: "Walking Surfaces",
            icon: "🚶",
            title: "Wet Floor Hazard",
            description: "You encounter a wet floor without warning signs. What should you do?",
            answers: [
                {
                    text: "Walk carefully across it",
                    correct: false,
                    explanation: "Even careful walking on wet surfaces is risky. Find an alternative route."
                },
                {
                    text: "Find an alternative route and report the hazard",
                    correct: true,
                    explanation: "Correct! Avoid the hazard and report it so others can be warned and it can be addressed."
                },
                {
                    text: "Run across quickly to minimize exposure",
                    correct: false,
                    explanation: "Running on wet surfaces greatly increases slip risk. Never do this."
                },
                {
                    text: "Ignore it since it will dry eventually",
                    correct: false,
                    explanation: "Ignoring hazards puts you and others at risk. Always report and address them."
                }
            ],
            points: 100,
            timeLimit: 30
        },
        {
            id: 10,
            category: "Environmental Safety",
            scenario: "Waste Disposal",
            icon: "♻️",
            title: "Hazardous Waste",
            description: "How should you dispose of batteries and electronic waste?",
            answers: [
                {
                    text: "Throw them in regular trash",
                    correct: false,
                    explanation: "Electronic waste contains hazardous materials that shouldn't go in regular trash."
                },
                {
                    text: "Use designated e-waste recycling programs",
                    correct: true,
                    explanation: "Correct! E-waste contains valuable and hazardous materials that require special recycling."
                },
                {
                    text: "Burn them to reduce volume",
                    correct: false,
                    explanation: "Burning electronic waste releases toxic fumes and is illegal in most areas."
                },
                {
                    text: "Bury them in the ground",
                    correct: false,
                    explanation: "Burying e-waste can contaminate soil and groundwater with toxic materials."
                }
            ],
            points: 100,
            timeLimit: 30
        }
    ],

    badges: [
        {
            id: "speed_demon",
            name: "Speed Demon",
            description: "Answer 5 questions in under 15 seconds each",
            icon: "⚡",
            requirement: "fast_answers",
            threshold: 5
        },
        {
            id: "perfect_score",
            name: "Perfect Score",
            description: "Answer all questions correctly",
            icon: "🎯",
            requirement: "perfect_accuracy",
            threshold: 100
        },
        {
            id: "fire_safety_expert",
            name: "Fire Safety Expert",
            description: "Correctly answer all fire safety questions",
            icon: "🔥",
            requirement: "category_mastery",
            category: "Fire Safety"
        },
        {
            id: "safety_champion",
            name: "Safety Champion",
            description: "Score over 800 points",
            icon: "🏆",
            requirement: "high_score",
            threshold: 800
        },
        {
            id: "quick_learner",
            name: "Quick Learner",
            description: "Complete the quiz in under 5 minutes",
            icon: "🚀",
            requirement: "fast_completion",
            threshold: 300 // seconds
        },
        {
            id: "powerup_master",
            name: "Powerup Master",
            description: "Use all three powerups in one game",
            icon: "⭐",
            requirement: "powerup_usage",
            threshold: 3
        }
    ],

    powerups: [
        {
            id: "fiftyFifty",
            name: "50/50",
            description: "Remove 2 incorrect answers",
            icon: "50/50",
            uses: 1
        },
        {
            id: "extraTime",
            name: "Extra Time",
            description: "Add 15 seconds to the timer",
            icon: "⏰",
            uses: 1
        },
        {
            id: "skipQuestion",
            name: "Skip Question",
            description: "Skip this question without penalty",
            icon: "⏭️",
            uses: 1
        }
    ],

    difficultySettings: {
        easy: {
            timeLimit: 45,
            pointsMultiplier: 0.8,
            livesCount: 5
        },
        normal: {
            timeLimit: 30,
            pointsMultiplier: 1.0,
            livesCount: 3
        },
        hard: {
            timeLimit: 20,
            pointsMultiplier: 1.5,
            livesCount: 1
        }
    },

    scoringSystem: {
        basePoints: 100,
        timeBonus: {
            excellent: 50, // < 10 seconds
            good: 25,      // < 20 seconds
            average: 0     // >= 20 seconds
        },
        streakBonus: {
            3: 50,   // 3 correct in a row
            5: 100,  // 5 correct in a row
            7: 200,  // 7 correct in a row
            10: 500  // perfect game
        },
        penaltyPoints: {
            wrongAnswer: -25,
            timeOut: -50
        }
    },

    leaderboard: [
        { name: "Safety Sam", score: 1250, rank: 1 },
        { name: "Careful Carol", score: 1180, rank: 2 },
        { name: "Alert Alex", score: 1050, rank: 3 },
        { name: "Vigilant Victor", score: 980, rank: 4 },
        { name: "Prudent Paul", score: 920, rank: 5 }
    ],

    achievements: {
        categories: [
            "Fire Safety",
            "Electrical Safety", 
            "Ergonomics",
            "Chemical Safety",
            "Personal Protective Equipment",
            "Emergency Procedures",
            "Hazard Communication",
            "Machine Safety",
            "Slip, Trip, Fall Prevention",
            "Environmental Safety"
        ],
        
        motivationalMessages: {
            correct: [
                "Excellent safety awareness!",
                "You're keeping everyone safe!",
                "Safety first - great job!",
                "Outstanding safety knowledge!",
                "You're a safety champion!"
            ],
            incorrect: [
                "Learn from this for next time!",
                "Safety is a learning process!",
                "Every mistake teaches us something!",
                "Keep improving your safety knowledge!",
                "Practice makes perfect in safety!"
            ],
            timeOut: [
                "Take your time to think it through!",
                "Safety decisions shouldn't be rushed!",
                "Consider all options carefully!",
                "Good safety takes thoughtful consideration!"
            ]
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gameData;
} else {
    window.gameData = gameData;
}