import type { VercelRequest, VercelResponse } from "@vercel/node";

const VSAI_URL = "https://api.virtualstagingai.app/v1/render/create";

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window per IP

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

const VALID_ROOM_TYPES = new Set([
  "living",
  "bed",
  "kitchen",
  "dining",
  "bathroom",
  "home_office",
  "outdoor",
  "kids_room",
]);

const VALID_STYLES = new Set([
  "modern",
  "scandinavian",
  "industrial",
  "midcentury",
  "luxury",
  "farmhouse",
  "coastal",
  "standard",
]);

const ALLOWED_ORIGINS = [
  "https://photoplan-2026v2.vercel.app",
  "https://photoplan-2026v2-kori-covrigarus-projects.vercel.app",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  const apiKey = process.env.VSAI_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return res.status(500).json({ error: "VSAI API key not configured" });
  }

  const { image_url, room_type, style } = req.body ?? {};

  if (!image_url || typeof image_url !== "string") {
    return res.status(400).json({ error: "image_url is required" });
  }

  const isAllowedOrigin = ALLOWED_ORIGINS.some((origin) => image_url.startsWith(origin + "/"));
  if (!isAllowedOrigin) {
    return res.status(403).json({ error: "image_url must be from an allowed domain" });
  }
  if (!room_type || !VALID_ROOM_TYPES.has(room_type)) {
    return res.status(400).json({ error: "Invalid room_type" });
  }
  if (!style || !VALID_STYLES.has(style)) {
    return res.status(400).json({ error: "Invalid style" });
  }

  try {
    const response = await fetch(VSAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${apiKey}`,
      },
      body: JSON.stringify({
        image_url,
        room_type,
        style,
        wait_for_completion: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(response.status)
        .json({ error: `VSAI API error: ${text}` });
    }

    const data = (await response.json()) as {
      result_image_url: string;
      render_id: string;
    };
    return res.status(200).json({
      result_image_url: data.result_image_url,
      render_id: data.render_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
