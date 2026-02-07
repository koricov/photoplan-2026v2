import type { Photo } from "../types/photo";

const photoEntries = [
  { file: "01-front-view.jpg", alt: "Front view" },
  { file: "02-front-view-2.jpg", alt: "Front view, angled" },
  { file: "03-living-room.jpg", alt: "Living room with entry" },
  { file: "04-living-room-2.jpg", alt: "Living room and dining room" },
  { file: "05-living-room-vs.jpg", alt: "Living room, virtually staged" },
  { file: "06-living-room-3.jpg", alt: "Living room fireplace" },
  { file: "07-kitchen.jpg", alt: "Kitchen with blue tile backsplash" },
  { file: "08-kitchen-2.jpg", alt: "Kitchen galley view" },
  { file: "09-kitchen-3.jpg", alt: "Kitchen stove area" },
  { file: "10-kitchen-vs.jpg", alt: "Kitchen, virtually staged" },
  { file: "11-family-room.jpg", alt: "Family room hallway" },
  { file: "12-family-room-2.jpg", alt: "Family room" },
  { file: "13-family-room-3.jpg", alt: "Family room fireplace" },
  { file: "14-sun-room.jpg", alt: "Sun room entry" },
  { file: "15-sun-room-2.jpg", alt: "Sun room" },
  { file: "16-laundry-room.jpg", alt: "Laundry room" },
  { file: "17-main-bedroom.jpg", alt: "Main bedroom" },
  { file: "18-main-bedroom-vs.jpg", alt: "Main bedroom, virtually staged" },
  { file: "19-main-bedroom-2.jpg", alt: "Main bedroom, second view" },
  { file: "20-main-bathroom.jpg", alt: "Main bathroom" },
  { file: "21-bedroom.jpg", alt: "Bedroom with corner windows" },
  { file: "22-bedroom-2.jpg", alt: "Bedroom" },
  { file: "23-bedroom-3.jpg", alt: "Bedroom" },
  { file: "24-bedroom-4.jpg", alt: "Bedroom with closet" },
  { file: "25-bathroom.jpg", alt: "Bathroom" },
  { file: "26-rear-view.jpg", alt: "Rear view" },
  { file: "27-rear-view-2.jpg", alt: "Garage" },
];

const webpName = (file: string) => file.replace(".jpg", ".webp");

export const photos: Photo[] = photoEntries.map((entry, i) => ({
  id: i + 1,
  thumbUrl: `/photos/thumb/${webpName(entry.file)}`,
  fullUrl: `/photos/full/${webpName(entry.file)}`,
  alt: entry.alt,
  aspectRatio: "4 / 3",
}));
