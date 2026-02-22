import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Source } from '../types';

interface SourceCardProps {
    sources: Source[];
}

function scoreColor(score: number): string {
    if (score >= 0.85) return 'var(--success)';
    if (score >= 0.6) return 'var(--warning)';
    return 'var(--danger)';
}

export default function SourceCards({ sources }: SourceCardProps) {
    const [open, setOpen] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="sources">
            <div className="sources__label" onClick={() => setOpen(!open)}>
                <ChevronRight
                    size={14}
                    className={`sources__toggle-icon ${open ? 'sources__toggle-icon--open' : ''}`}
                />
                {sources.length} source{sources.length > 1 ? 's' : ''} cited
            </div>

            {open &&
                sources.map((src, i) => (
                    <div key={i} className="source-card">
                        <div className="source-card__header">
                            <span className="source-card__name">{src.source}</span>
                            <span className="source-card__score">
                                {(src.score * 100).toFixed(0)}%
                                <span className="source-card__score-bar">
                                    <span
                                        className="source-card__score-fill"
                                        style={{
                                            width: `${src.score * 100}%`,
                                            background: scoreColor(src.score),
                                        }}
                                    />
                                </span>
                            </span>
                        </div>
                        <div className="source-card__text">{src.chunk_text}</div>
                    </div>
                ))}
        </div>
    );
}
