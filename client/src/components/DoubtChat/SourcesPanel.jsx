import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";

import { SOURCE_TYPES, panelMotion } from "./constants";

export default function SourcesPanel({
  sourceCount,
  sourceFilter,
  visibleSources,
  isKnowledgeReady,
  onOpenSourceModal,
  onSourceFilterChange,
  onDeleteSource,
}) {
  return (
    <motion.aside
      variants={panelMotion}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.35 }}
      className="flex min-h-[620px] w-full flex-col overflow-hidden rounded-[22px] border border-emerald-950/5 bg-white p-5 shadow-[0_18px_45px_rgba(37,98,82,0.08)] md:p-6 lg:w-[320px] lg:flex-none"
      aria-label="Sources"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Sources</h2>
          <p className="mt-1 text-xs text-slate-500">
            {sourceCount} source{sourceCount === 1 ? "" : "s"} connected
          </p>
        </div>
        <motion.span
          key={sourceCount}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          className="grid h-8 min-w-8 place-items-center rounded-xl bg-emerald-50 px-2 text-sm font-extrabold text-[#008f68]"
        >
          {sourceCount}
        </motion.span>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onOpenSourceModal("pdf")}
        className="mt-5 grid grid-cols-[38px_1fr] items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-left transition hover:bg-emerald-100/70"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xl text-[#008f68]">
          <FiPlus />
        </span>
        <span>
          <strong className="block text-sm font-extrabold text-slate-950">
            Add source
          </strong>
          <small className="mt-1 block text-xs text-slate-500">
            PDF, website, image...
          </small>
        </span>
      </motion.button>

      <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Source types">
        {Object.entries(SOURCE_TYPES).map(([type, item]) => {
          const Icon = item.icon;
          const isActive = sourceFilter === type;

          return (
            <motion.button
              key={type}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onSourceFilterChange(type)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-extrabold transition ${
                isActive
                  ? "border-[#008f68] bg-[#008f68] text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <Icon />
              {item.shortLabel}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {!visibleSources.length && (
            <motion.div
              key="empty-source"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-dashed border-slate-200 p-5 text-center"
            >
              <p className="text-sm font-extrabold text-slate-800">
                No {SOURCE_TYPES[sourceFilter].shortLabel} sources yet
              </p>
              <span className="mx-auto mt-2 block max-w-[190px] text-xs leading-5 text-slate-500">
                Add files, links, or images to give your assistant context.
              </span>
              <button
                type="button"
                onClick={() => onOpenSourceModal(sourceFilter)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#008f68] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#007d67]"
              >
                <FiPlus /> Add source
              </button>
            </motion.div>
          )}

          {visibleSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              onDelete={() => onDeleteSource(source.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        layout
        className={`mt-auto flex items-center gap-3 rounded-2xl p-4 ${
          isKnowledgeReady
            ? "bg-emerald-50 text-[#008f68]"
            : "bg-slate-50 text-slate-400"
        }`}
      >
        <FiCheck className="text-xl" />
        <span>
          <strong className="block text-xs font-extrabold">
            {isKnowledgeReady ? "Knowledge ready" : "No knowledge sources"}
          </strong>
          <small className="mt-0.5 block text-[11px] text-slate-500">
            {isKnowledgeReady
              ? "Sources indexed and searchable"
              : "Add a source to get started"}
          </small>
        </span>
      </motion.div>
    </motion.aside>
  );
}

function SourceCard({ source, onDelete }) {
  const sourceType = SOURCE_TYPES[source.type] || SOURCE_TYPES.pdf;
  const Icon = sourceType.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      whileHover={{ y: -2 }}
      className="group grid grid-cols-[36px_1fr_28px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-emerald-100 hover:shadow-md"
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${sourceType.accent}`}
      >
        <Icon />
      </span>
      <div className="min-w-0">
        <small className="block text-[10px] font-extrabold uppercase text-slate-400">
          {source.type === "url" ? "WEB" : source.type}
        </small>
        <strong className="block truncate text-xs font-extrabold text-slate-900">
          {source.name}
        </strong>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">{source.meta}</p>
      </div>
      <button
        type="button"
        aria-label={`Delete ${source.name}`}
        onClick={onDelete}
        className="grid h-7 w-7 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
      >
        <FiTrash2 />
      </button>
    </motion.article>
  );
}
