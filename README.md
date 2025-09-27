# Project Management Standards Library

A comprehensive web application for browsing, searching, and comparing project management standards including PMBOK 7, PRINCE2, and ISO 21502. Features a modern interface with advanced search capabilities, pagination, and detailed content analysis.

## 📁 Project Structure

```
PM/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.ts         # Main server file
│   │   └── scripts/         # Data upload scripts
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   └── App.tsx         # Main app component
│   └── package.json
├── data/                    # Standards data files
│   ├── PMBOK Guide.json
│   ├── PRINCE2.json
│   ├── ISO 21500.json
│   └── ISO 21502.json
└── README.md
```

## 🚀 Features

- **Standards Library**: Browse comprehensive project management standards
- **Advanced Search**: Full-text search across all standards with intelligent filtering
- **Paginated Results**: Clean, organized search results with pagination (4 sections per page)
- **Interactive UI**: Modern React frontend with responsive design
- **Deep Linking**: Direct links to specific sections within standards
- **Statistics Dashboard**: Overview of standards coverage and content analysis

## 🏗️ Architecture

### Backend (Node.js + Express + Prisma)
- **Database**: PostgreSQL with optimized queries
- **API**: RESTful endpoints for standards, search, and insights
- **Performance**: Efficient pagination and search algorithms

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript
- **Styling**: Custom CSS with modern glass-morphism design
- **Routing**: React Router for navigation
- **State Management**: React hooks for local state
- **Pagination**: Smart pagination for search results

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v12 or higher)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Database Configuration

1. Create a PostgreSQL database for the application
2. Update the `DATABASE_URL` in `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pm_standards_db?schema=public"
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with standards data
npm run db:seed
```

### 4. Upload Standards Data (Optional)

If you have standards data files in the `data/` directory, you can upload them:

```bash
cd backend

# Upload PMBOK Guide
npm run upload:pmbok

# Upload ISO 21500
npm run upload:iso21500

# Upload ISO 21502
npm run upload:iso21502

# Upload PRINCE2
npm run upload:prince2

# Upload Standard for Project Management
npm run upload:standard-pm
```

### 5. Start the Application

```bash
# Terminal 1: Start the backend server
cd backend
npm run dev

# Terminal 2: Start the frontend development server
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📚 API Endpoints

### Standards
- `GET /api/standards` - List all standards
- `GET /api/standards/:id` - Get standard details with paginated sections
- `POST /api/standards/:id/search` - Search within a specific standard
- `GET /api/sections/:id` - Get individual section details

### Search & Comparison
- `GET /api/search` - Global search across all standards
- `GET /api/compare` - Compare sections across standards (without AI analysis)
- `GET /api/insights` - Get statistics about standards coverage

### Health
- `GET /api/health` - Health check endpoint

## 🎨 UI Components

### Dashboard
- Overview of available standards
- Global search functionality
- Navigation to standards library

### StandardReaderView
- Full-text display of standards with pagination
- Search functionality within standards
- Table of contents with deep linking

### SearchResults
- **Paginated Results**: Shows 4 sections per standard with pagination controls
- **Per-Standard Navigation**: Independent pagination for each standard
- **Section Counter**: Shows "Showing X of Y sections"
- **Smart Filtering**: Efficient search across all standards

### InsightsDashboard
- Statistics about standards coverage
- Topic analysis and content metrics
- Standards overview with section counts

## 🔧 Development Scripts

### Backend
```bash
npm run dev                    # Start development server
npm run build                  # Build for production
npm run start                  # Start production server
npm run db:generate           # Generate Prisma client
npm run db:migrate            # Run database migrations
npm run db:seed               # Seed database with standards data
npm run db:reset              # Reset database
npm run upload:pmbok          # Upload PMBOK Guide data
npm run upload:iso21500       # Upload ISO 21500 data
npm run upload:iso21502       # Upload ISO 21502 data
npm run upload:prince2        # Upload PRINCE2 data
npm run upload:standard-pm    # Upload Standard for Project Management data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📊 Data Files

The `data/` directory contains JSON files with standards content:

- **PMBOK Guide**: Complete PMBOK 7th Edition content
- **PRINCE2**: PRINCE2 methodology sections
- **ISO 21500**: ISO 21500:2021 standard content
- **ISO 21502**: ISO 21502:2020 standard content
- **Standard for Project Management**: PMI's standard content

These files are processed by the upload scripts to populate the database with structured content.

## 🗄️ Database Schema

### Core Tables
- `Standard`: Project management standards (PMBOK 7, PRINCE2, ISO 21502)
- `Chapter`: Organizational chapters within standards
- `Section`: Individual sections with content, word counts, and metadata

### Key Features
- **Optimized Queries**: Fast search and pagination
- **Content Analysis**: Word counts and section statistics
- **Hierarchical Structure**: Standards → Chapters → Sections

## 🔍 Search Features

### Global Search
- **Full-text search** across all standards
- **Filtering options** by standard type and ID
- **Result grouping** by standard
- **Pagination** for large result sets

### Per-Standard Search
- **Semantic search** within individual standards
- **Google-like results** with snippets
- **Similarity scoring** for relevance
- **Chapter context** for better understanding

### Pagination System
- **4 sections per page** for clean organization
- **Independent pagination** for each standard
- **Navigation controls** with Previous/Next and numbered pages
- **Section counters** showing current view

## 🚀 Production Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Set up production database** with proper indexing

3. **Configure environment variables** for production

4. **Deploy backend** to your preferred hosting platform

5. **Set up reverse proxy** for frontend static files

## 📊 Performance Features

- **Efficient Pagination**: Only loads necessary data
- **Optimized Queries**: Fast search across large datasets
- **Smart Caching**: Reduced database load
- **Responsive Design**: Works on all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection issues**: Verify your DATABASE_URL configuration
2. **Frontend build errors**: Ensure all dependencies are installed
3. **Search not working**: Check that the database is properly seeded
4. **Pagination issues**: Verify that sections are properly indexed

### Getting Help

- Check the console logs for detailed error messages
- Verify all prerequisites are installed
- Ensure the database is properly configured

## 🚀 Quick Start for GitHub

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/project-management-standards.git
   cd project-management-standards
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend  
   cd ../frontend && npm install
   ```

3. **Set up database**:
   ```bash
   cd ../backend
   # Update .env with your database URL
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the project documentation

---

Built with ❤️ using React, TypeScript, Node.js, PostgreSQL, and modern web technologies