import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Quote,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  FileText,
  RefreshCw,
  HelpCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useDocumentContext } from '../../context/DocumentContext';
import { askDocumentQuestion } from '../../services/api';
import { ChatMessage } from '../../types/document';

export const DocumentChatView: React.FC = () => {
  const { activeDocument, setCurrentView } = useDocumentContext();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Hello! I am your ClauseGuard Document Assistant. Ask me anything about this contract. Every response is grounded exclusively in the uploaded document text with verbatim citations and page numbers. If something is not in the contract, I will explicitly let you know.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sampleQuestions = [
    'What are the termination notice requirements?',
    'Is there an automatic renewal clause and what is the window?',
    'What is the maximum liability cap for each party?',
    'What happens in the event of a security or data breach?',
    'What are the payment terms and late fee penalties?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || !activeDocument || isLoading) return;

    setInputQuestion('');

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await askDocumentQuestion(
        activeDocument.rawText,
        activeDocument.pages,
        q,
        history
      );

      const botMessage: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: res.citations,
        confidence: res.confidence,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content:
          'An error occurred while querying the document context. Please verify server connectivity or try rephrasing your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!activeDocument) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <MessageSquareText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Contract Active</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a contract to ask questions.</p>
        <button
          onClick={() => setCurrentView('upload')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Select Contract
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[550px] animate-in fade-in duration-200">
      {/* Top Contract Context Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 truncate">
                {activeDocument.fileName}
              </span>
              {activeDocument.isSample && (
                <span className="text-[10px] text-slate-400 font-medium">
                  · Benchmark Data
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Grounded across <span className="font-mono tabular-nums">{activeDocument.pageCount}</span> pages · Strict passage evidence
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-msg',
                role: 'assistant',
                content: 'Chat session reset. What question can I research in this contract?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 p-4 md:p-6 shadow-xs overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-300" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 pb-1">
                  <span className="font-semibold">{isUser ? 'You' : 'ClauseGuard Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounded Citation Chips if provided by assistant */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Supporting Passages & Page References:
                    </span>
                    {msg.citations.map((cite, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1"
                      >
                        <div className="flex items-center justify-between font-sans text-[10px] text-blue-700 font-semibold">
                          <span>Page {cite.pageNumber}</span>
                          <span className="text-emerald-600">Verbatim Excerpt</span>
                        </div>
                        <p className="italic text-slate-800">"{cite.quote}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {!isUser && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-[10px] font-medium transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-300" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Searching contract passages and validating evidence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[11px] text-slate-400 font-semibold shrink-0">Suggestions:</span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
          placeholder="Ask a question about this contract (e.g., 'What are the indemnity liabilities?')..."
          className="flex-1 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuestion.trim() || isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </div>
    </div>
  );
};
