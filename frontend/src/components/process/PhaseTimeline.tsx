import React, { useState } from 'react';
import { FaClock, FaTasks, FaBook } from 'react-icons/fa';
import type { Phase, Activity } from '../../services/api';

interface PhaseTimelineProps {
  phases: Phase[];
  onPhaseClick?: (phase: Phase) => void;
  onActivityClick?: (activity: Activity) => void;
  showDuration?: boolean;
  showActivityCount?: boolean;
  showEvidence?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({
  phases,
  onPhaseClick,
  onActivityClick,
  showDuration = true,
  showActivityCount = true,
  orientation = 'horizontal'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(selectedPhase === phase.name ? null : phase.name);
    onPhaseClick?.(phase);
  };

  const getPhaseColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  const getPhaseIcon = (phaseName: string) => {
    const name = phaseName.toLowerCase();
    if (name.includes('initiate') || name.includes('start')) return '🚀';
    if (name.includes('plan')) return '📋';
    if (name.includes('execute') || name.includes('build')) return '⚡';
    if (name.includes('monitor') || name.includes('control')) return '👁️';
    if (name.includes('close') || name.includes('end')) return '🏁';
    if (name.includes('sprint')) return '🏃';
    if (name.includes('review')) return '🔄';
    return '📝';
  };

  const calculatePhaseProgress = (phase: Phase) => {
    // Simple progress calculation based on activities with citations
    if (!phase.activities.length) return 0;
    const activitiesWithCitations = phase.activities.filter(activity => 
      activity.citations && activity.citations.length > 0
    ).length;
    return (activitiesWithCitations / phase.activities.length) * 100;
  };

  if (orientation === 'vertical') {
    return (
      <div className="phase-timeline-vertical">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          
          {phases.map((phase, index) => {
            const progress = calculatePhaseProgress(phase);
            const isSelected = selectedPhase === phase.name;
            
            return (
              <div key={index} className="relative flex items-start mb-8">
                {/* Phase Node */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${getPhaseColor(index)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  <span>{getPhaseIcon(phase.name)}</span>
                </div>
                
                {/* Phase Content */}
                <div className="ml-6 flex-1">
                  <div 
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePhaseClick(phase)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        {showDuration && phase.duration && (
                          <span className="flex items-center space-x-1">
                            <FaClock />
                            <span>{phase.duration}</span>
                          </span>
                        )}
                        {showActivityCount && (
                          <span className="flex items-center space-x-1">
                            <FaTasks />
                            <span>{phase.activities.length}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Evidence Coverage</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPhaseColor(index)}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Phase Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Activities:</span>
                        <span className="ml-2 font-medium">{phase.activities.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Evidence:</span>
                        <span className="ml-2 font-medium">
                          {phase.activities.reduce((sum, activity) => 
                            sum + (activity.citations?.length || 0), 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Phase Activities */}
                  {isSelected && (
                    <div className="mt-4 ml-6 space-y-2">
                      {phase.activities.map((activity, activityIndex) => (
                        <div 
                          key={activityIndex}
                          className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => onActivityClick?.(activity)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{activity.name}</h4>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              {activity.duration && (
                                <span className="flex items-center space-x-1">
                                  <FaClock />
                                  <span>{activity.duration}</span>
                                </span>
                              )}
                              {activity.citations && activity.citations.length > 0 && (
                                <span className="flex items-center space-x-1 text-blue-600">
                                  <FaBook />
                                  <span>{activity.citations.length}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className="phase-timeline-horizontal">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300"></div>
        
        <div className="flex justify-between">
          {phases.map((phase, index) => {
            const progress = calculatePhaseProgress(phase);
            const isSelected = selectedPhase === phase.name;
            
            return (
              <div key={index} className="relative flex flex-col items-center">
                {/* Phase Node */}
                <div className={`relative z-10 w-12 h-12 rounded-full ${getPhaseColor(index)} flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer hover:scale-110 transition-transform`}>
                  <span>{getPhaseIcon(phase.name)}</span>
                </div>
                
                {/* Phase Content */}
                <div className="mt-4 w-64">
                  <div 
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePhaseClick(phase)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{phase.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Evidence</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPhaseColor(index)}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Phase Stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <FaTasks className="text-gray-400" />
                        <span className="text-gray-500">{phase.activities.length}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaBook className="text-blue-500" />
                        <span className="text-gray-500">
                          {phase.activities.reduce((sum, activity) => 
                            sum + (activity.citations?.length || 0), 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Phase Activities */}
                  {isSelected && (
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                      {phase.activities.map((activity, activityIndex) => (
                        <div 
                          key={activityIndex}
                          className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => onActivityClick?.(activity)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{activity.name}</h4>
                              <p className="text-xs text-gray-600">{activity.description}</p>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {activity.citations && activity.citations.length > 0 && (
                                <span className="flex items-center space-x-1 text-blue-600">
                                  <FaBook />
                                  <span>{activity.citations.length}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhaseTimeline;
