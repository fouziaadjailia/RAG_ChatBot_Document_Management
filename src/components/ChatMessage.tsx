import React from 'react';
import { Bot, User, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  content: string;
  relevance: number;
}

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    sources?: Source[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-slate-50' : 'bg-white'} border-b border-slate-100`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-slate-900">
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className="text-xs text-slate-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <ExternalLink size={14} />
              Sources Used
            </h4>
            <div className="space-y-2">
              {message.sources.map((source, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-800">{source.title}</span>
                    <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                      {Math.round(source.relevance * 100)}% match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {source.content.substring(0, 150)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}