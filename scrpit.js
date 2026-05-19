// DOM Element Targets
const todoInput = document.getElementById('todoInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMsg = document.getElementById('emptyMsg');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const searchInput = document.getElementById('searchInput');
const themeBtn = document.getElementById('themeBtn');

// Reactive State Controllers
let currentFilter = 'all';
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save Application Tasks to Browser Sync
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Main Component Engine Render Method
function renderTasks(filter = 'all') {
    todoList.innerHTML = '';
    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    const searchText = searchInput.value.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    filteredTasks.forEach((task, originalIndex) => {
        // Find correct internal storage index relative to the core collection map
        const taskIndex = tasks.findIndex(t => t === task);

        const item = document.createElement('div');
        item.className = 'todo-item';

        item.innerHTML = `
            <div>
                <div class="task-text ${task.completed ? 'completed' : ''}">
                    ${task.text}
                </div>
                <div class="task-date">
                    📅 ${task.date || 'No Date'}
                </div>
            </div>
            <div class="actions">
                <button class="action-btn complete-btn">
                    <i class="bi bi-check"></i>
                </button>
                <button class="action-btn edit-btn">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete-btn">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        // Interactive Task Event Subscriptions
        item.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(currentFilter);
        });

        item.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(taskIndex, 1);
            saveTasks();
            renderTasks(currentFilter);
        });

        item.querySelector('.edit-btn').addEventListener('click', () => {
            const newTask = prompt('Edit task:', task.text);
            if (newTask && newTask.trim() !== '') {
                task.text = newTask.trim();
                saveTasks();
                renderTasks(currentFilter);
            }
        });

        todoList.appendChild(item);
    });

    updateProgress();
    emptyMsg.style.display = filteredTasks.length === 0 ? 'block' : 'none';
}

// Add New Target Task Node Action
function addTask() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    tasks.push({
        text: text,
        date: taskDate.value,
        completed: false
    });

    saveTasks();
    todoInput.value = '';
    taskDate.value = '';
    renderTasks(currentFilter);
}

// Dynamically Calculate Visual Completion Metrics
function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = percent + '%';
    progressText.innerText = percent + '%';
}

// Application Interface Configuration Listeners
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

searchInput.addEventListener('input', () => {
    renderTasks(currentFilter);
});

// Interactive Filtering Buttons Initialization Loop
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks(currentFilter);
    });
});

// Speech Webkit API Verification and Integration Subroutine
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '<i class="bi bi-mic-fill"></i>';
    voiceBtn.className = 'btn btn-danger ms-2';
    document.querySelector('.input-group').appendChild(voiceBtn);

    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = function (event) {
        todoInput.value = event.results[0][0].transcript;
    };
}

// Submit Events Key Binding Map Rules
addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize Framework Engine
renderTasks();