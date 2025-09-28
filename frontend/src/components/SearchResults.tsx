import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
  FaSearch, 
  FaBook, 
  FaArrowLeft, 
  FaExclamationTriangle, 
  FaHome, 
  FaList, 
  FaEye,
  FaCog,
  FaUsers,
  FaChartBar,
  FaRocket
} from 'react-icons/fa';

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

const SearchResults = ({ query, onBack }: SearchResultsProps) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const searchResults = await apiService.searchAll(query);
        setResults(searchResults);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      performSearch();
    }
  }, [query]);

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
              <p>Searching...</p>
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
              <h2 className="h3 fw-bold reddit-text-primary mb-3">Search Error</h2>
              <p className="reddit-text-secondary mb-4">{error}</p>
              <button onClick={onBack} className="btn-reddit">
                <FaArrowLeft className="me-2" />
                Back to Standards
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reddit-layout">
      {/* Reddit-Style Sidebar */}
      <div className="reddit-sidebar">
        <div className="reddit-sidebar-section">
          <div className="reddit-nav-brand">
            <FaRocket />
            PMInsight
          </div>
        </div>
        
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Navigation</div>
          <Link to="/" className="reddit-sidebar-link">
            <FaHome className="me-2" />
            Home
          </Link>
          <Link to="/standards" className="reddit-sidebar-link">
            <FaBook className="me-2" />
            Standards
          </Link>
          <button onClick={onBack} className="reddit-sidebar-link">
            <FaArrowLeft className="me-2" />
            Back to Standards
          </button>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Search Results</div>
          <div className="reddit-sidebar-link">
            <FaSearch className="me-2" />
            Query: "{query}"
          </div>
          {results && (
            <>
              <div className="reddit-sidebar-link">
                <FaBook className="me-2" />
                {results.totalResults} results
              </div>
              <div className="reddit-sidebar-link">
                <FaList className="me-2" />
                {results.standardsSearched} standards
              </div>
            </>
          )}
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Tools</div>
          <div className="reddit-sidebar-link">
            <FaCog className="me-2" />
            Settings
          </div>
          <div className="reddit-sidebar-link">
            <FaUsers className="me-2" />
            Community
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="reddit-main">
        <div className="reddit-nav">
          <div className="container d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button onClick={onBack} className="btn-reddit-outline btn-sm me-3">
                <FaArrowLeft className="me-1" />
                Back
              </button>
              <div>
                <h1 className="h4 fw-bold reddit-text-primary mb-0">
                  Search Results
                </h1>
                <p className="reddit-text-secondary mb-0">
                  Query: "{query}"
                </p>
              </div>
            </div>
            <div className="reddit-nav-links">
              <Link to="/" className="reddit-nav-link">
                <FaHome className="me-1" />
                Home
              </Link>
              <Link to="/insights" className="reddit-nav-link">
                <FaChartBar className="me-1" />
                Insights
              </Link>
            </div>
          </div>
        </div>

        <div className="reddit-content">
          {/* Search Summary */}
          {results && (
            <div className="reddit-card reddit-fade-in mb-4">
              <div className="reddit-card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-orange)'}}>
                      {results.totalResults}
                    </div>
                    <div className="reddit-text-secondary small">Total Results</div>
                  </div>
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-blue)'}}>
                      {results.standardsSearched}
                    </div>
                    <div className="reddit-text-secondary small">Standards Searched</div>
                  </div>
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-orange)'}}>
                      {results.sectionsFound}
                    </div>
                    <div className="reddit-text-secondary small">Sections Found</div>
                  </div>
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-blue)'}}>
                      {results.averageWords}
                    </div>
                    <div className="reddit-text-secondary small">Avg Words</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {results && results.results.length > 0 ? (
            <div className="row g-4">
              {results.results.map((result: any, index: number) => (
                <div key={result.id} className="col-12">
                  <div className="reddit-card search-result-card reddit-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <Link 
                      to={`/section/${result.id}`}
                      className="text-decoration-none"
                      style={{color: 'inherit'}}
                    >
                      <div className="reddit-card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h3 className="h5 fw-bold reddit-text-primary mb-2 hover-text-primary">
                              {result.sectionNumber || 'N/A'} {result.title || 'Untitled'}
                            </h3>
                            <div className="d-flex align-items-center reddit-text-secondary mb-2">
                              <FaBook className="me-2" />
                              <span className="fw-medium">{result.standardTitle || 'Unknown Standard'}</span>
                            </div>
                            <div className="reddit-text-muted small">
                              Section ID: {result.anchorId || 'N/A'}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="reddit-status">
                              <div className="reddit-status-dot"></div>
                              <span>{result.similarity ? (result.similarity * 100).toFixed(1) : '0.0'}% match</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="reddit-text-secondary mb-3">
                          <p>
                            {result.content ? result.content.substring(0, 300) : 'No content available'}
                            {result.content && result.content.length > 300 && '...'}
                          </p>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="reddit-text-muted small">
                            <strong>Similarity:</strong> {result.similarity ? (result.similarity * 100).toFixed(1) : '0.0'}%
                          </div>
                          <div className="btn-reddit btn-sm">
                            <FaEye className="me-1" />
                            View Section
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reddit-card reddit-fade-in">
              <div className="reddit-card-body text-center">
                <FaSearch className="display-1 reddit-text-muted mb-4" />
                <h2 className="h4 fw-bold reddit-text-primary mb-3">No Results Found</h2>
                <p className="reddit-text-secondary mb-4">
                  No sections found matching your search query. Try different keywords or check your spelling.
                </p>
                <button onClick={onBack} className="btn-reddit">
                  <FaArrowLeft className="me-2" />
                  Back to Standards
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="reddit-pagination">
            <button onClick={onBack} className="reddit-pagination-btn">
              <FaArrowLeft className="me-1" />
              Back to Standards
            </button>
            <Link to="/standards" className="reddit-pagination-btn">
              <FaList className="me-1" />
              All Standards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;