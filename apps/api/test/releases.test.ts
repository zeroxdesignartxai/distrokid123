import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import { buildServer } from "../src/server";

const dbPath = path.join(process.cwd(), "data", "test.sqlite");

const removeDb = () => {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
};

describe("release API", () => {
  beforeEach(() => {
    process.env.DB_PATH = dbPath;
    removeDb();
  });

  afterEach(() => {
    removeDb();
  });

  it("creates a release", async () => {
    const app = buildServer();
    const payload = {
      title: "Summer EP",
      artistName: "Nova",
      tracks: [
        { trackNumber: 1, title: "Intro" },
        { trackNumber: 2, title: "Sunset" }
      ]
    };

    const response = await request(app.server).post("/api/releases").send(payload);
    expect(response.status).toBe(201);
    expect(response.body.tracks).toHaveLength(2);
  });

  it("lists releases", async () => {
    const app = buildServer();
    await request(app.server).post("/api/releases").send({
      title: "First Single",
      artistName: "Nova",
      tracks: [{ trackNumber: 1, title: "Only One" }]
    });

    const response = await request(app.server).get("/api/releases");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("First Single");
  });
});
