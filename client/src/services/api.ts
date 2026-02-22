import type { QueryRequest, QueryResponse, UploadedDocument, DocumentListResponse } from '../types';

const MOCK = import.meta.env.VITE_MOCK === 'true';

// ── Mock helpers ──────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_SOURCES = [
    {
        chunk_text:
            'Retrieval-Augmented Generation (RAG) combines retrieval of relevant documents with language model generation to produce grounded, accurate answers.',
        source: 'lecture_notes.pdf — p.12',
        score: 0.94,
    },
    {
        chunk_text:
            'Cosine similarity measures the angle between two vectors, making it ideal for comparing text embeddings in high-dimensional space.',
        source: 'textbook_ch3.pdf — p.47',
        score: 0.87,
    },
    {
        chunk_text:
            'BM25 is a probabilistic ranking function widely used by search engines. It accounts for term frequency saturation and document length normalization.',
        source: 'ir_slides.pptx — slide 8',
        score: 0.72,
    },
];

let mockDocs: UploadedDocument[] = [
    {
        id: 'mock-1',
        name: 'lecture_notes.pdf',
        size: 245000,
        uploadedAt: new Date('2026-02-20'),
        type: 'application/pdf',
    },
    {
        id: 'mock-2',
        name: 'textbook_ch3.pdf',
        size: 1200000,
        uploadedAt: new Date('2026-02-19'),
        type: 'application/pdf',
    },
];

async function mockQuery(req: QueryRequest): Promise<QueryResponse> {
    await delay(1200);

    const modePrefix: Record<string, string> = {
        explain:
            '## Explanation\n\nRetrieval-Augmented Generation (RAG) enhances language model responses by first **retrieving** relevant passages from a knowledge base, then using those passages as context for generation.\n\nThis two-stage approach solves a key LLM limitation: models can only rely on their training data, which may be outdated or incomplete. By grounding answers in **your actual course materials**, RAG ensures factual accuracy.\n\n### Key Steps\n1. **Document ingestion** — text extraction, chunking, embedding\n2. **Query embedding** — convert your question to the same vector space\n3. **Retrieval** — find top-K most similar chunks via cosine similarity\n4. **Generation** — feed retrieved chunks + question to the LLM',
        quiz: '## Quiz Time! 🧠\n\n**Question 1:** What is the primary advantage of RAG over a standard LLM?\n\n<details><summary>Show Answer</summary>\n\nRAG grounds its answers in retrieved documents, reducing hallucination and ensuring responses are based on actual source material.\n\n</details>\n\n**Question 2:** Which similarity metric is commonly used for comparing text embeddings?\n\n<details><summary>Show Answer</summary>\n\nCosine similarity — it measures the angle between two vectors in high-dimensional space.\n\n</details>',
        summarize:
            '## Summary\n\n**RAG (Retrieval-Augmented Generation)** is a two-phase system:\n\n- **Phase 1 — Retrieval:** User queries are embedded and compared against a vector store of document chunks using cosine similarity. The top-K most relevant chunks are returned.\n- **Phase 2 — Generation:** Retrieved chunks are injected into the LLM prompt as context. The model generates an answer grounded strictly in this context.\n\nThis architecture prevents hallucination by constraining the model to user-provided course materials.',
    };

    return {
        answer: modePrefix[req.mode] || modePrefix.explain,
        sources: MOCK_SOURCES,
    };
}

// ── Real API calls ────────────────────────────────────────────────────

async function realQuery(req: QueryRequest): Promise<QueryResponse> {
    const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Query failed: ${res.statusText}`);
    return res.json();
}

async function realUpload(file: File): Promise<UploadedDocument> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return res.json();
}

async function realGetDocuments(): Promise<DocumentListResponse> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error(`Fetch documents failed: ${res.statusText}`);
    return res.json();
}

// ── Exported façade ───────────────────────────────────────────────────

export async function queryRAG(req: QueryRequest): Promise<QueryResponse> {
    return MOCK ? mockQuery(req) : realQuery(req);
}

export async function uploadDocument(file: File): Promise<UploadedDocument> {
    if (MOCK) {
        await delay(800);
        const doc: UploadedDocument = {
            id: `mock-${Date.now()}`,
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
            type: file.type,
        };
        mockDocs = [...mockDocs, doc];
        return doc;
    }
    return realUpload(file);
}

export async function getDocuments(): Promise<DocumentListResponse> {
    if (MOCK) {
        await delay(300);
        return { documents: mockDocs };
    }
    return realGetDocuments();
}

export async function deleteDocument(id: string): Promise<void> {
    if (MOCK) {
        await delay(300);
        mockDocs = mockDocs.filter((d) => d.id !== id);
        return;
    }
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
}
