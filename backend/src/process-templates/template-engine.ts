import { ProcessTemplate, ProcessInputs, GeneratedProcess, Phase, Activity, Citation, EvidenceSummary } from './types';
import { customSoftwareTemplate } from './custom-software';
import { innovativeProductTemplate } from './innovative-product';
import { governmentProjectTemplate } from './government-project';

export class TemplateEngine {
  private templates: Map<string, ProcessTemplate> = new Map();

  constructor() {
    this.templates.set('custom-software', customSoftwareTemplate);
    this.templates.set('innovative-product', innovativeProductTemplate);
    this.templates.set('government-project', governmentProjectTemplate);
  }

  /**
   * Get available process templates
   */
  getAvailableTemplates(): ProcessTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get a specific template by scenario ID
   */
  getTemplate(scenarioId: string): ProcessTemplate | null {
    return this.templates.get(scenarioId) || null;
  }

  /**
   * Generate a tailored process based on inputs
   */
  async generateProcess(inputs: ProcessInputs): Promise<GeneratedProcess> {
    const template = this.getTemplate(inputs.scenarioId);
    if (!template) {
      throw new Error(`Template not found for scenario: ${inputs.scenarioId}`);
    }

    // Tailor the template based on inputs
    const tailoredPhases = await this.tailorPhases(template.phases, inputs);
    
    // Generate evidence summary
    const evidence = await this.generateEvidenceSummary(tailoredPhases);
    
    // Create summary
    const summary = this.generateSummary(inputs, template);

    return {
      projectName: inputs.projectName,
      scenario: inputs.scenarioId,
      summary,
      phases: tailoredPhases,
      generatedAt: new Date().toISOString(),
      tailoring: template.tailoring,
      evidence
    };
  }

  /**
   * Tailor phases based on project inputs
   */
  private async tailorPhases(phases: Phase[], inputs: ProcessInputs): Promise<Phase[]> {
    const tailoredPhases = await Promise.all(phases.map(async phase => ({
      ...phase,
      activities: await Promise.all(phase.activities.map(async activity => ({
        ...activity,
        citations: await this.enhanceCitations(activity.citations || [], inputs),
        duration: this.adjustDuration(activity.duration, inputs),
        deliverables: this.tailorDeliverables(activity.deliverables, inputs)
      })))
    })));
    
    return tailoredPhases;
  }

  /**
   * Enhance citations with additional context
   */
  private async enhanceCitations(citations: Citation[], inputs: ProcessInputs): Promise<Citation[]> {
    return citations.map(citation => ({
      ...citation,
      confidence: this.calculateConfidence(citation, inputs),
      justification: this.enhanceJustification(citation, inputs)
    }));
  }

  /**
   * Calculate confidence score for a citation
   */
  private calculateConfidence(citation: Citation, inputs: ProcessInputs): number {
    let confidence = 0.7; // Base confidence

    // Adjust based on scenario match
    if (citation.standard === 'PMBOK' && inputs.lifecycle === 'predictive') {
      confidence += 0.1;
    }
    if (citation.standard === 'PRINCE2' && inputs.scenarioId === 'government-project') {
      confidence += 0.1;
    }
    if (citation.standard.startsWith('ISO') && inputs.scenarioId === 'innovative-product') {
      confidence += 0.1;
    }

    // Adjust based on constraints
    if (inputs.constraints.includes('regulatory approvals') && citation.standard === 'PRINCE2') {
      confidence += 0.1;
    }
    if (inputs.constraints.includes('timeboxed sprints') && citation.standard === 'PMBOK') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Enhance justification with project context
   */
  private enhanceJustification(citation: Citation, inputs: ProcessInputs): string {
    let enhanced = citation.justification;
    
    if (inputs.constraints.includes('regulatory approvals')) {
      enhanced += ' This is particularly relevant for regulatory compliance requirements.';
    }
    if (inputs.drivers.includes('Time-to-market')) {
      enhanced += ' This practice supports rapid delivery objectives.';
    }
    if (inputs.drivers.includes('Compliance')) {
      enhanced += ' This ensures compliance with regulatory requirements.';
    }

    return enhanced;
  }

  /**
   * Adjust activity duration based on project inputs
   */
  private adjustDuration(duration: string, inputs: ProcessInputs): string {
    // For now, return original duration
    // In a real implementation, this would adjust based on team size, complexity, etc.
    return duration;
  }

  /**
   * Tailor deliverables based on project inputs
   */
  private tailorDeliverables(deliverables: string[], inputs: ProcessInputs): string[] {
    const tailored = [...deliverables];

    // Add scenario-specific deliverables
    if (inputs.scenarioId === 'government-project') {
      tailored.push('Compliance Documentation');
      tailored.push('Public Report');
    }
    if (inputs.scenarioId === 'innovative-product') {
      tailored.push('Innovation Report');
      tailored.push('Market Analysis');
    }
    if (inputs.scenarioId === 'custom-software') {
      tailored.push('User Documentation');
      tailored.push('Technical Documentation');
    }

    return tailored;
  }

  /**
   * Generate evidence summary
   */
  private async generateEvidenceSummary(phases: Phase[]): Promise<EvidenceSummary> {
    const allCitations = phases.flatMap(phase => 
      phase.activities.flatMap(activity => activity.citations || [])
    );

    const standardsCoverage = {
      PMBOK: allCitations.filter(c => c.standard === 'PMBOK').length,
      PRINCE2: allCitations.filter(c => c.standard === 'PRINCE2').length,
      ISO21500: allCitations.filter(c => c.standard === 'ISO 21500').length,
      ISO21502: allCitations.filter(c => c.standard === 'ISO 21502').length
    };

    const totalCitations = allCitations.length;
    const confidenceScore = allCitations.reduce((sum, c) => sum + (c.confidence || 0.7), 0) / totalCitations;

    return {
      totalCitations,
      standardsCoverage,
      confidenceScore,
      qualityMetrics: {
        completeness: this.calculateCompleteness(phases),
        accuracy: confidenceScore,
        relevance: this.calculateRelevance(allCitations)
      }
    };
  }

  /**
   * Calculate process completeness score
   */
  private calculateCompleteness(phases: Phase[]): number {
    const totalActivities = phases.reduce((sum, phase) => sum + phase.activities.length, 0);
    const activitiesWithCitations = phases.reduce((sum, phase) => 
      sum + phase.activities.filter(activity => activity.citations && activity.citations.length > 0).length, 0
    );
    
    return activitiesWithCitations / totalActivities;
  }

  /**
   * Calculate citation relevance score
   */
  private calculateRelevance(citations: Citation[]): number {
    const relevantCitations = citations.filter(c => c.confidence && c.confidence > 0.6);
    return relevantCitations.length / citations.length;
  }

  /**
   * Generate process summary
   */
  private generateSummary(inputs: ProcessInputs, template: ProcessTemplate): string {
    return `Tailored process for ${inputs.projectName || 'your project'} using ${template.name} approach. ` +
           `This ${template.lifecycle} lifecycle process is designed for ${template.description}. ` +
           `Key constraints: ${inputs.constraints.join(', ')}. ` +
           `Primary drivers: ${inputs.drivers.join(', ')}.`;
  }

  /**
   * Compare processes across scenarios
   */
  async compareProcesses(scenarioIds: string[]): Promise<any> {
    const processes = scenarioIds.map(id => this.getTemplate(id)).filter((template): template is ProcessTemplate => template !== null);
    
    if (processes.length < 2) {
      throw new Error('At least 2 scenarios required for comparison');
    }

    const comparison = {
      scenarios: scenarioIds,
      phases: this.comparePhases(processes),
      similarities: this.findSimilarities(processes),
      differences: this.findDifferences(processes),
      recommendations: this.generateRecommendations(processes)
    };

    return comparison;
  }

  /**
   * Compare phases across processes
   */
  private comparePhases(processes: ProcessTemplate[]): any[] {
    const phaseNames = [...new Set(processes.flatMap(p => p.phases.map(phase => phase.name)))];
    
    return phaseNames.map(phaseName => ({
      phaseName,
      scenarios: processes.reduce((acc, process) => {
        const phase = process.phases.find(p => p.name === phaseName);
        if (phase) {
          acc[process.scenario] = {
            activities: phase.activities.map(a => a.name),
            deliverables: phase.activities.flatMap(a => a.deliverables),
            duration: phase.duration
          };
        }
        return acc;
      }, {} as any)
    }));
  }

  /**
   * Find similarities across processes
   */
  private findSimilarities(processes: ProcessTemplate[]): string[] {
    const similarities: string[] = [];
    
    // Check for common phases
    const allPhases = processes.flatMap(p => p.phases.map(phase => phase.name));
    const commonPhases = [...new Set(allPhases)].filter(phase => 
      processes.every(process => process.phases.some(p => p.name === phase))
    );
    
    if (commonPhases.length > 0) {
      similarities.push(`Common phases: ${commonPhases.join(', ')}`);
    }

    // Check for common activities
    const allActivities = processes.flatMap(p => 
      p.phases.flatMap(phase => phase.activities.map(activity => activity.name))
    );
    const commonActivities = [...new Set(allActivities)].filter(activity => 
      processes.every(process => 
        process.phases.some(phase => 
          phase.activities.some(a => a.name === activity)
        )
      )
    );
    
    if (commonActivities.length > 0) {
      similarities.push(`Common activities: ${commonActivities.slice(0, 5).join(', ')}`);
    }

    return similarities;
  }

  /**
   * Find differences across processes
   */
  private findDifferences(processes: ProcessTemplate[]): string[] {
    const differences: string[] = [];
    
    // Check for unique phases
    processes.forEach(process => {
      const uniquePhases = process.phases.filter(phase => 
        !processes.some(other => 
          other !== process && other.phases.some(p => p.name === phase.name)
        )
      );
      
      if (uniquePhases.length > 0) {
        differences.push(`${process.name} has unique phases: ${uniquePhases.map(p => p.name).join(', ')}`);
      }
    });

    return differences;
  }

  /**
   * Generate recommendations based on comparison
   */
  private generateRecommendations(processes: ProcessTemplate[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze lifecycle approaches
    const lifecycles = processes.map(p => p.lifecycle);
    const uniqueLifecycles = [...new Set(lifecycles)];
    
    if (uniqueLifecycles.length > 1) {
      recommendations.push(`Consider lifecycle approach: ${uniqueLifecycles.join(' vs ')}`);
    }

    // Analyze team sizes
    const teamSizes = processes.map(p => p.teamSize);
    const uniqueTeamSizes = [...new Set(teamSizes)];
    
    if (uniqueTeamSizes.length > 1) {
      recommendations.push(`Team size considerations: ${uniqueTeamSizes.join(' vs ')}`);
    }

    return recommendations;
  }
}
