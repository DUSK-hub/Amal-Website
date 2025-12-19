# Amal (أمل) - Islamic Habit Tracker

A minimal, beautiful, and fully functional Islamic habit tracker web app to help you maintain consistency in your daily religious practices.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password signup and login
- 📊 **30-Day Dashboard** - Track up to 30 days per month
- ✅ **Customizable Habits** - Add, remove, and manage your habits
- 📈 **Consistency Chart** - Visual representation of your progress
- 🌙 **Multiple Themes** - Light, Dark, and Midnight themes
- 🌍 **Bilingual** - English and Arabic with RTL support
- 💾 **Cloud Sync** - All data synced via Supabase
- 📱 **Responsive** - Works perfectly on mobile and desktop
- ⚡ **Real-time Updates** - Changes reflect instantly

## 🎯 Default Habits

- Fajr (الفجر)
- Dhuhr (الظهر)
- Asr (العصر)
- Maghrib (المغرب)
- Isha (العشاء)
- Quran (قرآن)
- Dhikr (ذكر)
- Avoided Sin (تجنب المعصية)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-username/amal-website.git
cd amal-website
```

### 2. Set Up Supabase

Follow the instructions in `Supabase Setup.md`:

1. Create a Supabase project
2. Run the SQL migrations
3. Enable authentication
4. Get your API credentials

### 3. Configure App

Update `app.js` with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Deploy to Vercel

Follow the instructions in `deployment.md`:

1. Push to GitHub
2. Import project to Vercel
3. Deploy!

## 📁 Project Structure

```
amal-website/
├── index.html           # Main HTML structure
├── style.css            # Base styles
├── theme-light.css      # Light theme
├── theme-dark.css       # Dark theme
├── theme-midnight.css   # Midnight theme
├── app.js              # Application logic & Supabase integration
├── Supabase Setup.md   # Database setup guide
├── deployment.md       # Vercel deployment guide
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🛠️ Technologies Used

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel
- **Charts:** HTML5 Canvas

## 🎨 Themes

### Light Theme
Clean and bright - perfect for daytime use

### Dark Theme
Easy on the eyes - great for evening tracking

### Midnight Theme
Deep blue tones - optimal for late-night reflection

## 🌐 Language Support

- **English** - Default language with LTR layout
- **Arabic (العربية)** - Full RTL support with Arabic translations

## 📊 How It Works

1. **Sign up** with your email
2. **Dashboard** displays 30 days horizontally
3. **Check off** completed tasks each day
4. **Add/Remove** habits as needed
5. **View progress** in the consistency chart
6. **Change theme** and language in settings
7. **Data syncs** automatically across all your devices

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Each user can only access their own data
- Passwords hashed and secured by Supabase Auth
- API keys safe to use in frontend (anon/public keys)

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ for the Muslim community
- Inspired by the need for simple, effective habit tracking
- Thanks to Supabase and Vercel for amazing platforms

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section in `deployment.md`
2. Review Supabase setup in `Supabase Setup.md`
3. Open an issue on GitHub
4. Contact via Discord[dusk_in]

## 🎯 Roadmap

Future features (community feedback welcome):

- [ ] Social login (Google, Apple)
- [ ] Export data as CSV/PDF
- [ ] Habit streaks and statistics
- [ ] Reminder notifications
- [ ] Mobile app (React Native)
- [ ] Custom month length (29/30/31 days)
- [ ] Hijri calendar support
- [ ] Dark mode auto-switching

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

**Made with ♥🤲 for improving our daily worship**

May Allah accept all our good deeds. Ameen.