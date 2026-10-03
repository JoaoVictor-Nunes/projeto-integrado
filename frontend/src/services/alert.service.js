export function showGlobalAlert(message, type = "info") {
  // Troque por um toast (ex.: react-toastify, sonner) quando tiver um definido.
  console[type === "error" ? "error" : "log"](`[${type.toUpperCase()}] ${message}`);
}
