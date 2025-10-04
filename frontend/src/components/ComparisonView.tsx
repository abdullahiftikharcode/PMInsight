import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  FaExclamationTriangle as FaWarning,
  FaProjectDiagram
} from 'react-icons/fa';

const ComparisonView = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const location = useLocation();
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  
  // Check if this is a custom topic comparison
  const isCustomTopic = useMemo(() => location.pathname === '/comparison/custom', [location.pathname]);
  const customTopic = useMemo(() => 
    isCustomTopic ? new URLSearchParams(location.search).get('topic') : null, 
    [isCustomTopic, location.search]
  );

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
  };

  useEffect(() => {
    const fetchComparison = async () => {
      console.log('=== ComparisonView useEffect ===');
      console.log('topicId:', topicId);
      console.log('isCustomTopic:', isCustomTopic);
      console.log('customTopic:', customTopic);
      
      // Handle custom topic case
      if (isCustomTopic) {
        if (!customTopic) {
          console.log('❌ Custom topic but no topic parameter in URL');
          setError('No topic specified for custom comparison.');
          return;
        }
        
        try {
          setLoading(true);
          console.log('🔍 Using custom topic comparison with:', customTopic);
          const data = await apiService.getComparisonByTopic(customTopic);
          console.log('✅ Custom topic comparison successful:', data);
          setComparison(data);
        } catch (err) {
          console.error('❌ Error fetching custom comparison:', err);
          setError('Failed to load comparison. Please make sure insights have been generated.');
        } finally {
          setLoading(false);
        }
        return;
      }
      
      // Handle predefined topic case
      if (!topicId || isNaN(parseInt(topicId))) {
        console.log('❌ No valid topicId for predefined topic');
        setError('Invalid topic ID.');
        return;
      }
      
      try {
        setLoading(true);
        console.log('🔍 Using predefined topic comparison with ID:', topicId);
        const data = await apiService.getComparison(parseInt(topicId));
        console.log('✅ Predefined topic comparison successful:', data);
        setComparison(data);
      } catch (err) {
        console.error('❌ Error fetching predefined comparison:', err);
        setError('Failed to load comparison. Please make sure insights have been generated.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [topicId, isCustomTopic, customTopic]);

  if (loading) {
    return (
      <div className="min-vh-100 bg-animated" aria-busy={true} aria-live="polite">
        {/* Local skeleton styles */}
        <style>
          {`
            @keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            .skeleton {
              position: relative;
              overflow: hidden;
              background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
              background-size: 400% 100%;
              animation: skeleton-shimmer 1.6s ease-in-out infinite;
              border-radius: 8px;
            }
            .skeleton-pill { border-radius: 999px; }
            .skeleton-card { border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(6px); }
          `}
        </style>

        {/* Header skeleton */}
        <header className="header-glass position-sticky" style={{ top: 0, zIndex: 10 }}>
          <div className="container">
            <div className="row align-items-center py-4">
              <div className="col-md-8">
                <div className="d-flex align-items-center gap-4">
                  <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 6 }}></div>
                  <div className="w-100">
                    <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 16, width: '40%' }}></div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <div className="d-inline-flex align-items-center gap-2">
                  <div className="skeleton skeleton-pill" style={{ width: 10, height: 10 }}></div>
                  <div className="skeleton skeleton-pill" style={{ width: 160, height: 14 }}></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body skeleton */}
        <div className="container py-5">
          {/* Summary card */}
          <div className="reddit-card skeleton-card mb-5">
            <div className="reddit-card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 4 }}></div>
                <div className="skeleton" style={{ height: 22, width: 180 }}></div>
              </div>
              <div className="skeleton" style={{ height: 12, width: '95%', marginBottom: 10 }}></div>
              <div className="skeleton" style={{ height: 12, width: '88%', marginBottom: 10 }}></div>
              <div className="skeleton" style={{ height: 12, width: '92%', marginBottom: 10 }}></div>
              <div className="skeleton" style={{ height: 12, width: '75%' }}></div>
            </div>
          </div>

          {/* Standards Analysis skeleton cards */}
          <div className="row g-4 mb-5">
            {[0,1].map(i => (
              <div key={i} className="col-lg-6">
                <div className="reddit-card skeleton-card h-100">
                  <div className="reddit-card-body">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="skeleton" style={{ height: 20, width: '60%' }}></div>
                      <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 4 }}></div>
                    </div>
                    <div className="skeleton" style={{ height: 12, width: '95%', marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 12, width: '85%', marginBottom: 20 }}></div>

                    {/* Relevant sections list items */}
                    {[0,1,2].map(j => (
                      <div key={j} className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex-grow-1 me-3">
                          <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 6 }}></div>
                          <div className="skeleton" style={{ height: 10, width: '40%' }}></div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="skeleton skeleton-pill" style={{ width: 90, height: 26 }}></div>
                          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 18 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Similarities/Differences skeleton lists */}
          <div className="row g-4">
            {[0,1].map(k => (
              <div key={k} className="col-lg-6">
                <div className="reddit-card skeleton-card">
                  <div className="reddit-card-body">
                    <div className="d-flex align-items-center mb-4">
                      <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 6, marginRight: 12 }}></div>
                      <div className="skeleton" style={{ height: 18, width: 160 }}></div>
                    </div>
                    {[0,1,2,3].map(n => (
                      <div key={n} className="d-flex align-items-start mb-3">
                        <div className="skeleton" style={{ width: 8, height: 8, borderRadius: 4, marginRight: 12, marginTop: 6 }}></div>
                        <div className="skeleton" style={{ height: 12, width: '85%' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle inline progress indicator */}
          <div className="text-center mt-5">
            <div className="skeleton skeleton-pill mx-auto" style={{ width: 220, height: 10 }}></div>
            <div className="text-muted small mt-3">Preparing comparison insights…</div>
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
  // Sanitize arrays to avoid blank/whitespace-only entries
  const sanitizedSimilarities = (comparisonData.keySimilarities || [])
    .map(s => (s ?? '').trim())
    .filter(s => s.length > 0);
  const sanitizedDifferences = (comparisonData.keyDifferences || [])
    .map(s => (s ?? '').trim())
    .filter(s => s.length > 0);
  const sanitizedUniqueInsights = (comparisonData.uniqueInsights || [])
    .map((s: string) => (s ?? '').trim())
    .filter((s: string) => s.length > 0);

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
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            <span className="label">Insights</span>
          </Link>
          <Link to="/comparison" className="reddit-sidebar-link active">
            <FaBook className="me-2" />
            <span className="label">Comparison</span>
          </Link>
          <Link to="/map" className="reddit-sidebar-link">
            <FaProjectDiagram className="me-2" />
            <span className="label">Topic Map</span>
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
                      
                      <p className="reddit-text-secondary mb-3">
                        {standard.summary}
                      </p>
                      
                      {standard.aiSummary && (
                        <div className="mb-4 p-3 rounded-3" style={{
                          background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.08), rgba(255, 69, 0, 0.03))',
                          border: '1px solid rgba(255, 69, 0, 0.15)',
                          borderLeft: '4px solid #FF4500'
                        }}>
                          <div className="d-flex align-items-start">
                            <div className="me-2 mt-1">
                              <FaRocket className="text-warning" style={{fontSize: '0.9rem'}} />
                            </div>
                            <div>
                              <h6 className="fw-bold text-warning mb-2" style={{fontSize: '0.9rem'}}>AI Analysis</h6>
                              <p className="reddit-text-secondary small mb-0" style={{fontSize: '0.85rem', lineHeight: '1.4'}}>
                                {standard.aiSummary}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

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
                                    Score: {Math.round(section.relevanceScore * 100)}%
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
          <div className="row g-4 no-equal-height">
            {/* Key Similarities */}
            <div className="col-lg-6">
              <div className="reddit-card content-auto">
                <div className="reddit-card-body no-gap">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <FaCheckCircle className="text-success" style={{fontSize: '1.5rem'}} />
                    </div>
                    <h3 className="h5 fw-bold reddit-text-primary mb-0">Key Similarities</h3>
                  </div>
                  <ul className="list-unstyled mb-0">
                    {sanitizedSimilarities.map((similarity, index) => (
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
              <div className="reddit-card content-auto">
                <div className="reddit-card-body no-gap">
                  <div className="d-flex align-items-center mb-4">
                    <div className="me-3">
                      <FaWarning className="text-warning" style={{fontSize: '1.5rem'}} />
                    </div>
                    <h3 className="h5 fw-bold reddit-text-primary mb-0">Key Differences</h3>
                  </div>
                  <ul className="list-unstyled mb-0">
                    {sanitizedDifferences.map((difference, index) => (
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

          {/* Unique Insights */}
          {sanitizedUniqueInsights.length > 0 && (
            <div className="row g-4 mt-4">
              <div className="col-12">
                <div className="reddit-card content-auto">
                  <div className="reddit-card-body no-gap">
                    <div className="d-flex align-items-center mb-4">
                      <div className="me-3">
                        <FaRocket className="text-warning" style={{fontSize: '1.5rem'}} />
                      </div>
                      <h3 className="h5 fw-bold reddit-text-primary mb-0">Unique Insights</h3>
                    </div>
                    <ul className="list-unstyled mb-0">
                      {sanitizedUniqueInsights.map((insight: string, index: number) => (
                        <li key={index} className="d-flex align-items-start mb-3">
                          <div className="me-3 mt-1">
                            <div className="bg-warning rounded-circle" style={{width: '8px', height: '8px'}}></div>
                          </div>
                          <span className="reddit-text-secondary">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;