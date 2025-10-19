import React, { useState, useMemo } from 'react';
import { FaTasks, FaBook, FaClock } from 'react-icons/fa';
import type { Phase, Activity } from '../../services/api';

interface RoleResponsibilityMatrixProps {
  phases: Phase[];
  onRoleClick?: (role: string) => void;
  onActivityClick?: (activity: Activity) => void;
  showEvidence?: boolean;
  showDuration?: boolean;
  compact?: boolean;
}

interface RoleData {
  role: string;
  activities: Activity[];
  totalActivities: number;
  phases: string[];
  evidenceCount: number;
  averageDuration: string;
}

const RoleResponsibilityMatrix: React.FC<RoleResponsibilityMatrixProps> = ({
  phases,
  onRoleClick,
  onActivityClick,
  showEvidence = true,
  compact = false
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'activities' | 'evidence' | 'alphabetical'>('activities');

  const roleData = useMemo(() => {
    const roleMap = new Map<string, RoleData>();
    
    phases.forEach(phase => {
      phase.activities.forEach(activity => {
        if (activity.roles) {
          activity.roles.forEach(role => {
            if (!roleMap.has(role)) {
              roleMap.set(role, {
                role,
                activities: [],
                totalActivities: 0,
                phases: [],
                evidenceCount: 0,
                averageDuration: ''
              });
            }
            
            const roleData = roleMap.get(role)!;
            roleData.activities.push(activity);
            roleData.totalActivities++;
            
            if (!roleData.phases.includes(phase.name)) {
              roleData.phases.push(phase.name);
            }
            
            if (activity.citations) {
              roleData.evidenceCount += activity.citations.length;
            }
          });
        }
      });
    });
    
    return Array.from(roleMap.values());
  }, [phases]);

  const sortedRoleData = useMemo(() => {
    return [...roleData].sort((a, b) => {
      switch (sortBy) {
        case 'activities':
          return b.totalActivities - a.totalActivities;
        case 'evidence':
          return b.evidenceCount - a.evidenceCount;
        case 'alphabetical':
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });
  }, [roleData, sortBy]);

  const getRoleColor = (role: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800'
    ];
    const hash = role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getRoleIcon = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('manager')) return '👨‍💼';
    if (roleLower.includes('developer') || roleLower.includes('engineer')) return '👨‍💻';
    if (roleLower.includes('analyst')) return '📊';
    if (roleLower.includes('designer')) return '🎨';
    if (roleLower.includes('tester') || roleLower.includes('qa')) return '🧪';
    if (roleLower.includes('architect')) return '🏗️';
    if (roleLower.includes('lead')) return '👑';
    if (roleLower.includes('owner')) return '👤';
    return '👤';
  };

  const handleRoleClick = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
    onRoleClick?.(role);
  };

  if (compact) {
    return (
      <div className="role-responsibility-matrix-compact">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Overview</h3>
          <div className="flex flex-wrap gap-2">
            {sortedRoleData.map((roleData) => (
              <div
                key={roleData.role}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(roleData.role)} cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => handleRoleClick(roleData.role)}
              >
                <span className="mr-1">{getRoleIcon(roleData.role)}</span>
                {roleData.role} ({roleData.totalActivities})
              </div>
            ))}
          </div>
        </div>
        
        {selectedRole && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              {getRoleIcon(selectedRole)} {selectedRole} - Activities
            </h4>
            <div className="space-y-2">
              {roleData.find(r => r.role === selectedRole)?.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onActivityClick?.(activity)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{activity.name}</h5>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
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
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="role-responsibility-matrix">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Role Responsibility Matrix</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="activities">Activities</option>
              <option value="evidence">Evidence</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRoleData.map((roleData) => (
            <div
              key={roleData.role}
              className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                selectedRole === roleData.role ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleRoleClick(roleData.role)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getRoleIcon(roleData.role)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{roleData.role}</h4>
                  <p className="text-sm text-gray-600">{roleData.phases.length} phases</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <FaTasks className="text-gray-400" />
                  <span className="text-gray-600">{roleData.totalActivities} activities</span>
                </div>
                {showEvidence && (
                  <div className="flex items-center space-x-2">
                    <FaBook className="text-blue-500" />
                    <span className="text-gray-600">{roleData.evidenceCount} citations</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {roleData.phases.map((phase, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {phase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedRole && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {getRoleIcon(selectedRole)} {selectedRole} - Detailed Activities
            </h4>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {roleData.find(r => r.role === selectedRole)?.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onActivityClick?.(activity)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 mb-1">{activity.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    
                    {activity.deliverables && activity.deliverables.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">Deliverables:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activity.deliverables.map((deliverable, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {deliverable}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {showEvidence && activity.citations && activity.citations.length > 0 && (
                      <div>
                        <span className="text-xs text-gray-500">Evidence:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {activity.citations.map((citation, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {citation.standard} {citation.section}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500 ml-4">
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
        </div>
      )}
    </div>
  );
};

export default RoleResponsibilityMatrix;
