import { Citation, Activity, Phase } from '../process-templates/types';
import { PrismaClient } from '@prisma/client';

export class CitationMapper {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Map activity to relevant standard sections using semantic search
   */
  async mapActivityToStandards(activity: string, scenario: string): Promise<Citation[]> {
    try {
      // Use semantic search to find relevant sections
      const relevantSections = await this.findRelevantSections(activity, scenario);
      
      // Map to specific standard sections
      const citations = await this.mapToStandards(relevantSections, activity);
      
      // Generate justification for each citation
      const citationsWithJustification = await this.generateJustifications(citations, activity, scenario);
      
      return citationsWithJustification;
    } catch (error) {
      console.error('Error mapping activity to standards:', error);
      return [];
    }
  }

  /**
   * Find relevant sections using semantic search
   */
  private async findRelevantSections(activity: string, scenario: string): Promise<any[]> {
    try {
      // Search for sections related to the activity
      const searchQuery = this.buildSearchQuery(activity, scenario);
      
      const sections = await this.prisma.section.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            },
            {
              content: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          standard: true
        },
        take: 10
      });

      return sections;
    } catch (error) {
      console.error('Error finding relevant sections:', error);
      return [];
    }
  }

  /**
   * Build search query based on activity and scenario
   */
  private buildSearchQuery(activity: string, scenario: string): string {
    const activityKeywords = this.extractKeywords(activity);
    const scenarioKeywords = this.getScenarioKeywords(scenario);
    
    return [...activityKeywords, ...scenarioKeywords].join(' ');
  }

  /**
   * Extract keywords from activity name
   */
  private extractKeywords(activity: string): string[] {
    const keywords = activity.toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
    
    return keywords;
  }

  /**
   * Get scenario-specific keywords
   */
  private getScenarioKeywords(scenario: string): string[] {
    const scenarioKeywords: { [key: string]: string[] } = {
      'custom-software': ['software', 'development', 'agile', 'sprint', 'delivery'],
      'innovative-product': ['innovation', 'research', 'development', 'stakeholder', 'uncertainty'],
      'government-project': ['governance', 'compliance', 'stakeholder', 'public', 'regulatory']
    };
    
    return scenarioKeywords[scenario] || [];
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return stopWords.includes(word);
  }

  /**
   * Map sections to standard citations
   */
  private async mapToStandards(sections: any[], activity: string): Promise<Citation[]> {
    const citations: Citation[] = [];
    
    for (const section of sections) {
      const citation: Citation = {
        standard: section.standard.title,
        section: section.sectionNumber,
        title: section.title,
        justification: '', // Will be filled by generateJustifications
        confidence: this.calculateConfidence(section, activity)
      };
      
      citations.push(citation);
    }
    
    return citations;
  }

  /**
   * Calculate confidence score for a citation
   */
  private calculateConfidence(section: any, activity: string): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on title match
    const activityWords = activity.toLowerCase().split(/\s+/);
    const titleWords = section.title.toLowerCase().split(/\s+/);
    const titleMatch = activityWords.filter(word => titleWords.includes(word)).length;
    confidence += (titleMatch / activityWords.length) * 0.3;
    
    // Boost confidence based on content relevance
    const contentWords = section.content.toLowerCase().split(/\s+/);
    const contentMatch = activityWords.filter(word => contentWords.includes(word)).length;
    confidence += (contentMatch / activityWords.length) * 0.2;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Generate justifications for citations
   */
  private async generateJustifications(citations: Citation[], activity: string, scenario: string): Promise<Citation[]> {
    return citations.map(citation => ({
      ...citation,
      justification: this.generateJustification(citation, activity, scenario)
    }));
  }

  /**
   * Generate justification for a single citation
   */
  private generateJustification(citation: Citation, activity: string, scenario: string): string {
    const baseJustification = `${citation.standard} ${citation.section} provides guidance on ${citation.title.toLowerCase()}`;
    
    // Add scenario-specific context
    const scenarioContext = this.getScenarioContext(scenario);
    const activityContext = this.getActivityContext(activity);
    
    return `${baseJustification}. ${scenarioContext} ${activityContext}`;
  }

  /**
   * Get scenario-specific context
   */
  private getScenarioContext(scenario: string): string {
    const contexts: { [key: string]: string } = {
      'custom-software': 'This is particularly relevant for agile software development projects.',
      'innovative-product': 'This guidance is essential for managing innovation and uncertainty.',
      'government-project': 'This is critical for ensuring compliance and governance.'
    };
    
    return contexts[scenario] || 'This provides valuable guidance for project management.';
  }

  /**
   * Get activity-specific context
   */
  private getActivityContext(activity: string): string {
    const activityLower = activity.toLowerCase();
    
    if (activityLower.includes('stakeholder')) {
      return 'Stakeholder management is crucial for project success.';
    }
    if (activityLower.includes('risk')) {
      return 'Risk management helps ensure project objectives are met.';
    }
    if (activityLower.includes('quality')) {
      return 'Quality assurance ensures deliverables meet requirements.';
    }
    if (activityLower.includes('planning')) {
      return 'Proper planning is fundamental to project success.';
    }
    if (activityLower.includes('execution')) {
      return 'Effective execution is key to delivering project outcomes.';
    }
    
    return 'This activity is important for project success.';
  }

  /**
   * Validate citations for an activity
   */
  async validateCitations(activity: Activity): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    if (!activity.citations || activity.citations.length === 0) {
      issues.push('No citations provided for this activity');
      recommendations.push('Add citations to relevant standard sections');
    } else {
      // Check citation quality
      const lowConfidenceCitations = activity.citations.filter(c => (c.confidence || 0) < 0.5);
      if (lowConfidenceCitations.length > 0) {
        issues.push(`${lowConfidenceCitations.length} citations have low confidence scores`);
        recommendations.push('Review and improve citation relevance');
      }
      
      // Check for standard coverage
      const standards = new Set(activity.citations.map(c => c.standard));
      if (standards.size < 2) {
        issues.push('Limited standard coverage in citations');
        recommendations.push('Include citations from multiple standards for better coverage');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Get citation statistics for a process
   */
  async getCitationStatistics(phases: Phase[]): Promise<{
    totalCitations: number;
    standardsCoverage: { [standard: string]: number };
    averageConfidence: number;
    qualityScore: number;
  }> {
    const allCitations = phases.flatMap(phase => 
      phase.activities.flatMap(activity => activity.citations || [])
    );
    
    const standardsCoverage: { [standard: string]: number } = {};
    let totalConfidence = 0;
    
    allCitations.forEach(citation => {
      const standard = citation.standard;
      standardsCoverage[standard] = (standardsCoverage[standard] || 0) + 1;
      totalConfidence += citation.confidence || 0.5;
    });
    
    const averageConfidence = allCitations.length > 0 ? totalConfidence / allCitations.length : 0;
    const qualityScore = this.calculateQualityScore(allCitations);
    
    return {
      totalCitations: allCitations.length,
      standardsCoverage,
      averageConfidence,
      qualityScore
    };
  }

  /**
   * Calculate overall quality score for citations
   */
  private calculateQualityScore(citations: Citation[]): number {
    if (citations.length === 0) return 0;
    
    const confidenceScore = citations.reduce((sum, c) => sum + (c.confidence || 0.5), 0) / citations.length;
    const coverageScore = Math.min(citations.length / 10, 1); // Normalize to max 10 citations
    const justificationScore = citations.filter(c => c.justification && c.justification.length > 50).length / citations.length;
    
    return (confidenceScore + coverageScore + justificationScore) / 3;
  }
}
