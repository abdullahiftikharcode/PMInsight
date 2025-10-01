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
  FaRocket,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

const SearchResults = ({ query, onBack }: SearchResultsProps) => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [useSemantic, setUseSemantic] = useState(() => {
    const stored = localStorage.getItem('useSemantic');
    return stored ? stored === 'true' : true; // default ON
  });

  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlightHTML = (text: string, q: string) => {
    if (!text) return '';
    const safeQ = escapeRegex(q.trim());
    if (!safeQ) return text;
    const re = new RegExp(`(${safeQ})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  };
  const buildSnippet = (text: string, q: string, maxLen = 300) => {
    if (!text) return '';
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q.toLowerCase());
    if (idx === -1) return text.substring(0, maxLen);
    const start = Math.max(0, idx - 120);
    const end = Math.min(text.length, idx + q.length + 180);
    const snippet = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
    return snippet;
  };

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const searchResults = useSemantic
          ? await apiService.semanticSearch(query)
          : await apiService.searchAll(query);
        
        // Flatten the grouped results into individual sections
        const flattenedSections = searchResults.results.flatMap((group: any) => 
          group.sections.map((section: any) => {
            const isSemantic = searchResults.searchType === 'semantic' || useSemantic;
            let similarity = 0;
            if (isSemantic) {
              similarity = typeof section.similarity === 'number' ? section.similarity : 0;
            } else {
              // Calculate improved similarity score based on text matching
              const queryLower = query.toLowerCase();
              const titleLower = section.title?.toLowerCase() || '';
              const contentLower = section.content?.toLowerCase() || '';
              const fullTitleLower = section.fullTitle?.toLowerCase() || '';
              
              let titleMatch = 0;
              let contentMatch = 0;
              let fullTitleMatch = 0;
              
              if (titleLower.includes(queryLower)) {
                if (titleLower === queryLower) {
                  titleMatch = 0.95;
                } else if (titleLower.startsWith(queryLower)) {
                  titleMatch = 0.9;
                } else {
                  titleMatch = 0.8;
                }
              }
              if (fullTitleLower.includes(queryLower)) {
                fullTitleMatch = fullTitleLower === queryLower ? 0.9 : 0.75;
              }
              if (contentLower.includes(queryLower)) {
                const occurrences = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
                contentMatch = Math.min(0.7 + (occurrences * 0.05), 0.85);
              }
              similarity = Math.max(titleMatch, contentMatch, fullTitleMatch);
            }
            
            return {
              ...section,
              standardTitle: group.standard.title,
              standardType: group.standard.type,
              standardVersion: group.standard.version,
              similarity: similarity
            };
          })
        );
        
        // Sort by similarity score (highest first)
        const sortedSections = flattenedSections.sort((a: any, b: any) => b.similarity - a.similarity);
        
        setResults({
          ...searchResults,
          results: sortedSections,
          // Update counts to match flattened results
          totalResults: sortedSections.length,
          searchMetadata: {
            ...searchResults.searchMetadata,
            totalSections: sortedSections.length
          }
        });
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
  }, [query, useSemantic]);

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
      <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <Link to="/" className="reddit-nav-brand">
            <FaRocket />
            <span className="label">PMInsight</span>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => { const next = !isCollapsed; setIsCollapsed(next); localStorage.setItem('sidebarCollapsed', String(next)); }}
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
          <Link to="/standards" className="reddit-sidebar-link">
            <FaBook className="me-2" />
            <span className="label">Standards</span>
          </Link>
          <Link to="/standards" onClick={onBack} className="reddit-sidebar-link">
            <FaArrowLeft className="me-2" />
            <span className="label">Back to Standards</span>
          </Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Search Results</div>
          <div className="reddit-sidebar-link">
            <FaSearch className="me-2" />
            <span className="label">Query: "{query}"</span>
          </div>
          {results && (
            <>
              <div className="reddit-sidebar-link">
                <FaBook className="me-2" />
                <span className="label">{results.totalResults} results</span>
              </div>
              <div className="reddit-sidebar-link">
                <FaList className="me-2" />
                <span className="label">{results.standardsSearched} standards</span>
              </div>
            </>
          )}
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
              <div className="form-check form-switch me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="semanticToggle"
                  checked={useSemantic}
                  onChange={(e) => { const v = e.target.checked; setUseSemantic(v); localStorage.setItem('useSemantic', String(v)); }}
                />
                <label className="form-check-label" htmlFor="semanticToggle">
                  Semantic
                </label>
              </div>
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
                      {results.searchMetadata?.searchedStandards?.length || 0}
                    </div>
                    <div className="reddit-text-secondary small">Standards Searched</div>
                  </div>
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-orange)'}}>
                      {results.searchMetadata?.totalSections || 0}
                    </div>
                    <div className="reddit-text-secondary small">Sections Found</div>
                  </div>
                  <div className="col-md-3">
                    <div className="reddit-text-primary fw-bold fs-3" style={{color: 'var(--reddit-blue)'}}>
                      {results.searchMetadata?.averageWordCount || 0}
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
                      <div className="reddit-card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                          <h3 className="h5 fw-bold reddit-text-primary mb-2" dangerouslySetInnerHTML={{
                            __html: `${result.sectionNumber || 'N/A'} ${highlightHTML(result.title || 'Untitled', query)}`
                          }} />
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
                          <p dangerouslySetInnerHTML={{
                            __html: highlightHTML(buildSnippet(result.content || '', query), query)
                          }} />
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="reddit-text-muted small">
                          <strong>Similarity:</strong> {result.similarity ? (result.similarity * 100).toFixed(1) : '0.0'}%
                          </div>
                        <Link to={`/section/${result.id}`} className="btn-reddit btn-sm">
                            <FaEye className="me-1" />
                            View Section
                        </Link>
                          </div>
                        </div>
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