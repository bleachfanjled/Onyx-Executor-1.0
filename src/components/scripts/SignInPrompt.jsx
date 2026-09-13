import { Lock, X, ArrowRight } from "lucide-react";

export default function SignInPrompt({ open, onClose, onSignIn }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(5,5,5,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm"
        style={{
          backgroundColor: "#0D0D0D",
          border: "1px solid #1A1A1A",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 transition-sharp"
          style={{ color: "#3A3A3A", lineHeight: 0 }}
        >
          <X size={14} />
        </button>

        {/* lock mark */}
        <div className="flex justify-center pt-10 pb-6">
          <div
            className="flex items-center justify-center"
            style={{
              width: "52px",
              height: "52px",
              border: "1px solid #1A1A1A",
              backgroundColor: "#050505",
            }}
          >
            <Lock size={20} style={{ color: "#FFFFFF" }} />
          </div>
        </div>

        {/* copy */}
        <div className="px-8 pb-8 text-center">
          <h2
            className="font-heading text-white"
            style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}
          >
            Sign in to continue
          </h2>
          <p
            className="mt-3 mx-auto"
            style={{ color: "#959595", fontSize: "13px", lineHeight: 1.7, maxWidth: "260px" }}
          >
            You need to be signed in to review and download scripts from the Onyx community hub.
          </p>

          {/* actions */}
          <div className="mt-8 flex flex-col gap-2">
            <button
              onClick={onSignIn}
              className="w-full flex items-center justify-center gap-2 font-heading uppercase transition-sharp"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#050505",
                border: "1px solid #FFFFFF",
                padding: "13px 20px",
                fontSize: "12px",
                letterSpacing: "0.12em",
                fontWeight: 700,
              }}
            >
              SIGN IN
              <ArrowRight size={13} />
            </button>
            <button
              onClick={onClose}
              className="w-full font-mono uppercase transition-sharp"
              style={{
                backgroundColor: "transparent",
                color: "#959595",
                border: "1px solid #1A1A1A",
                padding: "13px 20px",
                fontSize: "11px",
                letterSpacing: "0.12em",
              }}
            >
              NOT NOW
            </button>
          </div>

          <p
            className="mt-6 font-mono"
            style={{ color: "#3A3A3A", fontSize: "10px", letterSpacing: "0.06em", lineHeight: 1.6 }}
          >
            Your account keeps ratings trusted and downloads tracked.
          </p>
        </div>
      </div>
    </div>
  );
}