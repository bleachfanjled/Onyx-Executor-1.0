import { useState, useEffect } from "react";
import indexHtmlUrl from "./onyx-assets/index.html.txt?raw";
import rendererJsUrl from "./onyx-assets/renderer.js.txt?raw";

export default function ExecutorPreview() {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(indexHtmlUrl).then((r) => r.text()),
      fetch(rendererJsUrl).then((r) => r.text()),
    ]).then(([html, js]) => {
      if (cancelled) return;
      // Inline renderer.js so the iframe renders the full executor UI standalone
      const full = html.replace(
        '<script src="renderer.js"></script>',
        `<script>${js}</script>`
      );
      setSrcDoc(full);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-obsidian" style={{ backgroundColor: "#050505", paddingTop: "56px", height: "100vh" }}>
      {srcDoc ? (
        <iframe
          srcDoc={srcDoc}
          title="Onyx Executor Preview"
          style={{ width: "100%", height: "calc(100vh - 56px)", border: "none", display: "block" }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="font-mono text-xs animate-pulse" style={{ color: "#3A3A3A", letterSpacing: "0.14em" }}>
            LOADING PREVIEW...
          </span>
        </div>
      )}
    </div>
  );
}