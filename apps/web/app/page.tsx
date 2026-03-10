const STEPS = [
  {
    title: "Import",
    description:
      "Ingest audio files and parse track metadata automatically from filenames.",
  },
  {
    title: "Generate",
    description:
      "Queue metadata and cover-art generation jobs processed by the background worker.",
  },
  {
    title: "Export",
    description:
      "Package releases into DistroKid-ready bundles for upload.",
  },
];

const FEATURES = [
  "Bulk ingest with automatic track numbering",
  "Background job queue for metadata & cover art",
  "SQLite-backed local storage – no cloud required",
  "Export-ready bundle packaging",
];

export default function HomePage() {
  return (
    <main className="container">
      {/* Hero */}
      <section className="hero">
        <p className="tag">MVP Scaffold</p>
        <h1>DistroKid Upload Assistant</h1>
        <p className="subtitle">
          Build bulk-ready releases without relying on a DistroKid upload API.
          Generate metadata, art, and structured exports in minutes.
        </p>
        <div className="hero-actions">
          <button className="primary">Get Started</button>
          <button className="secondary">View Releases</button>
        </div>
      </section>

      {/* Workflow steps */}
      <div className="grid">
        {STEPS.map((step) => (
          <div key={step.title} className="card">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <section className="feature-list">
        <h2>Why this MVP ships fast</h2>
        <ul>
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <div className="cta">
        <p>Ready to import your catalog?</p>
        <button className="primary">Start Importing</button>
      </div>
    </main>
  );
}
