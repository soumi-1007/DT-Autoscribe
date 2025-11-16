// Exam Connector - Links teacher-created exams to student access

// Storage keys
const STORAGE_KEYS = {
    EXAMS: 'autoscribe_exams',
    CURRENT_USER: 'currentUser',
    SUBMISSIONS: 'autoscribe_submissions'
};

// Save exam to localStorage
function saveExamToStorage(exam) {
    try {
        let exams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS)) || [];
        
        // Check if exam already exists
        const existingIndex = exams.findIndex(e => e.id === exam.id);
        if (existingIndex >= 0) {
            exams[existingIndex] = exam;
        } else {
            exams.push(exam);
        }
        
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
        console.log('Exam saved:', exam.name);
        return true;
    } catch (error) {
        console.error('Error saving exam:', error);
        return false;
    }
}

// Get all exams from storage
function getAllExamsFromStorage() {
    try {
        const storedExams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS)) || [];
        return storedExams;
    } catch (error) {
        console.error('Error loading exams:', error);
        return [];
    }
}

// Get available exams for students
function getAvailableExamsForStudent() {
    const allExams = getAllExamsFromStorage();
    return allExams.filter(exam => exam.status === 'available' || exam.status === 'scheduled');
}

// Get exam by ID
function getExamByIdFromStorage(examId) {
    const allExams = getAllExamsFromStorage();
    return allExams.find(exam => exam.id === examId);
}

// Save student submission
function saveStudentSubmission(examId, studentId, answers, score) {
    try {
        let submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || {};
        
        if (!submissions[studentId]) {
            submissions[studentId] = {};
        }
        
        submissions[studentId][examId] = {
            answers: answers,
            score: score,
            submittedAt: new Date().toISOString(),
            timeSpent: 0
        };
        
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        console.log('Submission saved for student:', studentId, 'exam:', examId);
        return true;
    } catch (error) {
        console.error('Error saving submission:', error);
        return false;
    }
}

// Get student submissions
function getStudentSubmissions(studentId) {
    try {
        const submissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) || {};
        return submissions[studentId] || {};
    } catch (error) {
        console.error('Error loading submissions:', error);
        return {};
    }
}

// Check if student has submitted exam
function hasStudentSubmittedExam(studentId, examId) {
    const submissions = getStudentSubmissions(studentId);
    return !!submissions[examId];
}

// Initialize storage with demo data if empty
function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify({}));
    }
    console.log('Storage initialized');
}

// Load exams into student dashboard
function loadStudentExams() {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (!currentUser || currentUser.role !== 'student') return;

    const availableExams = getAvailableExamsForStudent();
    const submissions = getStudentSubmissions(currentUser.id);

    // Update current exams list
    const currentExamsList = document.getElementById('current-exams-list');
    if (currentExamsList) {
        const currentExams = availableExams.filter(exam => {
            return exam.status === 'available' && !submissions[exam.id];
        });

        if (currentExams.length === 0) {
            currentExamsList.innerHTML = '<div class="no-exams"><i class="fas fa-clock"></i><p>No exams in progress</p></div>';
        } else {
            currentExamsList.innerHTML = currentExams.map(exam => `
                <div class="exam-item">
                    <h4>${exam.name}</h4>
                    <p><i class="fas fa-book"></i> ${exam.description || 'No description'}</p>
                    <p><i class="fas fa-clock"></i> Duration: ${exam.duration} minutes</p>
                    <p><i class="fas fa-signal"></i> Difficulty: ${exam.difficulty}</p>
                    <button class="action-btn" onclick="startExamById('${exam.id}')">
                        <i class="fas fa-play"></i> Start Exam
                    </button>
                </div>
            `).join('');
        }
    }

    // Update upcoming exams list
    const upcomingExamsList = document.getElementById('upcoming-exams-list');
    if (upcomingExamsList) {
        const upcomingExams = availableExams.filter(exam => exam.status === 'scheduled');

        if (upcomingExams.length === 0) {
            upcomingExamsList.innerHTML = '<div class="no-exams"><i class="far fa-calendar"></i><p>No upcoming exams</p></div>';
        } else {
            upcomingExamsList.innerHTML = upcomingExams.map(exam => `
                <div class="exam-item">
                    <h4>${exam.name}</h4>
                    <p><i class="fas fa-calendar-alt"></i> ${exam.date}</p>
                    <p><i class="fas fa-clock"></i> Duration: ${exam.duration} minutes</p>
                    <span class="status upcoming">Upcoming</span>
                </div>
            `).join('');
        }
    }

    // Update completed exams list
    const completedExamsList = document.getElementById('completed-exams-list');
    if (completedExamsList) {
        const completedExamIds = Object.keys(submissions);
        const completedExams = completedExamIds.map(examId => {
            const exam = getExamByIdFromStorage(examId);
            const submission = submissions[examId];
            return { ...exam, submission };
        }).filter(exam => exam.id);

        if (completedExams.length === 0) {
            completedExamsList.innerHTML = '<div class="no-exams"><i class="far fa-check-circle"></i><p>No completed exams yet</p></div>';
        } else {
            completedExamsList.innerHTML = completedExams.map(exam => `
                <div class="exam-item">
                    <h4>${exam.name}</h4>
                    <p><i class="fas fa-check-circle"></i> Completed</p>
                    <p><i class="fas fa-star"></i> Score: ${exam.submission.score || 'Pending'}</p>
                    <span class="status completed">Completed</span>
                </div>
            `).join('');
        }
    }
}

// Start exam by ID
function startExamById(examId) {
    const exam = getExamByIdFromStorage(examId);
    if (!exam) {
        alert('Exam not found');
        return;
    }

    // Store current exam in session
    sessionStorage.setItem('currentExam', JSON.stringify(exam));

    // Navigate to exam page or show exam section
    const examSection = document.getElementById('exam-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (examSection && dashboardSection) {
        dashboardSection.classList.remove('active');
        examSection.classList.add('active');
        loadExamQuestions(exam);
    }
}

// Load exam questions
function loadExamQuestions(exam) {
    // Set exam title and metadata
    document.getElementById('exam-title').textContent = exam.name;
    document.getElementById('exam-subject').textContent = exam.description || '';
    document.getElementById('exam-duration').textContent = `${exam.duration} minutes`;
    document.getElementById('total-questions').textContent = exam.questions.length;

    // Initialize exam state
    window.currentExamState = {
        exam: exam,
        currentQuestionIndex: 0,
        answers: {},
        startTime: new Date(),
        timeLimit: exam.duration * 60 // Convert to seconds
    };

    // Load first question
    loadExamQuestion(0);

    // Start timer
    startExamTimer(exam.duration * 60);

    // Auto-enable voice mode if available and currently off
    try {
        const voiceStatus = document.getElementById('voice-status');
        if (voiceStatus && typeof window.toggleVoiceMode === 'function') {
            const text = (voiceStatus.textContent || '').toLowerCase();
            if (text.includes('voice mode: off')) {
                window.toggleVoiceMode();
            }
        }
    } catch (_) {}

    // Speak exam instructions using multilingual system
    if (window.formatMessage) {
        const welcomeMsg = window.formatMessage('welcome', {
            duration: exam.duration,
            questions: exam.questions.length
        });
        if (window.speak) {
            window.speak(welcomeMsg);
        }
    } else if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(
            `Starting exam: ${exam.name}. You have ${exam.duration} minutes to complete ${exam.questions.length} questions. Good luck!`
        );
        window.speechSynthesis.speak(utterance);
    }
}

// Load individual exam question
function loadExamQuestion(index) {
    const exam = window.currentExamState.exam;
    const question = exam.questions[index];

    if (!question) return;

    window.currentExamState.currentQuestionIndex = index;

    // Update question display
    document.getElementById('question-number').textContent = index + 1;
    document.getElementById('current-question').textContent = index + 1;
    document.getElementById('question-text').textContent = question.text;
    document.getElementById('question-marks').textContent = question.marks || 2;

    // Update progress bar
    const progress = ((index + 1) / exam.questions.length) * 100;
    document.getElementById('exam-progress').style.width = `${progress}%`;

    // Load options or free-text input
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    if (question.options && question.options.length) {
        question.options.forEach((option, idx) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <div class="option-content">
                    <div class="option-letter">${String.fromCharCode(65 + idx)}</div>
                    <div class="option-text">${option}</div>
                </div>
            `;
            optionDiv.onclick = () => selectExamOption(idx);

            // Highlight if already selected
            if (window.currentExamState.answers[question.id] === idx) {
                optionDiv.classList.add('selected');
            }

            optionsContainer.appendChild(optionDiv);
        });
    } else {
        const ta = document.createElement('textarea');
        ta.id = 'free-text-answer';
        ta.rows = 4;
        ta.placeholder = 'Type your answer here...';
        ta.style.width = '100%';
        ta.value = (window.currentExamState.answers[question.id] || '');
        ta.addEventListener('input', () => {
            window.currentExamState.answers[question.id] = ta.value;
        });
        optionsContainer.appendChild(ta);
    }

    // Update navigation buttons (handle potential duplicate IDs on page)
    document.querySelectorAll('#prev-btn').forEach(btn => { btn.disabled = index === 0; });
    document.querySelectorAll('#next-btn').forEach(btn => {
        if (index === exam.questions.length - 1) {
            btn.innerHTML = '<i class="fas fa-check"></i> Submit';
        } else {
            btn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
    });

    // Speak question using multilingual system
    // Cancel any ongoing speech to avoid overlap with other modules
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch(e) {} }
    if (window.speak && window.formatMessage) {
        let questionText = window.formatMessage('questionPrefix', {
            number: index + 1,
            total: exam.questions.length
        }) + ' ' + question.text + '. ';
        
        if (question.options && question.options.length) {
            questionText += window.formatMessage('optionsPrefix', {}) + ' ';
            question.options.forEach((option, idx) => {
                questionText += window.formatMessage('optionFormat', {
                    letter: String.fromCharCode(65 + idx),
                    text: option
                }) + ' ';
            });
        }
        window.speak(questionText);
    } else if (window.speechSynthesis) {
        let questionText = `Question ${index + 1}. ${question.text}. `;
        if (question.options && question.options.length) {
            questionText += 'The options are: ';
            question.options.forEach((option, idx) => {
                questionText += `Option ${String.fromCharCode(65 + idx)}, ${option}. `;
            });
        }
        const utterance = new SpeechSynthesisUtterance(questionText);
        window.speechSynthesis.speak(utterance);
    }
}

// Select exam option
function selectExamOption(index) {
    const question = window.currentExamState.exam.questions[window.currentExamState.currentQuestionIndex];
    window.currentExamState.answers[question.id] = index;

    // Update UI
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === index) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
}

// Start exam timer
function startExamTimer(seconds) {
    let timeRemaining = seconds;
    const timerDisplay = document.getElementById('exam-time');

    window.examTimerInterval = setInterval(() => {
        timeRemaining--;
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const secs = timeRemaining % 60;

        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Warning at 5 minutes
        if (timeRemaining === 300) {
            alert('5 minutes remaining!');
        }

        // Time's up
        if (timeRemaining <= 0) {
            clearInterval(window.examTimerInterval);
            submitCurrentExam();
        }
    }, 1000);
}

// Submit current exam
function submitCurrentExam() {
    if (!window.currentExamState) return;

    clearInterval(window.examTimerInterval);

    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    const exam = window.currentExamState.exam;
    const answers = window.currentExamState.answers;

    // Calculate score
    let score = 0;
    let totalMarks = 0;

    exam.questions.forEach(question => {
        totalMarks += question.marks || 2;
        const userAnswer = answers[question.id];
        if (userAnswer === question.correct) {
            score += question.marks || 2;
        }
    });

    const percentage = Math.round((score / totalMarks) * 100);

    // Save submission
    saveStudentSubmission(exam.id, currentUser.id, answers, `${score}/${totalMarks}`);

    // Speak and show result, then auto-logout
    const resultText = `Exam submitted. Your score is ${score} out of ${totalMarks}, which is ${percentage} percent. You will be logged out now.`;
    try { if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch(e) {} } } catch(_){ }
    if (typeof window.speak === 'function') {
        window.speak(resultText, () => {
            try { if (window.AutoscribeUtils) { window.AutoscribeUtils.clearUserData(); } } catch(_){ }
            window.location.href = 'index.html';
        });
    } else {
        alert(`Exam submitted!\n\nYour Score: ${score}/${totalMarks} (${percentage}%)`);
        try { if (window.AutoscribeUtils) { window.AutoscribeUtils.clearUserData(); } } catch(_){ }
        window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    
    // Load exams if on student dashboard
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (currentUser && currentUser.role === 'student') {
        loadStudentExams();
    }
});

// Navigation functions for regular exams
function nextQuestion() {
    if (!window.currentExamState) return;
    
    const currentIndex = window.currentExamState.currentQuestionIndex;
    const totalQuestions = window.currentExamState.exam.questions.length;
    
    if (currentIndex < totalQuestions - 1) {
        loadExamQuestion(currentIndex + 1);
    } else {
        // Last question - submit
        if (confirm('This is the last question. Do you want to submit your exam?')) {
            submitCurrentExam();
        }
    }
}

function previousQuestion() {
    if (!window.currentExamState) return;
    
    const currentIndex = window.currentExamState.currentQuestionIndex;
    
    if (currentIndex > 0) {
        loadExamQuestion(currentIndex - 1);
    }
}

// Mark for review
function markForReview() {
    if (!window.currentExamState) return;
    
    const currentIndex = window.currentExamState.currentQuestionIndex;
    const question = window.currentExamState.exam.questions[currentIndex];
    
    if (!window.currentExamState.markedForReview) {
        window.currentExamState.markedForReview = [];
    }
    
    const isMarked = window.currentExamState.markedForReview.includes(question.id);
    
    if (isMarked) {
        window.currentExamState.markedForReview = window.currentExamState.markedForReview.filter(id => id !== question.id);
        alert('Question unmarked for review');
    } else {
        window.currentExamState.markedForReview.push(question.id);
        alert('Question marked for review');
    }
}

// Export functions
window.saveExamToStorage = saveExamToStorage;
window.getAllExamsFromStorage = getAllExamsFromStorage;
window.getAvailableExamsForStudent = getAvailableExamsForStudent;
window.startExamById = startExamById;
window.submitCurrentExam = submitCurrentExam;
window.loadStudentExams = loadStudentExams;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.markForReview = markForReview;
window.selectExamOption = selectExamOption;
