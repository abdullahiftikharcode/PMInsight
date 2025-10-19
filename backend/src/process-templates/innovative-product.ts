import { ProcessTemplate, Phase, Activity, Citation } from './types';

export const innovativeProductTemplate: ProcessTemplate = {
  scenario: 'innovative-product',
  name: 'Innovative Product Development Project',
  description: 'R&D-heavy, uncertain outcomes, ~1 year duration',
  lifecycle: 'hybrid',
  duration: '~1 year',
  teamSize: '8-15 members',
  characteristics: [
    'High uncertainty and risk',
    'Research and development focus',
    'Innovation-driven',
    'Stakeholder management critical',
    'Iterative learning approach'
  ],
  phases: [
    {
      name: 'Initiate',
      description: 'Project initiation with focus on innovation and uncertainty',
      duration: '2-3 weeks',
      activities: [
        {
          name: 'Innovation Assessment',
          description: 'Assess innovation potential and market opportunities',
          deliverables: ['Innovation Strategy', 'Market Analysis', 'Technology Assessment'],
          duration: '1 week',
          roles: ['Innovation Manager', 'Market Researcher', 'Technical Lead'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.1',
              title: 'Develop Project Charter',
              justification: 'PMBOK project charter development includes innovation and opportunity assessment'
            },
            {
              standard: 'ISO 21500',
              section: '4.2',
              title: 'Project Context',
              justification: 'ISO 21500 emphasizes understanding project context including innovation factors'
            }
          ]
        },
        {
          name: 'Stakeholder Engagement Strategy',
          description: 'Develop comprehensive stakeholder engagement plan',
          deliverables: ['Stakeholder Engagement Plan', 'Communication Strategy', 'Influence Map'],
          duration: '1 week',
          roles: ['Project Manager', 'Stakeholder Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.2',
              title: 'Plan Stakeholder Engagement',
              justification: 'PMBOK provides comprehensive stakeholder engagement planning for complex projects'
            },
            {
              standard: 'PRINCE2',
              section: 'SU2',
              title: 'Appointing the Executive and the Project Manager',
              justification: 'PRINCE2 emphasizes proper stakeholder roles and responsibilities'
            }
          ]
        },
        {
          name: 'Risk and Uncertainty Analysis',
          description: 'Comprehensive risk assessment for innovative project',
          deliverables: ['Risk Register', 'Uncertainty Analysis', 'Mitigation Strategies'],
          duration: '1 week',
          roles: ['Risk Manager', 'Project Manager', 'Technical Lead'],
          citations: [
            {
              standard: 'PMBOK',
              section: '11.1',
              title: 'Plan Risk Management',
              justification: 'PMBOK risk management is critical for innovative projects with high uncertainty'
            },
            {
              standard: 'ISO 21502',
              section: '6.2',
              title: 'Project Planning',
              justification: 'ISO 21502 planning includes comprehensive risk assessment'
            }
          ]
        }
      ]
    },
    {
      name: 'Plan',
      description: 'Adaptive planning for uncertain outcomes',
      duration: '3-4 weeks',
      activities: [
        {
          name: 'Adaptive Planning Framework',
          description: 'Create flexible planning approach for uncertain outcomes',
          deliverables: ['Adaptive Plan', 'Decision Points', 'Contingency Plans'],
          duration: '2 weeks',
          roles: ['Project Manager', 'Planning Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.1',
              title: 'Plan Scope Management',
              justification: 'PMBOK scope management adapts to changing requirements in innovative projects'
            },
            {
              standard: 'PRINCE2',
              section: 'PL1',
              title: 'Planning',
              justification: 'PRINCE2 planning process accommodates uncertainty and change'
            }
          ]
        },
        {
          name: 'Innovation Roadmap',
          description: 'Develop innovation-focused project roadmap',
          deliverables: ['Innovation Roadmap', 'Milestone Plan', 'Learning Objectives'],
          duration: '1 week',
          roles: ['Innovation Manager', 'Technical Lead'],
          citations: [
            {
              standard: 'ISO 21500',
              section: '5.1',
              title: 'Project Management Processes',
              justification: 'ISO 21500 processes support innovation and learning objectives'
            }
          ]
        },
        {
          name: 'Stakeholder Communication Plan',
          description: 'Develop detailed communication strategy for stakeholders',
          deliverables: ['Communication Plan', 'Reporting Schedule', 'Engagement Activities'],
          duration: '1 week',
          roles: ['Communication Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '10.1',
              title: 'Plan Communications Management',
              justification: 'PMBOK communication planning is essential for stakeholder management'
            }
          ]
        }
      ]
    },
    {
      name: 'Iterate & Build',
      description: 'Iterative development with continuous learning',
      duration: '6-8 months',
      activities: [
        {
          name: 'Research and Development Cycles',
          description: 'Conduct iterative R&D activities',
          deliverables: ['Research Results', 'Prototypes', 'Technical Documentation'],
          duration: '2-4 weeks per cycle',
          roles: ['Research Team', 'Technical Lead', 'Innovation Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.3',
              title: 'Direct and Manage Project Work',
              justification: 'PMBOK execution processes support iterative development'
            },
            {
              standard: 'ISO 21502',
              section: '6.3',
              title: 'Project Execution',
              justification: 'ISO 21502 execution guidance supports iterative approaches'
            }
          ]
        },
        {
          name: 'Stakeholder Feedback Loops',
          description: 'Regular stakeholder engagement and feedback collection',
          deliverables: ['Stakeholder Feedback', 'Requirement Updates', 'Priority Changes'],
          duration: 'Ongoing',
          roles: ['Stakeholder Manager', 'Product Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.3',
              title: 'Manage Stakeholder Engagement',
              justification: 'PMBOK stakeholder management supports continuous engagement'
            },
            {
              standard: 'PRINCE2',
              section: 'CS1',
              title: 'Controlling a Stage',
              justification: 'PRINCE2 stage control includes stakeholder management'
            }
          ]
        },
        {
          name: 'Risk Monitoring and Adaptation',
          description: 'Continuous risk monitoring and adaptive responses',
          deliverables: ['Risk Updates', 'Adaptation Plans', 'Decision Records'],
          duration: 'Ongoing',
          roles: ['Risk Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '11.6',
              title: 'Control Risks',
              justification: 'PMBOK risk control is essential for innovative projects'
            },
            {
              standard: 'ISO 21502',
              section: '6.4',
              title: 'Project Control',
              justification: 'ISO 21502 control processes support risk management'
            }
          ]
        },
        {
          name: 'Learning and Knowledge Management',
          description: 'Capture and share learning throughout the project',
          deliverables: ['Learning Logs', 'Knowledge Base', 'Best Practices'],
          duration: 'Ongoing',
          roles: ['Knowledge Manager', 'All Team Members'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.4',
              title: 'Monitor and Control Project Work',
              justification: 'PMBOK monitoring includes knowledge management'
            },
            {
              standard: 'ISO 21502',
              section: '7.4',
              title: 'Project Closure',
              justification: 'ISO 21502 emphasizes learning and knowledge transfer'
            }
          ]
        }
      ]
    },
    {
      name: 'Control & Assure',
      description: 'Quality assurance and project control',
      duration: 'Ongoing',
      activities: [
        {
          name: 'Quality Assurance',
          description: 'Comprehensive quality assurance for innovative deliverables',
          deliverables: ['Quality Reports', 'Test Results', 'Quality Metrics'],
          duration: 'Ongoing',
          roles: ['QA Manager', 'Technical Lead'],
          citations: [
            {
              standard: 'PMBOK',
              section: '8.2',
              title: 'Manage Quality',
              justification: 'PMBOK quality management ensures deliverable quality'
            },
            {
              standard: 'ISO 21502',
              section: '6.4',
              title: 'Project Control',
              justification: 'ISO 21502 control processes include quality assurance'
            }
          ]
        },
        {
          name: 'Stakeholder Assurance',
          description: 'Ensure stakeholder confidence and satisfaction',
          deliverables: ['Stakeholder Reports', 'Confidence Metrics', 'Satisfaction Surveys'],
          duration: 'Monthly',
          roles: ['Stakeholder Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.4',
              title: 'Monitor Stakeholder Engagement',
              justification: 'PMBOK stakeholder monitoring ensures engagement effectiveness'
            }
          ]
        },
        {
          name: 'Innovation Validation',
          description: 'Validate innovation outcomes and market readiness',
          deliverables: ['Innovation Validation Report', 'Market Readiness Assessment'],
          duration: 'Quarterly',
          roles: ['Innovation Manager', 'Market Researcher'],
          citations: [
            {
              standard: 'ISO 21500',
              section: '5.3',
              title: 'Project Management Processes',
              justification: 'ISO 21500 processes support innovation validation'
            }
          ]
        }
      ]
    },
    {
      name: 'Close',
      description: 'Project closure with knowledge transfer',
      duration: '2-3 weeks',
      activities: [
        {
          name: 'Innovation Transfer',
          description: 'Transfer innovation outcomes to operations',
          deliverables: ['Innovation Transfer Plan', 'Knowledge Base', 'Training Materials'],
          duration: '1 week',
          roles: ['Innovation Manager', 'Operations Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK project closure includes knowledge transfer'
            },
            {
              standard: 'PRINCE2',
              section: 'CP1',
              title: 'Closing a Project',
              justification: 'PRINCE2 closure process ensures proper handover'
            }
          ]
        },
        {
          name: 'Lessons Learned',
          description: 'Comprehensive lessons learned documentation',
          deliverables: ['Lessons Learned Report', 'Best Practices', 'Recommendations'],
          duration: '1 week',
          roles: ['Project Manager', 'All Team Members'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK emphasizes lessons learned for future projects'
            },
            {
              standard: 'ISO 21502',
              section: '7.4',
              title: 'Project Closure',
              justification: 'ISO 21502 closure includes learning and improvement'
            }
          ]
        },
        {
          name: 'Stakeholder Handover',
          description: 'Formal handover to stakeholders and operations',
          deliverables: ['Handover Documentation', 'Support Plan', 'Contact Information'],
          duration: '1 week',
          roles: ['Project Manager', 'Stakeholder Manager'],
          citations: [
            {
              standard: 'PRINCE2',
              section: 'CP1',
              title: 'Closing a Project',
              justification: 'PRINCE2 ensures proper stakeholder handover'
            }
          ]
        }
      ]
    }
  ],
  tailoring: {
    rationale: 'This process is tailored for innovative product development with high uncertainty and stakeholder complexity. Key tailoring decisions include:',
    decisions: [
      'Emphasized stakeholder management due to complex stakeholder landscape',
      'Integrated risk management throughout all phases',
      'Added innovation-specific activities and deliverables',
      'Implemented adaptive planning for uncertain outcomes',
      'Enhanced learning and knowledge management processes'
    ],
    omitted: [
      'Rigid planning approaches (replaced with adaptive planning)',
      'Simple risk management (enhanced for innovation risks)',
      'Basic stakeholder management (comprehensive approach needed)',
      'Traditional quality gates (replaced with continuous assurance)'
    ]
  }
};
