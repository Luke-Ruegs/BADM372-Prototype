import { Clock, BookOpen, Users, Calendar, GraduationCap, BookText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProgramRecommendation } from '@/lib/utils/analyzeResume';

interface ProgramCardProps {
  recommendation: ProgramRecommendation;
  index: number;
}

export function ProgramCard({ recommendation: rec, index }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-2 ${index === 0 ? 'bg-[#E84A27]' : 'bg-[#1E3877]'}`} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-[#1E3877]">{rec.program}</CardTitle>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              rec.confidence >= 80
                ? "bg-green-100 text-green-800"
                : rec.confidence >= 60
                ? "bg-[#E84A27]/10 text-[#E84A27]"
                : "bg-gray-100 text-gray-800"
            )}
          >
            {rec.confidence}% Match
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{rec.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-[#E84A27]" />
            <span className="text-sm">{rec.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-[#E84A27]" />
            <span className="text-sm">Starts: {rec.startDates.join(' or ')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-[#E84A27]" />
            <span className="text-sm">{rec.requirements}</span>
          </div>
        </div>

        {rec.coreCourses && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 flex items-center">
              <BookText className="h-4 w-4 text-[#E84A27] mr-2" />
              Core Courses
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside ml-2">
              {rec.coreCourses.map((course, i) => (
                <li key={i}>{course}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Matching Skills</p>
          <div className="flex flex-wrap gap-2">
            {rec.matches.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-[#1E3877]/5 text-[#1E3877] rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {(rec.specializations || rec.concentrations) && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              {rec.specializations ? 'Specializations' : 'Concentrations'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(rec.specializations || rec.concentrations)?.map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-[#E84A27]/5 text-[#E84A27] rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Career Paths</p>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#E84A27]" />
            <span className="text-sm">{rec.careers.join(', ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}