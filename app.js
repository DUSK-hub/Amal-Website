// ========================= //
// app.js - Main Application Logic
// ========================= //

// ========================= //
// SUPABASE CONFIGURATION
// ========================= //
// REPLACE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://opkdjwuathqiibvzfnzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wa2Rqd3VhdGhxaWlidnpmbnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzkzMDQsImV4cCI6MjA4MTY1NTMwNH0.fKwVVHEu0MRe0Cj9atxKSjK-3zbt5opXlQAsEXZnGUA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================= //
// GLOBAL STATE
// ========================= //
let currentUser = null;
let habits = [];
let taskCompletions = {};
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let currentTheme = 'light';
let currentLanguage = 'en';

// Default habits for new users
const DEFAULT_HABITS = [
    { name_en: 'Fajr', name_ar: 'الفجر', order: 1 },
    { name_en: 'Dhuhr', name_ar: 'الظهر', order: 2 },
    { name_en: 'Asr', name_ar: 'العصر', order: 3 },
    { name_en: 'Maghrib', name_ar: 'المغرب', order: 4 },
    { name_en: 'Isha', name_ar: 'العشاء', order: 5 },
    { name_en: 'Quran', name_ar: 'قرآن', order: 6 },
    { name_en: 'Dhikr', name_ar: 'ذكر', order: 7 },
    { name_en: 'Avoided Sin', name_ar: 'تجنب المعصية', order: 8 }
];

// ========================= //
// DOM ELEMENTS
// ========================= //
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authMessage = document.getElementById('auth-message');
const dashboard = document.getElementById('dashboard');
const settingsModal = document.getElementById('settings-modal');
const addHabitModal = document.getElementById('add-habit-modal');

// ========================= //
// INITIALIZATION
// ========================= //
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await checkAuth();
});

// ========================= //
// EVENT LISTENERS
// ========================= //
function setupEventListeners() {
    // Auth forms
    document.getElementById('login').addEventListener('submit', handleLogin);
    document.getElementById('signup').addEventListener('submit', handleSignup);
    document.getElementById('show-signup').addEventListener('click', showSignupForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Settings
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('close-settings').addEventListener('click', closeSettings);
    document.getElementById('theme-select').addEventListener('change', handleThemeChange);
    document.getElementById('language-select').addEventListener('change', handleLanguageChange);

    // Add Habit
    document.getElementById('add-habit-btn').addEventListener('click', openAddHabit);
    document.getElementById('close-add-habit').addEventListener('click', closeAddHabit);
    document.getElementById('add-habit-form').addEventListener('submit', handleAddHabit);

    // Close modals on background click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });
    addHabitModal.addEventListener('click', (e) => {
        if (e.target === addHabitModal) closeAddHabit();
    });
}

// ========================= //
// AUTHENTICATION
// ========================= //
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        await loadApp();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        currentUser = data.user;
        await loadApp();
    } catch (error) {
        showAuthMessage(error.message, 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        showAuthMessage('Account created! Please check your email to verify.', 'success');
        
        // Initialize default habits for new user
        if (data.user) {
            await initializeDefaultHabits(data.user.id);
        }

        setTimeout(() => {
            showLoginForm();
        }, 2000);
    } catch (error) {
        showAuthMessage(error.message, 'error');
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    currentUser = null;
    habits = [];
    taskCompletions = {};
    authScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
    showLoginForm();
}

function showSignupForm(e) {
    e?.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    authMessage.classList.add('hidden');
}

function showLoginForm(e) {
    e?.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    authMessage.classList.add('hidden');
}

function showAuthMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `message ${type}`;
    authMessage.classList.remove('hidden');
}

// ========================= //
// APP INITIALIZATION
// ========================= //
async function loadApp() {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    
    await loadUserSettings();
    await loadHabits();
    await loadTaskCompletions();
    renderDashboard();
    renderChart();
}

async function loadUserSettings() {
    const { data } = await supabase
        .from('profiles')
        .select('theme, language')
        .eq('id', currentUser.id)
        .single();

    if (data) {
        currentTheme = data.theme || 'light';
        currentLanguage = data.language || 'en';
        applyTheme(currentTheme);
        applyLanguage(currentLanguage);
        document.getElementById('theme-select').value = currentTheme;
        document.getElementById('language-select').value = currentLanguage;
    }
}

async function initializeDefaultHabits(userId) {
    const habitsToInsert = DEFAULT_HABITS.map(habit => ({
        user_id: userId,
        name_en: habit.name_en,
        name_ar: habit.name_ar,
        habit_order: habit.order
    }));

    await supabase.from('habits').insert(habitsToInsert);
}

// ========================= //
// HABITS MANAGEMENT
// ========================= //
async function loadHabits() {
    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('habit_order');

    if (!error && data) {
        habits = data;
    }

    // Initialize default habits if none exist
    if (habits.length === 0) {
        await initializeDefaultHabits(currentUser.id);
        await loadHabits();
    }
}

async function handleAddHabit(e) {
    e.preventDefault();
    const habitName = document.getElementById('habit-name').value.trim();

    if (!habitName) return;

    const maxOrder = habits.length > 0 ? Math.max(...habits.map(h => h.habit_order)) : 0;

    const { data, error } = await supabase
        .from('habits')
        .insert({
            user_id: currentUser.id,
            name_en: habitName,
            name_ar: habitName,
            habit_order: maxOrder + 1
        })
        .select()
        .single();

    if (!error && data) {
        habits.push(data);
        renderDashboard();
        renderChart();
        closeAddHabit();
        document.getElementById('add-habit-form').reset();
    }
}

async function deleteHabit(habitId) {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', currentUser.id);

    if (!error) {
        habits = habits.filter(h => h.id !== habitId);
        
        // Delete associated task completions
        await supabase
            .from('task_completions')
            .delete()
            .eq('habit_id', habitId)
            .eq('user_id', currentUser.id);
        
        // Reload completions and re-render
        await loadTaskCompletions();
        renderDashboard();
        renderChart();
    }
}

// ========================= //
// TASK COMPLETIONS
// ========================= //
async function loadTaskCompletions() {
    const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('month', currentMonth)
        .eq('year', currentYear);

    taskCompletions = {};
    if (!error && data) {
        data.forEach(completion => {
            const key = `${completion.habit_id}-${completion.day}`;
            taskCompletions[key] = completion.completed;
        });
    }
}

async function toggleTask(habitId, day) {
    const key = `${habitId}-${day}`;
    const currentValue = taskCompletions[key] || false;
    const newValue = !currentValue;

    // Update local state immediately for responsiveness
    taskCompletions[key] = newValue;

    // Update database
    const { error } = await supabase
        .from('task_completions')
        .upsert({
            user_id: currentUser.id,
            habit_id: habitId,
            day: day,
            month: currentMonth,
            year: currentYear,
            completed: newValue
        }, {
            onConflict: 'user_id,habit_id,day,month,year'
        });

    if (error) {
        // Revert on error
        taskCompletions[key] = currentValue;
        console.error('Error updating task:', error);
    }

    // Update chart
    renderChart();
}

// ========================= //
// DASHBOARD RENDERING
// ========================= //
function renderDashboard() {
    dashboard.innerHTML = '';

    // Header row (days)
    const headerRow = document.createElement('div');
    headerRow.className = 'dashboard-row';

    const habitHeaderCell = document.createElement('div');
    habitHeaderCell.className = 'dashboard-cell header-cell';
    habitHeaderCell.textContent = currentLanguage === 'ar' ? 'العادات' : 'Habits';
    headerRow.appendChild(habitHeaderCell);

    for (let day = 1; day <= 30; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'dashboard-cell day-cell';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    }

    dashboard.appendChild(headerRow);

    // Habit rows
    habits.forEach(habit => {
        const habitRow = document.createElement('div');
        habitRow.className = 'dashboard-row';

        const habitNameCell = document.createElement('div');
        habitNameCell.className = 'dashboard-cell header-cell';
        
        const habitActions = document.createElement('div');
        habitActions.className = 'habit-actions';
        
        const habitName = document.createElement('span');
        habitName.textContent = currentLanguage === 'ar' ? habit.name_ar : habit.name_en;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-habit-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete habit';
        deleteBtn.onclick = () => deleteHabit(habit.id);
        
        habitActions.appendChild(habitName);
        habitActions.appendChild(deleteBtn);
        habitNameCell.appendChild(habitActions);
        habitRow.appendChild(habitNameCell);

        // Day checkboxes
        for (let day = 1; day <= 30; day++) {
            const taskCell = document.createElement('div');
            taskCell.className = 'dashboard-cell';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const key = `${habit.id}-${day}`;
            checkbox.checked = taskCompletions[key] || false;
            checkbox.addEventListener('change', () => toggleTask(habit.id, day));

            taskCell.appendChild(checkbox);
            habitRow.appendChild(taskCell);
        }

        dashboard.appendChild(habitRow);
    });
}

// ========================= //
// CONSISTENCY CHART
// ========================= //
function renderChart() {
    const canvas = document.getElementById('consistency-chart');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 40;
    canvas.height = 200;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate completion percentages
    const percentages = [];
    for (let day = 1; day <= 30; day++) {
        let completed = 0;
        habits.forEach(habit => {
            const key = `${habit.id}-${day}`;
            if (taskCompletions[key]) completed++;
        });
        const percentage = habits.length > 0 ? (completed / habits.length) * 100 : 0;
        percentages.push(percentage);
    }

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.body).color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.body).color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight * i / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw line chart
    if (percentages.length > 0) {
        ctx.strokeStyle = '#667eea';
        ctx.fillStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();

        const stepX = chartWidth / 29;

        percentages.forEach((percentage, index) => {
            const x = padding + (stepX * index);
            const y = height - padding - (chartHeight * percentage / 100);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        percentages.forEach((percentage, index) => {
            const x = padding + (stepX * index);
            const y = height - padding - (chartHeight * percentage / 100);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw labels
    ctx.fillStyle = getComputedStyle(document.body).color;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight * i / 4);
        const label = 100 - (i * 25);
        ctx.fillText(`${label}%`, padding - 15, y + 4);
    }

    // X-axis labels (every 5 days)
    for (let day = 5; day <= 30; day += 5) {
        const x = padding + (stepX * (day - 1));
        ctx.fillText(day, x, height - padding + 20);
    }
}

// ========================= //
// SETTINGS
// ========================= //
function openSettings() {
    settingsModal.classList.remove('hidden');
}

function closeSettings() {
    settingsModal.classList.add('hidden');
}

function openAddHabit() {
    addHabitModal.classList.remove('hidden');
}

function closeAddHabit() {
    addHabitModal.classList.add('hidden');
}

async function handleThemeChange(e) {
    currentTheme = e.target.value;
    applyTheme(currentTheme);
    await saveUserSettings();
}

async function handleLanguageChange(e) {
    currentLanguage = e.target.value;
    applyLanguage(currentLanguage);
    await saveUserSettings();
}

function applyTheme(theme) {
    const themeLink = document.getElementById('theme-stylesheet');
    themeLink.href = `theme-${theme}.css`;
}

function applyLanguage(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Re-render dashboard to update habit names
    renderDashboard();
}

async function saveUserSettings() {
    await supabase
        .from('profiles')
        .upsert({
            id: currentUser.id,
            theme: currentTheme,
            language: currentLanguage
        }, {
            onConflict: 'id'
        });
}

// ========================= //
// WINDOW RESIZE HANDLER
// ========================= //
window.addEventListener('resize', () => {
    renderChart();
});