import { useRef, useState, useCallback } from 'react';
import { BookOpen, Lightbulb, HelpCircle, FileText, Upload, X, FolderOpen } from 'lucide-react';
import type { StudyMode, UploadedDocument } from '../types';

interface SidebarProps {
    studyMode: StudyMode;
    onModeChange: (mode: StudyMode) => void;
    documents: UploadedDocument[];
    isUploading: boolean;
    onUpload: (file: File) => void;
    onDeleteDoc: (id: string) => void;
}

const MODES: { key: StudyMode; label: string; icon: React.ReactNode }[] = [
    { key: 'explain', label: 'Explain', icon: <Lightbulb size={16} /> },
    { key: 'quiz', label: 'Quiz Me', icon: <HelpCircle size={16} /> },
    { key: 'summarize', label: 'Summarize', icon: <BookOpen size={16} /> },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Sidebar({
    studyMode,
    onModeChange,
    documents,
    isUploading,
    onUpload,
    onDeleteDoc,
}: SidebarProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;
            Array.from(files).forEach((f) => onUpload(f));
        },
        [onUpload],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles],
    );

    return (
        <aside className="sidebar">
            {/* ── Logo ──────────────────────────────────────────── */}
            <div className="sidebar__header">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">📚</div>
                    <div>
                        <div className="sidebar__title">StudyRAG</div>
                        <div className="sidebar__subtitle">AI Study Assistant</div>
                    </div>
                </div>
            </div>

            {/* ── Study Modes ───────────────────────────────────── */}
            <div className="modes">
                <div className="modes__label">Study Mode</div>
                <div className="modes__group">
                    {MODES.map((m) => (
                        <button
                            key={m.key}
                            className={`modes__btn ${studyMode === m.key ? 'modes__btn--active' : ''}`}
                            onClick={() => onModeChange(m.key)}
                        >
                            <span className="modes__btn-icon">{m.icon}</span>
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Documents ─────────────────────────────────────── */}
            <div className="docs">
                <div className="docs__label">Documents ({documents.length})</div>
                <div className="docs__list">
                    {documents.length === 0 ? (
                        <div className="docs__empty">
                            <FolderOpen size={28} className="docs__empty-icon" />
                            <div className="docs__empty-text">No documents yet.<br />Upload files to get started.</div>
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.id} className="docs__item">
                                <FileText size={18} className="docs__item-icon" />
                                <div className="docs__item-info">
                                    <div className="docs__item-name">{doc.name}</div>
                                    <div className="docs__item-meta">{formatSize(doc.size)}</div>
                                </div>
                                <button className="docs__item-delete" onClick={() => onDeleteDoc(doc.id)} title="Remove">
                                    <X size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Upload ────────────────────────────────────────── */}
            <div className="upload">
                <div
                    className={`upload__zone ${dragOver ? 'upload__zone--drag' : ''} ${isUploading ? 'upload__zone--uploading' : ''}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <Upload size={22} className="upload__icon" />
                    <div className="upload__text">
                        {isUploading ? 'Uploading…' : 'Drop files or click to upload'}
                    </div>
                    <div className="upload__hint">PDF, TXT, MD, PPTX</div>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    className="upload__input"
                    accept=".pdf,.txt,.md,.pptx"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>
        </aside>
    );
}
