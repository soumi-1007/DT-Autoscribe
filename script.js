// Global variables
let currentUser = null;
let speechSynthesis = window.speechSynthesis;
let recognition = null;
// Add this at the beginning of the script.js file
let currentQuestionIndex = 0;
let isReadingQuestion = false;
// Add this function if not already present
function speak(text) {
    if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
}

// Update the speakCurrentQuestion function
function speakCurrentQuestion() {
    if (isReadingQuestion) return;
    isReadingQuestion = true;
    
    const questionElement = document.getElementById('questionText');
    const options = document.querySelectorAll('.option-label');
    
    if (questionElement) {
        let questionText = `Question ${currentQuestionIndex + 1}. ${questionElement.textContent}. `;
        
        if (options.length > 0) {
            questionText += 'Options are: ';
            options.forEach((opt, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, ...
                questionText += `${optionLetter}. ${opt.textContent}. `;
            });
        }
        
        // Speak the question and options
        speak(questionText);
        
        // Reset the flag when done speaking
        setTimeout(() => { 
            isReadingQuestion = false; 
            // Start listening for commands after speaking
            if (recognition) {
                try { 
                    recognition.start(); 
                    console.log('Listening for voice commands...');
                } catch(e) { 
                    console.error('Error starting recognition:', e); 
                }
            }
        }, 1000);
    }
}

// Update the selectOption function
function selectOption(optionLetter) {
    const optionIndex = optionLetter.toUpperCase().charCodeAt(0) - 65;
    const optionInputs = document.querySelectorAll('.option-input');
    const optionLabels = document.querySelectorAll('.option-label');
    
    if (optionInputs[optionIndex] && optionLabels[optionIndex]) {
        optionInputs[optionIndex].checked = true;
        const optionText = optionLabels[optionIndex].textContent;
        speak(`Selected option ${optionLetter.toUpperCase()}: ${optionText}`);
        return true;
    }
    return false;
}

// Update the handleVoiceCommand function
function handleVoiceCommand(lower, rawTextForAnswerPlacement) {
    // Navigation commands
    if (lower.includes('next question') || lower.includes('next') || lower.includes('go to next question')) {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn.disabled) {
            nextBtn.click();
            currentQuestionIndex++;
            // Speak the next question after a short delay
            setTimeout(speakCurrentQuestion, 500);
        } else {
            speak("This is the last question.");
        }
        return true;
    } 
    
    // Previous question
    if (lower.includes('previous question') || lower.includes('previous') || lower.includes('go back')) {
        const prevBtn = document.getElementById('prevBtn');
        if (!prevBtn.disabled) {
            prevBtn.click();
            currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);
            // Speak the previous question after a short delay
            setTimeout(speakCurrentQuestion, 500);
        } else {
            speak("This is the first question.");
        }
        return true;
    }
    
    // Select option commands
    if (lower.startsWith('select option ')) {
        const optionLetter = lower.split('select option ')[1]?.trim().toUpperCase();
        if (optionLetter && /^[A-D]$/.test(optionLetter)) {
            return selectOption(optionLetter);
        }
    }
    
    // Direct option selection (just say "A", "B", etc.)
    if (/^[a-d]$/i.test(lower.trim())) {
        return selectOption(lower.trim().toUpperCase());
    }
    
    // Read current question
    if (lower.includes('read question') || lower.includes('repeat') || lower === 'read') {
        speakCurrentQuestion();
        return true;
    }
    
    // Help command
    if (lower.includes('help') || lower.includes('what can i say')) {
        const helpText = "You can say: 'next question', 'previous question', 'read question', 'select option A', or just 'A', 'B', 'C', 'D' to select an answer.";
        speak(helpText);
        return true;
    }
    
    return false; // Command not recognized
}

// Update the recognition onresult handler
if (recognition) {
    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        const lower = speechResult.toLowerCase().trim();
        console.log('Voice command:', speechResult);
        
        // Try to handle the command
        const commandHandled = handleVoiceCommand(lower, speechResult);
        
        // If no command was recognized, treat it as an answer
        if (!commandHandled) {
            const answerInput = document.getElementById('answerInput');
            if (answerInput) {
                answerInput.value = speechResult;
                speak('Answer recorded: ' + speechResult);
            }
        }
    };
    
    recognition.onend = function() {
        console.log('Recognition ended, restarting...');
        try { 
            recognition.start(); 
        } catch(e) { 
            console.error('Error restarting recognition:', e);
        }
    };
    
    // Start recognition when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        try { 
            recognition.start(); 
            console.log('Voice recognition started');
        } catch(e) { 
            console.error('Error starting recognition:', e); 
        }
    });
}

function speakCurrentQuestion() {
    if (isReadingQuestion) return;
    
    const questionElement = document.getElementById('questionText');
    const options = document.querySelectorAll('.option-label');
    
    if (questionElement) {
        isReadingQuestion = true;
        let questionText = `Question ${currentQuestionIndex + 1}. ${questionElement.textContent}. `;
        
        if (options.length > 0) {
            questionText += 'Options are: ';
            options.forEach((opt, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                questionText += `${optionLetter}. ${opt.textContent}. `;
            });
        }
        
        speak(questionText);
        setTimeout(() => { isReadingQuestion = false; }, 2000);
    }
}

function selectOption(optionLetter) {
    const optionIndex = optionLetter.toUpperCase().charCodeAt(0) - 65;
    const optionInputs = document.querySelectorAll('.option-input');
    
    if (optionInputs[optionIndex]) {
        optionInputs[optionIndex].click();
        speak(`Selected option ${optionLetter.toUpperCase()}`);
        return true;
    }
    return false;
}

function handleVoiceCommand(lower, rawTextForAnswerPlacement) {
    // Navigation commands
    if (lower.includes('next question') || lower.includes('next') || lower.includes('go to next question')) {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn.disabled) {
            nextBtn.click();
            currentQuestionIndex++;
            setTimeout(speakCurrentQuestion, 500);
        } else {
            speak("This is the last question.");
        }
        return true;
    } 
    
    if (lower.includes('previous question') || lower.includes('previous') || lower.includes('go back') || lower.includes('back')) {
        const prevBtn = document.getElementById('prevBtn');
        if (!prevBtn.disabled) {
            prevBtn.click();
            currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);
            setTimeout(speakCurrentQuestion, 500);
        } else {
            speak("This is the first question.");
        }
        return true;
    }
    
    // Read current question
    if (lower.includes('read question') || lower.includes('repeat question') || 
        lower.includes('question again') || lower === 'read') {
        speakCurrentQuestion();
        return true;
    }
    
    // Select options (A, B, C, D)
    if (lower.startsWith('select option ')) {
        const optionLetter = lower.split('select option ')[1]?.trim().toUpperCase();
        if (optionLetter && /^[A-D]$/.test(optionLetter)) {
            return selectOption(optionLetter);
        }
    }
    
    // Handle direct option selection (A, B, C, D)
    if (/^[a-d]$/.test(lower.trim())) {
        return selectOption(lower.trim());
    }
    
    // Answer handling for text answers
    if (lower.includes('my answer is') || lower.includes('answer is')) {
        const answerStart = Math.max(
            lower.indexOf('my answer is') + 'my answer is'.length,
            lower.indexOf('answer is') + 'answer is'.length
        );
        const answer = rawTextForAnswerPlacement.substring(answerStart).trim();
        if (answer) {
            document.getElementById('answerInput').value = answer;
            speak('Answer recorded.');
            return true;
        }
    }
    
    // Basic commands
    if (lower.includes('start exam')) {
        document.getElementById('startExamBtn')?.click();
        setTimeout(() => {
            currentQuestionIndex = 0;
            speakCurrentQuestion();
        }, 1000);
        return true;
    } else if (lower.includes('submit exam')) {
        document.getElementById('submitExamBtn')?.click();
        return true;
    } else if (lower.includes('confirm submit')) {
        document.getElementById('confirmSubmitBtn')?.click();
        return true;
    } else if (lower.includes('cancel submit')) {
        document.getElementById('cancelSubmitBtn')?.click();
        return true;
    } else if (lower.includes('help') || lower.includes('what can i say')) {
        const helpText = "You can say: 'next question', 'previous question', 'read question', 'select option A', or just 'A', 'B', 'C', 'D' to select an answer.";
        speak(helpText);
        return true;
    }
    
    return false; // Command not recognized
}

// Update the loadQuestion function to include speaking the question
function loadQuestion(index) {
    const q = questions[index];
    questionNumber.textContent = index + 1;
    questionText.textContent = q.text;
    questionMarks.textContent = `(${q.marks} marks)`;
    answerInput.value = answers[index];
    currentQuestionSpan.textContent = index + 1;

    prevBtn.disabled = index === 0;
    nextBtn.textContent = (index === questions.length - 1) ? "Finish" : "Next";
    
    // Speak the question when it loads
    setTimeout(speakCurrentQuestion, 500);
    
    if (typeof window.speakQuestionAndListen === 'function' && startExamBtn.style.display === 'none') {
        window.speakQuestionAndListen();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    setupEventListeners();
    announcePageLoad();
});

// Initialize speech recognition for accessibility
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }

}

// Voice-only login wizard
function startVoiceLogin(role) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        speak('Voice recognition is not supported in your browser.');
        return;
    }
    const langPref = (localStorage.getItem('preferredLanguage') || 'en').toLowerCase();
    const langMap = { en: 'en-US', hi: 'hi-IN', ta: 'ta-IN' };
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = langMap[langPref] || 'en-US';

    // Helpers to ask -> listen -> resolve
    function ask(promptText) {
        return new Promise((resolve) => {
            const handle = () => {
                try { rec.start(); } catch (e) {}
            };
            try {
                // Speak then start listening
                const u = new SpeechSynthesisUtterance(promptText);
                u.lang = rec.lang;
                u.onend = handle;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(u);
            } catch (_) { handle(); }
            rec.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                resolve(transcript);
            };
            rec.onerror = () => resolve('');
            rec.onend = () => {};
        });
    }

    (async () => {
        // Ensure correct form is visible
        showLogin(role);
        if (role === 'teacher') {
            const email = await ask('Please say your teacher email.');
            if (email) {
                const el = document.getElementById('teacher-email');
                if (el) el.value = email.replace(/\s+/g, '').toLowerCase();
                speak('Now say your password.');
            }
            const password = await ask('');
            if (password) {
                const pw = document.getElementById('teacher-password');
                if (pw) pw.value = password.replace(/\s+/g, '');
                speak('Logging you in.');
                // Trigger existing handler
                try { document.getElementById('teacher-form').dispatchEvent(new Event('submit', { cancelable: true })); } catch (_) {}
            } else {
                speak('Password not captured. Please try again.');
            }
        } else {
            const sid = await ask('Please say your student I D.');
            if (sid) {
                const el = document.getElementById('student-id');
                if (el) el.value = sid.replace(/\s+/g, '').toUpperCase();
                speak('Now say your password.');
            }
            const password = await ask('');
            if (password) {
                const pw = document.getElementById('student-password');
                if (pw) pw.value = password.replace(/\s+/g, '');
                speak('Logging you in.');
                try { document.getElementById('student-form').dispatchEvent(new Event('submit', { cancelable: true })); } catch (_) {}
            } else {
                speak('Password not captured. Please try again.');
            }
        }
    })();
}

// Setup event listeners
function setupEventListeners() {
    // Teacher form submission
    document.getElementById('teacher-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleTeacherLogin();
    });

    // Student form submission
    document.getElementById('student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleStudentLogin();
    });


    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideLogin();
        }
    });
}

// Show login form based on user type
function showLogin(userType) {
    // Hide all login forms
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    // Hide login options
    document.querySelector('.login-options').style.display = 'none';
    
    // Show selected login form
    document.getElementById(`${userType}-login`).classList.remove('hidden');
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = document.querySelector(`#${userType}-login input`);
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    // Announce to screen readers
    speak(`Please enter your ${userType} credentials`);
}

// Hide login form and show options
function hideLogin() {
    document.querySelectorAll('.login-form').forEach(form => {
        form.classList.add('hidden');
    });
    
    document.querySelector('.login-options').style.display = 'grid';
    
    // Announce to screen readers
    speak('Returned to login options');
}

// Handle teacher login
function handleTeacherLogin() {
    const email = document.getElementById('teacher-email').value;
    const password = document.getElementById('teacher-password').value;
    
    console.log('Attempting teacher login:', { email });
    if (!email || !password) {
        speak('Please enter email and password.');
        alert('Please enter email and password.');
        return;
    }
    // Accept any non-empty credentials and create a basic teacher profile
    const nameGuess = email.split('@')[0].replace(/\W+/g, ' ').trim() || 'Teacher';
    currentUser = {
        type: 'teacher',
        id: 'T_' + btoa(email).replace(/=+/g, ''),
        email: email,
        name: nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1),
        department: ''
    };
    storeUserData(currentUser);
    speak('Login successful. Redirecting to teacher dashboard.');
    setTimeout(() => {
        window.location.href = 'teacher-dashboard.html';
    }, 800);
}

// Handle student login
function handleStudentLogin() {
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('student-password').value;
    const language = document.getElementById('language-select').value;
    
    console.log('Attempting student login:', { studentId, language });
    if (!studentId || !password) {
        speak('Please enter student ID and password.');
        alert('Please enter student ID and password.');
        return;
    }
    currentUser = {
        type: 'student',
        id: studentId,
        name: 'Student ' + studentId,
        email: '',
        class: '',
        language: language
    };
    storeUserData(currentUser);
    speak('Login successful. Redirecting to student dashboard.');
    setTimeout(() => {
        window.location.href = 'student-dashboard.html';
    }, 800);
}


// Text-to-speech function
function speak(text, rate = 0.8, pitch = 1) {
    if (speechSynthesis) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 1;
        
        // Set voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') && voice.name.includes('Female')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// Announce page load for accessibility
function announcePageLoad() {
    setTimeout(() => {
        speak('Welcome to Autoscribe. Please select your login option: Teacher or Student.');
    }, 1000);
}

// Voice command recognition
function startVoiceCommand() {
    if (!recognition) {
        speak('Voice recognition is not supported in your browser');
        return;
    }
    
    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        processVoiceCommand(command);
    };
    
    recognition.onerror = function(event) {
        speak('Sorry, I could not understand that. Please try again.');
    };
    
    recognition.start();
    speak('Listening for voice command...');
}

// Process voice commands
function processVoiceCommand(command) {
    if (command.includes('teacher') || command.includes('teacher login')) {
        showLogin('teacher');
    } else if (command.includes('student') || command.includes('student login')) {
        showLogin('student');
    } else if (command.includes('back') || command.includes('return')) {
        hideLogin();
    } else if (command.includes('help')) {
        speak('You can say: Teacher login, Student login, Back, or Help');
    } else {
        speak('Command not recognized. Say help for available commands.');
    }
}

// Microphone test function
function testMicrophone() {
    if (!recognition) {
        speak('Voice recognition is not supported in your browser');
        return false;
    }
    
    speak('Please say "Hello" to test your microphone');
    
    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript.toLowerCase().trim();
        if (result.includes('hello') || result.includes('hi')) {
            speak('Microphone test successful! Your voice is clear.');
            return true;
        } else {
            speak('Please try saying "Hello" again');
            return false;
        }
    };
    
    recognition.start();
}

// Accessibility helper functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// High contrast mode toggle
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isHighContrast = document.body.classList.contains('high-contrast');
    speak(isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
}

// Font size adjustment
function adjustFontSize(direction) {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
    const newSize = direction === 'increase' ? currentSize + 2 : currentSize - 2;
    
    if (newSize >= 12 && newSize <= 24) {
        document.body.style.fontSize = newSize + 'px';
        speak(`Font size ${direction === 'increase' ? 'increased' : 'decreased'}`);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + T for teacher login
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        showLogin('teacher');
    }
    
    // Alt + S for student login
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        showLogin('student');
    }
    
    // Alt + V for voice commands
    if (e.altKey && e.key === 'v') {
        e.preventDefault();
        startVoiceCommand();
    }
    
    // Alt + H for help
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        speak('Keyboard shortcuts: Alt+T for teacher login, Alt+S for student login, Alt+V for voice commands, Alt+H for help');
    }
    
    // Alt + + for increase font size
    if (e.altKey && e.key === '+') {
        e.preventDefault();
        adjustFontSize('increase');
    }
    
    // Alt + - for decrease font size
    if (e.altKey && e.key === '-') {
        e.preventDefault();
        adjustFontSize('decrease');
    }
});

// Store user data in localStorage for session management
function storeUserData(userData) {
    // Store with both keys for compatibility
    localStorage.setItem('autoscribe_user', JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.type,
        class: userData.class || '',
        language: userData.language || 'en'
    }));
    
    // Also store preferred language
    if (userData.language) {
        localStorage.setItem('preferredLanguage', userData.language);
    }
}

function getUserData() {
    const userData = localStorage.getItem('autoscribe_user') || localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function clearUserData() {
    localStorage.removeItem('autoscribe_user');
    localStorage.removeItem('currentUser');
}

// Export functions for use in other pages
window.AutoscribeUtils = {
    speak,
    startVoiceCommand,
    testMicrophone,
    storeUserData,
    getUserData,
    clearUserData,
    toggleHighContrast,
    adjustFontSize
};

// Expose voice login starter
window.startVoiceLogin = startVoiceLogin;
