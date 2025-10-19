import { ProcessTemplate, Phase, Activity, Citation } from './types';

export const governmentProjectTemplate: ProcessTemplate = {
  scenario: 'government-project',
  name: 'Large Government Project',
  description: 'Civil, electrical, and IT components, 2-year duration',
  lifecycle: 'predictive',
  duration: '2 years',
  teamSize: '20+ members',
  characteristics: [
    'Complex multi-stakeholder environment',
    'Regulatory compliance requirements',
    'Public accountability',
    'Long duration with multiple phases',
    'High governance requirements'
  ],
  phases: [
    {
      name: 'Initiation',
      description: 'Project initiation with comprehensive governance setup',
      duration: '4-6 weeks',
      activities: [
        {
          name: 'Project Charter Development',
          description: 'Develop comprehensive project charter with governance structure',
          deliverables: ['Project Charter', 'Governance Framework', 'Authority Matrix'],
          duration: '2 weeks',
          roles: ['Project Sponsor', 'Project Manager', 'Governance Board'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.1',
              title: 'Develop Project Charter',
              justification: 'PMBOK project charter is essential for government projects with complex governance'
            },
            {
              standard: 'PRINCE2',
              section: 'SU1',
              title: 'Starting up a Project',
              justification: 'PRINCE2 starting up process ensures proper project initiation'
            }
          ]
        },
        {
          name: 'Stakeholder Analysis and Engagement',
          description: 'Comprehensive stakeholder analysis for government project',
          deliverables: ['Stakeholder Register', 'Influence Matrix', 'Engagement Strategy'],
          duration: '2 weeks',
          roles: ['Stakeholder Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.1',
              title: 'Identify Stakeholders',
              justification: 'PMBOK stakeholder identification is critical for government projects'
            },
            {
              standard: 'ISO 21502',
              section: '5.2.3',
              title: 'Stakeholder Management',
              justification: 'ISO 21502 provides comprehensive stakeholder management guidance'
            }
          ]
        },
        {
          name: 'Regulatory Compliance Assessment',
          description: 'Assess and plan for regulatory compliance requirements',
          deliverables: ['Compliance Register', 'Regulatory Requirements', 'Compliance Plan'],
          duration: '2 weeks',
          roles: ['Compliance Officer', 'Legal Advisor', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '11.1',
              title: 'Plan Risk Management',
              justification: 'PMBOK risk management includes regulatory compliance risks'
            },
            {
              standard: 'ISO 21502',
              section: '6.2',
              title: 'Project Planning',
              justification: 'ISO 21502 planning includes compliance considerations'
            }
          ]
        }
      ]
    },
    {
      name: 'Planning',
      description: 'Comprehensive planning with governance and compliance focus',
      duration: '6-8 weeks',
      activities: [
        {
          name: 'Integrated Project Plan',
          description: 'Develop comprehensive project plan integrating all components',
          deliverables: ['Master Project Plan', 'Component Plans', 'Integration Plan'],
          duration: '3 weeks',
          roles: ['Project Manager', 'Planning Team', 'Component Leads'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.1',
              title: 'Plan Scope Management',
              justification: 'PMBOK scope management is essential for complex government projects'
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
          name: 'Governance Framework Implementation',
          description: 'Implement project governance framework',
          deliverables: ['Governance Structure', 'Decision Framework', 'Reporting Procedures'],
          duration: '2 weeks',
          roles: ['Governance Board', 'Project Manager'],
          citations: [
            {
              standard: 'PRINCE2',
              section: 'SU2',
              title: 'Appointing the Executive and the Project Manager',
              justification: 'PRINCE2 governance structure is ideal for government projects'
            },
            {
              standard: 'ISO 21500',
              section: '4.3',
              title: 'Project Governance',
              justification: 'ISO 21500 provides governance guidance for complex projects'
            }
          ]
        },
        {
          name: 'Risk Management Plan',
          description: 'Develop comprehensive risk management plan',
          deliverables: ['Risk Management Plan', 'Risk Register', 'Contingency Plans'],
          duration: '2 weeks',
          roles: ['Risk Manager', 'Project Manager', 'Component Leads'],
          citations: [
            {
              standard: 'PMBOK',
              section: '11.1',
              title: 'Plan Risk Management',
              justification: 'PMBOK risk management is critical for government projects'
            },
            {
              standard: 'ISO 21502',
              section: '6.2',
              title: 'Project Planning',
              justification: 'ISO 21502 planning includes comprehensive risk assessment'
            }
          ]
        },
        {
          name: 'Procurement Planning',
          description: 'Plan procurement activities for government project',
          deliverables: ['Procurement Plan', 'Vendor Selection Criteria', 'Contract Templates'],
          duration: '1 week',
          roles: ['Procurement Manager', 'Legal Advisor'],
          citations: [
            {
              standard: 'PMBOK',
              section: '12.1',
              title: 'Plan Procurement Management',
              justification: 'PMBOK procurement planning is essential for government projects'
            }
          ]
        }
      ]
    },
    {
      name: 'Execution',
      description: 'Project execution with governance and compliance oversight',
      duration: '12-15 months',
      activities: [
        {
          name: 'Component Development',
          description: 'Execute development of civil, electrical, and IT components',
          deliverables: ['Component Deliverables', 'Progress Reports', 'Quality Metrics'],
          duration: 'Ongoing',
          roles: ['Component Teams', 'Technical Leads'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.3',
              title: 'Direct and Manage Project Work',
              justification: 'PMBOK execution processes guide component development'
            },
            {
              standard: 'ISO 21502',
              section: '6.3',
              title: 'Project Execution',
              justification: 'ISO 21502 execution guidance supports complex project delivery'
            }
          ]
        },
        {
          name: 'Governance Oversight',
          description: 'Provide governance oversight throughout execution',
          deliverables: ['Governance Reports', 'Decision Records', 'Oversight Minutes'],
          duration: 'Ongoing',
          roles: ['Governance Board', 'Project Manager'],
          citations: [
            {
              standard: 'PRINCE2',
              section: 'CS1',
              title: 'Controlling a Stage',
              justification: 'PRINCE2 stage control provides governance oversight'
            },
            {
              standard: 'ISO 21500',
              section: '4.3',
              title: 'Project Governance',
              justification: 'ISO 21500 governance ensures project oversight'
            }
          ]
        },
        {
          name: 'Stakeholder Management',
          description: 'Manage complex stakeholder relationships',
          deliverables: ['Stakeholder Reports', 'Communication Records', 'Engagement Metrics'],
          duration: 'Ongoing',
          roles: ['Stakeholder Manager', 'Communication Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '13.3',
              title: 'Manage Stakeholder Engagement',
              justification: 'PMBOK stakeholder management is critical for government projects'
            },
            {
              standard: 'ISO 21502',
              section: '5.2.3',
              title: 'Stakeholder Management',
              justification: 'ISO 21502 provides comprehensive stakeholder management'
            }
          ]
        },
        {
          name: 'Compliance Monitoring',
          description: 'Monitor and ensure regulatory compliance',
          deliverables: ['Compliance Reports', 'Audit Results', 'Corrective Actions'],
          duration: 'Ongoing',
          roles: ['Compliance Officer', 'Audit Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '8.2',
              title: 'Manage Quality',
              justification: 'PMBOK quality management includes compliance monitoring'
            },
            {
              standard: 'ISO 21502',
              section: '6.4',
              title: 'Project Control',
              justification: 'ISO 21502 control processes include compliance monitoring'
            }
          ]
        },
        {
          name: 'Risk Monitoring and Control',
          description: 'Continuous risk monitoring and control',
          deliverables: ['Risk Reports', 'Mitigation Actions', 'Risk Updates'],
          duration: 'Ongoing',
          roles: ['Risk Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '11.6',
              title: 'Control Risks',
              justification: 'PMBOK risk control is essential for government projects'
            },
            {
              standard: 'ISO 21502',
              section: '6.4',
              title: 'Project Control',
              justification: 'ISO 21502 control processes support risk management'
            }
          ]
        }
      ]
    },
    {
      name: 'Monitoring & Control',
      description: 'Comprehensive monitoring and control activities',
      duration: 'Ongoing',
      activities: [
        {
          name: 'Performance Monitoring',
          description: 'Monitor project performance against baselines',
          deliverables: ['Performance Reports', 'Variance Analysis', 'Forecasts'],
          duration: 'Monthly',
          roles: ['Project Manager', 'Performance Analyst'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.4',
              title: 'Monitor and Control Project Work',
              justification: 'PMBOK monitoring ensures project performance'
            },
            {
              standard: 'PRINCE2',
              section: 'CS2',
              title: 'Managing Product Delivery',
              justification: 'PRINCE2 product delivery includes performance monitoring'
            }
          ]
        },
        {
          name: 'Quality Assurance',
          description: 'Comprehensive quality assurance activities',
          deliverables: ['Quality Reports', 'Audit Results', 'Quality Metrics'],
          duration: 'Ongoing',
          roles: ['QA Manager', 'Quality Team'],
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
          name: 'Stakeholder Reporting',
          description: 'Regular reporting to stakeholders and governance',
          deliverables: ['Stakeholder Reports', 'Governance Reports', 'Public Reports'],
          duration: 'Monthly',
          roles: ['Communication Manager', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '10.3',
              title: 'Control Communications',
              justification: 'PMBOK communication control ensures stakeholder reporting'
            },
            {
              standard: 'PRINCE2',
              section: 'CS3',
              title: 'Managing a Stage Boundary',
              justification: 'PRINCE2 stage boundaries include stakeholder reporting'
            }
          ]
        },
        {
          name: 'Change Control',
          description: 'Manage changes through formal change control process',
          deliverables: ['Change Requests', 'Change Decisions', 'Impact Assessments'],
          duration: 'As needed',
          roles: ['Change Control Board', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.5',
              title: 'Perform Integrated Change Control',
              justification: 'PMBOK change control is essential for government projects'
            },
            {
              standard: 'PRINCE2',
              section: 'CS4',
              title: 'Controlling a Stage',
              justification: 'PRINCE2 stage control includes change management'
            }
          ]
        }
      ]
    },
    {
      name: 'Closure',
      description: 'Project closure with comprehensive handover',
      duration: '4-6 weeks',
      activities: [
        {
          name: 'Final Deliverable Acceptance',
          description: 'Formal acceptance of all project deliverables',
          deliverables: ['Acceptance Certificates', 'Handover Documentation', 'Warranty Information'],
          duration: '2 weeks',
          roles: ['Acceptance Team', 'Stakeholders', 'Project Manager'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.5',
              title: 'Validate Scope',
              justification: 'PMBOK scope validation ensures deliverable acceptance'
            },
            {
              standard: 'PRINCE2',
              section: 'CP1',
              title: 'Closing a Project',
              justification: 'PRINCE2 closure includes deliverable acceptance'
            }
          ]
        },
        {
          name: 'Knowledge Transfer',
          description: 'Transfer knowledge and documentation to operations',
          deliverables: ['Knowledge Base', 'Operations Manual', 'Training Materials'],
          duration: '2 weeks',
          roles: ['Knowledge Manager', 'Operations Team', 'Project Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK project closure includes knowledge transfer'
            },
            {
              standard: 'ISO 21502',
              section: '7.4',
              title: 'Project Closure',
              justification: 'ISO 21502 closure includes knowledge transfer'
            }
          ]
        },
        {
          name: 'Final Reporting',
          description: 'Prepare comprehensive final project report',
          deliverables: ['Final Project Report', 'Lessons Learned', 'Recommendations'],
          duration: '1 week',
          roles: ['Project Manager', 'Reporting Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.6',
              title: 'Close Project or Phase',
              justification: 'PMBOK closure includes final reporting'
            },
            {
              standard: 'PRINCE2',
              section: 'CP1',
              title: 'Closing a Project',
              justification: 'PRINCE2 closure includes final reporting'
            }
          ]
        },
        {
          name: 'Stakeholder Handover',
          description: 'Formal handover to stakeholders and operations',
          deliverables: ['Handover Ceremony', 'Support Agreements', 'Contact Information'],
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
    rationale: 'This process is tailored for large government projects with complex governance and compliance requirements. Key tailoring decisions include:',
    decisions: [
      'Enhanced governance structure for public accountability',
      'Comprehensive compliance monitoring throughout all phases',
      'Formal stakeholder management for public transparency',
      'Detailed risk management for public sector risks',
      'Comprehensive documentation for audit and compliance'
    ],
    omitted: [
      'Agile methodologies (replaced with predictive approach for compliance)',
      'Informal communication (replaced with formal reporting)',
      'Simple risk management (enhanced for government risks)',
      'Basic quality assurance (comprehensive approach needed)',
      'Flexible change control (formal process required)'
    ]
  }
};
