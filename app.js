// ================================================
// SUPABASE CONFIGURATION
// ================================================
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://opkdjwuathqiibvzfnzl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wa2Rqd3VhdGhxaWlidnpmbnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzkzMDQsImV4cCI6MjA4MTY1NTMwNH0.fKwVVHEu0MRe0Cj9atxKSjK-3zbt5opXlQAsEXZnGUA';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================
// TRANSLATIONS
// ================================================

const translations = {
    en: {
        app_title: 'Amal (أمل)',
        auth_subtitle: 'Islamic Habit Tracker',
        login: 'Login',
        signup: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirm_password: 'Confirm Password',
        magic_link: 'Send Magic Link',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
        theme_midnight: 'Midnight',
        manage_habits: 'Manage Habits',
        add_habit_placeholder: 'Add new habit',
        add: 'Add',
        remove: 'Remove',
        consistency: 'Consistency',
        total_completed: 'Total Completed',
        completion_rate: 'Completion Rate',
        current_streak: 'Day Streak',
        loading: 'Loading...',
        // Default habits
        fajr: 'Fajr',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha',
        quran: 'Quran',
        dhikr: 'Dhikr',
        avoid_sin: 'Avoid Sin',
        // Months
        month_0: 'January', month_1: 'February', month_2: 'March',
        month_3: 'April', month_4: 'May', month_5: 'June',
        month_6: 'July', month_7: 'August', month_8: 'September',
        month_9: 'October', month_10: 'November', month_11: 'December'
    },
    ar: {
        app_title: 'أمل',
        auth_subtitle: 'متتبع العادات الإسلامية',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirm_password: 'تأكيد كلمة المرور',
        magic_link: 'إرسال رابط سحري',
        settings: 'الإعدادات',
        language: 'اللغة',
        theme: 'المظهر',
        theme_light: 'فاتح',
        theme_dark: 'داكن',
        theme_midnight: 'ليلي',
        manage_habits: 'إدارة العادات',
        add_habit_placeholder: 'أضف عادة جديدة',
        add: 'إضافة',
        remove: 'حذف',
        consistency: 'الاستمرارية',
        total_completed: 'المجموع المكتمل',
        completion_rate: 'نسبة الإنجاز',
        current_streak: 'سلسلة الأيام',
        loading: 'جاري التحميل...',
        // Default habits
        fajr: 'الفجر',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',
        quran: 'القرآن',
        dhikr: 'الذكر',
        avoid_sin: 'تجنب الذنب',
        // Months
        month_0: 'يناير', month_1: 'فبراير', month_2: 'مارس',
        month_3: 'أبريل', month_4: 'مايو', month_5: 'يونيو',
        month_6: 'يوليو', month_7: 'أغسطس', month_8: 'سبتمبر',
        month_9: 'أكتوبر', month_10: 'نوفمبر', month_11: 'ديسمبر'
    }
};

// ================================================
// DEFAULT HABITS
// ================================================

const DEFAULT_HABITS = [
    { id: 'fajr', translation_key: 'fajr', sort_order: 1 },
    { id: 'dhuhr', translation_key: 'dhuhr', sort_order: 2 },
    { id: 'asr', translation_key: 'asr', sort_order: 3 },
    { id: 'maghrib', translation_key: 'maghrib', sort_order: 4 },
    { id: 'isha', translation_key: 'isha', sort_order: 5 },
    { id: 'quran', translation_key: 'quran', sort_order: 6 },
    { id: 'dhikr', translation_key: 'dhikr', sort_order: 7 },
    { id: 'avoid_sin', translation_key: 'avoid_sin', sort_order: 8 }
];

// ================================================
// DATABASE MODULE (Supabase Integration)
// ================================================

const DB = {
    /**
     * Get user's habits from database
     */
    async getHabits(userId) {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching habits:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Create default habits for new user
     */
    async createDefaultHabits(userId) {
        const habits = DEFAULT_HABITS.map(h => ({
            ...h,
            user_id: userId,
            custom_name: null
        }));

        const { error } = await supabase
            .from('habits')
            .insert(habits);

        if (error) {
            console.error('Error creating default habits:', error);
        }
    },

    /**
     * Add a new habit
     */
    async addHabit(userId, habitName) {
        const { data: existingHabits } = await supabase
            .from('habits')
            .select('sort_order')
            .eq('user_id', userId)
            .order('sort_order', { ascending: false })
            .limit(1);

        const maxOrder = existingHabits?.[0]?.sort_order || 0;

        const { data, error } = await supabase
            .from('habits')
            .insert({
                user_id: userId,
                id: `custom_${Date.now()}`,
                translation_key: null,
                custom_name: habitName,
                sort_order: maxOrder + 1
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding habit:', error);
            return null;
        }

        return data;
    },

    /**
     * Delete a habit
     */
    async deleteHabit(habitId, userId) {
        const { error } = await supabase
            .from('habits')
            .delete()
            .eq('id', habitId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting habit:', error);
            return false;
        }

        return true;
    },

    /**
     * Get habit completions for a specific month
     */
    async getMonthCompletions(userId, year, month) {
        const { data, error } = await supabase
            .from('completions')
            .select('*')
            .eq('user_id', userId)
            .eq('year', year)
            .eq('month', month);

        if (error) {
            console.error('Error fetching completions:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Toggle habit completion
     */
    async toggleCompletion(userId, year, month, day, habitId, completed) {
        if (completed) {
            // Insert completion
            const { error } = await supabase
                .from('completions')
                .insert({
                    user_id: userId,
                    habit_id: habitId,
                    year,
                    month,
                    day,
                    completed_at: new Date().toISOString()
                });

            if (error && error.code !== '23505') { // Ignore duplicate errors
                console.error('Error adding completion:', error);
            }
        } else {
            // Delete completion
            const { error } = await supabase
                .from('completions')
                .delete()
                .eq('user_id', userId)
                .eq('habit_id', habitId)
                .eq('year', year)
                .eq('month', month)
                .eq('day', day);

            if (error) {
                console.error('Error removing completion:', error);
            }
        }
    },

    /**
     * Get user preferences
     */
    async getPreferences(userId) {
        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // Create default preferences if they don't exist
            if (error.code === 'PGRST116') {
                return await this.createDefaultPreferences(userId);
            }
            console.error('Error fetching preferences:', error);
            return null;
        }

        return data;
    },

    /**
     * Create default preferences
     */
    async createDefaultPreferences(userId) {
        const { data, error } = await supabase
            .from('user_preferences')
            .insert({
                user_id: userId,
                language: 'en',
                theme: 'dark'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating preferences:', error);
            return { language: 'en', theme: 'dark' };
        }

        return data;
    },

    /**
     * Update user preferences
     */
    async updatePreferences(userId, preferences) {
        const { error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: userId,
                ...preferences
            });

        if (error) {
            console.error('Error updating preferences:', error);
        }
    }
};

// ================================================
// APPLICATION STATE
// ================================================

const App = {
    currentUser: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    currentLanguage: 'en',
    currentTheme: 'dark',
    habits: [],
    completions: [],
    isLoading: false,

    /**
     * Initialize the application
     */
    async init() {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            this.currentUser = session.user;
            await this.loadUserData();
            this.showApp();
        } else {
            this.showAuth();
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.currentUser = session.user;
                await this.loadUserData();
                this.showApp();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.showAuth();
            }
        });

        this.setupAuthListeners();
        this.setupAppListeners();
    },

    /**
     * Load user data from database
     */
    async loadUserData() {
        this.setLoading(true);

        try {
            // Load preferences
            const prefs = await DB.getPreferences(this.currentUser.id);
            if (prefs) {
                this.currentLanguage = prefs.language || 'en';
                this.currentTheme = prefs.theme || 'dark';
                this.applyLanguage(this.currentLanguage);
                this.applyTheme(this.currentTheme);
            }

            // Load habits
            this.habits = await DB.getHabits(this.currentUser.id);
            
            // Create default habits if none exist
            if (this.habits.length === 0) {
                await DB.createDefaultHabits(this.currentUser.id);
                this.habits = await DB.getHabits(this.currentUser.id);
            }

            // Load completions for current month
            await this.loadMonthData();

        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            this.setLoading(false);
        }
    },

    /**
     * Load completions for current month
     */
    async loadMonthData() {
        this.completions = await DB.getMonthCompletions(
            this.currentUser.id,
            this.currentYear,
            this.currentMonth
        );
        
        this.renderMonthDisplay();
        this.renderHabitTable();
        this.renderChart();
        this.updateStats();
    },

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        const indicator = document.getElementById('loadingIndicator');
        const content = document.getElementById('dashboardContent');
        
        if (loading) {
            indicator.style.display = 'block';
            content.style.display = 'none';
        } else {
            indicator.style.display = 'none';
            content.style.display = 'block';
        }
    },

    /**
     * Show auth screen
     */
    showAuth() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
    },

    /**
     * Show app screen
     */
    showApp() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
    },

    /**
     * Setup authentication listeners
     */
    setupAuthListeners() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const targetTab = e.target.dataset.tab;
                document.getElementById('loginForm').style.display = targetTab === 'login' ? 'block' : 'none';
                document.getElementById('signupForm').style.display = targetTab === 'signup' ? 'block' : 'none';
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await this.login(email, password);
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupPasswordConfirm').value;
            
            if (password !== confirmPassword) {
                this.showAuthMessage('Passwords do not match', 'error');
                return;
            }
            
            await this.signup(email, password);
        });

        // Magic link
        document.getElementById('magicLinkBtn').addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value;
            if (!email) {
                this.showAuthMessage('Please enter your email', 'error');
                return;
            }
            await this.sendMagicLink(email);
        });
    },

    /**
     * Setup app listeners
     */
    setupAppListeners() {
        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.closeSettings());
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') this.closeSettings();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Language buttons
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLanguage(e.target.dataset.lang);
            });
        });

        // Theme buttons
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTheme(e.target.dataset.theme);
            });
        });

        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.prevMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());

        // Add habit
        document.getElementById('addHabitBtn').addEventListener('click', () => this.addHabit());
        document.getElementById('newHabitInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });

        // Resize chart
        window.addEventListener('resize', () => this.renderChart());
    },

    /**
     * Login with email/password
     */
    async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
            this.showAuthMessage(error.message, 'error');
        }
    },

    /**
     * Signup with email/password
     */
    async signup(email, password) {
        const { error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
            this.showAuthMessage(error.message, 'error');
        } else {
            this.showAuthMessage('Check your email to confirm your account!', 'success');
        }
    },

    /**
     * Send magic link
     */
    async sendMagicLink(email) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        
        if (error) {
            this.showAuthMessage(error.message, 'error');
        } else {
            this.showAuthMessage('Check your email for the login link!', 'success');
        }
    },

    /**
     * Logout
     */
    async logout() {
        await supabase.auth.signOut();
    },

    /**
     * Show auth message
     */
    showAuthMessage(message, type) {
        const msgEl = document.getElementById('authMessage');
        msgEl.textContent = message;
        msgEl.className = `auth-message ${type}`;
        
        setTimeout(() => {
            msgEl.className = 'auth-message';
        }, 5000);
    },

    /**
     * Open settings modal
     */
    openSettings() {
        document.getElementById('settingsModal').classList.add('active');
        this.renderHabitsList();
        this.updateSettingsButtons();
    },

    /**
     * Close settings modal
     */
    closeSettings() {
        document.getElementById('settingsModal').classList.remove('active');
    },

    /**
     * Update settings buttons state
     */
    updateSettingsButtons() {
        document.querySelectorAll('[data-lang]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
        });
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
        });
    },

    /**
     * Switch language
     */
    async switchLanguage(lang) {
        this.currentLanguage = lang;
        this.applyLanguage(lang);
        this.updateSettingsButtons();
        this.renderMonthDisplay();
        this.renderHabitTable();
        
        // Save to database
        await DB.updatePreferences(this.currentUser.id, { language: lang });
    },

    /**
     * Apply language
     */
    applyLanguage(lang) {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    },

    /**
     * Switch theme
     */
    async switchTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.updateSettingsButtons();
        
        // Save to database
        await DB.updatePreferences(this.currentUser.id, { theme });
    },

    /**
     * Apply theme
     */
    applyTheme(theme) {
        document.getElementById('theme-stylesheet').href = `theme-${theme}.css`;
    },

    /**
     * Translate text
     */
    t(key) {
        return translations[this.currentLanguage][key] || key;
    },

    /**
     * Get habit name
     */
    getHabitName(habit) {
        if (habit.custom_name) {
            return habit.custom_name;
        }
        return this.t(habit.translation_key);
    },

    /**
     * Navigate to previous month
     */
    async prevMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        await this.loadMonthData();
    },

    /**
     * Navigate to next month
     */
    async nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        await this.loadMonthData();
    },

    /**
     * Render month display
     */
    renderMonthDisplay() {
        document.getElementById('currentMonth').textContent = this.t(`month_${this.currentMonth}`);
        document.getElementById('currentYear').textContent = this.currentYear;
    },

    /**
     * Get days in month
     */
    getDaysInMonth() {
        return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },

    /**
     * Render habit table
     */
    renderHabitTable() {
        const daysInMonth = this.getDaysInMonth();
        
        // Render days header
        const daysRow = document.getElementById('daysRow');
        daysRow.innerHTML = '<th class="habit-label-cell"></th>';
        for (let day = 1; day <= daysInMonth; day++) {
            const th = document.createElement('th');
            th.textContent = day;
            daysRow.appendChild(th);
        }

        // Render habit rows
        const tbody = document.getElementById('habitRows');
        tbody.innerHTML = '';

        this.habits.forEach(habit => {
            const row = document.createElement('tr');
            
            // Habit name
            const nameCell = document.createElement('td');
            nameCell.className = 'habit-name';
            nameCell.textContent = this.getHabitName(habit);
            row.appendChild(nameCell);

            // Checkboxes for each day
            for (let day = 1; day <= daysInMonth; day++) {
                const cell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'habit-checkbox';
                
                // Check if completed
                const isCompleted = this.completions.some(c => 
                    c.habit_id === habit.id && c.day === day
                );
                checkbox.checked = isCompleted;
                
                // Add change listener
                checkbox.addEventListener('change', async (e) => {
                    await this.toggleHabitCompletion(habit.id, day, e.target.checked);
                });

                cell.appendChild(checkbox);
                row.appendChild(cell);
            }

            tbody.appendChild(row);
        });
    },

    /**
     * Toggle habit completion
     */
    async toggleHabitCompletion(habitId, day, completed) {
        // Update database
        await DB.toggleCompletion(
            this.currentUser.id,
            this.currentYear,
            this.currentMonth,
            day,
            habitId,
            completed
        );

        // Update local state
        if (completed) {
            this.completions.push({
                habit_id: habitId,
                day,
                year: this.currentYear,
                month: this.currentMonth
            });
        } else {
            this.completions = this.completions.filter(c => 
                !(c.habit_id === habitId && c.day === day)
            );
        }

        // Update UI
        this.renderChart();
        this.updateStats();
    },

    /**
     * Render habits list in settings
     */
    renderHabitsList() {
        const container = document.getElementById('habitsList');
        container.innerHTML = '';

        this.habits.forEach(habit => {
            const item = document.createElement('div');
            item.className = 'habit-item';

            const name = document.createElement('span');
            name.className = 'habit-item-name';
            name.textContent = this.getHabitName(habit);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn-remove';
            removeBtn.textContent = this.t('remove');
            removeBtn.addEventListener('click', () => this.removeHabit(habit.id));

            item.appendChild(name);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    },

    /**
     * Add new habit
     */
    async addHabit() {
        const input = document.getElementById('newHabitInput');
        const habitName = input.value.trim();

        if (!habitName) return;

        const newHabit = await DB.addHabit(this.currentUser.id, habitName);
        
        if (newHabit) {
            this.habits.push(newHabit);
            input.value = '';
            this.renderHabitsList();
            this.renderHabitTable();
        }
    },

    /**
     * Remove habit
     */
    async removeHabit(habitId) {
        if (!confirm('Are you sure you want to remove this habit?')) return;

        const success = await DB.deleteHabit(habitId, this.currentUser.id);
        
        if (success) {
            this.habits = this.habits.filter(h => h.id !== habitId);
            this.renderHabitsList();
            this.renderHabitTable();
            this.renderChart();
            this.updateStats();
        }
    },

    /**
     * Render consistency chart
     */
    renderChart() {
        const canvas = document.getElementById('consistencyChart');
        const ctx = canvas.getContext('2d');
        const daysInMonth = this.getDaysInMonth();

        // Set canvas size
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = 200;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate data points
        const dataPoints = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCompletions = this.completions.filter(c => c.day === day).length;
            const totalHabits = this.habits.length;
            const percentage = totalHabits > 0 ? (dayCompletions / totalHabits) * 100 : 0;
            dataPoints.push(percentage);
        }

        // Chart dimensions
        const padding = 20;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const pointSpacing = chartWidth / (daysInMonth - 1 || 1);

        // Get colors
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-color').trim();
        const borderColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--border-color').trim();

        // Draw grid
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Draw line
        if (dataPoints.length > 0) {
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            ctx.beginPath();
            dataPoints.forEach((value, index) => {
                const x = padding + (index * pointSpacing);
                const y = padding + chartHeight - (value / 100) * chartHeight;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw points
            ctx.fillStyle = accentColor;
            dataPoints.forEach((value, index) => {
                const x = padding + (index * pointSpacing);
                const y = padding + chartHeight - (value / 100) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },

    /**
     * Update statistics
     */
    updateStats() {
        const daysInMonth = this.getDaysInMonth();
        const totalPossible = daysInMonth * this.habits.length;
        const totalCompleted = this.completions.length;
        const completionRate = totalPossible > 0 
            ? Math.round((totalCompleted / totalPossible) * 100) 
            : 0;

        // Calculate streak
        const streak = this.calculateStreak();

        // Update UI
        document.getElementById('totalCompleted').textContent = totalCompleted;
        document.getElementById('completionRate').textContent = completionRate + '%';
        document.getElementById('currentStreak').textContent = streak;
    },

    /**
     * Calculate current streak
     */
    calculateStreak() {
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);

        while (true) {
            const year = checkDate.getFullYear();
            const month = checkDate.getMonth();
            const day = checkDate.getDate();

            // Count completions for this day
            const dayCompletions = this.completions.filter(c => 
                c.year === year && c.month === month && c.day === day
            ).length;

            // If all habits completed, increment streak
            if (dayCompletions === this.habits.length && this.habits.length > 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }

            // Stop if we've gone back 365 days
            if (streak > 365) break;
        }

        return streak;
    }
};

// ================================================
// INITIALIZE APP
// ================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}