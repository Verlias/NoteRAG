import { useState, useRef, useCallback, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (content: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [value]);

    const handleSend = useCallback(() => {
        if (!value.trim() || disabled) return;
        onSend(value);
        setValue('');
    }, [value, disabled, onSend]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend],
    );

    return (
        <div className="chat__input-area">
            <div className="chat__input-wrapper">
                <textarea
                    ref={textareaRef}
                    className="chat__textarea"
                    placeholder="Ask a question about your study materials…"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={disabled}
                />
                <button
                    className="chat__send-btn"
                    onClick={handleSend}
                    disabled={disabled || !value.trim()}
                    title="Send message"
                >
                    <Send size={18} />
                </button>
            </div>
            <div className="chat__input-hint">
                Press <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for new line
            </div>
        </div>
    );
}
