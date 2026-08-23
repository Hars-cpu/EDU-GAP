import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowUp,
  FiCheck,
  FiMessageCircle,
  FiPaperclip,
  FiSearch,
} from "react-icons/fi";

import { WORKFLOW_STEPS, panelMotion } from "./constants";

export default function ChatPanel({
  sourceCount,
  isKnowledgeReady,
  messages,
  composerValue,
  isProcessing,
  workflowStep,
  onOpenSourceModal,
  onComposerChange,
  onSend,
}) {
  return (
    <motion.section
      variants={panelMotion}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35, delay: 0.08 }}
      className="grid min-h-[620px] min-w-0 flex-1 grid-rows-[auto_1fr_auto] overflow-hidden rounded-[22px] border border-emerald-950/5 bg-white shadow-[0_18px_45px_rgba(37,98,82,0.08)]"
      aria-label="Ask your doubts"
    >
      <header className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 lg:px-8">
        <motion.span
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl text-[#008f68]"
        >
          <FiMessageCircle />
        </motion.span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Ask your doubts
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Ask questions grounded in your learning material
          </p>
        </div>
      </header>

      <div className="flex max-h-[calc(100vh-250px)] min-h-[360px] flex-col gap-7 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
        <AnimatePresence initial={false}>
          {!sourceCount ? (
            <motion.div
              key="empty-chat"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="m-auto max-w-sm text-center"
            >
              <h2 className="text-xl font-extrabold text-slate-950">
                Start learning with your sources
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Upload your notes, add a website, then ask the AI anything
                about them.
              </p>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenSourceModal("pdf")}
                className="mt-5 rounded-xl bg-[#008f68] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10"
              >
                Add source
              </motion.button>
            </motion.div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isProcessing && workflowStep >= 0 && (
            <Workflow key="workflow" currentStep={workflowStep} />
          )}
        </AnimatePresence>
      </div>

      <form
        className="relative flex items-center gap-3 border-t border-slate-100 px-6 pb-8 pt-4 lg:px-8"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          aria-label="Attach a file"
          onClick={() => onOpenSourceModal("pdf")}
          className="text-2xl text-slate-400 transition hover:text-[#008f68]"
        >
          <FiPaperclip />
        </motion.button>
        <input
          aria-label="Ask a question"
          value={composerValue}
          onChange={(event) => onComposerChange(event.target.value)}
          placeholder={
            isKnowledgeReady
              ? "Ask anything about your sources..."
              : "Add a source before asking questions..."
          }
          disabled={!isKnowledgeReady}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
        />
        <motion.button
          type="submit"
          whileHover={
            composerValue.trim() && isKnowledgeReady && !isProcessing
              ? { y: -2 }
              : undefined
          }
          whileTap={{ scale: 0.94 }}
          aria-label="Send message"
          disabled={!composerValue.trim() || !isKnowledgeReady || isProcessing}
          className="grid h-11 w-11 place-items-center rounded-xl bg-[#008f68] text-xl text-white transition hover:bg-[#007d67] disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          <FiArrowUp />
        </motion.button>
        <small className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-slate-400">
          AI responses are generated from your connected sources
        </small>
      </form>
    </motion.section>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex gap-3 ${isUser ? "ml-auto w-fit max-w-[92%] flex-row-reverse text-right md:max-w-[78%] xl:max-w-[70%]" : "mr-auto w-fit max-w-[92%] md:max-w-[78%] xl:max-w-[70%]"}`}
    >
      {!isUser && (
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-[#008f68] text-[11px] font-extrabold text-white">
          AI
        </span>
      )}
      <div className="min-w-0">
        <small className="mb-2 block text-xs font-bold text-slate-500">
          {isUser ? "You" : "AI Assistant"}
        </small>
        <div
          className={`space-y-2 rounded-2xl border px-5 py-4 text-sm leading-7 shadow-sm lg:px-6 ${
            isUser
              ? "rounded-tr-md border-[#008f68] bg-[#008f68] text-white"
              : "rounded-tl-md border-slate-100 bg-slate-50 text-slate-700"
          }`}
        >
          {formatText(message.text)}
        </div>
      </div>
    </motion.article>
  );
}

function formatText(text) {
  return text.split("\n").map((line, index) => {
    const isListItem = line.startsWith("- ");
    const content = isListItem ? line.slice(2) : line;

    return (
      <p key={`${line}-${index}`} className={isListItem ? "pl-3" : ""}>
        {isListItem && <span className="mr-2 text-[#008f68]">-</span>}
        {content.split(/(\*\*.*?\*\*)/).map((part, partIndex) =>
          part.startsWith("**") ? (
            <strong key={partIndex}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

function Workflow({ currentStep }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      className="mr-auto w-[270px] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_12px_30px_rgba(28,88,64,0.08)]"
    >
      <strong className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#247463]">
        <FiSearch /> Agent workflow
      </strong>
      <div className="grid gap-3">
        {WORKFLOW_STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <span
              className={`flex items-center gap-3 text-xs ${
                index <= currentStep ? "text-slate-700" : "text-slate-300"
              }`}
              key={step}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border ${
                  index <= currentStep
                    ? "border-emerald-200 text-[#008f68]"
                    : "border-slate-200"
                }`}
              >
                {isDone ? (
                  <FiCheck />
                ) : (
                  <motion.i
                    animate={isActive ? { scale: [1, 1.35, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                    className="h-1.5 w-1.5 rounded-full bg-current"
                  />
                )}
              </span>
              {step}
              {isActive && "..."}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}
