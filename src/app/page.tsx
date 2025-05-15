export default function HomePage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">Welcome to Our Club</h1>
          <p className="py-6 text-lg">Discover events, meet the team, and access member resources.</p>
          <a href="/events" className="btn btn-primary">View Events</a>
        </div>
      </div>
    </div>
  )
}
