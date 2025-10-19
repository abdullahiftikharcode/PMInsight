import React from 'react';
import { FaChevronRight, FaCheckCircle, FaClock, FaUsers, FaBook } from 'react-icons/fa';

interface ScenarioSelectorProps {
  onScenarioSelect: (scenario: string) => void;
  selectedScenario?: string;
  showDetails?: boolean;
  compact?: boolean;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  characteristics: string[];
  duration: string;
  teamSize: string;
  lifecycle: string;
  complexity: 'low' | 'medium' | 'high';
}

const scenarios: Scenario[] = [
  {
    id: 'custom-software',
    name: 'Custom Software Development',
    description: 'Well-defined requirements, <6 months, <7 team members',
    icon: '💻',
    features: ['Agile methodology', 'Rapid delivery', 'Team autonomy', 'Continuous integration'],
    characteristics: ['Well-defined requirements', 'Small team size', 'Short duration', 'High flexibility needed'],
    duration: '<6 months',
    teamSize: '<7 members',
    lifecycle: 'Agile',
    complexity: 'low'
  },
  {
    id: 'innovative-product',
    name: 'Innovative Product Development',
    description: 'R&D-heavy, uncertain outcomes, ~1 year duration',
    icon: '🔬',
    features: ['Hybrid approach', 'Stakeholder management', 'Risk management', 'Innovation focus'],
    characteristics: ['High uncertainty and risk', 'Research and development focus', 'Innovation-driven', 'Stakeholder management critical'],
    duration: '~1 year',
    teamSize: '8-15 members',
    lifecycle: 'Hybrid',
    complexity: 'high'
  },
  {
    id: 'government-project',
    name: 'Large Government Project',
    description: 'Civil, electrical, and IT components, 2-year duration',
    icon: '🏛️',
    features: ['Governance', 'Compliance', 'Multi-stakeholder', 'Public accountability'],
    characteristics: ['Complex multi-stakeholder environment', 'Regulatory compliance requirements', 'Public accountability', 'Long duration'],
    duration: '2 years',
    teamSize: '20+ members',
    lifecycle: 'Predictive',
    complexity: 'high'
  }
];

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onScenarioSelect,
  selectedScenario,
  showDetails = true,
  compact = false
}) => {

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (compact) {
    return (
      <div className="scenario-selector-compact">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onScenarioSelect(scenario.id)}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(scenario.complexity)}`}>
                  {getComplexityIcon(scenario.complexity)} {scenario.complexity.toUpperCase()}
                </span>
                <span className="text-gray-500">{scenario.lifecycle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="scenario-selector">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <h2 className="display-6 fw-bold reddit-text-primary mb-3">
            Select Project Scenario
          </h2>
          <p className="reddit-text-secondary mb-0">
            Choose the scenario that best matches your project requirements. Each scenario is optimized for specific project types and constraints.
          </p>
        </div>
      </div>
      
      <div className="row g-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="col-lg-4">
            <div
              className={`reddit-card scenario-card h-100 ${
                selectedScenario === scenario.id ? 'selected' : ''
              }`}
              onClick={() => onScenarioSelect(scenario.id)}
              style={{cursor: 'pointer'}}
            >
              <div className="reddit-card-body">
                {/* Selection Indicator */}
                {selectedScenario === scenario.id && (
                  <div className="position-absolute top-0 end-0 p-2">
                    <FaCheckCircle className="text-success fs-4" />
                  </div>
                )}
                
                {/* Scenario Header */}
                <div className="d-flex align-items-center mb-3">
                  <span className="fs-1 me-3">{scenario.icon}</span>
                  <div>
                    <h3 className="h4 fw-bold reddit-text-primary mb-1">{scenario.name}</h3>
                    <p className="reddit-text-secondary small mb-0">{scenario.description}</p>
                  </div>
                </div>
            
                {/* Scenario Stats */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <FaClock className="reddit-text-muted me-2" />
                      <span className="reddit-text-secondary small">{scenario.duration}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <FaUsers className="reddit-text-muted me-2" />
                      <span className="reddit-text-secondary small">{scenario.teamSize}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <FaBook className="reddit-text-muted me-2" />
                      <span className="reddit-text-secondary small">{scenario.lifecycle}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <span className={`badge ${getComplexityColor(scenario.complexity)}`}>
                      {getComplexityIcon(scenario.complexity)} {scenario.complexity.toUpperCase()}
                    </span>
                  </div>
                </div>
            
                {/* Features */}
                <div className="mb-3">
                  <h5 className="reddit-text-primary small mb-2">Key Features:</h5>
                  <div className="d-flex flex-wrap gap-1">
                    {scenario.features.map((feature, index) => (
                      <span key={index} className="badge bg-secondary text-dark small">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Characteristics */}
                {showDetails && (
                  <div className="mb-3">
                    <h5 className="reddit-text-primary small mb-2">Characteristics:</h5>
                    <ul className="reddit-text-secondary small mb-0">
                      {scenario.characteristics.map((characteristic, index) => (
                        <li key={index} className="mb-1">
                          {characteristic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            
                {/* Action Button */}
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="reddit-text-muted small">
                    {selectedScenario === scenario.id ? 'Selected' : 'Click to select'}
                  </span>
                  <FaChevronRight className={`reddit-text-muted transition-transform ${
                    selectedScenario === scenario.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Selection Summary */}
      {selectedScenario && (
        <div className="reddit-card mt-4">
          <div className="reddit-card-body">
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success me-3 fs-4" />
              <div>
                <h4 className="reddit-text-primary mb-1">
                  {scenarios.find(s => s.id === selectedScenario)?.name} Selected
                </h4>
                <p className="reddit-text-secondary small mb-0">
                  {scenarios.find(s => s.id === selectedScenario)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;
