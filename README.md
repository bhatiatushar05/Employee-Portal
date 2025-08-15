# HITS - Employee Management System

A comprehensive employee management system with modern UI and dark mode support.

## Features

- **Authentication System** - Secure login with role-based access
- **Dashboard** - Overview of system metrics and activities
- **Employee Portal** - Employee management and request handling
- **Attendance Tracking** - Monitor employee attendance
- **Visitor Management** - Track and manage visitors
- **CCTV Monitoring** - Real-time surveillance monitoring
- **Dark Mode** - Beautiful dark theme with custom color scheme

## Dark Mode

The application includes a comprehensive dark mode feature with a custom color scheme featuring:
- **Dark Blue** (#0a0a0f, #111827) - Primary background colors
- **Black** - Deep shadows and accents
- **Orange** (#f97316) - Accent color for highlights and interactions

### How to Enable Dark Mode

1. **Settings Panel**: Click on the Settings icon in the sidebar to open the settings modal
2. **Dark Mode Toggle**: Use the toggle switch in the General section to enable/disable dark mode
3. **Quick Toggle**: Use the sun/moon icon in the top-right header for quick access
4. **Automatic**: The system remembers your preference and automatically applies it on future visits

### Dark Mode Features

- **Persistent Storage** - Your preference is saved in localStorage
- **System Preference Detection** - Automatically detects your system's dark mode preference
- **Smooth Transitions** - Elegant color transitions when switching themes
- **Comprehensive Coverage** - All components and pages support dark mode

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HITS
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

### Admin Access
- **Email**: admin@hits.com
- **Password**: admin123

### Employee Access
- **Email**: employee@hits.com
- **Password**: emp123

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom dark mode support
- **Icons**: Lucide React
- **Charts**: Chart.js and Recharts
- **Authentication**: Custom Auth Context
- **Database**: Supabase (configured)

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Sidebar/        # Navigation sidebar
│   ├── TopRightHeader/ # Header with search and notifications
│   └── ...            # Other feature components
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state management
│   └── ThemeContext.jsx # Dark mode state management
├── assets/             # Static assets
└── data/              # Mock data and utilities
```

## Customization

### Adding New Dark Mode Colors

To add new dark mode colors, update the `tailwind.config.js` file:

```javascript
colors: {
  'dark': {
    'custom': '#your-color-here',
    // ... other colors
  }
}
```

### Modifying Dark Mode Behavior

The dark mode logic is centralized in `src/contexts/ThemeContext.jsx`. You can modify:
- Initial theme detection
- Storage mechanism
- Transition effects
- System preference handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
