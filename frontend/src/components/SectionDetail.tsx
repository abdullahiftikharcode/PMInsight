import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { 
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
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const SectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [section, setSection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjacentSections, setAdjacentSections] = useState<{prev: any, next: any} | null>(null);

  const fetchAdjacentSections = async (sectionId: string) => {
    try {
      console.log('Fetching adjacent sections for section:', sectionId);
      const adjacentData = await apiService.getAdjacentSections(sectionId);
      console.log('Adjacent sections data:', adjacentData);
      
      if (adjacentData) {
        setAdjacentSections({
          prev: adjacentData.prev,
          next: adjacentData.next
        });
      }
    } catch (err) {
      console.error('Error fetching adjacent sections:', err);
    }
  };

  useEffect(() => {
    const fetchSection = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const sectionData = await apiService.getSection(id);
        if (sectionData) {
          setSection(sectionData);
          // Fetch adjacent sections using the new API
          await fetchAdjacentSections(id);
        } else {
          setError('Section not found');
        }
      } catch (err) {
        setError('Failed to load section. Please try again.');
        console.error('Error fetching section:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

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
              <p>Loading section...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !section) {
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
              <h2 className="h3 fw-bold reddit-text-primary mb-3">Section Not Found</h2>
              <p className="reddit-text-secondary mb-4">
                {error || 'The section you are looking for could not be found. It may have been moved or deleted.'}
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/standards" className="btn-reddit">
                  <FaArrowLeft className="me-2" />
                  Back to Standards
                </Link>
                <Link to="/" className="btn-reddit-outline">
                  <FaHome className="me-2" />
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reddit-layout">
      {/* Reddit-Style Sidebar */}
      <div className="reddit-sidebar" style={{overflowY: 'auto', height: '100vh'}}>
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
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            Analytics
          </Link>
          {section.standardId && (
            <Link to={`/standard/${section.standardId}`} className="reddit-sidebar-link">
              <FaList className="me-2" />
              Back to Standard
            </Link>
          )}
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Section Info</div>
          <div className="reddit-sidebar-link">
            <FaBook className="me-2" />
            {section.sectionNumber} {section.title}
          </div>
          <div className="reddit-sidebar-link">
            <FaEye className="me-2" />
            Section ID: {section.anchorId}
          </div>
          {adjacentSections && (
            <div className="reddit-text-muted small mt-2">
              <div>{adjacentSections.prev ? 'Previous section available' : 'First section'}</div>
              <div>{adjacentSections.next ? 'Next section available' : 'Last section'}</div>
            </div>
          )}
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Topics Covered</div>
          {section.topics && section.topics.map((topic: any, index: number) => (
            <div key={index} className="reddit-sidebar-link">
              <FaBook className="me-2" />
              {topic.name}
            </div>
          ))}
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
              {section.standardId && (
                <Link to={`/standard/${section.standardId}`} className="btn-reddit-outline btn-sm me-3">
                  <FaArrowLeft className="me-1" />
                  Back to Standard
                </Link>
              )}
                <div>
                <h1 className="h4 fw-bold reddit-text-primary mb-0">
                  {section.sectionNumber} {section.title}
                </h1>
                <p className="reddit-text-secondary mb-0">
                  Section ID: {section.anchorId}
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
          {/* Section Content */}
          <div className="reddit-card reddit-fade-in">
            <div className="reddit-card-header">
              <h2 className="h4 fw-bold reddit-text-primary mb-0">
                {section.sectionNumber} {section.title}
              </h2>
            </div>
            <div className="reddit-card-body">
              <div className="reddit-text-secondary mb-4">
                <p>{section.content}</p>
                  </div>

              {/* Topics */}
              {section.topics && section.topics.length > 0 && (
                  <div className="mb-4">
                  <h3 className="h6 fw-bold reddit-text-primary mb-3">Topics Covered</h3>
                  <div className="row g-2">
                    {section.topics.map((topic: any, index: number) => (
                      <div key={index} className="col-md-6">
                        <div className="reddit-card">
                          <div className="reddit-card-body">
                            <h4 className="h6 fw-bold reddit-text-primary mb-2">
                              {topic.name}
                            </h4>
                            <p className="reddit-text-secondary small mb-0">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="reddit-text-muted small">
                <div className="row">
                  <div className="col-md-6">
                    <strong>Section ID:</strong> {section.anchorId}
                    </div>
                  <div className="col-md-6">
                    <strong>Standard:</strong> {section.standardTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="reddit-pagination">
            {section.standardId && (
              <Link to={`/standard/${section.standardId}`} className="reddit-pagination-btn">
                <FaArrowLeft className="me-1" />
                Back to Standard
              </Link>
            )}
            
            {/* Previous Section */}
            {adjacentSections?.prev && (
              <Link 
                to={`/section/${adjacentSections.prev.id}`}
                className="reddit-pagination-btn"
              >
                <FaChevronLeft className="me-1" />
                Previous: {adjacentSections.prev.sectionNumber}
              </Link>
            )}
            
            {/* Next Section */}
            {adjacentSections?.next && (
              <Link 
                to={`/section/${adjacentSections.next.id}`}
                className="reddit-pagination-btn"
              >
                Next: {adjacentSections.next.sectionNumber}
                <FaChevronRight className="ms-1" />
              </Link>
            )}
            
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

export default SectionDetail;