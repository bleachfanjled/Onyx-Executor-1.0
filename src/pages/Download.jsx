import { useState } from "react";
import { Download, Shield, Monitor } from "lucide-react";

const DOWNLOAD_URL = "#";
const VERSION = "2.1.0";
const SHA256 = "a3f8c2e1d74b5960fe2318a0c9d47b8e6f1205a3c8d9e7f04b2163a5c8d9e7f0";
const FILE_SIZE = "4.2 MB";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    if (downloading || done) return;
    setDownloading(true);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setDownloading(false);
          setDone(true);
          // Trigger actual download
          const a = document.createElement("a");
          a.href = DOWNLOAD_URL;
          a.download = `Onyx_v${VERSION}.zip`;
          a.click();
        }, 300);
      } else {
        setProgress(Math.round(p));
      }
    }, 90);
  };

  const [copied, setCopied] = useState(false);
  const copyHash = () => {
    navigator.clipboard.writeText(SHA256).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div
          className="py-16"
          style={{ borderBottom: "1px solid #1A1A1A" }}
        >
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>02 /</span>
            <h1
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}
            >
              DOWNLOAD
            </h1>
          </div>
        </div>

        {/* Download Chamber */}
        <div className="flex flex-col items-center justify-center py-24 text-center">

          {/* Version badge */}
          <div
            className="inline-flex items-center gap-4 mb-16"
            style={{ border: "1px solid #1A1A1A", padding: "8px 20px", backgroundColor: "#0D0D0D" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FFFFFF" }} />
            <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.1em" }}>
              ONYX v{VERSION}
            </span>
            <div style={{ width: "1px", height: "12px", backgroundColor: "#1A1A1A" }} aria-hidden="true" />
            <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.1em" }}>
              {FILE_SIZE}
            </span>
          </div>

          <h2
            className="font-heading text-white mb-4"
            style={{ fontWeight: 900, fontSize: "clamp(40px, 8vw, 100px)", letterSpacing: "-0.05em", lineHeight: 0.9 }}
          >
            GET ONYX
          </h2>
          <p
            className="mb-16"
            style={{ color: "#959595", fontSize: "15px", letterSpacing: "0.02em" }}
          >
            Free. No key. No account. Direct download.
          </p>

          {/* Compatibility */}
          <div className="flex items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <Monitor size={14} style={{ color: "#959595" }} aria-hidden="true" />
              <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.08em" }}>
                WINDOWS 10 / 11
              </span>
            </div>
            <div style={{ width: "1px", height: "12px", backgroundColor: "#1A1A1A" }} aria-hidden="true" />
            <div className="flex items-center gap-3">
              <Shield size={14} style={{ color: "#959595" }} aria-hidden="true" />
              <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.08em" }}>
                VERIFIED CLEAN
              </span>
            </div>
          </div>

          {/* Download Button */}
          <div className="relative w-full max-w-lg mb-6">
            {/* Loading bar on top border */}
            {downloading && (
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 h-px transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#FFFFFF",
                }}
              />
            )}
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label={`Download Onyx Version ${VERSION} for Windows`}
              className="w-full flex items-center justify-center gap-4 font-heading uppercase transition-sharp focus:outline-white disabled:cursor-not-allowed"
              style={{
                backgroundColor: done ? "#0D0D0D" : "#FFFFFF",
                color: done ? "#FFFFFF" : "#050505",
                border: done ? "1px solid #1A1A1A" : "1px solid #FFFFFF",
                padding: "24px 48px",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.1em",
                minHeight: "72px",
              }}
              onMouseEnter={(e) => {
                if (!downloading && !done) e.currentTarget.style.backgroundColor = "#E0E0E0";
              }}
              onMouseLeave={(e) => {
                if (!downloading && !done) e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              <Download size={18} aria-hidden="true" />
              {done
                ? "DOWNLOAD COMPLETE"
                : downloading
                ? `DOWNLOADING — ${progress}%`
                : "DOWNLOAD ONYX FREE"}
            </button>
          </div>

          {/* SHA Hash */}
          <div
            className="w-full max-w-lg"
            style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D", padding: "16px 20px" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs mb-1" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
                  SHA-256
                </p>
                <p
                  className="font-mono text-xs truncate"
                  style={{ color: "#959595", letterSpacing: "0.04em" }}
                  title={SHA256}
                >
                  {SHA256}
                </p>
              </div>
              <button
                onClick={copyHash}
                className="flex-shrink-0 font-mono text-xs uppercase transition-sharp focus:outline-white"
                style={{
                  color: copied ? "#FFFFFF" : "#3A3A3A",
                  letterSpacing: "0.1em",
                  padding: "4px 8px",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#959595"; }}
                onMouseLeave={(e) => {
                  if (!copied) e.currentTarget.style.color = "#3A3A3A";
                }}
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* Warning */}
          <p
            className="mt-8 font-mono text-xs"
            style={{ color: "#3A3A3A", letterSpacing: "0.06em", maxWidth: "480px" }}
          >
            Disable antivirus before installing. Onyx requires elevated permissions to perform injection.
          </p>
        </div>
      </div>
    </div>
  );
}