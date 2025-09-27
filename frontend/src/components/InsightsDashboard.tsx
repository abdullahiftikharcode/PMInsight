import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface InsightsData {
  standards: Array<{
    id: number;
    title: string;
    type: string;
    version: string;
    _count: {
      sections: number;
      chapters: number;
    };
  }>;
  totalSections: number;
  totalChapters: number;
  totalWords: number;
  averageWordsPerSection: number;
  topicCoverage: Array<{
    topic: string;
    coverage: number;
    standards: number;
  }>;
  generatedAt: string;
}

const InsightsDashboard = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const data = await apiService.getInsights();
        setInsights(data);
      } catch (err) {
        setError('Failed to load insights. Please try again.');
        console.error('Insights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleTopicSearch = (topic: string) => {
    // Navigate to search results with the topic as query
    navigate(`/?search=${encodeURIComponent(topic)}`);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Generating Insights...</p>
          <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4" style={{maxWidth: '400px'}}>
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h1 className="h2 fw-bold gradient-text mb-4">Error</h1>
          <p className="text-white-80 mb-4">{error || 'Insights not available'}</p>
          <Link to="/" className="btn btn-primary hover-lift d-flex align-items-center mx-auto">
            <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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

      {/* Header */}
      <header className="header-glass position-sticky" style={{top: 0, zIndex: 10}}>
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-4">
                <Link to="/" className="text-info text-decoration-none">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div>
                  <h1 className="display-5 fw-bold gradient-text text-glow mb-0">
                    Standards Insights
                  </h1>
                  <p className="text-white-80 fs-5 mt-1 mb-0">
                    Comprehensive analysis of project management standards
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="status-indicator">
                <div className="status-dot green"></div>
                <span className="text-white-90 fw-medium">Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">
          {/* Overview Statistics */}
          <section className="mb-5">
            <div className="row g-4 mb-5">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-content">
                    <div className="display-4 fw-bold text-primary mb-2">{insights.standards.length}</div>
                    <div className="text-white-70">Standards</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-content">
                    <div className="display-4 fw-bold text-info mb-2">{insights.totalSections.toLocaleString()}</div>
                    <div className="text-white-70">Sections</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-content">
                    <div className="display-4 fw-bold text-success mb-2">{insights.totalChapters.toLocaleString()}</div>
                    <div className="text-white-70">Chapters</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-content">
                    <div className="display-4 fw-bold text-warning mb-2">{insights.totalWords.toLocaleString()}</div>
                    <div className="text-white-70">Total Words</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-content">
                    <h3 className="h5 fw-bold text-white mb-4">Standards Overview</h3>
                    <div className="row">
                      {insights.standards.map((standard) => (
                        <div key={standard.id} className="col-12 mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h4 className="h6 fw-bold text-white mb-1">{standard.title}</h4>
                              <div className="d-flex align-items-center gap-3 small text-white-70">
                                <span className="glass px-2 py-1 rounded-pill">
                                  {standard.type}
                                </span>
                                <span className="glass px-2 py-1 rounded-pill">
                                  {standard.version}
                                </span>
                                <span className="glass px-2 py-1 rounded-pill text-primary">
                                  {standard._count.sections} sections
                                </span>
                              </div>
                            </div>
                            <Link 
                              to={`/standard/${standard.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card">
                  <div className="card-content">
                    <h3 className="h5 fw-bold text-white mb-4">Content Statistics</h3>
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <div className="h4 fw-bold text-primary mb-1">{insights.averageWordsPerSection}</div>
                        <div className="text-white-70 small">Avg Words/Section</div>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="h4 fw-bold text-info mb-1">
                          {Math.round(insights.totalWords / insights.totalSections).toLocaleString()}
                        </div>
                        <div className="text-white-70 small">Words/Section</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Topic Coverage */}
          <section>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold gradient-text text-glow mb-4">
                Topic Coverage Analysis
              </h2>
              <p className="text-white-80 fs-5 mx-auto" style={{maxWidth: '600px'}}>
                Discover which topics are most comprehensively covered across standards
              </p>
            </div>

            <div className="row g-4">
              {insights.topicCoverage.map((topic) => (
                <div key={topic.topic} className="col-md-6 col-lg-4">
                  <div className="card hover-lift">
                    <div className="card-content">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h3 className="h6 fw-bold text-white mb-0">{topic.topic}</h3>
                        <span className="glass px-3 py-1 rounded-pill text-primary">
                          {topic.coverage} sections
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="progress" style={{height: '6px'}}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{width: `${Math.min((topic.coverage / Math.max(...insights.topicCoverage.map(t => t.coverage))) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white-70 small">
                          Covered in {topic.standards} standards
                        </span>
                        <button 
                          onClick={() => handleTopicSearch(topic.topic)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="mt-5 text-center small text-white-60">
            <p>Generated insights • Generated on {new Date(insights.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightsDashboard;
