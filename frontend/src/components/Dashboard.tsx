import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService, type Standard } from '../services/api';
import SearchResults from './SearchResults';

const Dashboard = () => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const standardsData = await apiService.getStandards();
        setStandards(standardsData);
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

  const handleBackToDashboard = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  if (showSearchResults) {
    return <SearchResults query={searchQuery} onBack={handleBackToDashboard} />;
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Loading Standards...</p>
          <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4" style={{maxWidth: '400px'}}>
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h1 className="h2 fw-bold gradient-text mb-4">Connection Error</h1>
          <p className="text-white-80 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary hover-lift d-flex align-items-center mx-auto"
          >
            <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-animated position-relative">
      {/* Floating Background Orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="header-glass position-relative" style={{zIndex: 10}}>
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold gradient-text text-glow mb-2">
                PM Standards Comparison
              </h1>
              <p className="text-white-80 fs-5">
                Comprehensive project management standards library
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex align-items-center gap-3">
                <Link to="/insights" className="btn btn-outline-info btn-sm">
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Insights
                </Link>
                <div className="status-indicator">
                  <div className="status-dot green"></div>
                  <span className="text-white-90 fw-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="row mt-4">
            <div className="col-12">
              <form onSubmit={handleSearch} className="d-flex gap-3">
                <div className="flex-grow-1 position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg glass-input"
                    placeholder="Search across all standards (e.g., 'risk management', 'stakeholder engagement')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-white-60">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg px-4 hover-lift"
                  disabled={!searchQuery.trim()}
                >
                  <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">

          {/* Standards Library Section */}
          <section>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold gradient-text text-glow mb-4">
                Standards Library
              </h2>
              <p className="text-white-80 fs-5 mx-auto" style={{maxWidth: '600px'}}>
                Browse and search through comprehensive project management standards
              </p>
            </div>

            <div className="row g-4">
              {standards.map((standard, index) => (
                <div key={standard.id} className="col-md-6 col-lg-4">
                  <Link
                    to={`/standard/${standard.id}`}
                    className="card hover-lift text-decoration-none"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="card-content">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <h3 className="h5 fw-bold text-white mb-0">
                          {standard.title}
                        </h3>
                        <div className="text-primary">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="d-flex align-items-center small text-white-70 mb-4">
                        <svg className="me-2 text-primary" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="fw-medium">{standard._count.sections} sections</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="glass px-3 py-2 rounded-pill small fw-medium text-primary border border-primary">
                          Available
                        </span>
                        <div className="bouncing-dots">
                          <div className="dot" style={{width: '6px', height: '6px', background: '#3b82f6'}}></div>
                          <div className="dot" style={{width: '6px', height: '6px', background: '#6366f1'}}></div>
                          <div className="dot" style={{width: '6px', height: '6px', background: '#8b5cf6'}}></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-glass position-relative mt-5" style={{zIndex: 10}}>
        <div className="container py-5">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="h3 fw-bold gradient-text mb-3">
                Project Management Standards Library
              </h3>
              <p className="text-white-80">
                Comprehensive project management standards comparison tool
              </p>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-4 small text-white-60">
              <div className="d-flex align-items-center gap-2">
                <div className="status-dot green"></div>
                <span>React & TypeScript</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="status-dot blue"></div>
                <span>Standards Library</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="status-dot purple"></div>
                <span>Modern UI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
