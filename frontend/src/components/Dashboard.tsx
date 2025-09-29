import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService, type Standard } from '../services/api';
import SearchResults from './SearchResults';
import { 
  FaSearch, 
  FaBook, 
  FaChartBar, 
  FaRocket,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaHome,
  FaCog,
  FaUsers,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaProjectDiagram
} from 'react-icons/fa';

const Dashboard = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchParams] = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const standardsData = await apiService.getStandards();
        if (standardsData && Array.isArray(standardsData)) {
          setStandards(standardsData);
        } else {
          setError('No standards data available');
        }
      } catch (err) {
        setError('Failed to load data. Please make sure the backend server is running.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for search parameter in URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      setShowSearchResults(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleBackToStandards = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="reddit-layout">
        <div className="reddit-sidebar">
          <div className="reddit-sidebar-section">
            <div className="reddit-nav-brand">
              <FaRocket />
              PMInsight
            </div>
          </div>
        </div>
        <div className="reddit-main">
          <div className="reddit-content">
            <div className="reddit-loading">
              <div className="reddit-spinner"></div>
              <p>Loading standards...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reddit-layout">
        <div className="reddit-sidebar">
          <div className="reddit-sidebar-section">
            <div className="reddit-nav-brand">
              <FaRocket />
              PMInsight
            </div>
          </div>
        </div>
        <div className="reddit-main">
          <div className="reddit-content">
            <div className="reddit-error">
              <FaExclamationTriangle className="reddit-error-icon" />
              <h2 className="h3 fw-bold reddit-text-primary mb-3">Connection Error</h2>
              <p className="reddit-text-secondary mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-reddit"
              >
                <FaRocket className="me-2" />
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSearchResults) {
    return <SearchResults query={searchQuery} onBack={handleBackToStandards} />;
  }

  return (
    <div className="reddit-layout">
      {/* Reddit-Style Sidebar */}
      <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <Link to="/" className="reddit-nav-brand">
            <FaRocket />
            <span className="label">PMInsight</span>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => {
              const next = !isCollapsed;
              setIsCollapsed(next);
              localStorage.setItem('sidebarCollapsed', String(next));
            }}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>
        
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Navigation</div>
          <Link to="/" className="reddit-sidebar-link">
            <FaHome className="me-2" />
            <span className="label">Home</span>
          </Link>
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            <span className="label">Analytics</span>
          </Link>
          <Link to="/comparison" className="reddit-sidebar-link">
            <FaBook className="me-2" />
            <span className="label">Comparison</span>
          </Link>
          <Link to="/map" className="reddit-sidebar-link">
            <FaProjectDiagram className="me-2" />
            <span className="label">Topic Map</span>
          </Link>
          <Link to="/tutorial" className="reddit-sidebar-link">
            <FaRocket className="me-2" />
            <span className="label">Tutorial</span>
          </Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Quick Actions</div>
          <div className="reddit-sidebar-link">
            <FaSearch className="me-2" />
            <span className="label">Search Standards</span>
          </div>
          <div className="reddit-sidebar-link">
            <FaBook className="me-2" />
            <span className="label">Browse Library</span>
          </div>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Standards ({standards.length})</div>
          {standards.map((standard) => (
            <Link 
              key={standard.id} 
              to={`/standard/${standard.id}`} 
              className="reddit-sidebar-link"
            >
              <FaBook className="me-2" />
              <span className="label">{standard.title}</span>
            </Link>
          ))}
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Tools</div>
          <div className="reddit-sidebar-link">
            <FaCog className="me-2" />
            <span className="label">Settings</span>
          </div>
          <div className="reddit-sidebar-link">
            <FaUsers className="me-2" />
            <span className="label">Community</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-nav">
          <div className="container d-flex justify-content-between align-items-center">
            <div className="reddit-nav-links">
              <Link to="/" className="reddit-nav-link">
                <FaHome className="me-1" />
                Home
              </Link>
              <Link to="/insights" className="reddit-nav-link">
                <FaChartBar className="me-1" />
                Insights
              </Link>
              <Link to="/process-generator" className="reddit-nav-link">
                <FaCog className="me-1" />
                Process Generator
              </Link>
              <Link to="/comparison" className="reddit-nav-link">
                <FaBook className="me-1" />
                Comparison
              </Link>
              <Link to="/map" className="reddit-nav-link">
                <FaProjectDiagram className="me-1" />
                Topic Map
              </Link>
              <Link to="/tutorial" className="reddit-nav-link">
                <FaRocket className="me-1" />
                Tutorial
              </Link>
            </div>
          </div>
        </div>

        <div className="reddit-content">
          {/* Header */}
          <div className="reddit-card reddit-fade-in">
            <div className="reddit-card-body">
              <h1 className="display-5 fw-bold reddit-text-primary mb-3">
                Project Management Standards Library
              </h1>
              <p className="reddit-text-secondary fs-5 mb-4">
                Comprehensive project management standards comparison and analysis
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="reddit-search">
                <div className="position-relative">
                  <FaSearch className="reddit-search-icon" />
                  <input
                    type="text"
                    className="reddit-search-input"
                    placeholder="Search across all standards (e.g., 'risk management', 'stakeholder engagement')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="reddit-card reddit-fade-in">
                <div className="reddit-card-body text-center">
                  <FaBook className="display-4 reddit-text-primary mb-3" style={{color: 'var(--reddit-orange)'}} />
                  <h3 className="h4 fw-bold reddit-text-primary mb-2">
                    {standards.length}
                  </h3>
                  <p className="reddit-text-secondary mb-0">Standards</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="reddit-card reddit-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="reddit-card-body text-center">
                  <FaChartBar className="display-4 reddit-text-primary mb-3" style={{color: 'var(--reddit-blue)'}} />
                  <h3 className="h4 fw-bold reddit-text-primary mb-2">
                    {standards.reduce((acc, std) => acc + std._count.sections, 0)}
                  </h3>
                  <p className="reddit-text-secondary mb-0">Sections</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="reddit-card reddit-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="reddit-card-body text-center">
                  <FaSearch className="display-4 reddit-text-primary mb-3" style={{color: 'var(--reddit-orange)'}} />
                  <h3 className="h4 fw-bold reddit-text-primary mb-2">
                    AI-Powered
                  </h3>
                  <p className="reddit-text-secondary mb-0">Search</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="reddit-card reddit-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="reddit-card-body text-center">
                  <FaRocket className="display-4 reddit-text-primary mb-3" style={{color: 'var(--reddit-blue)'}} />
                  <h3 className="h4 fw-bold reddit-text-primary mb-2">
                    Free
                  </h3>
                  <p className="reddit-text-secondary mb-0">Access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Standards Grid */}
          <div className="row g-4">
            {standards.map((standard, index) => (
              <div key={standard.id} className="col-md-6 col-lg-4">
                <div className="reddit-card standard-grid-card reddit-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="reddit-card-body">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className="h5 fw-bold reddit-text-primary mb-0" style={{lineHeight: '1.3'}}>
                          {standard.title}
                        </h3>
                        <FaArrowRight className="reddit-text-muted" />
                      </div>
                      
                      <div className="d-flex align-items-center reddit-text-secondary mb-3">
                        <FaBook className="me-2" />
                        <span className="fw-medium">{standard._count.sections} sections</span>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="reddit-status available">
                          <div className="reddit-status-dot"></div>
                          <span>Available</span>
                        </div>
                        <Link 
                          to={`/standard/${standard.id}`} 
                          className="btn-reddit btn-sm"
                        >
                          <FaBook className="me-1" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="reddit-card reddit-fade-in">
            <div className="reddit-card-body text-center">
              <h3 className="h5 fw-bold reddit-text-primary mb-3">
                Project Management Standards Library
              </h3>
              <p className="reddit-text-secondary mb-0">
                Compare and analyze different project management methodologies in one comprehensive platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;