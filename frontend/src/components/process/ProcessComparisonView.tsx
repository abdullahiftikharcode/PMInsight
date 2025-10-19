import React from 'react';
import { FaBook, FaTasks, FaUsers } from 'react-icons/fa';
import type { Phase } from '../../services/api';

interface ProcessComparisonViewProps {
  processes: {
    scenario: string;
    name: string;
    phases: Phase[];
    evidence: {
      totalCitations: number;
      standardsCoverage: {
        PMBOK: number;
        PRINCE2: number;
        ISO21500: number;
        ISO21502: number;
      };
      confidenceScore: number;
      qualityMetrics: {
        completeness: number;
        accuracy: number;
        relevance: number;
      };
    };
  }[];
}

const ProcessComparisonView: React.FC<ProcessComparisonViewProps> = ({
  processes
}) => {

  const getScenarioIcon = (scenario: string) => {
    const icons = {
      'custom-software': '💻',
      'innovative-product': '🔬',
      'government-project': '🏛️'
    };
    return icons[scenario as keyof typeof icons] || '📋';
  };


  if (processes.length === 0) {
    return (
      <div className="process-comparison">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Comparison</h3>
          <p className="text-gray-600">No processes available for comparison.</p>
        </div>
      </div>
    );
  }

  if (processes.length === 1) {
    const process = processes[0];
    return (
      <div className="process-comparison">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Details</h3>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getScenarioIcon(process.scenario)}</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{process.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{process.scenario.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaTasks className="text-blue-600" />
                  <span className="font-medium text-blue-900">Phases</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">{process.phases.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaBook className="text-green-600" />
                  <span className="font-medium text-green-900">Citations</span>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">{process.evidence.totalCitations}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-purple-600" />
                  <span className="font-medium text-purple-900">Confidence</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {Math.round(process.evidence.confidenceScore * 100)}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Process Phases:</h5>
              {process.phases.map((phase, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-gray-900">{phase.name}</h6>
                    <span className="text-sm text-gray-600">{phase.activities?.length || 0} activities</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple processes comparison
  const allPhases = Array.from(new Set(
    processes.flatMap(p => p.phases.map(phase => phase.name))
  ));

  const commonPhases = allPhases.filter(phase =>
    processes.every(process => process.phases.some(p => p.name === phase))
  );

  return (
    <div className="process-comparison">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Comparison</h3>
        <p className="text-gray-600">Comparing {processes.length} processes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {processes.map((process, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getScenarioIcon(process.scenario)}</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{process.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{process.scenario.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{process.phases.length}</div>
                <div className="text-sm text-gray-600">Phases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{process.evidence.totalCitations}</div>
                <div className="text-sm text-gray-600">Citations</div>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium text-gray-900">Phases:</h6>
              {process.phases.map((phase, phaseIndex) => (
                <div key={phaseIndex} className="text-sm text-gray-600">
                  • {phase.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Common Phases ({commonPhases.length})</h5>
            <div className="space-y-1">
              {commonPhases.map((phase, index) => (
                <div key={index} className="text-sm text-green-600">✓ {phase}</div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Unique Phases</h5>
            <div className="space-y-1">
              {processes.map((process, index) => {
                const uniquePhases = process.phases.filter(phase =>
                  !commonPhases.includes(phase.name)
                );
                return uniquePhases.length > 0 ? (
                  <div key={index} className="text-sm text-gray-600">
                    <strong>{process.name}:</strong> {uniquePhases.map(p => p.name).join(', ')}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessComparisonView;