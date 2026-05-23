import './App.css'

export default function App() {
  return (
    <main className="app">
      <div className="container">
        <section className="hero">
          <h1>React Starter Template</h1>
          <p>Minimal starter with separate CSS styling.</p>
        </section>

        <section className="cards">
          <article className="card">
            <h2>Fast Setup</h2>
            <p>
              Uses a clean component structure suitable for apps,
              dashboards, games, and tools.
            </p>
          </article>

          <article className="card">
            <h2>Modern Stack</h2>
            <p>
              Works well with Vite, React Router, Zustand,
              and TypeScript.
            </p>
          </article>
        </section>

        <section className="actions">
          <button className="primary-button">
            Get Started
          </button>

          <button className="secondary-button">
            Documentation
          </button>
        </section>
      </div>
    </main>
  )
}