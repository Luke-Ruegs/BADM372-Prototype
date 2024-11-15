import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
  onError: (message: string) => void;
}

export function FileUpload({ onFileUpload, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.match('text.*') && 
        !file.type.match('application/pdf') && 
        !file.type.match('application/msword') &&
        !file.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      onError('Please upload a valid document (TXT, PDF, DOC, or DOCX)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('File size should be less than 5MB');
      return;
    }

    try {
      const content = await file.text();
      onFileUpload(content);
    } catch (err) {
      onError('Error reading file content');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 transition-colors",
        isDragging
          ? "border-[#E84A27] bg-[#E84A27]/5"
          : "border-[#1E3877]/20 hover:border-[#1E3877]/40"
      )}
    >
      <label className="cursor-pointer block text-center">
        <Upload className="mx-auto h-12 w-12 text-[#1E3877] mb-4" />
        <span className="block text-lg font-medium text-[#1E3877] mb-2">
          {isDragging ? 'Drop your file here' : 'Drop your resume here'}
        </span>
        <span className="text-sm text-gray-500">
          or click to browse files (TXT, PDF, DOC, DOCX)
        </span>
        <input
          type="file"
          className="hidden"
          accept=".txt,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}