import { useState, useCallback } from 'react';

interface Document {
  id: string;
  title: string;
  content: string;
  chunks: string[];
  uploadedAt: Date;
  size: number;
}

interface Source {
  title: string;
  content: string;
  relevance: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}

export function useRAG() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Chunk text into smaller pieces for better retrieval
  const chunkText = (text: string, chunkSize: number = 500, overlap: number = 50): string[] => {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        // Keep some overlap
        const words = currentChunk.split(' ');
        currentChunk = words.slice(-overlap / 10).join(' ') + ' ' + sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.length > 0 ? chunks : [text];
  };

  // Simple similarity scoring based on keyword overlap
  const calculateSimilarity = (query: string, text: string): number => {
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const textWords = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    
    const querySet = new Set(queryWords);
    const textSet = new Set(textWords);
    
    const intersection = new Set([...querySet].filter(w => textSet.has(w)));
    const union = new Set([...querySet, ...textSet]);
    
    // Jaccard similarity + keyword frequency boost
    const jaccard = intersection.size / union.size;
    
    // Boost score for exact phrase matches
    let phraseBoost = 0;
    const queryPhrases = query.toLowerCase().match(/\b\w+\s+\w+\b/g) || [];
    for (const phrase of queryPhrases) {
      if (text.toLowerCase().includes(phrase)) {
        phraseBoost += 0.3;
      }
    }
    
    return Math.min(jaccard + phraseBoost, 1);
  };

  // Retrieve relevant chunks for a query
  const retrieveRelevantChunks = (query: string, topK: number = 3): Source[] => {
    const allChunks: { chunk: string; docTitle: string; score: number }[] = [];
    
    documents.forEach(doc => {
      doc.chunks.forEach(chunk => {
        const score = calculateSimilarity(query, chunk);
        if (score > 0.1) { // Minimum relevance threshold
          allChunks.push({
            chunk,
            docTitle: doc.title,
            score
          });
        }
      });
    });
    
    // Sort by relevance and take top K
    return allChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => ({
        title: item.docTitle,
        content: item.chunk,
        relevance: item.score
      }));
  };

  // Generate response using retrieved context
  const generateResponse = async (query: string, sources: Source[]): Promise<string> => {
    // Simulate AI response generation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (sources.length === 0) {
      return "I don't have enough information in the uploaded documents to answer your question. Please try uploading relevant documents or asking about topics covered in your knowledge base.";
    }
    
    const context = sources.map(s => s.content).join('\n\n');
    
    // This would typically call an LLM API like OpenAI
    // For demo purposes, we'll create a mock response
    const responses = [
      `Based on the documents you've uploaded, I can provide the following information: ${context.substring(0, 200)}... 

This information comes from ${sources.length} relevant source${sources.length > 1 ? 's' : ''} in your knowledge base. The most relevant match was from "${sources[0].title}" with ${Math.round(sources[0].relevance * 100)}% relevance.`,
      
      `According to your uploaded documents, here's what I found: ${context.substring(0, 150)}...

The answer is derived from ${sources.length} document chunk${sources.length > 1 ? 's' : ''}, with the highest relevance score being ${Math.round(sources[0].relevance * 100)}%.`,
      
      `I found relevant information in your knowledge base: ${context.substring(0, 180)}...

This response is based on ${sources.length} matching section${sources.length > 1 ? 's' : ''} from your documents, particularly from "${sources[0].title}".`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const addDocument = useCallback((title: string, content: string) => {
    const chunks = chunkText(content);
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      content,
      chunks,
      uploadedAt: new Date(),
      size: content.length
    };
    
    setDocuments(prev => [...prev, newDoc]);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Retrieve relevant chunks
      const sources = retrieveRelevantChunks(content);
      
      // Generate response
      const response = await generateResponse(content, sources);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I encountered an error while processing your question. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [documents]);

  return {
    documents,
    messages,
    isLoading,
    addDocument,
    deleteDocument,
    sendMessage
  };
}