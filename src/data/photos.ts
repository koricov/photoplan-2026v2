import type { Photo } from "../types/photo";

const photoEntries = [
  { file: "01-front-view.jpg", alt: "Front view" },
  { file: "02-living-room.jpg", alt: "Living room" },
  { file: "03-living-room-2.jpg", alt: "Living room with kitchen view" },
  { file: "04-dining-room.jpg", alt: "Dining room" },
  { file: "05-kitchen.jpg", alt: "Kitchen" },
  { file: "06-kitchen-2.jpg", alt: "Kitchen pantry nook" },
  { file: "07-kitchen-3.jpg", alt: "Kitchen with stove" },
  { file: "08-kitchen-4.jpg", alt: "Kitchen with refrigerator and laundry" },
  { file: "09-main-bedroom.jpg", alt: "Main bedroom" },
  { file: "10-main-bedroom-2.jpg", alt: "Main bedroom, second view" },
  { file: "11-main-bathroom.jpg", alt: "Main bathroom with double vanity" },
  { file: "12-bedroom.jpg", alt: "Bedroom" },
  { file: "13-closet.jpg", alt: "Walk-in closet" },
  { file: "14-bathroom.jpg", alt: "Bathroom with tub" },
  { file: "15-rear-view.jpg", alt: "Rear view" },
];

const webpName = (file: string) => file.replace(".jpg", ".webp");

export const photos: Photo[] = photoEntries.map((entry, i) => ({
  id: i + 1,
  thumbUrl: `/photos/thumb/${webpName(entry.file)}`,
  fullUrl: `/photos/full/${webpName(entry.file)}`,
  alt: entry.alt,
  aspectRatio: "4 / 3",
}));
