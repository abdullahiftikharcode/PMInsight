# PMInsight - Project Management Standards Library

A comprehensive web application for browsing, searching, and comparing project management standards including PMBOK 7, PRINCE2, ISO 21500, ISO 21502, and The Standard for Project Management. Features a modern Reddit-inspired interface with advanced search capabilities, bookmarking, pagination, and detailed content analysis.

## 📁 Project Structure

```
PM/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── index.ts         # Main server file with comprehensive API endpoints
│   │   └── scripts/         # Data upload scripts for all standards
│   │       ├── upload-pmbok.ts
│   │       ├── upload-iso21500.ts
│   │       ├── upload-iso21502.ts
│   │       ├── uploadPRINCE2Sections.ts
│   │       └── upload-standard-pm.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Main database schema (with vector support)
│   │   ├── schema_no_ai.prisma # Simplified schema without AI features
│   │   └── seed.ts         # Database seeding
│   └── package.json
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StandardReaderView.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── InsightsDashboard.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── SectionDetail.tsx
│   │   │   ├── BookmarksPage.tsx
│   │   │   ├── ComparisonView.tsx
│   │   │   ├── TutorialPage.tsx
│   │   │   └── ui/         # UI components
│   │   ├── services/        # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.tsx         # Main app component with routing
│   └── package.json
├── data/                    # Standards data files (JSON format)
│   ├── GUIDE TO THE PROJECT MANAGEMENT BODY OF KNOWLEDGE (PMBOK® GUIDE).json
│   ├── PRINCE2.json
│   ├── ISO 21500-2021_ Project, programme and portfolio management - Context and concepts.json
│   ├── ISO 21502-2020_ Project, programme and portfolio management - Guidance on project management.json
│   └── THE STANDARD FOR PROJECT MANAGEMENT.json
└── README.md
```

## 🚀 Features

### Core Functionality
- **Standards Library**: Browse comprehensive project management standards (PMBOK 7, PRINCE2, ISO 21500, ISO 21502, Standard for Project Management)
- **Advanced Search**: Full-text search across all standards with intelligent filtering and similarity scoring
- **Bookmarking System**: Save and manage favorite sections with persistent storage
- **Paginated Results**: Clean, organized search results with pagination (4 sections per page)
- **Interactive UI**: Modern Reddit-inspired React frontend with responsive design
- **Deep Linking**: Direct links to specific sections within standards
- **Statistics Dashboard**: Overview of standards coverage and content analysis
- **Tutorial System**: Guided walkthrough for new users

### User Experience
- **Reddit-style Interface**: Familiar navigation and layout patterns
- **Smart Search**: Google-like search results with snippets and highlighting
- **Section Navigation**: Previous/Next navigation between sections
- **Table of Contents**: Hierarchical navigation within standards
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth user experience with proper loading indicators

## 🏗️ Architecture

### Backend (Node.js + Express + Prisma)
- **Database**: PostgreSQL with optimized queries and vector support
- **API**: Comprehensive RESTful endpoints for standards, search, insights, and navigation
- **Performance**: Efficient pagination, search algorithms, and similarity scoring
- **Data Processing**: Automated upload scripts for all project management standards
- **Schema Management**: Dual schema support (with/without AI features)

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript and modern hooks
- **Styling**: Custom CSS with Reddit-inspired design system
- **Routing**: React Router v7 for comprehensive navigation
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Custom components with Radix UI integration
- **Search**: Advanced search with real-time filtering and highlighting
- **Bookmarking**: Persistent bookmark system with local storage

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

### Standards Management
- `GET /api/standards` - List all standards with metadata
- `GET /api/standards/:id` - Get standard details with paginated sections
- `POST /api/standards/:id/search` - Search within a specific standard with Google-like results

### Section Navigation
- `GET /api/sections/:id` - Get individual section details
- `GET /api/sections/:id/adjacent` - Get previous/next sections for navigation

### Search & Discovery
- `GET /api/search` - Global search across all standards with filtering
- `GET /api/compare` - Compare sections across standards by topic
- `GET /api/insights` - Get comprehensive statistics about standards coverage

### System
- `GET /api/health` - Health check endpoint

## 🎨 UI Components

### Core Pages
- **LandingPage**: Welcome screen with feature overview and navigation
- **Dashboard**: Standards library with search and filtering capabilities
- **TutorialPage**: Guided walkthrough for new users

### Reading Experience
- **StandardReaderView**: Full-text display with pagination, search, and bookmarking
- **SectionDetail**: Individual section view with navigation and bookmarking
- **SearchResults**: Advanced search results with pagination and filtering

### Analysis & Insights
- **InsightsDashboard**: Comprehensive statistics and topic analysis
- **ComparisonView**: Side-by-side comparison of standards sections
- **BookmarksPage**: Manage saved sections and favorites

### Navigation Features
- **Reddit-style Sidebar**: Consistent navigation across all pages
- **Breadcrumb Navigation**: Clear path indication
- **Previous/Next Controls**: Seamless section navigation
- **Table of Contents**: Hierarchical content organization

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

- **GUIDE TO THE PROJECT MANAGEMENT BODY OF KNOWLEDGE (PMBOK® GUIDE).json**: Complete PMBOK 7th Edition content
- **PRINCE2.json**: PRINCE2 methodology sections and processes
- **ISO 21500-2021_ Project, programme and portfolio management - Context and concepts.json**: ISO 21500:2021 standard content
- **ISO 21502-2020_ Project, programme and portfolio management - Guidance on project management.json**: ISO 21502:2020 standard content
- **THE STANDARD FOR PROJECT MANAGEMENT.json**: PMI's Standard for Project Management content

These files are processed by dedicated upload scripts to populate the database with structured content, including word counts, section metadata, and hierarchical organization.

## 🗄️ Database Schema

### Core Tables
- `Standard`: Project management standards with metadata (PMBOK 7, PRINCE2, ISO 21500, ISO 21502, Standard for Project Management)
- `Chapter`: Organizational chapters within standards
- `Section`: Individual sections with content, word counts, sentence counts, and metadata
- `Topic`: Topic definitions for comparison analysis
- `GeneratedInsight`: AI-generated insights and comparisons

### Key Features
- **Dual Schema Support**: Main schema with vector embeddings and simplified schema without AI features
- **Optimized Queries**: Fast search, pagination, and similarity scoring
- **Content Analysis**: Word counts, sentence counts, and section statistics
- **Hierarchical Structure**: Standards → Chapters → Sections
- **Vector Support**: Optional vector embeddings for advanced search capabilities
- **Unique Constraints**: Ensures data integrity with proper indexing

## 🔍 Search Features

### Global Search
- **Full-text search** across all standards with intelligent filtering
- **Advanced filtering** by standard type, ID, and content relevance
- **Result grouping** by standard with metadata
- **Smart pagination** for large result sets with performance optimization
- **Similarity scoring** for relevance ranking

### Per-Standard Search
- **Google-like search results** with highlighted snippets
- **Similarity scoring** based on title and content matching
- **Chapter context** for better understanding and navigation
- **Real-time search** with instant results and filtering

### Pagination System
- **4 sections per page** for clean organization and performance
- **Independent pagination** for each standard in search results
- **Navigation controls** with Previous/Next and numbered pages
- **Section counters** showing "X of Y sections" for clear context
- **Adjacent section navigation** for seamless reading experience

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

- **Efficient Pagination**: Only loads necessary data with smart query optimization
- **Optimized Queries**: Fast search across large datasets with proper indexing
- **Smart Caching**: Reduced database load with intelligent result caching
- **Responsive Design**: Works seamlessly on all device sizes and screen resolutions
- **Vector Search**: Optional vector embeddings for advanced semantic search
- **Similarity Scoring**: Intelligent relevance ranking for search results
- **Lazy Loading**: Components and data loaded on demand for better performance

## 🛠️ Technology Stack

### Backend Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **Prisma**: Database ORM with PostgreSQL
- **PostgreSQL**: Primary database with vector extensions
- **CORS**: Cross-origin resource sharing

### Frontend Technologies
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **React Router v7**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Icons**: Comprehensive icon library
- **Radix UI**: Accessible component primitives
- **Bootstrap 5**: CSS framework for responsive design

### Development Tools
- **ESLint**: Code linting and formatting
- **Nodemon**: Development server with auto-restart
- **ts-node**: TypeScript execution for Node.js
- **Prisma Migrate**: Database schema management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database connection issues**: Verify your DATABASE_URL configuration in `backend/.env`
2. **Frontend build errors**: Ensure all dependencies are installed with `npm install`
3. **Search not working**: Check that the database is properly seeded with standards data
4. **Pagination issues**: Verify that sections are properly indexed in the database
5. **Vector search errors**: Ensure PostgreSQL has the vector extension installed

### Getting Help

- Check the console logs for detailed error messages
- Verify all prerequisites are installed (Node.js v18+, PostgreSQL v12+)
- Ensure the database is properly configured and seeded
- Check that both backend and frontend servers are running

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the project documentation
- Ensure all setup steps have been completed correctly

---

**PMInsight** - Built with ❤️ using React 19, TypeScript, Node.js, Express, PostgreSQL, Prisma, and modern web technologies