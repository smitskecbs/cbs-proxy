export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const init = {
      method: req.method,
      headers: { "content-type": req.headers["content-type"] || "application/json" },
    };
    if (req.method !== "GET" && req.body) {
      init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }
    const r = await fetch(url, init);
    const ct = r.headers.get("content-type") || "application/json";
    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("content-type", ct);
    res.status(r.status).send(buf);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
