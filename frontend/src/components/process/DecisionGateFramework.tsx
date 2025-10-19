import React, { useState, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaArrowRight, FaInfoCircle, FaBook } from 'react-icons/fa';
import type { Phase } from '../../services/api';

interface DecisionGateFrameworkProps {
  phases: Phase[];
  onGateClick?: (gate: DecisionGate) => void;
  showEvidence?: boolean;
  showCriteria?: boolean;
  compact?: boolean;
}

interface DecisionGate {
  id: string;
  name: string;
  phase: string;
  description: string;
  criteria: string[];
  deliverables: string[];
  evidence: string[];
  status: 'pending' | 'in-progress' | 'passed' | 'failed';
  dependencies: string[];
}

const DecisionGateFramework: React.FC<DecisionGateFrameworkProps> = ({
  phases,
  onGateClick,
  showEvidence = true,
  showCriteria = true,
  compact = false
}) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const decisionGates = useMemo(() => {
    const gates: DecisionGate[] = [];
    
    phases.forEach((phase, phaseIndex) => {
      // Phase-level gates
      const phaseGate: DecisionGate = {
        id: `phase-${phaseIndex}`,
        name: `${phase.name} Gate`,
        phase: phase.name,
        description: `Decision gate for ${phase.name} phase completion`,
        criteria: [
          `All ${phase.name} activities completed`,
          `Deliverables meet quality standards`,
          `Stakeholder approval obtained`,
          `Ready to proceed to next phase`
        ],
        deliverables: phase.activities.flatMap(activity => activity.deliverables || []),
        evidence: phase.activities.flatMap(activity => 
          activity.citations?.map(citation => `${citation.standard} ${citation.section}`) || []
        ),
        status: phaseIndex === 0 ? 'passed' : 'pending',
        dependencies: phaseIndex > 0 ? [`phase-${phaseIndex - 1}`] : []
      };
      gates.push(phaseGate);
      
      // Activity-level gates for critical activities
      phase.activities.forEach((activity, activityIndex) => {
        if (activity.name.toLowerCase().includes('review') || 
            activity.name.toLowerCase().includes('approval') ||
            activity.name.toLowerCase().includes('sign-off') ||
            activity.name.toLowerCase().includes('decision')) {
          const activityGate: DecisionGate = {
            id: `activity-${phaseIndex}-${activityIndex}`,
            name: `${activity.name} Gate`,
            phase: phase.name,
            description: activity.description,
            criteria: [
              `Activity deliverables completed`,
              `Quality standards met`,
              `Stakeholder approval obtained`
            ],
            deliverables: activity.deliverables || [],
            evidence: activity.citations?.map(citation => `${citation.standard} ${citation.section}`) || [],
            status: 'pending',
            dependencies: [`phase-${phaseIndex}`]
          };
          gates.push(activityGate);
        }
      });
    });
    
    return gates;
  }, [phases]);

  const getGateStatusIcon = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return <FaCheckCircle className="text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'in-progress':
        return <FaQuestionCircle className="text-yellow-500" />;
      default:
        return <FaQuestionCircle className="text-gray-400" />;
    }
  };

  const getGateStatusColor = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'in-progress':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getGateStatusText = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const handleGateClick = (gate: DecisionGate) => {
    setSelectedGate(selectedGate === gate.id ? null : gate.id);
    onGateClick?.(gate);
  };

  if (compact) {
    return (
      <div className="decision-gate-framework-compact">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Decision Gates</h3>
          <div className="space-y-2">
            {decisionGates.map((gate) => (
              <div
                key={gate.id}
                className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getGateStatusColor(gate.status)}`}
                onClick={() => handleGateClick(gate)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getGateStatusIcon(gate.status)}
                    <div>
                      <h4 className="font-medium">{gate.name}</h4>
                      <p className="text-sm opacity-75">{gate.phase}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {getGateStatusText(gate.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="decision-gate-framework">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Decision Gate Framework</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {decisionGates.map((gate) => (
            <div
              key={gate.id}
              className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                selectedGate === gate.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleGateClick(gate)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getGateStatusIcon(gate.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{gate.name}</h4>
                    <p className="text-sm text-gray-600">{gate.phase}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGateStatusColor(gate.status)}`}>
                  {getGateStatusText(gate.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{gate.description}</p>
              
              {showCriteria && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Criteria:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {gate.criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <FaInfoCircle />
                    <span>{gate.deliverables.length} deliverables</span>
                  </span>
                  {showEvidence && (
                    <span className="flex items-center space-x-1">
                      <FaBook />
                      <span>{gate.evidence.length} citations</span>
                    </span>
                  )}
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedGate && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {decisionGates.find(g => g.id === selectedGate)?.name} - Details
            </h4>
            <button
              onClick={() => setSelectedGate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          {(() => {
            const gate = decisionGates.find(g => g.id === selectedGate);
            if (!gate) return null;
            
            return (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-sm text-gray-700">{gate.description}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Criteria</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {gate.criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {gate.deliverables.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Deliverables</h5>
                    <div className="flex flex-wrap gap-2">
                      {gate.deliverables.map((deliverable, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {showEvidence && gate.evidence.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Evidence</h5>
                    <div className="flex flex-wrap gap-2">
                      {gate.evidence.map((evidence, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {evidence}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {gate.dependencies.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Dependencies</h5>
                    <div className="flex flex-wrap gap-2">
                      {gate.dependencies.map((dependency, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {dependency}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DecisionGateFramework;
