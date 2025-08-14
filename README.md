# HITS Employee Portal

A comprehensive employee management system with role-based access control and modern UI.

## Features

### 🔐 Authentication System
- **Admin Access**: Full access to all features
- **Employee Access**: Limited to Employee Portal and Attendance
- **Secure Login**: Role-based permissions and access control

### 🎯 Core Functionality
- **Dashboard**: Overview and analytics
- **Employee Portal**: Employee management and information
- **Attendance System**: Track employee attendance
- **Visitor Management**: Digital visitor passes with QR codes

- **CCTV Monitoring**: Security camera management
- **File Manager**: Document and file organization

### 🎨 User Interface
- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all devices
- **Sidebar Navigation**: Easy access to all features
- **Search Functionality**: Quick navigation with ⌘K shortcut
- **Notifications**: Real-time updates and alerts

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Employee-Portal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Login Credentials

#### Admin Access
- **Email**: admin@hits.com
- **Password**: admin123
- **Permissions**: Full access to all features

#### Employee Access
- **Email**: employee@hits.com
- **Password**: emp123
- **Permissions**: Employee Portal and Attendance only

## Usage

### Quick Login
1. Click "Admin Access" or "Employee Access" buttons
2. Credentials will be auto-filled
3. Click "Sign In"

### Manual Login
1. Enter your email and password
2. Click "Sign In"
3. Access your authorized features

### Navigation
- Use the sidebar to navigate between sections
- Search functionality available with ⌘K shortcut
- Profile and settings accessible from sidebar footer

## Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Custom context-based system
- **Routing**: React Router DOM
- **QR Codes**: QRCode library

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Main dashboard
│   ├── Sidebar/        # Navigation sidebar
│   ├── TopRightHeader/ # Search and notifications
│   └── ...            # Feature-specific components
├── contexts/
│   └── AuthContext.jsx # Authentication context
└── App.jsx            # Main application component
```

## Features by Role

### Admin Users
- ✅ Dashboard
- ✅ Employee Portal
- ✅ Attendance Management
- ✅ Visitor Management

- ✅ CCTV Monitoring

- ✅ File Manager
- ✅ Settings & Profile

### Employee Users
- ✅ Employee Portal
- ✅ Attendance Management
- ❌ Visitor Management

- ❌ CCTV Monitoring

- ❌ File Manager
- ✅ Settings & Profile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
