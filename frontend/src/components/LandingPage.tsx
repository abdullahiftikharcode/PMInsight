import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaBook, 
  FaSearch, 
  FaChartBar, 
  FaBalanceScale,
  FaPlay,
  FaRocket,
  FaUsers,
  FaLightbulb
} from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="reddit-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="reddit-nav-brand">
            <FaRocket />
            PMInsight
          </Link>
          <div className="reddit-nav-links">
            <Link to="/standards" className="reddit-nav-link">
              <FaBook className="me-1" />
              Standards
            </Link>
            <Link to="/insights" className="reddit-nav-link">
              <FaChartBar className="me-1" />
              Insights
            </Link>
            <Link to="/tutorial" className="reddit-nav-link">
              <FaPlay className="me-1" />
              Tutorial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="reddit-fade-in">
                <h1 className="hero-title">
                  Master Project Management
                  <span className="reddit-text-primary d-block" style={{color: 'var(--reddit-orange)'}}>
                    Standards
                  </span>
                </h1>
                <p className="hero-subtitle">
                  Compare, analyze, and understand project management standards like PMBOK, ISO 21500, PRINCE2, and more in one comprehensive platform.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <Link to="/standards" className="btn-reddit btn-lg">
                    <FaBook className="me-2" />
                    Explore Standards
                  </Link>
                  <Link to="/tutorial" className="btn-reddit-outline btn-lg">
                    <FaPlay className="me-2" />
                    Learn How
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="reddit-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="text-center">
                  <div className="reddit-card reddit-glow" style={{maxWidth: '400px', margin: '0 auto'}}>
                    <div className="reddit-card-body text-center">
                      <FaRocket className="display-1 reddit-text-primary mb-4" style={{color: 'var(--reddit-orange)'}} />
                      <h3 className="h4 fw-bold reddit-text-primary mb-3">
                        Your Gateway to PM Excellence
                      </h3>
                      <p className="reddit-text-secondary">
                        Access comprehensive project management standards, compare methodologies, and gain insights to elevate your project management skills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold reddit-text-primary mb-4">
            Powerful Features
          </h2>
          <p className="reddit-text-secondary fs-4">
            Everything you need to master project management standards
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card reddit-fade-in">
            <FaSearch className="feature-icon" />
            <h3 className="feature-title">Smart Search</h3>
            <p className="feature-description">
              Find relevant sections across all standards with AI-powered search capabilities that understand context and meaning.
            </p>
          </div>

          <div className="feature-card reddit-fade-in" style={{animationDelay: '0.1s'}}>
            <FaChartBar className="feature-icon" />
            <h3 className="feature-title">Analytics</h3>
            <p className="feature-description">
              Get comprehensive insights and comparisons between different standards with detailed analytics and visualizations.
            </p>
          </div>

          <div className="feature-card reddit-fade-in" style={{animationDelay: '0.2s'}}>
            <FaBalanceScale className="feature-icon" />
            <h3 className="feature-title">Compare</h3>
            <p className="feature-description">
              Side-by-side comparison of different standards and methodologies to understand their unique approaches.
            </p>
          </div>

          <div className="feature-card reddit-fade-in" style={{animationDelay: '0.3s'}}>
            <FaBook className="feature-icon" />
            <h3 className="feature-title">Comprehensive</h3>
            <p className="feature-description">
              Access multiple project management standards in one unified platform with consistent navigation and search.
            </p>
          </div>

          <div className="feature-card reddit-fade-in" style={{animationDelay: '0.4s'}}>
            <FaUsers className="feature-icon" />
            <h3 className="feature-title">Community</h3>
            <p className="feature-description">
              Join a community of project management professionals sharing insights and best practices.
            </p>
          </div>

          <div className="feature-card reddit-fade-in" style={{animationDelay: '0.5s'}}>
            <FaLightbulb className="feature-icon" />
            <h3 className="feature-title">Insights</h3>
            <p className="feature-description">
              Discover patterns, trends, and insights across different project management methodologies and standards.
            </p>
          </div>
        </div>
      </div>

      {/* Standards Preview */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold reddit-text-primary mb-4">
            Popular Standards
          </h2>
          <p className="reddit-text-secondary fs-4">
            Explore the most widely used project management standards
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="reddit-card reddit-fade-in">
              <div className="reddit-card-body text-center">
                <FaBook className="display-4 reddit-text-primary mb-3" style={{color: 'var(--reddit-orange)'}} />
                <h3 className="h4 fw-bold reddit-text-primary mb-3">PMBOK</h3>
                <p className="reddit-text-secondary mb-4">
                  Project Management Body of Knowledge - The most widely used project management standard globally.
                </p>
                <Link to="/standards" className="btn-reddit-secondary btn-sm">
                  <FaArrowRight className="me-1" />
                  Explore
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="reddit-card reddit-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="reddit-card-body text-center">
                <span className="display-4 reddit-text-primary mb-3" role="img" aria-label="globe" style={{color: 'var(--reddit-blue)'}}>🌐</span>
                <h3 className="h4 fw-bold reddit-text-primary mb-3">ISO 21500</h3>
                <p className="reddit-text-secondary mb-4">
                  International standard providing guidance on project management concepts and processes.
                </p>
                <Link to="/standards" className="btn-reddit-secondary btn-sm">
                  <FaArrowRight className="me-1" />
                  Explore
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="reddit-card reddit-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="reddit-card-body text-center">
                <span className="display-4 reddit-text-primary mb-3" role="img" aria-label="crown" style={{color: 'var(--reddit-orange)'}}>👑</span>
                <h3 className="h4 fw-bold reddit-text-primary mb-3">PRINCE2</h3>
                <p className="reddit-text-secondary mb-4">
                  Structured project management method that can be applied to any type of project.
                </p>
                <Link to="/standards" className="btn-reddit-secondary btn-sm">
                  <FaArrowRight className="me-1" />
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-5">
        <div className="reddit-card reddit-fade-in">
          <div className="reddit-card-body text-center">
            <h2 className="display-5 fw-bold reddit-text-primary mb-4">
              Ready to Get Started?
            </h2>
            <p className="reddit-text-secondary fs-4 mb-5">
              Join thousands of project managers who use PMInsight to master their craft
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/standards" className="btn-reddit btn-lg">
                <FaRocket className="me-2" />
                Start Exploring
              </Link>
              <Link to="/tutorial" className="btn-reddit-outline btn-lg">
                <FaPlay className="me-2" />
                Watch Tutorial
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="reddit-nav mt-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="reddit-nav-brand">
                <FaRocket />
                PMInsight
              </div>
              <p className="reddit-text-secondary mb-0 mt-2">
                Your comprehensive project management standards platform
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="reddit-nav-links">
                <Link to="/standards" className="reddit-nav-link">
                  <FaBook className="me-1" />
                  Standards
                </Link>
                <Link to="/insights" className="reddit-nav-link">
                  <FaChartBar className="me-1" />
                  Insights
                </Link>
                <Link to="/tutorial" className="reddit-nav-link">
                  <FaPlay className="me-1" />
                  Tutorial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;