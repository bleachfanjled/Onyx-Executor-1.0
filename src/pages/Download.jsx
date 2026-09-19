import { useState, useEffect } from "react";
import { Download, Shield, Monitor, Apple, X, ShieldCheck, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const VERSION = "1.0";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [release, setRelease] = useState(null);
  const [releaseError, setReleaseError] = useState(false);
  const [macRelease, setMacRelease] = useState(null);
  const [macReleaseError, setMacReleaseError] = useState(false);
  const [macDownloading, setMacDownloading] = useState(false);
  const [macProgress, setMacProgress] = useState(0);
  const [macDone, setMacDone] = useState(false);
  const [modalPlatform, setModalPlatform] = useState("windows");

  useEffect(() => {
    base44.functions.
    invoke("getOnyxRelease", {}).
    then((res) => setRelease(res.data)).
    catch(() => setReleaseError(true));
    base44.functions.
    invoke("getOnyxMacOSRelease", {}).
    then((res) => setMacRelease(res.data)).
    catch(() => setMacReleaseError(true));
  }, []);

  const fileSize = release ? `${release.sizeMb} MB` : "—";
  const macFileSize = macRelease ? `${macRelease.sizeMb} MB` : "—";
  const winHash = release?.sha256 || null;
  const macHash = macRelease?.sha256 || null;

  const handleDownload = () => {
    if (downloading || done || !release || !confirmed) return;
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
          setModalPlatform("windows");
          setShowSafetyModal(true);
          window.location.href = release.downloadUrl;
        }, 300);
      } else {
        setProgress(Math.round(p));
      }
    }, 90);
  };

  const handleMacDownload = () => {
    if (macDownloading || macDone || !macRelease || !confirmed) return;
    setMacDownloading(true);
    setMacProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setMacProgress(100);
        setTimeout(() => {
          setMacDownloading(false);
          setMacDone(true);
          setModalPlatform("mac");
          setShowSafetyModal(true);
          window.location.href = macRelease.downloadUrl;
        }, 300);
      } else {
        setMacProgress(Math.round(p));
      }
    }, 90);
  };

  const [copiedHash, setCopiedHash] = useState(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const copyHash = (hash, os) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopiedHash(os);
      setTimeout(() => setCopiedHash(null), 2000);
    });
  };

  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div
          className="py-16"
          style={{ borderBottom: "1px solid #1A1A1A" }}>
          
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>02 /</span>
            <h1
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}>
              
              DOWNLOAD
            </h1>
          </div>
        </div>

        {/* Download Chamber */}
        <div className="flex flex-col items-center justify-center py-24 text-center">

          {/* Version badge */}
          <div
            className="inline-flex items-center gap-4 my-12 mx-1"
            style={{ border: "1px solid #1A1A1A", padding: "8px 20px", backgroundColor: "#0D0D0D" }}>
            
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FFFFFF" }} />
            <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.1em" }}>
              ONYX v{VERSION}
            </span>
            <div style={{ width: "1px", height: "12px", backgroundColor: "#1A1A1A" }} aria-hidden="true" />

          </div>

          <h2
            className="font-heading text-white mb-4"
            style={{ fontWeight: 900, fontSize: "clamp(40px, 8vw, 100px)", letterSpacing: "-0.05em", lineHeight: 0.9 }}>
            
            GET ONYX
          </h2>
          <p
            className="mb-16"
            style={{ color: "#959595", fontSize: "15px", letterSpacing: "0.02em" }}>
            
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
              <Apple size={14} style={{ color: "#959595" }} aria-hidden="true" />
              <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.08em" }}>
                MACOS 11+
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

          {/* Before You Download — safety explainer */}
          <div
            className="w-full max-w-2xl mb-16 text-left"
            style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D" }}>
            
            {/* Section header */}
            <div
              className="flex items-center gap-3 px-8 py-5"
              style={{ borderBottom: "1px solid #1A1A1A" }}>
              
              <ShieldCheck size={16} style={{ color: "#FFFFFF" }} />
              <span className="font-mono text-xs" style={{ color: "#FFFFFF", letterSpacing: "0.14em" }}>
                BEFORE YOU DOWNLOAD
              </span>
            </div>

            <div className="px-8 py-7">
              {/* What is SHA-256 */}
              <h3
                className="font-heading text-white mb-3"
                style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>
                
                What is SHA-256?
              </h3>
              <p
                className="font-body mb-8"
                style={{ color: "#959595", fontSize: "13.5px", lineHeight: 1.7 }}>
                
                SHA-256 is a unique fingerprint of this exact file. If even one byte is
                changed — by malware, a re-upload, or a modified copy — the fingerprint
                changes completely. Matching the hash below against the file you downloaded
                proves it is the genuine, unmodified Onyx build.
              </p>

              {/* Steps */}
              <h3
                className="font-heading text-white mb-4"
                style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>
                
                How to verify your download
              </h3>
              <ol className="space-y-4 mb-8">
                {[
                {
                  title: "Download only from the official domain",
                  body: "When announced, it will be shown in the popup after download. Never use mirrors, Discord attachments, or reuploads."
                },
                {
                  title: "Copy the SHA-256 hash from this page",
                  body: "Use the Copy button next to the hash below before you run anything."
                },
                {
                  title: "Check the hash of your downloaded file",
                  body: "Windows (PowerShell): Get-FileHash .\\Onyx.exe -Algorithm SHA256  ·  macOS (Terminal): shasum -a 256 Onyx.dmg  — compare the result to the hash on this page."
                },
                {
                  title: "Only run it if they match exactly",
                  body: "If the hashes differ, delete the file immediately and re-download from the official source."
                }].
                map((step, i) =>
                <li key={i} className="flex gap-4">
                    <span
                    className="flex-shrink-0 font-mono text-xs flex items-center justify-center"
                    style={{
                      width: "24px",
                      height: "24px",
                      border: "1px solid #1A1A1A",
                      backgroundColor: "#050505",
                      color: "#959595",
                      letterSpacing: "0.04em"
                    }}>
                    
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p
                      className="font-heading text-white mb-1"
                      style={{ fontWeight: 600, fontSize: "13px", letterSpacing: "-0.01em" }}>
                      
                        {step.title}
                      </p>
                      <p
                      className="font-mono"
                      style={{ color: "#959595", fontSize: "12px", lineHeight: 1.6, letterSpacing: "0.01em" }}>
                      
                        {step.body}
                      </p>
                    </div>
                  </li>
                )}
              </ol>

              {/* Code Signing & Authenticode */}
              <h3
                className="font-heading text-white mb-3 mt-8"
                style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>

                Code Signing & Authenticode Verification
              </h3>
              <p
                className="font-body mb-4"
                style={{ color: "#959595", fontSize: "13.5px", lineHeight: 1.7 }}>

                SHA-256 alone only confirms the file matches a known hash — it doesn't
                prove <em>who</em> signed it. At launch, Onyx goes further with four
                layers of verification:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                { label: "Authenticode Signature", body: "Verifies the binary is signed and the signature is valid (Windows) / code signature valid (macOS)." },
                { label: "Certificate Pinning", body: "Only accepts code signed by Onyx's own certificate — the SHA-256 thumbprint is pinned in the binary." },
                { label: "Full Chain Verification", body: "Validates the entire certificate chain to a trusted root, including revocation status." },
                { label: "Load-Time Re-Verification", body: "Re-checks every DLL's signature before loading — catches file-swap attacks between startup and load." },
                ].
                map((item, i) =>
                <li key={i} className="flex gap-3">
                  <span
                  className="flex-shrink-0 font-mono text-xs flex items-center justify-center"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "1px solid #1A1A1A",
                    backgroundColor: "#050505",
                    color: "#FFFFFF",
                    marginTop: "1px"
                  }}>

                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.5L4.5 9L10 3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <span
                    className="font-heading text-white"
                    style={{ fontWeight: 600, fontSize: "12.5px", letterSpacing: "-0.01em" }}>

                      {item.label}
                    </span>
                    <span
                    className="font-mono"
                    style={{ color: "#959595", fontSize: "12px", lineHeight: 1.6, letterSpacing: "0.01em" }}>

                      {" — "}{item.body}
                    </span>
                  </div>
                </li>
                )}
              </ul>
              <p
                className="font-body mb-2"
                style={{ color: "#3A3A3A", fontSize: "12px", lineHeight: 1.6 }}>

                If any layer fails, Onyx blocks its own launch and directs you to
                reinstall from the official source.
              </p>

              {/* Confirm checkbox */}
              <label
                className="flex items-start gap-3 cursor-pointer group"
                style={{ borderTop: "1px solid #1A1A1A", paddingTop: "20px" }}>
                
                <span
                  className="flex-shrink-0 flex items-center justify-center transition-sharp"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: confirmed ? "1px solid #FFFFFF" : "1px solid #3A3A3A",
                    backgroundColor: confirmed ? "#FFFFFF" : "transparent",
                    marginTop: "1px"
                  }}>
                  
                  {confirmed &&
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6.5L4.5 9L10 3" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                </span>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="sr-only"
                  aria-label="Confirm I have read and understand how to verify my download" />
                
                <span
                  className="font-body"
                  style={{ color: confirmed ? "#FFFFFF" : "#959595", fontSize: "13px", lineHeight: 1.6 }}>
                  
                  I have read and understand how to verify my download is safe before running it.
                </span>
              </label>
            </div>
          </div>

          {/* App size */}
          <p
            className="font-heading text-white mb-2"
            style={{ fontWeight: 700, fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: "-0.03em" }}>
            
            {fileSize}
          </p>
          <p className="font-mono text-xs mb-6" style={{ color: "#959595", letterSpacing: "0.1em" }}>
            WINDOWS · .ZIP · .EXE
          </p>

          {/* Download Button — Windows */}
          <div className="relative w-full max-w-lg mb-6">
            {/* Loading bar on top border */}
            {downloading &&
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 h-px transition-all duration-100"
              style={{
                width: `${progress}%`,
                backgroundColor: "#FFFFFF"
              }} />

            }
            <button
              onClick={handleDownload}
              disabled={downloading || !release && !releaseError || !confirmed && !done}
              aria-label={`Download Onyx Version ${VERSION} for Windows`}
              className="w-full flex items-center justify-center gap-4 font-heading uppercase focus:outline-white disabled:cursor-not-allowed"
              style={{
                backgroundColor: done ? "#0D0D0D" : confirmed ? "#FFFFFF" : "#0D0D0D",
                color: done ? "#FFFFFF" : confirmed ? "#050505" : "#3A3A3A",
                border: done ? "1px solid #1A1A1A" : confirmed ? "1px solid #FFFFFF" : "1px solid #1A1A1A",
                padding: "24px 48px",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.1em",
                minHeight: "72px"
              }}
              onMouseEnter={(e) => {
                if (!downloading && !done && confirmed) e.currentTarget.style.backgroundColor = "#E0E0E0";
              }}
              onMouseLeave={(e) => {
                if (!downloading && !done && confirmed) e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}>
              
              <Download size={18} aria-hidden="true" />
              {done ?
              "DOWNLOAD STARTED" :
              downloading ?
              `PREPARING — ${progress}%` :
              releaseError ?
              "UNAVAILABLE" :
              confirmed ?
              "DOWNLOAD ONYX FREE" :
              "CONFIRM ABOVE TO DOWNLOAD"}
            </button>
          </div>

          {/* SHA-256 Hash — Windows */}
          <div
            className="w-full max-w-lg mb-6"
            style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D", padding: "16px 20px" }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs mb-1" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
                  SHA-256 · WINDOWS
                </p>
                <p
                  className="font-mono text-xs truncate"
                  style={{ color: winHash ? "#959595" : "#3A3A3A", letterSpacing: "0.04em" }}
                  title={winHash || "Hash not available"}>
                  {winHash || "Not available"}
                </p>
              </div>
              {winHash &&
              <button
                onClick={() => copyHash(winHash, "windows")}
                className="flex-shrink-0 font-mono text-xs uppercase transition-sharp focus:outline-white"
                style={{
                  color: copiedHash === "windows" ? "#FFFFFF" : "#3A3A3A",
                  letterSpacing: "0.1em",
                  padding: "4px 8px",
                  border: "1px solid transparent"
                }}
                onMouseEnter={(e) => {e.currentTarget.style.color = "#959595";}}
                onMouseLeave={(e) => {if (copiedHash !== "windows") e.currentTarget.style.color = "#3A3A3A";}}>
                {copiedHash === "windows" ? "COPIED" : "COPY"}
              </button>
              }
            </div>
          </div>

          {/* macOS size */}
          <p
            className="font-heading text-white mb-2 mt-10"
            style={{ fontWeight: 700, fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: "-0.03em" }}>

            {macFileSize}
          </p>
          {/* macOS label */}
          <p className="font-mono text-xs mb-6" style={{ color: "#959595", letterSpacing: "0.1em" }}>
            MACOS · .ZIP · .DMG
          </p>

          {/* Download Button — macOS */}
          <div className="relative w-full max-w-lg mb-6">
            {macDownloading &&
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 h-px transition-all duration-100"
              style={{ width: `${macProgress}%`, backgroundColor: "#FFFFFF" }} />

            }
            <button
              onClick={handleMacDownload}
              disabled={macDownloading || !macRelease && !macReleaseError || !confirmed && !macDone}
              aria-label="Download Onyx for macOS"
              className="w-full flex items-center justify-center gap-4 font-heading uppercase focus:outline-white disabled:cursor-not-allowed"
              style={{
                backgroundColor: macDone ? "#0D0D0D" : confirmed ? "#FFFFFF" : "#0D0D0D",
                color: macDone ? "#FFFFFF" : confirmed ? "#050505" : "#3A3A3A",
                border: macDone ? "1px solid #1A1A1A" : confirmed ? "1px solid #FFFFFF" : "1px solid #1A1A1A",
                padding: "24px 48px",
                fontWeight: 800,
                fontSize: "16px",
                letterSpacing: "0.1em",
                minHeight: "72px"
              }}
              onMouseEnter={(e) => {if (!macDownloading && !macDone && confirmed) e.currentTarget.style.backgroundColor = "#E0E0E0";}}
              onMouseLeave={(e) => {if (!macDownloading && !macDone && confirmed) e.currentTarget.style.backgroundColor = "#FFFFFF";}}>
              
              <Download size={18} aria-hidden="true" />
              {macDone ?
              "DOWNLOAD STARTED" :
              macDownloading ?
              `PREPARING — ${macProgress}%` :
              macReleaseError ?
              "UNAVAILABLE" :
              confirmed ?
              "DOWNLOAD ONYX FREE" :
              "CONFIRM ABOVE TO DOWNLOAD"}
            </button>
          </div>

          {/* SHA-256 Hash — macOS */}
          <div
            className="w-full max-w-lg"
            style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D", padding: "16px 20px" }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs mb-1" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
                  SHA-256 · MACOS
                </p>
                <p
                  className="font-mono text-xs truncate"
                  style={{ color: macHash ? "#959595" : "#3A3A3A", letterSpacing: "0.04em" }}
                  title={macHash || "Hash not available"}>
                  {macHash || "Not available"}
                </p>
              </div>
              {macHash &&
              <button
                onClick={() => copyHash(macHash, "macos")}
                className="flex-shrink-0 font-mono text-xs uppercase transition-sharp focus:outline-white"
                style={{
                  color: copiedHash === "macos" ? "#FFFFFF" : "#3A3A3A",
                  letterSpacing: "0.1em",
                  padding: "4px 8px",
                  border: "1px solid transparent"
                }}
                onMouseEnter={(e) => {e.currentTarget.style.color = "#959595";}}
                onMouseLeave={(e) => {if (copiedHash !== "macos") e.currentTarget.style.color = "#3A3A3A";}}>
                {copiedHash === "macos" ? "COPIED" : "COPY"}
              </button>
              }
            </div>
          </div>

          {/* Warning */}
          <p
            className="mt-8 font-mono text-xs"
            style={{ color: "#3A3A3A", letterSpacing: "0.06em", maxWidth: "480px" }}>
            
            Never disable antivirus when downloading exe files. Onyx doesn't need you to disable antivirus.
          </p>
        </div>
      </div>

      {/* Safety Modal */}
      {showSafetyModal &&
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
        style={{ backgroundColor: "rgba(5,5,5,0.85)", backdropFilter: "blur(8px)" }}
        onClick={() => setShowSafetyModal(false)}>
        
          <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg"
          style={{
            backgroundColor: "#0D0D0D",
            border: "1px solid #1A1A1A",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.02), 0 24px 80px rgba(0,0,0,0.6)"
          }}>
          
            {/* Close */}
            <button
            onClick={() => setShowSafetyModal(false)}
            aria-label="Close"
            className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center transition-sharp"
            style={{ color: "#3A3A3A" }}
            onMouseEnter={(e) => {e.currentTarget.style.color = "#FFFFFF";}}
            onMouseLeave={(e) => {e.currentTarget.style.color = "#3A3A3A";}}>
            
              <X size={16} />
            </button>

            {/* Header strip */}
            <div
            className="flex items-center gap-3 px-8 pt-8 pb-6"
            style={{ borderBottom: "1px solid #1A1A1A" }}>
            
              <div
              className="flex items-center justify-center shrink-0"
              style={{ width: "40px", height: "40px", border: "1px solid #1A1A1A", backgroundColor: "#050505" }}>
              
                <ShieldCheck size={18} style={{ color: "#FFFFFF" }} />
              </div>
              <div>
                <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>
                  DOWNLOAD STARTED
                </p>
                <h3
                className="font-heading text-white"
                style={{ fontWeight: 700, fontSize: "20px", letterSpacing: "-0.03em" }}>
                
                  Verify Your Source
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-7">
              <p
              className="font-body mb-6"
              style={{ color: "#959595", fontSize: "14px", lineHeight: 1.6 }}>
              
                Your {modalPlatform === "mac" ? "macOS" : "Windows"} download has started. For your security, only run Onyx from official sources.
                Third-party reuploads may contain malware or modified binaries.
              </p>

              {/* Official source block */}
              <div
              className="mb-4"
              style={{ border: "1px solid #1A1A1A", backgroundColor: "#050505", padding: "16px 18px" }}>
              
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={12} style={{ color: "#FFFFFF" }} />
                  <span className="font-mono text-xs" style={{ color: "#FFFFFF", letterSpacing: "0.1em" }}>
                    OFFICIAL DOMAIN
                  </span>
                </div>
                <p className="font-mono text-sm" style={{ color: "#959595", letterSpacing: "0.02em" }}>
                  The safest place to download Onyx will be listed here.
                </p>
                <p className="font-mono text-xs mt-1" style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}>
                  Domain to be announced.
                </p>
              </div>

              {/* Warning block */}
              <div
              className="flex items-start gap-3"
              style={{ padding: "14px 16px", border: "1px solid #1A1A1A", backgroundColor: "#050505" }}>
              
                <AlertTriangle size={14} style={{ color: "#959595", marginTop: "2px", flexShrink: 0 }} />
                <p className="font-mono text-xs" style={{ color: "#959595", lineHeight: 1.6, letterSpacing: "0.02em" }}>
                  Never download Onyx from mirror sites, Discord attachments, or unverified links.
                  When in doubt, compare the SHA-256 hash above before running.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
            className="flex items-center justify-end gap-3 px-8 py-5"
            style={{ borderTop: "1px solid #1A1A1A" }}>
            
              <button
              onClick={() => setShowSafetyModal(false)}
              className="font-heading uppercase transition-sharp focus:outline-white"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#050505",
                border: "1px solid #FFFFFF",
                padding: "12px 28px",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em"
              }}
              onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = "#E0E0E0";}}
              onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = "#FFFFFF";}}>
              
                GOT IT
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}