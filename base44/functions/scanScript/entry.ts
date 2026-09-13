// scanScript — pattern-based malware scanner for shared Roblox Lua scripts.
//
// Two modes:
//   { code }          -> scan only, return result (used by the creator preview)
//   { script_id }     -> fetch the Script, scan it, update its safety fields (used by the workflow)
//
// This is static pattern matching — it does NOT execute the script.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const PATTERNS = [
  { id: "loadstring", regex: /loadstring\s*\(/gi, severity: "warning", message: "loadstring runs code from a string — can execute hidden payloads." },
  { id: "httpget", regex: /(?:game\s*:\s*)?(?:HttpGet|HttpPost|httpget)\s*\(/gi, severity: "warning", message: "Remote HTTP request — can download external code or send data out." },
  { id: "require_numeric", regex: /require\s*\(\s*\d{4,}/gi, severity: "warning", message: "Numeric require() loads a remote module by ID — verify the source." },
  { id: "getrawmetatable", regex: /getrawmetatable|setrawmetatable/gi, severity: "warning", message: "Metatable tampering — can bypass game protections." },
  { id: "hookfunction", regex: /hookfunction|hookmetamethod/gi, severity: "warning", message: "Function hooking — overrides game internals." },
  { id: "getfenv", regex: /getfenv|setfenv/gi, severity: "warning", message: "Environment manipulation — can hide malicious behavior." },
  { id: "writefile", regex: /writefile|readfile|appendfile|listfiles/gi, severity: "warning", message: "Filesystem access — can read or write local files." },
  { id: "setclipboard", regex: /setclipboard|getclipboard/gi, severity: "danger", message: "Clipboard access — can steal copied passwords or data." },
  { id: "discord_webhook", regex: /discord(?:app)?\.com\/api\/webhooks/gi, severity: "danger", message: "Discord webhook URL — common data exfiltration path." },
  { id: "long_hex", regex: /(?:\\x[0-9a-fA-F]{2}){16,}/g, severity: "warning", message: "Long hex escape sequence — possible obfuscated payload." },
  { id: "string_char_chain", regex: /string\.char\s*\([^)]{40,}\)/gi, severity: "warning", message: "Large string.char chain — possible obfuscation." },
  { id: "executor_api", regex: /\b(?:syn|fluxus|krnl|elysian|drawnewtab|setfpscap)\b/gi, severity: "info", message: "Executor-specific API — may not run on all executors." },
];

function scanCode(code) {
  const findings = [];
  for (const p of PATTERNS) {
    const matches = code.match(p.regex);
    if (matches && matches.length > 0) {
      findings.push({ id: p.id, severity: p.severity, message: p.message, count: matches.length });
    }
  }
  // Combo: loadstring + remote HTTP = classic remote code execution.
  if (/loadstring/i.test(code) && /(?:HttpGet|HttpPost|httpget)/i.test(code)) {
    findings.push({ id: "loadstring_remote_combo", severity: "danger", message: "loadstring + remote HTTP combo — classic remote code execution pattern.", count: 1 });
  }
  const score = findings.reduce((s, f) => {
    return s + (f.severity === "danger" ? 3 : f.severity === "warning" ? 1 : 0);
  }, 0);
  let status = "safe";
  if (score >= 6) status = "dangerous";
  else if (score >= 3) status = "flagged";
  return { status, score, findings };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const code = body.code;
    const scriptId = body.script_id;

    if (!code && !scriptId) {
      return Response.json({ error: "code or script_id is required" }, { status: 400 });
    }

    let codeToScan = code;
    if (!codeToScan && scriptId) {
      const script = await base44.asServiceRole.entities.Script.get(scriptId);
      codeToScan = script && script.code;
    }

    if (!codeToScan) {
      return Response.json({ error: "no code to scan" }, { status: 400 });
    }

    const result = scanCode(codeToScan);

    if (scriptId) {
      await base44.asServiceRole.entities.Script.update(scriptId, {
        safety_status: result.status,
        safety_score: result.score,
        findings: result.findings,
      });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}