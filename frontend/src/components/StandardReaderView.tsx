import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, type StandardDetail, type SearchResult, type Section } from '../services/api';

const StandardReaderView = () => {
  const { id } = useParams<{ id: string }>();
  const [standard, setStandard] = useState<StandardDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionsPerPage, setSectionsPerPage] = useState(10);
  const [tocPage, setTocPage] = useState(1);
  const [tocPerPage, setTocPerPage] = useState(20);
  const [allSections, setAllSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchStandard = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiService.getStandard(parseInt(id), currentPage, sectionsPerPage);
        setStandard(data);
      } catch (err) {
        setError('Failed to load standard. Please try again.');
        console.error('Error fetching standard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandard();
  }, [id, currentPage, sectionsPerPage]);

  // Fetch all sections for table of contents
  useEffect(() => {
    const fetchAllSections = async () => {
      if (!id) return;
      
      try {
        // Fetch all sections with a large limit
        const data = await apiService.getStandard(parseInt(id), 1, 1000);
        setAllSections(data.sections);
      } catch (err) {
        console.error('Error fetching all sections:', err);
      }
    };

    fetchAllSections();
  }, [id]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`bookmarks-${id}`);
    if (savedBookmarks) {
      setBookmarks(new Set(JSON.parse(savedBookmarks)));
    }
  }, [id]);

  // Save bookmarks to localStorage
  useEffect(() => {
    if (bookmarks.size > 0) {
      localStorage.setItem(`bookmarks-${id}`, JSON.stringify([...bookmarks]));
    }
  }, [bookmarks, id]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !id) return;

    try {
      setSearching(true);
      const response = await fetch(`http://localhost:3001/api/standards/${id}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, limit: 10 }),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const navigateToSection = (sectionId: number) => {
    window.location.href = `/section/${sectionId}`;
  };

  const toggleBookmark = (sectionId: number) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(sectionId)) {
      newBookmarks.delete(sectionId);
    } else {
      newBookmarks.add(sectionId);
    }
    setBookmarks(newBookmarks);
  };

  // Get paginated sections for table of contents
  const getPaginatedTocSections = () => {
    if (allSections.length === 0) return [];
    const startIndex = (tocPage - 1) * tocPerPage;
    const endIndex = startIndex + tocPerPage;
    return allSections.slice(startIndex, endIndex);
  };

  // Calculate TOC pagination info
  const getTocPaginationInfo = () => {
    if (allSections.length === 0) return null;
    const totalSections = allSections.length;
    const totalPages = Math.ceil(totalSections / tocPerPage);
    return {
      currentPage: tocPage,
      totalPages,
      totalSections,
      hasNextPage: tocPage < totalPages,
      hasPrevPage: tocPage > 1,
    };
  };

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    standard?.sections.forEach((section) => {
      const element = document.getElementById(section.anchorId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [standard]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Loading Standard...</p>
          <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !standard) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4" style={{maxWidth: '400px'}}>
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h1 className="h2 fw-bold gradient-text mb-4">Error</h1>
          <p className="text-white-80 mb-4">{error || 'Standard not found'}</p>
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
              <div className="d-flex align-items-center gap-3">
                <Link to="/" className="text-info text-decoration-none">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Link>
                <div>
                  <h1 className="h3 fw-bold text-white mb-0">{standard.title}</h1>
                  <p className="text-white-70 small mb-0">{standard.sections.length} sections</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex align-items-center gap-3">
                <div className="status-indicator">
                  <div className="status-dot blue"></div>
                  <span className="text-white-90 fw-medium">Standard Reader</span>
                </div>
                {standard?.pagination && (
                  <div className="text-white-70 small">
                    Page {standard.pagination.currentPage} of {standard.pagination.totalPages}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="position-sticky" style={{top: '100px'}}>
                {/* Simple Search */}
                <div className="card mb-4">
                  <div className="card-content">
                    <h3 className="h5 fw-semibold text-white mb-4">Search</h3>
                    <form onSubmit={handleSearch}>
                      <div className="mb-3">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search sections..."
                          className="form-control"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={searching || !searchQuery.trim()}
                        className="btn btn-primary w-100"
                      >
                        {searching ? 'Searching...' : 'Search'}
                      </button>
                    </form>
                    
                    {/* Simple Search Results */}
                    {searchResults.length > 0 && (
                      <div className="mt-4">
                        <h4 className="h6 fw-semibold text-white mb-3">
                          Found {searchResults.length} results:
                        </h4>
                        <div className="d-flex flex-column gap-2">
                          {searchResults.map((result) => (
                            <div key={result.id} className="border border-info rounded p-3">
                              <button
                                onClick={() => navigateToSection(result.id)}
                                className="btn btn-link text-start p-0 w-100 text-decoration-none"
                              >
                                <div className="small text-white fw-medium">
                                  {result.sectionNumber} {result.title}
                                </div>
                                <div className="small text-white-70 d-flex justify-content-between align-items-center mt-1">
                                  <span>Match: {Math.round(result.similarity * 100)}%</span>
                                  <span className="badge bg-info text-dark">
                                    {Math.round(result.similarity * 100)}%
                                  </span>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="card mb-4">
                  <div className="card-content">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h5 fw-semibold text-white mb-0">Table of Contents</h3>
                      {getTocPaginationInfo() && (
                        <div className="d-flex align-items-center gap-2">
                          <select 
                            value={tocPerPage} 
                            onChange={(e) => {
                              setTocPerPage(parseInt(e.target.value));
                              setTocPage(1);
                            }}
                            className="form-select form-select-sm"
                            style={{width: 'auto'}}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <nav className="d-flex flex-column gap-2">
                      {allSections.length === 0 ? (
                        <div className="text-center text-white-70 small py-3">
                          Loading table of contents...
                        </div>
                      ) : (
                        getPaginatedTocSections().map((section) => (
                        <div
                          key={section.id}
                          className={`border border-white-20 rounded p-3 ${
                            activeSection === section.anchorId ? 'bg-primary-20' : ''
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <button
                              onClick={() => navigateToSection(section.id)}
                              className="btn btn-link text-start p-0 w-100 text-decoration-none"
                            >
                              <span className="small text-white">{section.sectionNumber} {section.title}</span>
                            </button>
                            <button
                              onClick={() => toggleBookmark(section.id)}
                              className="btn btn-sm p-1 ms-2"
                              title={bookmarks.has(section.id) ? 'Remove bookmark' : 'Add bookmark'}
                            >
                              {bookmarks.has(section.id) ? (
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                                </svg>
                              ) : (
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        ))
                      )}
                    </nav>

                    {/* TOC Pagination Controls */}
                    {getTocPaginationInfo() && (
                      <div className="mt-4 pt-3 border-top border-white-20">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-white-70 small">
                            Showing {((tocPage - 1) * tocPerPage) + 1} to {Math.min(tocPage * tocPerPage, getTocPaginationInfo()!.totalSections)} of {getTocPaginationInfo()!.totalSections}
                          </div>
                          
                          <div className="d-flex align-items-center gap-1">
                            <button
                              onClick={() => setTocPage(1)}
                              disabled={!getTocPaginationInfo()!.hasPrevPage}
                              className="btn btn-outline-light btn-sm"
                              title="First page"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => setTocPage(tocPage - 1)}
                              disabled={!getTocPaginationInfo()!.hasPrevPage}
                              className="btn btn-outline-light btn-sm"
                              title="Previous page"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                              </svg>
                            </button>
                            
                            <span className="text-white-70 small px-2">
                              {tocPage}/{getTocPaginationInfo()!.totalPages}
                            </span>
                            
                            <button
                              onClick={() => setTocPage(tocPage + 1)}
                              disabled={!getTocPaginationInfo()!.hasNextPage}
                              className="btn btn-outline-light btn-sm"
                              title="Next page"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => setTocPage(getTocPaginationInfo()!.totalPages)}
                              disabled={!getTocPaginationInfo()!.hasNextPage}
                              className="btn btn-outline-light btn-sm"
                              title="Last page"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Results */}

                {/* Bookmarks */}
                {bookmarks.size > 0 && (
                  <div className="card">
                    <div className="card-content">
                      <h3 className="h5 fw-semibold text-white mb-4">Bookmarks</h3>
                      <div className="d-flex flex-column gap-2">
                        {standard.sections
                          .filter(section => bookmarks.has(section.id))
                          .map((section) => (
                            <div key={section.id} className="border border-info rounded p-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <button
                                  onClick={() => navigateToSection(section.id)}
                                  className="btn btn-link text-start p-0 w-100 text-decoration-none"
                                >
                                  <span className="small text-white">{section.sectionNumber} {section.title}</span>
                                </button>
                                <button
                                  onClick={() => toggleBookmark(section.id)}
                                  className="btn btn-sm p-1 ms-2 text-danger"
                                  title="Remove bookmark"
                                >
                                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Blog Style */}
            <div className="col-lg-9">
              <div className="d-flex flex-column gap-3">
                {standard.sections.map((section) => (
                  <article
                    key={section.id}
                    id={section.anchorId}
                    className="card"
                    style={{transition: 'transform 0.2s ease, box-shadow 0.2s ease'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="card-content">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <Link 
                            to={`/section/${section.id}`}
                            className="text-decoration-none"
                          >
                            <h2 className="h5 fw-bold text-white mb-2 hover-text-primary">
                              {section.sectionNumber} {section.title}
                            </h2>
                          </Link>
                          <div className="text-white-70 small mb-2">
                            Section ID: {section.anchorId}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBookmark(section.id)}
                          className="btn btn-outline-light btn-sm"
                          title={bookmarks.has(section.id) ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          {bookmarks.has(section.id) ? (
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {/* Truncated Content Preview */}
                      <div className="text-white-80">
                        <p className="mb-2">
                          {section.content.length > 200 
                            ? `${section.content.substring(0, 200)}...` 
                            : section.content
                          }
                        </p>
                        <Link 
                          to={`/section/${section.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Read More
                          <svg className="ms-1" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {standard.pagination && (
                <div className="card mt-4">
                  <div className="card-content">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-white-70 small">
                          Showing {((standard.pagination.currentPage - 1) * sectionsPerPage) + 1} to {Math.min(standard.pagination.currentPage * sectionsPerPage, standard.pagination.totalSections)} of {standard.pagination.totalSections} sections
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <label className="text-white-70 small">Per page:</label>
                          <select 
                            value={sectionsPerPage} 
                            onChange={(e) => {
                              setSectionsPerPage(parseInt(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="form-select form-select-sm"
                            style={{width: 'auto'}}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={!standard.pagination.hasPrevPage}
                          className="btn btn-outline-light btn-sm"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!standard.pagination?.hasPrevPage}
                          className="btn btn-outline-light btn-sm"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                          </svg>
                        </button>
                        
                        <span className="text-white-70 small px-3">
                          Page {standard.pagination?.currentPage || 1} of {standard.pagination?.totalPages || 1}
                        </span>
                        
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!standard.pagination?.hasNextPage}
                          className="btn btn-outline-light btn-sm"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentPage(standard.pagination?.totalPages || 1)}
                          disabled={!standard.pagination?.hasNextPage}
                          className="btn btn-outline-light btn-sm"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StandardReaderView;