import { ProcessValidation, ValidationIssue, Phase, Activity, Citation } from '../process-templates/types';

export class EvidenceValidator {
  /**
   * Validate a complete process for evidence quality
   */
  async validateProcess(phases: Phase[]): Promise<ProcessValidation> {
    const issues: ValidationIssue[] = [];
    const recommendations: string[] = [];
    
    // Validate each phase
    for (const phase of phases) {
      const phaseIssues = await this.validatePhase(phase);
      issues.push(...phaseIssues);
    }
    
    // Generate recommendations based on issues
    recommendations.push(...this.generateRecommendations(issues));
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(phases, issues);
    
    return {
      isValid: issues.filter(issue => issue.severity === 'high').length === 0,
      issues,
      recommendations,
      qualityScore
    };
  }

  /**
   * Validate a single phase
   */
  private async validatePhase(phase: Phase): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    for (const activity of phase.activities) {
      const activityIssues = await this.validateActivity(activity, phase.name);
      issues.push(...activityIssues);
    }
    
    return issues;
  }

  /**
   * Validate a single activity
   */
  private async validateActivity(activity: Activity, phaseName: string): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for missing citations
    if (!activity.citations || activity.citations.length === 0) {
      issues.push({
        type: 'missing_citation',
        phase: phaseName,
        activity: activity.name,
        severity: 'high',
        message: `No citations provided for activity: ${activity.name}`,
        recommendation: 'Add citations to relevant standard sections to support this activity'
      });
    } else {
      // Check citation quality
      const citationIssues = this.validateCitations(activity.citations, activity.name, phaseName);
      issues.push(...citationIssues);
    }
    
    // Check for missing deliverables
    if (!activity.deliverables || activity.deliverables.length === 0) {
      issues.push({
        type: 'missing_deliverable',
        phase: phaseName,
        activity: activity.name,
        severity: 'medium',
        message: `No deliverables specified for activity: ${activity.name}`,
        recommendation: 'Define clear deliverables for this activity'
      });
    }
    
    // Check for incomplete activity information
    if (!activity.description || activity.description.length < 20) {
      issues.push({
        type: 'incomplete_activity',
        phase: phaseName,
        activity: activity.name,
        severity: 'medium',
        message: `Incomplete description for activity: ${activity.name}`,
        recommendation: 'Provide a more detailed description of this activity'
      });
    }
    
    return issues;
  }

  /**
   * Validate citations for an activity
   */
  private validateCitations(citations: Citation[], activityName: string, phaseName: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for low confidence citations
    const lowConfidenceCitations = citations.filter(c => (c.confidence || 0) < 0.5);
    if (lowConfidenceCitations.length > 0) {
      issues.push({
        type: 'insufficient_evidence',
        phase: phaseName,
        activity: activityName,
        severity: 'medium',
        message: `${lowConfidenceCitations.length} citations have low confidence scores`,
        recommendation: 'Review and improve citation relevance or find better supporting evidence'
      });
    }
    
    // Check for missing justifications
    const missingJustifications = citations.filter(c => !c.justification || c.justification.length < 20);
    if (missingJustifications.length > 0) {
      issues.push({
        type: 'insufficient_evidence',
        phase: phaseName,
        activity: activityName,
        severity: 'low',
        message: `${missingJustifications.length} citations lack proper justification`,
        recommendation: 'Provide detailed justifications for why these citations support the activity'
      });
    }
    
    // Check for standard coverage
    const standards = new Set(citations.map(c => c.standard));
    if (standards.size < 2) {
      issues.push({
        type: 'insufficient_evidence',
        phase: phaseName,
        activity: activityName,
        severity: 'medium',
        message: 'Limited standard coverage in citations',
        recommendation: 'Include citations from multiple standards (PMBOK, PRINCE2, ISO) for better coverage'
      });
    }
    
    return issues;
  }

  /**
   * Generate recommendations based on validation issues
   */
  private generateRecommendations(issues: ValidationIssue[]): string[] {
    const recommendations: string[] = [];
    
    const issueTypes = new Set(issues.map(issue => issue.type));
    
    if (issueTypes.has('missing_citation')) {
      recommendations.push('Add citations to all activities to support evidence-based process design');
    }
    
    if (issueTypes.has('insufficient_evidence')) {
      recommendations.push('Improve citation quality by ensuring high confidence scores and proper justifications');
    }
    
    if (issueTypes.has('missing_deliverable')) {
      recommendations.push('Define clear deliverables for all activities to ensure measurable outcomes');
    }
    
    if (issueTypes.has('incomplete_activity')) {
      recommendations.push('Provide detailed descriptions for all activities to ensure clarity');
    }
    
    // Add general recommendations
    recommendations.push('Review process completeness to ensure all necessary activities are included');
    recommendations.push('Validate that all activities align with project objectives and constraints');
    
    return recommendations;
  }

  /**
   * Calculate overall quality score for the process
   */
  private calculateQualityScore(phases: Phase[], issues: ValidationIssue[]): number {
    let score = 1.0;
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 0.1;
          break;
        case 'medium':
          score -= 0.05;
          break;
        case 'low':
          score -= 0.02;
          break;
      }
    });
    
    // Bonus for comprehensive coverage
    const totalActivities = phases.reduce((sum, phase) => sum + phase.activities.length, 0);
    const activitiesWithCitations = phases.reduce((sum, phase) => 
      sum + phase.activities.filter(activity => activity.citations && activity.citations.length > 0).length, 0
    );
    
    const citationCoverage = activitiesWithCitations / totalActivities;
    score += citationCoverage * 0.2;
    
    // Bonus for standard diversity
    const allCitations = phases.flatMap(phase => 
      phase.activities.flatMap(activity => activity.citations || [])
    );
    const standards = new Set(allCitations.map(citation => citation.standard));
    const standardDiversity = Math.min(standards.size / 3, 1); // Max 3 standards
    score += standardDiversity * 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get validation summary for a process
   */
  async getValidationSummary(phases: Phase[]): Promise<{
    totalActivities: number;
    activitiesWithCitations: number;
    citationCoverage: number;
    standardsUsed: string[];
    averageConfidence: number;
    qualityScore: number;
  }> {
    const totalActivities = phases.reduce((sum, phase) => sum + phase.activities.length, 0);
    const activitiesWithCitations = phases.reduce((sum, phase) => 
      sum + phase.activities.filter(activity => activity.citations && activity.citations.length > 0).length, 0
    );
    
    const allCitations = phases.flatMap(phase => 
      phase.activities.flatMap(activity => activity.citations || [])
    );
    
    const standardsUsed = [...new Set(allCitations.map(citation => citation.standard))];
    const averageConfidence = allCitations.length > 0 
      ? allCitations.reduce((sum, citation) => sum + (citation.confidence || 0.5), 0) / allCitations.length
      : 0;
    
    const validation = await this.validateProcess(phases);
    
    return {
      totalActivities,
      activitiesWithCitations,
      citationCoverage: activitiesWithCitations / totalActivities,
      standardsUsed,
      averageConfidence,
      qualityScore: validation.qualityScore
    };
  }

  /**
   * Validate specific scenario requirements
   */
  async validateScenarioRequirements(phases: Phase[], scenario: string): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    switch (scenario) {
      case 'custom-software':
        issues.push(...this.validateCustomSoftwareRequirements(phases));
        break;
      case 'innovative-product':
        issues.push(...this.validateInnovativeProductRequirements(phases));
        break;
      case 'government-project':
        issues.push(...this.validateGovernmentProjectRequirements(phases));
        break;
    }
    
    return issues;
  }

  /**
   * Validate custom software development requirements
   */
  private validateCustomSoftwareRequirements(phases: Phase[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for agile-specific activities
    const hasSprintPlanning = phases.some(phase => 
      phase.activities.some(activity => 
        activity.name.toLowerCase().includes('sprint') || 
        activity.name.toLowerCase().includes('agile')
      )
    );
    
    if (!hasSprintPlanning) {
      issues.push({
        type: 'incomplete_activity',
        phase: 'All',
        activity: 'Agile Activities',
        severity: 'medium',
        message: 'Missing agile-specific activities for custom software development',
        recommendation: 'Include sprint planning, daily standups, and sprint reviews'
      });
    }
    
    return issues;
  }

  /**
   * Validate innovative product development requirements
   */
  private validateInnovativeProductRequirements(phases: Phase[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for innovation-specific activities
    const hasInnovationActivities = phases.some(phase => 
      phase.activities.some(activity => 
        activity.name.toLowerCase().includes('innovation') || 
        activity.name.toLowerCase().includes('research') ||
        activity.name.toLowerCase().includes('stakeholder')
      )
    );
    
    if (!hasInnovationActivities) {
      issues.push({
        type: 'incomplete_activity',
        phase: 'All',
        activity: 'Innovation Activities',
        severity: 'high',
        message: 'Missing innovation-specific activities for product development',
        recommendation: 'Include innovation assessment, stakeholder engagement, and research activities'
      });
    }
    
    return issues;
  }

  /**
   * Validate government project requirements
   */
  private validateGovernmentProjectRequirements(phases: Phase[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for governance activities
    const hasGovernanceActivities = phases.some(phase => 
      phase.activities.some(activity => 
        activity.name.toLowerCase().includes('governance') || 
        activity.name.toLowerCase().includes('compliance') ||
        activity.name.toLowerCase().includes('stakeholder')
      )
    );
    
    if (!hasGovernanceActivities) {
      issues.push({
        type: 'incomplete_activity',
        phase: 'All',
        activity: 'Governance Activities',
        severity: 'high',
        message: 'Missing governance-specific activities for government project',
        recommendation: 'Include governance framework, compliance monitoring, and stakeholder management'
      });
    }
    
    return issues;
  }
}
