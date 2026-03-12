const API_BASE = "https://url-shortner-production-b438.up.railway.app";

export async function createShortUrl(originalUrl) {
  const res = await fetch(`${API_BASE}/api/urls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to shorten URL");
  }

  return res.json();
}

export async function getStats(code) {
  const res = await fetch(`${API_BASE}/api/urls/${code}`);

  if (!res.ok) {
    throw new Error("Stats not found");
  }

  return res.json();
}