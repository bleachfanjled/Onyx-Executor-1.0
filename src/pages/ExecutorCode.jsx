import { useState } from "react";
import { Check, Copy } from "lucide-react";

const CODE_BLOCKS = [
  {
    label: "index.html",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Onyx</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { -webkit-app-region: no-drag; }
    .drag { -webkit-app-region: drag; }
    body { margin: 0; overflow: hidden; background: #050505; }
    textarea { caret-color: white; }
    textarea::placeholder { color: #2a2a2a; }
  </style>
</head>
<body>
  <div class="w-screen h-screen bg-[#050505] border border-[#1A1A1A] flex flex-col font-mono text-white select-none">

    <!-- Title Bar -->
    <div class="drag h-10 border-b border-[#1A1A1A] flex items-center px-4 justify-between shrink-0">
      <span class="text-[10px] tracking-[0.2em] text-[#959595]">ONYX // V2.1</span>
      <div class="flex gap-3 no-drag">
        <button onclick="window.electronAPI.minimize()" class="w-3 h-3 rounded-full bg-[#1A1A1A] hover:bg-[#3A3A3A] transition-all"></button>
        <button onclick="window.electronAPI.close()" class="w-3 h-3 rounded-full bg-[#1A1A1A] hover:bg-white transition-all"></button>
      </div>
    </div>

    <!-- Script Editor -->
    <div class="flex-1 p-3 overflow-hidden">
      <textarea
        id="scriptEditor"
        class="w-full h-full bg-[#0D0D0D] border border-[#1A1A1A] p-4 text-[13px] text-[#959595] focus:outline-none focus:border-[#3A3A3A] resize-none transition-all"
        placeholder="-- Enter script here..."
      ></textarea>
    </div>

    <!-- Console Log -->
    <div class="h-24 mx-3 mb-3 bg-[#0D0D0D] border border-[#1A1A1A] overflow-y-auto p-3">
      <p id="console" class="text-[11px] text-[#3A3A3A]">[ ONYX ] Ready.</p>
    </div>

    <!-- Action Bar -->
    <div class="h-14 border-t border-[#1A1A1A] flex items-center px-4 gap-2 shrink-0">

      <button onclick="handleExecute()" class="h-9 px-6 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#E0E0E0] transition-all">
        Execute
      </button>

      <button onclick="handleCopy()" class="h-9 px-4 border border-[#1A1A1A] text-[#959595] text-[10px] uppercase tracking-widest hover:text-white hover:border-[#3A3A3A] transition-all">
        Copy
      </button>

      <button onclick="handlePaste()" class="h-9 px-4 border border-[#1A1A1A] text-[#959595] text-[10px] uppercase tracking-widest hover:text-white hover:border-[#3A3A3A] transition-all">
        Paste
      </button>

      <button onclick="handleDownload()" class="h-9 px-4 border border-[#1A1A1A] text-[#959595] text-[10px] uppercase tracking-widest hover:text-white hover:border-[#3A3A3A] transition-all">
        Save
      </button>

      <button onclick="handleClear()" class="h-9 px-4 border border-[#1A1A1A] text-[#959595] text-[10px] uppercase tracking-widest hover:text-white hover:border-[#3A3A3A] transition-all">
        Clear
      </button>

      <!-- Status -->
      <div class="ml-auto flex items-center gap-2">
        <div id="statusDot" class="w-1.5 h-1.5 bg-[#3A3A3A]"></div>
        <span id="statusText" class="text-[9px] text-[#959595] uppercase tracking-widest">Idle</span>
      </div>
    </div>

  </div>

  <script src="renderer.js"></script>
</body>
</html>`,
  },
  {
    label: "renderer.js",
    language: "javascript",
    code: `// renderer.js — UI logic for Onyx Executor

const editor = document.getElementById("scriptEditor");
const consoleEl = document.getElementById("console");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

function log(msg, color = "#959595") {
  const line = document.createElement("p");
  line.className = "text-[11px]";
  line.style.color = color;
  line.textContent = "[ ONYX ] " + msg;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function setStatus(text, active = false) {
  statusText.textContent = text;
  statusDot.style.backgroundColor = active ? "#FFFFFF" : "#3A3A3A";
}

// Execute — wire up to your actual injection logic here
function handleExecute() {
  const script = editor.value.trim();
  if (!script) { log("No script to execute.", "#3A3A3A"); return; }
  setStatus("Executing", true);
  log("Executing script...", "#FFFFFF");
  // TODO: Call your C++ injection bridge here
  // e.g. window.electronAPI.execute(script)
  setTimeout(() => setStatus("Idle", false), 2000);
}

// Copy script to clipboard
function handleCopy() {
  const script = editor.value;
  if (!script) { log("Nothing to copy.", "#3A3A3A"); return; }
  navigator.clipboard.writeText(script).then(() => log("Script copied to clipboard."));
}

// Paste from clipboard into editor
async function handlePaste() {
  try {
    const text = await navigator.clipboard.readText();
    editor.value += text;
    log("Pasted from clipboard.");
  } catch {
    log("Clipboard access denied.", "#3A3A3A");
  }
}

// Save script as a .lua file
function handleDownload() {
  const script = editor.value;
  if (!script) { log("Nothing to save.", "#3A3A3A"); return; }
  const blob = new Blob([script], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "onyx_script.lua";
  a.click();
  URL.revokeObjectURL(url);
  log("Script saved as onyx_script.lua.");
}

// Clear the editor
function handleClear() {
  editor.value = "";
  log("Editor cleared.");
}`,
  },
  {
    label: "main.js (Electron)",
    language: "javascript",
    code: `// main.js — Electron entry point

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 520,
    frame: false,           // removes default Windows title bar
    transparent: false,
    resizable: true,
    backgroundColor: "#050505",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });`,
  },
  {
    label: "preload.js (Electron)",
    language: "javascript",
    code: `// preload.js — exposes safe APIs to the renderer

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),
  // Add your injection bridge call here:
  // execute: (script) => ipcRenderer.invoke("execute", script),
});`,
  },
];

function CodeBlock({ block }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ border: "1px solid #1A1A1A", marginBottom: "32px" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid #1A1A1A", backgroundColor: "#0D0D0D" }}
      >
        <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.1em" }}>
          {block.label}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 font-mono text-xs uppercase transition-all focus:outline-white"
          style={{
            color: copied ? "#FFFFFF" : "#3A3A3A",
            letterSpacing: "0.1em",
            padding: "4px 10px",
            border: "1px solid",
            borderColor: copied ? "#FFFFFF" : "#1A1A1A",
          }}
          onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.color = "#959595"; e.currentTarget.style.borderColor = "#3A3A3A"; } }}
          onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.color = "#3A3A3A"; e.currentTarget.style.borderColor = "#1A1A1A"; } }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <pre
        className="overflow-x-auto font-mono text-xs leading-relaxed"
        style={{
          backgroundColor: "#050505",
          color: "#959595",
          padding: "24px",
          margin: 0,
          fontSize: "12px",
          lineHeight: 1.8,
          whiteSpace: "pre",
        }}
      >
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

export default function ExecutorCode() {
  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="py-16" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div className="flex items-center gap-6 mb-4">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>04 /</span>
            <h1 className="font-heading text-white" style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}>
              EXECUTOR UI CODE
            </h1>
          </div>
          <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.08em", maxWidth: "560px", lineHeight: 1.8 }}>
            Copy each file below into your Electron project folder. Click the Copy button on each block, paste into the corresponding file, then run <span style={{ color: "#959595" }}>npm start</span> to launch the app.
          </p>
        </div>

        {/* Instructions */}
        <div className="py-10" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", text: "Install Node.js from nodejs.org" },
              { step: "02", text: 'Run "npm init" and "npm install electron" in your project folder' },
              { step: "03", text: 'Copy each file below, then run "npx electron ."' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <span className="font-mono text-xs shrink-0" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>{s.step} /</span>
                <span className="font-mono text-xs" style={{ color: "#959595", lineHeight: 1.7 }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Blocks */}
        <div className="py-12">
          {CODE_BLOCKS.map((block) => (
            <CodeBlock key={block.label} block={block} />
          ))}
        </div>

      </div>
    </div>
  );
}