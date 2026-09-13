import { useState, useEffect, useRef, useCallback } from "react";
import indexHtmlUrl from "./onyx-assets/index.html.txt?url";
import rendererJsUrl from "./onyx-assets/renderer.js.txt?url";
import AIAssistant from "@/components/onyx/AIAssistant";

// ?url imports resolve to proper asset URLs that work in both dev and
// production builds. Fetch the content at runtime, inline Tailwind CDN.
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
}).catch(() => "<html><body style='background:#050505;color:#959595;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:12px'><p style='font-size:14px;color:#fff'>ONYX</p><p style='font-size:12px'>Preview unavailable — please refresh the page.</p></body></html>");

export default function ExecutorPreview() {
  const [srcDoc, setSrcDoc] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const iframeRef = useRef(null);

  const getEditorContent = useCallback(() => {
    return new Promise((resolve) => {
      const handler = (event) => {
        if (event.data?.type === "onyx-editor-content") {
          window.removeEventListener("message", handler);
          resolve(event.data.content || "");
        }
      };
      window.addEventListener("message", handler);
      iframeRef.current?.contentWindow?.postMessage({ type: "onyx-get-editor-content" }, "*");
      setTimeout(() => {
        window.removeEventListener("message", handler);
        resolve("");
      }, 3000);
    });
  }, []);

  const applyCode = useCallback((code) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "onyx-apply-code", code }, "*");
  }, []);

  useEffect(() => {
    Promise.all([
      srcDocPromise,
      new Promise((r) => setTimeout(r, 900)),
    ]).then(([doc]) => setSrcDoc(doc)).catch(() => setSrcDoc(""));
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.data && event.data.type === "onyx-toggle-ai") {
        setAiOpen((prev) => !prev);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="bg-obsidian relative" style={{ backgroundColor: "#050505", paddingTop: "56px", height: "100vh" }}>
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} getEditorContent={getEditorContent} applyCode={applyCode} />
      {srcDoc ? (
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          title="Onyx Executor Preview"
          style={{ width: "100%", height: "calc(100vh - 56px)", border: "none", display: "block" }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-8" style={{ backgroundColor: "#050505" }}>
          <div className="relative" style={{ width: "80px", height: "80px" }}>
            <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ animation: "onyxSpin 2s linear infinite" }}>
              <circle cx="40" cy="40" r="36" stroke="#1A1A1A" strokeWidth="2" fill="none" />
              <circle cx="40" cy="40" r="36" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeDasharray="226" strokeDashoffset="56" strokeLinecap="round" transform="rotate(-90 40 40)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="https://media.base44.com/images/public/6a333172d2474d3b422c32ed/8a783d050_ChatGPTImageSep122026at10_10_16PM.png" alt="Onyx" style={{ width: "48px", height: "48px", animation: "onyxPulse 1.5s ease-in-out infinite" }} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white text-sm font-bold uppercase" style={{ letterSpacing: "0.3em" }}>ONYX</h2>
            <p className="text-xs" style={{ color: "#959595", letterSpacing: "0.2em", animation: "onyxFade 1.5s ease-in-out infinite" }}>INITIALIZING PREVIEW</p>
          </div>
          <div className="relative overflow-hidden" style={{ width: "200px", height: "1px", backgroundColor: "#1A1A1A" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)", animation: "onyxShimmer 1.5s linear infinite" }} />
          </div>
          <style>{`
            @keyframes onyxSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes onyxPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
            @keyframes onyxFade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
            @keyframes onyxShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          `}</style>
        </div>
      )}
    </div>
  );
}