import React, { useState } from 'react';
import { useRAG } from './hooks/useRAG';
import ChatMessage from './components/ChatMessage';
import DocumentPanel from './components/DocumentPanel';
import ChatInput from './components/ChatInput';
import { MessageSquare, Sparkles } from 'lucide-react';

function App() {
  const { documents, messages, isLoading, addDocument, deleteDocument, sendMessage } = useRAG();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="flex h-full">
        {/* Document Panel */}
        {isPanelOpen && (
          <DocumentPanel
            documents={documents}
            onUpload={addDocument}
            onDelete={deleteDocument}
            isOpen={isPanelOpen}
            onToggle={() => setIsPanelOpen(!isPanelOpen)}
          />
        )}
        
        {!isPanelOpen && (
          <DocumentPanel
            documents={documents}
            onUpload={addDocument}
            onDelete={deleteDocument}
            isOpen={isPanelOpen}
            onToggle={() => setIsPanelOpen(!isPanelOpen)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  RAG Chatbot
                </h1>
                <p className="text-blue-100 mt-1">
                  Ask questions about your uploaded documents
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">
                  {documents.length} document{documents.length !== 1 ? 's' : ''} loaded
                </div>
                <div className="text-xs text-blue-200">
                  {documents.reduce((acc, doc) => acc + doc.chunks.length, 0)} searchable chunks
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    Welcome to RAG Chatbot
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    Upload documents to your knowledge base and start asking questions. 
                    I'll search through your documents and provide answers with source references.
                  </p>
                  {documents.length === 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        👈 Start by uploading documents using the panel on the left
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="p-6 bg-white border-b border-slate-100">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-900">Assistant</span>
                          <span className="text-xs text-slate-500">Thinking...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-slate-500">Searching documents and generating response...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isLoading}
            disabled={documents.length === 0}
          />
        </div>
      </div>
    </div>
  );
}

export default App;