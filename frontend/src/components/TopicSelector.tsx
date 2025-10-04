import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaAngleDoubleRight,
  FaProjectDiagram
} from 'react-icons/fa';
import LoadingSkeleton from './LoadingSkeleton';

const TopicSelector = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ComparisonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
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

  const handleCustomComparison = async () => {
    console.log('=== TopicSelector: handleCustomComparison ===');
    console.log('customTopic:', customTopic);
    
    if (!customTopic.trim()) {
      console.log('❌ No custom topic provided');
      return;
    }
    
    try {
      const encodedTopic = encodeURIComponent(customTopic.trim());
      const url = `/comparison/custom?topic=${encodedTopic}`;
      console.log('🔗 Navigating to:', url);
      // Navigate to comparison page with custom topic
      navigate(url);
    } catch (error) {
      console.error('❌ Error navigating to custom comparison:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomComparison();
    }
  };

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  if (loading) return <LoadingSkeleton />;

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
          <Link to="/map" className="reddit-sidebar-link"><FaProjectDiagram className="me-2" /><span className="label">Topic Map</span></Link>
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
                  <Link 
                    to="/" 
                    className="text-decoration-none"
                    style={{
                      color: '#FF4500',
                      fontSize: '1.25rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF5700'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#FF4500'}
                  >
                    <FaHome />
                  </Link>
                  <div>
                    <h1 className="display-5 fw-bold mb-0" style={{color: '#D7DADC'}}>
                      Standards Comparison
                    </h1>
                    <p className="mt-1 mb-0" style={{fontSize: '1.1rem', color: '#818384'}}>
                      Compare project management standards across different topics
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="status-indicator">
                  <div className="status-dot green"></div>
                  <span style={{color: '#818384', fontWeight: 500}}>Comparison Engine</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-5">
          {/* Custom Topic Input */}
          <div className="row mb-5">
            <div className="col-12">
              <div 
                className="reddit-card" 
                style={{
                  borderRadius: '12px', 
                  boxShadow: searchFocused ? '0 4px 12px rgba(255, 69, 0, 0.15)' : 'none',
                  background: '#1A1A1B',
                  border: searchFocused ? '1px solid #FF4500' : '1px solid #343536',
                  padding: '1.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="input-group" style={{height: '56px'}}>
                  <span 
                    className="input-group-text bg-transparent border-0" 
                    style={{
                      color: searchFocused ? '#FF4500' : '#818384',
                      fontSize: '1.2rem',
                      paddingLeft: '1.25rem',
                      paddingRight: '1rem',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent search-input"
                    placeholder="Enter a topic to compare across standards (e.g., 'Risk Management', 'Stakeholder Engagement')..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onKeyPress={handleKeyPress}
                    style={{
                      fontSize: '1rem',
                      color: '#D7DADC',
                      paddingLeft: '0.75rem',
                      paddingRight: '1rem',
                      height: '56px',
                      outline: 'none'
                    }}
                  />
                  {customTopic && (
                    <button 
                      className="btn border-0 rounded-circle"
                      onClick={() => setCustomTopic('')}
                      style={{
                        color: '#818384',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '1rem',
                        background: '#272729',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#343536';
                        e.currentTarget.style.color = '#D7DADC';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#272729';
                        e.currentTarget.style.color = '#818384';
                      }}
                      title="Clear input"
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
            {topics.length > 0 ? (
              topics.map((topic, index) => (
              <div key={topic.id} className="col-md-6 col-lg-4">
                <Link 
                  to={`/comparison/${topic.id}`} 
                  className="text-decoration-none"
                >
                  <div 
                    className="reddit-card topic-card reddit-fade-in h-100"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      border: '1px solid #343536',
                      background: '#1A1A1B',
                      boxShadow: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#FF4500';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 69, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#343536';
                      e.currentTarget.style.boxShadow = 'none';
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
                            background: '#FF4500',
                            border: '3px solid #272729'
                          }}
                        >
                          <FaBook className="text-white" style={{fontSize: '2rem'}} />
                        </div>
                      </div>

                      {/* Topic Title */}
                      <h3 className="h5 fw-bold mb-3 text-center" style={{color: '#D7DADC'}}>
                        {topic.name}
                      </h3>

                      {/* Topic Description */}
                      <p className="mb-4 flex-grow-1 text-center" style={{color: '#818384', fontSize: '0.95rem', lineHeight: '1.5'}}>
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
                                backgroundColor: '#272729',
                                color: '#FF4500',
                                border: '1px solid #343536',
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.8rem',
                                fontWeight: 500
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                          {topic.keywords.length > 4 && (
                            <span 
                              className="badge rounded-pill"
                              style={{
                                backgroundColor: '#272729',
                                color: '#818384',
                                border: '1px solid #343536',
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.8rem',
                                fontWeight: 500
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
                          className="btn btn-sm d-flex align-items-center"
                          style={{
                            borderRadius: '20px',
                            padding: '0.6rem 1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            background: '#FF4500',
                            border: 'none',
                            color: '#FFFFFF',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FF5700'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FF4500'}
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
                  <div className="reddit-card" style={{borderRadius: '12px', background: '#1A1A1B', border: '1px solid #343536'}}>
                    <div className="reddit-card-body p-5">
                      <FaSearch className="display-4 mb-3" style={{color: '#818384'}} />
                      <h4 className="mb-3" style={{color: '#D7DADC'}}>No topics available</h4>
                      <p className="mb-4" style={{color: '#818384'}}>
                        No comparison topics available.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Stats */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="reddit-card" style={{borderRadius: '12px', background: '#1A1A1B', border: '1px solid #343536'}}>
                <div className="reddit-card-body text-center p-4">
                  <h5 className="mb-4" style={{color: '#D7DADC', fontWeight: 600}}>
                    <FaChartBar className="me-2" style={{color: '#FF4500'}} />
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
                            background: '#FF4500',
                            border: '3px solid #272729'
                          }}
                        >
                          <FaBook className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: '#FF4500' }}>
                          {topics.length}
                        </div>
                        <div className="small text-uppercase fw-medium" style={{color: '#818384'}}>
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
                            background: '#0079D3',
                            border: '3px solid #272729'
                          }}
                        >
                          <FaSearch className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: '#0079D3' }}>
                          {topics.reduce((acc, topic) => acc + topic.keywords.length, 0)}
                        </div>
                        <div className="small text-uppercase fw-medium" style={{color: '#818384'}}>
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
                            background: '#46D160',
                            border: '3px solid #272729'
                          }}
                        >
                          <FaRocket className="text-white" />
                        </div>
                        <div className="fw-bold fs-3" style={{ color: '#46D160' }}>
                          AI-Powered
                        </div>
                        <div className="small text-uppercase fw-medium" style={{color: '#818384'}}>
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