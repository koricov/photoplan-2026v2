import type { VercelRequest, VercelResponse } from "@vercel/node";

const VSAI_URL = "https://api.virtualstagingai.app/v1/render/create";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.VSAI_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    return res.status(500).json({ error: "VSAI API key not configured" });
  }

  const { image_url, room_type, style } = req.body ?? {};

  if (!image_url || typeof image_url !== "string") {
    return res.status(400).json({ error: "image_url is required" });
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
