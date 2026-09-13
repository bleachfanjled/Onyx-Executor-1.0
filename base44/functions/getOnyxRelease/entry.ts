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

    // Pick the Windows asset: name contains "windows", else largest .exe, else largest overall
    const winAssets = assets.filter(a => a.name.toLowerCase().includes("windows"));
    const exes = assets.filter(a => a.name.toLowerCase().endsWith(".exe"));
    const pool = winAssets.length > 0 ? winAssets : exes.length > 0 ? exes : assets;
    const asset = pool.reduce((best, cur) =>
      !best || (cur.size || 0) > (best.size || 0) ? cur : best, null);

    return Response.json({
      downloadUrl: asset.browser_download_url,
      version: release.tag_name,
      releaseName: release.name,
      assetName: asset.name,
      sizeMb: (asset.size / 1024 / 1024).toFixed(1)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}