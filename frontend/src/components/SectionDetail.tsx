import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface SectionDetail {
  id: number;
  sectionNumber: string;
  title: string;
  fullTitle: string;
  content: string;
  anchorId: string;
  wordCount: number;
  sentenceCount: number;
  chapter: {
    id: number;
    number: string;
    title: string;
    description?: string;
  };
  standard: {
    id: number;
    title: string;
    type: string;
    version: string;
    description?: string;
  };
}

const SectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<SectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log('Fetching section with ID:', id);
        const response = await fetch(`http://localhost:3001/api/sections/${id}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Section not found: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Section data received:', data);
        setSection(data);
      } catch (err) {
        setError(`Failed to load section: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error fetching section:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="h4 gradient-text fw-semibold mb-4">Loading Section...</p>
          <div className="bouncing-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-animated">
        <div className="text-center glass-card p-5 rounded-4" style={{maxWidth: '400px'}}>
          <div className="display-1 mb-4 text-danger">⚠️</div>
          <h1 className="h2 fw-bold gradient-text mb-4">Section Not Found</h1>
          <p className="text-white-80 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-primary hover-lift d-flex align-items-center mx-auto"
          >
            <svg className="me-2" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
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
      <header className="header-glass position-relative" style={{zIndex: 10}}>
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
                  <h1 className="h3 fw-bold text-white mb-0">{section.title}</h1>
                  <p className="text-white-70 small mb-0">{section.fullTitle}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex align-items-center gap-3">
                <div className="status-indicator">
                  <div className="status-dot blue"></div>
                  <span className="text-white-90 fw-medium">Section Reader</span>
                </div>
                <div className="text-white-70 small">
                  {section.wordCount.toLocaleString()} words
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="position-relative" style={{zIndex: 10}}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card">
                <div className="card-content">
                  {/* Chapter Context */}
                  <div className="mb-4 p-4 bg-info bg-opacity-10 rounded border-start border-info border-4">
                    <h3 className="fw-semibold text-info mb-2">
                      Chapter {section.chapter.number}: {section.chapter.title}
                    </h3>
                    {section.chapter.description && (
                      <p className="text-info small mb-0">{section.chapter.description}</p>
                    )}
                  </div>

                  {/* Section Content */}
                  <div className="mb-4">
                    {section.content ? (
                      <div 
                        className="text-white-80 lh-lg"
                        style={{whiteSpace: 'pre-wrap'}}
                        dangerouslySetInnerHTML={{ 
                          __html: section.content.replace(/\n/g, '<br>') 
                        }}
                      />
                    ) : (
                      <div className="text-white-70 fst-italic">
                        No content available for this section.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-between align-items-center pt-4 border-top border-white-20">
                    <div className="d-flex gap-3">
                      <button className="btn btn-primary hover-lift">
                        <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Bookmark
                      </button>
                      <button className="btn btn-outline-light hover-lift">
                        <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                        </svg>
                        Share
                      </button>
                    </div>
                    <div className="text-white-70 small">
                      Section ID: {section.anchorId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-4 d-flex justify-content-between">
                <button 
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-light hover-lift"
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Standard
                </button>
                <button 
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-light hover-lift"
                >
                  Next Section
                  <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SectionDetail;
