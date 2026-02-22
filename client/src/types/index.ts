export type StudyMode = 'explain' | 'quiz' | 'summarize';

export interface Source {
    chunk_text: string;
    source: string;
    score: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    timestamp: Date;
}

export interface UploadedDocument {
    id: string;
    name: string;
    size: number;
    uploadedAt: Date;
    type: string;
}

export interface QueryRequest {
    query: string;
    mode: StudyMode;
}

export interface QueryResponse {
    answer: string;
    sources: Source[];
}

export interface DocumentListResponse {
    documents: UploadedDocument[];
}
