import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, type ComparisonTopic } from '../services/api';
import { 
  FaSearch, 
  FaBook, 
  FaChartBar, 
  FaRocket,
  FaArrowRight,
  FaHome,
  FaCog,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';

const TopicSelector = () => {
  const [topics, setTopics] = useState<ComparisonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const topicsData = await apiService.getComparisonTopics();
        if (topicsData && Array.isArray(topicsData)) {
          setTopics(topicsData);
        } else {
          setError('No comparison topics available');
        }
      } catch (err) {
        setError('Failed to load comparison topics. Please make sure the backend server is running.');
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Loading Comparison Topics...</p>
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
          <h1 className="h2 fw-bold gradient-text mb-4">Error</h1>
          <p className="text-secondary mb-4">{error}</p>
          <Link to="/" className="btn btn-primary hover-lift d-flex align-items-center mx-auto">
            <FaHome className="me-2" />
            Back to Dashboard
          </Link>
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

      {/* Sidebar */}
      <div className={`reddit-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <div className="reddit-nav-brand">
            <FaRocket className="me-2" />
            <span className="label">PM Standards</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>
        
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Navigation</div>
          <Link to="/" className="reddit-sidebar-link">
            <FaHome className="me-2" />
            <span className="label">Dashboard</span>
          </Link>
          <Link to="/standards" className="reddit-sidebar-link">
            <FaBook className="me-2" />
            <span className="label">Standards</span>
          </Link>
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            <span className="label">Insights</span>
          </Link>
          <Link to="/comparison" className="reddit-sidebar-link active">
            <FaBook className="me-2" />
            <span className="label">Comparison</span>
          </Link>
          <Link to="/process-generator" className="reddit-sidebar-link">
            <FaCog className="me-2" />
            <span className="label">Process Generator</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`reddit-main ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-content">
        {/* Header */}
        <header className="header-glass position-sticky" style={{top: 0, zIndex: 10}}>
          <div className="container">
            <div className="row align-items-center py-4">
              <div className="col-md-8">
                <div className="d-flex align-items-center gap-4">
                  <Link to="/" className="text-info text-decoration-none">
                    <FaHome />
                  </Link>
                  <div>
                    <h1 className="display-5 fw-bold gradient-text text-glow mb-0">Standards Comparison</h1>
                    <p className="text-secondary fs-5 mt-1 mb-0">Compare project management standards across different topics</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="status-indicator">
                  <div className="status-dot green"></div>
                  <span className="text-secondary fw-medium">Comparison Engine</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-5">
          {/* Search Bar */}
          <div className="row mb-5">
            <div className="col-12">
              <div 
                className="reddit-card" 
                style={{
                  borderRadius: '15px', 
                  boxShadow: searchFocused ? '0 10px 30px rgba(255, 107, 53, 0.25)' : '0 4px 20px rgba(0,0,0,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  border: searchFocused ? '1px solid rgba(255, 107, 53, 0.4)' : '1px solid rgba(255, 107, 53, 0.15)',
                  padding: '1.5rem'
                }}
              >
                <div className="input-group" style={{height: '56px'}}>
                  <span 
                    className="input-group-text bg-transparent border-0" 
                    style={{
                      color: 'var(--reddit-orange)',
                      fontSize: '1.2rem',
                      paddingLeft: '1.25rem',
                      paddingRight: '1rem',
                      borderRight: 'none'
                    }}
                  >
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent search-input"
                    placeholder="Search comparison topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={{
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      paddingLeft: '0.75rem',
                      paddingRight: '1rem',
                      height: '56px',
                      borderLeft: 'none',
                      borderRight: 'none'
                    }}
                  />
                  {searchQuery && (
                    <button 
                      className="btn btn-outline-secondary border-0 rounded-circle"
                      onClick={() => setSearchQuery('')}
                      style={{
                        color: 'var(--text-secondary)',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                        background: searchFocused ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 107, 53, 0.1)',
                        border: searchFocused ? '1px solid rgba(255, 107, 53, 0.35)' : '1px solid rgba(255, 107, 53, 0.2)'
                      }}
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="row g-4">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, index) => (
              <div key={topic.id} className="col-md-6 col-lg-4">
                <Link 
                  to={`/comparison/${topic.id}`} 
                  className="text-decoration-none"
                >
                  <div 
                    className="reddit-card topic-card reddit-fade-in h-100 hover-lift"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 107, 53, 0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.1)';
                    }}
                  >
                    <div className="reddit-card-body d-flex flex-column h-100 p-4">
                      {/* Topic Icon with Background */}
                      <div className="text-center mb-4">
                        <div 
                          className="topic-icon-wrapper rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, var(--reddit-orange), #ff6b35)',
                            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                          }}
                        >
                          <FaBook className="text-white" style={{fontSize: '2rem'}} />
                        </div>
                      </div>

                      {/* Topic Title */}
                      <h3 className="h5 fw-bold reddit-text-primary mb-3 text-center">
                        {topic.name}
                      </h3>

                      {/* Topic Description */}
                      <p className="reddit-text-secondary mb-4 flex-grow-1 text-center">
                        {topic.description}
                      </p>

                      {/* Keywords */}
                      <div className="mb-4">
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                          {topic.keywords.slice(0, 4).map((keyword, idx) => (
                            <span 
                              key={idx} 
                              className="badge rounded-pill"
                              style={{
                                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                color: 'var(--reddit-orange)',
                                border: '1px solid rgba(255, 107, 53, 0.2)',
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.8rem'
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                          {topic.keywords.length > 4 && (
                            <span 
                              className="badge rounded-pill"
                              style={{
                                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                color: '#6c757d',
                                border: '1px solid rgba(108, 117, 125, 0.2)',
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.8rem'
                              }}
                            >
                              +{topic.keywords.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="d-flex align-items-center justify-content-center">
                        <div 
                          className="btn btn-primary btn-sm d-flex align-items-center"
                          style={{
                            borderRadius: '25px',
                            padding: '0.6rem 1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            background: 'linear-gradient(135deg, var(--reddit-orange), #ff6b35)',
                            border: 'none',
                            boxShadow: '0 2px 10px rgba(255, 107, 53, 0.3)'
                          }}
                        >
                          <FaBook className="me-2" />
                          Compare Standards
                          <FaArrowRight className="ms-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <div className="reddit-card" style={{borderRadius: '15px', background: 'rgba(255,255,255,0.02)'}}>
                    <div className="reddit-card-body p-5">
                      <FaSearch className="display-4 reddit-text-muted mb-3" />
                      <h4 className="reddit-text-primary mb-3">No topics found</h4>
                      <p className="reddit-text-secondary mb-4">
                        {searchQuery ? 'Try different keywords or check your spelling.' : 'No comparison topics available.'}
                      </p>
                      {searchQuery && (
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Stats */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="reddit-card" style={{borderRadius: '15px', background: 'linear-gradient(135deg, rgba(255,107,53,0.05), rgba(0,123,255,0.05))'}}>
                <div className="reddit-card-body text-center p-4">
                  <h5 className="reddit-text-primary mb-4">
                    <FaChartBar className="me-2" />
                    Comparison Engine Stats
                  </h5>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, var(--reddit-orange), #ff6b35)',
                            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                          }}
                        >
                          <FaBook className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: 'var(--reddit-orange)' }}>
                          {topics.length}
                        </div>
                        <div className="reddit-text-secondary small text-uppercase fw-medium">
                          Comparison Topics
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, var(--reddit-blue), #007bff)',
                            boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
                          }}
                        >
                          <FaSearch className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: 'var(--reddit-blue)' }}>
                          {topics.reduce((acc, topic) => acc + topic.keywords.length, 0)}
                        </div>
                        <div className="reddit-text-secondary small text-uppercase fw-medium">
                          Keywords Analyzed
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex flex-column align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                          }}
                        >
                          <FaRocket className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: '#28a745' }}>
                          AI-Powered
                        </div>
                        <div className="reddit-text-secondary small text-uppercase fw-medium">
                          Analysis
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;
