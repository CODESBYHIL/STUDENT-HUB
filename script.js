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
    "Excellence is not a destination, it's a continuous journey.",
    "Focus on progress, not perfection.",
    "You have everything you need to succeed.",
    "Small daily improvements lead to stunning results.",
    "Your mind is your most powerful tool.",
    "Challenges are opportunities in disguise."
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

// Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to all buttons
function addRippleEffects() {
    const buttons = document.querySelectorAll('button, .quick-action-card');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    addRippleEffects();
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
        // Skip to hub if returning user (optional)
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
    affirmationText.style.opacity = '0';
    setTimeout(() => {
        affirmationText.textContent = getRandomAffirmation();
        affirmationText.style.opacity = '1';
    }, 200);
}

function setupEventListeners() {
    // Welcome screen
    document.getElementById('refreshQuote').addEventListener('click', updateAffirmation);
    document.getElementById('enterHubBtn').addEventListener('click', () => showScreen('studyHub'));

    // Navigation
    document.getElementById('backToWelcomeBtn').addEventListener('click', () => showScreen('welcomeScreen'));
    document.getElementById('newDocBtn').addEventListener('click', openGoogleDoc);
    document.getElementById('aiBtn').addEventListener('click', () => openModal('aiModal'));
    document.getElementById('resourcesBtn').addEventListener('click', () => openModal('resourcesModal'));

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

// AI Chat with HuggingFace API
async function sendMessage() {
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

    // Show loading animation
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-message';
    loadingMsg.id = 'loading-msg';
    loadingMsg.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Get AI response
        const aiResponse = await getAIResponse(message);

        // Remove loading
        document.getElementById('loading-msg').remove();

        // Add AI response
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message';
        aiMsg.innerHTML = `<p>${aiResponse}</p>`;
        chatMessages.appendChild(aiMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        // Remove loading
        document.getElementById('loading-msg').remove();

        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'ai-message';
        errorMsg.innerHTML = `<p>Sorry, I'm having trouble connecting right now. Here's a helpful tip instead: ${getStudyTip()}</p>`;
        chatMessages.appendChild(errorMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// AI Response using HuggingFace Inference API
async function getAIResponse(question) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: question,
                parameters: {
                    max_length: 150,
                    temperature: 0.9,
                    top_p: 0.95
                }
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();

        if (data && data[0] && data[0].generated_text) {
            return data[0].generated_text;
        } else {
            // Fallback to contextual responses
            return getContextualResponse(question);
        }
    } catch (error) {
        console.error('AI Error:', error);
        return getContextualResponse(question);
    }
}

// Fallback contextual responses
function getContextualResponse(question) {
    const lowerQ = question.toLowerCase();

    if (lowerQ.includes('math') || lowerQ.includes('calculus') || lowerQ.includes('algebra') || lowerQ.includes('geometry')) {
        return "For math help, I recommend: 1) Break problems into smaller steps, 2) Practice regularly with Khan Academy or Symbolab, 3) Check your work by substituting answers back, 4) Draw diagrams when possible. What specific topic are you working on?";
    } else if (lowerQ.includes('study') || lowerQ.includes('how to learn')) {
        return "Effective study strategies: 1) **Pomodoro Technique**: 25 min focused study + 5 min break, 2) **Active Recall**: Test yourself instead of re-reading, 3) **Spaced Repetition**: Review material at increasing intervals, 4) **Feynman Technique**: Explain concepts in simple terms. Which would you like to try?";
    } else if (lowerQ.includes('motivation') || lowerQ.includes('motivated') || lowerQ.includes('tired') || lowerQ.includes('give up')) {
        return "Feeling unmotivated is normal! Try: 1) Set tiny goals (study for just 5 minutes to start), 2) Reward yourself after completing tasks, 3) Remember your 'why' - what are you working toward?, 4) Take breaks when needed. You've got this! What's making you feel this way?";
    } else if (lowerQ.includes('essay') || lowerQ.includes('write') || lowerQ.includes('writing') || lowerQ.includes('paper')) {
        return "Essay writing tips: 1) **Brainstorm** ideas before writing, 2) Create a clear **outline** with intro, body paragraphs, and conclusion, 3) Use **PEE method**: Point, Evidence, Explanation, 4) **Edit** multiple times - first for content, then grammar. What type of essay are you writing?";
    } else if (lowerQ.includes('science') || lowerQ.includes('biology') || lowerQ.includes('chemistry') || lowerQ.includes('physics')) {
        return "Science study tips: 1) Understand **concepts**, don't just memorize, 2) Create **concept maps** to see connections, 3) Use **flashcards** for terminology (try Quizlet), 4) Watch **visual explanations** (Crash Course, Khan Academy). Which science topic?";
    } else if (lowerQ.includes('time') || lowerQ.includes('schedule') || lowerQ.includes('organize')) {
        return "Time management tips: 1) **Use this planner** to track all assignments, 2) **Prioritize** by deadline and difficulty, 3) **Time-block** your calendar, 4) Include **breaks and self-care**, 5) Say no to distractions during study time. Need help planning a specific day?";
    } else if (lowerQ.includes('test') || lowerQ.includes('exam') || lowerQ.includes('quiz')) {
        return "Test prep strategies: 1) Start studying **at least a week** before, 2) Create a **study guide** with key concepts, 3) **Practice with past exams** if available, 4) Get **good sleep** the night before, 5) Read questions **carefully** during the test. When's your exam?";
    } else if (lowerQ.includes('reading') || lowerQ.includes('book') || lowerQ.includes('comprehension')) {
        return "Reading comprehension tips: 1) **SQ3R method**: Survey, Question, Read, Recite, Review, 2) Take **notes** while reading, 3) **Highlight** sparingly - only key points, 4) **Summarize** each section in your own words. What are you reading?";
    } else if (lowerQ.includes('stress') || lowerQ.includes('anxiety') || lowerQ.includes('overwhelmed')) {
        return "Managing stress: 1) **Break tasks** into smaller pieces, 2) **Exercise** and move your body, 3) **Deep breathing**: 4-7-8 technique, 4) Talk to someone you trust, 5) Remember: It's okay to ask for help. Take care of yourself first! ❤️";
    } else if (lowerQ.includes('history') || lowerQ.includes('social studies')) {
        return "History study tips: 1) Create **timelines** to see event sequences, 2) Connect events to **cause and effect**, 3) Use **mnemonics** for dates and facts, 4) Watch documentaries for context, 5) Relate events to modern day. What period are you studying?";
    } else if (lowerQ.includes('hello') || lowerQ.includes('hi') || lowerQ.includes('hey')) {
        return "Hello! I'm here to help you succeed in your studies! You can ask me about study techniques, specific subjects (math, science, writing), time management, test prep, or anything else related to school. What would you like to know?";
    } else if (lowerQ.includes('thank')) {
        return "You're very welcome! Remember, consistent effort leads to amazing results. Keep up the great work! Feel free to ask me anything else! 🌟";
    } else {
        return `Great question! While I don't have specific information about that topic, here are some general tips:

1. **Break it down**: Divide complex topics into smaller, manageable parts
2. **Use multiple resources**: Try Khan Academy, YouTube tutorials, or library books
3. **Practice actively**: Do problems/exercises instead of just reading
4. **Ask for help**: Teachers, tutors, or study groups can clarify confusing points

Is there a specific subject or type of question I can help you with?`;
    }
}

// Get study tip
function getStudyTip() {
    const tips = [
        "Take a 5-minute break every 25 minutes of studying (Pomodoro Technique)!",
        "Test yourself instead of re-reading - it helps you remember better!",
        "Teach someone else what you learned - it solidifies your understanding.",
        "Study in the same place and time each day to build a habit.",
        "Get enough sleep - your brain consolidates memories while you sleep!",
        "Use colors and diagrams to make notes more memorable.",
        "Explain concepts out loud in simple terms (Feynman Technique).",
        "Take care of yourself - eat well, exercise, and take breaks!"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Refresh greetings every minute
setInterval(updateGreetings, 60000);
