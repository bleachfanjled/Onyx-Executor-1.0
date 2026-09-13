import { useState, useEffect } from "react";
import indexHtmlUrl from "./onyx-assets/index.html.txt?raw";
import rendererJsUrl from "./onyx-assets/renderer.js.txt?raw";

// Start fetching immediately at module load time (before component mount)
// Also inline the Tailwind CDN script so the iframe has zero external requests
const srcDocPromise = Promise.all([
  fetch(indexHtmlUrl).then((r) => r.text()),
  fetch(rendererJsUrl).then((r) => r.text()),
  fetch("https://cdn.tailwindcss.com").then((r) => r.text()).catch(() => null),
]).then(([html, js, tailwind]) => {
  let result = html.replace('<script src="renderer.js"></script>', `<script>${js}</script>`);
  if (tailwind) {
    result = result.replace('<script src="https://cdn.tailwindcss.com"></script>', `<script>${tailwind}</script>`);
  }
  return result;
});

export default function ExecutorPreview() {
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    srcDocPromise.then(setSrcDoc);
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