import { useState, useEffect } from "react";
import indexHtmlUrl from "./onyx-assets/index.html.txt?raw";
import rendererJsUrl from "./onyx-assets/renderer.js.txt?raw";
import AIAssistant from "@/components/onyx/AIAssistant";

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
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      srcDocPromise,
      new Promise((r) => setTimeout(r, 900)),
    ]).then(([doc]) => setSrcDoc(doc));
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
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      {srcDoc ? (
        <iframe
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
              <span className="text-white text-2xl font-black tracking-tighter" style={{ animation: "onyxPulse 1.5s ease-in-out infinite" }}>O</span>
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