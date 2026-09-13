import React from "react";

const ONYX_ICON = "https://media.base44.com/images/public/6a333172d2474d3b422c32ed/8a783d050_ChatGPTImageSep122026at10_10_16PM.png";

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <img
        src={ONYX_ICON}
        alt="Onyx"
        style={{
          width: "16px",
          height: "16px",
          animation: "onyxThinkIcon 1.5s ease-in-out infinite",
        }}
      />
      <span
        style={{
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          animation: "onyxThinkText 1.5s ease-in-out infinite",
        }}
      >
        thinking
      </span>
      <style>{`
        @keyframes onyxThinkIcon {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes onyxThinkText {
          0%, 100% { color: #FFFFFF; }
          50% { color: #3A3A3A; }
        }
      `}</style>
    </div>
  );
}