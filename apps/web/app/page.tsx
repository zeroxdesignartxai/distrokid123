const features = [
  "Bulk ingest audio or ZIPs",
  "Auto-generate metadata and cover art",
  "Package releases into DistroKid-ready folders",
  "Label mode to respect artist slots"
];

const steps = [
  {
    title: "Import",
    description: "Drop tracks, folders, or ZIPs. We'll group releases by folder."
  },
  {
    title: "Generate",
    description: "Metadata + cover art jobs run automatically in the background."
  },
  {
    title: "Export",
    description: "Download a DistroKid-ready package with audio, art, and JSON metadata."
  }
];

export default function HomePage() {
  return (
    <main className="container">
      <header className="hero">
        <p className="tag">MVP scaffold</p>
        <h1>DistroKid Upload Assistant</h1>
        <p className="subtitle">
          Build bulk-ready releases without relying on a DistroKid upload API.
          Generate metadata, art, and structured exports in minutes.
        </p>
        <div className="hero-actions">
          <button className="primary">Create release</button>
          <button className="secondary">View exports</button>
        </div>
      </header>

      <section className="grid">
        {steps.map((step) => (
          <article key={step.title} className="card">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </section>

      <section className="feature-list">
        <h2>Why this MVP ships fast</h2>
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="cta">
        <div>
          <h2>Ready to import your catalog?</h2>
          <p>
            The API is ready for releases. The worker handles background jobs.
            The UI is a mobile-first scaffold you can extend.
          </p>
        </div>
        <button className="primary">Start bulk import</button>
      </section>
    </main>
  );
}
