import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { FileUpload } from '@/components/resume-parser/FileUpload';
import { ProgramCard } from '@/components/resume-parser/ProgramCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzeResume } from '@/lib/utils/analyzeResume';
import { triggerConfetti } from '@/lib/utils/confetti';
import type { ProgramRecommendation } from '@/lib/utils/analyzeResume';

function App() {
  const [fileContent, setFileContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<ProgramRecommendation[] | null>(null);
  const [error, setError] = useState('');

  const handleFileUpload = (content: string) => {
    setFileContent(content);
    handleAnalyze(content);
  };

  const handleAnalyze = async (content: string) => {
    setIsAnalyzing(true);
    setError('');

    try {
      const results = analyzeResume(content);
      setRecommendations(results);
      if (results.length > 0) {
        triggerConfetti();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error analyzing resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E3877]/5 to-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <GraduationCap className="h-16 w-16 mx-auto text-[#1E3877] mb-4" />
          <h1 className="text-4xl font-bold text-[#1E3877] mb-2">Find Your Perfect Program</h1>
          <p className="text-lg text-gray-600">
            Upload your resume or paste your experience to get personalized program recommendations
          </p>
        </div>

        {/* File Upload */}
        <FileUpload onFileUpload={handleFileUpload} onError={setError} />

        {/* Text Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or paste your experience
          </label>
          <textarea
            className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:border-[#E84A27] focus:ring-[#E84A27]"
            placeholder="Paste your resume or describe your experience..."
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          onClick={() => handleAnalyze(fileContent)}
          disabled={isAnalyzing || !fileContent.trim()}
          className="w-full py-3 bg-[#E84A27] text-white rounded-xl font-medium hover:bg-[#E84A27]/90 transition-colors disabled:bg-[#E84A27]/50"
        >
          {isAnalyzing ? 'Analyzing your profile...' : 'Get Program Recommendations'}
        </button>

        {/* Results */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1E3877] text-center">
              Your Recommended Programs
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map((rec, index) => (
                <ProgramCard key={rec.program} recommendation={rec} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;