export const ROOM_TYPES = [
  { value: "living", label: "Living Room" },
  { value: "bed", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "dining", label: "Dining Room" },
  { value: "bathroom", label: "Bathroom" },
  { value: "home_office", label: "Home Office" },
  { value: "outdoor", label: "Outdoor" },
  { value: "kids_room", label: "Kids Room" },
] as const;

export const STYLES = [
  { value: "modern", label: "Modern" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "industrial", label: "Industrial" },
  { value: "midcentury", label: "Mid-Century" },
  { value: "luxury", label: "Luxury" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "coastal", label: "Coastal" },
  { value: "standard", label: "Standard" },
] as const;

export type RoomType = (typeof ROOM_TYPES)[number]["value"];
export type Style = (typeof STYLES)[number]["value"];

const ALT_TO_ROOM: [RegExp, RoomType][] = [
  [/front\s*view|rear\s*view|exterior|backyard|patio|deck|porch/i, "outdoor"],
  [/living\s*room|family\s*room|great\s*room/i, "living"],
  [/kitchen/i, "kitchen"],
  [/dining/i, "dining"],
  [/bed\s*room|main\s*bedroom|master\s*bedroom/i, "bed"],
  [/bath\s*room|main\s*bathroom|master\s*bathroom/i, "bathroom"],
  [/office|study/i, "home_office"],
  [/kid|child|nursery/i, "kids_room"],
  [/closet/i, "bed"],
];

export function detectRoomType(alt: string): RoomType {
  for (const [pattern, roomType] of ALT_TO_ROOM) {
    if (pattern.test(alt)) return roomType;
  }
  return "living";
}

export interface StageResult {
  result_image_url: string;
  render_id: string;
}

export async function stagePhoto(
  imageUrl: string,
  roomType: RoomType,
  style: Style,
): Promise<StageResult> {
  const res = await fetch("/api/stage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: imageUrl,
      room_type: roomType,
      style,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error ?? `Staging failed (${res.status})`);
  }

  return res.json();
}
