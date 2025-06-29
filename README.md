# RAG Chatbot with Document Management

A sophisticated **Retrieval-Augmented Generation (RAG)** chatbot built with React, TypeScript, and Tailwind CSS. This application allows users to upload documents, automatically processes them into searchable chunks, and provides intelligent responses to questions based on the uploaded content.

## 🌟 Live Demo

**Deployed Application**: [https://cool-sundae-fc0ea9.netlify.app](https://cool-sundae-fc0ea9.netlify.app)

## 🚀 Features

### Core Functionality
- **Document Upload & Management**: Support for `.txt`, `.md`, and `.json` files
- **Intelligent Text Chunking**: Automatically splits documents into optimized chunks for better retrieval
- **Semantic Search**: Advanced similarity scoring using keyword overlap and phrase matching
- **Source Attribution**: Every response includes references to the source documents with relevance scores
- **Real-time Chat Interface**: Smooth, responsive chat experience with typing indicators

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Collapsible Document Panel**: Clean interface that can be minimized when not needed
- **Document Preview**: Expandable document cards showing content previews and metadata
- **Visual Feedback**: Loading states, animations, and micro-interactions
- **Error Handling**: Graceful error handling with user-friendly messages

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Custom Hooks**: Modular architecture with reusable logic
- **Component-Based Architecture**: Clean separation of concerns
- **Modern React Patterns**: Hooks, functional components, and optimized re-renders

## 🏗️ Architecture Overview

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ChatInput.tsx    # Message input with auto-resize
│   ├── ChatMessage.tsx  # Message display with source attribution
│   └── DocumentPanel.tsx # Document management sidebar
├── hooks/               # Custom React hooks
│   └── useRAG.ts       # Core RAG logic and state management
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

### Core Components

#### 1. **useRAG Hook** (`src/hooks/useRAG.ts`)
The heart of the application, implementing:
- **Document Management**: Add, delete, and store documents
- **Text Chunking Algorithm**: Intelligent splitting with overlap for context preservation
- **Similarity Scoring**: Jaccard similarity with phrase matching boost
- **Response Generation**: Mock AI response generation with context integration
- **State Management**: Centralized state for documents, messages, and loading states

#### 2. **Document Processing Pipeline**
```typescript
Document Upload → Text Chunking → Indexing → Retrieval → Response Generation
```

**Text Chunking Strategy**:
- Splits text at sentence boundaries
- Maintains 500-character chunks with 50-character overlap
- Preserves context across chunk boundaries
- Handles edge cases for very short or long documents

**Similarity Scoring Algorithm**:
- **Jaccard Similarity**: Measures keyword overlap between query and chunks
- **Phrase Matching**: Bonus scoring for exact phrase matches
- **Relevance Threshold**: Filters out low-relevance results (< 10%)
- **Top-K Retrieval**: Returns the 3 most relevant chunks

#### 3. **Chat Interface** (`src/components/ChatMessage.tsx`)
- **Dual Message Types**: User and assistant message styling
- **Source Attribution**: Expandable source references with relevance scores
- **Timestamp Display**: Human-readable message timing
- **Rich Content Support**: Preserves formatting and line breaks

#### 4. **Document Panel** (`src/components/DocumentPanel.tsx`)
- **File Upload**: Drag-and-drop support for multiple file types
- **Document Cards**: Expandable previews with metadata
- **Bulk Operations**: Delete documents with confirmation
- **Statistics Display**: Real-time document and chunk counts

#### 5. **Smart Chat Input** (`src/components/ChatInput.tsx`)
- **Auto-Resize Textarea**: Expands with content up to maximum height
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Loading States**: Visual feedback during processing
- **Input Validation**: Prevents empty messages and handles edge cases

## 🛠️ Technical Implementation

### RAG (Retrieval-Augmented Generation) Process

1. **Document Ingestion**
   ```typescript
   const chunkText = (text: string, chunkSize: number = 500, overlap: number = 50)
   ```
   - Splits documents into semantic chunks
   - Maintains context with overlapping boundaries
   - Optimizes chunk size for retrieval accuracy

2. **Query Processing**
   ```typescript
   const calculateSimilarity = (query: string, text: string): number
   ```
   - Tokenizes query and document chunks
   - Calculates Jaccard similarity coefficient
   - Applies phrase matching bonuses
   - Returns normalized relevance scores

3. **Context Retrieval**
   ```typescript
   const retrieveRelevantChunks = (query: string, topK: number = 3)
   ```
   - Searches across all document chunks
   - Ranks by relevance score
   - Returns top-K most relevant passages
   - Includes source attribution metadata

4. **Response Generation**
   ```typescript
   const generateResponse = async (query: string, sources: Source[])
   ```
   - Combines retrieved context into coherent response
   - Simulates AI processing with realistic delays
   - Handles cases with insufficient context
   - Provides source transparency

### State Management Strategy

The application uses React's built-in state management with custom hooks:

```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  chunks: string[];
  uploadedAt: Date;
  size: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}
```

### Performance Optimizations

- **Memoized Callbacks**: Prevents unnecessary re-renders
- **Efficient Chunking**: Optimized text processing algorithms
- **Lazy Loading**: Components render only when needed
- **Debounced Operations**: Smooth user interactions

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-blue-600 to-purple-600`)
- **Secondary**: Slate grays for text and borders
- **Accent**: Blue for interactive elements
- **Status**: Semantic colors for success, warning, error states

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body Text**: Optimized line height (1.6) for readability
- **Code**: Monospace font for technical content
- **UI Text**: Clean, modern sans-serif

### Layout Principles
- **Responsive Grid**: Flexible layouts for all screen sizes
- **Consistent Spacing**: 8px base unit system
- **Visual Hierarchy**: Clear information architecture
- **Accessibility**: WCAG compliant color contrasts and focus states

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rag-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## 📝 Usage Guide

### Uploading Documents

1. **Click "Upload Document"** in the left panel
2. **Select files** (`.txt`, `.md`, `.json` supported)
3. **Review and edit** title and content if needed
4. **Click "Add Document"** to process and index

### Asking Questions

1. **Type your question** in the chat input
2. **Press Enter** or click the send button
3. **Review the response** with source attributions
4. **Explore sources** by expanding the source cards

### Managing Documents

- **View document details** by clicking the expand arrow
- **Delete documents** using the trash icon
- **Monitor statistics** in the panel header
- **Toggle panel visibility** using the collapse button

## 🔧 Configuration

### Chunking Parameters
```typescript
// Adjust in src/hooks/useRAG.ts
const chunkSize = 500;      // Characters per chunk
const overlap = 50;         // Overlap between chunks
const topK = 3;            // Number of sources to retrieve
```

### Similarity Thresholds
```typescript
// Minimum relevance for inclusion
const relevanceThreshold = 0.1;  // 10%
```

## 🧪 Testing Strategy

The application includes comprehensive error handling and edge case management:

- **Empty document handling**
- **Large file processing**
- **Network error recovery**
- **Invalid file format handling**
- **Query processing edge cases**

## 🚀 Deployment

The application is deployed on **Netlify** with automatic builds:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18.x
- **Environment**: Production optimized

### Deployment URL
[https://cool-sundae-fc0ea9.netlify.app](https://cool-sundae-fc0ea9.netlify.app)

## 🔮 Future Enhancements

### Planned Features
- **Vector Embeddings**: Implement semantic search with embeddings
- **Multiple File Formats**: Support for PDF, DOCX, and other formats
- **Advanced Chunking**: Semantic chunking based on document structure
- **Export Functionality**: Save conversations and document collections
- **Search History**: Persistent query history and favorites

### Technical Improvements
- **Real AI Integration**: Connect to OpenAI, Anthropic, or local LLMs
- **Database Storage**: Persistent document and conversation storage
- **Advanced Analytics**: Usage metrics and performance monitoring
- **Multi-language Support**: Internationalization and localization

## 🤝 Contributing

This project demonstrates modern React development practices and RAG implementation patterns. Key areas for contribution:

1. **Algorithm Improvements**: Enhanced similarity scoring and chunking
2. **UI/UX Enhancements**: Additional animations and interactions
3. **Performance Optimization**: Faster search and processing
4. **Feature Extensions**: New document types and export options

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies:
- **React 18** - Component framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tooling
- **Lucide React** - Beautiful icons
- **Netlify** - Deployment and hosting

---

**Created with ❤️ using modern web development best practices**