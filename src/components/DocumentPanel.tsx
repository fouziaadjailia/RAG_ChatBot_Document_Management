import React, { useState } from 'react';
import { FileText, Upload, Trash2, ChevronRight, ChevronDown, X } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  chunks: string[];
  uploadedAt: Date;
  size: number;
}

interface DocumentPanelProps {
  documents: Document[];
  onUpload: (title: string, content: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DocumentPanel({ documents, onUpload, onDelete, isOpen, onToggle }: DocumentPanelProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setNewDocTitle(file.name.replace(/\.[^/.]+$/, ''));
        setNewDocContent(content);
        setIsUploading(true);
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = () => {
    if (newDocTitle.trim() && newDocContent.trim()) {
      onUpload(newDocTitle.trim(), newDocContent.trim());
      setNewDocTitle('');
      setNewDocContent('');
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 border border-slate-200"
      >
        <FileText className="w-5 h-5 text-slate-600" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Knowledge Base
          </h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        
        <div className="space-y-3">
          <input
            type="file"
            accept=".txt,.md,.json"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </label>
          
          <div className="text-xs text-slate-600 bg-white/50 p-2 rounded">
            <strong>{documents.length}</strong> documents • <strong>{documents.reduce((acc, doc) => acc + doc.chunks.length, 0)}</strong> chunks
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs mt-1">Upload .txt, .md, or .json files to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-left">
                    <FileText className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-slate-800 text-sm truncate">
                        {doc.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatFileSize(doc.size)} • {doc.chunks.length} chunks
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(doc.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {expandedDoc === doc.id ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>
                
                {expandedDoc === doc.id && (
                  <div className="p-3 bg-white border-t border-slate-200">
                    <div className="text-xs text-slate-600 mb-2">
                      Uploaded: {doc.uploadedAt.toLocaleDateString()}
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs text-slate-700 bg-slate-50 p-2 rounded">
                      {doc.content.substring(0, 200)}...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isUploading && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <h3 className="font-medium text-slate-800 mb-3">Add Document</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Document title"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <textarea
              value={newDocContent}
              onChange={(e) => setNewDocContent(e.target.value)}
              placeholder="Document content"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add Document
              </button>
              <button
                onClick={() => setIsUploading(false)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}