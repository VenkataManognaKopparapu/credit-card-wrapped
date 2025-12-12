
import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, X, AlertCircle, RefreshCw, FileText, Trash2, FileType } from 'lucide-react';
import { Button } from './Button';

interface UploadSectionProps {
  onFileProcess: (files: File[]) => void;
  onClose: () => void;
  isProcessing: boolean;
  error?: string | null;
  resetError?: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileProcess, onClose, isProcessing, error, resetError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    // Reset input value to allow re-uploading the same file if needed after removal
    if (inputRef.current) {
        inputRef.current.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
      if (resetError) resetError();
      setLocalError('');
      
      const validFiles = newFiles.filter(file => 
        file.type === "text/csv" || 
        file.name.toLowerCase().endsWith('.csv') || 
        file.type === "text/plain" ||
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith('.pdf')
      );

      if (validFiles.length !== newFiles.length) {
          setLocalError('Some files were skipped. Please upload valid CSV or PDF files.');
      }

      console.log("Files selected:", validFiles.map(f => f.name));
      
      setFiles(prev => {
          // Prevent exact duplicates by name
          const existingNames = new Set(prev.map(f => f.name));
          const uniqueNewFiles = validFiles.filter(f => !existingNames.has(f.name));
          return [...prev, ...uniqueNewFiles];
      });
  };

  const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
      setFiles([]);
      setLocalError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.toLowerCase().endsWith('.pdf')) {
      return <FileType className="text-red-500 w-5 h-5" />;
    }
    return <FileText className="text-emerald-500 w-5 h-5" />;
  };

  const displayError = error || localError;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl ring-1 ring-black/5 flex flex-col max-h-[90vh]">
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload your data 📄</h2>
          <p className="text-slate-500">Upload CSV or PDF files from one or multiple cards. We'll combine them.</p>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 mb-4 px-1">
            {!displayError ? (
            <div className="space-y-4">
                <div 
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer
                    ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input 
                        ref={inputRef}
                        type="file" 
                        className="hidden" 
                        accept=".csv,.txt,.pdf"
                        multiple // Allow multiple files
                        onChange={handleChange}
                    />
                    
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 font-medium mb-1">Click to add CSV or PDF files</p>
                    <p className="text-slate-400 text-sm">or drag and drop here</p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                            <span>{files.length} file{files.length !== 1 ? 's' : ''} ready</span>
                            <button onClick={clearFiles} className="text-red-500 hover:text-red-600 text-xs font-medium">Clear All</button>
                        </div>
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group animate-fade-in-up">
                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                                    {getFileIcon(file.name)}
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                            {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'CSV'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                </div>
                                <button 
                                    onClick={() => removeFile(index)}
                                    className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            ) : (
            <div className="border-2 border-red-100 bg-red-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-slate-900 font-bold text-lg mb-2">Oops!</h3>
                <p className="text-red-500 text-sm mb-6 whitespace-pre-line">{displayError}</p>
                <Button variant="outline" size="sm" onClick={() => { setLocalError(''); if(resetError) resetError(); }} className="border-red-200 text-red-600 hover:bg-red-50">
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
            </div>
            )}
        </div>

        <div className="mt-4 shrink-0">
          <Button 
            variant="secondary" 
            className="w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={files.length === 0 || isProcessing || !!displayError}
            onClick={(e) => {
              e.stopPropagation();
              if (files.length > 0) onFileProcess(files);
            }}
          >
            {isProcessing ? `Processing ${files.length} Files...` : 'Process Files'}
          </Button>
        </div>
      </div>
    </div>
  );
};
