import { z } from "zod";

export const TrackInputSchema = z.object({
  trackNumber: z.number().int().min(1),
  title: z.string().min(1),
  explicit: z.boolean().optional().default(false)
});

export const ReleaseCreateSchema = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1),
  tracks: z.array(TrackInputSchema).min(1)
});

export type TrackInput = z.infer<typeof TrackInputSchema>;
export type ReleaseCreateInput = z.infer<typeof ReleaseCreateSchema>;

export type JobType = "GENERATE_METADATA" | "GENERATE_COVER";

export const JOB_TYPES: JobType[] = ["GENERATE_METADATA", "GENERATE_COVER"];

export const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .trim();

export const parseTrackFilename = (filename: string): { trackNumber: number; title: string } | null => {
  const match = filename.match(/^(\d{1,2})[\s._-]*(.+)\.[a-z0-9]+$/i);
  if (!match) return null;
  const trackNumber = Number(match[1]);
  if (!Number.isInteger(trackNumber) || trackNumber <= 0) return null;
  const titlePart = match[2];
  if (!titlePart) return null;
  return {
    trackNumber,
    title: titlePart.replace(/[_-]+/g, " ").trim()
  };
};

export const normalizeTitle = (title: string): string => title.replace(/\s+/g, " ").trim();
