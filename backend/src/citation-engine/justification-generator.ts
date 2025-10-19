import { Citation, Activity, Phase } from '../process-templates/types';

export class JustificationGenerator {
  /**
   * Generate comprehensive justifications for all citations in a process
   */
  async generateJustifications(phases: Phase[]): Promise<Phase[]> {
    return phases.map(phase => ({
      ...phase,
      activities: phase.activities.map(activity => ({
        ...activity,
        citations: activity.citations?.map(citation => ({
          ...citation,
          justification: this.generateJustification(citation, activity, phase)
        })) || []
      }))
    }));
  }

  /**
   * Generate justification for a single citation
   */
  private generateJustification(citation: Citation, activity: Activity, phase: Phase): string {
    const baseJustification = this.getBaseJustification(citation);
    const activityContext = this.getActivityContext(activity);
    const phaseContext = this.getPhaseContext(phase);
    const standardContext = this.getStandardContext(citation.standard);
    
    return `${baseJustification} ${activityContext} ${phaseContext} ${standardContext}`;
  }

  /**
   * Get base justification for a citation
   */
  private getBaseJustification(citation: Citation): string {
    return `${citation.standard} ${citation.section} (${citation.title}) provides guidance on ${this.extractTopic(citation.title)}`;
  }

  /**
   * Extract topic from citation title
   */
  private extractTopic(title: string): string {
    const topic = title.toLowerCase()
      .replace(/project management|management|process|guidance|principles/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return topic || 'project management practices';
  }

  /**
   * Get activity-specific context
   */
  private getActivityContext(activity: Activity): string {
    const activityName = activity.name.toLowerCase();
    
    if (activityName.includes('planning')) {
      return 'This is essential for effective project planning and ensures comprehensive coverage of planning activities.';
    }
    
    if (activityName.includes('stakeholder')) {
      return 'This guidance is crucial for stakeholder management and ensures proper engagement throughout the project.';
    }
    
    if (activityName.includes('risk')) {
      return 'This provides essential risk management guidance to identify, assess, and mitigate project risks.';
    }
    
    if (activityName.includes('quality')) {
      return 'This ensures quality standards are met and deliverables meet stakeholder expectations.';
    }
    
    if (activityName.includes('execution')) {
      return 'This guides effective project execution and ensures deliverables are produced according to plan.';
    }
    
    if (activityName.includes('monitoring') || activityName.includes('control')) {
      return 'This enables effective project monitoring and control to ensure objectives are met.';
    }
    
    if (activityName.includes('closure')) {
      return 'This ensures proper project closure and knowledge transfer to stakeholders.';
    }
    
    if (activityName.includes('communication')) {
      return 'This supports effective communication management and stakeholder engagement.';
    }
    
    if (activityName.includes('procurement')) {
      return 'This provides guidance for procurement management and vendor relationships.';
    }
    
    if (activityName.includes('integration')) {
      return 'This ensures proper project integration and coordination of all project elements.';
    }
    
    return 'This provides valuable guidance for this activity and supports project success.';
  }

  /**
   * Get phase-specific context
   */
  private getPhaseContext(phase: Phase): string {
    const phaseName = phase.name.toLowerCase();
    
    if (phaseName.includes('initiation') || phaseName.includes('initiate')) {
      return 'This is particularly important during project initiation to establish proper foundations.';
    }
    
    if (phaseName.includes('planning') || phaseName.includes('plan')) {
      return 'This phase requires comprehensive planning to ensure project success.';
    }
    
    if (phaseName.includes('execution') || phaseName.includes('execute')) {
      return 'This phase focuses on delivering project outcomes according to plan.';
    }
    
    if (phaseName.includes('monitoring') || phaseName.includes('control')) {
      return 'This phase ensures project remains on track and objectives are met.';
    }
    
    if (phaseName.includes('closure') || phaseName.includes('close')) {
      return 'This phase ensures proper project closure and stakeholder satisfaction.';
    }
    
    if (phaseName.includes('sprint') || phaseName.includes('agile')) {
      return 'This phase emphasizes iterative delivery and continuous improvement.';
    }
    
    if (phaseName.includes('review') || phaseName.includes('retrospective')) {
      return 'This phase focuses on learning and process improvement.';
    }
    
    return 'This phase is critical for project success and requires proper execution.';
  }

  /**
   * Get standard-specific context
   */
  private getStandardContext(standard: string): string {
    if (standard.includes('PMBOK')) {
      return 'PMBOK provides comprehensive project management guidance based on global best practices.';
    }
    
    if (standard.includes('PRINCE2')) {
      return 'PRINCE2 offers a structured approach to project management with emphasis on governance and control.';
    }
    
    if (standard.includes('ISO 21500')) {
      return 'ISO 21500 provides international standards for project management with focus on context and concepts.';
    }
    
    if (standard.includes('ISO 21502')) {
      return 'ISO 21502 offers detailed guidance on project management practices and implementation.';
    }
    
    return 'This standard provides valuable project management guidance.';
  }

  /**
   * Generate tailored justifications based on project context
   */
  async generateTailoredJustifications(
    phases: Phase[], 
    projectContext: {
      scenario: string;
      lifecycle: string;
      constraints: string[];
      drivers: string[];
    }
  ): Promise<Phase[]> {
    return phases.map(phase => ({
      ...phase,
      activities: phase.activities.map(activity => ({
        ...activity,
        citations: activity.citations?.map(citation => ({
          ...citation,
          justification: this.generateTailoredJustification(citation, activity, phase, projectContext)
        })) || []
      }))
    }));
  }

  /**
   * Generate tailored justification based on project context
   */
  private generateTailoredJustification(
    citation: Citation, 
    activity: Activity, 
    phase: Phase,
    context: {
      scenario: string;
      lifecycle: string;
      constraints: string[];
      drivers: string[];
    }
  ): string {
    const baseJustification = this.generateJustification(citation, activity, phase);
    const contextJustification = this.getContextJustification(context);
    
    return `${baseJustification} ${contextJustification}`;
  }

  /**
   * Get context-specific justification
   */
  private getContextJustification(context: {
    scenario: string;
    lifecycle: string;
    constraints: string[];
    drivers: string[];
  }): string {
    let justification = '';
    
    // Scenario-specific context
    switch (context.scenario) {
      case 'custom-software':
        justification += 'This is particularly relevant for agile software development with rapid delivery cycles.';
        break;
      case 'innovative-product':
        justification += 'This guidance is essential for managing innovation and uncertainty in product development.';
        break;
      case 'government-project':
        justification += 'This is critical for ensuring compliance and governance in public sector projects.';
        break;
    }
    
    // Lifecycle-specific context
    if (context.lifecycle === 'agile') {
      justification += ' The agile approach emphasizes iterative delivery and continuous improvement.';
    } else if (context.lifecycle === 'predictive') {
      justification += ' The predictive approach ensures structured planning and controlled execution.';
    } else if (context.lifecycle === 'hybrid') {
      justification += ' The hybrid approach balances structure with flexibility for complex projects.';
    }
    
    // Constraint-specific context
    if (context.constraints.includes('regulatory approvals')) {
      justification += ' This is especially important given regulatory compliance requirements.';
    }
    if (context.constraints.includes('timeboxed sprints')) {
      justification += ' This supports rapid delivery within time constraints.';
    }
    if (context.constraints.includes('fixed scope')) {
      justification += ' This ensures scope control and change management.';
    }
    
    // Driver-specific context
    if (context.drivers.includes('Compliance')) {
      justification += ' This ensures compliance with relevant standards and regulations.';
    }
    if (context.drivers.includes('Time-to-market')) {
      justification += ' This supports rapid delivery and time-to-market objectives.';
    }
    if (context.drivers.includes('Quality')) {
      justification += ' This ensures high-quality deliverables and stakeholder satisfaction.';
    }
    
    return justification;
  }

  /**
   * Generate justification summary for a process
   */
  async generateJustificationSummary(phases: Phase[]): Promise<{
    totalJustifications: number;
    averageLength: number;
    qualityScore: number;
    coverageByStandard: { [standard: string]: number };
  }> {
    const allCitations = phases.flatMap(phase => 
      phase.activities.flatMap(activity => activity.citations || [])
    );
    
    const totalJustifications = allCitations.length;
    const averageLength = allCitations.reduce((sum, citation) => 
      sum + (citation.justification?.length || 0), 0
    ) / totalJustifications;
    
    const qualityScore = this.calculateJustificationQuality(allCitations);
    
    const coverageByStandard: { [standard: string]: number } = {};
    allCitations.forEach(citation => {
      const standard = citation.standard;
      coverageByStandard[standard] = (coverageByStandard[standard] || 0) + 1;
    });
    
    return {
      totalJustifications,
      averageLength,
      qualityScore,
      coverageByStandard
    };
  }

  /**
   * Calculate justification quality score
   */
  private calculateJustificationQuality(citations: Citation[]): number {
    if (citations.length === 0) return 0;
    
    const qualityFactors = citations.map(citation => {
      let score = 0;
      
      // Length factor (longer justifications are generally better)
      const length = citation.justification?.length || 0;
      if (length > 100) score += 0.3;
      else if (length > 50) score += 0.2;
      else if (length > 20) score += 0.1;
      
      // Content factor (check for key terms)
      const justification = citation.justification?.toLowerCase() || '';
      if (justification.includes('essential') || justification.includes('critical')) score += 0.2;
      if (justification.includes('ensures') || justification.includes('supports')) score += 0.2;
      if (justification.includes('guidance') || justification.includes('best practice')) score += 0.2;
      
      // Context factor (check for scenario-specific terms)
      if (justification.includes('agile') || justification.includes('iterative')) score += 0.1;
      if (justification.includes('stakeholder') || justification.includes('governance')) score += 0.1;
      if (justification.includes('compliance') || justification.includes('regulatory')) score += 0.1;
      
      return Math.min(score, 1.0);
    });
    
    return qualityFactors.reduce((sum, score) => sum + score, 0) / qualityFactors.length;
  }
}
