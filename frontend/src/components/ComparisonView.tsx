import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, type ComparisonResponse } from '../services/api';
import { 
  FaBook, 
  FaChartBar, 
  FaRocket,
  FaArrowRight,
  FaHome,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle as FaWarning
} from 'react-icons/fa';

const ComparisonView = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  useEffect(() => {
    const fetchComparison = async () => {
      if (!topicId) return;
      
      try {
        setLoading(true);
        const data = await apiService.getComparison(parseInt(topicId));
        setComparison(data);
      } catch (err) {
        setError('Failed to load comparison. Please make sure insights have been generated.');
        console.error('Error fetching comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Loading Comparison Analysis...</p>
          <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4" style={{maxWidth: '400px'}}>
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h1 className="h2 fw-bold gradient-text mb-4">Error</h1>
          <p className="text-secondary mb-4">{error || 'Comparison not found'}</p>
          <Link to="/comparison" className="btn btn-primary hover-lift d-flex align-items-center mx-auto">
            <FaHome className="me-2" />
            Back to Comparison Topics
          </Link>
        </div>
      </div>
    );
  }

  const { topic, comparisonData } = comparison;

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
            PM Standards
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
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            <span className="label">Insights</span>
          </Link>
          <Link to="/comparison" className="reddit-sidebar-link active">
            <FaBook className="me-2" />
            <span className="label">Comparison</span>
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
                  <Link to="/comparison" className="text-info text-decoration-none">
                    <FaArrowRight />
                  </Link>
                  <div>
                    <h1 className="display-5 fw-bold gradient-text text-glow mb-0">{topic.name}</h1>
                    <p className="text-secondary fs-5 mt-1 mb-0">{topic.description}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="status-indicator">
                  <div className="status-dot green"></div>
                  <span className="text-secondary fw-medium">Comparison Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-5">
          {/* Overall Summary */}
          <section className="mb-5">
            <div className="reddit-card">
              <div className="reddit-card-body">
                <h2 className="h4 fw-bold reddit-text-primary mb-4">
                  <FaChartBar className="me-2" />
                  Overall Summary
                </h2>
                <p className="reddit-text-secondary">
                  {comparisonData.overallSummary}
                </p>
              </div>
            </div>
          </section>

          {/* Standards Comparison */}
          <section className="mb-5">
            <h2 className="h3 fw-bold reddit-text-primary mb-4">
              <FaBook className="me-2" />
              Standards Analysis
            </h2>
            <div className="row g-4">
              {comparisonData.standards.map((standard, index) => (
                <div key={index} className="col-lg-6">
                  <div className="reddit-card h-100">
                    <div className="reddit-card-body">
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <h3 className="h5 fw-bold reddit-text-primary">
                          {standard.standardTitle}
                        </h3>
                        <div className="text-primary">
                          <FaBook />
                        </div>
                      </div>
                      
                      <p className="reddit-text-secondary mb-4">
                        {standard.summary}
                      </p>

                      {standard.relevantSections.length > 0 && (
                        <div>
                          <h4 className="h6 fw-bold reddit-text-primary mb-3">
                            <FaExternalLinkAlt className="me-2" />
                            Relevant Sections:
                          </h4>
                          <div className="space-y-3">
                            {standard.relevantSections.map((section, sectionIndex) => (
                              <div 
                                key={sectionIndex} 
                                className="d-flex align-items-center justify-content-between p-3 rounded-3"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                                  border: '1px solid rgba(255, 107, 53, 0.1)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 107, 53, 0.03))';
                                  e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 107, 53, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))';
                                  e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.1)';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}
                              >
                                <div className="flex-grow-1">
                                  <Link 
                                    to={`/section/${section.sectionId}`}
                                    className="text-decoration-none"
                                  >
                                    <div 
                                      className="fw-bold reddit-text-primary mb-1"
                                      style={{fontSize: '0.95rem'}}
                                    >
                                      {section.sectionTitle}
                                    </div>
                                  </Link>
                                  <div 
                                    className="text-muted small"
                                    style={{fontSize: '0.8rem', opacity: 0.8}}
                                  >
                                    Section {section.sectionNumber}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <span 
                                    className="badge rounded-pill px-3 py-2"
                                    style={{
                                      background: 'linear-gradient(135deg, var(--reddit-orange), #ff6b35)',
                                      color: 'white',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                                    }}
                                  >
                                    Score: {section.relevanceScore}
                                  </span>
                                  <Link 
                                    to={`/section/${section.sectionId}`}
                                    className="btn btn-outline-primary btn-sm rounded-circle"
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      border: '1px solid rgba(255, 107, 53, 0.3)',
                                      color: 'var(--reddit-orange)',
                                      background: 'rgba(255, 107, 53, 0.1)',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'var(--reddit-orange)';
                                      e.currentTarget.style.color = 'white';
                                      e.currentTarget.style.borderColor = 'var(--reddit-orange)';
                                      e.currentTarget.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'rgba(255, 107, 53, 0.1)';
                                      e.currentTarget.style.color = 'var(--reddit-orange)';
                                      e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                                      e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                  >
                                    <FaExternalLinkAlt style={{fontSize: '0.8rem'}} />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Similarities and Differences */}
          <div className="row g-4">
            {/* Key Similarities */}
            <div className="col-lg-6">
              <div className="reddit-card h-100">
                <div className="reddit-card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <FaCheckCircle className="text-success" style={{fontSize: '1.5rem'}} />
                    </div>
                    <h3 className="h5 fw-bold reddit-text-primary mb-0">Key Similarities</h3>
                  </div>
                  <ul className="list-unstyled">
                    {comparisonData.keySimilarities.map((similarity, index) => (
                      <li key={index} className="d-flex align-items-start mb-3">
                        <div className="me-3 mt-1">
                          <div className="bg-success rounded-circle" style={{width: '8px', height: '8px'}}></div>
                        </div>
                        <span className="reddit-text-secondary">{similarity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Differences */}
            <div className="col-lg-6">
              <div className="reddit-card h-100">
                <div className="reddit-card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <FaWarning className="text-warning" style={{fontSize: '1.5rem'}} />
                    </div>
                    <h3 className="h5 fw-bold reddit-text-primary mb-0">Key Differences</h3>
                  </div>
                  <ul className="list-unstyled">
                    {comparisonData.keyDifferences.map((difference, index) => (
                      <li key={index} className="d-flex align-items-start mb-3">
                        <div className="me-3 mt-1">
                          <div className="bg-warning rounded-circle" style={{width: '8px', height: '8px'}}></div>
                        </div>
                        <span className="reddit-text-secondary">{difference}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 text-center">
            <div className="reddit-card">
              <div className="reddit-card-body">
                <p className="text-muted small mb-0">
                  <FaChartBar className="me-2" />
                  AI-generated analysis • Generated on {new Date(comparison.generatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;