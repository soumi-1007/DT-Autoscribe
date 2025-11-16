// Multilingual Voice Command System for Autoscribe
console.log('Loading multilingual-voice.js...');

// Language configurations
const LANGUAGES = {
    'en': {
        code: 'en-US',
        name: 'English',
        flag: '🇺🇸',
        commands: {
            start: ['start exam', 'begin', 'start'],
            next: ['next', 'next question', 'move forward', 'continue'],
            previous: ['previous', 'back', 'go back', 'previous question'],
            read: ['read question', 'repeat', 'read again', 'repeat question'],
            readOptions: ['read options', 'what are the options', 'tell me the options'],
            answerA: ['answer a', 'option a', 'select a', 'a'],
            answerB: ['answer b', 'option b', 'select b', 'b'],
            answerC: ['answer c', 'option c', 'select c', 'c'],
            answerD: ['answer d', 'option d', 'select d', 'd'],
            submit: ['submit', 'submit exam', 'finish', 'end exam'],
            help: ['help', 'commands', 'what can i say']
        },
        messages: {
            welcome: 'Welcome to the exam. You have {duration} minutes to complete {questions} questions.',
            questionPrefix: 'Question {number} of {total}.',
            optionsPrefix: 'The options are:',
            optionFormat: 'Option {letter}, {text}.',
            selected: 'You selected option {letter}, {text}.',
            nextQuestion: 'Moving to next question.',
            previousQuestion: 'Going back to previous question.',
            firstQuestion: 'This is the first question.',
            lastQuestion: 'This is the last question.',
            submitConfirm: 'Are you sure you want to submit your exam?',
            submitted: 'Exam submitted. You scored {score} out of {total} marks.',
            listening: 'Listening...',
            notUnderstood: 'Sorry, I did not understand. Please try again.',
            timeWarning: '{minutes} minutes remaining.',
            timeUp: 'Time is up. Submitting your exam.'
        }
    },
    'ta': {
        code: 'ta-IN',
        name: 'தமிழ்',
        flag: '🇮🇳',
        commands: {
            start: ['தேர்வை தொடங்கு', 'தொடங்கு', 'ஆரம்பி'],
            next: ['அடுத்தது', 'அடுத்த கேள்வி', 'முன்னேறு'],
            previous: ['முந்தைய', 'பின்னால் செல்', 'முந்தைய கேள்வி'],
            read: ['கேள்வியை படி', 'மீண்டும் படி', 'திரும்ப படி'],
            readOptions: ['விருப்பங்களை படி', 'விருப்பங்கள் என்ன'],
            answerA: ['பதில் ஏ', 'விருப்பம் ஏ', 'ஏ தேர்வு செய்', 'ஏ'],
            answerB: ['பதில் பி', 'விருப்பம் பி', 'பி தேர்வு செய்', 'பி'],
            answerC: ['பதில் சி', 'விருப்பம் சி', 'சி தேர்வு செய்', 'சி'],
            answerD: ['பதில் டி', 'விருப்பம் டி', 'டி தேர்வு செய்', 'டி'],
            submit: ['சமர்ப்பி', 'தேர்வை முடி', 'முடி'],
            help: ['உதவி', 'கட்டளைகள்', 'நான் என்ன சொல்லலாம்']
        },
        messages: {
            welcome: 'தேர்வுக்கு வரவேற்கிறோம். {questions} கேள்விகளை முடிக்க உங்களுக்கு {duration} நிமிடங்கள் உள்ளன.',
            questionPrefix: 'கேள்வி {number} மொத்தம் {total} இல்.',
            optionsPrefix: 'விருப்பங்கள்:',
            optionFormat: 'விருப்பம் {letter}, {text}.',
            selected: 'நீங்கள் விருப்பம் {letter} தேர்வு செய்துள்ளீர்கள், {text}.',
            nextQuestion: 'அடுத்த கேள்விக்கு செல்கிறது.',
            previousQuestion: 'முந்தைய கேள்விக்கு திரும்புகிறது.',
            firstQuestion: 'இது முதல் கேள்வி.',
            lastQuestion: 'இது கடைசி கேள்வி.',
            submitConfirm: 'உங்கள் தேர்வை சமர்ப்பிக்க விரும்புகிறீர்களா?',
            submitted: 'தேர்வு சமர்ப்பிக்கப்பட்டது. நீங்கள் {total} இல் {score} மதிப்பெண்கள் பெற்றுள்ளீர்கள்.',
            listening: 'கேட்கிறது...',
            notUnderstood: 'மன்னிக்கவும், புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',
            timeWarning: '{minutes} நிமிடங்கள் மீதமுள்ளன.',
            timeUp: 'நேரம் முடிந்தது. உங்கள் தேர்வு சமர்ப்பிக்கப்படுகிறது.'
        }
    },
    'hi': {
        code: 'hi-IN',
        name: 'हिन्दी',
        flag: '🇮🇳',
        commands: {
            start: ['परीक्षा शुरू करें', 'शुरू करें', 'आरंभ करें'],
            next: ['अगला', 'अगला प्रश्न', 'आगे बढ़ें'],
            previous: ['पिछला', 'वापस जाएं', 'पिछला प्रश्न'],
            read: ['प्रश्न पढ़ें', 'दोहराएं', 'फिर से पढ़ें'],
            readOptions: ['विकल्प पढ़ें', 'विकल्प क्या हैं'],
            answerA: ['उत्तर ए', 'विकल्प ए', 'ए चुनें', 'ए'],
            answerB: ['उत्तर बी', 'विकल्प बी', 'बी चुनें', 'बी'],
            answerC: ['उत्तर सी', 'विकल्प सी', 'सी चुनें', 'सी'],
            answerD: ['उत्तर डी', 'विकल्प डी', 'डी चुनें', 'डी'],
            submit: ['जमा करें', 'परीक्षा समाप्त करें', 'खत्म करें'],
            help: ['मदद', 'आदेश', 'मैं क्या कह सकता हूं']
        },
        messages: {
            welcome: 'परीक्षा में आपका स्वागत है। आपके पास {questions} प्रश्नों को पूरा करने के लिए {duration} मिनट हैं।',
            questionPrefix: 'प्रश्न {number} कुल {total} में से।',
            optionsPrefix: 'विकल्प हैं:',
            optionFormat: 'विकल्प {letter}, {text}।',
            selected: 'आपने विकल्प {letter} चुना है, {text}।',
            nextQuestion: 'अगले प्रश्न पर जा रहे हैं।',
            previousQuestion: 'पिछले प्रश्न पर वापस जा रहे हैं।',
            firstQuestion: 'यह पहला प्रश्न है।',
            lastQuestion: 'यह अंतिम प्रश्न है।',
            submitConfirm: 'क्या आप वाकई अपनी परीक्षा जमा करना चाहते हैं?',
            submitted: 'परीक्षा जमा की गई। आपने {total} में से {score} अंक प्राप्त किए।',
            listening: 'सुन रहा हूं...',
            notUnderstood: 'क्षमा करें, मैं समझ नहीं पाया। कृपया पुनः प्रयास करें।',
            timeWarning: '{minutes} मिनट शेष हैं।',
            timeUp: 'समय समाप्त हो गया है। आपकी परीक्षा जमा की जा रही है।'
        }
    }
};

// Current language state
let currentLanguage = 'en';
let recognition = null;
let synthesis = window.speechSynthesis;
let isVoiceEnabled = false;

// Initialize multilingual voice system
function initMultilingualVoice(language = 'en') {
    currentLanguage = language;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = LANGUAGES[language].code;
        
        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript;
            handleMultilingualVoiceCommand(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                speak(LANGUAGES[currentLanguage].messages.notUnderstood);
            }
        };
        
        recognition.onend = function() {
            if (isVoiceEnabled) {
                // Restart recognition if voice mode is still enabled
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Recognition restart prevented:', e);
                }
            }
        };
        
        console.log(`Voice recognition initialized for ${LANGUAGES[language].name}`);
        return true;
    }
    
    console.warn('Speech recognition not supported');
    return false;
}

// Change language
function changeExamLanguage(language) {
    if (!LANGUAGES[language]) {
        console.error('Language not supported:', language);
        return false;
    }
    
    currentLanguage = language;
    
    // Update recognition language
    if (recognition) {
        recognition.lang = LANGUAGES[language].code;
    }
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', language);
    
    // Speak confirmation
    speak(`Language changed to ${LANGUAGES[language].name}`);
    
    console.log(`Language changed to ${LANGUAGES[language].name}`);
    return true;
}

// Speak text in current language
function speak(text, callback) {
    if (synthesis.speaking) {
        synthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGES[currentLanguage].code;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (callback) {
        utterance.onend = callback;
    }
    
    synthesis.speak(utterance);
}

// Format message with variables
function formatMessage(messageKey, variables = {}) {
    let message = LANGUAGES[currentLanguage].messages[messageKey];
    
    for (const [key, value] of Object.entries(variables)) {
        message = message.replace(`{${key}}`, value);
    }
    
    return message;
}

// Handle multilingual voice command
function handleMultilingualVoiceCommand(transcript) {
    const lowerTranscript = transcript.toLowerCase().trim();
    console.log(`Voice command (${currentLanguage}):`, transcript);
    
    const commands = LANGUAGES[currentLanguage].commands;
    
    // Check each command type
    for (const [commandType, commandVariants] of Object.entries(commands)) {
        for (const variant of commandVariants) {
            if (lowerTranscript.includes(variant.toLowerCase())) {
                executeCommand(commandType, lowerTranscript);
                return;
            }
        }
    }
    
    // If no command matched
    speak(LANGUAGES[currentLanguage].messages.notUnderstood);
}

// Execute command
function executeCommand(commandType, transcript) {
    switch (commandType) {
        case 'start':
            if (typeof startExam === 'function') {
                startExam();
            } else if (typeof startMockExam === 'function') {
                startMockExam();
            }
            break;
            
        case 'next':
            if (typeof nextQuestion === 'function') {
                speak(LANGUAGES[currentLanguage].messages.nextQuestion);
                const prevIndex = (window.currentExamState && window.currentExamState.currentQuestionIndex) || 0;
                nextQuestion();
                // After DOM updates, read the next question
                setTimeout(() => {
                    // If index changed or question updated, read
                    readCurrentQuestion();
                }, 200);
            }
            break;
            
        case 'previous':
            if (typeof previousQuestion === 'function') {
                speak(LANGUAGES[currentLanguage].messages.previousQuestion);
                previousQuestion();
                setTimeout(() => { readCurrentQuestion(); }, 200);
            }
            break;
            
        case 'read':
            readCurrentQuestion();
            break;
            
        case 'readOptions':
            readCurrentOptions();
            break;
            
        case 'answerA':
            selectOptionByVoice(0);
            break;
            
        case 'answerB':
            selectOptionByVoice(1);
            break;
            
        case 'answerC':
            selectOptionByVoice(2);
            break;
            
        case 'answerD':
            selectOptionByVoice(3);
            break;
            
        case 'submit':
            if (confirm(LANGUAGES[currentLanguage].messages.submitConfirm)) {
                if (typeof submitExam === 'function') {
                    submitExam();
                } else if (typeof submitMockExam === 'function') {
                    submitMockExam();
                } else if (typeof submitCurrentExam === 'function') {
                    submitCurrentExam();
                }
            }
            break;
            
        case 'help':
            speakHelpCommands();
            break;
    }
}

// Read current question
function readCurrentQuestion() {
    const questionText = document.getElementById('question-text') || 
                        document.getElementById('mock-question-text');
    const questionNumber = document.getElementById('question-number') || 
                          document.getElementById('mock-current-q');
    const totalQuestions = document.getElementById('total-questions') || 
                          document.getElementById('mock-total-questions');
    
    if (questionText && questionNumber && totalQuestions) {
        const message = formatMessage('questionPrefix', {
            number: questionNumber.textContent,
            total: totalQuestions.textContent
        }) + ' ' + questionText.textContent;
        speak(message);
    }
}

// Read current options
function readCurrentOptions() {
    const optionsContainer = document.getElementById('options-container') || 
                            document.getElementById('mock-options-container');
    
    if (optionsContainer) {
        const options = optionsContainer.querySelectorAll('.option-text');
        if (options.length > 0) {
            let message = LANGUAGES[currentLanguage].messages.optionsPrefix + ' ';
            options.forEach((option, idx) => {
                message += formatMessage('optionFormat', {
                    letter: String.fromCharCode(65 + idx),
                    text: option.textContent
                }) + ' ';
            });
            speak(message);
        }
    }
}

// Select option by voice
function selectOptionByVoice(index) {
    // Try different selection functions
    if (typeof selectOption === 'function') {
        selectOption(index);
    } else if (typeof selectExamOption === 'function') {
        selectExamOption(index);
    }
    
    // Speak confirmation
    const optionsContainer = document.getElementById('options-container') || 
                            document.getElementById('mock-options-container');
    if (optionsContainer) {
        const options = optionsContainer.querySelectorAll('.option-text');
        if (options[index]) {
            const message = formatMessage('selected', {
                letter: String.fromCharCode(65 + index),
                text: options[index].textContent
            });
            speak(message);
        }
    }

    // Auto-advance to next question after a short delay and read it
    if (typeof nextQuestion === 'function') {
        setTimeout(() => {
            nextQuestion();
            setTimeout(() => { readCurrentQuestion(); }, 200);
        }, 250);
    }
}

// Speak help commands
function speakHelpCommands() {
    const commands = LANGUAGES[currentLanguage].commands;
    let helpText = 'Available commands: ';
    
    helpText += 'Say ' + commands.next[0] + ' to go to next question. ';
    helpText += 'Say ' + commands.previous[0] + ' to go back. ';
    helpText += 'Say ' + commands.read[0] + ' to hear the question again. ';
    helpText += 'Say ' + commands.answerA[0] + ', ' + commands.answerB[0] + ', ' + 
                commands.answerC[0] + ', or ' + commands.answerD[0] + ' to select an answer. ';
    helpText += 'Say ' + commands.submit[0] + ' to submit your exam.';
    
    speak(helpText);
}

// Toggle voice mode
function toggleVoiceMode() {
    if (!recognition) {
        initMultilingualVoice(currentLanguage);
    }
    
    if (isVoiceEnabled) {
        // Disable voice mode
        recognition.stop();
        isVoiceEnabled = false;
        updateVoiceStatus(false);
        speak('Voice mode disabled');
    } else {
        // Enable voice mode
        try {
            recognition.start();
            isVoiceEnabled = true;
            updateVoiceStatus(true);
            speak('Voice mode enabled');
        } catch (e) {
            console.error('Error starting recognition:', e);
        }
    }
}

// Update voice status UI
function updateVoiceStatus(enabled) {
    const voiceStatus = document.getElementById('voice-status');
    if (voiceStatus) {
        const indicator = voiceStatus.querySelector('.voice-indicator');
        const button = voiceStatus.querySelector('.voice-toggle-btn');
        
        if (enabled) {
            indicator.innerHTML = '<i class="fas fa-microphone"></i><span>Voice Mode: On</span>';
            indicator.style.color = '#10b981';
            if (button) {
                button.innerHTML = '<i class="fas fa-microphone-slash"></i> Disable Voice';
            }
        } else {
            indicator.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Voice Mode: Off</span>';
            indicator.style.color = '#6b7280';
            if (button) {
                button.innerHTML = '<i class="fas fa-microphone"></i> Enable Voice';
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load preferred language
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    currentLanguage = savedLanguage;
    
    // Initialize voice system
    initMultilingualVoice(savedLanguage);
    
    console.log('Multilingual voice system initialized');
});

// Export functions
window.initMultilingualVoice = initMultilingualVoice;
window.changeExamLanguage = changeExamLanguage;
window.toggleVoiceMode = toggleVoiceMode;
window.speak = speak;
window.formatMessage = formatMessage;
window.LANGUAGES = LANGUAGES;

console.log('Multilingual voice system loaded successfully!');
