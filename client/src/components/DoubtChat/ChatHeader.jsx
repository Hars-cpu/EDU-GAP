import { motion } from "framer-motion";
import { FiMessageCircle } from "react-icons/fi";

export default function ChatHeader({ title, userInitial }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-[86px] items-center justify-between bg-gradient-to-r from-[#008f68] to-[#05a17e] px-5 text-white shadow-[0_8px_24px_rgba(0,109,89,0.18)] sm:px-10 lg:px-24"
    >
      <div className="flex items-center gap-3 text-lg font-extrabold">
        <motion.span
          whileHover={{ rotate: -7, scale: 1.06 }}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-xl"
        >
          <FiMessageCircle />
        </motion.span>
        {title}
      </div>

      <div className="flex items-center gap-4 text-xs font-bold">
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-200 shadow-[0_0_0_4px_rgba(255,255,255,0.14)]" />
          Agentic RAG Online
        </span>
        <motion.span
          whileHover={{ scale: 1.08 }}
          className="grid h-10 w-10 place-items-center rounded-full bg-white font-extrabold text-[#008f68]"
          aria-label="User profile"
        >
          {userInitial}
        </motion.span>
      </div>
    </motion.header>
  );
}
