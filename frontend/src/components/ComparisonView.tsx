import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, type ComparisonResponse } from '../services/api';

const ComparisonView = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <p className="h4 gradient-text fw-semibold mb-4">Loading AI Analysis...</p>
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
          <p className="text-white-80 mb-4">{error || 'Comparison not found'}</p>
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

  const { topic, comparisonData } = comparison;

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
                  <h1 className="display-5 fw-bold gradient-text text-glow mb-0">{topic.name}</h1>
                  {topic.description && (
                    <p className="text-white-80 fs-5 mt-1 mb-0">{topic.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="status-indicator">
                <div className="status-dot green"></div>
                <span className="text-white-90 fw-medium">AI Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">
          {/* Overall Summary */}
          <section className="mb-5">
            <div className="card">
              <div className="card-content">
                <h2 className="h4 fw-bold text-white mb-4">Overall Summary</h2>
                <p className="text-white-80">
                  {comparisonData.overallSummary}
                </p>
              </div>
            </div>
          </section>

        {/* Standards Comparison */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Standards Analysis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comparisonData.standards.map((standard, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {standard.standardTitle}
                  </h3>
                  <div className="text-primary-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {standard.summary}
                </p>

                {standard.relevantSections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Relevant Sections:</h4>
                    <div className="space-y-2">
                      {standard.relevantSections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="text-sm">
                          <span className="text-gray-600">{section.sectionTitle}</span>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-primary-600 font-mono text-xs">
                            {section.anchorId}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Similarities and Differences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Similarities */}
          <section>
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Key Similarities</h3>
              </div>
              <ul className="space-y-2">
                {comparisonData.keySimilarities.map((similarity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{similarity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Key Differences */}
          <section>
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Key Differences</h3>
              </div>
              <ul className="space-y-2">
                {comparisonData.keyDifferences.map((difference, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">{difference}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center small text-white-60">
          <p>AI-generated analysis • Generated on {new Date(comparison.generatedAt).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  );
};

export default ComparisonView;
