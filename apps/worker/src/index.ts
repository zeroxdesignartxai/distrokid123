import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { JOB_TYPES, type JobType } from "@distro/shared";

const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), "data", "dev.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

const updateJob = db.prepare(
  "UPDATE jobs SET status = ?, result_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
);
const updateReleaseMetadata = db.prepare(
  "UPDATE releases SET genre = ?, language = ?, explicit = ? WHERE id = ?"
);
const updateReleaseStatus = db.prepare("UPDATE releases SET status = ? WHERE id = ?");

const processJob = (job: { id: string; release_id: string; job_type: JobType }) => {
  if (!JOB_TYPES.includes(job.job_type)) {
    updateJob.run("FAILED", JSON.stringify({ error: "Unknown job type" }), job.id);
    return;
  }

  if (job.job_type === "GENERATE_METADATA") {
    updateReleaseMetadata.run("Pop", "English", 0, job.release_id);
    updateJob.run("COMPLETED", JSON.stringify({ genre: "Pop", language: "English" }), job.id);
    return;
  }

  if (job.job_type === "GENERATE_COVER") {
    updateJob.run("COMPLETED", JSON.stringify({ cover: "placeholder" }), job.id);
  }
};

const finalizeRelease = (releaseId: string) => {
  const pending = db
    .prepare("SELECT COUNT(1) as count FROM jobs WHERE release_id = ? AND status != 'COMPLETED'")
    .get(releaseId) as { count: number };
  if (pending.count === 0) {
    updateReleaseStatus.run("READY", releaseId);
  }
};

const poll = () => {
  const jobs = db
    .prepare("SELECT id, release_id, job_type FROM jobs WHERE status = 'PENDING' ORDER BY created_at ASC")
    .all() as { id: string; release_id: string; job_type: JobType }[];

  jobs.forEach((job) => {
    db.prepare("UPDATE jobs SET status = 'PROCESSING', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(job.id);
    processJob(job);
    finalizeRelease(job.release_id);
  });
};

console.log("Worker running. Watching for jobs...");
setInterval(poll, 2000);
