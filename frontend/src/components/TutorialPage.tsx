import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaBook, 
  FaSearch, 
  FaChartBar, 
  FaArrowRight,
  FaArrowLeft,
  FaPlay,
  FaHome,
  FaCheckCircle,
  FaGlobe,
  FaCrown,
  FaBalanceScale,
  FaCog,
  FaUsers
} from 'react-icons/fa';

const TutorialPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to PMInsight",
      description: "Learn how to navigate and use our comprehensive project management standards platform.",
      icon: <FaRocket />,
      content: (
        <div className="tutorial-content">
          <h3 className="h4 fw-bold reddit-text-primary mb-4">What is PMInsight?</h3>
          <p className="reddit-text-secondary mb-4">
            PMInsight is your comprehensive platform for exploring, comparing, and analyzing 
            project management standards like PMBOK, ISO 21500, PRINCE2, and more.
          </p>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="reddit-card">
                <div className="reddit-card-body">
                  <FaBook className="reddit-text-primary mb-2" style={{color: 'var(--reddit-orange)'}} />
                  <h5>Standards Library</h5>
                  <p className="reddit-text-secondary small">Access multiple PM standards in one place</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="reddit-card">
                <div className="reddit-card-body">
                  <FaSearch className="reddit-text-primary mb-2" style={{color: 'var(--reddit-blue)'}} />
                  <h5>Smart Search</h5>
                  <p className="reddit-text-secondary small">Find relevant content across all standards</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="reddit-card">
                <div className="reddit-card-body">
                  <FaChartBar className="reddit-text-primary mb-2" style={{color: 'var(--reddit-orange)'}} />
                  <h5>Analytics</h5>
                  <p className="reddit-text-secondary small">Get insights and comparisons</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="reddit-card">
                <div className="reddit-card-body">
                  <FaBalanceScale className="reddit-text-primary mb-2" style={{color: 'var(--reddit-blue)'}} />
                  <h5>Compare</h5>
                  <p className="reddit-text-secondary small">Side-by-side standard comparisons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Search & Find",
      description: "Master the search functionality to find exactly what you're looking for.",
      icon: <FaSearch />,
      content: (
        <div className="tutorial-content">
          <h3 className="h4 fw-bold reddit-text-primary mb-4">Search Like a Pro</h3>
          <div className="search-tutorial">
            <div className="search-examples mb-4">
              <h5 className="fw-bold reddit-text-primary mb-3">Try these searches:</h5>
              <div className="search-tags">
                <span className="reddit-card d-inline-block me-2 mb-2">
                  <div className="reddit-card-body py-2 px-3">
                    <span className="reddit-text-secondary">risk management</span>
                  </div>
                </span>
                <span className="reddit-card d-inline-block me-2 mb-2">
                  <div className="reddit-card-body py-2 px-3">
                    <span className="reddit-text-secondary">stakeholder engagement</span>
                  </div>
                </span>
                <span className="reddit-card d-inline-block me-2 mb-2">
                  <div className="reddit-card-body py-2 px-3">
                    <span className="reddit-text-secondary">project planning</span>
                  </div>
                </span>
                <span className="reddit-card d-inline-block me-2 mb-2">
                  <div className="reddit-card-body py-2 px-3">
                    <span className="reddit-text-secondary">quality control</span>
                  </div>
                </span>
                <span className="reddit-card d-inline-block me-2 mb-2">
                  <div className="reddit-card-body py-2 px-3">
                    <span className="reddit-text-secondary">change management</span>
                  </div>
                </span>
              </div>
            </div>
            <div className="search-tips">
              <h5 className="fw-bold reddit-text-primary mb-3">Search Tips:</h5>
              <ul className="reddit-text-secondary">
                <li>Use specific terms for better results</li>
                <li>Search across all standards or within specific ones</li>
                <li>Results show similarity scores to help you find the most relevant content</li>
                <li>Click on results to jump directly to sections</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Insights & Analytics",
      description: "Discover how to use analytics to understand standards better.",
      icon: <FaChartBar />,
      content: (
        <div className="tutorial-content">
          <h3 className="h4 fw-bold reddit-text-primary mb-4">Understanding Analytics</h3>
          <div className="analytics-tutorial">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <div className="reddit-text-primary mb-2" style={{fontSize: '2rem'}}>📈</div>
                    <h5>Coverage Analysis</h5>
                    <p className="reddit-text-secondary small">See which topics are covered across different standards</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <div className="reddit-text-primary mb-2" style={{fontSize: '2rem'}}>📊</div>
                    <h5>Comparison Metrics</h5>
                    <p className="reddit-text-secondary small">Compare standards side-by-side with detailed metrics</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <div className="reddit-text-primary mb-2" style={{fontSize: '2rem'}}>🔍</div>
                    <h5>Topic Trends</h5>
                    <p className="reddit-text-secondary small">Identify trending topics and emerging practices</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <div className="reddit-text-primary mb-2" style={{fontSize: '2rem'}}>📋</div>
                    <h5>Standard Statistics</h5>
                    <p className="reddit-text-secondary small">View comprehensive statistics for each standard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Navigation & Features",
      description: "Learn how to navigate the platform and use all available features.",
      icon: <FaHome />,
      content: (
        <div className="tutorial-content">
          <h3 className="h4 fw-bold reddit-text-primary mb-4">Platform Navigation</h3>
          <div className="navigation-tutorial">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <h5 className="fw-bold reddit-text-primary mb-3">Sidebar Navigation</h5>
                    <ul className="reddit-text-secondary">
                      <li>Quick access to all standards</li>
                      <li>Search functionality</li>
                      <li>Table of contents for current standard</li>
                      <li>Bookmark management</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="reddit-card">
                  <div className="reddit-card-body">
                    <h5 className="fw-bold reddit-text-primary mb-3">Main Features</h5>
                    <ul className="reddit-text-secondary">
                      <li>Browse standards library</li>
                      <li>Search across all content</li>
                      <li>View detailed analytics</li>
                      <li>Compare standards side-by-side</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

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
          <Link to="/insights" className="reddit-sidebar-link">
            <FaChartBar className="me-2" />
            Analytics
          </Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Tutorial Steps</div>
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              className={`reddit-sidebar-link ${index === currentStep ? 'active' : ''}`}
              onClick={() => goToStep(index)}
            >
              <FaCheckCircle className="me-2" />
              Step {index + 1}
            </button>
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
            </div>
          </div>
        </div>

        <div className="reddit-content">
          {/* Progress Bar */}
          <div className="reddit-card reddit-fade-in mb-4">
            <div className="reddit-card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 fw-bold reddit-text-primary mb-0">Tutorial Progress</h2>
                <span className="reddit-text-secondary">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </span>
              </div>
              <div className="progress" style={{height: '8px'}}>
                <div 
                  className="progress-bar" 
                  style={{
                    width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
                    background: 'linear-gradient(135deg, var(--reddit-orange) 0%, var(--reddit-orange-light) 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tutorial Step */}
          <div className="reddit-card reddit-fade-in">
            <div className="reddit-card-header text-center">
              <div className="reddit-text-primary mb-3" style={{fontSize: '3rem', color: 'var(--reddit-orange)'}}>
                {tutorialSteps[currentStep].icon}
              </div>
              <h2 className="h3 fw-bold reddit-text-primary mb-3">
                {tutorialSteps[currentStep].title}
              </h2>
              <p className="reddit-text-secondary fs-5">
                {tutorialSteps[currentStep].description}
              </p>
            </div>

            <div className="reddit-card-body">
              {tutorialSteps[currentStep].content}
            </div>

            {/* Navigation */}
            <div className="reddit-card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="btn-reddit-outline"
                  style={{opacity: currentStep === 0 ? 0.5 : 1}}
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </button>

                <div className="reddit-text-secondary fw-bold">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </div>

                {currentStep < tutorialSteps.length - 1 ? (
                  <button onClick={nextStep} className="btn-reddit">
                    Next
                    <FaArrowRight className="ms-2" />
                  </button>
                ) : (
                  <Link to="/standards" className="btn-reddit">
                    Get Started
                    <FaRocket className="ms-2" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;