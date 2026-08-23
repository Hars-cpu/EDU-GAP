import {
  FiFileText,
  FiGlobe,
  FiImage,
} from "react-icons/fi";

export const WORKFLOW_STEPS = [
  "Searching sources",
  "Retrieving relevant chunks",
  "Reranking results",
  "Generating response",
];

export const SOURCE_TYPES = {
  pdf: {
    label: "Upload PDF",
    shortLabel: "PDF",
    help: "Add lecture notes or documents",
    icon: FiFileText,
    accent: "text-rose-500 bg-rose-50",
  },
  url: {
    label: "Website / Wikipedia",
    shortLabel: "URL",
    help: "Add a URL as a knowledge source",
    icon: FiGlobe,
    accent: "text-sky-600 bg-sky-50",
  },
  image: {
    label: "Upload Image",
    shortLabel: "Image",
    help: "Add diagrams or screenshots",
    icon: FiImage,
    accent: "text-emerald-600 bg-emerald-50",
  },
};

export const DEFAULT_SOURCES = [
  {
    id: "source-pdf",
    type: "pdf",
    name: "Prompt_vs_Context_vs_Harness_Engineering.pdf",
    meta: "3 KB",
  },
  {
    id: "source-web",
    type: "url",
    name: "Wikipedia research notes",
    meta: "en.wikipedia.org/wiki/...",
  },
];

export const DEFAULT_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hello! I'm your AI learning assistant. Upload your sources (PDFs, websites, images), then ask me anything about them. I'll search your material and explain the answer with citations.",
  },
  {
    id: "user-1",
    role: "user",
    text: "Explain harness",
  },
  {
    id: "answer-1",
    role: "assistant",
    text: "A **harness** is a device consisting of straps and buckles, often made of leather, webbing, or rope, used to secure, control, or support an object or a living being.\n\nHarnesses are used in various contexts:\n\n- **Animals:** For horses, a harness is used to attach them to a cart, plow, or other vehicle.\n- **Safety:** Safety harnesses are crucial in activities like rock climbing and construction work.\n- **Child safety:** Car seat harnesses help keep children secure.",
  },
];

export const panelMotion = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};
