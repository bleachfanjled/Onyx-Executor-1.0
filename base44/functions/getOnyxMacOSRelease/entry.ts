import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const REPO = "bleachfanjled/Onyx-Executor-v1.0";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("github");

    const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Onyx-Website"
      }
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to fetch releases from GitHub" }, { status: 502 });
    }

    const releases = await res.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return Response.json({ error: "No release found" }, { status: 404 });
    }

    // Sort by created_at descending so the newest release is first
    const sorted = [...releases].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Pick the newest non-draft release
    const release = sorted.find(r => !r.draft) || sorted[0];
    if (!release) {
      return Response.json({ error: "No release found" }, { status: 404 });
    }

    const assets = release.assets || [];
    if (assets.length === 0) {
      return Response.json({ error: "No downloadable asset found on the release" }, { status: 404 });
    }

    // Pick the macOS asset: name contains "macos" or "mac", else .dmg, else largest overall
    const macAssets = assets.filter(a => {
      const n = a.name.toLowerCase();
      return n.includes("macos") || n.includes("mac");
    });
    const dmgs = assets.filter(a => a.name.toLowerCase().endsWith(".dmg"));
    const pool = macAssets.length > 0 ? macAssets : dmgs.length > 0 ? dmgs : assets;
    const asset = pool.reduce((best, cur) =>
      !best || (cur.size || 0) > (best.size || 0) ? cur : best, null);

    // Try to extract SHA-256 from the release body (description).
    // Include "SHA-256 (macOS): <64-hex-chars>" in the release description.
    let sha256 = null;
    if (release.body) {
      const match = release.body.match(/SHA-256\s*\(?\s*[Mm]ac[Oo][Ss]?\s*\)?\s*[:\s]*\s*([a-fA-F0-9]{64})/);
      if (match) sha256 = match[1];
    }

    return Response.json({
      downloadUrl: asset.browser_download_url,
      version: release.tag_name,
      releaseName: release.name,
      assetName: asset.name,
      sizeMb: (asset.size / 1024 / 1024).toFixed(1),
      sha256
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}