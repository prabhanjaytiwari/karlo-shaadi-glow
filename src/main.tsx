import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Redirect lovable.app URL to custom domain
if (
  typeof window !== "undefined" &&
  window.location.hostname === "karlo-shaadi-glow.lovable.app"
) {
  window.location.replace(
    "https://karloshaadi.com" + window.location.pathname + window.location.search + window.location.hash
  );
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
