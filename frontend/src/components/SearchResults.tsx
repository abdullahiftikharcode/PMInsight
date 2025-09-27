import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

interface SearchResult {
  query: string;
  totalResults: number;
  results: Array<{
    standard: {
      id: number;
      title: string;
      type: string;
      version: string;
    };
    sections: Array<{
      id: number;
      sectionNumber: string;
      title: string;
      fullTitle: string;
      content: string;
      wordCount: number;
      anchorId: string;
      chapter: {
        id: number;
        title: string;
        number: string;
      };
    }>;
  }>;
  searchMetadata: {
    searchedStandards: number[];
    totalSections: number;
    averageWordCount: number;
  };
}

interface SearchResultsProps {
  query: string;
  onBack: () => void;
}

const SearchResults = ({ query, onBack }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionPages, setSectionPages] = useState<Record<number, number>>({});

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await apiService.searchAll(query, undefined, undefined, 50);
        setResults(data);
      } catch (err) {
        setError('Failed to perform search. Please try again.');
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
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Searching Standards...</p>
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
          <h1 className="h2 fw-bold gradient-text mb-4">Search Error</h1>
          <p className="text-white-80 mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="btn btn-primary hover-lift d-flex align-items-center mx-auto"
          >
            <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const handleSectionPageChange = (standardId: number, newPage: number) => {
    setSectionPages(prev => ({
      ...prev,
      [standardId]: newPage
    }));
  };

  const getPaginatedSections = (standardId: number, sections: any[]) => {
    const currentPage = sectionPages[standardId] || 1;
    const sectionsPerPage = 4;
    const startIndex = (currentPage - 1) * sectionsPerPage;
    const endIndex = startIndex + sectionsPerPage;
    return sections.slice(startIndex, endIndex);
  };

  const getTotalPages = (sections: any[]) => {
    return Math.ceil(sections.length / 4);
  };

  if (!results) {
    return null;
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
                <button 
                  onClick={onBack}
                  className="text-info text-decoration-none btn btn-link p-0"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="display-5 fw-bold gradient-text text-glow mb-0">
                    Search Results
                  </h1>
                  <p className="text-white-80 fs-5 mt-1 mb-0">
                    Found {results.totalResults} results for "{query}"
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="status-indicator">
                <div className="status-dot green"></div>
                <span className="text-white-90 fw-medium">Search Complete</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">
          {/* Search Metadata */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-content">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="h4 fw-bold text-primary mb-1">{results.totalResults}</div>
                      <div className="text-white-70 small">Total Results</div>
                    </div>
                    <div className="col-md-3">
                      <div className="h4 fw-bold text-info mb-1">{results.searchMetadata.searchedStandards.length}</div>
                      <div className="text-white-70 small">Standards Searched</div>
                    </div>
                    <div className="col-md-3">
                      <div className="h4 fw-bold text-success mb-1">{results.searchMetadata.totalSections}</div>
                      <div className="text-white-70 small">Sections Found</div>
                    </div>
                    <div className="col-md-3">
                      <div className="h4 fw-bold text-warning mb-1">{results.searchMetadata.averageWordCount}</div>
                      <div className="text-white-70 small">Avg Words</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results by Standard */}
          <div className="row">
            {results.results.map((standardResult, index) => (
              <div key={standardResult.standard.id} className="col-12 mb-5">
                <div className="card">
                  <div className="card-content">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h2 className="h4 fw-bold text-white mb-2">
                          {standardResult.standard.title}
                        </h2>
                        <div className="d-flex align-items-center gap-3 small text-white-70">
                          <span className="glass px-3 py-1 rounded-pill">
                            {standardResult.standard.type}
                          </span>
                          <span className="glass px-3 py-1 rounded-pill">
                            {standardResult.standard.version}
                          </span>
                          <span className="glass px-3 py-1 rounded-pill text-primary">
                            {standardResult.sections.length} sections
                          </span>
                        </div>
                      </div>
                      <Link 
                        to={`/standard/${standardResult.standard.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Standard
                      </Link>
                    </div>

                    {/* Sections with Pagination */}
                    <div className="row">
                      {getPaginatedSections(standardResult.standard.id, standardResult.sections).map((section, sectionIndex) => (
                        <div key={section.id} className="col-md-6 mb-4">
                          <div className="card hover-lift">
                            <div className="card-content">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h3 className="h6 fw-bold text-white mb-0">
                                  {section.title}
                                </h3>
                                <span className="text-white-60 small">
                                  {section.wordCount} words
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <span className="text-white-70 small">
                                  {section.chapter.number} • {section.chapter.title}
                                </span>
                              </div>

                              <p className="text-white-80 small mb-3" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {section.content.substring(0, 200)}...
                              </p>

                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-white-60 small font-mono">
                                  {section.sectionNumber}
                                </span>
                                <Link 
                                  to={`/standard/${standardResult.standard.id}/section/${section.id}`}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Read More
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {getTotalPages(standardResult.sections) > 1 && (
                      <div className="d-flex justify-content-center mt-4">
                        <nav aria-label="Section pagination">
                          <ul className="pagination pagination-sm">
                            <li className={`page-item ${(sectionPages[standardResult.standard.id] || 1) === 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handleSectionPageChange(standardResult.standard.id, (sectionPages[standardResult.standard.id] || 1) - 1)}
                                disabled={(sectionPages[standardResult.standard.id] || 1) === 1}
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            </li>
                            
                            {Array.from({ length: getTotalPages(standardResult.sections) }, (_, i) => i + 1).map(page => (
                              <li key={page} className={`page-item ${(sectionPages[standardResult.standard.id] || 1) === page ? 'active' : ''}`}>
                                <button 
                                  className="page-link"
                                  onClick={() => handleSectionPageChange(standardResult.standard.id, page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}
                            
                            <li className={`page-item ${(sectionPages[standardResult.standard.id] || 1) === getTotalPages(standardResult.sections) ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handleSectionPageChange(standardResult.standard.id, (sectionPages[standardResult.standard.id] || 1) + 1)}
                                disabled={(sectionPages[standardResult.standard.id] || 1) === getTotalPages(standardResult.sections)}
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}

                    {/* Show More/Less Toggle for Standards with Many Sections */}
                    {standardResult.sections.length > 4 && (
                      <div className="text-center mt-3">
                        <small className="text-white-70">
                          Showing {getPaginatedSections(standardResult.standard.id, standardResult.sections).length} of {standardResult.sections.length} sections
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.results.length === 0 && (
            <div className="text-center py-5">
              <div className="display-1 mb-4 text-white-60">🔍</div>
              <h2 className="h3 fw-bold gradient-text mb-3">No Results Found</h2>
              <p className="text-white-80 mb-4">
                Try adjusting your search terms or browse our standards library.
              </p>
              <button onClick={onBack} className="btn btn-primary hover-lift">
                Try Different Search
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;