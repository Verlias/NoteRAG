import { Sparkles, Trash2 } from 'lucide-react';
import type { Message, StudyMode } from '../types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatAreaProps {
    messages: Message[];
    isLoading: boolean;
    studyMode: StudyMode;
    onSend: (content: string) => void;
    onClear: () => void;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    onHintClick: (hint: string) => void;
}

const MODE_LABELS: Record<StudyMode, string> = {
    explain: '💡 Explain Mode',
    quiz: '❓ Quiz Mode',
    summarize: '📖 Summarize Mode',
};

const HINTS = [
    'Explain the concept of RAG',
    'Quiz me on embeddings',
    'Summarize chapter 3',
    'What is cosine similarity?',
];

export default function ChatArea({
    messages,
    isLoading,
    studyMode,
    onSend,
    onClear,
    bottomRef,
    onHintClick,
}: ChatAreaProps) {
    const hasMessages = messages.length > 0;

    return (
        <main className="chat">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="chat__header">
                <div className="chat__header-title">Chat</div>
                <div className="chat__header-mode">{MODE_LABELS[studyMode]}</div>
                {hasMessages && (
                    <button className="chat__clear-btn" onClick={onClear}>
                        <Trash2 size={14} /> Clear
                    </button>
                )}
            </div>

            {/* ── Messages ────────────────────────────────────── */}
            <div className="chat__messages">
                {!hasMessages ? (
                    <div className="chat__welcome">
                        <div className="chat__welcome-icon">
                            <Sparkles size={32} color="white" />
                        </div>
                        <h1 className="chat__welcome-title">Ready to Study</h1>
                        <p className="chat__welcome-desc">
                            Upload your course materials and ask questions. I'll answer using
                            <strong> only</strong> your documents — no hallucinations, just your content.
                        </p>
                        <div className="chat__welcome-hints">
                            {HINTS.map((h) => (
                                <button key={h} className="chat__welcome-hint" onClick={() => onHintClick(h)}>
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}

                        {isLoading && (
                            <div className="typing">
                                <div className="typing__avatar">
                                    <Sparkles size={15} />
                                </div>
                                <div className="typing__dots">
                                    <span className="typing__dot" />
                                    <span className="typing__dot" />
                                    <span className="typing__dot" />
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            {/* ── Input ───────────────────────────────────────── */}
            <ChatInput onSend={onSend} disabled={isLoading} />
        </main>
    );
}
