# Joy Dairy - Manifestation Healing Counseling App

A mobile-first MERN stack application designed for daily journaling, manifestation, and healing counseling. Help users track their gratitude, manifestations, and daily reflections through an intuitive calendar interface.

## Features

- 🔐 **User Authentication** - Secure login and registration
- 📅 **Interactive Calendar** - Visual calendar showing days with entries
- 📝 **Daily Journaling** - Three focused sections:
  - Gratitude
  - Manifestation
  - Daily Reflection
- 📱 **Mobile-First Design** - Optimized for phone usage
- 🎨 **Beautiful UI** - Modern, healing-focused design
- 🔄 **Real-time Updates** - Instant feedback and synchronization

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Calendar** - Calendar component
- **React Toastify** - Notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd joy-dairy
   \`\`\`

2. **Install backend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install frontend dependencies**
   \`\`\`bash
   cd client
   npm install
   cd ..
   \`\`\`

4. **Environment Configuration**
   Create a \`.env\` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/joydairy
   JWT_SECRET=your_jwt_secret_key_here_please_change_in_production
   NODE_ENV=development
   PORT=5000
   \`\`\`

5. **Start MongoDB**
   Make sure MongoDB is running on your system

6. **Start the application**
   
   For development (runs both backend and frontend):
   \`\`\`bash
   npm run dev
   \`\`\`
   
   Or run separately:
   
   Backend only:
   \`\`\`bash
   npm run server
   \`\`\`
   
   Frontend only:
   \`\`\`bash
   npm run client
   \`\`\`

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

1. **Registration/Login**
   - Create a new account or sign in with existing credentials
   - Secure authentication with JWT tokens

2. **Daily Journaling**
   - Navigate to the calendar view after login
   - Click on any date to create or view entries for that day
   - Fill in the three sections:
     - **Gratitude**: What you're thankful for
     - **Manifestation**: What you want to bring into your life
     - **Reflection**: Daily thoughts and feelings

3. **Calendar Features**
   - Days with entries are highlighted in green
   - Current day is highlighted in blue
   - Easy navigation between months
   - Mobile-responsive touch interface

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user (protected)

### Entries
- \`GET /api/entries\` - Get all user entries (protected)
- \`GET /api/entries/:date\` - Get entry for specific date (protected)
- \`POST /api/entries\` - Create/update entry (protected)
- \`DELETE /api/entries/:date\` - Delete entry (protected)

## Database Schema

### User Model
- \`name\`: String (required)
- \`email\`: String (required, unique)
- \`password\`: String (required, hashed)
- \`createdAt\`: Date

### Entry Model
- \`user\`: ObjectId (ref: User)
- \`date\`: Date (required)
- \`gratitude\`: String (required, max 1000 chars)
- \`manifestation\`: String (required, max 1000 chars)
- \`reflection\`: String (required, max 1000 chars)
- \`createdAt\`: Date
- \`updatedAt\`: Date

## Mobile Optimization

The app is designed with mobile-first principles:
- Responsive design that adapts to all screen sizes
- Touch-friendly interface elements
- Optimized calendar component for mobile interaction
- Mobile-specific toast notification positioning
- Flexible layouts that work on both portrait and landscape

## Production Deployment

1. **Build the React app**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set environment variables**
   - Set \`NODE_ENV=production\`
   - Use a strong JWT secret
   - Configure MongoDB connection string
   - Set appropriate port

3. **Start the production server**
   \`\`\`bash
   npm start
   \`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please create an issue in the repository or contact the development team.
