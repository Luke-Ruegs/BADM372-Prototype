import { programs } from '../constants/programs';

export type ProgramRecommendation = {
  program: string;
  confidence: number;
  matches: string[];
  duration: string;
  requirements: string;
  careers: string[];
  description: string;
  specializations?: string[];
  concentrations?: string[];
  coreCourses?: string[];
  startDates: string[];
};

export const analyzeResume = (text: string): ProgramRecommendation[] => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: Resume text is required');
  }

  const lowercaseText = text.toLowerCase();
  const results: ProgramRecommendation[] = [];

  try {
    Object.entries(programs).forEach(([programName, details]) => {
      const matches = details.keywords.filter(keyword => 
        lowercaseText.includes(keyword.toLowerCase())
      );

      if (matches.length > 0) {
        // Calculate base score from keyword matches
        let baseScore = (matches.length / details.keywords.length) * 100;
        
        // Bonus points for specific conditions
        const hasRelevantDegree = lowercaseText.includes('bachelor') || 
                                 lowercaseText.includes('bs') || 
                                 lowercaseText.includes('ba');
        
        const hasRelevantExperience = matches.some(keyword => 
          lowercaseText.includes(`experience in ${keyword}`) ||
          lowercaseText.includes(`${keyword} experience`)
        );

        // Apply bonuses
        if (hasRelevantDegree) baseScore += 10;
        if (hasRelevantExperience) baseScore += 15;

        // Cap the final score at 100
        const finalScore = Math.min(100, Math.round(baseScore));
        
        results.push({
          program: programName,
          confidence: finalScore,
          matches: matches,
          duration: details.duration,
          requirements: details.requirements,
          careers: details.careers,
          description: details.description,
          specializations: 'specializations' in details ? details.specializations : undefined,
          concentrations: 'concentrations' in details ? details.concentrations : undefined,
          coreCourses: 'coreCourses' in details ? details.coreCourses : undefined,
          startDates: details.startDates
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume content');
  }
};