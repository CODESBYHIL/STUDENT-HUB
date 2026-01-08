// Affirmations and Quotes
const affirmations = [
    "You are capable of amazing things.",
    "Every small step you take is progress.",
    "Your hard work will pay off.",
    "Believe in yourself and all that you are.",
    "Success is the sum of small efforts repeated day in and day out.",
    "You are smarter than you think.",
    "The expert in anything was once a beginner.",
    "Your potential is endless.",
    "Great things never come from comfort zones.",
    "You are creating your own success story.",
    "Learning is a treasure that will follow you everywhere.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You don't have to be perfect to be amazing.",
    "Every accomplishment starts with the decision to try.",
    "Your education is an investment in your future.",
    "Mistakes are proof that you are trying.",
    "The only way to do great work is to love what you do.",
    "You are enough, exactly as you are.",
    "Dream big, work hard, stay focused.",
    "You are one step closer to your goals.",
    "Education is the most powerful weapon you can use to change the world.",
    "Your attitude determines your direction.",
    "The harder you work, the luckier you get.",
    "You are building the foundation for your dreams.",
    "Keep going, you're doing great!",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "You are stronger than your excuses.",
    "The only limit is the one you set for yourself.",
    "Your study session today is an investment in tomorrow.",
    "Excellence is not a destination, it's a continuous journey."
];

// Get time-based greeting
function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
}

// Get formatted date
function getFormattedDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Get random affirmation
function getRandomAffirmation() {
    return affirmations[Math.floor(Math.random() * affirmations.length)];
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set greetings
    updateGreetings();

    // Set affirmation
    updateAffirmation();

    // Set date
    document.getElementById('currentDate').textContent = getFormattedDate();

    // Load subjects
    loadSubjects();

    // Load tasks
    loadTodayTasks();

    // Event listeners
    setupEventListeners();

    // Check if user has visited before
    if (localStorage.getItem('hasVisited')) {
        // Skip to hub if returning user
        // showScreen('studyHub');
    }
    localStorage.setItem('hasVisited', 'true');
}

function updateGreetings() {
    const greeting = getTimeGreeting();
    const timeGreetingEl = document.getElementById('timeGreeting');
    const hubGreetingEl = document.getElementById('hubGreeting');

    if (timeGreetingEl) timeGreetingEl.textContent = greeting;
    if (hubGreetingEl) hubGreetingEl.textContent = greeting;
}

function updateAffirmation() {
    const affirmationText = document.getElementById('affirmationText');
    affirmationText.textContent = getRandomAffirmation();
}

function setupEventListeners() {
    // Welcome screen
    document.getElementById('refreshQuote').addEventListener('click', updateAffirmation);
    document.getElementById('enterHubBtn').addEventListener('click', () => showScreen('studyHub'));

    // Navigation
    document.getElementById('backToWelcomeBtn').addEventListener('click', () => showScreen('welcomeScreen'));
    document.getElementById('newDocBtn').addEventListener('click', openGoogleDoc);
    document.getElementById('aiBtn').addEventListener('click', () => openModal('aiModal'));

    // Add subject
    document.getElementById('addSubjectBtn').addEventListener('click', () => openModal('addSubjectModal'));
    document.getElementById('closeSubjectModalBtn').addEventListener('click', () => closeModal('addSubjectModal'));
    document.getElementById('saveSubjectBtn').addEventListener('click', addSubject);

    // AI Modal
    document.getElementById('closeAiBtn').addEventListener('click', () => closeModal('aiModal'));
    document.getElementById('sendChatBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Google Workspace Integration
function openGoogleDoc() {
    window.open('https://docs.google.com/document/create', '_blank');
}

function openGoogleSheets() {
    window.open('https://docs.google.com/spreadsheets/create', '_blank');
}

function openGoogleSlides() {
    window.open('https://docs.google.com/presentation/create', '_blank');
}

// Subject Management
function loadSubjects() {
    const subjects = getSubjects();
    const subjectsGrid = document.getElementById('subjectsGrid');

    if (subjects.length === 0) {
        // Add default subjects for first-time users
        const defaultSubjects = [
            { name: 'Mathematics', color: '#6366f1', tasks: [] },
            { name: 'English', color: '#8b5cf6', tasks: [] },
            { name: 'Biology', color: '#10b981', tasks: [] },
            { name: 'History', color: '#f59e0b', tasks: [] }
        ];
        saveSubjects(defaultSubjects);
        renderSubjects(defaultSubjects);
    } else {
        renderSubjects(subjects);
    }
}

function renderSubjects(subjects) {
    const subjectsGrid = document.getElementById('subjectsGrid');
    subjectsGrid.innerHTML = '';

    subjects.forEach((subject, index) => {
        const subjectCard = createSubjectCard(subject, index);
        subjectsGrid.appendChild(subjectCard);
    });
}

function createSubjectCard(subject, index) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.borderLeftColor = subject.color;

    const tasksHTML = subject.tasks.map((task, taskIndex) => `
        <div class="task-item">
            <input type="checkbox" class="task-checkbox"
                   ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${index}, ${taskIndex})">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        </div>
    `).join('');

    card.innerHTML = `
        <div class="subject-header">
            <h3 class="subject-name">${subject.name}</h3>
            <button class="subject-menu-btn" onclick="deleteSubject(${index})" title="Delete subject">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </div>
        <div class="subject-tasks">
            ${tasksHTML}
        </div>
        <button class="add-task-btn" onclick="addTask(${index})">+ Add Task</button>
    `;

    return card;
}

function getSubjects() {
    const subjects = localStorage.getItem('subjects');
    return subjects ? JSON.parse(subjects) : [];
}

function saveSubjects(subjects) {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function addSubject() {
    const nameInput = document.getElementById('subjectNameInput');
    const colorPicker = document.getElementById('subjectColorPicker');

    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a subject name');
        return;
    }

    const subjects = getSubjects();
    subjects.push({
        name: name,
        color: colorPicker.value,
        tasks: []
    });

    saveSubjects(subjects);
    renderSubjects(subjects);

    nameInput.value = '';
    closeModal('addSubjectModal');
}

function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject?')) {
        const subjects = getSubjects();
        subjects.splice(index, 1);
        saveSubjects(subjects);
        renderSubjects(subjects);
        loadTodayTasks();
    }
}

function addTask(subjectIndex) {
    const taskText = prompt('Enter task:');
    if (!taskText) return;

    const subjects = getSubjects();
    subjects[subjectIndex].tasks.push({
        text: taskText,
        completed: false
    });

    saveSubjects(subjects);
    renderSubjects(subjects);
    loadTodayTasks();
}

function toggleTask(subjectIndex, taskIndex) {
    const subjects = getSubjects();
    subjects[subjectIndex].tasks[taskIndex].completed =
        !subjects[subjectIndex].tasks[taskIndex].completed;

    saveSubjects(subjects);
    renderSubjects(subjects);
    loadTodayTasks();
}

// Today's Tasks
function loadTodayTasks() {
    const subjects = getSubjects();
    const todayTasksContainer = document.getElementById('todayTasks');

    const allTasks = [];
    subjects.forEach(subject => {
        subject.tasks.forEach(task => {
            if (!task.completed) {
                allTasks.push({
                    subject: subject.name,
                    color: subject.color,
                    text: task.text
                });
            }
        });
    });

    if (allTasks.length === 0) {
        todayTasksContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No pending tasks. Great job! 🎉</p>';
        return;
    }

    todayTasksContainer.innerHTML = allTasks.map(task => `
        <div class="task-item-large">
            <div style="width: 4px; height: 40px; background: ${task.color}; border-radius: 2px;"></div>
            <div>
                <div style="font-weight: 600; color: var(--text);">${task.text}</div>
                <div style="font-size: 0.9rem; color: var(--text-secondary);">${task.subject}</div>
            </div>
        </div>
    `).join('');
}

// AI Chat
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    const chatMessages = document.getElementById('chatMessages');

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMsg);

    input.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI response (in production, you'd call an actual AI API)
    setTimeout(() => {
        const aiResponse = getAIResponse(message);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message';
        aiMsg.innerHTML = `<p>${aiResponse}</p>`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function getAIResponse(question) {
    const lowerQ = question.toLowerCase();

    // Simple response system (you can replace with actual AI API)
    if (lowerQ.includes('math') || lowerQ.includes('calculus') || lowerQ.includes('algebra')) {
        return "For math help, I recommend breaking down complex problems into smaller steps. Practice is key! Khan Academy and Paul's Online Math Notes are excellent free resources.";
    } else if (lowerQ.includes('study') || lowerQ.includes('how to')) {
        return "Here are some effective study techniques: 1) Pomodoro Technique (25 min study, 5 min break), 2) Active recall - test yourself, 3) Spaced repetition, 4) Teach concepts to others. What subject are you focusing on?";
    } else if (lowerQ.includes('motivation') || lowerQ.includes('motivated')) {
        return "Remember why you started! Break your goals into smaller milestones, celebrate small wins, and don't compare yourself to others. You're on your own unique journey to success! 💪";
    } else if (lowerQ.includes('essay') || lowerQ.includes('write') || lowerQ.includes('writing')) {
        return "For essay writing: 1) Start with a clear thesis, 2) Create an outline, 3) Use the PEE method (Point, Evidence, Explanation), 4) Proofread multiple times. Need help with a specific part?";
    } else if (lowerQ.includes('science') || lowerQ.includes('biology') || lowerQ.includes('chemistry')) {
        return "Science is all about understanding concepts, not just memorizing. Try creating concept maps, using flashcards for terminology, and relating concepts to real-world examples. Which topic are you working on?";
    } else if (lowerQ.includes('time') || lowerQ.includes('schedule')) {
        return "Time management tips: 1) Use this planner to track all assignments, 2) Prioritize tasks by deadline and difficulty, 3) Block out study time on your calendar, 4) Include breaks and self-care. Balance is important!";
    } else if (lowerQ.includes('test') || lowerQ.includes('exam')) {
        return "Test prep strategies: 1) Start studying at least a week before, 2) Create a study guide, 3) Practice with past papers, 4) Get enough sleep the night before, 5) Stay calm and read questions carefully. You've got this!";
    } else {
        return "I'm here to help with study tips, subject guidance, time management, and motivation! Feel free to ask me anything about your studies. What would you like to know?";
    }
}

// Refresh greetings every minute
setInterval(updateGreetings, 60000);
