import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../hooks/useBookmarks';
import { apiService } from '../services/api';
import { 
  FaBookmark, 
  FaHome, 
  FaChartBar, 
  FaRocket,
  FaEye,
  FaTrash,
  FaExclamationTriangle
} from 'react-icons/fa';

const BookmarksPage = () => {
  const { bookmarks, toggleBookmark, clearAllBookmarks, getBookmarkCount } = useBookmarks();
  const [bookmarkedSections, setBookmarkedSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarkedSections = async () => {
      if (bookmarks.size === 0) {
        setBookmarkedSections([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch details for each bookmarked section
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
        setError('Failed to load bookmarked sections');
        console.error('Error fetching bookmarked sections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedSections();
  }, [bookmarks]);

  const handleRemoveBookmark = (sectionId: string) => {
    toggleBookmark(sectionId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      clearAllBookmarks();
    }
  };

  if (loading) {
    return (
      <div className="reddit-layout">
        <div className="reddit-sidebar">
          <div className="reddit-sidebar-header">
            <FaRocket className="me-2" style={{color: 'var(--reddit-orange)'}} />
            PMInsight
          </div>
          <div className="reddit-sidebar-section">
            <div className="reddit-sidebar-title">NAVIGATION</div>
            <Link to="/" className="reddit-sidebar-link">
              <FaHome className="me-2" />
              Home
            </Link>
            <Link to="/insights" className="reddit-sidebar-link">
              <FaChartBar className="me-2" />
              Analytics
            </Link>
          </div>
        </div>
        <div className="reddit-main">
          <div className="reddit-content">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 reddit-text-secondary">Loading bookmarks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reddit-layout">
      <div className="reddit-sidebar">
        <div className="reddit-sidebar-header">
          <FaRocket className="me-2" style={{color: 'var(--reddit-orange)'}} />
          PMInsight
        </div>
        
        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">NAVIGATION</div>
          <Link to="/" className="reddit-sidebar-link">
            <FaHome className="me-2" />
            Home
          </Link>
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            Analytics
          </Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">BOOKMARKS</div>
          <div className="reddit-sidebar-link">
            <FaBookmark className="me-2 text-warning" />
            {getBookmarkCount()} bookmarked sections
          </div>
          {getBookmarkCount() > 0 && (
            <button 
              onClick={handleClearAll}
              className="reddit-sidebar-link btn btn-link text-danger p-0 text-start"
              style={{fontSize: '0.9rem'}}
            >
              <FaTrash className="me-2" />
              Clear All Bookmarks
            </button>
          )}
        </div>
      </div>

      <div className="reddit-main">
        <div className="reddit-nav">
          <div className="container d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Link to="/" className="btn-reddit-outline btn-sm me-3">
                <FaHome className="me-1" />
                Home
              </Link>
              <div>
                <h1 className="h4 fw-bold reddit-text-primary mb-0">
                  My Bookmarks
                </h1>
                <p className="reddit-text-secondary mb-0">
                  {getBookmarkCount()} bookmarked sections
                </p>
              </div>
            </div>
            <div className="reddit-nav-links">
              <Link to="/insights" className="reddit-nav-link">
                <FaChartBar className="me-1" />
                Insights
              </Link>
            </div>
          </div>
        </div>

        <div className="reddit-content">
          {error && (
            <div className="reddit-card reddit-fade-in mb-4">
              <div className="reddit-card-body text-center">
                <FaExclamationTriangle className="display-4 text-warning mb-3" />
                <h3 className="h5 fw-bold reddit-text-primary mb-2">Error Loading Bookmarks</h3>
                <p className="reddit-text-secondary">{error}</p>
              </div>
            </div>
          )}

          {bookmarkedSections.length === 0 && !error ? (
            <div className="reddit-card reddit-fade-in">
              <div className="reddit-card-body text-center py-5">
                <FaBookmark className="display-4 reddit-text-muted mb-3" />
                <h3 className="h5 fw-bold reddit-text-primary mb-2">No Bookmarks Yet</h3>
                <p className="reddit-text-secondary mb-4">
                  Start bookmarking sections to save them for later reading.
                </p>
                <Link to="/" className="btn-reddit">
                  <FaHome className="me-1" />
                  Browse Standards
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              {bookmarkedSections.map((section) => (
                <div key={section.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="reddit-card reddit-fade-in h-100">
                    <div className="reddit-card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h3 className="h6 fw-bold reddit-text-primary mb-1">
                            {section.sectionNumber} {section.title}
                          </h3>
                          <div className="reddit-text-muted small">
                            Section ID: {section.anchorId}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(section.id)}
                          className="btn btn-outline-danger btn-sm"
                          style={{fontSize: '0.75rem', padding: '4px 8px'}}
                          title="Remove bookmark"
                        >
                          <FaTrash style={{fontSize: '0.7rem'}} />
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
                        <Link 
                          to={`/section/${section.id}`}
                          className="btn-reddit btn-sm"
                          style={{fontSize: '0.8rem', padding: '4px 8px'}}
                        >
                          <FaEye className="me-1" style={{fontSize: '0.7rem'}} />
                          Read Section
                        </Link>
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
  );
};

export default BookmarksPage;
