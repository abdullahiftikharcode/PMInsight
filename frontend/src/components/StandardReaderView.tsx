import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { apiService, type StandardDetail, type SearchResult } from '../services/api';
import { useBookmarks } from '../hooks/useBookmarks';
import { 
  FaSearch, 
  FaBook, 
  FaBookmark, 
  FaHome,
  FaArrowLeft,
  FaExclamationTriangle,
  FaList,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaCogs,
  FaUsers,
  FaRocket,
  FaChartBar,
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';

const StandardReaderView = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [standard, setStandard] = useState<StandardDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tocCurrentPage, setTocCurrentPage] = useState(1);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedSections, setBookmarkedSections] = useState<any[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  useEffect(() => {
    const fetchStandard = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const standardData = await apiService.getStandard(parseInt(id));
        if (standardData) {
          setStandard(standardData);
        } else {
          setError('Standard not found');
        }
      } catch (err) {
        setError('Failed to load standard. Please try again.');
        console.error('Error fetching standard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandard();
  }, [id]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !id) return;

    try {
      setSearchLoading(true);
      const response = await apiService.searchStandard(parseInt(id), searchQuery);
      console.log('Search response:', response);
      // The backend returns { query, results, totalFound, standard }
      setSearchResults(response.results || []);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const fetchBookmarkedSections = async () => {
    if (bookmarks.size === 0) {
      setBookmarkedSections([]);
      return;
    }

    try {
      setBookmarksLoading(true);
      
      // Fetch details for each bookmarked section (regardless of standard)
      const sectionPromises = Array.from(bookmarks).map(async (sectionId) => {
        try {
          const section = await apiService.getSection(sectionId);
          return section;
        } catch (err) {
          console.error(`Error fetching section ${sectionId}:`, err);
          return null;
        }
      });

      const sections = await Promise.all(sectionPromises);
      const validSections = sections.filter(section => section !== null);
      
      setBookmarkedSections(validSections);
    } catch (err) {
      console.error('Error fetching bookmarked sections:', err);
    } finally {
      setBookmarksLoading(false);
    }
  };

  const handleShowBookmarks = () => {
    setShowBookmarks(true);
    fetchBookmarkedSections();
  };


  const handleTocNavigation = async (page: number) => {
    if (!id || page === tocCurrentPage) return;
    
    try {
      setPaginationLoading(true);
      const standardData = await apiService.getStandard(parseInt(id), page);
      if (standardData) {
        setStandard(standardData);
        setTocCurrentPage(page);
      }
    } catch (err) {
      console.error('Error loading TOC page:', err);
      setError('Failed to load table of contents page');
    } finally {
      setPaginationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reddit-layout">
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
        </div>
        <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
          <div className="reddit-content">
            <div className="reddit-loading">
              <div className="reddit-spinner"></div>
              <p>Loading standard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !standard) {
    return (
      <div className="reddit-layout">
        <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`}>
          <div className="reddit-sidebar-section">
            <Link to="/" className="reddit-nav-brand">
              <FaRocket />
              <span className="label">PMInsight</span>
            </Link>
            <button
              className="sidebar-toggle"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
            </button>
          </div>
        </div>
        <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
          <div className="reddit-content">
            <div className="reddit-error">
              <FaExclamationTriangle className="reddit-error-icon" />
              <h2 className="h3 fw-bold reddit-text-primary mb-3">Error</h2>
              <p className="reddit-text-secondary mb-4">{error || 'Standard not found'}</p>
              <Link to="/standards" className="btn-reddit">
                <FaArrowLeft className="me-2" />
                Back to Standards
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reddit-layout">
      {/* Reddit-Style Sidebar */}
      <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`} style={{overflowY: 'auto', height: '100vh'}}>
        <div className="reddit-sidebar-section">
          <Link to="/" className="reddit-nav-brand">
            <FaRocket />
            <span className="label">PMInsight</span>
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>
        
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Navigation</div>
          <Link to="/" className={`reddit-sidebar-link${location.pathname === '/' ? ' active' : ''}`} aria-label="Home">
            <FaHome className="me-2" />
            <span className="label">Home</span>
          </Link>
          <Link to="/standards" className={`reddit-sidebar-link${location.pathname.startsWith('/standard') || location.pathname.startsWith('/standards') ? ' active' : ''}`} aria-label="Standards">
            <FaBook className="me-2" />
            <span className="label">Standards</span>
          </Link>
          <Link to="/comparison" className={`reddit-sidebar-link${location.pathname.startsWith('/comparison') ? ' active' : ''}`} aria-label="Comparison">
            <FaBook className="me-2" />
            <span className="label">Comparison</span>
          </Link>
          <Link to="/process-generator" className={`reddit-sidebar-link${location.pathname.startsWith('/process-generator') ? ' active' : ''}`} aria-label="Process Generator">
            <FaCogs className="me-2" />
            <span className="label">Process Generator</span>
          </Link>
          <Link to="/insights" className={`reddit-sidebar-link${location.pathname.startsWith('/insights') ? ' active' : ''}`} aria-label="Analytics">
            <FaChartBar className="me-2" />
            <span className="label">Analytics</span>
          </Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Search</div>
          <form onSubmit={handleSearch} className="reddit-search">
            <div className="position-relative">
              <FaSearch className="reddit-search-icon" />
              <input
                type="text"
                className="reddit-search-input"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={searchLoading}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2"
                  style={{ zIndex: 10 }}
                >
                  <FaTimes className="text-muted" />
                </button>
              )}
            </div>
            {searchLoading && (
              <div className="text-center mt-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
              </div>
            )}
          </form>
          {showSearchResults && (
            <div className="mt-2">
              <button
                onClick={clearSearch}
                className="btn btn-outline-secondary btn-sm w-100"
              >
                <FaTimes className="me-1" />
                Clear Search ({searchResults.length} results)
              </button>
            </div>
          )}
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Table of Contents</div>
          <div className="reddit-sidebar-link" aria-label="Sections count">
            <FaList className="me-2" />
            <span className="label">{standard.pagination?.totalSections || standard.sections.length} sections</span>
          </div>
          
          {/* TOC Page Info */}
          {standard.pagination && (
            <div className="reddit-text-muted small mb-2">
              Page {standard.pagination.currentPage} of {standard.pagination.totalPages}
          </div>
          )}
          
          <div style={{maxHeight: '400px', overflowY: 'auto'}}>
            {standard.sections.map((section) => (
              <div key={section.id} className="reddit-list-item">
                <div className="reddit-list-item-content">
                  <div className="reddit-list-item-title" style={{
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {section.sectionNumber} {section.title}
                  </div>
                  <div className="reddit-list-item-description" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {section.content.substring(0, 80)}...
                  </div>
                </div>
                <button
                  onClick={() => toggleBookmark(section.id)}
                  className="btn btn-sm p-1 flex-shrink-0"
                  title={bookmarks.has(section.id.toString()) ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <FaBookmark className={bookmarks.has(section.id.toString()) ? 'text-warning' : 'text-muted'} />
                </button>
              </div>
            ))}
          </div>
          
          {/* TOC Navigation Controls */}
          {standard.pagination && standard.pagination.totalPages > 1 && (
            <div className="reddit-pagination mt-3" style={{justifyContent: 'center', gap: '8px'}}>
              <button 
                className="reddit-pagination-btn"
                disabled={!standard.pagination.hasPrevPage || paginationLoading}
                onClick={() => standard.pagination && handleTocNavigation(standard.pagination.currentPage - 1)}
                style={{fontSize: '0.75rem', padding: '4px 8px'}}
              >
                <FaChevronLeft style={{fontSize: '0.7rem'}} />
              </button>
              <span className="reddit-text-secondary" style={{fontSize: '0.75rem'}}>
                {standard.pagination.currentPage} of {standard.pagination.totalPages}
              </span>
              <button 
                className="reddit-pagination-btn"
                disabled={!standard.pagination.hasNextPage || paginationLoading}
                onClick={() => standard.pagination && handleTocNavigation(standard.pagination?.currentPage + 1)}
                style={{fontSize: '0.75rem', padding: '4px 8px'}}
              >
                <FaChevronRight style={{fontSize: '0.7rem'}} />
              </button>
            </div>
          )}
        </div>
                          
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Bookmarks</div>
          <button 
            onClick={handleShowBookmarks}
            className="reddit-sidebar-link btn btn-link text-start p-0 w-100"
            style={{fontSize: '0.9rem', textDecoration: 'none'}}
            disabled={bookmarks.size === 0}
            aria-label="Bookmarked sections"
          >
            <FaBookmark className="me-2 text-warning" />
            <span className="label">{bookmarks.size} bookmarked sections</span>
          </button>
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
      <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-nav">
          <div className="container d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Link to="/standards" className="btn-reddit-outline btn-sm me-3">
                <FaArrowLeft className="me-1" />
                Back
              </Link>
              <div>
                <h1 className="h4 fw-bold reddit-text-primary mb-0">
                  {standard.title}
                </h1>
                <p className="reddit-text-secondary mb-0">
                  {showSearchResults 
                    ? `${searchResults.length} search results for "${searchQuery}"`
                    : `${standard.pagination?.totalSections || standard.sections.length} sections`
                  }
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

        <div className={`reddit-content ${paginationLoading ? 'loading' : ''}`}>
          {/* Search Results */}
          {showSearchResults && (
            <div className="reddit-card reddit-fade-in mb-4">
              <div className="reddit-card-header">
                <h3 className="h5 fw-bold reddit-text-primary mb-0">
                  Search Results ({searchResults.length})
                </h3>
                <button
                  onClick={clearSearch}
                  className="btn-reddit-outline btn-sm"
                >
                  <FaTimes className="me-1" />
                  Clear Search
                </button>
              </div>
              <div className="reddit-card-body">
                {searchResults.length > 0 ? (
                  <div className="row g-3">
                    {searchResults.map((result, index) => (
                      <div key={result.id} className="col-12">
                        <div className="reddit-card reddit-fade-in" 
                             style={{
                               animationDelay: `${index * 0.1}s`,
                               height: '200px' // Fixed height for consistency
                             }}>
                          <Link 
                            to={`/section/${result.id}`}
                            className="text-decoration-none h-100 d-block"
                            style={{color: 'inherit'}}
                          >
                            <div className="reddit-card-body d-flex flex-column h-100 p-3">
                              {/* Header Section - Fixed height */}
                              <div className="d-flex justify-content-between align-items-start mb-2" 
                                   style={{minHeight: '45px'}}>
                                <div className="flex-grow-1 me-3">
                                  <h4 className="h6 fw-bold reddit-text-primary mb-1" 
                                      style={{
                                        fontSize: '0.95rem',
                                        lineHeight: '1.3',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        maxHeight: '2.6rem'
                                      }}>
                                    {result.sectionNumber} {result.title}
                                  </h4>
                                  <div className="reddit-text-muted" style={{fontSize: '0.75rem'}}>
                                    Section ID: {result.anchorId}
                                  </div>
                                </div>
                                <div className="text-end flex-shrink-0">
                                  <span className="badge bg-primary" style={{fontSize: '0.7rem'}}>
                                    {(result.similarity * 100).toFixed(1)}% match
                                  </span>
                                </div>
                              </div>
                              
                              {/* Content Section - Flexible height */}
                              <div className="reddit-text-secondary flex-grow-1 mb-2">
                                <p style={{
                                  fontSize: '0.85rem',
                                  lineHeight: '1.4',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  margin: 0
                                }}
                                dangerouslySetInnerHTML={{ __html: (result as any).snippet || (result as any).content || 'No content available' }}
                                />
                              </div>
                              
                              {/* Footer Section - Fixed height */}
                              <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top" 
                                   style={{minHeight: '32px'}}>
                                <div className="reddit-text-muted" style={{fontSize: '0.75rem'}}>
                                  <strong>Similarity:</strong> {(result.similarity * 100).toFixed(1)}%
                                </div>
                                <div className="btn-reddit btn-sm" style={{fontSize: '0.8rem', padding: '4px 8px'}}>
                                  <FaEye className="me-1" style={{fontSize: '0.7rem'}} />
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
                  <div className="text-center py-4">
                    <FaSearch className="display-4 reddit-text-muted mb-3" />
                    <h4 className="reddit-text-primary">No results found</h4>
                    <p className="reddit-text-secondary">Try different keywords or check your spelling.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sections List */}
          {!showSearchResults && (
            <div className="row g-4">
              {standard.sections.map((section, index) => (
                <div key={section.id} className="col-12">
                  <div className="reddit-card section-card reddit-fade-in" 
                       style={{
                         animationDelay: `${index * 0.1}s`,
                         height: '200px' // Fixed height matching search results
                       }}>
                    <Link 
                      to={`/section/${section.id}`}
                      className="text-decoration-none h-100 d-block"
                      style={{color: 'inherit'}}
                    >
                      <div className="reddit-card-body d-flex flex-column h-100 p-3">
                        {/* Header Section - Fixed height */}
                        <div className="d-flex justify-content-between align-items-start mb-2" 
                             style={{minHeight: '45px'}}>
                          <div className="flex-grow-1 me-3">
                            <h2 className="h5 fw-bold reddit-text-primary mb-1 hover-text-primary" 
                                style={{
                                  fontSize: '0.95rem',
                                  lineHeight: '1.3',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  maxHeight: '2.6rem'
                                }}>
                              {section.sectionNumber} {section.title}
                            </h2>
                            <div className="reddit-text-muted" style={{fontSize: '0.75rem'}}>
                              Section ID: {section.anchorId}
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleBookmark(section.id);
                              }}
                              className="btn btn-outline-secondary btn-sm"
                              style={{fontSize: '0.75rem', padding: '4px 8px'}}
                              title={isBookmarked(section.id) ? 'Remove bookmark' : 'Add bookmark'}
                            >
                              <FaBookmark className={isBookmarked(section.id) ? 'text-warning' : ''} 
                                         style={{fontSize: '0.7rem'}} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Content Section - Flexible height */}
                        <div className="reddit-text-secondary flex-grow-1 mb-2">
                          <p style={{
                            fontSize: '0.85rem',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            margin: 0
                          }}>
                            {section.content}
                          </p>
                        </div>
                        
                        {/* Footer Section - Fixed height */}
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top" 
                             style={{minHeight: '32px'}}>
                          <div className="reddit-text-muted" style={{fontSize: '0.75rem'}}>
                            Click to read full section
                          </div>
                          <div className="btn-reddit btn-sm" style={{fontSize: '0.8rem', padding: '4px 8px'}}>
                            <FaEye className="me-1" style={{fontSize: '0.7rem'}} />
                            Read More
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {standard.pagination && !showSearchResults && (
            <div className="reddit-pagination">
              <button 
                className="reddit-pagination-btn"
                disabled={!standard.pagination.hasPrevPage || paginationLoading}
                onClick={async () => {
                  if (standard.pagination?.hasPrevPage && !paginationLoading) {
                    try {
                      setPaginationLoading(true);
                      const prevPage = standard.pagination.currentPage - 1;
                      const prevPageData = await apiService.getStandard(parseInt(id!), prevPage);
                      setStandard(prevPageData);
                    } catch (err) {
                      console.error('Error loading previous page:', err);
                      setError('Failed to load previous page');
                    } finally {
                      setPaginationLoading(false);
                    }
                  }
                }}
              >
                <FaChevronLeft className="me-1" />
                Previous
              </button>
              <span className="reddit-text-secondary">
                Page {standard.pagination.currentPage} of {standard.pagination.totalPages}
              </span>
              <button 
                className="reddit-pagination-btn"
                disabled={!standard.pagination.hasNextPage || paginationLoading}
                onClick={async () => {
                  if (standard.pagination?.hasNextPage && !paginationLoading) {
                    try {
                      setPaginationLoading(true);
                      const nextPage = standard.pagination.currentPage + 1;
                      const nextPageData = await apiService.getStandard(parseInt(id!), nextPage);
                      setStandard(nextPageData);
                    } catch (err) {
                      console.error('Error loading next page:', err);
                      setError('Failed to load next page');
                    } finally {
                      setPaginationLoading(false);
                    }
                  }
                }}
              >
                Next
                <FaChevronRight className="ms-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <div className="reddit-overlay" onClick={() => setShowBookmarks(false)}>
          <div className="reddit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reddit-modal-header">
              <h3 className="h5 fw-bold reddit-text-primary mb-0">
                <FaBookmark className="me-2 text-warning" />
                All Bookmarked Sections
              </h3>
              <button
                type="button"
                onClick={() => setShowBookmarks(false)}
                className="btn btn-outline-secondary btn-sm"
                style={{fontSize: '0.75rem', padding: '4px 8px'}}
              >
                <FaTimes style={{fontSize: '0.7rem'}} />
              </button>
            </div>
            <div className="reddit-modal-body">
              {bookmarksLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 reddit-text-secondary">Loading bookmarks...</p>
                </div>
              ) : bookmarkedSections.length === 0 ? (
                <div className="text-center py-4">
                  <FaBookmark className="display-4 reddit-text-muted mb-3" />
                  <h4 className="h6 fw-bold reddit-text-primary mb-2">No Bookmarks Yet</h4>
                  <p className="reddit-text-secondary">
                    Start bookmarking sections to save them for later reading.
                  </p>
                </div>
              ) : (
                <div className="row">
                  {bookmarkedSections.map((section) => (
                    <div key={section.id} className="col-md-6 mb-3">
                      <div className="reddit-card reddit-fade-in h-100">
                        <div className="reddit-card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <h4 className="h6 fw-bold reddit-text-primary mb-1">
                                {section.sectionNumber} {section.title}
                              </h4>
                              <div className="reddit-text-muted small">
                                Section ID: {section.anchorId}
                              </div>
                              {section.standard && (
                                <div className="reddit-text-muted small mt-1">
                                  <FaBook className="me-1" />
                                  {section.standard.title}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => toggleBookmark(section.id)}
                              className="btn btn-outline-danger btn-sm"
                              style={{fontSize: '0.75rem', padding: '4px 8px'}}
                              title="Remove bookmark"
                            >
                              <FaTimes style={{fontSize: '0.7rem'}} />
                            </button>
                          </div>
                          
                          <div className="reddit-text-secondary flex-grow-1 mb-3">
                            <p style={{
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              margin: 0
                            }}>
                              {section.content ? section.content.substring(0, 200) : 'No content available'}
                              {section.content && section.content.length > 200 && '...'}
                            </p>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                            <div className="reddit-text-muted small">
                              <FaBookmark className="me-1 text-warning" />
                              Bookmarked
                            </div>
                            <div className="d-flex gap-2">
                              {section.standardId && (
                                <Link 
                                  to={`/standard/${section.standardId}`}
                                  className="btn btn-outline-secondary btn-sm"
                                  style={{fontSize: '0.8rem', padding: '4px 8px'}}
                                  onClick={() => setShowBookmarks(false)}
                                >
                                  <FaBook className="me-1" style={{fontSize: '0.7rem'}} />
                                  Standard
                                </Link>
                              )}
                              <Link 
                                to={`/section/${section.id}`}
                                className="btn-reddit btn-sm"
                                style={{fontSize: '0.8rem', padding: '4px 8px'}}
                                onClick={() => setShowBookmarks(false)}
                              >
                                <FaEye className="me-1" style={{fontSize: '0.7rem'}} />
                                Read Section
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardReaderView;

