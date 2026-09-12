import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const REPO = "bleachfanjled/Onyx-Executor";

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
    const release = releases.find(r => !r.draft) || releases[0];
    if (!release) {
      return Response.json({ error: "No release found" }, { status: 404 });
    }

    const asset = (release.assets || [])[0];
    if (!asset) {
      return Response.json({ error: "No downloadable asset found on the release" }, { status: 404 });
    }

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