import './index.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { useChat, useDocuments } from './hooks/useChat';

export default function App() {
  const { messages, isLoading, studyMode, setStudyMode, sendMessage, clearChat, bottomRef } = useChat();
  const { documents, isUploading, upload, remove } = useDocuments();

  return (
    <div className="app">
      <Sidebar
        studyMode={studyMode}
        onModeChange={setStudyMode}
        documents={documents}
        isUploading={isUploading}
        onUpload={upload}
        onDeleteDoc={remove}
      />
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        studyMode={studyMode}
        onSend={sendMessage}
        onClear={clearChat}
        bottomRef={bottomRef}
        onHintClick={sendMessage}
      />
    </div>
  );
}
