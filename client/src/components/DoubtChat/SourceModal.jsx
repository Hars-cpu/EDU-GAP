import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheck,
  FiChevronRight,
  FiGlobe,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import { SOURCE_TYPES } from "./constants";

export default function SourceModal({
  type,
  selectedFile,
  sourceUrl,
  uploadProgress,
  sourceReady,
  isProcessing,
  fileInputRef,
  onClose,
  onTypeChange,
  onFileChange,
  onFileDrop,
  onUrlChange,
  onAdd,
}) {
  const current = SOURCE_TYPES[type];
  const Icon = current.icon;
  const canAdd = type === "url" ? sourceUrl.trim() : selectedFile && sourceReady;
  const accept =
    type === "pdf" ? ".pdf,application/pdf" : "image/png,image/jpeg,image/webp";

  return (
    <motion.div
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-md"
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-modal-title"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-[min(760px,100%)] rounded-[26px] bg-white p-6 shadow-[0_28px_90px_rgba(16,45,37,0.32)]"
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="source-modal-title"
              className="text-2xl font-extrabold text-slate-950"
            >
              Add a knowledge source
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose how you want to add information.
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            aria-label="Close dialog"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX />
          </motion.button>
        </header>

        <div className="grid gap-4 md:grid-cols-[250px_1fr]">
          <nav className="grid content-start gap-3" aria-label="Knowledge source types">
            {Object.entries(SOURCE_TYPES).map(([itemType, item]) => {
              const ItemIcon = item.icon;
              const isSelected = type === itemType;

              return (
                <motion.button
                  type="button"
                  key={itemType}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTypeChange(itemType)}
                  className={`grid grid-cols-[40px_1fr_18px] items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-100 bg-white hover:border-emerald-100 hover:bg-slate-50"
                  }`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xl text-[#008f68]">
                    <ItemIcon />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-sm font-extrabold text-slate-950">
                      {item.label}
                    </strong>
                    <small className="mt-0.5 block text-xs leading-4 text-slate-500">
                      {item.help}
                    </small>
                  </span>
                  <FiChevronRight className="text-slate-300" />
                </motion.button>
              );
            })}
          </nav>

          <div className="flex min-h-[260px] flex-col rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <AnimatePresence mode="wait">
              {type === "url" ? (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="flex flex-1 flex-col"
                >
                  <label
                    htmlFor="source-url"
                    className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500"
                  >
                    URL
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 text-[#008f68] shadow-sm">
                    <FiGlobe />
                    <input
                      id="source-url"
                      type="url"
                      value={sourceUrl}
                      onChange={(event) => onUrlChange(event.target.value)}
                      placeholder="https://en.wikipedia.org/wiki/..."
                      autoFocus
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="flex flex-1 flex-col"
                >
                  <input
                    ref={fileInputRef}
                    className="sr-only"
                    id="source-file"
                    type="file"
                    accept={accept}
                    onChange={onFileChange}
                  />
                  <label
                    htmlFor="source-file"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      onFileDrop(event.dataTransfer.files?.[0]);
                    }}
                    className={`flex min-h-[180px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-5 text-center transition ${
                      selectedFile
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40"
                    }`}
                  >
                    <motion.span
                      animate={selectedFile && !sourceReady ? { y: [0, -4, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="mb-3 text-4xl text-[#008f68]"
                    >
                      {selectedFile ? <Icon /> : <FiUploadCloud />}
                    </motion.span>
                    {selectedFile ? (
                      <>
                        <strong className="max-w-full truncate text-base font-extrabold text-slate-950">
                          {selectedFile.name}
                        </strong>
                        <span className="mt-1 text-sm text-slate-500">
                          {sourceReady ? "Source ready" : "Preparing source..."}
                        </span>
                        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-emerald-100">
                          <motion.div
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full rounded-full bg-[#008f68]"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <strong className="text-base font-extrabold text-slate-950">
                          {type === "pdf" ? "Drop your PDF here" : "Choose an image"}
                        </strong>
                        <span className="mt-1 text-sm text-slate-500">
                          {type === "pdf"
                            ? "or click to browse"
                            : "PNG, JPG, JPEG, or WEBP"}
                        </span>
                        <small className="mt-1 text-xs text-slate-400">
                          {type === "pdf"
                            ? "PDF up to 20 MB"
                            : "Screenshots and diagrams work best"}
                        </small>
                      </>
                    )}
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              whileHover={canAdd && !isProcessing ? { y: -2 } : undefined}
              whileTap={{ scale: 0.97 }}
              onClick={onAdd}
              disabled={!canAdd || isProcessing}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#008f68] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#007d67] disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              <FiCheck />
              {isProcessing ? "Adding source..." : "Add source"}
            </motion.button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
