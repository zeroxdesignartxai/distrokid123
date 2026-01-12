import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { ReleaseCreateSchema } from "@distro/shared";
import { getDb, runMigrations } from "../db";

const serializeRelease = (row: Record<string, unknown>) => ({
  id: row.id,
  title: row.title,
  artistName: row.artist_name,
  genre: row.genre ?? null,
  language: row.language ?? null,
  explicit: Boolean(row.explicit),
  status: row.status,
  createdAt: row.created_at
});

export const releaseRoutes = async (app: FastifyInstance) => {
  const db = getDb();
  runMigrations(db);

  app.get("/", async () => {
    const releases = db.prepare("SELECT * FROM releases ORDER BY created_at DESC").all();
    const tracks = db.prepare("SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC");
    return releases.map((release) => ({
      ...serializeRelease(release as Record<string, unknown>),
      tracks: tracks.all((release as { id: string }).id).map((track) => ({
        id: (track as { id: string }).id,
        trackNumber: (track as { track_number: number }).track_number,
        title: (track as { title: string }).title,
        explicit: Boolean((track as { explicit: number }).explicit)
      }))
    }));
  });

  app.get("/:id", async (request, reply) => {
    const release = db
      .prepare("SELECT * FROM releases WHERE id = ?")
      .get((request.params as { id: string }).id);
    if (!release) {
      reply.status(404).send({ error: "Release not found" });
      return;
    }

    const tracks = db
      .prepare("SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC")
      .all((release as { id: string }).id);

    const jobs = db
      .prepare("SELECT * FROM jobs WHERE release_id = ? ORDER BY created_at ASC")
      .all((release as { id: string }).id);

    return {
      ...serializeRelease(release as Record<string, unknown>),
      tracks: tracks.map((track) => ({
        id: (track as { id: string }).id,
        trackNumber: (track as { track_number: number }).track_number,
        title: (track as { title: string }).title,
        explicit: Boolean((track as { explicit: number }).explicit)
      })),
      jobs: jobs.map((job) => ({
        id: (job as { id: string }).id,
        type: (job as { job_type: string }).job_type,
        status: (job as { status: string }).status,
        result: (job as { result_json: string | null }).result_json
      }))
    };
  });

  app.post("/", async (request, reply) => {
    const parsed = ReleaseCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      reply.status(400).send({ error: parsed.error.flatten() });
      return;
    }

    const { title, artistName, tracks } = parsed.data;
    const releaseId = randomUUID();

    const insertRelease = db.prepare(
      "INSERT INTO releases (id, title, artist_name, status) VALUES (?, ?, ?, 'DRAFT')"
    );
    const insertTrack = db.prepare(
      "INSERT INTO tracks (id, release_id, track_number, title, explicit) VALUES (?, ?, ?, ?, ?)"
    );
    const insertJob = db.prepare(
      "INSERT INTO jobs (id, release_id, job_type, status) VALUES (?, ?, ?, 'PENDING')"
    );

    const insertTransaction = db.transaction(() => {
      insertRelease.run(releaseId, title, artistName);
      tracks.forEach((track) => {
        insertTrack.run(randomUUID(), releaseId, track.trackNumber, track.title, track.explicit ? 1 : 0);
      });
      ["GENERATE_METADATA", "GENERATE_COVER"].forEach((jobType) => {
        insertJob.run(randomUUID(), releaseId, jobType);
      });
    });

    insertTransaction();

    const release = db.prepare("SELECT * FROM releases WHERE id = ?").get(releaseId);
    const releaseTracks = db
      .prepare("SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC")
      .all(releaseId);

    reply.status(201).send({
      ...serializeRelease(release as Record<string, unknown>),
      tracks: releaseTracks.map((track) => ({
        id: (track as { id: string }).id,
        trackNumber: (track as { track_number: number }).track_number,
        title: (track as { title: string }).title,
        explicit: Boolean((track as { explicit: number }).explicit)
      }))
    });
  });
};
