import Markdown from 'react-markdown';
import { User, Sparkles } from 'lucide-react';
import type { Message } from '../types';
import SourceCards from './SourceCards';

interface MessageBubbleProps {
    message: Message;
}

function formatTime(d: Date): string {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`bubble bubble--${message.role}`}>
            <div className="bubble__avatar">
                {isUser ? <User size={16} /> : <Sparkles size={16} />}
            </div>
            <div className="bubble__body">
                <div className="bubble__content">
                    {isUser ? (
                        message.content
                    ) : (
                        <Markdown>{message.content}</Markdown>
                    )}
                </div>

                {!isUser && message.sources && <SourceCards sources={message.sources} />}

                <div className="bubble__timestamp">{formatTime(message.timestamp)}</div>
            </div>
        </div>
    );
}
