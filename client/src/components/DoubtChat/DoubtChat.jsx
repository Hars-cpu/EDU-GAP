import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverurl } from "../../main";

import ChatHeader from "./ChatHeader";
import ChatPanel from "./ChatPanel";
import {
  DEFAULT_MESSAGES,
} from "./constants";
import SourceModal from "./SourceModal";
import SourcesPanel from "./SourcesPanel";

export default function DoubtChat({
  initialSources = [],
  initialMessages = DEFAULT_MESSAGES.slice(0, 1),
  userInitial = "A",
  title = "Learn smarter.",
}) {
  const [sources, setSources] = useState(initialSources);
  const [messages, setMessages] = useState(initialMessages);
  const [composerValue, setComposerValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSourceType, setActiveSourceType] = useState("pdf");
  const [sourceFilter, setSourceFilter] = useState("pdf");
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sourceReady, setSourceReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(-1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadSources = async () => {
      try {
        const response = await axios.get(`${serverurl}/api/chatbot/sources`, {
          withCredentials: true,
        });
        if (isMounted) setSources(response.data.sources || []);
      } catch (error) {
        console.error(
          error.response?.data?.message || error.message,
          "Failed to load chatbot sources"
        );
      }
    };

    loadSources();

    return () => {
      isMounted = false;
    };
  }, []);

  const sourceCount = sources.length;
  const isKnowledgeReady = sourceCount > 0;
  const visibleSources = useMemo(
    () => sources.filter((source) => source.type === sourceFilter),
    [sourceFilter, sources]
  );

  const resetModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setSourceUrl("");
    setUploadProgress(0);
    setSourceReady(false);
    setIsProcessing(false);
  };

  const openSourceModal = (type = "pdf") => {
    setActiveSourceType(type);
    setModalOpen(true);
  };

  const resetSourceDraft = (type) => {
    setActiveSourceType(type);
    setSelectedFile(null);
    setSourceUrl("");
    setUploadProgress(0);
    setSourceReady(false);
  };

  const simulateSourcePrep = () => {
    setSourceReady(false);
    setUploadProgress(25);
    window.setTimeout(() => setUploadProgress(58), 180);
    window.setTimeout(() => setUploadProgress(84), 360);
    window.setTimeout(() => {
      setUploadProgress(100);
      setSourceReady(true);
    }, 560);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    simulateSourcePrep();
  };

  const handleFileChange = (event) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const addSource = async () => {
    const isUrl = activeSourceType === "url";
    if ((isUrl && !sourceUrl.trim()) || (!isUrl && !selectedFile)) return;

    const trimmedUrl = sourceUrl.trim();
    const urlName = trimmedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    const newSource = {
      id: `source-${Date.now()}`,
      type: activeSourceType,
      name: isUrl ? urlName : selectedFile.name,
      meta: isUrl
        ? trimmedUrl
        : `${Math.max(1, Math.round(selectedFile.size / 1024))} KB`,
    };

    setIsProcessing(true);
    try {
      const body = new FormData();
      body.append("type", activeSourceType);
      body.append("name", newSource.name);
      if (isUrl) body.append("url", trimmedUrl);
      else body.append("file", selectedFile);
      const response = await axios.post(`${serverurl}/api/chatbot/sources`, body, {
        withCredentials: true,
      });
      setSources(response.data.sources);
      setSourceFilter(activeSourceType);
      resetModal();
    } catch {
      setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    const text = composerValue.trim();
    if (!text || !isKnowledgeReady || isProcessing) return;

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
    setComposerValue("");
    setIsProcessing(true);
    setWorkflowStep(0);

    try {
      setWorkflowStep(1);
      const response = await axios.post(
        `${serverurl}/api/chatbot/chat`,
        { message: text },
        { withCredentials: true }
      );
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: response.data.answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `error-${Date.now()}`, role: "assistant", text: "I couldn't reach the chatbot service. Please try again." },
      ]);
    } finally {
      setIsProcessing(false);
      setWorkflowStep(-1);
    }
  };

  return (
    <section
      className="min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,143,104,0.16),transparent_34%),linear-gradient(135deg,#effaf6,#f8fbfa_48%,#eef8f4)] text-slate-900"
      aria-label="Ask your doubts workspace"
    >
      <ChatHeader title={title} userInitial={userInitial} />

      <main className="flex min-h-[calc(100vh-118px)] w-full flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:px-8 xl:px-10">
        <SourcesPanel
          sourceCount={sourceCount}
          sourceFilter={sourceFilter}
          visibleSources={visibleSources}
          isKnowledgeReady={isKnowledgeReady}
          onOpenSourceModal={openSourceModal}
          onSourceFilterChange={setSourceFilter}
          onDeleteSource={async (id) => {
            try {
              const response = await axios.delete(`${serverurl}/api/chatbot/sources/${id}`, {
                withCredentials: true,
              });
              setSources(response.data.sources);
            } catch {
              setSources((current) => current.filter((item) => item.id !== id));
            }
          }}
        />

        <ChatPanel
          sourceCount={sourceCount}
          isKnowledgeReady={isKnowledgeReady}
          messages={messages}
          composerValue={composerValue}
          isProcessing={isProcessing}
          workflowStep={workflowStep}
          onOpenSourceModal={openSourceModal}
          onComposerChange={setComposerValue}
          onSend={handleSend}
        />
      </main>

      <AnimatePresence>
        {modalOpen && (
          <SourceModal
            type={activeSourceType}
            selectedFile={selectedFile}
            sourceUrl={sourceUrl}
            uploadProgress={uploadProgress}
            sourceReady={sourceReady}
            isProcessing={isProcessing}
            fileInputRef={fileInputRef}
            onClose={resetModal}
            onTypeChange={resetSourceDraft}
            onFileChange={handleFileChange}
            onFileDrop={handleFileSelect}
            onUrlChange={setSourceUrl}
            onAdd={addSource}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
