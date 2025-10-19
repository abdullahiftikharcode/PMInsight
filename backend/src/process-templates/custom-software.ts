import { ProcessTemplate, Phase, Activity, Citation } from './types';

export const customSoftwareTemplate: ProcessTemplate = {
  scenario: 'custom-software',
  name: 'Custom Software Development Project',
  description: 'Well-defined requirements, <6 months, <7 team members',
  lifecycle: 'agile',
  duration: '<6 months',
  teamSize: '<7 members',
  characteristics: [
    'Well-defined requirements',
    'Small team size',
    'Short duration',
    'High flexibility needed',
    'Rapid delivery focus'
  ],
  phases: [
    {
      name: 'Envision',
      description: 'Define product vision and initial requirements',
      duration: '1-2 weeks',
      activities: [
        {
          name: 'Define Product Vision',
          description: 'Create a clear product vision statement',
          deliverables: ['Product Vision Statement', 'User Stories', 'Product Roadmap'],
          duration: '2-3 days',
          roles: ['Product Owner', 'Stakeholders'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.1.1',
              title: 'Project Charter',
              justification: 'PMBOK emphasizes the importance of a clear project charter and vision statement for project success'
            },
            {
              standard: 'PRINCE2',
              section: 'SU1',
              title: 'Starting up a Project',
              justification: 'PRINCE2 Starting Up process ensures proper project initiation with clear objectives'
            }
          ]
        },
        {
          name: 'Stakeholder Analysis',
          description: 'Identify and analyze project stakeholders',
          deliverables: ['Stakeholder Register', 'Communication Plan'],
          duration: '1-2 days',
          roles: ['Project Manager', 'Product Owner'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.1',
              title: 'Identify Stakeholders',
              justification: 'PMBOK provides comprehensive stakeholder identification and analysis techniques'
            },
            {
              standard: 'ISO 21502',
              section: '5.2.3',
              title: 'Stakeholder Management',
              justification: 'ISO 21502 emphasizes stakeholder engagement throughout the project lifecycle'
            }
          ]
        }
      ]
    },
    {
      name: 'Backlog & Planning',
      description: 'Create and prioritize product backlog',
      duration: '1-2 weeks',
      activities: [
        {
          name: 'Create Product Backlog',
          description: 'Develop prioritized list of features and requirements',
          deliverables: ['Product Backlog', 'User Stories', 'Acceptance Criteria'],
          duration: '3-5 days',
          roles: ['Product Owner', 'Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.1',
              title: 'Plan Scope Management',
              justification: 'PMBOK scope management provides structure for backlog creation and management'
            },
            {
              standard: 'PRINCE2',
              section: 'PL1',
              title: 'Planning',
              justification: 'PRINCE2 planning process ensures comprehensive project planning'
            }
          ]
        },
        {
          name: 'Sprint Planning',
          description: 'Plan individual sprints with detailed tasks',
          deliverables: ['Sprint Backlog', 'Sprint Goals', 'Task Estimates'],
          duration: '1-2 days',
          roles: ['Scrum Master', 'Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '6.1',
              title: 'Plan Schedule Management',
              justification: 'PMBOK schedule management principles apply to sprint planning'
            }
          ]
        }
      ]
    },
    {
      name: 'Sprints',
      description: 'Iterative development cycles',
      duration: '8-12 weeks',
      activities: [
        {
          name: 'Daily Standups',
          description: 'Daily team synchronization meetings',
          deliverables: ['Daily Updates', 'Impediment Log'],
          duration: '15 minutes daily',
          roles: ['Development Team', 'Scrum Master'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.3',
              title: 'Direct and Manage Project Work',
              justification: 'PMBOK emphasizes regular communication and progress monitoring'
            }
          ]
        },
        {
          name: 'Sprint Development',
          description: 'Develop features according to sprint backlog',
          deliverables: ['Working Software', 'Code Reviews', 'Unit Tests'],
          duration: '1-2 weeks per sprint',
          roles: ['Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.3',
              title: 'Direct and Manage Project Work',
              justification: 'PMBOK execution processes guide development work'
            },
            {
              standard: 'ISO 21502',
              section: '6.3',
              title: 'Project Execution',
              justification: 'ISO 21502 provides guidance on project execution activities'
            }
          ]
        },
        {
          name: 'Sprint Review',
          description: 'Demonstrate completed work to stakeholders',
          deliverables: ['Sprint Demo', 'Stakeholder Feedback'],
          duration: '1-2 hours',
          roles: ['Development Team', 'Stakeholders'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.5',
              title: 'Validate Scope',
              justification: 'PMBOK scope validation ensures deliverables meet requirements'
            }
          ]
        }
      ]
    },
    {
      name: 'Review & Retrospective',
      description: 'Continuous improvement and learning',
      duration: 'Ongoing',
      activities: [
        {
          name: 'Sprint Retrospective',
          description: 'Team reflection and process improvement',
          deliverables: ['Retrospective Notes', 'Action Items'],
          duration: '1-2 hours',
          roles: ['Development Team', 'Scrum Master'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.4',
              title: 'Monitor and Control Project Work',
              justification: 'PMBOK monitoring processes support continuous improvement'
            }
          ]
        },
        {
          name: 'Process Improvement',
          description: 'Implement improvements based on retrospectives',
          deliverables: ['Process Updates', 'Team Agreements'],
          duration: 'Ongoing',
          roles: ['Development Team', 'Scrum Master'],
          citations: [
            {
              standard: 'ISO 21502',
              section: '7.4',
              title: 'Project Closure',
              justification: 'ISO 21502 emphasizes learning and improvement throughout the project'
            }
          ]
        }
      ]
    },
    {
      name: 'Release/Close',
      description: 'Final delivery and project closure',
      duration: '1-2 weeks',
      activities: [
        {
          name: 'Final Testing',
          description: 'Comprehensive testing of the complete system',
          deliverables: ['Test Results', 'Bug Reports', 'Quality Metrics'],
          duration: '3-5 days',
          roles: ['QA Team', 'Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '8.3',
              title: 'Control Quality',
              justification: 'PMBOK quality control ensures deliverables meet standards'
            },
            {
              standard: 'ISO 21502',
              section: '6.4',
              title: 'Project Control',
              justification: 'ISO 21502 provides guidance on project control activities'
            }
          ]
        },
        {
          name: 'Deployment',
          description: 'Deploy software to production environment',
          deliverables: ['Deployed Software', 'Deployment Documentation', 'User Training'],
          duration: '2-3 days',
          roles: ['DevOps Team', 'Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK project closure ensures proper handover and deployment'
            }
          ]
        },
        {
          name: 'Project Closure',
          description: 'Formal project closure and lessons learned',
          deliverables: ['Project Closure Report', 'Lessons Learned', 'Team Recognition'],
          duration: '1-2 days',
          roles: ['Project Manager', 'All Team Members'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK provides comprehensive project closure guidance'
            },
            {
              standard: 'PRINCE2',
              section: 'CP1',
              title: 'Closing a Project',
              justification: 'PRINCE2 closing process ensures proper project closure'
            }
          ]
        }
      ]
    }
  ],
  tailoring: {
    rationale: 'This process is tailored for small, agile software development teams with well-defined requirements. Key tailoring decisions include:',
    decisions: [
      'Emphasized agile methodologies over traditional waterfall approaches',
      'Reduced documentation overhead for faster delivery',
      'Focused on continuous integration and deployment',
      'Simplified governance structure for small teams',
      'Integrated quality assurance throughout development cycles'
    ],
    omitted: [
      'Complex governance structures (not needed for small teams)',
      'Extensive documentation requirements (agile focus)',
      'Formal change control processes (agile flexibility)',
      'Detailed risk management processes (smaller risk profile)'
    ]
  }
};
