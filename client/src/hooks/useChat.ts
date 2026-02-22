import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, StudyMode, UploadedDocument } from '../types';
import { queryRAG, uploadDocument, getDocuments, deleteDocument } from '../services/api';

// ── useChat ───────────────────────────────────────────────────────────

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [studyMode, setStudyMode] = useState<StudyMode>('explain');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || isLoading) return;

            const userMsg: Message = {
                id: crypto.randomUUID(),
                role: 'user',
                content: content.trim(),
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMsg]);
            setIsLoading(true);

            try {
                const response = await queryRAG({ query: content.trim(), mode: studyMode });

                const assistantMsg: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: response.answer,
                    sources: response.sources,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, assistantMsg]);
            } catch (err) {
                const errorMsg: Message = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: `⚠️ Something went wrong: ${err instanceof Error ? err.message : 'Unknown error'}`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMsg]);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, studyMode],
    );

    const clearChat = useCallback(() => setMessages([]), []);

    return { messages, isLoading, studyMode, setStudyMode, sendMessage, clearChat, bottomRef };
}

// ── useDocuments ──────────────────────────────────────────────────────

export function useDocuments() {
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const fetchDocuments = useCallback(async () => {
        try {
            const res = await getDocuments();
            setDocuments(res.documents);
        } catch (e) {
            console.error('Failed to fetch documents', e);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const upload = useCallback(
        async (file: File) => {
            setIsUploading(true);
            try {
                const doc = await uploadDocument(file);
                setDocuments((prev) => [...prev, doc]);
            } catch (e) {
                console.error('Upload failed', e);
            } finally {
                setIsUploading(false);
            }
        },
        [],
    );

    const remove = useCallback(async (id: string) => {
        try {
            await deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
        } catch (e) {
            console.error('Delete failed', e);
        }
    }, []);

    return { documents, isUploading, upload, remove };
}
